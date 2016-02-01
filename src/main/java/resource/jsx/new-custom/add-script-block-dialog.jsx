var React = require('react');
var MaterialWrapper = require('../comps/material-wrapper.jsx');
var Button = MaterialWrapper.Button;
var FlatButton = MaterialWrapper.FlatButton;
var Dialog = MaterialWrapper.Dialog;
var Paper = MaterialWrapper.Paper;
var AddDatabaseSourceScriptBlockDialog = require('./add-script-block-dialog/add-database-source-script-block-dialog.jsx');

var AddScriptBlockDialog = React.createClass({
	callback: null,

	getInitialState() {
		return {
			visible: false
		};
	},

	show(callback) {
		this.callback = callback;
		this.setState({ visible:true });
	},

	hide() {
		this.setState({ visible: false });
	},

	onSourceFromDatabaseClick(evt) {
		evt.stopPropagation();
		this.hide();
		this.refs.addDatabaseSourceScriptBlockDialog.show(this.callback);
		this.callback = null;
	},

	onSourceFromFileClick(evt) {
		evt.stopPropagation();
		//TODO
	},

	onClose(evt) {
		evt.stopPropagation();
		if(this.callback != null) this.callback(false);
		this.hide();
	},

	render() {
		return (
			<div>
				<Dialog
					title="new script block"
					action={[
						{ text: 'close', onClick: this.onClose }
					]}
					actionFocus="close"
					autoDetectWindowHeight={true}
					autoScrollBodyContent={true}
					open={this.state.visible}>
					<BtnArea title="source script block">
						<ScriptBlockBtn 
							label="source from database" 
							onClick={this.onSourceFromDatabaseClick} />
						<ScriptBlockBtn 
							label="source from file" 
							onClick={this.onSourceFromFileClick} />
					</BtnArea>
					<BtnArea title="process script block">
						<div>TODO</div>
					</BtnArea>
				</Dialog>
				<AddDatabaseSourceScriptBlockDialog ref="addDatabaseSourceScriptBlockDialog" />
			</div>
		);
	}
});
module.exports = AddScriptBlockDialog;


//props: title
var BtnArea = (props) => {
	return (
		<Paper style={{ margin: '20px' }}>
			<h3>{props.title}</h3>
			<hr />
			<div style={{ paddingLeft: '20px'}}>
				{props.children}
			</div>
		</Paper>
	);
};

//props: label, onClick
var ScriptBlockBtn = (props) => {
	return (
		<FlatButton
			label={props.label}
			style={{ width: '100%', textAlign: 'left' }}
			onClick={props.onClick} />
	);
};