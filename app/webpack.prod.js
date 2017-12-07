const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const webpack = require("webpack");
const path = require("path");

const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = merge(common, {
    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                loader: [
                    "ts-loader"
                ]
            }
        ]
    },
    plugins: [
        new UglifyJSPlugin(),
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify("production")
        }),
        new CleanWebpackPlugin([
            "dist"
        ], {
            verbose: false
        })
    ]
});
