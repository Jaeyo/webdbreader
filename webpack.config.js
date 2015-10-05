var webpack = require('webpack');

module.exports = {
	entry: {
		base: [ './src/main/java/resource/jsx/base.jsx' ],
		config: [ './src/main/java/resource/jsx/config.jsx' ],
		'view-script': [ './src/main/java/resource/jsx/view-script.jsx' ],
		'edit-script': [ './src/main/java/resource/jsx/edit-script.jsx' ],
		index: [ './src/main/java/resource/jsx/index.jsx' ]
	},
	output: {
		path: './src/main/java/resource/static/js/bundle/',
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


