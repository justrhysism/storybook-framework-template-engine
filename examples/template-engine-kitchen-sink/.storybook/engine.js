const { Liquid } = require('liquidjs');

const templatesDir = 'templates';

module.exports = {
  templatesDir, // Relative to `/src`
  liquidEngine: new Liquid({
    root: templatesDir,
    extname: '.liquid', // Allows omission of '.liquid` extension
  }),
};
