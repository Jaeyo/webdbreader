var React = require('react'),
	Promise = require('promise'),
	util = require('util'),
	Panel = require('./components/panel.jsx').Panel,
	ListGroup = require('./components/list-group.jsx').ListGroup,
	jsUtil = require('./util/util.js'),
	handleError = jsUtil.handleError,
	handleResp = jsUtil.handleResp,
	handleErrorPromise = jsUtil.handleErrorPromise,
	handleRespPromise = jsUtil.handleRespPromise;

Array.prototype.remove = require('array-remove-by-value');

function postConfig(configKeyValueArr) {
	$.post('/REST/Config/', { 
		jsonParam: JSON.stringify(configKeyValueArr)
	}, 'json')
	.fail(handleError)
	.done(handleResp(function(resp) {
		bootbox.alert('config saved');
	}));
}

var GeneralConfigPanel = React.createClass({
	getInitialState() {
		return {
			versionCheck: false,
			isLoaded: false
		};
	},

	componentDidMount() {
		$.getJSON('/REST/Config/', {})
		.fail(handleError)
		.done(handleResp(function(resp) {
			if(resp.configs['version.check']) {
				this.setState({ 
					isLoaded: true, 
					versionCheck: JSON.parse(resp.configs['version.check']) 
				});
			} else {
				this.setState({ isLoaded: true, versionCheck: false }); 
			}
		}.bind(this)));
	},

	postConfig(configKeyValueArr) {
		$.post('/REST/Config/', { 
			jsonParam: JSON.stringify(configKeyValueArr)
		}, 'json')
		.fail(handleError)
		.done(handleResp(function(resp) {
			$.notify('config saved', { delay: 1 });
		}));
	},

	onVersionCheckChange(evt) {
		var value = JSON.parse(evt.target.value);
		this.setState({ versionCheck: value });
	},

	save() {
		this.postConfig([{ configKey: 'version.check', configValue: this.state.versionCheck+"" }]);
	},

	render() {
		var body = (
			this.state.isLoaded === false ? 
			<span>loading...</span> : 
			<div>
				<span className="config-key">version check</span>
				<span>
					<label>
						<input 
							type="radio" 
							name="version-check" 
							value="true"
							checked={this.state.versionCheck === true}
							onChange={this.onVersionCheckChange} />
						<span>true</span>
					</label>
					<label>
						<input 
							type="radio" 
							name="version-check" 
							value="false"
							checked={this.state.versionCheck === false}
							onChange={this.onVersionCheckChange} />
						<span>false</span>
					</label>
				</span>
				<hr />
				<div>
					<button 
						className="btn btn-primary btn-sm pull-right" 
						type="button"
						onClick={this.save} >save</button>
					<div className="clearfix" />
				</div>
			</div>
		);
		
		return (
			<Panel className="general-config-panel">
				<Panel.Heading glyphicon="cog">general</Panel.Heading>
				<Panel.Body>{body}</Panel.Body>
			</Panel>
		);
	}
});

var DerbySqlPanel = React.createClass({
	query() {
		var query = React.findDOMNode(this.refs.queryInput).value;

		$.getJSON('/REST/EmbedDb/Query/', {query: query})
		.fail(handleError)
		.done(handleResp(function(resp){
			bootbox.alert('<textarea style="width: 100%;" rows="10">' + resp.result + '</textarea>');
		}));
	},
	render() {
		return (
			<Panel className="derby-sql-panel">
				<Panel.Heading glyphicon="cog">derby database</Panel.Heading>
				<Panel.Body>
					<div className="input-group">
						<span className="input-group-addon">sql</span>
						<input 
							className="form-control" 
							id="derby-query" 
							type="text"
							ref="queryInput" />
					</div>
					<hr />
					<button 
						type="button" 
						className="btn btn-default pull-right" 
						onClick={this.query}>query</button>
				</Panel.Body>
			</Panel>
		);
	}
});

