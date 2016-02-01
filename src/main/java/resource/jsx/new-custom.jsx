var React = require('react');
var PolymerIcon = require('./comps/polymer-icon.jsx');
var MaterialWrapper = require('./comps/material-wrapper.jsx');
var Card = MaterialWrapper.Card;
var CardHeader = MaterialWrapper.CardHeader;
var CardText = MaterialWrapper.CardText;
var Paper = MaterialWrapper.Paper;
var Button = MaterialWrapper.Button;
var AlertDialog = require('./comps/dialog/alert-dialog.jsx');
var AddScriptBlockDialog = require('./new-custom/add-script-block-dialog.jsx');


//scriptBlock type: databaseSourceScriptBlock
var NewCustom = React.createClass({
	getInitialState() {
		return {
			scriptBlocks: []
		};
	},

	onAddScriptBlockBtnClick(evt) {
		var self = this;
		evt.stopPropagation();

		self.refs.addScriptBlockDialog.show(function(result, scriptBlock) {
			if(result === true)
				self.setState({ scriptBlocks: self.state.scriptBlocks.concat(scriptBlock) });
		});
	},

	renderCurrentScriptBlock() {
		if(this.state.scriptBlocks.length === 0)
			return ( <Paper style={{ margin: '20px' }}>no script blocks</Paper> );

		return this.state.scriptBlocks.map(function(scriptBlock) {
			return ( <Paper style={{ margin: '20px' }}>{JSON.stringify(scriptBlock)}</Paper> );
		});
	},

	render() {
		return (
			<Card>
				<CardHeader
					title="custom script block"
					subtitle="custom script block"
					avatar={ <PolymerIcon icon="config" /> } />
				<CardText>
					{this.renderCurrentScriptBlock()}
					<AddScriptBlockBtnDiv onClick={this.onAddScriptBlockBtnClick} />
				</CardText>
				<AddScriptBlockDialog ref="addScriptBlockDialog" />
			</Card>
		);
	}
});
module.exports = NewCustom;


var AddScriptBlockBtnDiv = (props) => {
	return (
		<div style={{ float: 'right' }}>
			<Button label="add script block" onClick={props.onClick} />
		</div>
	);
};