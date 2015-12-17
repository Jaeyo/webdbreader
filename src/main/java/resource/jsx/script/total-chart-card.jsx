var React = require('react');
var server = require('../utils/server.js');
var Glyphicon = require('react-bootstrap').Glyphicon;
var MaterialWrapper = require('../comps/material-wrapper.jsx');
var Button = MaterialWrapper.Button;
var Card = MaterialWrapper.Card;
var CardHeader = MaterialWrapper.CardHeader;
var CardText = MaterialWrapper.CardText;
var List = MaterialWrapper.List;
var ListItem = MaterialWrapper.ListItem;
var LineChart = require('react-chartjs').Line;

var TotalChartCard = React.createClass({
	render() {
		return (
			<Card style={{ marginBottom: '10px' }}>
				<CardHeader
					title="chart"
					subtitle="등록된 스크립트들의 통계를 제공합니다."
					avatar={ <Glyphicon glyph="signal" /> } />
				<CardText>
					<LineChart />
				</CardText>
			</Card>
		);
	}
});
module.exports = TotalChartCard;