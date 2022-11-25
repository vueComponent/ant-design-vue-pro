module.exports = {
  babelrc: {
    presets: [
      '@babel/env'
    ],
    sourceMaps: 'inline'
  },
  extensions: ['.js'],
  include: [
    'node_modules/**/src/gl-matrix/**/*.js '
  ],
  exclude: [
    'bower_components/**/*.js',
  ]
}
