import { describe, it, expect, vi } from 'vitest';
import { Collector, collectM3uSource } from '../../src/utils/collector';

describe('Collector', () => {
  it('should collect key-value pairs and deduplicate', () => {
    const c = Collector();
    c.collect('a', 'url1');
    c.collect('a', 'url2');
    c.collect('a', 'url1');
    c.collect('b', 'url3');
    const result = c.result();
    expect(result.get('a')).toEqual(['url1', 'url2']);
    expect(result.get('b')).toEqual(['url3']);
  });

  it('should skip key when keyFilter returns true', () => {
    const c = Collector((k) => k === 'skip');
    c.collect('skip', 'url1');
    c.collect('ok', 'url2');
    const result = c.result();
    expect(result.has('skip')).toBe(false);
    expect(result.get('ok')).toEqual(['url2']);
  });

  it('should skip value when valueFilter returns true', () => {
    const c = Collector(undefined, (v) => v.startsWith('http://'));
    c.collect('a', 'http://x.com');
    c.collect('a', 'https://y.com');
    const result = c.result();
    expect(result.get('a')).toEqual(['https://y.com']);
  });

  it('should collect all when no filter', () => {
    const c = Collector();
    c.collect('k1', 'v1');
    c.collect('k2', 'v2');
    const result = c.result();
    expect(result.size).toBe(2);
    expect(result.get('k1')).toEqual(['v1']);
    expect(result.get('k2')).toEqual(['v2']);
  });
});

describe('collectM3uSource', () => {
  it('should call fn with id and url', () => {
    const fn = vi.fn();
    collectM3uSource(
      '#EXTINF:-1 tvg-id="cctv1" group-title="央视",CCTV-1 综合',
      'https://example.com/cctv1',
      fn
    );
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(expect.any(String), 'https://example.com/cctv1');
  });
});
