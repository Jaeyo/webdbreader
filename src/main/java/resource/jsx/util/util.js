exports.handleError = function(err) {
	if(err.statusText) err = err.statusText;
	bootbox.alert(err);
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

exports.color = function(colorName) {
	switch(colorName) {
		case 'blue-black':
			return '#293a48';

		case 'light-blue':
			return '#385771';
		case 'light-blue2':
			return '#6c91ba';

		case 'light-gray':
			return '#dadada';
		case 'dark-gray':
			return '#5d5d5d';
		default: 
			return null;
	}
};