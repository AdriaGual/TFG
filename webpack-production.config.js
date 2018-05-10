const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const config = {
	entry: { main: [ './src/app/app.js' ] },
	// Render source-map file for final build
	devtool: 'source-map',
	// output config
	output: {
		path: path.resolve(__dirname, 'build'), // Path of output file
		filename: 'app.js' // Name of output file
	},
	plugins: [
		// Define production build to allow React to strip out unnecessary checks
		new webpack.DefinePlugin({'process.env':{'NODE_ENV': JSON.stringify('production')}}),
		// Minify the bundle
		new webpack.optimize.UglifyJsPlugin({sourceMap: true,}),
		// Copy modified www files into build
		new CopyWebpackPlugin([{from:'src/www'},], { ignore: [], copyUnmodified: false })
	],
	module: {
		rules: [{
			test: /\.js$/,
			exclude: /node_modules/,
			loader: 'babel-loader',
			query: { cacheDirectory: true }
		}]
	},
};

module.exports = config;