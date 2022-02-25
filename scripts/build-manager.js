const { buildStaticStandalone } = require('../lib/core-server/dist/cjs/build-static');

process.env.NODE_ENV = 'production';

buildStaticStandalone({
  ignorePreview: true,
  outputDir: './lib/manager-webpack4/prebuilt',
  configDir: './scripts/build-manager-config',
});

buildStaticStandalone({
  ignorePreview: true,
  outputDir: './lib/manager-webpack5/prebuilt',
  configDir: './scripts/build-manager-config',
});
