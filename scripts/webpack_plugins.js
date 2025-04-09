exports.GenerateVersionFilePlugin = function (version) {
  return {
    apply(compiler) {
      compiler.hooks.emit.tapAsync(
        'GenerateVersionFilePlugin',
        (compilation, callback) => {
          const versionContent = `version: ${version}`;
          compilation.assets['version.txt'] = {
            source: function () {
              return versionContent;
            },
            size: function () {
              return versionContent.length;
            },
          };
          callback();
        },
      );
    },
  };
};
