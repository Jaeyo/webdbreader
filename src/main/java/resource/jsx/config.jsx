var React = require('react');

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
	//TODO componenetDidMount
	onVersionCheckChange(evt) {
		var value = JSON.parse(evt.target.value);
		this.setState({ versionCheck: value });
	},
	save() {
		postConfig([{ configKey: 'version.check', configValue: this.state.versionCheck }]);
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
			<div className="panel panel-default general-config-panel">
				<div className="panel-heading">
					<span className="glyphicon glyphicon-cog" />
					<span>general</span>
				</div>
				<div className="panel-body">
					{body}
				</div>
			</div>
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
			<div className="panel panel-default derby-sql-panel">
				<div className="panel-heading">
					<span className="glyphicon glyphicon-cog" />
					<span>derby database</span>
				</div>
				<div className="panel-body">
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
				</div>
			</div>
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
			<div className="panel panel-default crypto-panel">
				<div className="panel-heading">
					<span className="glyphicon glyphicon-cog" />
					<span>crypto</span>
				</div>
				<div className="panel-body">
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
				</div>
				</div>
			</div>
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