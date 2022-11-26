# stylelint-order

[![npm version][npm-version-img]][npm] [![npm downloads last month][npm-downloads-img]][npm]

A plugin pack of order-related linting rules for [Stylelint]. Every rule supports autofixing (`stylelint --fix`).

## Installation

1. If you haven't, install [Stylelint]:

```
npm install stylelint --save-dev
```

2.  Install `stylelint-order`:

```
npm install stylelint-order --save-dev
```

## Usage

Add `stylelint-order` to your Stylelint config `plugins` array, then add rules you need to the rules list. All rules from stylelint-order need to be namespaced with `order`.

```json
{
	"plugins": [
		"stylelint-order"
	],
	"rules": {
		"order/order": [
			"custom-properties",
			"declarations"
		],
		"order/properties-order": [
			"width",
			"height"
		]
	}
}
```

## Rules

* [`order`](./rules/order/README.md): Specify the order of content within declaration blocks.
* [`properties-order`](./rules/properties-order/README.md): Specify the order of properties within declaration blocks.
* [`properties-alphabetical-order`](./rules/properties-alphabetical-order/README.md): Specify the alphabetical order of properties within declaration blocks.

## Autofixing

Every rule supports autofixing with `stylelint --fix`. [postcss-sorting] is used internally for order autofixing.

Automatic sorting has some limitations that are described for every rule, if any. Please, take a look at [how comments are handled](https://github.com/hudochenkov/postcss-sorting#handling-comments) by `postcss-sorting`.

CSS-in-JS styles with template interpolation [could be ignored by autofixing](https://github.com/hudochenkov/postcss-sorting#css-in-js) to avoid style corruption.

Autofixing in Less syntax may work but isn't officially supported.

## Example configs

All these configs have `properties-order` configured  with logical properties groups:

* [`stylelint-config-idiomatic-order`](https://github.com/ream88/stylelint-config-idiomatic-order)
* [`stylelint-config-hudochenkov/order`](https://github.com/hudochenkov/stylelint-config-hudochenkov/blob/master/order.js)
* [`stylelint-config-recess-order`](https://github.com/stormwarning/stylelint-config-recess-order)
* [`stylelint-config-property-sort-order-smacss`](https://github.com/cahamilton/stylelint-config-property-sort-order-smacss)

## Thanks

`properties-order` and `properties-alphabetical-order` code and README were based on the `declaration-block-properties-order` rule which was a core rule prior to Stylelint 8.0.0.

[npm-version-img]: https://img.shields.io/npm/v/stylelint-order.svg
[npm-downloads-img]: https://img.shields.io/npm/dm/stylelint-order.svg
[npm]: https://www.npmjs.com/package/stylelint-order
[Stylelint]: https://stylelint.io/
[postcss-sorting]: https://github.com/hudochenkov/postcss-sorting
