<h1 align="center">svg-to-vue</h1>
<p align="center">Utility to convert SVG code into Vue component definition</p>

## Instalation
``` bash
npm i svg-to-vue vue-template-compiler

yarn add svg-to-vue vue-template-compiler
```

## Usage
``` js
const svgToVue = require('svg-to-vue');

const code = `
  <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="red" />
  </svg>
`;

svgToVue(code)
  .then((component) => {
    // `component` contains Vue component definition
    console.log(component);
  });
```

## API
``` js
svgToVue(code, {
  svgoConfig: {
    plugins: [
      {
        prefixIds: true,
      },
    ],
  },
  svgoPath: 'some/path/to.svg',
});
```

| Name | Type | Default value | Description |
| - | - | - | - |
| `svgoConfig` | `Object`/`Boolean` | `{}` | Configuration object passed to SVGO or `false` to disable optimization |
| `svgoPath` | `String` | `null` | Path to SVG file which is used by SVGO `prefixIds` plugin to generate unique IDs |
