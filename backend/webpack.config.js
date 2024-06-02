import nodeExternals from "webpack-node-externals";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import path from "path";

export default {
  entry: "./src/index.ts",
  target: "node",
  mode: "development",
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: "ts-loader",
          options: {
            transpileOnly: true,
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    filename: "bundle.cjs",
    path: path.resolve(new URL("./dist", import.meta.url).pathname),
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin(), // Плагин для асинхронной проверки типов
  ],
};
