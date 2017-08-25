var webpack = require("webpack");
var plugins = [require('webpack-env')];
plugins.push(new webpack.ProvidePlugin({
  $: "jquery",
  jQuery : "jquery",
  moment : "moment",
  _: "lodash"
}))
if(process.env.NODE_ENV == 'dev' || process.env.NODE_ENV == 'production') {
  plugins.push(new webpack.optimize.UglifyJsPlugin({
    minimize: true,
    compress: { warnings: false, drop_console: true },
    mangle: false
  }))
}

module.exports = {
  output: {
    filename: 'bundle.js'
  },
  module: {
    loaders: [
       { test : /\.html$/, loader: 'raw' },
       { test : /\.css$/, loader: 'style-loader!css-loader' },
       { test : /\.png$/, loader : 'url-loader?limit=100000&mimetype=image/png' },
       { test : /\.jpg$/, loader : 'file-loader' },
       { test : /\.gif$/, loader : 'file-loader' },
       { test : /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader : "url?limit=10000&mimetype=application/font-woff" },
       { test : /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader : "url?limit=10000&mimetype=application/font-woff"	},
       { test : /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader : "url?limit=10000&mimetype=application/octet-stream" },
       { test : /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader : "file" },
       { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,    loader: "url?limit=10000&mimetype=image/svg+xml" }
    ]
  },
  plugins: plugins
};
