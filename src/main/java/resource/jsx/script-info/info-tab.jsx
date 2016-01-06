var React = require('react');
var util = require('util');
var moment = require('moment');
var uuid = require('uuid');
var Glyphicon = require('react-bootstrap').Glyphicon;
var Websocket = require('../comps/websocket.jsx');
var AlertDialog = require('../comps/dialog/alert-dialog.jsx');
var MaterialWrapper = require('../comps/material-wrapper.jsx');
var Button = MaterialWrapper.Button;
var FlatButton = MaterialWrapper.FlatButton;
var Card = MaterialWrapper.Card;
var CardHeader = MaterialWrapper.CardHeader;
var CardText = MaterialWrapper.CardText;
var List = MaterialWrapper.List;
var ListItem = MaterialWrapper.ListItem;
var IconMenu = MaterialWrapper.IconMenu;
var MenuItem = MaterialWrapper.MenuItem;
var Paper = MaterialWrapper.Paper;

moment.locale('ko');

var InfoTab = React.createClass({
	editor: null,
	uuid: uuid.v4(),

	PropTypes: {
		title: React.PropTypes.string.isRequired,
		script: React.PropTypes.string.isRequired
	},


	componentDidMount() {
		this.editor = ace.edit(this.uuid);
		this.editor.setTheme('ace/theme/github');
		this.editor.getSession().setMode('ace/mode/javascript');
		this.editor.setKeyboardHandler('ace/keyboard/vim');
		this.editor.$blockScrolling = Infinity;
		this.editor.setValue(this.props.script);
	},

	componentDidUpdate(prevProps, prevState) {
		this.editor.setValue(this.props.script);
	},

	edit() {
		server.editScript({
			title: this.props.title,
			script: this.editor.getValue()
		})
		.then(function() {
			window.location.reload(true);
		})
		.catch(function(err) {
			if(typeof err === 'object') err = JSON.stringify(err);
			this.refs.alertDialog.show('danger', err);
		}.bind(this));
	},

	render() {
		try {
			return (
				<Paper style={{ padding: '10px' }}>
					<Card style={{ marginBottom: '10px' }}>
						<CardHeader
							title="information"
							avatar={ <Glyphicon glyph="file" /> } />
						<CardText>
							<div>information</div>
						</CardText>
					</Card>
					<Card style={{ marginBottom: '10px' }}>
						<CardHeader
							title="code"
							avatar={ <Glyphicon glyph="file" /> } />
						<CardText>
							<div>
								<div id="editor-wrapper" 
									style={{
										position: 'relative',
										minHeight: '400px' 
									}}>
									<div id={this.uuid}
										style={{
											position: 'absolute',
											top: 0,
											bottom: 0,
											right: 0,
											left: 0 }} />
									}
								</div>
									<div style={{ textAlign: 'right', marginTop: '10px' }}>
										<Button
											label="수정"
											primary={true}
											onClick={this.edit} />
									</div>
								<AlertDialog ref="alertDialog" />
							</div>
						</CardText>
					</Card>
				</Paper>
			);
		} catch(err) {
			console.error(err.stack);
		}
	}
});
module.exports = InfoTab;