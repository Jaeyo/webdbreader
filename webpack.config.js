var webpack = require('webpack');

module.exports = {
	entry: {
		base: [ './src/main/java/resource/jsx/base.jsx' ]
	},
	output: {
		path: './src/main/java/resource/js/',
		filename: '[name].bundle.js'
	},
	resolve: {
		extensions: ['', '.js', '.jsx']
	},
	module: {
		loaders: [
			{ test: /\.jsx$/, loader: 'jsx-loader!babel-loader', exclude: /node_modules/ },
			{ test: /\.js$/, loader: 'jsx-loader!babel-loader', exclude: /node_modules/ },
			{ test: /\.css$/, loader: 'style-loader!css-loader', exclude: /node_modules/ }
		]
	}
};


