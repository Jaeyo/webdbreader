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

exports.color = {
	blueBlack: '#293a48',
	darkBlue: '#385771',
	darkBlue2: '#284761',
	lightBlue: '#486781',
	lightGray: '#dadada',
	gray: '#bfbfbf',
	darkGray: '#5d5d5d'
};