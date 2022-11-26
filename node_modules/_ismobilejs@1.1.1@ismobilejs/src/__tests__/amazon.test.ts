import isMobile, { isMobileResult } from '../';

describe('Amazon', () => {
  let mobile: isMobileResult;
  let userAgent: string;

  describe('Amazon Kindle Fire User Agent', () => {
    beforeEach(() => {
      userAgent =
        'Mozilla/5.0 (Linux; U; Android android-version; locale; KFOT Build/product-build) AppleWebKit/webkit-version (KHTML, like Gecko) Silk/browser-version like Chrome/chrome-version Safari/webkit-version';
      mobile = isMobile(userAgent);
    });

    test('should not be an Amazon Phone', () => {
      expect(mobile.amazon.phone).not.toBe(true);
    });

    test('should be an Amazon Tablet', () => {
      expect(mobile.amazon.tablet).toBe(true);
    });

    test('should be an Amazon device', () => {
      expect(mobile.amazon.device).toBe(true);
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

  describe('Amazon Kindle Fire HD User Agent', () => {
    beforeEach(() => {
      userAgent =
        'Mozilla/5.0 (Linux; U; Android android-version; locale; KFTT Build/product-build) AppleWebKit/webkit-version (KHTML, like Gecko) Silk/browser-version like Chrome/chrome-version Safari/webkit-version';
      mobile = isMobile(userAgent);
    });

    test('should not be an Amazon Phone', () => {
      expect(mobile.amazon.phone).not.toBe(true);
    });

    test('should be an Amazon Tablet', () => {
      expect(mobile.amazon.tablet).toBe(true);
    });

    test('should be an Amazon device', () => {
      expect(mobile.amazon.device).toBe(true);
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

  describe('Amazon Kindle Fire HD 8.9inch User Agent', () => {
    beforeEach(() => {
      userAgent =
        'Mozilla/5.0 (Linux; U; Android android-version; locale; KFJWI Build/product-build) AppleWebKit/webkit-version (KHTML, like Gecko) Silk/browser-version like Chrome/chrome-version Safari/webkit-version';
      mobile = isMobile(userAgent);
    });

    test('should not be an Amazon Phone', () => {
      expect(mobile.amazon.phone).not.toBe(true);
    });

    test('should be an Amazon Tablet', () => {
      expect(mobile.amazon.tablet).toBe(true);
    });

    test('should be an Amazon device', () => {
      expect(mobile.amazon.device).toBe(true);
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

  describe('Amazon Kindle Fire HD 8.9inch 4G User Agent', () => {
    beforeEach(() => {
      userAgent =
        'Mozilla/5.0 (Linux; U; Android android-version; locale; KFJWA Build/product-build) AppleWebKit/webkit-version (KHTML, like Gecko) Silk/browser-version like Chrome/chrome-version Safari/webkit-version';
      mobile = isMobile(userAgent);
    });

    test('should not be an Amazon Phone', () => {
      expect(mobile.amazon.phone).not.toBe(true);
    });

    test('should be an Amazon Tablet', () => {
      expect(mobile.amazon.tablet).toBe(true);
    });

    test('should be an Amazon device', () => {
      expect(mobile.amazon.device).toBe(true);
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

  describe('Amazon Kindle Fire HD 7inch (3rd Generation) User Agent', () => {
    beforeEach(() => {
      userAgent =
        'Mozilla/5.0 (Linux; U; Android android-version; locale; KFSOWI Build/product-build) AppleWebKit/webkit-version (KHTML, like Gecko) Silk/browser-version like Chrome/chrome-version Safari/webkit-version';
      mobile = isMobile(userAgent);
    });

    test('should not be an Amazon Phone', () => {
      expect(mobile.amazon.phone).not.toBe(true);
    });

    test('should be an Amazon Tablet', () => {
      expect(mobile.amazon.tablet).toBe(true);
    });

    test('should be an Amazon device', () => {
      expect(mobile.amazon.device).toBe(true);
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

  describe('Amazon Kindle Fire HDX 7inch (3rd Generation) User Agent', () => {
    beforeEach(() => {
      userAgent =
        'Mozilla/5.0 (Linux; U; Android android-version; locale; KFTHWI Build/product-build) AppleWebKit/webkit-version (KHTML, like Gecko) Silk/browser-version like Chrome/chrome-version Safari/webkit-version';
      mobile = isMobile(userAgent);
    });

    test('should not be an Amazon Phone', () => {
      expect(mobile.amazon.phone).not.toBe(true);
    });

    test('should be an Amazon Tablet', () => {
      expect(mobile.amazon.tablet).toBe(true);
    });

    test('should be an Amazon device', () => {
      expect(mobile.amazon.device).toBe(true);
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

  describe('Amazon Kindle Fire HDX 7 (3rd Generation) 4G User Agent', () => {
    beforeEach(() => {
      userAgent =
        'Mozilla/5.0 (Linux; U; Android android-version; locale; KFTHWA Build/product-build) AppleWebKit/webkit-version (KHTML, like Gecko) Silk/browser-version like Chrome/chrome-version Safari/webkit-version';
      mobile = isMobile(userAgent);
    });

    test('should not be an Amazon Phone', () => {
      expect(mobile.amazon.phone).not.toBe(true);
    });

    test('should be an Amazon Tablet', () => {
      expect(mobile.amazon.tablet).toBe(true);
    });

    test('should be an Amazon device', () => {
      expect(mobile.amazon.device).toBe(true);
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

  describe('Amazon Kindle Fire HDX 8.9inch (3rd Generation) User Agent', () => {
    beforeEach(() => {
      userAgent =
        'Mozilla/5.0 (Linux; U; Android android-version; locale; KFAPWI Build/product-build) AppleWebKit/webkit-version (KHTML, like Gecko) Silk/browser-version like Chrome/chrome-version Safari/webkit-version';
      mobile = isMobile(userAgent);
    });

    test('should not be an Amazon Phone', () => {
      expect(mobile.amazon.phone).not.toBe(true);
    });

    test('should be an Amazon Tablet', () => {
      expect(mobile.amazon.tablet).toBe(true);
    });

    test('should be an Amazon device', () => {
      expect(mobile.amazon.device).toBe(true);
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

  describe('Amazon Kindle Fire HDX 8.9inch (3rd Generation) 4G User Agent', () => {
    beforeEach(() => {
      userAgent =
        'Mozilla/5.0 (Linux; U; Android android-version; locale; KFAPWA Build/product-build) AppleWebKit/webkit-version (KHTML, like Gecko) Silk/browser-version like Chrome/chrome-version Safari/webkit-version';
      mobile = isMobile(userAgent);
    });

    test('should not be an Amazon Phone', () => {
      expect(mobile.amazon.phone).not.toBe(true);
    });

    test('should be an Amazon Tablet', () => {
      expect(mobile.amazon.tablet).toBe(true);
    });

    test('should be an Amazon device', () => {
      expect(mobile.amazon.device).toBe(true);
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

  describe('Amazon Fire HD 6 (4th Generation) User Agent', () => {
    beforeEach(() => {
      userAgent =
        'Mozilla/5.0 (Linux; U; Android android-version; locale; KFARWI Build/product-build) AppleWebKit/webkit-version (KHTML, like Gecko) Silk/browser-version like Chrome/chrome-version Safari/webkit-version';
      mobile = isMobile(userAgent);
    });

    test('should not be an Amazon Phone', () => {
      expect(mobile.amazon.phone).not.toBe(true);
    });

    test('should be an Amazon Tablet', () => {
      expect(mobile.amazon.tablet).toBe(true);
    });

    test('should be an Amazon device', () => {
      expect(mobile.amazon.device).toBe(true);
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

  describe('Amazon Fire HD 7 (4th Generation) User Agent', () => {
    beforeEach(() => {
      userAgent =
        'Mozilla/5.0 (Linux; U; Android android-version; locale; KFASWI Build/product-build) AppleWebKit/webkit-version (KHTML, like Gecko) Silk/browser-version like Chrome/chrome-version Safari/webkit-version';
      mobile = isMobile(userAgent);
    });

    test('should not be an Amazon Phone', () => {
      expect(mobile.amazon.phone).not.toBe(true);
    });

    test('should be an Amazon Tablet', () => {
      expect(mobile.amazon.tablet).toBe(true);
    });

    test('should be an Amazon device', () => {
      expect(mobile.amazon.device).toBe(true);
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

  describe('Amazon Fire HDX 8.9 (4th Generation) User Agent', () => {
    beforeEach(() => {
      userAgent =
        'Mozilla/5.0 (Linux; U; Android android-version; locale; KFSAWI Build/product-build) AppleWebKit/webkit-version (KHTML, like Gecko) Silk/browser-version like Chrome/chrome-version Safari/webkit-version';
      mobile = isMobile(userAgent);
    });

    test('should not be an Amazon Phone', () => {
      expect(mobile.amazon.phone).not.toBe(true);
    });

    test('should be an Amazon Tablet', () => {
      expect(mobile.amazon.tablet).toBe(true);
    });

    test('should be an Amazon device', () => {
      expect(mobile.amazon.device).toBe(true);
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

  describe('Amazon Fire HDX 8.9 (4th Generation) 4G User Agent', () => {
    beforeEach(() => {
      userAgent =
        'Mozilla/5.0 (Linux; U; Android android-version; locale; KFSAWA Build/product-build) AppleWebKit/webkit-version (KHTML, like Gecko) Silk/browser-version like Chrome/chrome-version Safari/webkit-version';
      mobile = isMobile(userAgent);
    });

    test('should not be an Amazon Phone', () => {
      expect(mobile.amazon.phone).not.toBe(true);
    });

    test('should be an Amazon Tablet', () => {
      expect(mobile.amazon.tablet).toBe(true);
    });

    test('should be an Amazon device', () => {
      expect(mobile.amazon.device).toBe(true);
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

  describe('Amazon Fire Phone User Agent', () => {
    beforeEach(() => {
      userAgent =
        'Mozilla/5.0 (Linux; U; Android android-version; locale; SD4930UR Build/product-build) AppleWebKit/webkit-version (KHTML, like Gecko) Silk/browser-version like Chrome/chrome-version Safari/webkit-version';
      mobile = isMobile(userAgent);
    });

    test('should be an Amazon Phone', () => {
      expect(mobile.amazon.phone).toBe(true);
    });

    test('should not be an Amazon Tablet', () => {
      expect(mobile.amazon.tablet).not.toBe(true);
    });

    test('should be an Amazon device', () => {
      expect(mobile.amazon.device).toBe(true);
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

  describe('Amazon Fire Generic Phone User Agent', () => {
    beforeEach(() => {
      userAgent =
        'Mozilla/5.0 (Linux; Android android-version; product-model Build/product-build) AppleWebKit/webkit-version (KHTML, like Gecko) Silk/browser-version like Chrome/chrome-version Mobile Safari/webkit-version';
      mobile = isMobile(userAgent);
    });

    test('should be an Amazon Phone', () => {
      expect(mobile.amazon.phone).toBe(true);
    });

    test('should not be an Amazon Tablet', () => {
      expect(mobile.amazon.tablet).not.toBe(true);
    });

    test('should be an Amazon device', () => {
      expect(mobile.amazon.device).toBe(true);
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
});
