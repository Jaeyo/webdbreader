var editor = null;

Model = function(){
	this.scriptName = $('input#script-name[type="hidden"]').val();
}; //INIT
Model.prototype = {
}; //Model

View = function(){
}; //INIT
View.prototype = {
}; //View

Controller = function(){
}; //INIT
Controller.prototype = {
	startScript: function(){
		$.post('/REST/Script/Start/{}/'.format(model.scriptName), {}, function(resp){
			if(resp.success !== 1){
				bootbox.alert(JSON.stringify(resp));
				return;
			} //if

			bootbox.alert('script started', function(){
				location.reload(true);
			});
		}, 'json');
	}, //startScript

	stopScript: function(){
		$.post('/REST/Script/Stop/{}/'.format(model.scriptName), {}, function(resp){
			if(resp.success !== 1){
				bootbox.alert(JSON.stringify(resp));
				return;
			} //if

			bootbox.alert('script stopped', function(){
				location.reload(true);
			});
		}, 'json');
	}, //stopScript

	rename: function(){
		bootbox.prompt('new title: ', function(newTitle){
			if(newTitle === null)
				return;

			$.post('/REST/Script/Rename/{}/'.format(model.scriptName), { newTitle: newTitle }, function(resp){
				if(resp.success !== 1){
					bootbox.alert(JSON.stringify(resp));
					return;
				} //if

				bootbox.alert('script renamed', function(){
					location.href = '/Script/View/{}/'.format(newTitle);
				});
			});
		});
	}, //rename

	remove: function(){
		bootbox.confirm('remove', function(result){
			if(result === false)
				return;

			$.post('/REST/Script/Remove/{}/'.format(model.scriptName), {}, function(resp){
				if(resp.success !== 1){
					bootbox.alert(JSON.stringify(resp));
					return;
				} //if

				bootbox.alert('script removed', function(){
					location.href = '/';
				});
			});
		});
	} //remove
}; //Controller

LogMonitoringWS = function(){
	this.logMonitoringDOM = $('div.log-monitoring-panel ul');
	this.ws = null;
}; //INIT
LogMonitoringWS.prototype = {
	start: function() {
		if(this.ws)
			ws.close();

		this.logMonitoringDOM.empty();

		this.ws = new WebSocket('ws://{}/WebSocket/Logger/'.format(window.location.host));
		this.ws.onopen = function(){
			this.ws.send(JSON.stringify({ scriptName: model.scriptName }));
		}.bind(this); //onopen
		this.ws.onmessage = function(evt) {
			var domTemplate = $('script#log-monitoring-item[type="x-jade"]').html();
			var data = JSON.parse(evt.data);
			var dom = jade.compile(domTemplate)(data);
			this.logMonitoringDOM.prepend(dom);
		}.bind(this); //onmessage
		this.ws.onclose = function() {
			console.log('web socket closed');
		}; //onclose
		this.ws.onerror = function(err) {
			if(err != null) bootbox.alert(JSON.stringify(err));
		}; //onerror
	} //init
}; //LogMonitoringWS

$(function(){
	model = new Model();
	view = new View();
	controller = new Controller();
	logMonitoringWS = new LogMonitoringWS();

	logMonitoringWS.start();

	editor = ace.edit('editor');
	editor.setTheme('ace/theme/kuroir');
	editor.getSession().setMode('ace/mode/javascript');
	editor.setKeyboardHandler('ace/keyboard/vim');
	editor.setReadOnly(true);
});