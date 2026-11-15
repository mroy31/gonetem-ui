const path = require("path");

// Electron Forge's webpack plugin compiles with its own bundled copy of webpack
// (it depends on a pinned version). A DefinePlugin instance must come from that
// same copy, or its parser hooks call methods the compiler's parser lacks
// (e.g. "parser.getLocation is not a function"). Resolve webpack relative to the
// plugin so the DefinePlugin we add matches the compiler.
const pluginEntry = require.resolve("@electron-forge/plugin-webpack");
const pluginPkgDir = path.dirname(path.dirname(pluginEntry));
const pluginMainDir = path.dirname(pluginEntry);

const webpackPath = require.resolve("webpack", {
    paths: [pluginMainDir, pluginPkgDir, process.cwd()],
});

module.exports = require(webpackPath);
