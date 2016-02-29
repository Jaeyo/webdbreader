import React from 'react';
import {
	Button,
	FlatButton,
	Dialog
} from '../comps/material-wrapper.jsx';
import ImportVer1ScriptDialog from './new-script-dialog/import-ver1-script-dialog.jsx';
import ScriptDialog from '../comps/dialog/script-dialog.jsx';
import AlertDialog from '../comps/dialog/alert-dialog.jsx';
import server from '../utils/server.js';

var NewScriptDialog = React.createClass({
	getInitialState() {
		return {
			visible: false
		};
	},

	show() {
		this.setState({ visible: true });
	},

	hide(callback) {
		this.setState({ visible: false }, callback);
	},

	goDb2File(evt) {
		evt.stopPropagation();
		window.location.href = '/Script/NewDb2File';
	},

	goDb2Db(evt) {
		evt.stopPropagation();
		window.location.href = '/Script/NewDb2Db';
	},

	goImportVer1Script(evt) {
		var { refs } = this;
		evt.stopPropagation();
		this.hide(() => {
			refs.importVer1scriptDialog.show();
		});
	},

	goNewScript(evt) {
		evt.stopPropagation();

		var { refs } = this;
		refs.scriptDialog.show({
			scriptName: '',
			script: '',
			options: {
				isScriptNameEditable: true
			},
			onActionCallback: (result, scriptName, script) => {
				if(result === false) {
					refs.scriptDialog.hide();
					return;
				}

				server.postScript({
					title: scriptName,
					script: script
				}).then((result) => {
					refs.scriptDialog.hide();
					refs.alertDialog.show('success', '스크립트가 저장되었습니다.');
					window.location.href = '/';
				}).catch((err) => {
					refs.alertDialog.show('danger', err);
				});
			}
		});
		this.hide();
	},

	render() {
		try {
			return (
				<div>
					<Dialog
						title="new script"
						actions={[
							{ text: 'close', onClick: this.hide }
						]}
						actionFocus="close"
						open={this.state.visible}
						onRequestClose={this.hide}
						autoDetectWindowHeight={true}
						autoScrollBodyContent={true}>
						<FlatButton 
							label=">> database to file"
							style={{ width: '100%', textAlign: 'left' }}
							onClick={this.goDb2File} />
						<FlatButton 
							label=">> import version 1 script"
							style={{ width: '100%', textAlign: 'left' }}
							onClick={this.goImportVer1Script} />
						<FlatButton 
							label=">> new script"
							style={{ width: '100%', textAlign: 'left' }}
							onClick={this.goNewScript} />
					</Dialog>
					<ImportVer1ScriptDialog ref="importVer1scriptDialog" />
					<ScriptDialog ref="scriptDialog" />
					<AlertDialog ref="alertDialog" />
				</div>
			);
		} catch(err) {
			console.error(err.stack);
		}
	}
});
module.exports = NewScriptDialog;