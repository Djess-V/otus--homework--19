import "webpack-dev-server";
import * as webpack from "webpack";
import { resolve } from "node:path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";

type Mode = "none" | "production" | "development" | undefined;

const NODE_ENV: Mode = process.env.NODE_ENV as Mode;

// const PREFIX = NODE_ENV === "production" ? "/otus--homework--19" : "";

const config: webpack.Configuration = {
  entry: { index: resolve(__dirname, "./src/index.ts") },
  resolve: {
    extensions: [".js", ".ts"],
  },
  output: {
    path: resolve(__dirname, "dist"),
    filename: "[name].[hash].js",
    clean: true,
    environment: {
      arrowFunction: false,
    },
    publicPath: NODE_ENV === "production" ? "/otus--homework--19/" : "/",
  },
  module: {
    rules: [
      {
        test: /\.(t|j)s$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.s[ac]ss$/i,
        exclude: /node_modules/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
        type: "asset/resource",
        generator: {
          filename: "images/[name][ext]",
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html",
    }),
    new HtmlWebpackPlugin({
      template: "index.html",
      filename: "404.html",
    }),
    // new webpack.DefinePlugin({
    //   PRODUCTION: NODE_ENV === "production",
    //   PREFIX: JSON.stringify(PREFIX),
    // }),
    new MiniCssExtractPlugin(),
  ],
  optimization: {
    minimizer: [`...`, new CssMinimizerPlugin()],
  },
  devServer: {
    compress: true,
    port: 9000,
    watchFiles: ["index.html"],
    historyApiFallback: true,
  },
};

export default config;
