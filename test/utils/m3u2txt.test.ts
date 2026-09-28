import { describe, it, expect } from 'vitest';
import { m3u2txt } from '../../src/utils/m3u2txt';

describe('m3u2txt', () => {
  it('should convert m3u array to txt format by group', () => {
    const m3u = [
      '#EXTM3U',
      '#EXTINF:-1 tvg-id="cctv1" group-title="央视",CCTV-1 综合',
      'https://example.com/cctv1',
      '#EXTINF:-1 tvg-id="cctv2" group-title="央视",CCTV-2 财经',
      'https://example.com/cctv2',
      '#EXTINF:-1 tvg-id="btv1" group-title="北京",北京卫视',
      'https://example.com/btv1',
    ];
    const txt = m3u2txt(m3u);
    expect(txt).toContain('央视,#genre#');
    expect(txt).toContain('北京,#genre#');
    expect(txt).toContain('CCTV-1_综合,https://example.com/cctv1');
    expect(txt).toContain('CCTV-2_财经,https://example.com/cctv2');
    expect(txt).toContain('北京卫视,https://example.com/btv1');
  });

  it('should use Undefined when no group-title', () => {
    const m3u = ['#EXTM3U', '#EXTINF:-1,Custom Channel', 'https://example.com/custom'];
    const txt = m3u2txt(m3u);
    expect(txt).toContain('Undefined,#genre#');
    expect(txt).toContain('Custom_Channel,https://example.com/custom');
  });
});
