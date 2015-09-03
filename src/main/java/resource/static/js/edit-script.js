Model = function(){
}; //INIT
Model.prototype = {
}; //Model

View = function(){
	var theme = $('input#hidden-script-editor-theme').val();
	this.scriptEditor = this.codeMirror($('#textarea-script')[0], theme);
}; //INIT
View.prototype = {
	codeMirror: function(dom, theme){
		var editor = CodeMirror.fromTextArea(dom, {
			mode: "javascript",
			indentWithTabs: true
		});
		
		editor.setSize(null, 500);
		editor.setOption("theme", theme);
		
		var originalHint = CodeMirror.hint.javascript;
		CodeMirror.hint.javascript = function(cm){
			var inner = originalHint(cm) || {from: cm.getCursor(), to: cm.getCursor(), list: []};
			var customAutoComplete = model.customAutoComplete;
			for(var i=0; i<customAutoComplete.length; i++)
				inner.list.push(customAutoComplete[i]);
			return inner;
		};
		return editor;
	} //codeMirror
}; //View

Controller = function(){
}; //INIT
Controller.prototype = {
	save: function(){
		var script = view.scriptEditor.getValue();
		var title = $('input#script-name[type="hidden"]').val();
		$.post('/REST/Script/Edit/{}/'.format(title), {script: script}, function(resp){
			if(resp.success !== 1){
				bootbox.alert(JSON.stringify(resp));
				return;
			} //if
			bootbox.alert('script saved', function(){ window.location.href = '/Script/View/{}/'.format(title); });
		}, 'json');
	}, //save

	export: function(){
		var title = $('input#script-name[type="hidden"]').val();
		alert('not implemented');
	} //export
}; //Controller

$(function(){
	model = new Model();
	view = new View();
	controller = new Controller();
});