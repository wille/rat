const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const TSLintPlugin = require("tslint-webpack-plugin");

const extractSass = new ExtractTextPlugin({
    filename: "[name].[chunkhash:8].css"
});

const config = {
    entry: [
        __dirname + "/src/index.tsx",
    ],
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].[chunkhash:8].js",
    },
    resolve: {
        extensions: [
            ".ts",
            ".tsx",
            ".js",
            ".json"
        ]
    },
    module: {
        loaders: [
            // reprocess sourcemaps
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            },
            {
                test: /\.scss$/,
                use: [
                    "css-hot-loader",
                    ...extractSass.extract({
                        fallback: {
                            loader: "style-loader" // creates style nodes from JS strings
                        },
                        use: [
                            {
                                loader: "css-loader" // translates css into commonjs
                            },
                            {
                                loader: "sass-loader" // compiles sass to css
                            }
                        ]
                    })
                ]
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            },
            {
                test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
                loader: "url-loader",
                options: {
                    limit: 10000
                }
            }
        ]
    },
    plugins: [
		new webpack.NamedModulesPlugin(),
        new HtmlWebpackPlugin({
            inject: true,
            template: "./src/index.html"
        }),
        new CaseSensitivePathsPlugin(),
        extractSass,
        new TSLintPlugin({
            files: [
                "./src/**/*.ts",
                "./src/**/*.tsx"
            ]
        }),
        new CopyWebpackPlugin([
            {
                from: "./src/assets",
                to: "assets"
            }
        ])
    ]
};

module.exports = config;
