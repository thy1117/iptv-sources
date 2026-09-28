"""Strict sampled 1080p gate. Requires ffprobe; never trusts playlist labels."""
import concurrent.futures
import json
import os
from pathlib import Path
import subprocess
import time

ROOT = Path('m3u')

def qualifies(data):
    streams = data.get('streams', [])
    frames = data.get('frames', [])
    return (len(streams) == 1 and streams[0].get('width') == 1920
            and streams[0].get('height') == 1080
            and streams[0].get('field_order') == 'progressive'
            and len(frames) >= 25
            and all(f.get('width') == 1920 and f.get('height') == 1080
                    and f.get('interlaced_frame') == 0 for f in frames))

def probe(url):
    command = ['ffprobe', '-v', 'error', '-rw_timeout', '10000000',
               '-select_streams', 'v:0', '-read_intervals', '%+4',
               '-show_streams', '-show_frames', '-show_entries',
               'stream=width,height,field_order,codec_name:frame=width,height,interlaced_frame',
               '-of', 'json', url]
    try:
        result = subprocess.run(command, capture_output=True, timeout=22)
        data = json.loads(result.stdout)
        return result.returncode == 0 and qualifies(data), data.get('streams', [])
    except (subprocess.TimeoutExpired, ValueError):
        return False, []

def main():
    entries = {}
    # Domestic lists only: global all.m3u is deliberately excluded.
    for name in ('hotel_tvn', 'cn', 'youhun'):
        file = ROOT / (name + '.m3u')
        if not file.exists():
            continue
        metadata = None
        for line in file.read_text().splitlines():
            if line.startswith('#EXTINF:'):
                metadata = line
            elif line.startswith(('http://', 'https://')) and metadata:
                entries.setdefault(line.strip(), metadata)
                metadata = None
    def check(item):
        url, label = item
        ok, stream = probe(url)
        if ok:
            time.sleep(2)
            ok, stream = probe(url)
        return {'url': url, 'label': label, 'accepted': ok, 'stream': stream}
    results = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        for result in pool.map(check, entries.items()):
            results.append(result)
            print(f"Checked {len(results)}/{len(entries)} accepted={result['accepted']}", flush=True)
    accepted = [r for r in results if r['accepted']]
    playlist = ['#EXTM3U']
    for item in accepted:
        playlist.extend([item['label'], item['url']])
    (ROOT / '1080p.m3u').write_text('\n'.join(playlist) + '\n')
    report = {'checked_at': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
              'tested': len(results), 'accepted': len(accepted),
              'scope': 'hotel_tvn,cn,youhun; two short decoding samples, not a long-term guarantee',
              'results': results}
    (ROOT / '1080p-report.json').write_text(json.dumps(report, ensure_ascii=False))
    print(f"1080p result: {len(accepted)}/{len(results)}")
    if not entries:
        raise SystemExit('No domestic inputs found')

if __name__ == '__main__':
    main()
