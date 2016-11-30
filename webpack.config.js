var webpack = require("webpack");
var htmlWebpack = require('html-webpack-plugin');
var path = require('path');
var config = {
    entry: {
        index: './src/js/index.js'
    },
    output: {
        path: __dirname+'/dist/js',
        filename: '[name].js',
    },
    resolveLoader: {
        root: path.join(__dirname, 'node_modules')
    },
    module: {
        loaders: [{
                test: /\.html$/,
                loader: "raw"
            },
            { test: /\.css$/, loader: "style!css" },
            { test: /\.(png|jpg)$/, loader: "url-loader?limit=8192&name=../images/[name].[ext]" }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('development')
            }
        }),
        new htmlWebpack({
            template: __dirname + '/src/index.html',
            filename:__dirname + '/dist/index.html',
            chunks: ['index']
        })
    ],
    devServer: {
        contentBase: __dirname + '/dist',
        inline: true
    }
}
module.exports = config;
