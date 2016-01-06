var React = require('react');
var Glyphicon = require('react-bootstrap').Glyphicon;
var MaterialWrapper = require('./comps/material-wrapper.jsx');
var Card = MaterialWrapper.Card;
var CardHeader = MaterialWrapper.CardHeader;
var CardText = MaterialWrapper.CardText;
var Tabs = MaterialWrapper.Tabs;
var Tab = MaterialWrapper.Tab;
var SpDbReaderAPI = require('./api/spdbreader-api.jsx');

var ApiView = React.createClass({
	render() {
		try {
			return (
				<Card>
					<CardHeader
						title="API"
						subtitle="스크립트에 사용되는 API"
						avatar={ <Glyphicon glyph="book" /> } />
					<CardText>
						<Tabs>
							<Tab label="scripter">
								<span>TODO</span>
							</Tab>
							<Tab label="SpDbReader">
								<SpDbReaderAPI />
							</Tab>
						</Tabs>
					</CardText>
				</Card>
			);
		} catch(err) {
			console.error(err.stack);
		}
	}
});
module.exports = ApiView;

