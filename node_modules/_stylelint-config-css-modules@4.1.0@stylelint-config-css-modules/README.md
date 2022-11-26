# stylelint-config-css-modules

[![npm version][npm-image]][npm-url]
[![CI Status][ci-image]][ci-url]

> CSS modules shareable config for stylelint.

Tweaks [stylelint] rules to accept [css modules] specific syntax.  
This is useful as an override of pre-defined rules, for instance the [stylelint-config-standard].

## Installation

```
npm install stylelint-config-css-modules --save-dev
```

or

```
yarn add stylelint-config-css-modules --dev
```

> `stylelint-config-css-modules` comes with `stylelint-scss` as `optionalDependencies`, 
if you're not using SCSS and want to strip it from your node_modules just:

```
npm install stylelint-config-css-modules --save-dev --no-optional
```

or

```
yarn add stylelint-config-css-modules --dev --ignore-optional
```

## Usage

```json
{
  "extends": [
    "stylelint-config-standard",
    "stylelint-config-css-modules"
  ]
}
```

## Examples

```css
@value colors: './colors.css';
@value primary, secondary from colors;

.base {
  content: 'base';
  color: primary;
}

.composed {
  composes: base;
}

.composedWith {
  compose-with: base;
}

.flexible {
  composes: flex from './utils.css';
  flex-direction: column;
}

:global(.js) .progressive {
  display: block;
}

:export {
  black: #000;
  white: #111;
}
```

## SCSS

Using SCSS along with configs such as [stylelint-config-standard-scss] means you 
should necessarily have [stylelint-scss] installed.

```json
{
  "extends": [
    "stylelint-config-standard-scss",
    "stylelint-config-css-modules"
  ]
}
```

## Credits

- [Pascal Duez](https://github.com/pascalduez)

## Licence

stylelint-config-css-modules is [unlicensed](http://unlicense.org/).

[npm-url]: https://www.npmjs.org/package/stylelint-config-css-modules
[npm-image]: http://img.shields.io/npm/v/stylelint-config-css-modules.svg?style=flat-square
[ci-url]: https://github.com/pascalduez/stylelint-config-css-modules/actions/workflows/ci.yml
[ci-image]: https://img.shields.io/github/workflow/status/pascalduez/stylelint-config-css-modules/CI?style=flat-square

[stylelint]: https://github.com/stylelint/stylelint
[css modules]: https://github.com/css-modules/css-modules
[stylelint-scss]: https://github.com/stylelint-scss/stylelint-config-standard-scss
[stylelint-config-standard]: https://github.com/stylelint/stylelint-config-standard
[stylelint-config-standard-scss]: https://github.com/stylelint-scss/stylelint-config-standard-scss

