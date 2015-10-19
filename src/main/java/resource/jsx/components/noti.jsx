var React = require('react'),
	util = require('util');

var Noti = React.createClass({
	ws: null,

	componentDidMount() {
		this.ws = new WebSocket(util.format('ws://%s/WebSocket/Noti/', window.location.host));
		this.ws.onopen = function() {
			console.log('noti web socket opened');
		};
		this.ws.onmessage = function(evt) {
			var msg = JSON.parse(evt.data);

			if(!msg.type) {
				bootbox.alert('unknown msg: ' + evt.data);
				this.ws.close();
				return;
			} //if

			switch(msg.type) {
				case 'error-log':
					$.notify({
						icon: 'glyphicon glyphicon-warning-sign',
						title: msg.scriptName,
						message: msg.msg,
						url: null,
						target: '_blank'

					}, {
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
						url_target: '_blank',
						type: 'danger'
					});
					break;
				default: 
					bootbox.alert('unknown msg: ' + evt.data);
					this.ws.close();
			} //switch
		}.bind(this);
		this.ws.onclose = function() {
			console.log('noti web socket closed');
		};
		this.ws.onerror = function(err) {
			if(typeof err === 'object') err = JSON.stringify(err);
			console.error(err);
			bootbox.alert(err);
		};
	
	},

	render() { return null; }
});

exports.Noti = Noti;