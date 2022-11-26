# Vue SVG Icon Loader for webpack

This is a webpack loader that turns SVG icons into directly-importable vuejs components.
You can import these and use them directly in your Vue applications:

```vue
<template>
  <div>
    <my-icon width='1.5em' height='1.5em'/>
  </div>
</template>

<script>
import MyIcon from './my-icon.svg'

export default {
  components: {
    MyIcon
  },
}
</script>
```

SVG attributes can be overridden with CSS or inline on the icon element in your template.
See the [example project](./examples/basic/src/components/IconsDemo.vue) for
more usage examples.

### Caveats

While the 1.x version of this project was originally designed to work with
[`svg-sprite-loader`](https://github.com/kisenka/svg-sprite-loader), this was no longer
necessary for my use-case and I found the loader only added complexity without offering
a lot of benefit. If down the line other users want to take advantage of the sprite loader
then I'm glad to add that back in as a possible configuration option, but it didn't make
sense to support without knowing people were using it.  The 1.x branch should still work
for you, however

## Getting Started

### Examples

There is a sample Vue + Webpack project in the `examples/` directory that shows
how to use this in an application.

### Installation

```
yarn add -D vue-svg-icon-loader
```

or

```
npm install --save-dev vue-svg-icon-loader
```

You will also need to add a runtime dependency on `vue-svg-component-runtime`: `yarn add vue-svg-component-runtime`

### Configuration

Create or update `webpack.config.js` like so:

``` javascript
  module.exports = {
    entry: './app.js',
    output: {
      filename: 'bundle.js'
    },
    module: {
      rules: [
        // ... other configured loaders
        {
          test: /\.svg$/,
          use: [
            'vue-svg-icon-loader',
          ],
        }
      ]
    }
  }
```

#### Options

You an also provide options to the loader:

``` javascript
{
  test: /\.svg$/,
  use: [
    {
      loader: 'vue-svg-icon-loader',
      options: {
        defaultScale: number | undefined
      }
    }
  ]
}
```

##### `defaultScale`

`default = 1`

Setting this to an integer will multiply the SVG `viewBox` dimensions by this number in
each component.  This can be overridden per component instnace by passing a `scale` prop.

### Typescript

Importing svg files as Vue components in typescript requires one additional setup step.
You will need to provide a type definition for `.svg` files so that typescript knows to treat
them as a vue component.  If you haven't done this, you'll see typescript reporting
"module not found" errors.  Create a `svg.d.ts` file wherever you store external type
defintions, and add the following content:

```typescript
declare module "*.svg" {
  import Vue from 'vue'
  export default Vue
}
```

*Note*: If anyone knows a way for this loader to provide this for projects automatically,
please open an issue and let me know!

## Contributing

I want you to help make this even better. Please feel free to contribute; if you have any
problems or feature suggestions, please open an issue on Github.

## License

MIT License
