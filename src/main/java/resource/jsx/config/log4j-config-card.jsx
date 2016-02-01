var React = require('react');
var PolymerIcon = require('../comps/polymer-icon.jsx');
var MaterialWrapper = require('../comps/material-wrapper.jsx');
var Button = MaterialWrapper.Button;
var Card = MaterialWrapper.Card;
var CardHeader = MaterialWrapper.CardHeader;
var CardText = MaterialWrapper.CardText;
var TextField = MaterialWrapper.TextField;
var Table = require('react-bootstrap').Table;
var SimpleRepoDialog = require('./simple-repo-card/simple-repo-dialog.jsx');
var AlertDialog = require('../comps/dialog/alert-dialog.jsx');
var ConfirmDialog = require('../comps/dialog/confirm-dialog.jsx');
var server = require('../utils/server.js');

var Log4jConfigCard = React.createClass({
	getInitialState() {
		return {
			threshold: null
		};
	},

	componentDidMount() {
		var self = this;
		try {
			this.loadLog4jThreshold(function(threshold) {
				self.setState({ threshold: threshold });
			});
		} catch(err) {
			console.error(err.stack);
		}
	},

	loadLog4jThreshold(callback) {
		var self = this;
		server
			.loadLog4jThreshold()
			.then(function(threshold) {
				callback(threshold);
			}).catch(function(err) {
				self.refs.alertDialog.show('danger', err);
			})
	},

	//args: threshold
	updateLog4jThreshold(args) {
		var self = this;
		server
			.updateLog4jThreshold({ threshold: args.threshold })	
			.then(function() {
				self.refs.alertDialog.show('success', '변경되었습니다.');
				self.loadLog4jThreshold(function(threshold) {
					self.setState({ threshold: threshold });
				});
			}).catch(function(err) {
				self.refs.alertDialog.show('danger', err);
			});
	},

	handleChange(name, evt) {
		evt.stopPropagation();
		this.setState({ threshold: evt.target.value });
	},

	onUpdateBtnClick(evt) {
		evt.stopPropagation();
		this.updateLog4jThreshold({ threshold: this.state.threshold });
	},

	render() {
		try {
			return (
				<Card>
					<CardHeader
						title="log4j configuration"
						subtitle="로그 관련 설정을 합니다."
						avatar={ <PolymerIcon icon="config" /> } />
					<CardText>
						<TextField
							floatingLabelText="Threshold"
							value={this.state.threshold}
							onChange={this.handleChange.bind(this, 'threshold')}
							fullWidth={true} />
						<div style={{ textAlign: 'right' }}>
							<Button label="update" onClick={this.onUpdateBtnClick} />
						</div>
						<ConfirmDialog ref="confirmDialog" />
						<AlertDialog ref="alertDialog" />
						<SimpleRepoDialog ref="simpleRepoDialog" />
					</CardText>
				</Card>
			);
		} catch(err) {
			console.error(err.stack);
		}
	}
});
module.exports = Log4jConfigCard;