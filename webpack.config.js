const path = require('path');

module.exports = {
    entry: {
        main: "./src/index.js",
        vendor: "./src/vendor.js"
    },
    module: {
        rules: [
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
    }
}