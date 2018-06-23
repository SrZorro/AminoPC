// const webpack = require("webpack");
// const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const path = require("path");
const transformInferno = require("ts-transform-inferno").default;

module.exports = [
    Object.assign({
        target: "electron-main",
        entry: "./src/main/main.ts",
        mode: "development",
        output: {
            path: path.resolve(__dirname, "dist/webpack"),
            filename: "main.js"
        },
        node: {
            __dirname: false
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    loader: "ts-loader",
                    exclude: /node_modules/
                }
            ]
        }
    }),
    Object.assign({
        target: "electron-renderer",
        entry: "./src/renderer/App.tsx",
        mode: "development",
        output: {
            path: path.resolve(__dirname, "dist/webpack"),
            filename: "bundle.js"
        },
        node: {
            __dirname: false
        },
        resolve: {
            mainFields: ["main"], // Important so Webpack resolves the main field of package.json for Classcat
            extensions: [".js", ".jsx", ".ts", ".tsx"]
        },
        module: {
            rules: [
                {
                    test: /\.tsx$/,
                    loader: "ts-loader",
                    options: {
                        getCustomTransformers: () => ({
                            before: [transformInferno()]
                        })
                    },
                    exclude: /node_modules/
                },
                {
                    test: /\.ts$/,
                    loader: "ts-loader",
                    exclude: /node_modules/
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: "./src/renderer/index.html",
                inject: "body"
            }),
            new CopyWebpackPlugin([{
                from: "package.json", to: "."
            }])
            // new CleanWebpackPlugin(["build"], {
            //     verbose: true
            // }),
            // By default, webpack does `n=>n` compilation with entry files. This concatenates
            // them into a single chunk.
            // new webpack.optimize.LimitChunkCountPlugin({
            //     maxChunks: 1
            // }),
            // new webpack.HotModuleReplacementPlugin()
        ]
    })
];