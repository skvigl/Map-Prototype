// const path = require( 'path' );
// const webpack = require('webpack');
// const CleanWebpackPlugin = require('clean-webpack-plugin');
// //const nodeEnv = process.env.NODE_ENV || 'production';
//
// //console.log( nodeEnv );
//
// const config = {
//     entry: {
//         styles: './app/styles.js',
//         app: './app/app.js'
//     },
//     output: {
//         filename: '[name].js',
//         path: path.resolve( __dirname, 'dist' ),
//         sourceMapFilename: '[name].map'
//     },
//     //devtool: 'cheap-eval-source-map',
//     devServer: {
//         headers: {
//             "Access-Control-Allow-Origin": "*",
//             "Access-Control-Allow-Credentials": 'true'
//         },
//         hot: true,
//     },
//     module: {
//         rules: [
//             {
//                 test: /\.js$/,
//                 exclude: /node_modules/,
//                 loader: "babel-loader"
//             },
//             {
//                 test: /\.scss$/,
//                 use: [
//                     'style-loader',
//                     'css-loader',
//                     'sass-loader'
//                 ]
//             },
//             {
//                 test: /\.hbs$/,
//                 use: ["handlebars-loader"]
//             },
//             {
//                 test: /\.(png|svg|jpg|gif)$/,
//                 use: [
//                     {
//                         loader: 'url-loader',
//                         options: {
//                             limit: 2048,
//                             name: 'images/[name].[ext]'
//                         }
//                     }
//                 ]
//             },
//             {
//                 test: /\.(woff|woff2|eot|ttf|otf)$/,
//                 use: [
//                     {
//                         loader: 'url-loader',
//                         options: {
//                             name: 'fonts/[name].[ext]'
//                         }
//                     }
//                 ]
//             },
//             // font-awesome export
//             {
//                 test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
//                 use: [
//                     {
//                         loader: 'url-loader',
//                         options: {
//                             limit: 10000,
//                             mimetype: 'application/font-woff',
//                             name: 'fonts/[name].[ext]'
//                         }
//                     }
//                 ]
//             },
//         ]
//     },
//     resolve: {
//         modules: [
//             "node_modules",
//             "app/components"
//         ]
//     },
//     plugins: [
//         new CleanWebpackPlugin(['dist']),
//         new webpack.HotModuleReplacementPlugin()
//     ]
//     // module: {
//     //     loaders: {
//     //         test: /\.js$/,
//     //         exclude: 'node_modules',
//     //         loader: 'babel',
//     //         query: {
//     //             presets: ['env'],
//     //             plugins: [
//     //                 'transform-object-assign'
//     //             ]
//     //         }
//     //     }
//     // },
//     // plugins: [
//     //
//     // ]
// };
//
// module.exports = config;


var path = require('path');
var merge = require('webpack-merge');

const configs = {
    base: require('./webpack_configs/webpack.base'),
    dev: require('./webpack_configs/webpack.dev'),
    prod: require('./webpack_configs/webpack.prod'),
    serve: require('./webpack_configs/webpack.serve')
};

var TARGET = process.env.npm_lifecycle_event;

if (TARGET === 'dev') {
    module.exports = merge( configs.base, configs.dev );
}

if (TARGET === 'prod') {
    module.exports = merge( configs.base, configs.prod );
}

if (TARGET === 'serve') {
    module.exports = merge( configs.base, configs.serve );
}
