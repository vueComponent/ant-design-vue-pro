# dom-matches

[![Build Status](https://secure.travis-ci.org/necolas/dom-matches.png?branch=master)](http://travis-ci.org/necolas/dom-matches)

Check if a DOM element matches a given selector.

## Installation

```
npm install dom-matches
```

## API

### matches(elem, selector)

* `elem`: a DOM node.
* `selector`: a CSS selector string.

```js
var matches = require('dom-matches');
var elem = document.querySelector('.foo');

matches(elem, '.foo');
// => true

matches(elem, '.bar');
// => false
```

## Browser support

* Google Chrome
* Firefox ESR+
* Internet Explorer 10+
* Safari 6+
* Opera
