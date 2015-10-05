var React = require('react'),
	ScriptPanel = require('./components/script-panel.jsx').ScriptPanel,
	Panel = require('./components/panel.jsx').Panel,
	ListGroup = require('./components/list-group.jsx').ListGroup,
	jsUtil = require('./util/util.js'),
	handleError = jsUtil.handleError,
	handleResp = jsUtil.handleResp,
	util = require('util');

var TotalChartPanel = React.createClass({
	getInitialState() {
		return {
			isChartLoaded: false
		};
	},

	componentDidMount() {
		$.getJSON('/REST/Chart/ScriptScoreStatistics/Total/', {})
		.fail(handleError)
		.done(handleResp(function(resp) {
			this.setState({
				isChartLoaded: true,
				chartData: resp.data.data,
				chartXKey: 'timestamp',
				chartYKey: resp.data.yKeys,
				labels: resp.data.yKeys
			});
		}.bind(this)));
	},

	componentDidUpdate() {
		if(this.state.isChartLoaded === true) {
			$('#totalStatisticsChart').empty();
			new Morris.Line({
				element: 'totalStatisticsChart',
				data: this.state.chartData,
				xkey: this.state.chartXKey,
				ykeys: this.state.chartYKey,
				labels: this.state.labels
			});
		} //if
	},

	render() {
		return (
			<Panel className="total-chart-panel">
				<Panel.Heading glyphicon="stats">total chart</Panel.Heading>
				<Panel.Body>
					{ this.state.isChartLoaded === false ? 
						(<span className="center-xy">loading...</span>) :
						(<div id="totalStatisticsChart" />)
					}
				</Panel.Body>
			</Panel>
		);
	}
});

var OperationHistoryPanel = React.createClass({
	getInitialState() {
		return {
			isHistoryLoaded: false,
			operationHistoryItems: []
		};
	},

	componentDidMount() {
		$.getJSON('/REST/OperationHistory/', {})
		.fail(handleError)
		.done(handleResp(function(resp) {
			var operationHistoryItems = [];
			resp.history.forEach(function(hist) {
				operationHistoryItems.push(
					<OperationHistoryPanel.Item
						isStartup={hist.IS_STARTUP}
						scriptName={hist.SCRIPT_NAME}
						prettyRegdate={hist.PRETTY_REGDATE} />
				);
			});

			this.setState({
				isHistoryLoaded: true,
				operationHistoryItems: operationHistoryItems
			});
		}.bind(this)));
	},

	render() {
		return (
			<Panel className="operation-history-panel">
				<Panel.Heading glyphicon="time">operation history</Panel.Heading>
				<Panel.Body>
					{ this.state.isHistoryLoaded === false ? 
						(<span className="center-xy">loading...</span>) :
						(<ListGroup>{this.state.operationHistoryItems}</ListGroup>)
					}
				</Panel.Body>
			</Panel>
		);
	}
});

OperationHistoryPanel.Item = React.createClass({
	getDefaultProps() {
		return {
			isStartup: false,
			scriptName: '',
			prettyRegdate: ''
		};
	},

	render() {
		return (
			<a 
				href={util.format('/Script/View/%s/', this.props.scriptName)}
				className={'list-group-item ' + (this.props.isStartup === true ? 
					'startup-history' : 'shutdown-history')}>
				{ this.props.isStartup === true ? 
					(<span className="glyphicon glyphicon-upload pull-left" />) :
					(<span className="glyphicon glyphicon-download pull-left" />)
				}
				<span className="pull-left">{this.props.scriptName}</span>
				<span className="pull-right pretty-date">{this.props.prettyRegdate}</span>
				<div className="clearfix" />
			</a>
		);
	}
});

var IndexView = React.createClass({
	getInitialState() {
		return {
			scripts: []
		};
	},

	componentDidMount() {
		$.getJSON('/REST/Script/Info/', {})
		.fail(handleError)
		.done(handleResp(function(resp) {
			this.setState({ scripts: resp.scriptInfos });
		}.bind(this)));
	},

	render() {
		return (
			<div>
				<div className="script-infos">
					{ this.state.scripts.map(function(script) {
						return <ScriptPanel 
							scriptName={script.SCRIPT_NAME} 
							isScriptRunning={script.IS_RUNNING} />
					})}
					<div className="clearfix" />
				</div>
				<div className="row">
					<div className="col-lg-9 col-md-12 col-sm-12">
						<TotalChartPanel />
					</div>
					<div className="col-lg-3 col-md-12 col-sm-12">
						<OperationHistoryPanel />
					</div>
				</div>
			</div>
		);
	}
});

React.render(<IndexView />, $('.contents-area')[0]);