var React = require('react');
var PolymerIcon = require('./comps/polymer-icon.jsx');
var MaterialWrapper = require('./comps/material-wrapper.jsx');
var Button = MaterialWrapper.Button;
var Card = MaterialWrapper.Card;
var CardHeader = MaterialWrapper.CardHeader;
var CardText = MaterialWrapper.CardText;
var SimpleRepoCard = require('./config/simple-repo-card.jsx');

var ConfigView = React.createClass({
	render() {
		try {
			return (
				<div>
					<div style={{ marginBottom: '10px' }}>
						<SimpleRepoCard />
					</div>
				</div>
			);
		} catch(err) {
			console.error(err.stack);
		}
	}
});

module.exports = ConfigView;