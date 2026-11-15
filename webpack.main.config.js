const webpack = require('./scripts/forge-webpack');
const { readEditionEnv } = require('./scripts/edition-env');

const { edition, studentServerUri } = readEditionEnv();

module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/index.ts',
  // Put your normal webpack config below here
  module: {
    rules: require('./webpack.rules'),
  },
  plugins: [
    new webpack.DefinePlugin({
      __APP_EDITION__: JSON.stringify(edition),
      __STUDENT_SERVER_URI__: JSON.stringify(studentServerUri),
    }),
  ],
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json']
  },
  optimization: {
    minimize: false
  }
};
