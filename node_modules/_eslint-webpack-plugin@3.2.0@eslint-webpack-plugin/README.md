<div align="center">
  <a href="https://github.com/eslint/eslint"><img width="200" height="200" src="https://cdn.worldvectorlogo.com/logos/eslint.svg"></a>
  <a href="https://github.com/webpack/webpack"><img width="200" height="200" src="https://webpack.js.org/assets/icon-square-big.svg"></a>
</div>

[![npm][npm]][npm-url]
[![node][node]][node-url]
[![tests][tests]][tests-url]
[![coverage][cover]][cover-url]
[![chat][chat]][chat-url]
[![size][size]][size-url]

# eslint-webpack-plugin

> This is eslint-webpack-plugin 3.0 which works only with webpack 5. For the webpack 4, see the [2.x branch](https://github.com/webpack-contrib/eslint-webpack-plugin/tree/2.x).

This plugin uses [`eslint`](https://eslint.org/) to find and fix problems in your JavaScript code

## Getting Started

To begin, you'll need to install `eslint-webpack-plugin`:

```console
npm install eslint-webpack-plugin --save-dev
```

or

```console
yarn add -D eslint-webpack-plugin
```

or

```console
pnpm add -D eslint-webpack-plugin
```

> **Note**
>
> You also need to install `eslint >= 7` from npm, if you haven't already:

```console
npm install eslint --save-dev
```

or

```console
yarn add -D eslint
```

or

```console
pnpm add -D eslint
```

Then add the plugin to your webpack config. For example:

```js
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
  // ...
  plugins: [new ESLintPlugin(options)],
  // ...
};
```

## Options

You can pass [eslint options](https://eslint.org/docs/developer-guide/nodejs-api#-new-eslintoptions).

> **Note**
>
> The config option you provide will be passed to the `ESLint` class.
> This is a different set of options than what you'd specify in `package.json` or `.eslintrc`.
> See the [eslint docs](https://eslint.org/docs/developer-guide/nodejs-api#-new-eslintoptions) for more details.

> **Warning**:
>
> In eslint-webpack-plugin version 1 the options were passed to the now deprecated [CLIEngine](https://eslint.org/docs/developer-guide/nodejs-api#cliengine).

### `context`

- Type:

```ts
type context = string;
```

- Default: `compiler.context`

A string indicating the root of your files.

### `eslintPath`

- Type:

```ts
type eslintPath = string;
```

- Default: `eslint`

Path to `eslint` instance that will be used for linting. If the `eslintPath` is a folder like a official eslint, or specify a `formatter` option. now you don't have to install `eslint`.

### `extensions`

- Type:

```ts
type extensions = string | Array<string>;
```

- Default: `'js'`

Specify extensions that should be checked.

### `exclude`

- Type:

```ts
type exclude = string | Array<string>;
```

- Default: `'node_modules'`

Specify the files and/or directories to exclude. Must be relative to `options.context`.

### `resourceQueryExclude`

- Type:

```ts
type resourceQueryExclude = RegExp | Array<RegExp>;
```

- Default: `[]`

Specify the resource query to exclude.

### `files`

- Type:

```ts
type files = string | Array<string>;
```

- Default: `null`

Specify directories, files, or globs. Must be relative to `options.context`.
Directories are traversed recursively looking for files matching `options.extensions`.
File and glob patterns ignore `options.extensions`.

### `fix`

- Type:

```ts
type fix = boolean;
```

- Default: `false`

Will enable [ESLint autofix feature](https://eslint.org/docs/developer-guide/nodejs-api#-eslintoutputfixesresults).

**Be careful: this option will change source files.**

### `formatter`

- Type:

```ts
type formatter = string| (
  results:  Array<import('eslint').ESLint.LintResult>,
  data?: import('eslint').ESLint.LintResultData | undefined
) => string
```

- Default: `'stylish'`

Accepts a function that will have one argument: an array of eslint messages (object). The function must return the output as a string. You can use official [eslint formatters](https://eslint.org/docs/user-guide/formatters/).

### `lintDirtyModulesOnly`

- Type:

```ts
type lintDirtyModulesOnly = boolean;
```

- Default: `false`

Lint only changed files, skip lint on start.

### `threads`

- Type:

```ts
type threads = boolean | number;
```

- Default: `false`

Will run lint tasks across a thread pool. The pool size is automatic unless you specify a number.

### Errors and Warning

**By default the plugin will auto adjust error reporting depending on eslint errors/warnings counts.**
You can still force this behavior by using `emitError` **or** `emitWarning` options:

#### `emitError`

- Type:

```ts
type emitError = boolean;
```

- Default: `true`

The errors found will always be emitted, to disable set to `false`.

#### `emitWarning`

- Type:

```ts
type emitWarning = boolean;
```

- Default: `true`

The warnings found will always be emitted, to disable set to `false`.

#### `failOnError`

- Type:

```ts
type failOnError = boolean;
```

- Default: `true`

Will cause the module build to fail if there are any errors, to disable set to `false`.

#### `failOnWarning`

- Type:

```ts
type failOnWarning = boolean;
```

- Default: `false`

Will cause the module build to fail if there are any warnings, if set to `true`.

#### `quiet`

- Type:

```ts
type quiet = boolean;
```

- Default: `false`

Will process and report errors only and ignore warnings, if set to `true`.

#### `outputReport`

- Type:

```ts
type outputReport =
  | boolean
  | {
      filePath?: string | undefined;
      formatter?:
        | (
            | string
            | ((
                results: Array<import('eslint').ESLint.LintResult>,
                data?: import('eslint').ESLint.LintResultData | undefined
              ) => string)
          )
        | undefined;
    };
```

- Default: `false`

Write the output of the errors to a file, for example a checkstyle xml file for use for reporting on Jenkins CI.

The `filePath` is an absolute path or relative to the webpack config: `output.path`.
You can pass in a different `formatter` for the output file,
if none is passed in the default/configured formatter will be used.

## Changelog

[Changelog](CHANGELOG.md)

## License

[MIT](./LICENSE)

[npm]: https://img.shields.io/npm/v/eslint-webpack-plugin.svg
[npm-url]: https://npmjs.com/package/eslint-webpack-plugin
[node]: https://img.shields.io/node/v/eslint-webpack-plugin.svg
[node-url]: https://nodejs.org
[tests]: https://github.com/webpack-contrib/eslint-webpack-plugin/workflows/eslint-webpack-plugin/badge.svg
[tests-url]: https://github.com/webpack-contrib/eslint-webpack-plugin/actions
[cover]: https://codecov.io/gh/webpack-contrib/eslint-webpack-plugin/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/eslint-webpack-plugin
[chat]: https://badges.gitter.im/webpack/webpack.svg
[chat-url]: https://gitter.im/webpack/webpack
[size]: https://packagephobia.now.sh/badge?p=eslint-webpack-plugin
[size-url]: https://packagephobia.now.sh/result?p=eslint-webpack-plugin
