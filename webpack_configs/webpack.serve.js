const path = require( 'path' );
const webpack = require('webpack');

console.log( 'dirname', __dirname );
const config = {
    devtool: 'source-map',
    devServer: {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": 'true'
        },
        hot: true,
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
};

module.exports = config;