var CryptoPanel = React.createClass({
	encrypt() {
		var text = React.findDOMNode(this.refs.cryptoInput).value;
		$.getJSON('/REST/Meta/Encrypt/', {value: text})
		.fail(handleError)
		.done(handleResp(function(resp) {
			bootbox.alert('<input type="text" class="form-control" value="' + resp.value + '" />');
		}));
	}, 
	decrypt() {
		var text = React.findDOMNode(this.refs.cryptoInput).value;
		$.getJSON('/REST/Meta/Decrypt/', {value: text})
		.fail(handleError)
		.done(handleResp(function(resp) {
			bootbox.alert('<input type="text" class="form-control" value="' + resp.value + '" />');
		}));
	},
	render() {
		return (
			<Panel className="crypto-panel">
				<Panel.Heading glyphicon="cog">crypto</Panel.Heading>
				<Panel.Body>
					<div className="input-group">
						<span className="input-group-addon">text</span>
						<input 
							type="text" 
							className="form-control" 
							id="crypto-text"
							ref="cryptoInput" />
					</div>
					<hr />
					<button 
						type="button"
						className="btn btn-default pull-right"
						onClick={this.encrypt}>encrypt</button>
					<button 
						type="button"
						className="btn btn-default pull-right"
						onClick={this.decrypt}>decrypt</button>
				</Panel.Body>
			</Panel>
		);
	}
});

var AutoStartScriptPanel = React.createClass({
	getInitialState() {
		return {
			scriptsData: {} //key: scriptName, values: (boolean)
		}
	},

	componentDidMount() {
		this.loadData();
	},

	loadData() {
		Promise.all([
			new Promise(function(resolve, reject) {
				$.getJSON('/REST/Script/Info/', {})
				.fail(handleErrorPromise(reject))
				.done(handleRespPromise(reject, function(resp) {
					var scriptNames = [];
					resp.scriptInfos.forEach(function(script) {
						scriptNames.push(script.SCRIPT_NAME);
					});

					resolve(scriptNames);
				}));
			}),
			new Promise(function(resolve, reject) {
				$.getJSON('/REST/Config/AutoStartScript/', {})
				.fail(handleErrorPromise(reject))
				.done(handleRespPromise(reject, function(resp) {
					resolve(resp.scripts);
				}));
			})
		]).then(function(args) {
			var scriptNames = args[0];
			var autoStartScripts = args[1];

			var scriptsData = {};
			scriptNames.forEach(function(scriptName) {
				scriptsData[scriptName] = false;
			});

			autoStartScripts.forEach(function(autoStartScript) {
				scriptsData[autoStartScript.SCRIPT_NAME] = true;
			});

			this.setState({
				scriptsData: scriptsData
			});
		}.bind(this))
		.catch(handleError);
	},

	removeFromAutoStartScript(evt) {
		var scriptName = evt.target.value; 
		$.ajax({
			url: util.format('/REST/Config/AutoStartScript/%s/', scriptName),
			type: 'DELETE',
			error: handleError,
			success: handleResp(function(resp) {
				var newScriptsData = JSON.parse(JSON.stringify(this.state.scriptsData));
				newScriptsData[scriptName] = false;
				this.setState({
					scriptsData: newScriptsData
				});

				$.notify(util.format('%s removed from auto start script', scriptName), { delay: 1 });

				this.loadData();
			}.bind(this))
		});
	},

	addToAutoStartScript(evt) {
		var scriptName = evt.target.value;
		$.post('/REST/Config/AutoStartScript/', { scriptName: scriptName }, 'json')
		.fail(handleError)
		.done(handleResp(function(resp) {
			var newScriptsData = JSON.parse(JSON.stringify(this.state.scriptsData));
			newScriptsData[scriptName] = true;
			this.setState({
				scriptsData: newScriptsData
			});

			$.notify(util.format('%s added to auto start script', scriptName), { delay: 1 });

			this.loadData();
		}.bind(this)));
	},

	render() {
		var scriptItems = [];
		for(var scriptName in this.state.scriptsData) {
			var isAutoStartScript = this.state.scriptsData[scriptName];
			if(isAutoStartScript === true) {
				scriptItems.push(
					<div className="script-item">
						<button
							type="button"
							className="btn btn-xs btn-danger"
							value={scriptName}
							onClick={this.removeFromAutoStartScript}>-</button>
						<label>{scriptName}</label>
						<label className="desc">(auto start)</label>
					</div>
				);
			} else {
				scriptItems.push(
					<div className="script-item">
						<button
							type="button"
							className="btn btn-xs btn-info"
							value={scriptName}
							onClick={this.addToAutoStartScript}>+</button>
						<label>{scriptName}</label>
					</div>
				);
			}
		}

		return (
			<Panel className="auto-start-script-panel">
				<Panel.Heading glyphicon="cog">auto start script</Panel.Heading>
				<Panel.Body>
					{scriptItems}
				</Panel.Body>
			</Panel>
		);
	}
});

React.render(
	<div>
		<GeneralConfigPanel />
		<DerbySqlPanel />
		<CryptoPanel />
		<AutoStartScriptPanel />
	</div>,
	$('#contents')[0]
);