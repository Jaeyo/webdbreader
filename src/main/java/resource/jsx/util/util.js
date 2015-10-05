exports.handleError = function(err) {
	if(typeof err === 'object') err = JSON.stringify(err);
	bootbox.alert(err);
};

exports.handleResp = function(onSuccess) {
	return function(resp) {
		if(resp.success !== 1) {
			exports.handleError(resp.errmsg);
			return;
		}
		onSuccess(resp);
	}
};