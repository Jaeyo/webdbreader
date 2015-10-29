var React = require('react'),
	ReactCSS = require('reactcss'),
	Layout = require('./comps/layout.jsx').Layout,
	Panel = require('./comps/panel.jsx').Panel,
	Btn = require('./comps/btn.jsx').Btn,
	GlyphiconBtn = require('./comps/btn.jsx').GlyphiconBtn,
	Clearfix = require('./comps/clearfix.jsx').Clearfix,
	jsUtil = require('./utils/util.js'),
	handleError = jsUtil.handleError,
	handleResp = jsUtil.handleResp;


var TotalChartPanel = React.createClass({
	mixins: [ ReactCSS.mixin ],

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
		if(this.state.isChartLoaded === true && this.state.chartData.length !== 0) {
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

	classes() {
		return {
			'default': {
				Panel: {
					marginBottom: '20px'
				},
				loadingBox: {
					width: '100%',
					textAlign: 'center',
					padding: '50px 0'
				}
			}
		}
	},

	styles() {
		return this.css();
	},

	render() {
		var body = null;
		if(this.state.isChartLoaded === false) {
			body = <div is="loadingBox">loading...</div>;
		} else if(this.state.chartData.length === 0) {
			body = <div is="loadingBox">no data</div>;
		} else {
			body = <div id="totalStatisticsChart" />;
		}

		return (
			<Panel is="Panel">
				<Panel.Heading glyphicon="stats">total chart</Panel.Heading>
				<Panel.Body>{body}</Panel.Body>
			</Panel>
		);
	}
});

var ScriptListPanel = React.createClass({
	getInitialState() {
		return { isNewScriptBtnsVisible: false };
	},

	newScript(evt) {
		this.setState({ isNewScriptBtnsVisible: !this.state.isNewScriptBtnsVisible });
	},

	render() {
		var newScriptBtns = 
			this.state.isNewScriptBtnsVisible === true ? 
			(<div style={{ float: 'right' }}><NewScriptBtns /></div>) : null;

		return (
			<Panel>
				<Panel.Heading glyphicon="console">scripts</Panel.Heading>
				<Panel.Body>
					<ScriptList />
					<div style={{ float: 'right' }}>
						<GlyphiconBtn onClick={this.newScript} glyphicon="plus">new script</GlyphiconBtn>
					</div>
					{newScriptBtns}
					<Clearfix />
				</Panel.Body>
			</Panel>
		);
	}
});

var ScriptList = React.createClass({
	getInitialState() {
		return { scriptInfos: [] };
	},

	componentDidMount() {
		$.getJSON('/REST/Script/Info/', {})
		.fail(handleError)
		.done(handleResp(function(resp) {
			this.setState({ scriptInfos: resp.scriptInfos });
		}.bind(this)).bind(this));
	},

	render() {
		if(this.state.scriptInfos.length === 0) {
			return (
				<div 
					style={{ 
						width: '100%', 
						textAlign: 'center', 
						padding: '50px 0 50px 0'
					}}>no script</div>
			);
		}

		var body = this.state.scriptInfos.map(function(scriptInfo) {
			return (
				<ScriptListItem 
					scriptName={scriptInfo.SCRIPT_NAME}
					isRunning={scriptInfo.IS_RUNNING} 
					regdate={scriptInfo.REGDATE} />
			);
		});

		return (<div>{body}</div>);
	}
});

var ScriptListItem = React.createClass({
	getDefaultProps() {
		return {
			scriptName: '',
			isRunning: false,
			regdate: ''
		};
	},

	getInitialState() {
		return { isMouseOver: false };
	},

	onMouseOver() {
		this.setState({ isMouseOver: true });
	},

	onMouseOut() {
		this.setState({ isMouseOver: false });
	},

	render() {
		var outerDivStyle = {
			width: '100%',
			height: '100px'
		};
		if(this.state.isMouseOver === true)
			outerDivStyle.backgroundColor = 'gray';

		return (
			<div style={outerDivStyle}>
				<ScriptListItem.RunningBar isRunning={this.props.isRunning} />
				<div style={{ float: 'left' }}>
					<h3>{this.props.scriptName}</h3>
					<label>{this.props.regdate}</label>
				</div>
				<div style={{ float: 'right' }}>
					{ this.state.isMouseOver === true ? 
						(<ScriptListItem.Btns />) : null }
					<ScriptListItem.Statistics />
				</div>
			</div>
		);
	}
});

ScriptListItem.RunningBar = React.createClass({
	getDefaultProps() {
		return {
			isRunning: false
		};
	},

	render() {
		var style = {
			backgroundColor: this.props.isRunning === true ? 'blue' : 'red',
			display: 'inline-block',
			width: '10px',
			height: '100%',
			float: 'left'
		};

		return ( <div style={style} /> );
	}
});

ScriptListItem.Btns = React.createClass({
	editScript(evt) {
		//TODO
	},

	renameScript(evt) {
		//TODO
	},

	deleteScript(evt) {
		//TODO 
	},

	startScript(evt) {
		//TODO 
	},

	stopScript(evt) {
		//TODO 
	},

	render() {
		var body = [];
		if(this.props.isRunning === true) {
			body.push(<GlyphiconBtn onClick={this.stopScript} glyphicon="off">stop</GlyphiconBtn>);
		} else {
			body.push(<GlyphiconBtn onClick={this.startScript} glyphicon="off">start</GlyphiconBtn>);
		}

		body.push(<GlyphiconBtn onClick={this.editScript} glyphicon="pencil">edit</GlyphiconBtn>);
		body.push(<GlyphiconBtn onClick={this.renameScript} glyphicon="edit">rename</GlyphiconBtn>);
		body.push(<GlyphiconBtn onClick={this.deleteScript} glyphicon="remove">delete</GlyphiconBtn>);

		return (<div>{body}</div>);
	}
});

ScriptListItem.Statistics = React.createClass({
	getInitialState() {
		return {
			inputCount: '-',
			outputCount: '-'
		};
	},

	componentDidMount() {
		//TODO IMME
	},

	render() {
		var outerDivStyle = { padding: '2px 4px' };
		var inputStyle = {
			padding: '3px 8px',
			backgroundColor: 'green'
		};
		var outputStyle = {
			padding: '3px 8px',
			backgroundColor: 'yellow'
		};
		return (
			<div style={outerDivStyle}>
				<span style={inputStyle}>{this.state.inputCount}</span>
				<span style={outputStyle}>{this.state.outputCount}</span>
			</div>
		);
	}
});

var NewScriptBtns = React.createClass({
	newDb2File(evt) {
		window.location.href = '/Script/NewDb2File';
	},

	newDb2Db(evt) {
		//TODO
	},

	importScript(evt) {
		//TODO
	},

	render() {
		return (
			<div style={{ marginRight: '5px' }}>
				<Btn onClick={this.newDb2File}>db2file</Btn>
				<Btn onClick={this.newDb2Db}>db2db</Btn>
				<Btn onClick={this.importScript}>import script</Btn>
			</div>
		);
	}
});


React.render(
	<Layout active="script">
		<TotalChartPanel />
		<ScriptListPanel />
	</Layout>,
	document.body
);