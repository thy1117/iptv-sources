import { describe, it, expect } from 'vitest';
import { trimAny } from '../../src/utils/trim';

describe('trimAny', () => {
  it('trim string', () => {
    expect(trimAny('  abc  ')).toBe('abc');
  });

  it('trim array of strings', () => {
    expect(trimAny(['  a  ', ' b '])).toEqual(['a', 'b']);
  });

  it('trim object values', () => {
    expect(trimAny({ name: '  x  ' })).toEqual({ name: 'x' });
  });

  it('return non-string as-is', () => {
    expect(trimAny(1)).toBe(1);
  });
});
