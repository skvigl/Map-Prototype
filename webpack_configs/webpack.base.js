const path = require( 'path' );
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const config = {
    entry: {
        styles: './app/styles.js',
        app: './app/app.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve( __dirname, '../dist' ),
        publicPath: "/dist"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            },
            {
                test: /\.hbs$/,
                use: ["handlebars-loader"]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 2048,
                            name: 'images/[name].[ext]'
                        }
                    }
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1000,
                            name: 'fonts/[name].[ext]'
                        }
                    }
                ]
            },
        ]
    },
    resolve: {
        modules: [
            "node_modules",
            "app/components"
        ]
    },
    plugins: [
        new CleanWebpackPlugin(
            [ './dist' ],
            {
                root: path.resolve( __dirname , '..' )
            }
        ),
    ]
};

module.exports = config;
