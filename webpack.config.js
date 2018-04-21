var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: ['whatwg-fetch','./js/index.jsx'],
    output: {
        filename: "out.js",
        path: path.resolve(__dirname, 'out')
    },
    resolve: {
        extensions: [".jsx", ".js", "scss", "css"]
    },
    mode: 'development',
    watch: true,

    module: {

        rules: [
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015', 'stage-2', 'react']
                    }
                }
            },
            {
                test: /\.css$/,
                loaders: ['style-loader', 'css-loader'],
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('css-loader!sass-loader')
            },
            {
                test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
                loader: 'url-loader',
                options: {
                    limit: 10000
                }
            }

        ],


}, plugins: [
        new ExtractTextPlugin('style.css', {
            allChunks: true
        })
    ]
}

