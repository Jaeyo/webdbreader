var React = require('react');
var PolymerIcon = require('./comps/polymer-icon.jsx');
var MaterialWrapper = require('./comps/material-wrapper.jsx');
var Button = MaterialWrapper.Button;
var Card = MaterialWrapper.Card;
var CardHeader = MaterialWrapper.CardHeader;
var CardText = MaterialWrapper.CardText;

var ConfigView = React.createClass({
	render() {
		try {
			return (
				<div>
					<Card>
						<CardHeader
							title="todo"
							subtitle="todo"
							avatar={ <PolymerIcon icon="config" /> } />
						<CardText>
							//TODO IMME
						</CardText>
					</Card>
				</div>
			);
		} catch(err) {
			console.error(err.stack);
		}
	}
});

module.exports = ConfigView;