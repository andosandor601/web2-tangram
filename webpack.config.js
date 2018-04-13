const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: {
        app: './src/index.js',
        print: './src/print.js',
        FreeGame: './src/levels/FreeGame.js',
        Rabbit: './src/levels/Rabbit.js',
        Shape: './src/shapes/Shape.js',
        Square: './src/shapes/Square.js',
        Triangle: './src/shapes/Triangle.js',
        Parallelogram: './src/shapes/Parallelogram.js',
        Point: './src/math/Point.js',
        pointAndTriangle: './src/math/pointAndTriangle.js',
        rotate: './src/math/rotate.js',
        distance: './src/math/distance.js'
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            title: 'Tangram'
        })
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
};