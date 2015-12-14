var React = require('react');
var MaterialWrapper = require('../../comps/material-wrapper.jsx');
var Button = MaterialWrapper.Button;
var FlatButton = MaterialWrapper.FlatButton;
var Dialog = MaterialWrapper.Dialog;
var ScriptDialog = require('../../comps/dialog/script-dialog.jsx');
var AlertDialog = require('../../comps/dialog/alert-dialog.jsx');
var server = require('../../utils/server.js');

var ImportVer1ScriptDialog = React.createClass({ 
	show() {
		this.refs.scriptDialog
			.show('',
				'apiV1(function(dateUtil, dbHandler, fileExporter, httpUtil, runtimeUtil, scheduler, simpleRepo, stringUtil) { \n' + 
				'	/*SpDbReader code here */ \n' + 
				'});',
				function(actionResult, scriptName, script) {
					if(actionResult === false) {
						this.refs.scriptDialog.hide();
						return;
					}

					if(scriptName == null || scriptName.trim().length === 0) {
						this.refs.alertDialog.show('danger', 'invalid script name');
						return;
					}

					server.postScript({
						title: scriptName, 
						script: script
					}).then(function() {
						this.refs.alertDialog
							.onHide(function() {
								window.location.href = '/';
							}).show('primary', 'script registered');
					}.bind(this)).catch(function(err) {
						if(typeof err === 'object') err = JSON.stringify(err);
						this.refs.alertDialog.show('danger', err);
					});
				}.bind(this)
			);
	},

	render() {
		return (
			<div>
				<ScriptDialog ref="scriptDialog" />
				<AlertDialog ref="alertDialog" />
			</div>
		);
	}
});
module.exports = ImportVer1ScriptDialog;



// .onHide(function(result, scriptName, script) {
