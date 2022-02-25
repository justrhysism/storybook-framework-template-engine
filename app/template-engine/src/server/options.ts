import { sync } from 'read-pkg-up';
import { LoadOptions } from '@storybook/core-common';

export default {
  packageJson: sync({ cwd: __dirname }).packageJson,
  framework: 'template-engine',
  frameworkPresets: [require.resolve('./framework-preset-template-engine')],
} as LoadOptions;
