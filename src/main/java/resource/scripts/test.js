chain(
	function() {
		return dbSelect('select * from test_table');
	},
	function(data) {
		return data.join('|').split('\n').join('');
	},
	function(data) {
		writeFile(data);
	}
);




var chain = function() {
	var params = null;
	window.args = arguments; //DEBUG
	for(var i=0; i<arguments.length; i++) {
		if(params == null) params = arguments[i]();
		else params = arguments[i](params);
	}
};

chain(
	function() {
		console.log('cp1');
		return 1;
	}
	,
	function(data) {
		console.log('cp2, data: ' + data);
	}
);