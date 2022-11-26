module.exports = {
  babelrc: {
    presets: [
      [
        "env",
        {
          "loose": true,
          "modules": false
        }
      ]
    ],
    sourceMaps: 'inline'
  },
  extensions: ['.js'],
  include: [
    'node_modules/**/src/gl-matrix/**/*.js'
  ],
  exclude: [
    'bower_components/**/*.js',
  ]
}
