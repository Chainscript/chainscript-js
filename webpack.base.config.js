/*eslint-disable */

var path = require('path');

var bitcoreExternal = {
  root: 'Bitcore',
  commonjs2: 'bitcore',
  commonjs: 'bitcore',
  amd: 'bitcore'
};

var bitcoreMessageExternal = {
  root: 'BitcoreMessage',
  commonjs2: 'bitcore-message',
  commonjs: 'bitcore-message',
  amd: 'bitcore-message'
};

module.exports = {
  externals: {
    'bitcore': bitcoreExternal,
    'bitcore-message': bitcoreMessageExternal
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
