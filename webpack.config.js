const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: "./src/index.js",
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /(jpeg|jpg|svg|gif|png)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: "[name]-[hash]",
                            outputPath: "assets"
                        }
                    }
                ]
            },
            {
                test: /\.html$/,
                use: ['html-loader']
            }
        ]
    },
    plugins: [ new HtmlWebpackPlugin({
        template: './src/template.html'
    }) ]
}