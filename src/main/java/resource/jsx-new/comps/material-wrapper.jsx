var React = require('react');
var Colors = require('material-ui/lib/styles/colors');
var ThemeManager = require('material-ui/lib/styles/theme-manager');
var ReactTapEventPlugin = require('react-tap-event-plugin');

ReactTapEventPlugin();

var defaultTheme = {
	spacing: require('material-ui/lib/styles/spacing'),
	palette: {
		primary1Color: Colors.blueGrey400,
		primary2Color: Colors.cyan400,
		primary3Color: Colors.lightBlack,
		accent1Color: Colors.blueGrey800,
		accent2Color: Colors.grey100,
		accent3Color: Colors.grey500,
		textColor: Colors.darkBlack,
		alternateTextColor: Colors.white,
		canvasColor: Colors.white,
		borderColor: Colors.grey300,
		disabledColor: require('material-ui/lib/utils/color-manipulator').fade(Colors.darkBlack, 0.3)
	}
};

var getMaterialComponent = function(comp) {
	return React.createClass({
		getInitialState() {
			return { muiTheme: ThemeManager.getMuiTheme(defaultTheme) };
		},

		childContextTypes: {
			muiTheme: React.PropTypes.object
		},

		getChildContext() {
			return { muiTheme: this.state.muiTheme };
		},

		render() {
			return React.createElement(comp, this.props, this.props.children);
		}
	});
};


module.exports = {
	Button: getMaterialComponent(require('material-ui/lib/raised-button')),
	FlatButton: getMaterialComponent(require('material-ui/lib/flat-button')),

	Card: getMaterialComponent(require('material-ui/lib/card/card')),
	CardHeader: getMaterialComponent(require('material-ui/lib/card/card-header')),
	CardTitle: getMaterialComponent(require('material-ui/lib/card/card-title')),
	CardText: getMaterialComponent(require('material-ui/lib/card/card-text')),

	Dialog: getMaterialComponent(require('material-ui/lib/dialog')),

	List: getMaterialComponent(require('material-ui/lib/lists/list')),
	ListItem: getMaterialComponent(require('material-ui/lib/lists/list-item')),
	ListDivider: getMaterialComponent(require('material-ui/lib/lists/list-divider')),

	FontIcon: getMaterialComponent(require('material-ui/lib/font-icon')),
	IconButton: getMaterialComponent(require('material-ui/lib/icon-button')),
	IconMenu: getMaterialComponent(require('material-ui/lib/menus/icon-menu')),
	MenuItem: getMaterialComponent(require('material-ui/lib/menus/menu-item')),

	CircularProgress: getMaterialComponent(require('material-ui/lib/circular-progress')),

	RefreshIndicator: getMaterialComponent(require('material-ui/lib/refresh-indicator')),

	CheckBox: getMaterialComponent(require('material-ui/lib/checkbox')),
	RadioButton: getMaterialComponent(require('material-ui/lib/radio-button')),
	RadioButtonGroup: getMaterialComponent(require('material-ui/lib/radio-button-group')),

	TextField: getMaterialComponent(require('material-ui/lib/text-field')),
	SelectField: getMaterialComponent(require('material-ui/lib/select-field')),
	Toggle: getMaterialComponent(require('material-ui/lib/toggle'))
};



// var App = React.createClass({
// 	getInitialState() {
// 		return { isDialog1Visible: false };
// 	},

// 	toggleDialog1() {
// 		this.setState({ isDialog1Visible: !this.state.isDialog1Visible });
// 	},

