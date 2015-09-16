/*eslint-disable */

var path = require('path');

var bitcoreExternal = {
  root: 'Bitcore',
  commonjs2: 'bitcore',
  commonjs: 'bitcore',
  amd: 'bitcore'
};

module.exports = {
  externals: {
    'bitcore': bitcoreExternal
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel?stage=0',
        include: path.join(__dirname, 'src')
      }
    ],
  },
  output: {
    library: 'chainscript',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['', '.js']
  }
};
