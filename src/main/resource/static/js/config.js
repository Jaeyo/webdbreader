Model = function(){
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
	saveScriptEditorConfig: function(){
		var selectedTheme = $('select#select-script-editor-theme option:selected').val();
		var jsonParam = [{ configKey: 'script.editor.theme', configValue: selectedTheme }];
		$.post('/REST/Config/', { 
			jsonParam: JSON.stringify(jsonParam)
		}, function(resp){
			if(resp.success !== 1){
				bootbox.alert(JSON.stringify(resp));
				return;
			} //if
			bootbox.alert('config saved');
		}, 'json');
	} //saveScriptEditorConfig
}; //Controller

$(function(){
	model = new Model();
	view = new View();
	controller = new Controller();
});