var editor = null;

function save() {
	var script = editor.getValue();
	var title = $('input#script-name[type="hidden"]').val();
	$.post('/REST/Script/Edit/{}/'.format(title), { script: script }, function(resp) {
		if(resp.success !== 1) {
			bootbox.alert(JSON.stringify(resp));
			return;
		} //if

		bootbox.alert('script saved', function() {
			window.location.href = '/Script/View/{}/'.format(title);
		});
	});
} //save

function exportScript() {
	bootbox.alert('not implemented');
} //export

$(function() {
	editor = ace.edit('editor');
	editor.setTheme('ace/theme/kuroir');
	editor.getSession().setMode('ace/mode/javascript');
	editor.setKeyboardHandler('ace/keyboard/vim');
});