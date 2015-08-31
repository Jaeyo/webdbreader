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
	}, //remove

	viewLog: function() {
		//TODO IMME
	}; //viweLog
}; //Controller

$(function(){
	model = new Model();
	view = new View();
	controller = new Controller();
});