// 	render() {
// 		return (
// 			<div>
// 				<h1>material-ui</h1>
// 				<div>
// 					<h3>buttons</h3>
// 					<Button label="default btn" onClick={ function() { alert('asdf'); }} />
// 					<Button label="primary btn" primary={true} />
// 					<Button label="secondary btn" secondary={true} />
// 					<Button label="disabled btn" disabled={true} />
// 				</div>
// 				<div>
// 					<h3>flat buttons</h3>
// 					<FlatButton label="default btn" />
// 					<FlatButton label="primary btn" primary={true} />
// 					<FlatButton label="secondary btn" secondary={true} />
// 					<FlatButton label="disabled btn" disabled={true} />
// 				</div>
// 				<div style={{ width: '400px' }}>
// 					<h3>card</h3>
// 					<Card>
// 						<CardHeader 
// 							title="card title"
// 							subtitle="sub title" />
// 						<CardText>
// 							<div>test</div>
// 							<div>blalablal ablblab ablabla bablwe wle blw eblw</div>
// 						</CardText>
// 					</Card>
// 				</div>
// 				<div>
// 					<h3>dialog</h3>
// 					<Button label="dialog1" primary={true} onClick={this.toggleDialog1} />
// 					<Dialog
// 						title="dialog with standard actions"
// 						actions={[
// 							{ text: 'cancel', onClick: this.toggleDialog1 },
// 							{ text: 'submit', onClick: function(){ alert('click'); } }
// 						]}
// 						actionFocus="submit"
// 						open={this.state.isDialog1Visible}
// 						onRequestClose={this.toggleDialog1}>
// 						the actions in the windws are created from the josn thats passed in.
// 					</Dialog>
// 				</div>
// 				<div style={{ width: '400px' }}>
// 					<h3>list</h3>
// 					<div style={{ border: 'solid 1px #d9d9d9' }}>
// 						<List subheader="this is subheader" insetSubheader={false}>
// 							<ListItem
// 								primaryText="profile photo"
// 								secondaryText="change your google plus profile photo" />
// 							<ListItem
// 								primaryText="show your status"
// 								secondaryText="your status is visible to everyone you use with" />
// 							<ListDivider />
// 							<ListItem
// 								primaryText="show your status"
// 								secondaryText="your status is visible to everyone you use with" />
// 						</List>
// 					</div>
// 					<br />
// 					<Card>
// 						<List subheader="this is subheader" insetSubheader={false}>
// 							<ListItem
// 								primaryText="profile photo"
// 								secondaryText="change your google plus profile photo" />
// 							<ListItem
// 								primaryText="show your status"
// 								secondaryText="your status is visible to everyone you use with" />
// 							<ListDivider />
// 							<ListItem
// 								primaryText="show your status"
// 								secondaryText="your status is visible to everyone you use with" />
// 						</List>
// 					</Card>
// 				</div>
// 				<div>
// 					<h3>icon</h3>
// 					<PolymerIcon icon="my-icon" />
// 				</div>
// 				<div>
// 					<h3>icon button</h3>
// 					<IconButton 
// 						tooltip="sky">
// 						<PolymerIcon icon="my-icon" />
// 					</IconButton>
// 				</div>
// 				<div>
// 					<h3>icon menu</h3>
// 					<IconMenu 
// 						openDirection="top-right"
// 						iconButtonElement={
// 							<IconButton tooltip="test">
// 								<PolymerIcon icon="my-icon" />
// 							</IconButton>
// 						}>
// 						<MenuItem 
// 							primaryText="refresh"
// 							onClick={ function() {
// 								alert('refresh');
// 							}} />
// 						<MenuItem primaryText="send feedback" />
// 						<MenuItem primaryText="setting" />
// 						<MenuItem primaryText="help" />
// 						<MenuItem primaryText="signout" />
// 					</IconMenu>
// 				</div>
// 				<div>
// 					<h3>progress</h3>
// 					<CircularProgress mode="indeterminate" value={60} />
// 				</div>
// 				<div>
// 					<h3>switches</h3>
// 					<h4>checkbox</h4>
// 					<CheckBox name="checkboxName1" value="checkboxValue1" label="went for a run today" />
// 					<CheckBox name="checkboxName2" value="checkboxValue2" label="fed the dog" defaultChecked={true} />
// 					<h4>radio buttons</h4>
// 					<RadioButtonGroup name="shipSpeed" defaultSelected="not_light">
// 						<RadioButton value="light" label="prepare for light speed" />
// 						<RadioButton value="not_light" label="light speed too speed" />
// 						<RadioButton value="not_lightt" label="light speed too speed" />
// 						<RadioButton value="ludicrous" label="go to ludicrous speed" disabled={true} />
// 					</RadioButtonGroup>
// 					<h4>toggle</h4>
// 					<div style={{ width: '400px' }}>
// 						<Toggle name="toggleName1" value="toggleValue1" label="activate thrusters" />
// 						<Toggle name="toggleName2" value="toggleValue2" label="auto pilot" defaultToggled={true} />
// 						<Toggle name="toggleName3" value="toggleValue3" label="initiate" disabled={true} />
// 					</div>
// 				</div>
// 				<div>
// 					<h3>text fields</h3>
// 					<div>
// 						<TextField hintText="hint text" />
// 					</div>
// 					<div>
// 						<TextField hintText="multiline text fields" multiLine={true} />
// 					</div>
// 					<div>
// 						<TextField hintText="floating text" floatingLabelText="floating label text" />
// 					</div>
// 					<div>
// 						<TextField hintText="password field" floatingLabelText="password field" type="password" />
// 					</div>
// 					<h3>select field</h3>
// 					<div>
// 					</div>
// 				</div>
// 				<h1>react-notification</h1>
// 				<Noti />
// 			</div>
// 		);
// 	}
// });

// var Noti = React.createClass({
// 	getInitialState() {
// 		return {
// 			visible: false
// 		};
// 	},

// 	toggleVisible() {
// 		console.log('toggle visible');
// 		this.setState({ visible: !this.state.visible });
// 		console.log('toggle visible ' + this.state.visible );
// 	},

// 	render() {
// 		return (
// 			<div>
// 				<button onClick={this.toggleVisible}>toggle</button>
// 				<Notification
// 					isActive={this.state.visible}
// 					message="test"
// 					action="close" />
// 			</div>
// 		);
// 	}
// });

// module.exports = App;