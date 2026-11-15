const webpack = require('./scripts/forge-webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { readEditionEnv } = require('./scripts/edition-env');

const { edition, studentServerUri } = readEditionEnv();

module.exports = [
  new ForkTsCheckerWebpackPlugin(),
  new webpack.DefinePlugin({
    __APP_EDITION__: JSON.stringify(edition),
    __STUDENT_SERVER_URI__: JSON.stringify(studentServerUri),
  }),
];
