import puppeteer from 'puppeteer';
import { isMobileResult } from '..';

describe('E2E Tests', () => {
  test('isMobile global variable is present', async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setUserAgent('okhttp/3.0.0');
    await page.addScriptTag({ path: './dist/isMobile.min.js' });

    const isMobile: isMobileResult = await page.evaluate(() => isMobile);

    expect(isMobile).toMatchInlineSnapshot(`
      Object {
        "amazon": Object {
          "device": false,
          "phone": false,
          "tablet": false,
        },
        "android": Object {
          "device": true,
          "phone": false,
          "tablet": false,
        },
        "any": true,
        "apple": Object {
          "device": false,
          "ipod": false,
          "phone": false,
          "tablet": false,
          "universal": false,
        },
        "other": Object {
          "blackberry": false,
          "blackberry10": false,
          "chrome": false,
          "device": false,
          "firefox": false,
          "opera": false,
        },
        "phone": false,
        "tablet": false,
        "windows": Object {
          "device": false,
          "phone": false,
          "tablet": false,
        },
      }
    `);

    await browser.close();
  });

  (process.env.GITHUB_ACTIONS ? test.skip : test)(
    'isMobile correctly checks iOS 13',
    async () => {
      const iPadIos13 = {
        ...puppeteer.devices['iPad Pro'],
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 (KHTML, like Gecko)',
      };
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'maxTouchPoints', {
          get: () => 4,
        });
      });
      await page.emulate(iPadIos13);
      await page.addScriptTag({ path: './dist/isMobile.min.js' });

      const isMobile: isMobileResult = await page.evaluate(() => isMobile);

      // eslint-disable-next-line jest/no-standalone-expect
      expect(isMobile).toMatchInlineSnapshot(`
      Object {
        "amazon": Object {
          "device": false,
          "phone": false,
          "tablet": false,
        },
        "android": Object {
          "device": false,
          "phone": false,
          "tablet": false,
        },
        "any": true,
        "apple": Object {
          "device": true,
          "ipod": false,
          "phone": false,
          "tablet": true,
          "universal": false,
        },
        "other": Object {
          "blackberry": false,
          "blackberry10": false,
          "chrome": false,
          "device": false,
          "firefox": false,
          "opera": false,
        },
        "phone": false,
        "tablet": true,
        "windows": Object {
          "device": false,
          "phone": false,
          "tablet": false,
        },
      }
    `);

      await browser.close();
    },
  );

  test('isMobile correctly fails iOS 13 check when MSStream is present', async () => {
    const iPadIos13 = {
      ...puppeteer.devices['iPad Pro'],
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 (KHTML, like Gecko)',
    };
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'maxTouchPoints', {
        get: () => 4,
      });

      Object.defineProperty(window, 'MSStream', {
        get: () => (fn: Function) => fn(),
      });
    });
    await page.emulate(iPadIos13);
    await page.addScriptTag({ path: './dist/isMobile.min.js' });

    const isMobile: isMobileResult = await page.evaluate(() => isMobile);

    expect(isMobile).toMatchInlineSnapshot(`
      Object {
        "amazon": Object {
          "device": false,
          "phone": false,
          "tablet": false,
        },
        "android": Object {
          "device": false,
          "phone": false,
          "tablet": false,
        },
        "any": false,
        "apple": Object {
          "device": false,
          "ipod": false,
          "phone": false,
          "tablet": false,
          "universal": false,
        },
        "other": Object {
          "blackberry": false,
          "blackberry10": false,
          "chrome": false,
          "device": false,
          "firefox": false,
          "opera": false,
        },
        "phone": false,
        "tablet": false,
        "windows": Object {
          "device": false,
          "phone": false,
          "tablet": false,
        },
      }
    `);

    await browser.close();
  });
});
