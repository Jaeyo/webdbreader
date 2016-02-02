var React = require('react');
var util = require('util');
var _ = require('underscore');
var uuid = require('uuid');
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
var Chart = require('react-google-charts').Chart;

var TotalChartCard = React.createClass({
	intervalId: null,
	uuid: uuid.v4(),

	getInitialState() {
		return { totalChartData: null };
	},

	loadTotalChartData(callback) {
		var self = this;

		server.chartTotal()
		.then(function(rows) {
			// rows: [{ COUNT_TIMESTAMP, CATEGORY, SCRIPT_NAME, COUNT_VALUE }]
			if(rows.length === 0) return;
			self.setState({ totalChartData: rows });
		})
		.catch(function(err) {
			self.refs.alertDialog.show('danger', err);
			clearInterval(this.intervalId);
		});
	},

	componentDidMount() {
		this.loadTotalChartData();
		this.intervalId = setInterval(this.loadTotalChartData, 10*1000);
	},

	componentWillUnmount() {
		clearInterval(this.intervalId);
	},

	renderCharts() {
		try {
			var self = this;

			if(self.state.totalChartData == null) {
				return (<p>no data</p>);
			} else {
				var categories = _.uniq(self.state.totalChartData.map(function(row) { 
					return row.CATEGORY; 
				})).sort(function(a, b) {
					var getScore = function(what) {
						switch(what) {
							case 'input': return 1;
							case 'output': return 2;
							case 'errorLog': return 3;
							default: return 99;
						}
					}
					var aScore = getScore(a);
					var bScore = getScore(b);
					return aScore > bScore;
				});

				var scriptNames = _.uniq(self.state.totalChartData.map(function(row) { return row.SCRIPT_NAME; }));
				var groupByTimestamp = _.groupBy(self.state.totalChartData, function(row){ return row.COUNT_TIMESTAMP; });

				//category별로 차트 생성
				return categories.map(function(category) {
					var chartProps = {
						options: { 
							title: category,
							hAxis: { 
								title: 'time',
								minValue: new Date(Date.now() - (6 * 60 * 60 * 1000)),
								maxValue: new Date()
							},
							vAxis: { 
								title: 'count'
							},
						},
						columns: [],
						rows: []
					};
							// curveType: 'function'
					chartProps.columns.push({ label: 'time', type: 'datetime' });
					scriptNames.forEach(function(scriptName) { 
						chartProps.columns.push({ label: scriptName, type: 'number' });
					});
					chartProps.rows = _.values(groupByTimestamp).map(function(rows) {
						var valueArr = [];
						valueArr.push(new Date(rows[0].COUNT_TIMESTAMP));
						scriptNames.forEach(function(scriptName) {
							var value = null;
							rows.forEach(function(row) {
								if(row.SCRIPT_NAME === scriptName && row.CATEGORY === category) value = row.COUNT_VALUE;
							});
							if(value == null) value = 0;
							valueArr.push(value);
						});
						return valueArr;
					});

					return (
						<Chart
							chartType="LineChart"
							{...chartProps}
							graph_id={util.format('totalchart-%s-%s', category, self.uuid)}
							key={util.format('totalchart-%s-%s', category, self.uuid)}
							width="100%"
							height="400px" />
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

			return (
				<Card style={{ marginBottom: '10px' }}>
					<CardHeader
						title="chart"
						subtitle="등록된 스크립트들의 통계를 제공합니다."
						avatar={ <Glyphicon glyph="signal" /> } />
					<CardText>
						{this.renderCharts()}
					</CardText>
					<AlertDialog ref="alertDialog" />
				</Card>
			);
		} catch(err) {
			console.error(err.stack);
		}
	}
});
module.exports = TotalChartCard;