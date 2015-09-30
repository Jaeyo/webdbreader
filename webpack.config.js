var webpack = require('webpack');

module.exports = {
	entry: {
		test: [ './static/jsx/test.jsx' ]
	},
	output: {
		path: './static/js',
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


