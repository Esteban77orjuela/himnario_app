import { isDarkMode } from '../useIsDarkMode';

describe('isDarkMode', () => {
  it('returns false when system is light', () => {
    expect(isDarkMode('system', 'light')).toBe(false);
  });

  it('returns true when system is dark', () => {
    expect(isDarkMode('system', 'dark')).toBe(true);
  });

  it('returns true when theme is dark regardless of system', () => {
    expect(isDarkMode('dark', 'light')).toBe(true);
  });

  it('returns false when theme is light regardless of system', () => {
    expect(isDarkMode('light', 'dark')).toBe(false);
  });

  it('handles null system scheme as light', () => {
    expect(isDarkMode('system', null)).toBe(false);
  });

  it('returns true when theme is system and system is dark', () => {
    expect(isDarkMode('system', 'dark')).toBe(true);
  });
});
