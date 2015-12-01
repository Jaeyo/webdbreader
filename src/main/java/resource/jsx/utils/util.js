var noti = require('./noti.js');

exports.handleError = function(err) {
	if(err.statusText) err = err.statusText;
	noti.error(err);
};

exports.handleResp = function(onSuccess) {
	return function(resp) {
		if(resp.success !== 1) {
			exports.handleError(resp.errmsg);
			return;
		}
		onSuccess(resp);
	};
};

exports.handleErrorPromise = function(reject) {
	return function(err) {
		reject(err);
	};
};

exports.handleRespPromise = function(reject, onSuccess) {
	return function(resp) {
		if(resp.success !== 1) {
			exports.handleErrorPromise(resp.errmsg, reject);
			return;
		}
		onSuccess(resp);
	};
};

exports.assertNotNullAndEmpty = function(obj) {
	if(obj == null) return false;
	if(typeof obj === 'string' && obj.length == 0) return false;
	return true;
};

exports.color = {
	blueBlack: '#293a48',
	darkBlue: '#425361',
	darkBlue_OLD: '#385771',
	darkBlue2: '#284761',
	lightBlue: '#486781',
	lightGray: 'rgb(218, 218, 218)',
	transparentLightGray: 'rgba(222, 222, 222, 0.8)',
	gray: 'rgb(191, 191, 191)',
	darkGray: 'rgb(93, 93, 93)',
	darkGray2: 'rgb(73, 73, 73)',
	darkGray3: 'rgb(43, 43, 43)',
	red: 'rgb(192, 0, 0)',
	blue: 'rgb(41, 128, 185)',
	contentsBackground: 'rgba(255, 255, 255, 0.9)',
	background: {
		background: 'linear-gradient(to right,  rgba(64,83,114,1) 0%,rgba(81,124,104,1) 64%,rgba(82,94,61,1) 100%)',
		filter: 'progid:DXImageTransform.Microsoft.gradient( startColorstr="#405372", endColorstr="#525e3d",GradientType=1 )'
	},


};


exports.boxShadow = {
	default: '0 0 3px rgba(66,66,66,0.4)',
	modalBox: '0 0 15px rgba(66,66,66,0.8)',
};


exports.initPrototypeFunctions = function() {
	Object.sortedForEach = function(obj, callback) {
		var keyArr = [];
		Object.keys(obj).forEach(function(key) {
			keyArr.push(key);
		});

		keyArr.sort();

		keyArr.forEach(function(key) {
			var value = obj[key];
			callback(key, value);
		}.bind(this));
	};

	String.contains = function(src, target) {
		return src.indexOf(target) != -1;
	};

	String.containsIgnoreCase = function(src, target) {
		return src.toLowerCase().indexOf(target.toLowerCase()) != -1;
	};

	Array.contains = function(arr, item) {
		return arr.indexOf(item) !== -1;
	};

	Array.containsIgnoreCase = function(arr, strItem) {
		var arrClone = JSON.parse(JSON.stringify(arr));
		for(var i=0; i<arr.length; i++)
			arrClone[i] = arrClone[i].toLowerCase();
		return arrClone.indexOf(strItem.toLowerCase()) !== -1;
	};

	Array.prototype.remove = require('array-remove-by-value');

	window.onerror = function(errMsg, url, lineNumber, column, errorObj) {
		if(errorObj && errorObj.stack) console.error(errorObj.stack);
	};

	Object.equals = function( x, y ) {
		 if ( x === y ) return true;
		 if ( ! ( x instanceof Object ) || ! ( y instanceof Object ) ) return false;
		 if ( x.constructor !== y.constructor ) return false;

		 for ( var p in x ) {
		 	if ( ! x.hasOwnProperty( p ) ) continue;
		 	if ( ! y.hasOwnProperty( p ) ) return false;
		 	if ( x[ p ] === y[ p ] ) continue;
		 	if ( typeof( x[ p ] ) !== "object" ) return false;
		 	if ( ! Object.equals( x[ p ],  y[ p ] ) ) return false;
		 }

		for ( p in y ) {
			if ( y.hasOwnProperty( p ) && ! x.hasOwnProperty( p ) ) return false;
		}
		return true;
	}
};