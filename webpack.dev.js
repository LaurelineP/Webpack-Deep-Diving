const path = require('path');
const merge = require('webpack-merge');
const config = require('./webpack.config');

module.exports = merge( config, {
    mode: "development",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, 'dist')
    }
})