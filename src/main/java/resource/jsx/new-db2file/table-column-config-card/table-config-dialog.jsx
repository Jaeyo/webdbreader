var React = require('react');
var server = require('../../utils/server.js');
var MaterialWrapper = require('../../comps/material-wrapper.jsx');
var Button = MaterialWrapper.Button;
var TextField = MaterialWrapper.TextField;
var SelectField = MaterialWrapper.SelectField;
var Card = MaterialWrapper.Card;
var CardHeader = MaterialWrapper.CardHeader;
var CardText = MaterialWrapper.CardText;
var CircularProgress = MaterialWrapper.CircularProgress;
var List = MaterialWrapper.List;
var ListItem = MaterialWrapper.ListItem;
var ListDivider = MaterialWrapper.ListDivider;
var Dialog = MaterialWrapper.Dialog;
var Toggle = MaterialWrapper.Toggle;
var PolymerIcon = require('../../comps/polymer-icon.jsx');
var AlertDialog = require('../../comps/dialog/alert-dialog.jsx');


var TableConfigDialog = React.createClass({
	PropTypes: {
		handleStateChange: React.PropTypes.func.isRequired,

		table: React.PropTypes.string.isRequired,
		jdbcDriver: React.PropTypes.string.isRequired,
		jdbcConnUrl: React.PropTypes.string.isRequired,
		jdbcUsername: React.PropTypes.string.isRequired,
		jdbcPassword: React.PropTypes.string.isRequired
	},

	getInitialState() {
		return {
			visible: false,
			isTablesLoaded: false,
			loadedTables: null
		}
	},

	show() {
		this.setState({ visible: true }, function() {
			this.loadTables();
		}.bind(this));
	},

	hide() {
		this.setState({ visible: false });
	},

	handleChange(name, evt) {
		evt.stopPropagation();

		switch(name) {
		case 'table': 
			this.props.handleStateChange({ table: evt.target.value });
			break;
		}
	},

	loadTables() {
		server.loadTables({
			jdbc: {
				driver: this.props.jdbcDriver,
				connUrl: this.props.jdbcConnUrl,
				username: this.props.jdbcUsername,
				password: this.props.jdbcPassword
			}
		}).then(function(tables) {
			this.setState({
				isTablesLoaded: true,
				loadedTables: tables
			});
		}.bind(this)).catch(function(err) {
			console.error(err.stack);
			this.setState({ isTablesLoaded: true });
			if(typeof err !== 'string') err = JSON.stringify(err);
			this.refs.alertDialog.show('danger', err);
		}.bind(this));
	},

	renderTableList() {
		if(this.state.isTablesLoaded === false) 
			return (<CircularProgress mode="indeterminate" size={0.5} />);

		var isShouldFilter = (this.props.table != null && this.props.table.trim().length  !== 0);

		return (
			<List>
			{
				this.state.loadedTables.filter(function(table) {
					if(isShouldFilter === false) return true;
					return String.containsIgnoreCase(table, this.props.table);
				}.bind(this)).map(function(table) {
					var onClick = function(evt) {
						evt.stopPropagation();
						this.props.handleStateChange({ table: table });
					}.bind(this);
					return (
						<ListItem
							key={table}
							primaryText={table}
							onClick={onClick} />
					);
				}.bind(this))
			}
			</List> 
		);
	},

	onClose(evt) {
		evt.stopPropagation();
		this.hide();
	},

	render() {
		return (
			<Dialog
				actions={[
					{ text: 'close', onClick: this.onClose }
				]}
				actionFocus="ok"
				autoDetectWindowHeight={true}
				autoScrollBodyContent={true}
				open={this.state.visible}>
				<Card>
					<CardHeader
						title="table 설정"
						subtitle="source database의 table 정보를 설정합니다."
						avatar={ <PolymerIcon icon="config" /> } />
					<CardText>
						<TextField
							floatingLabelText="table"
							value={this.props.table} 
							onChange={this.handleChange.bind(this, 'table')}
							fullWidth={true} />
						<div style={{ width: '100%', height: '300px', overflow: 'auto' }}>
							{ this.renderTableList() }
						</div>
					</CardText>
				</Card>
				<AlertDialog ref="alertDialog" />
			</Dialog>
		);
	}
});
module.exports = TableConfigDialog;