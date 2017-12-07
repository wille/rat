const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const webpack = require("webpack");

const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');

module.exports = merge(common, {
    devtool: "source-map",
    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                loader: [
                    "react-hot-loader/webpack",
                    "ts-loader"
                ]
            }
        ]
    },
    plugins: [
        new WatchMissingNodeModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        hot: true
    }
});