# omit.js

[![](https://img.shields.io/travis/benjycui/omit.js.svg?style=flat-square)](https://travis-ci.org/benjycui/omit.js)
[![npm package](https://img.shields.io/npm/v/omit.js.svg?style=flat-square)](https://www.npmjs.org/package/omit.js)
[![NPM downloads](http://img.shields.io/npm/dm/omit.js.svg?style=flat-square)](https://npmjs.org/package/omit.js)
[![Dependency Status](https://david-dm.org/benjycui/omit.js.svg?style=flat-square)](https://david-dm.org/benjycui/omit.js)

Utility function to create a shallow copy of an object which had dropped some fields.

## Usage

```bash
npm i --save omit.js
```

```js
var omit = require('omit.js');
omit({ name: 'Benjy', age: 18 }, [ 'name' ]); // => { age: 18 }
```

## API

### omit(obj: Object, fields: string[]): Object

Return a shallow copy which had dropped fields.

## License

MIT
