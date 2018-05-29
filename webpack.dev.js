const path = require('path');
const common = require('./webpack.common');
const merge = require('webpack-merge');

module.exports = merge(common, {
    devtool: 'inline-source-map',
    devServer: {
        contentBase: path.join(__dirname, 'src/main/resources/templates'),
        open: true,
        publicPath: '/dist/',
        proxy: {
            '/api': 'http://localhost:3000'
        }
    }
});