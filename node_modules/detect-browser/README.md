# detect-browser

This is a package that attempts to detect a browser vendor and version (in
a semver compatible format) using a navigator useragent in a browser or
`process.version` in node.

[![NPM](https://nodei.co/npm/detect-browser.png)](https://nodei.co/npm/detect-browser/)

[![stable](https://img.shields.io/badge/stability-stable-green.svg)](https://github.com/dominictarr/stability#stable) [![Build Status](https://api.travis-ci.org/DamonOehlman/detect-browser.svg?branch=master)](https://travis-ci.org/DamonOehlman/detect-browser) [![Maintainability](https://api.codeclimate.com/v1/badges/84947fce3f3b06da69d0/maintainability)](https://codeclimate.com/github/DamonOehlman/detect-browser/maintainability)

## Installation

[![CDN](https://img.shields.io/badge/CDN-UNPKG-blue.svg)](https://unpkg.com/browse/detect-browser)

[![NPM](https://img.shields.io/badge/Package-npm-purple.svg)](https://www.npmjs.com/package/detect-browser)

## Release History

Release history can be found in the [github releases list](https://github.com/DamonOehlman/detect-browser/releases).

---

## Example Usage

```js
const { detect } = require('detect-browser');
const browser = detect();

// handle the case where we don't detect the browser
if (browser) {
  console.log(browser.name);
  console.log(browser.version);
  console.log(browser.os);
}
```

Or you can use a switch statement:

```js
const { detect } = require('detect-browser');
const browser = detect();

// handle the case where we don't detect the browser
switch (browser && browser.name) {
  case 'chrome':
  case 'firefox':
    console.log('supported');
    break;

  case 'edge':
    console.log('kinda ok');
    break;

  default:
    console.log('not supported');
}
```

Additionally, from `5.x` a `type` discriminator is included in the result
should you want to use this (it's a nice convenience in a TS environment).

Contrived example:

```ts
import { detect } from '../src';

const result = detect();
if (result) {
  switch (result.type) {
    case 'bot':
      // result is an instanceof BotInfo
      console.log(`found ${result.name} bot`);
      break;

    case 'bot-device':
      // result is an instanceof SearchBotDeviceInfo
      console.log(`found ${result.name} device bot`);
      break;

    case 'browser':
      // result is an instanceof BrowserInfo
      console.log(`found ${result.name} browser`);
      break;

    case 'node':
      // result is an instanceof NodeInfo
      console.log(`found node version ${result.version}`);
      break;
  }
}
```

**NOTE:** In addition to the the `detect` function, `browserName` and
`detectOS` are provided as exports if you want to only access certain
information.

An editable observable workbook is [available here](https://observablehq.com/@rayshan/browser-detection-tester-using-the-detect-browser-package).

## Adding additional browser support

The current list of browsers that can be detected by `detect-browser` is
not exhaustive. If you have a browser that you would like to add support for
then please submit a pull request with the implementation.

Creating an acceptable implementation requires two things:

1. A test demonstrating that the regular expression you have defined identifies
   your new browser correctly. Examples of this can be found in the
   `test/logic.js` file.

2. Write the actual regex to the `index.js` file. In most cases adding
   the regex to the list of existing regexes will be suitable (if usage of `detect-browser`
   returns `undefined` for instance), but in some cases you might have to add it before
   an existing regex. This would be true for a case where you have a browser that
   is a specialised variant of an existing browser but is identified as the
   non-specialised case.

When writing the regular expression remember that you would write it containing a
single [capturing group](https://regexone.com/lesson/capturing_groups) which
captures the version number of the browser.

## LICENSE

The MIT License (MIT)

Copyright (c) 2019 Damon Oehlman <damon.oehlman@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
