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
	darkBlue: '#385771',
	darkBlue2: '#284761',
	lightBlue: '#486781',
	lightGray: 'rgb(218, 218, 218)',
	transparentLightGray: 'rgba(222, 222, 222, 0.8)',
	gray: 'rgb(191, 191, 191)',
	darkGray: 'rgb(93, 93, 93)',
	transparentWhite: 'rgba(255, 255, 255, 0.9)',
	background: {
		background: 'linear-gradient(to right,  rgba(64,83,114,1) 0%,rgba(81,124,104,1) 64%,rgba(82,94,61,1) 100%)',
		filter: 'progid:DXImageTransform.Microsoft.gradient( startColorstr="#405372", endColorstr="#525e3d",GradientType=1 )'
	},


};


exports.boxShadow = {
	default: '0 0 3px rgba(66,66,66,0.4)',
	modalBox: '0 0 15px rgba(66,66,66,0.8)',
};