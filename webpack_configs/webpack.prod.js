const webpack = require('webpack');

const config = {
    devtool: 'source-map',
    plugins: [
        new webpack.optimize.UglifyJsPlugin()
    ]
};

module.exports = config;
