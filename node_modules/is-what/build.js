/* eslint-disable */

// npm install rollup-plugin-typescript2 typescript --save-dev
import typescript from 'rollup-plugin-typescript2'
// import { terser } from 'rollup-plugin-terser'
// import resolve from 'rollup-plugin-node-resolve'

// ------------------------------------------------------------------------------------------
// formats
// ------------------------------------------------------------------------------------------
// amd – Asynchronous Module Definition, used with module loaders like RequireJS
// cjs – CommonJS, suitable for Node and Browserify/Webpack
// esm – Keep the bundle as an ES module file
// iife – A self-executing function, suitable for inclusion as a <script> tag. (If you want to create a bundle for your application, you probably want to use this, because it leads to smaller file sizes.)
// umd – Universal Module Definition, works as amd, cjs and iife all in one
// system – Native format of the SystemJS loader

// ------------------------------------------------------------------------------------------
// setup
// ------------------------------------------------------------------------------------------
const pkg = require('./package.json')
const name = pkg.name
const className = name.replace(/(^\w|-\w)/g, c => c.replace('-', '').toUpperCase())
const external = Object.keys(pkg.dependencies || [])
const plugins = [
  typescript({ useTsconfigDeclarationDir: true, tsconfigOverride: { exclude: ['test/**/*'] } }),
]

// ------------------------------------------------------------------------------------------
// Builds
// ------------------------------------------------------------------------------------------
function defaults (config) {
  // defaults
  const defaults = {
    plugins,
    external,
  }
  // defaults.output
  config.output = config.output.map(output => {
    return Object.assign(
      {
        sourcemap: false,
        name: className,
        exports: 'named',
      },
      output
    )
  })
  return Object.assign(defaults, config)
}

export default [
  defaults({
    input: 'src/index.ts',
    output: [
      { file: 'dist/index.cjs.js', format: 'cjs' },
      { file: 'dist/index.esm.js', format: 'esm' },
    ],
  }),
]
