import isMobile, { isMobileResult } from '../';

describe('Apple', () => {
  let mobile: isMobileResult;
  let userAgent: string;

  describe('iPhone UserAgent', () => {
    beforeEach(() => {
      userAgent =
        'Mozilla/5.0 (iPhone; U; CPU like Mac OS X; en) AppleWebKit/420+ (KHTML, like Gecko) Version/3.0 Mobile/1A543 Safari/419.3';
      mobile = isMobile(userAgent);
    });

    test('should be an iPhone', () => {
      expect(mobile.apple.phone).toBe(true);
    });

    test('should not be an iPad', () => {
      expect(mobile.apple.tablet).not.toBe(true);
    });

    test('should not be an iPod', () => {
      expect(mobile.apple.ipod).not.toBe(true);
    });

    test('should be matched as Any Phone', () => {
      expect(mobile.phone).toBe(true);
    });

    test('should be an Apple device', () => {
      expect(mobile.apple.device).toBe(true);
    });
  });

  describe('iPad UserAgent', () => {
    beforeEach(() => {
      userAgent =
        'Mozilla/5.0 (iPad; U; CPU OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B334b Safari/531.21.10';
      mobile = isMobile(userAgent);
    });

    test('should not be an iPhone', () => {
      expect(mobile.apple.phone).not.toBe(true);
    });

    test('should be an iPad', () => {
      expect(mobile.apple.tablet).toBe(true);
    });

    test('should not be an iPod', () => {
      expect(mobile.apple.ipod).not.toBe(true);
    });

    test('should be matched as Any Tablet', () => {
      expect(mobile.tablet).toBe(true);
    });

    test('should be an Apple device', () => {
      expect(mobile.apple.device).toBe(true);
    });
  });

  describe('iPad on iOS 13', () => {
    beforeEach(() => {
      const nav = {
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 (KHTML, like Gecko)',
        platform: 'MacIntel',
        maxTouchPoints: 4,
      };
      mobile = isMobile(nav);
    });

    test('should not be an iPhone', () => {
      expect(mobile.apple.phone).not.toBe(true);
    });

    test('should be an iPad', () => {
      expect(mobile.apple.tablet).toBe(true);
    });

    test('should not be an iPod', () => {
      expect(mobile.apple.ipod).not.toBe(true);
    });

    test('should be matched as Any Tablet', () => {
      expect(mobile.tablet).toBe(true);
    });

    test('should be an Apple device', () => {
      expect(mobile.apple.device).toBe(true);
    });
  });

  describe('iPod UserAgent', () => {
    beforeEach(() => {
      userAgent =
        'Mozilla/5.0 (iPod; U; CPU like Mac OS X; en) AppleWebKit/420.1 (KHTML, like Gecko) Version/3.0 Mobile/3A101a Safari/419.3';
      mobile = isMobile(userAgent);
    });

    test('should not be an iPhone', () => {
      expect(mobile.apple.phone).not.toBe(true);
    });

    test('should not be an iPad', () => {
      expect(mobile.apple.tablet).not.toBe(true);
    });

    test('should be an iPod', () => {
      expect(mobile.apple.ipod).toBe(true);
    });

    test('should be an Apple device', () => {
      expect(mobile.apple.device).toBe(true);
    });
  });

  describe('Facebook iPhone App UserAgent', () => {
    beforeEach(() => {
      userAgent =
        'Mozilla/5.0 (iPhone; CPU OS 8_1 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Mobile/12B410 [FBAN/FBIOS;FBAV/20.1.0.15.10;FBBV/5758778;FBDV/iPad5,4;FBMD/iPad;FBSN/iPhone OS;FBSV/8.1;FBSS/2; FBCR/;FBID/tablet;FBLC/fi_FI;FBOP/1]';
      mobile = isMobile(userAgent);
    });

    test('should be an iPhone', () => {
      expect(mobile.apple.phone).toBe(true);
    });

    test('should not be an iPad', () => {
      expect(mobile.apple.tablet).not.toBe(true);
    });

    test('should not be an iPod', () => {
      expect(mobile.apple.ipod).not.toBe(true);
    });

    test('should be an Apple device', () => {
      expect(mobile.apple.device).toBe(true);
    });
  });

  describe('Facebook iPad App UserAgent', () => {
    beforeEach(() => {
      userAgent =
        'Mozilla/5.0 (iPad; CPU OS 8_1 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Mobile/12B410 [FBAN/FBIOS;FBAV/20.1.0.15.10;FBBV/5758778;FBDV/iPad5,4;FBMD/iPad;FBSN/iPhone OS;FBSV/8.1;FBSS/2; FBCR/;FBID/tablet;FBLC/fi_FI;FBOP/1]';
      mobile = isMobile(userAgent);
    });

    test('should not be an iPhone', () => {
      expect(mobile.apple.phone).not.toBe(true);
    });

    test('should be an iPad', () => {
      expect(mobile.apple.tablet).toBe(true);
    });

    test('should not be an iPod', () => {
      expect(mobile.apple.ipod).not.toBe(true);
    });

    test('should be an Apple device', () => {
      expect(mobile.apple.device).toBe(true);
    });
  });

  describe('Twitter iPhone App UserAgent', () => {
    beforeEach(() => {
      userAgent =
        'Mozilla/5.0 (iPhone; CPU iPhone OS 9_2_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Mobile/13D15 Twitter for iPhone';
      mobile = isMobile(userAgent);
    });

    test('should be an iPhone', () => {
      expect(mobile.apple.phone).toBe(true);
    });

    test('should not be an iPad', () => {
      expect(mobile.apple.tablet).not.toBe(true);
    });

    test('should not be an iPod', () => {
      expect(mobile.apple.ipod).not.toBe(true);
    });

    test('should be an Apple device', () => {
      expect(mobile.apple.device).toBe(true);
    });
  });

  describe('Twitter iPad App UserAgent', () => {
    beforeEach(() => {
      userAgent =
        'Mozilla/5.0 (iPad; CPU OS 9_2_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Mobile/13D15 Twitter for iPhone';
      mobile = isMobile(userAgent);
    });

    test('should not be an iPhone', () => {
      expect(mobile.apple.phone).not.toBe(true);
    });

    test('should be an iPad', () => {
      expect(mobile.apple.tablet).toBe(true);
    });

    test('should not be an iPod', () => {
      expect(mobile.apple.ipod).not.toBe(true);
    });

    test('should be an Apple device', () => {
      expect(mobile.apple.device).toBe(true);
    });
  });
});
