var React = require('react');
var jsUtil = require('../utils/util.js');
var color = jsUtil.color;
var server = require('../utils/server.js');
var PolymerIcon = require('../comps/polymer-icon.jsx');
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
var RadioButton = MaterialWrapper.RadioButton;
var RadioButtonGroup = MaterialWrapper.RadioButtonGroup;
var Toggle = MaterialWrapper.Toggle;
var BindingColumnConfigDialog = require('./binding-type-card/binding-column-config-dialog.jsx');


var BindingTypeCard = React.createClass({
	PropTypes: {
		handleStateChange: React.PropTypes.func.isRequired,

		jdbcDriver: React.PropTypes.string.isRequired,
		jdbcConnUrl: React.PropTypes.string.isRequired,
		jdbcUsername: React.PropTypes.string.isRequired,
		jdbcPassword: React.PropTypes.string.isRequired,
		table: React.PropTypes.string.isRequired,
		bindingType: React.PropTypes.string.isRequired,
		bindingColumn: React.PropTypes.string.isRequired
	},

	handleChange(name, evt) {
		switch(name) {
		case 'bindingType': 
		case 'bindingColumn': 
			var state = {};
			state[name] = evt.target.value;
			this.props.handleStateChange(state);
			break;
		}
	},

	handleFocus(name, evt) {
		switch(name) {
		case 'bindingColumn': 
			if(this.refs.autoloadToggle.isToggled() === false) return;
			this.refs.bindingColumnConfigDialog.show();
			break;
		}
	},

	render() {
		try {
			var jdbc = {
				jdbcDriver: this.props.jdbcDriver,
				jdbcConnUrl: this.props.jdbcConnUrl,
				jdbcUsername: this.props.jdbcUsername,
				jdbcPassword: this.props.jdbcPassword
			};

			return (
				<Card style={{ marginBottom: '10px' }}>
					<CardHeader
						title="바인딩 타입 설정"
						subtitle="바인딩 타입을 설정합니다."
						avatar={ <PolymerIcon icon="config" /> } />
					<CardText>
						<RadioButtonGroup 
							name="bindingType" 
							defaultSelected="simple"
							onChange={this.handleChange.bind(this, 'bindingType')}>
							<RadioButton
								value="simple"
								label="simple binding" />
							<RadioButton
								value="date"
								label="date binding" />
							<RadioButton
								value="sequence"
								label="sequence binding" />
						</RadioButtonGroup>
						{
							this.props.bindingType === 'simple' ? null : (
								<div>
									<Toggle
										name="autoload"
										value="autoload"
										label="autoload"
										ref="autoloadToggle"
										style={{ width: '150px' }}
										defaultToggled={true} />
									<TextField
										value={this.props.bindingColumn}	
										floatingLabelText="binding column"
										fullWidth={true}
										onChange={this.handleChange.bind(this, 'bindingColumn')}
										onFocus={this.handleFocus.bind(this, 'bindingColumn')} />
									
								</div>
							)
						}
					</CardText>
					<BindingColumnConfigDialog 
						handleStateChange={this.props.handleStateChange}
						table={this.props.table}
						bindingColumn={this.props.bindingColumn}
						ref="bindingColumnConfigDialog"
						{...jdbc} />
				</Card>
			);
		} catch(err) {
			console.error(err.stack);
		}
	}
});
module.exports = BindingTypeCard;