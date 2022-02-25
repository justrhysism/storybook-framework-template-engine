const { liquidEngine } = require('../engine');

module.exports = function loader(source, map, meta) {
  const callback = this.async();
  liquidEngine
    .parseAndRender(source)
    .then((result) => callback(null, result, map, meta))
    .catch((error) => callback(error));
};
