var React = require('react');
var jsUtil = require('../utils/util.js');
var color = jsUtil.color;
var jdbcTmpl = jsUtil.jdbcTmpl;
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
var DbAddressDialog = require('./database-config-card/db-address-dialog.jsx');

var DatabaseConfigCard = React.createClass({
	PropTypes: {
		title: React.PropTypes.string.isRequired,
		subtitle: React.PropTypes.string.isRequired,
		handleStateChange: React.PropTypes.func.isRequired,

		dbVendor: React.PropTypes.string.isRequired,
		dbIp: React.PropTypes.string.isRequired,
		dbPort: React.PropTypes.string.isRequired,
		dbSid: React.PropTypes.string.isRequired,
		jdbcDriver: React.PropTypes.string.isRequired,
		jdbcConnUrl: React.PropTypes.string.isRequired,
		jdbcUsername: React.PropTypes.string.isRequired,
		jdbcPassword: React.PropTypes.string.isRequired
	},

	handleChange(name, evt) {
		evt.stopPropagation();
		
		var state = {};
		state[name] = evt.target.value;
		this.props.handleStateChange(state);
	},

	render() {
		try {
			return (
				<Card style={{ marginBottom: '10px' }}>
					<CardHeader
						title={this.props.title}
						subtitle={this.props.subtitle}
						avatar={ <PolymerIcon icon="config" /> } />
					<CardText>
						<SelectField
							style={{ float: 'left', marginRight: '10px' }}
							floatingLabelText="데이터베이스"
							value={this.props.dbVendor}
							menuItems={[
								{ text: 'oracle', payload: 'oracle' },
								{ text: 'mysql', payload: 'mysql' },
								{ text: 'mssql', payload: 'mssql' },
								{ text: 'db2', payload: 'db2' },
								{ text: 'tibero', payload: 'tibero' },
								{ text: 'etc', payload: 'etc' }
							]}
							onChange={this.handleChange.bind(this, 'dbVendor') } />
						<Button
							label="설정"
							secondary={true}
							style={{ float: 'left', marginTop: '27px' }}
							onClick={ function() { this.refs.dbAddressDialog.show(); }.bind(this) } />
						<DbAddressDialog 
							ref="dbAddressDialog"
							handleStateChange={this.props.handleStateChange}
							dbIp={this.props.dbIp}
							dbPort={this.props.dbPort}
							dbSid={this.props.dbSid} />
						<div style={{ 
							border: '1px dashed ' + color.lightGray,
							padding: '10px',
							margin: '1px 0' }}>
							<TextField
								inputStyle={{ color: 'black' }}
								floatingLabelText="jdbc driver"
								value={this.props.jdbcDriver}
								fullWidth={true}
								onChange={this.handleChange.bind(this, 'jdbcDriver')} />
							<TextField
								inputStyle={{ color: 'black' }}
								floatingLabelText="jdbc connection url"
								value={this.props.jdbcConnUrl}
								fullWidth={true}
								onChange={this.handleChange.bind(this, 'jdbcConnUrl')} />
							<TextField
								inputStyle={{ color: 'black' }}
								floatingLabelText="jdbc username"
								value={this.props.jdbcUsername}
								fullWidth={true}
								onChange={this.handleChange.bind(this, 'jdbcUsername')} />
							<TextField
								type="password"
								inputStyle={{ color: 'black' }}
								floatingLabelText="jdbc password"
								value={this.props.jdbcPassword}
								fullWidth={true}
								onChange={this.handleChange.bind(this, 'jdbcPassword')} />
						</div>
					</CardText>
				</Card>
			);
		} catch(err) {
			console.error(err.stack);
		}
	}
});
module.exports = DatabaseConfigCard;