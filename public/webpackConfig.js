const webpack_manifest = require('webpack-pwa-manifest');
const path = require('path');

const config = {
  entry: {
    app: './assets/js/index.js'
  },
  output: {
    path: __dirname + '/dist',
    filename: '[name].bundle.js',

  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },

  plugins: [
    new webpack_manifest({
      fingerprints: false,
      name: 'Progressive Budget Tracker',
      short_name: 'Tracker',
      description: 'An application that tracks progressive budget.',
      background_color: '#51a64e',
      theme_color: '#ffffff',
      'theme-color': '#ffffff',
      start_url: '/',
      icons: [
        {
          src: path.resolve('public/icons/icon-192x192.png'),
          sizes: [96, 128, 192, 256, 384, 512],
          destination: path.join('assets', 'icons'),
        },
      ],
    }),
  ],
};

module.exports = config;