const { getDefaultConfig } = require("@expo/metro-config");

const config = getDefaultConfig(__dirname);
const tslibPath = require.resolve("tslib/tslib.es6.js");

config.resolver.unstable_enablePackageExports = false;
config.resolver.sourceExts = [...new Set([...config.resolver.sourceExts, "cjs", "mjs"])];
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "tslib") {
    return {
      type: "sourceFile",
      filePath: tslibPath,
    };
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
