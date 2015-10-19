var _ = require('underscore');

var common = {
	element: 'body',
	position: null,
	allow_dismiss: true,
	newest_on_top: true,
	placement: {
		from: 'top',
		align: 'right'
	},
	offset: 20,
	spacing: 10,
	z_index: 1031,
	delay: 4000,
	timer: 1000,
	url_target: '_blank'
};

/* error({ title: 'blabla', msg: 'wef' }); */
exports.error = function(args) {
	$.notify({
		icon: 'glyphicon glyphicon-warning-sign',
		title: (args.title ? args.title : ''),
		message: args.msg,
		url: null,
		target: '_blank'
	}, _.extend(common, { type: 'danger' }));
};

/* info({ title: 'blabla', msg: 'wef' }); */
exports.info = function(args) {
	$.notify({
		icon: 'glyphicon glyphicon-info-sign',
		title: (args.title ? args.title : ''),
		message: args.msg,
		url: null,
		target: '_blank',
	}, _.extend(common, { type: 'info' }));
};