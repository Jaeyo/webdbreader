Model = function(){
}; //INIT
Model.prototype = {
}; //Model

View = function(){
}; //INIT
View.prototype = {
	showLoadingDialog: function(){
		bootbox.dialog({
			message: '<p style="text-align: center">loading...</p><div class="loading"></div>',
			closeButton: false
		});
	} //showLoadingDialog
}; //View

Controller = function(){
}; //INIT
Controller.prototype = {
	saveGeneralConfig: function(){
		var versionCheckValue = $('input[type="radio"][name="version-check"]:checked').val();
		this.postConfig([{ configKey: 'version.check', configValue: versionCheckValue }]);
	}, //saveGeneralConfig

	saveScriptEditorConfig: function(){
		var selectedTheme = $('select#select-script-editor-theme option:selected').val();
		this.postConfig([{ configKey: 'script.editor.theme', configValue: selectedTheme }]);
	}, //saveScriptEditorConfig

	postConfig: function(configKeyValueArr){
		$.post('/REST/Config/', { 
			jsonParam: JSON.stringify(configKeyValueArr)
		}, function(resp){
			if(resp.success !== 1){
				bootbox.alert(JSON.stringify(resp));
				return;
			} //if
			bootbox.alert('config saved');
		}, 'json');
	}, //postConfig

	queryDerbyDb: function(){
		var query = $('input[type="text"]#derby-query').val();

		$.getJSON('/REST/EmbedDb/Query/', {query: query})
		.fail(function(e){
			bootbox.alert(JSON.stringify(e));
		}).done(function(resp){
			if(resp.success !== 1){
				bootbox.alert(JSON.stringify(resp));
				return;
			} //if

			bootbox.alert('<textarea style="width: 100%;" rows="30">' + resp.result + '</textarea>');
		});
	} //queryDerbyDb
}; //Controller

$(function(){
	model = new Model();
	view = new View();
	controller = new Controller();
});