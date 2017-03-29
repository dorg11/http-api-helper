var webpack = require('webpack');

module.exports = {
    devtool: 'source-map',
    context: __dirname + "/public",
    resolve: {
        extensions: ['', '.js', '.jsx', '.json']
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loaders: ["babel-loader"]
        }, {
            test: /\.css$/,
            loaders: ['style', 'css']
        }]
    },
    plugins: [
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production')
        }
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress:{
          warnings: false
        }
      })
    ],
    entry: "./index.jsx",

    output: {
        filename: "app.js",
        path: __dirname + "/dist",
    }
};
