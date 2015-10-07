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