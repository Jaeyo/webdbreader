var React = require('react');
var Glyphicon = require('react-bootstrap').Glyphicon;
var ScriptConfigTab = require('./script-info/script-config-tab.jsx');
var CodeTab = require('./script-info/code-tab.jsx');
var server = require('./utils/server.js');
var MaterialWrapper = require('./comps/material-wrapper.jsx');
var AlertDialog = require('./comps/dialog/alert-dialog.jsx');
var Button = MaterialWrapper.Button;
var FlatButton = MaterialWrapper.FlatButton;
var Card = MaterialWrapper.Card;
var CardHeader = MaterialWrapper.CardHeader;
var CardText = MaterialWrapper.CardText;
var List = MaterialWrapper.List;
var ListItem = MaterialWrapper.ListItem;
var IconMenu = MaterialWrapper.IconMenu;
var MenuItem = MaterialWrapper.MenuItem;
var Tabs = MaterialWrapper.Tabs;
var Tab = MaterialWrapper.Tab;

var ScriptInfoView = React.createClass({
	PropTypes: {
		title: React.PropTypes.string.isRequired
	},

	getInitialState() {
		return { 
			regdate: '',
			script: ''
		};
	},

	componentDidMount() {
		server
			.loadScript({ title: this.props.title })
			.then(function(script) {
				this.setState({ 
					script: script.SCRIPT,
					regdate: script.REGDATE
				});
			}.bind(this)).catch(function(err) {
				console.error(err.stack);
				this.refs.alertDialog.show('danger', '스크립트 정보를 불러올 수 없습니다.');
			}.bind(this));
	},

	render() {
		return (
			<Card>
				<CardHeader
					title={this.props.title}
					subtitle={this.state.regdate}
					avatar={ <Glyphicon glyph="file" /> } />
				<CardText>
					<Tabs>
						<Tab label="infomation">
							<div>infomation</div>
						</Tab>
						<Tab label="configuration">
							<ScriptConfigTab title={this.props.title} script={this.state.script} />
						</Tab>
						<Tab label="script">
							<CodeTab title={this.props.title} script={this.state.script} />
						</Tab>
					</Tabs>
				</CardText>
				<AlertDialog ref="alertDialog" />
			</Card>
		);
	}
});
module.exports = ScriptInfoView;