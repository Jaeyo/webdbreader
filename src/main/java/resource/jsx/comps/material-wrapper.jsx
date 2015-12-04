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
	Toggle: require('material-ui/lib/toggle'),

	Tabs: getMaterialComponent(require('material-ui/lib/tabs/tabs')),
	Tab: require('material-ui/lib/tabs/tab')
};