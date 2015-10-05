var React = require('react'),
	Panel = require('./components/panel.jsx').Panel;

function postConfig(configKeyValueArr) {
	$.post('/REST/Config/', { 
		jsonParam: JSON.stringify(configKeyValueArr)
	}, function(resp){
		if(resp.success !== 1){
			bootbox.alert(JSON.stringify(resp));
			return;
		}
		bootbox.alert('config saved');
	}, 'json');
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
		.fail(function(err) {
			if(typeof err === 'object') err = JSON.stringify(err);
			bootbox.alert(err);
		}).done(function(resp) {
			if(resp.success !== 1) {
				bootbox.alert(resp.errmsg);
				return;
			} 

			if(resp.configs['version.check']) {
				this.setState({ 
					isLoaded: true, 
					versionCheck: JSON.parse(resp.configs['version.check']) 
				});
			} else {
				this.setState({ isLoaded: true, versionCheck: false }); 
			}
		}.bind(this));
	},

	onVersionCheckChange(evt) {
		var value = JSON.parse(evt.target.value);
		this.setState({ versionCheck: value });
	},

	save() {
		postConfig([{ configKey: 'version.check', configValue: this.state.versionCheck+"" }]);
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
		.fail(function(err){
			bootbox.alert(JSON.stringify(err));
		}).done(function(resp){
			if(resp.success !== 1){
				bootbox.alert(JSON.stringify(resp));
				return;
			} //if

			bootbox.alert('<textarea style="width: 100%;" rows="10">' + resp.result + '</textarea>');
		});
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
		.fail(function(err) {
			bootbox.alert(JSON.stringify(err));
		}).done(function(resp) {
			if(resp.success !== 1) {
				bootbox.alert(JSON.stringify(resp));
				return;
			} //if
			bootbox.alert('<input type="text" class="form-control" value="' + resp.value + '" />');
		});
	}, 
	decrypt() {
		var text = React.findDOMNode(this.refs.cryptoInput).value;
		$.getJSON('/REST/Meta/Decrypt/', {value: text})
		.fail(function(err) {
			bootbox.alert(JSON.stringify(err));
		}).done(function(resp) {
			if(resp.success !== 1) {
				bootbox.alert(JSON.stringify(resp));
				return;
			} //if
			bootbox.alert('<input type="text" class="form-control" value="' + resp.value + '" />');
		});
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

React.render(
	<div>
		<GeneralConfigPanel />
		<DerbySqlPanel />
		<CryptoPanel />
	</div>,
	$('#contents')[0]
);