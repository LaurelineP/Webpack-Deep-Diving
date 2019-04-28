const path = require('path');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const config = require('./webpack.config');

module.exports = merge(config, {
    mode: "production",
    output: {
        filename: "main-[contentHash].js",
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new CleanWebpackPlugin()
    ]
})