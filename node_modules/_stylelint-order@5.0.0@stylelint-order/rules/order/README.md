# order

Specify the order of content within declaration blocks.

* Options
	* [Extended at-rule objects](#extended-at-rule-objects)
	* [Extended rule objects](#extended-rule-objects)
* Optional secondary options
	* [`unspecified`](#unspecified)
* [Autofixing caveats](#autofixing-caveats)
* [Examples](#examples)

## Options

```ts
type PrimaryOption = Array<Keyword | AtRule | Rule>;

type Keyword = "custom-properties" | "dollar-variables" | "at-variables" | "declarations" | "rules" | "at-rules" | "less-mixins";

type AtRule = {
	type: 'at-rule',
	name?: string,
	parameter?: string | RegExp,
	hasBlock?: boolean
};

type Rule = {
	type: 'rule',
	selector?: string | RegExp,
	name?: string
};
```

Within an order array, you can include:

- keywords:
	- `custom-properties` — Custom properties (e. g., `--property: 10px;`)
	- `dollar-variables` — Dollar variables (e. g., `$variable`)
	- `at-variables` — At-variables (e. g., `@variable` available in Less syntax)
	- `declarations` — CSS declarations (e. g., `display: block`)
	- `rules` — Nested rules (e. g., `a { span {} }`)
	- `at-rules` — Nested at-rules (e. g., `div { @media () {} }`)
	- `less-mixins` — Mixins in Less syntax (e. g., `.mixin();`)
- extended at-rule objects:

	```json
	{
		"type": "at-rule",
		"name": "include",
		"parameter": "hello",
		"hasBlock": true
	}
	```

- extended rule objects:

	```json
	{
		"type": "rule",
		"selector": "div",
		"name": "tag selector"
	}
	```

**By default, unlisted elements will be ignored.** So if you specify an array and do not include `declarations`, that means that all declarations can be included before or after any other element. _This can be changed with the `unspecified` option (see below)._

### Extended at-rule objects

Extended at-rule objects have different parameters and variations.

Object parameters:

* `type`: always `"at-rule"`
* `name`: `string`. E. g., `name: "include"` for `@include`
* `parameter`: `string | RegExp`. A string will be translated into a RegExp — `new RegExp(yourString)` — so _be sure to escape properly_. E. g., `parameter: "icon"` for `@include icon(20px);`
* `hasBlock`: `boolean`. E. g., `hasBlock: true` for `@include icon { color: red; }` and not for `@include icon;`

Always specify `name` if `parameter` is specified.

Matches all at-rules:

```json
{
	"type": "at-rule"
}
```

Or keyword `at-rules`.

Matches all at-rules, which have nested elements:

```json
{
	"type": "at-rule",
	"hasBlock": true
}
```

Matches all at-rules with specific name:

```json
{
	"type": "at-rule",
	"name": "media"
}
```

Matches all at-rules with specific name, which have nested elements:

```json
{
	"type": "at-rule",
	"name": "media",
	"hasBlock": true
}
```

Matches all at-rules with specific name and parameter:

```json
{
	"type": "at-rule",
	"name": "include",
	"parameter": "icon"
}
```

Matches all at-rules with specific name and parameter, which have nested elements:

```json
{
	"type": "at-rule",
	"name": "include",
	"parameter": "icon",
	"hasBlock": true
}
```

Each described above variant has more priority than its previous variant. For example, `{ "type": "at-rule", "name": "media" }` will be applied to an element if both `{ "type": "at-rule", "name": "media" }` and `{ "type": "at-rule", "hasBlock": true }` can be applied to an element.

### Extended rule objects

Object parameters:

* `type`: always `"rule"`
* `selector`: `string | RegExp`. Selector pattern. A string will be translated into a RegExp — `new RegExp(yourString)` — so _be sure to escape properly_. Examples:
	* `selector: /^&:[\w-]+$/` matches simple pseudo-classes. E. g., `&:hover`, `&:first-child`. Doesn't match complex pseudo-classes, e. g. `&:not(.is-visible)`.
	* `selector: /^&::[\w-]+$/` matches pseudo-elements. E. g. `&::before`, `&::placeholder`.
* `name`: `string`. Selector name (optional). Will be used in error output to help identify extended rule object.

Matches all rules:

```json
{
	"type": "rule"
}
```

Or keyword `rules`.

Matches all rules with selector matching pattern:

```json
{
	"type": "rule",
	"selector": "div"
}
```

```json
{
	"type": "rule",
	"selector": "/^&:\\w+$/"
}
```

## Optional secondary options

```ts
type SecondaryOptions = {
	unspecified?: "top" | "bottom" | "ignore",
};
```

### `unspecified`

Value type: `"top" | "bottom" | "ignore"`.<br>
Default value: `"ignore"`.

Default behavior is the same as `"ignore"`: an unspecified element can appear before or after any other property.

With `"top"`, unspecified elements are expected _before_ any specified properties. With `"bottom"`, unspecified properties are expected _after_ any specified properties.

## Autofixing caveats

Keyword `less-mixins` aren't supported.

`unspecified` secondary option is always set to `bottom`.

## Examples

Given:

```json
{
	"order/order": [
		"custom-properties",
		"dollar-variables",
		"declarations",
		"rules",
		"at-rules"
	]
}
```

The following patterns are considered warnings:

```css
a {
	top: 0;
	--height: 10px;
	color: pink;
}
```

```css
a {
	@media (min-width: 100px) {}
	display: none;
}
```

The following patterns are _not_ considered warnings:

```css
a {
	--width: 10px;
	$height: 20px;
	display: none;
	span {}
	@media (min-width: 100px) {}
}
```

```css
a {
	--height: 10px;
	color: pink;
	top: 0;
}
```

---

Given:

```json
{
	"order/order": [
		{
			"type": "at-rule",
			"name": "include"
		},
		{
			"type": "at-rule",
			"name": "include",
			"hasBlock": true
		},
		{
			"type": "at-rule",
			"hasBlock": true
		},
		{
			"type": "at-rule"
		}
	]
}
```

The following patterns are considered warnings:

```scss
a {
	@include hello {
		display: block;
	}
	@include hello;
}
```

```scss
a {
	@extend .something;
	@media (min-width: 10px) {
		display: none;
	}
}
```

The following patterns are _not_ considered warnings:

```scss
a {
	@include hello;
	@include hello {
		display: block;
	}
	@media (min-width: 10px) {
		display: none;
	}
	@extend .something;
}
```

```scss
a {
	@include hello {
		display: block;
	}
	@extend .something;
}
```

---

Given:

```json
{
	"order/order": [
		{
			"type": "at-rule",
			"name": "include",
			"hasBlock": true
		},
		{
			"type": "at-rule",
			"name": "include",
			"parameter": "icon",
			"hasBlock": true
		},
		{
			"type": "at-rule",
			"name": "include",
			"parameter": "icon"
		}
	]
}
```

The following patterns are considered warnings:

```scss
a {
	@include icon {
		display: block;
	}
	@include hello {
		display: none;
	}
	@include icon;
}
```

```scss
a {
	@include icon;
	@include icon {
		display: block;
	}
}
```

The following patterns are _not_ considered warnings:

```scss
a {
	@include hello {
		display: none;
	}
	@include icon {
		display: block;
	}
	@include icon;
}
```

```scss
a {
	@include hello {
		display: none;
	}
	@include icon;
}
```

---

Given:

```json
{
	"order/order": [
		"custom-properties",
		{
			"type": "at-rule",
			"hasBlock": true
		},
		"declarations"
	]
}
```

The following patterns are considered warnings:

```css
a {
	@media (min-width: 10px) {
		display: none;
	}
	--height: 10px;
	width: 20px;
}
```

```css
a {
	width: 20px;
	@media (min-width: 10px) {
		display: none;
	}
	--height: 10px;
}
```

```css
a {
	width: 20px;
	@media (min-width: 10px) {
		display: none;
	}
}
```

The following patterns are _not_ considered warnings:

```css
a {
	--height: 10px;
	@media (min-width: 10px) {
		display: none;
	}
	width: 20px;
}
```

```css
a {
	@media (min-width: 10px) {
		display: none;
	}
	width: 20px;
}
```

```css
a {
	--height: 10px;
	width: 20px;
}
```

---

Given:

```json
{
	"order/order": [
		{
			"type": "rule",
			"selector": "^a"
		},
		{
			"type": "rule",
			"selector": "/^&/"
		},
		"rules"
	]
}
```

The following patterns are considered warnings:

```scss
a {
	a {}
	&:hover {}
	abbr {}
	span {}
}
```

```scss
a {
	span {}
	&:hover {}
}
```

```scss
a {
	span {}
	abbr {}
}
```

The following patterns are _not_ considered warnings:

```scss
a {
	a {}
	abbr {}
	&:hover {}
	span {}
}
```

```scss
a {
	abbr {}
	a {}
}
```

```scss
a {
	abbr {}
	span {}
}
```

---

Given:

```json
{
	"order/order": [
		{
			"type": "rule",
			"selector": "/^&/"
		},
		{
			"type": "rule",
			"selector": "/^&:\\w/"
		}
	]
}
```

The following patterns are _not_ considered warnings:

```scss
a {
	&:hover {}
	& b {}
}
```

```scss
a {
	& b {}
	&:hover {}
}
```

---

Given:

```json
{
	"order/order": [
		{
			"type": "rule",
			"selector": "/^&:\\w/"
		},
		{
			"type": "rule",
			"selector": "/^&/"
		}
	]
}
```

The following pattern is considered warnings:

```scss
a {
	& b {}
	&:hover {}
}
```

The following pattern is _not_ considered warnings:

```scss
a {
	&:hover {}
	& b {}
}
```

---

Given:

```json
{
	"order/order": [
		[
			"declarations"
		],
		{
			"unspecified": "ignore"
		}
	]
}
```

The following patterns are _not_ considered warnings:

```css
a {
	--height: 10px;
	display: none;
	$width: 20px;
}
```

```css
a {
	--height: 10px;
	$width: 20px;
	display: none;
}
```

```css
a {
	display: none;
	--height: 10px;
	$width: 20px;
}
```

---

Given:

```json
{
	"order/order": [
		[
			"declarations"
		],
		{
			"unspecified": "top"
		}
	]
}
```

The following patterns are considered warnings:

```css
a {
	display: none;
	--height: 10px;
	$width: 20px;
}
```

```css
a {
	--height: 10px;
	display: none;
	$width: 20px;
}
```

The following patterns are _not_ considered warnings:

```css
a {
	--height: 10px;
	$width: 20px;
	display: none;
}
```

```css
a {
	$width: 20px;
	--height: 10px;
	display: none;
}
```

---

Given:

```json
{
	"order/order": [
		[
			"declarations"
		],
		{
			"unspecified": "bottom"
		}
	]
}
```

The following patterns are considered warnings:

```css
a {
	--height: 10px;
	$width: 20px;
	display: none;
}
```

```css
a {
	--height: 10px;
	display: none;
	$width: 20px;
}
```

The following patterns are _not_ considered warnings:

```css
a {
	display: none;
	--height: 10px;
	$width: 20px;
}
```

```css
a {
	display: none;
	$width: 20px;
	--height: 10px;
}
```
