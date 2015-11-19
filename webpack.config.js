var webpack = require('webpack');

module.exports = {
	entry: {
		script: [ './src/main/java/resource/jsx-new/script.jsx' ],
		newdb2file: [ './src/main/java/resource/jsx-new/new-db2file.jsx' ],
		api: [ './src/main/java/resource/jsx-new/api.jsx' ]
	},
	output: {
		path: './src/main/java/resource/static/js/bundle/',
		filename: 'new.[name].bundle.js'
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


