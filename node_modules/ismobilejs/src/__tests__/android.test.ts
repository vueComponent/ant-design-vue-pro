import isMobile, { isMobileResult } from '../';

describe('Android', () => {
  let mobile: isMobileResult;
  let userAgent: string;

  describe('Phone UserAgent', () => {
    beforeEach(() => {
      userAgent =
        'Mozilla/5.0 (Linux; <Android Version>; <Build Tag etc.>) AppleWebKit/<WebKit Rev> (KHTML, like Gecko) Chrome/<Chrome Rev> Mobile Safari/<WebKit Rev>';
      mobile = isMobile(userAgent);
    });

    test('should be an Android Phone', () => {
      expect(mobile.android.phone).toBe(true);
    });

    test('should not be an Android Tablet', () => {
      expect(mobile.android.tablet).not.toBe(true);
    });

    test('should be matched as Any Phone', () => {
      expect(mobile.phone).toBe(true);
    });

    test('should be an Android device', () => {
      expect(mobile.android.device).toBe(true);
    });
  });

  describe('Tablet UserAgent', () => {
    beforeEach(() => {
      userAgent =
        'Mozilla/5.0 (Linux; <Android Version>; <Build Tag etc.>) AppleWebKit/<WebKit Rev>(KHTML, like Gecko) Chrome/<Chrome Rev> Safari/<WebKit Rev>';
      mobile = isMobile(userAgent);
    });

    test('should not be an Android Phone', () => {
      expect(mobile.android.phone).not.toBe(true);
    });

    test('should be an Android Tablet', () => {
      expect(mobile.android.tablet).toBe(true);
    });

    test('should be matched as Any Tablet', () => {
      expect(mobile.tablet).toBe(true);
    });

    test('should be an Android device', () => {
      expect(mobile.android.device).toBe(true);
    });
  });

  describe('OkHttp UserAgent', () => {
    beforeEach(() => {
      userAgent = 'okhttp/3.9.1';
      mobile = isMobile(userAgent);
    });

    test('should not be an Android Phone', () => {
      expect(mobile.android.phone).toBe(false);
    });

    test('should not be an Android Tablet', () => {
      expect(mobile.android.tablet).toBe(false);
    });

    test('should be matched as Any Tablet', () => {
      expect(mobile.tablet).toBe(false);
    });

    test('should be an Android device', () => {
      expect(mobile.android.device).toBe(true);
    });
  });
});
