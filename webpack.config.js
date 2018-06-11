var path = require('path')
var webpack = require('webpack')

var webTarget = {
	mode:'production',
	entry: ['./index.js'],
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'main.bundle.js',
		library: "reduxp2p",
  		libraryTarget: "umd"
	},
	module: {
		rules: [

			{
				test: /\.js$/,
				loader: 'babel-loader',
				query: {
					presets: ['env']
				}
			}
		]
	},
	stats: {
		colors: true
	},
	devtool: 'source-map'
}

var nodeTarget = {
	target: 'node',
	mode:'production',
	entry: ['./index.js'],
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'node.js',
		library: "reduxp2p",
	},
	module: {
		rules: [

			{
				test: /\.js$/,
				loader: 'babel-loader',
				query: {
					presets: ['env']
				}
			}
		]
	},
	stats: {
		colors: true
	},
	devtool: 'source-map'
}
module.exports = [nodeTarget, webTarget]