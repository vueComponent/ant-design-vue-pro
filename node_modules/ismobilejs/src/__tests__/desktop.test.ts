import isMobile, { isMobileResult } from '../';

describe('Desktop', () => {
  let mobile: isMobileResult;
  let userAgent: string;

  describe('Chrome', () => {
    beforeEach(() => {
      userAgent =
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_3) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.151 Safari/535.19';
      mobile = isMobile(userAgent);
    });

    test('should not be a mobile device', () => {
      expect(mobile.any).not.toBe(true);
    });
  });

  describe('Safari', () => {
    beforeEach(() => {
      userAgent =
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_3) AppleWebKit/534.53.11 (KHTML, like Gecko) Version/5.1.3 Safari/534.53.10';
      mobile = isMobile(userAgent);
    });

    test('should not be a mobile device', () => {
      expect(mobile.any).not.toBe(true);
    });
  });
});
