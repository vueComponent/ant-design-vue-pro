import isMobile, { isMobileResult } from '../';

describe('Other Mobile Devices', () => {
  let mobile: isMobileResult;
  let userAgent: string;

  describe('BlackBerry 10', () => {
    beforeEach(() => {
      userAgent =
        'Mozilla/5.0 (BB10; Touch) AppleWebKit/537.35+ (KHTML, like Gecko) Version/10.2.0.1791 Mobile Safari/537.35+';
      mobile = isMobile(userAgent);
    });

    test('should not be a Chrome device', () => {
      expect(mobile.other.chrome).not.toBe(true);
    });

    test('should be a BlackBerry 10 device', () => {
      expect(mobile.other.blackberry10).toBe(true);
    });

    test('should not be a BlackBerry device', () => {
      expect(mobile.other.blackberry).not.toBe(true);
    });

    test('should not be an Android device', () => {
      expect(mobile.android.device).not.toBe(true);
    });

    test('should not be an Apple device', () => {
      expect(mobile.apple.device).not.toBe(true);
    });

    test('should be a mobile device', () => {
      expect(mobile.any).toBe(true);
    });
  });

  describe('BlackBerry', () => {
    beforeEach(() => {
      userAgent =
        'Mozilla/5.0 (BlackBerry; U; BlackBerry 9900; en) AppleWebKit/534.11+ (KHTML, like Gecko) Version/7.1.0.346 Mobile Safari/534.11+';
      mobile = isMobile(userAgent);
    });

    test('should not be a Chrome device', () => {
      expect(mobile.other.chrome).not.toBe(true);
    });

    test('should be a BlackBerry device', () => {
      expect(mobile.other.blackberry).toBe(true);
    });

    test('should not be a BlackBerry 10 device', () => {
      expect(mobile.other.blackberry10).not.toBe(true);
    });

    test('should not be an Android device', () => {
      expect(mobile.android.device).not.toBe(true);
    });

    test('should not be an Apple device', () => {
      expect(mobile.apple.device).not.toBe(true);
    });

    test('should be a mobile device', () => {
      expect(mobile.any).toBe(true);
    });
  });

  describe('Opera Mini', () => {
    beforeEach(() => {
      userAgent =
        'Opera/9.80 (J2ME/MIDP; Opera Mini/9.80 (S60; SymbOS; Opera Mobi/23.348; U; en) Presto/2.5.25 Version/10.54';
      mobile = isMobile(userAgent);
    });

    test('should not be a Chrome device', () => {
      expect(mobile.other.chrome).not.toBe(true);
    });

    test('should be an Opera Mini device', () => {
      expect(mobile.other.opera).toBe(true);
    });

    test('should not be an Android device', () => {
      expect(mobile.android.device).not.toBe(true);
    });

    test('should not be an Apple device', () => {
      expect(mobile.apple.device).not.toBe(true);
    });

    test('should be a mobile device', () => {
      expect(mobile.any).toBe(true);
    });
  });

  describe('Firefox OS', () => {
    beforeEach(() => {
      userAgent = 'Mozilla/5.0 (Mobile; rv:14.0) Gecko/14.0 Firefox/14.0';
      mobile = isMobile(userAgent);
    });

    test('should not be a Chrome device', () => {
      expect(mobile.other.chrome).not.toBe(true);
    });

    test('should be a Firefox OS device', () => {
      expect(mobile.other.firefox).toBe(true);
    });

    test('should not be an Android device', () => {
      expect(mobile.android.device).not.toBe(true);
    });

    test('should not be an Apple device', () => {
      expect(mobile.apple.device).not.toBe(true);
    });

    test('should be a mobile device', () => {
      expect(mobile.any).toBe(true);
    });
  });

  describe('Chrome', () => {
    beforeEach(() => {
      userAgent =
        'Mozilla/5.0 (Linux; Android 4.4.4; en-us; Nexus 4 Build/JOP40D) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2307.2 Mobile Safari/537.36';
      mobile = isMobile(userAgent);
    });

    test('should be a Chrome device', () => {
      expect(mobile.other.chrome).toBe(true);
    });

    test('should be an Android device', () => {
      expect(mobile.android.device).toBe(true);
    });

    test('should not be a Firefox OS device', () => {
      expect(mobile.other.firefox).toBe(false);
    });

    test('should not be an Apple device', () => {
      expect(mobile.apple.device).not.toBe(true);
    });

    test('should be a mobile device', () => {
      expect(mobile.any).toBe(true);
    });
  });
});
