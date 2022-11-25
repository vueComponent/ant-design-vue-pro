# dom-closest

[![Build Status](https://secure.travis-ci.org/necolas/dom-closest.png?branch=master)](http://travis-ci.org/necolas/dom-closest)

For a given DOM element, find the first ancestor that matches a given CSS
selector.

## Installation

```
npm install dom-closest
```

## API

### closest(elem, selector[, context])

* `element` (Element): a starting DOM Element.
* `selector` (String): the CSS selector of the ancestor to find.
* `context` (Element): a DOM node to use as search context (optional).

```js
var closest = require('dom-closest');

var photo = document.querySelector('.photo');
var timeline = document.querySelector('.timeline');

closest(photo, '.tweet');
// => Element

closest(photo, '.tweet', timeline);
// => Element
```

## Browser support

* Google Chrome
* Firefox 4+
* Internet Explorer 8+
* Safari 5+
* Opera
