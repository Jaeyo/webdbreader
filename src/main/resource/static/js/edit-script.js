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
			lineNumbers: true,
			mode: {name: "javascript", globalVars: true}
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
		var title = $('input#script-name[type="hidden"]').val();
		var script = view.scriptEditor.getValue();
		$.post('/REST/Script/', { title: title, script: script }, function(resp){
			if(resp.success !== 1){
				bootbox.alert(JSON.stringify(resp));
				return;
			} //if
			bootbox.alert('script saved', function(){
				window.location.href = '/';
			});
		}, 'json');
	} //save
}; //Controller

$(function(){
	model = new Model();
	view = new View();
	controller = new Controller();
});