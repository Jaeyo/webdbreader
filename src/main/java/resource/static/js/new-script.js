var editor = null;

function save() {
	var script = editor.getValue();
	bootbox.prompt('script name', function(title) {
		if(title == null)
			return;

		$.post('/REST/Script/New/{}/'.format(title), { script: script }, function(resp) {
			if(resp.success !== 1) {
				bootbox.alert(JSON.stringify(resp));
				return;
			} //if

			bootbox.alert('script saved', function() {
				window.location.href = '/Script/View/{}/'.format(title);
			});
		});
	});
} //save

$(function() {
	editor = ace.edit('editor');
	editor.setTheme('ace/theme/kuroir');
	editor.getSession().setMode('ace/mode/javascript');
	editor.setKeyboardHandler('ace/keyboard/vim');
});