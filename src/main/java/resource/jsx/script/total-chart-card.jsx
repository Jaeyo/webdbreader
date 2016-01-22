var React = require('react');
var util = require('util');
var _ = require('underscore');
var server = require('../utils/server.js');
var Glyphicon = require('react-bootstrap').Glyphicon;
var AlertDialog = require('../comps/dialog/alert-dialog.jsx');
var MaterialWrapper = require('../comps/material-wrapper.jsx');
var Button = MaterialWrapper.Button;
var Card = MaterialWrapper.Card;
var CardHeader = MaterialWrapper.CardHeader;
var CardText = MaterialWrapper.CardText;
var List = MaterialWrapper.List;
var ListItem = MaterialWrapper.ListItem;
var LineChart = require('react-d3').LineChart;
var BarChart = require('react-d3').BarChart;

var Chart = require('react-google-charts').Chart;

var TotalChartCard = React.createClass({
	getInitialState() {
		return { totalChartData: null };
	},

	loadTotalChartData(callback) {
		var self = this;

		server.chartTotal()
		.then(callback)
		.catch(function(err) {
			self.refs.alertDialog.show('danger', err);
		});
	},

	componentDidMount() {
		var self = this;
		// rows: [{ COUNT_TIMESTAMP, CATEGORY, SCRIPT_NAME, COUNT_VALUE }]
		this.loadTotalChartData(function(rows) {
			if(rows.length === 0) return;
			self.setState({ totalChartData: rows });
		});
	},

	renderCharts() {
		try {
			var self = this;

			if(self.state.totalChartData == null) {
				return (<p>no data</p>);
			} else {
				var categories = _.uniq(self.state.totalChartData.map(function(row) { return row.CATEGORY; }));
				var scriptNames = _.uniq(self.state.totalChartData.map(function(row) { return row.SCRIPT_NAME; }));
				var groupByTimestamp = _.groupBy(self.state.totalChartData, function(row){ return row.timestamp; });

				return categories.map(function(category) {
					var chartProps = {
						options: { 
							title: category,
							hAxis: { title: 'time' },
							vAxis: { title: 'count' },
							curveType: 'function'
						},
						columns: [],
						rows: []
					};
					chartProps.columns.push({ label: 'time', type: 'datetime' });
					scriptNames.forEach(function(scriptName) { 
						chartProps.columns.push({ label: scriptName, type: 'number' });
					});
					chartProps.rows = groupByTimestamp
					//TODO IMME


	

// options={{ title: 'air pagggggg', hAxis: { title: 'Year' }, vAxis: { title: 'count' }, curveType: 'function' }}
// 							columns={[
// 								{ label: 'time', type: 'number' },
// 								{ label: 'series1', type: 'number' },
// 								{ label: 'series2', type: 'number' }
// 							]}
// 							rows={[
// 								[1949, 11, 22],
// 								[1950, 12, null],
// 								[1953, 22, 10],
// 								[1955, 99, 80]
// 							]}


				});


				return categories.map(function(category) {
					var lineData = [];
					scriptNames.forEach(function(scriptName) {
						var values = self.state.totalChartData
							.filter(function(row) { return row.CATEGORY === category && row.SCRIPT_NAME === scriptName; })
							.map(function(row) {
								return {
									x: row.COUNT_TIMESTAMP,
									y: row.COUNT_VALUE
								};
							});
						lineData.push({
							name: scriptName,
							values: values
						});
					});

					return (
						<LineChart
							key={'chart-' + category}
							legend={true}
							data={lineData}
							height={400}
							viewBoxObject={{
								x: 0, y: 0, width: 500, height: 400
							}}
							title={category}
							yAxisLabel="count"
							xAxisLabel="time"
							gridHorizontal={true} />
					);
				});
			}
		} catch(err) {
			console.error(err.stack);
		}
	},

	render() {
		try {
			var self = this;

			console.log('cp5'); //DEBUG
			// var charts = self.renderCharts();
			// console.log({ charts: charts }); //DEBUG

			return (
				<Card style={{ marginBottom: '10px' }}>
					<CardHeader
						title="chart"
						subtitle="등록된 스크립트들의 통계를 제공합니다."
						avatar={ <Glyphicon glyph="signal" /> } />
					<CardText>
						<Chart
							chartType="LineChart"
							options={{ title: 'air pagggggg', hAxis: { title: 'Year' }, vAxis: { title: 'count' }, curveType: 'function' }}
							columns={[
								{ label: 'time', type: 'number' },
								{ label: 'series1', type: 'number' },
								{ label: 'series2', type: 'number' }
							]}
							rows={[
								[1949, 11, 22],
								[1950, 12, null],
								[1953, 22, 10],
								[1955, 99, 80]
							]}
							div_id="blablablablal"
							width={'100%'}
							height={'300px'} />
					</CardText>
					<AlertDialog refs="alertDialog" />
				</Card>
			);
		} catch(err) {
			console.error(err.stack);
		}
	}
});
module.exports = TotalChartCard;