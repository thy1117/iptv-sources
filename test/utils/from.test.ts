import { describe, it, expect } from 'vitest';
import { get_from_info } from '../../src/utils/from';

describe('get_from_info', () => {
  it('should match known host and return corresponding name', () => {
    expect(get_from_info('https://sn.chinamobile.com/path')).toBe('中国移动陕西');
    expect(get_from_info('https://cctv.com/live')).toBe('CCTV');
    expect(get_from_info('https://raw.githubusercontent.com/foo/bar')).toBe('Github Raw');
  });

  it('IPv4 direct link should return "IPv4 直链"', () => {
    expect(get_from_info('http://192.168.1.1/live')).toBe('IPv4 直链');
    expect(get_from_info('https://10.0.0.1:8080/path')).toBe('IPv4 直链');
  });

  it('IPv6 direct link should return "IPv6 直链"', () => {
    expect(get_from_info('http://[::1]/live')).toBe('IPv6 直链');
    expect(get_from_info('https://[2001:db8::1]/path')).toBe('IPv6 直链');
  });

  it('unknown host should return host part', () => {
    expect(get_from_info('https://unknown.example.com/path')).toBe('unknown.example.com');
  });
});
