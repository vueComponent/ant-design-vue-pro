module.exports = [
    {
        'filename': 'pickr.es5.min.js',
        'babelConfig': {
            'babelrc': false,
            'plugins': [
                '@babel/plugin-proposal-object-rest-spread',
                '@babel/plugin-proposal-class-properties',
                '@babel/plugin-transform-parameters'
            ],
            'presets': [
                [
                    '@babel/preset-env',
                    {
                        'targets': '> 1%, ie 11',
                        'useBuiltIns': 'usage',
                        'corejs': 3,
                        'loose': true
                    }
                ]
            ]
        }
    },
    {
        'filename': 'pickr.min.js',
        'babelConfig': {
            'babelrc': false,
            'plugins': [
                '@babel/plugin-proposal-class-properties'
            ],
            'presets': [
                [
                    '@babel/preset-env',
                    {
                        'targets': '> 1.5%, not dead, not ie <= 11'
                    }
                ]
            ]
        }
    }
];
