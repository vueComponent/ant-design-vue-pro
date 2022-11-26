# char-regex

A regex to match any full character, considering weird character ranges. Tested on every single emoji and unicode character. Based on the Lodash implementation.

## Install

```sh
npm install char-regex
```

## Usage

```js
import charRegex from 'char-regex';

'❤️👊🏽'.match(/./);
//=> ['', '', '', '', '', '', '']

'❤️👊🏽'.match(charRegex());
//=> ['❤️', '👊🏽']
```

## Related

- [string-length](https://github.com/sindresorhus/string-length) - Get the real length of a string
