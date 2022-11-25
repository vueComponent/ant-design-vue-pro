# vue-svg-component-builder

This is a small utility library for creating directly-renderable VueJS components from SVG images.
It is primarily designed to be used as a building block for other libraries which will handle the work
of actually reading and parsing the SVGs into something usable by this library.

## Installation

Simply run `yarn add vue-svg-component-builder` or `npm install vue-svg-component-builder`.

## Usage

This library exports a single `build` function which takes in an SVG and returns a view component. Currently
the only accepted format for the input is the AST output of `vue-component-compiler`

```javascript
import { build } from 'vue-svg-component-builder'
import { compile } from 'vue-component-compiler'

let svg = fs.readFileSync('filename.svg').toString()
let compiled = compile(svg)

Vue.extend({
  components: {
    TestSvg: build(compiled.ast)
  }
})
```
