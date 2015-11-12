var Colors = require('material-ui/lib/styles/colors'),
	ThemeManager = require('material-ui/lib/styles/theme-manager');

var defaultTheme = {
	spacing: require('material-ui/lib/styles/spacing'),
	palette: {
		primary1Color: Colors.cyan500,
		primary2Color: Colors.cyan700,
		primary3Color: Colors.lightBlack,
		accent1Color: Colors.blueGrey900,
		accent2Color: Colors.grey100,
		accent3Color: Colors.grey500,
		textColor: Colors.darkBlack,
		alternateTextColor: Colors.white,
		canvasColor: Colors.white,
		borderColor: Colors.grey300,
		disabledColor: require('material-ui/lib/utils/color-manipulator').fade(Colors.darkBlack, 0.3)
	}
};

// material-ui component에 theme를 적용시킨 component를 반환한다.
// ex) var Button = materialUiUtil.component(require('material-ui/button'));
exports.component = function(comp) {
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