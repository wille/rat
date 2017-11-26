const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TSLintPlugin = require("tslint-webpack-plugin");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const extractSass = new ExtractTextPlugin({
    filename: "[name].[id].css"
});

const config = {
    entry: [
        "react-hot-loader/patch",
        "./src/index.tsx"
    ],
    output: {
        filename: "bundle.js",
        path: __dirname + "/dist"
    },
    devtool: "source-map",
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
            {
                test: /\.tsx?$/,
                loader: [
                    "react-hot-loader/webpack",
                    "ts-loader"
                ]
            },

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
    externals: {

    },
    plugins: [
        extractSass,
        new webpack.HotModuleReplacementPlugin(),
		new webpack.NamedModulesPlugin(),
        new HtmlWebpackPlugin({
            title: "App",
            template: "./src/index.html"
        }),
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
    ],
    devServer: {
        hot: true
    }
};

module.exports = config;