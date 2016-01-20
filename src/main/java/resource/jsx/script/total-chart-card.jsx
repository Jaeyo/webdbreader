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
var LineChart = require('react-chartjs').Line;

// var TotalChartCard = React.createClass({
// 	getInitialState() {
// 		return {
// 			chartData: null,
// 			chartOptions: {
//     		scaleShowGridLines : true, ///Boolean - Whether grid lines are shown across the chart
// 				scaleGridLineColor : "rgba(0,0,0,.05)", //String - Colour of the grid lines
// 				scaleGridLineWidth : 1, //Number - Width of the grid lines
// 				scaleShowHorizontalLines: true, //Boolean - Whether to show horizontal lines (except X axis)
// 				scaleShowVerticalLines: true, //Boolean - Whether to show vertical lines (except Y axis)
// 				bezierCurve : true, //Boolean - Whether the line is curved between points
// 				bezierCurveTension : 0.4, //Number - Tension of the bezier curve between points
// 				pointDot : true, //Boolean - Whether to show a dot for each point
// 				pointDotRadius : 4, //Number - Radius of each point dot in pixels
// 				pointDotStrokeWidth : 1, //Number - Pixel width of point dot stroke
// 				pointHitDetectionRadius : 20, //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
// 				datasetStroke : true, //Boolean - Whether to show a stroke for datasets
// 				datasetStrokeWidth : 2, //Number - Pixel width of dataset stroke
// 				datasetFill : true, //Boolean - Whether to fill the dataset with a colour
// 				legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>" //String - A legend template
// 			}
// 		};
// 	},

// 	componentDidMount() {
// 		server.chartTotal()
// 		.then(function(data) {
// 			if(data.length === 0) return;
// 			this.setState({ chartData: convertChartData(data) });
// 		}.bind(this))
// 		.catch(function(err) {
// 			this.refs.alertDialog.show('danger', err);
// 		}.bind(this));
// 	},

// 	render() {
// 		try {
// 			return (
// 				<Card style={{ marginBottom: '10px' }}>
// 					<CardHeader
// 						title="chart"
// 						subtitle="등록된 스크립트들의 통계를 제공합니다."
// 						avatar={ <Glyphicon glyph="signal" /> } />
// 					<CardText>
// 						{ this.state.chartData == null ? (
// 							<p>no data</p>
// 						) : (
// 							<LineChart data={this.state.chartData} options={this.state.chartOptions} width="600" height="200" />
// 						)}
// 					</CardText>
// 					<AlertDialog refs="alertDialog" />
// 				</Card>
// 			);
// 		} catch(err) {
// 			console.error(err.stack);
// 		}
// 	}
// });
// module.exports = TotalChartCard;


// var convertChartData = function(rows) {
// 	var datas = rows.map(function(row) {
// 		return {
// 			timestamp: row.COUNT_TIMESTAMP,
// 			label: util.format('%s (%s)', row.SCRIPT_NAME, row.CATEGORY),
// 			value: row.COUNT_VALUE
// 		};
// 	});

// 	var timestamps = _.uniq(datas.map(function(data) { 
// 		return data.timestamp; 
// 	}), true);

// 	var initialArray = timestamps.map(function() { return 0; });
// 	var labels = datas.map(function(data) {
// 		return data.label;
// 	});

// 	var dataset = {};
// 	labels.forEach(function(label) {
// 		dataset[label] = initialArray.slice();
// 	});

// 	datas.forEach(function(data) {
// 		var index = timestamps.indexOf(data.timestamp);
// 		dataset[data.label][index] = data.value;
// 	});

// 	return {
// 		labels: timestamps,
// 		datasets: _.mapObject(dataset, function(val, key) {
// 			return { label: key, data: val };
// 		})
// 	};
// };





var TotalChartCard = React.createClass({
	getInitialState() {
		lineDatas: {}
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
			var datas = //TODO IMME 
		});
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
					{
						Object.keys(self.state.lineDatas).length === 0 ? (
							<p>no data</p>
						) : (
							Object.keys(self.state.lineDatas).map(function(scriptName) {
								var lineData = self.state.lineDatas[scriptName];
								//TODO IMME
							})
						)
					}



						{ this.state.chartData == null ? (
							<p>no data</p>
						) : (
							<LineChart data={this.state.chartData} options={this.state.chartOptions} width="600" height="200" />
						)}
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