/* eslint-disable */
require('colors');
var precss = require('precss');
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: [
     './public/index.js'
    ],
    output: {
        path: __dirname + '/public/static/',
        publicPath: '/',
        filename: 'bundle.js'
    },
    module: {
        loaders: [{
            exclude: [/node_modules/, /static/],
            loader: 'babel'
        }, {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract('style-loader', 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader')
        },{
            test: /\.(jpe?g|png|gif|svg)$/i,
            loaders: [
                'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
                'image-webpack-loader?bypassOnDebug&optimizationLevel=7&interlaced=false'
            ]
        }]
    },
    postcss: function() {
        return [precss, autoprefixer];
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    plugins: [
        function () {
            this.plugin('watch-run', function (watching, callback) {
                console.log(('Begin compile at ' + new Date()).cyan.bold);
                callback();
            })
        },
        new ExtractTextPlugin('style.css', { allChunks: true })
    ],
    watch: true
}
/* eslint-enable */
