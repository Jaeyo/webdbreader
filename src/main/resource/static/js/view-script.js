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
		alert('not implemented')
		//TODO IMME
	}, //rename

	remove: function(){
		alert('not implemented')
		//TODO IMME
	} //remove
}; //Controller

$(function(){
	model = new Model();
	view = new View();
	controller = new Controller();
});