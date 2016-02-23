'use strict';

import React from 'react';
import AlertDialog from '../../comps/dialog/alert-dialog.jsx';
import { Glyphicon } from 'react-bootstrap';
import { Chart } from 'react-google-charts';
import server from '../../utils/server.js';
import util from 'util';
import uuid from 'uuid';
import _ from 'underscore';
import {
	Button,
	Card,
	CardHeader,
	CardText
} from '../../comps/material-wrapper.jsx';


var ScriptChartCard = React.createClass({
	intervalId: null,
	uuid: uuid.v4(),

	PropTypes: {
		scriptName: React.PropTypes.string.isRequired
	},

	getInitialState() {
		return { chartData: null };
	},

	componentDidMount() {
		this.loadChartData();
		this.intervalId = setInterval(this.loadChartData, 10*1000);
	},

	componentWillUnmount() {
		clearInterval(this.intervalId);
	},

	loadChartData() {
		var { props, refs } = this;

		server
			.chartScript({ scriptName: props.scriptName })
			.then((rows) => {
				//rows: [{ COUNT_TIMESTAMP, CATEGORY, SCRIPT_NAME, COUNT_VALUE }]
				if(rows.length === 0) return;
				this.setState({ chartData: rows });
			}).catch((err) => {
				refs.alertDialog.show('danger', err);
				clearInterval(this.intervalId);
			});
	},

	renderChart() {
		var { props, state } = this;

		if(state.chartData == null)
			return ( <p>no data</p> );

		var categories = _.uniq(state.chartData.map((row) => { return row.CATEGORY; }));
		var groupByTimestamp = _.groupBy(state.chartData, (row) => { return row.COUNT_TIMESTAMP; });

		var chartProps = {
			options: {
				title: props.scriptName,
				hAxis: {
					title: 'time',
					minValue: new Date(Date.now() - ( 6 * 60 * 60 * 1000 )),
					maxValue: new Date()
				},
				vAxis: {
					title: 'count'
				},
			},
			columns: [],
			rows: []
		};

		chartProps.columns.push({ label: 'time', type: 'datetime' });
		categories.forEach((category) => {
			chartProps.columns.push({ label: category, type: 'number' });
		});
		chartProps.rows = _.values(groupByTimestamp).map((rows) => {
			var valueArr = [];
			valueArr.push(new Date(rows[0].COUNT_TIMESTAMP));
			categories.forEach((category) => {
				var value = null;
				rows.forEach((row) => {
					if(row.SCRIPT_NAME === props.scriptName && row.CATEGORY === category) value = row.COUNT_VALUE;
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
				graph_id={util.format('script-chart-%s-%s', props.scriptName, this.uuid)}
				key={util.format('script-chart-%s-%s', props.scriptName, this.uuid)}
				width="100%"
				height="400px" />
		);
	},

	render() {
		try {
			return (
				<Card style={{ marginBottom: '10px' }}>
					<CardHeader
						title="chart"
						subtitle="스크립트의 통계를 제공합니다."
						avatar={ <Glyphicon glyph="signal" /> } />
					<CardText>
						{ this.renderChart() }
						<AlertDialog ref="alertDialog" />
					</CardText>
				</Card>
			);
		} catch(err) {
			console.error(err.stack);
		}
	}
});
module.exports = ScriptChartCard;