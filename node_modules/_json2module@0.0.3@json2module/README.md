# json2module

Convert a JSON object into an ES6 module. For example, given a package.json file:

```json
{
  "name": "hello-world",
  "version": "0.0.1"
}
```

If you run this through json2module like so:

```json
json2module < package.json
```

You’ll get the following ES6 module as output:

```js
export var name = "hello-world";
export var version = "0.0.1";
```

This is particularly useful for exporting a version number defined in your package.json file when using [Rollup](http://rollupjs.org/). Unlike [rollup-plugin-json](https://github.com/rollup/rollup-plugin-json), which enables Rollup to parse JSON directly, json2module creates standard ES6 modules that can be consumed by any client.
