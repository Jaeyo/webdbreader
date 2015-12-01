var webpack = require('webpack');

module.exports = {
	entry: './src/main/java/resource/jsx/entry.jsx' ,
	output: {
		path: './src/main/java/resource/static/js/',
		filename: 'bundle.js'
	},
	resolve: {
		extensions: ['', '.js', '.jsx']
	},
	module: {
		loaders: [
			{ test: /\.jsx$/, loaders: [ 'jsx-loader', 'babel-loader', 'react-map-styles' ], exclude: /node_modules/ },
			{ test: /\.js$/, loaders: [ 'jsx-loader', 'babel-loader', 'react-map-styles' ], exclude: /node_modules/ },
			{ test: /\.less$/, loader: 'style-loader!css-loader!less-loader', exclude: /node_modules/ },
			{ test: /\.css$/, loader: 'style-loader!css-loader', exclude: /node_modules/ }
		]
	},
};


