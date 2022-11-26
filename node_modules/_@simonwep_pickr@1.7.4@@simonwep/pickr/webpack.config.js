const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: {
        'pickr.es5.min': './src/js/pickr.js',
        'themes/classic.min': './src/scss/themes/classic.scss',
        'themes/nano.min': './src/scss/themes/nano.scss',
        'themes/monolith.min': './src/scss/themes/monolith.scss'
    },

    output: {
        publicPath: 'dist',
        filename: '[name].js',
        library: 'Pickr',
        libraryExport: 'default',
        libraryTarget: 'umd'
    },

    devServer: {
        contentBase: `${__dirname}/`,
        disableHostCheck: true,
        host: '0.0.0.0',
        port: 3005
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader'
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: true,
                            reloadAll: true
                        },
                    },
                    'css-loader',
                    'sass-loader'
                ]
            }
        ]
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css'
        })
    ]
};
