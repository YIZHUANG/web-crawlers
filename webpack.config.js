const path = require('path');

module.exports = {
  entry: path.join(__dirname, 'src', 'client', 'src', 'index.js'),
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'build')
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /.+\.js/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'stage-0']
        }
      },
      {
        test: /\.css$/,
        include: /node_modules/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'sass-loader'
          }
        ]
      }
    ]
  }
};
