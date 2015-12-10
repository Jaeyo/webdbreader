var React = require('react');
var MaterialWrapper = require('../comps/material-wrapper.jsx');
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
var PolymerIcon = require('../comps/polymer-icon.jsx');


var TableConfigDialog = React.createClass({
	PropTypes: {
		visible: React.PropTypes.bool.isRequired,
		table: React.PropTypes.string.isRequired,
		onChange: React.PropTypes.func.isRequired,
		onAction: React.PropTypes.func.isRequired,
		jdbc: React.PropTypes.object.isRequired,
	},

	//TODO IMME

	getDefaultProps() {
		return { visible: false };
	},

	getInitialState() {
		return {
			isTablesLoaded: false,
			loadedTables: null
		}
	},

	componentDidUpdate(prevProps, prevState) {
		if(prevProps.visible === false && this.props.visible === true)
			this.loadTables();
	},

	onOk() {
		this.props.onAction('ok');
	},

	onCancel() {
		this.props.onAction('cancel');
	},

	handleChange(name, evt) {
		evt.stopPropagation();
		switch(name) {
		case 'table': 
			var state = {};
			state[name] = evt.target.value;
			this.props.onChange(state);
			break;
		}
	},

	onTableChange(table) {
		this.props.onChange({ table: table });
	},

	loadTables() {
		server.loadTables({
			jdbc: this.props.jdbc
		}).then(function(tables) {
			this.setState({
				isTablesLoaded: true,
				loadedTables: tables
			});
		}.bind(this)).catch(function(err) {
			console.error(err.stack);
			this.setState({ isTablesLoaded: true });
			if(typeof err !== 'string') err = JSON.stringify(err);
			//TODO layer popup alert error
			alert(err);
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
						this.onTableChange(table);
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

	render() {
		return (
			<Dialog
				actions={[
					{ text: 'ok', onClick: this.onOk },
					{ text: 'cancel', onClick: this.onCancel }
				]}
				actionFocus="ok"
				autoDetectWindowHeight={true}
				autoScrollBodyContent={true}
				open={this.props.visible}>
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
			</Dialog>
		);
	}
});