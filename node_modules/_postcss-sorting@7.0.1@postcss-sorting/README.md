# PostCSS Sorting

[![npm version][npm-version-img]][npm] [![npm downloads last month][npm-downloads-img]][npm]

[PostCSS] plugin to keep rules and at-rules content in order.

Lint and autofix stylesheet order with [stylelint-order].

## Features

* Sorts rules and at-rules content.
* Sorts properties.
* Sorts at-rules by different options.
* Groups properties, custom properties, dollar variables, nested rules, nested at-rules.
* Supports CSS, SCSS (using [postcss-scss]), CSS-in-JS (with [@stylelint/postcss-css-in-js]), HTML (with [postcss-html]), and most likely any other syntax added by other PostCSS plugins.

## Installation

```bash
npm install --save-dev postcss postcss-sorting
```

## Options

The plugin has no default options. Everything is disabled by default.

- [`order`](./lib/order/README.md): Specify the order of content within declaration blocks.
- [`properties-order`](./lib/properties-order/README.md): Specify the order of properties within declaration blocks.
- [`unspecified-properties-position`](./lib/properties-order/unspecified-properties-position.md): Specify position for properties not specified in `properties-order`.
- `throw-validate-errors`: Throw config validation errors instead of showing and ignoring them. Defaults to `false`.

## Caveats

### Handling comments

Comments that are before node and on a separate line linked to that node. Shared-line comments are also linked to that node. Shared-line comments are comments which are located after a node and on the same line as a node.

```css
a {
	top: 5px; /* shared-line comment belongs to `top` */
	/* comment belongs to `bottom` */
	/* comment belongs to `bottom` */
	bottom: 15px; /* shared-line comment belongs to `bottom` */
}
```

### Ignored at-rules

Some at-rules, like [control](https://sass-lang.com/documentation/file.SASS_REFERENCE.html#control_directives__expressions) and [function](https://sass-lang.com/documentation/file.SASS_REFERENCE.html#function_directives) directives in Sass, are ignored. It means rules won't touch content inside these at-rules, as doing so could change or break functionality.

### CSS-in-JS

Plugin will ignore rules, which have template literal interpolation, to avoid breaking the logic:

```js
const Component = styled.div`
	/* The following properties WILL NOT be sorted, because interpolation is on properties level */
	z-index: 1;
	top: 1px;
	${props => props.great && 'color: red'};
	position: absolute;
	display: block;

	div {
		/* The following properties WILL be sorted, because interpolation for property value only */
		z-index: 2;
		position: static;
		top: ${2 + 10}px;
		display: inline-block;
	}
`;
```

## Usage

See [PostCSS] docs for more examples.

### Command Line

Add [postcss-cli](https://github.com/postcss/postcss-cli) and PostCSS Sorting to your project:

```bash
npm install postcss postcss-cli postcss-sorting --save-dev
```

Create a `postcss.config.js` with PostCSS Sorting configuration:

```js
module.exports = {
	plugins: [
		'postcss-sorting': {
			order: [
				'custom-properties',
				'dollar-variables',
				'declarations',
				'at-rules',
				'rules',
			],

			'properties-order': 'alphabetical',

			'unspecified-properties-position': 'bottom',
		},
	],
};
```

Or, add the `'postcss-sorting'` section to your existing `postcss-cli` configuration file.

Next execute:

```bash
npx postcss --no-map --replace your-css-file.css
```

For more information and options, please consult the [postcss-cli docs](https://github.com/postcss/postcss-cli).

### Gulp

Add [gulp-postcss] and PostCSS Sorting to your build tool:

```bash
npm install postcss gulp-postcss postcss-sorting --save-dev
```

Enable PostCSS Sorting within your Gulpfile:

```js
let gulp = require('gulp');
let postcss = require('gulp-postcss');
let sorting = require('postcss-sorting');

exports['sort-css'] = () => {
	return gulp
		.src('./css/src/*.css')
		.pipe(
			postcss([
				sorting({
					/* options */
				}),
			])
		)
		.pipe(gulp.dest('./css/src'));
};
```

### Text editor

This plugin available as [Sublime Text], [Atom], [VS Code], and [Emacs] plugin. Though, seems all these plugins are not maintained.

## Related tools

[stylelint] and [stylelint-order] help lint stylesheets and let you know if stylesheet order is correct. Also, they could autofix stylesheets.

I recommend [Prettier] for formatting stylesheets.

[npm-version-img]: https://img.shields.io/npm/v/postcss-sorting.svg
[npm-downloads-img]: https://img.shields.io/npm/dm/postcss-sorting.svg
[npm]: https://www.npmjs.com/package/postcss-sorting

[PostCSS]: https://github.com/postcss/postcss
[Sublime Text]: https://github.com/hudochenkov/sublime-postcss-sorting
[Atom]: https://github.com/lysyi3m/atom-postcss-sorting
[VS Code]: https://github.com/mrmlnc/vscode-postcss-sorting
[Emacs]: https://github.com/P233/postcss-sorting.el

[gulp-postcss]: https://github.com/postcss/gulp-postcss
[postcss-scss]: https://github.com/postcss/postcss-scss
[postcss-html]: https://github.com/gucong3000/postcss-html
[@stylelint/postcss-css-in-js]: https://github.com/stylelint/postcss-css-in-js
[Prettier]: https://prettier.io/
[stylelint]: https://stylelint.io/
[stylelint-order]: https://github.com/hudochenkov/stylelint-order
