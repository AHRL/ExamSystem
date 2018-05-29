const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const extractSass = new ExtractTextPlugin({
    filename: "./css/[name].bundle.css"
});
module.exports = {
    entry: {
        login: path.resolve(__dirname, 'resource/js', 'login.js'),
        funExam: path.resolve(__dirname, 'resource/js', 'funExam.js'),
        personal: path.resolve(__dirname, 'resource/js', 'personal.js'),
        exam: path.resolve(__dirname, 'resource/js', 'exam.js'),
        admin: path.resolve(__dirname, 'resource/js', 'admin.js'),
        onlineLib: path.resolve(__dirname, 'resource/js', 'onlineLib.js'),
        'onlineLib_practice': path.resolve(__dirname, 'resource/js', 'onlineLib_practice.js'),
        'practice_completed': path.resolve(__dirname, 'resource/js', 'practice_completed.js')
    },
    output: {
        filename: './js/[name].bundle.js',
        path: path.resolve(__dirname, 'src/main/resources/static/dist')
    },
    module: {
        rules: [{
            test: /\.scss$/,
            use: extractSass.extract({
                use: ["css-loader", "sass-loader"],
                fallback: "style-loader"
            })
        }]
    },
    plugins: [
        extractSass,
        new CleanWebpackPlugin(['src/main/resources/static/dist'])
    ]
};