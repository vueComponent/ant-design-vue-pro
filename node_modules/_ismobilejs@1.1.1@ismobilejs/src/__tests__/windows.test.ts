import isMobile, { isMobileResult } from '../';

describe('Windows', () => {
  let mobile: isMobileResult;
  let userAgent: string;

  describe('Windows Phone UserAgent', () => {
    beforeEach(() => {
      userAgent =
        'Mozilla/5.0 (compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0)';
      mobile = isMobile(userAgent);
    });

    test('should be a Windows Phone device', () => {
      expect(mobile.windows.phone).toBe(true);
    });

    test('should not be an Android device', () => {
      expect(mobile.android.device).not.toBe(true);
    });

    test('should not be an Apple device', () => {
      expect(mobile.apple.device).not.toBe(true);
    });

    test('should be matched as Any Phone', () => {
      expect(mobile.phone).toBe(true);
    });

    test('should be a mobile device', () => {
      expect(mobile.any).toBe(true);
    });
  });

  describe('Windows 8.1 Phone UserAgent', () => {
    beforeEach(() => {
      userAgent =
        '//Mozilla/5.0 (Mobile; Windows Phone 8.1; Android 4.0; ARM; Trident/7.0; Touch; rv:11.0; IEMobile/11.0; NOKIA; Lumia 930) like iPhone OS 7_0_3 Mac OS X AppleWebKit/537 (KHTML, like Gecko) Mobile Safari/537';
      mobile = isMobile(userAgent);
    });

    test('should be a Windows Phone device', () => {
      expect(mobile.windows.phone).toBe(true);
    });

    test('should not be an Android device', () => {
      expect(mobile.android.device).not.toBe(true);
    });

    test('should not be an Apple device', () => {
      expect(mobile.apple.device).not.toBe(true);
    });

    test('should be matched as Any Phone', () => {
      expect(mobile.phone).toBe(true);
    });

    test('should be a mobile device', () => {
      expect(mobile.any).toBe(true);
    });
  });

  describe('Windows Edge Phone UserAgent', () => {
    beforeEach(() => {
      userAgent =
        'Mozilla/5.0 (Windows Phone 10.0; Android 4.2.1; <Manufacturer>; <Device>) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Mobile Safari/537.36 Edge/12.10166';
      mobile = isMobile(userAgent);
    });

    test('should be a Windows Phone device', () => {
      expect(mobile.windows.phone).toBe(true);
    });

    test('should not be an Android device', () => {
      expect(mobile.android.device).not.toBe(true);
    });

    test('should not be an Apple device', () => {
      expect(mobile.apple.device).not.toBe(true);
    });

    test('should be matched as Any Phone', () => {
      expect(mobile.phone).toBe(true);
    });

    test('should be a mobile device', () => {
      expect(mobile.any).toBe(true);
    });
  });

  describe('Windows Tablet UserAgent', () => {
    beforeEach(() => {
      userAgent =
        'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; ARM; Trident/6.0; Touch)';
      mobile = isMobile(userAgent);
    });

    test('should be a Windows Tablet device', () => {
      expect(mobile.windows.tablet).toBe(true);
    });

    test('should not be a Windows Phone device', () => {
      expect(mobile.windows.phone).not.toBe(true);
    });

    test('should not be an Android device', () => {
      expect(mobile.android.device).not.toBe(true);
    });

    test('should not be an Apple device', () => {
      expect(mobile.apple.device).not.toBe(true);
    });

    test('should be matched as Any Tablet', () => {
      expect(mobile.tablet).toBe(true);
    });

    test('should be a mobile device', () => {
      expect(mobile.any).toBe(true);
    });
  });

  describe('Windows Touch Laptop UserAgent', () => {
    beforeEach(() => {
      userAgent =
        'Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; Touch; MAGWJS; rv:11.0) like Gecko';
      mobile = isMobile(userAgent);
    });

    test('should not be a Windows Tablet device', () => {
      expect(mobile.windows.tablet).not.toBe(true);
    });

    test('should not be a Windows Phone device', () => {
      expect(mobile.windows.phone).not.toBe(true);
    });

    test('should not be an Android device', () => {
      expect(mobile.android.device).not.toBe(true);
    });

    test('should not be an Apple device', () => {
      expect(mobile.apple.device).not.toBe(true);
    });

    test('should not be matched as Any Tablet', () => {
      expect(mobile.tablet).not.toBe(true);
    });

    test('should not be a mobile device', () => {
      expect(mobile.any).not.toBe(true);
    });
  });
});
