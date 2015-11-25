var React = require('react'),
	util = require('util'),
	MaterialWrapper = require('../../comps/material-wrapper.jsx'),
	TextField = MaterialWrapper.TextField,
	Card = MaterialWrapper.Card,
	CardHeader = MaterialWrapper.CardHeader,
	CardText = MaterialWrapper.CardText;

require('ace-webapp');

var CodePanel = React.createClass({
	editor: null,
	scriptMaker: new ScriptMaker(),

	PropTypes: {
		dbVendor: React.PropTypes.string.isRequired,
		jdbcDriver: React.PropTypes.string.isRequired,
		jdbcConnUrl: React.PropTypes.string.isRequired,
		jdbcUsername:React.PropTypes.string.isRequired,
		jdbcPassword: React.PropTypes.string.isRequired,
		bindingType: React.PropTypes.string.isRequired,
		bindingColumn: React.PropTypes.string.isRequired,
		table: React.PropTypes.string.isRequired,
		columns: React.PropTypes.string.isRequired,
		script: React.PropTypes.string.isRequired,
		period: React.PropTypes.string.isRequired,
		charset: React.PropTypes.string.isRequired,
		delimiter: React.PropTypes.string.isRequired,
		outputFile: React.PropTypes.string.isRequired,
		onChange: React.PropTypes.func.isRequired
	},

	componentDidMount() {
		this.editor = ace.edit('editor');
		this.editor.setTheme('ace/theme/github');
		this.editor.getSession().setMode('ace/mode/javascript');
		this.editor.setKeyboardHandler('ace/keyboard/vim');
		this.editor.setValue(this.props.script);
		this.editor.on('change', function(e) {
			this.props.onChange({ script: this.editor.getValue() });
		}.bind(this));
	},

	componentWillReceiveProps(newProps) {
		if(this.props === newProps) return; //TODO 무한루프 돌것같은데...

		var script = this.makeScript(newProps);
		this.editor.setValue(script);
		this.props.onChange({ script: script });
	},

	shouldComponentUpdate(newProps, newState) {
		return false;
	},

	makeScript(newProps) {
		this.scriptMaker.variable({
			period: newProps.period,
			dbVendor: newProps.dbVendor,
			jdbcDriver: newProps.jdbcDriver,
			jdbcConnUrl: newProps.jdbcConnUrl,
			jdbcUsername: newProps.jdbcUsername,
			jdbcPassword: newProps.jdbcPassword,
			columns: newProps.columns,
			table: newProps.table,
			bindingColumn: newProps.bindingColumn,
			delimiter: newProps.delimiter,
			charset: newProps.charset,
			outputFile: newProps.outputFile
		});

		if(this.props.bindingType !== newProps.bindingType) {
			this.scriptMaker
				.maxQueryVariable({ bindingType: newProps.bindingType })
				.minMaxVariable({ bindingType: newProps.bindingType })
				.mainQueryVariable({ 
					bindingType: newProps.bindingType,
					dbVendor: newProps.dbVendor
				})
				.storeMax2Min({ bindingType: newProps.bindingType });
		}

		return this.scriptMaker.get();
	},

	styles() {
		return {
			editorWrapper: {
				position: 'relative',
				height: '100px'
			},
			editor: {
				position: 'absolute',
				top: 0,
				bottom: 0,
				right: 0,
				left: 0
			}
		};
	},

	render() {
		var style = this.styles();
		return (
			<div id="editor-wrapper" style={style.editorWrapper}>
				<div id="editor" style={style.editor} />
			</div>
		);
	}
});

var ScriptMaker = function() {
	var variable;
	var maxQueryVariable;
	var minMaxVariable;
	var mainQueryVariable;
	var storeMax2Min;

	return {
		//args: period, dbVendor, jdbcDriver, jdbcConnUrl, jdbcUsername, jdbcPassword, 
		//		columns, table, bindingColumn, delimiter, charset, outputFile
		variable: function(args) {
			variable = util.format([
				"var period = %s; ",
				"var dbVendor = %s; ",
				"var jdbc = { ",
				"	driver: '%s', ",
				"	connUrl: '%s', ",
				"	username: '%s', ",
				"	password: '%s', ",
				"}; ",
				"var columns = '%s'; ",
				"var table = '%s'; ",
				"var bindingColumn = '%s'; ",
				"var delimiter = '%s'; ",
				"var charset = '%s'; ",
				"var outputFile = '%s'; "
			].join('\n'), args.period, dbVendor, jdbcDriver, jdbcConnUrl, jdbcUsername, jdbcPassword);
			return this;
		},

		//args: bindingType
		maxQueryVariable: function(args) {
			if(args.bindingType !== 'date') return this;

			maxQueryVariable = [
				"var maxQuery = format( ",
				"	'select max(${bindingColumn}) \\",
				"	from ${table}', ",
				"	{ bindingColumn: bindingColumn, table: table} ",
				"); "
			].join('\n');

			return this;
		},

		//args: bindingType
		minMaxVariable: function(args) {
			switch(args.bindingType) {
				case 'date':
					minMaxVariable = [
						"	var min = repo('min');",
						"	var max = now().format('yyyy-MM-dd HH:mm:ss');"
					].join('\n');
				break;
				case 'sequence':
					minMaxVariable = [
						"	var min = repo('min');",
						"	var max = database(jdbc).select(maxQuery).get();"
					].join('\n');
				break;
			}
			return this;
		},

		//args: bindingType, dbVendor
		mainQueryVariable: function(args) {
			switch(args.bindingType) {
				case 'simple':
					mainQueryVariable = [
						"	var mainQuery = format( ",
						"		'SELECT ${columns}' \\",
						"		FROM ${table}',",
						"		{ columns: columns, table: table }",
						"	);"
					].join('\n');
				break;
				case 'date':
					if(args.dbVendor === 'mysql') {
						mainQueryVariable = [
							"	var mainQuery = format( ", 
							"		'SELECT ${columns} \\", 
							"		FROM ${table} \\", 
							"		WHERE ${bindingColumn} > str_to_date(\\'${min}\\', \\'%Y-%m-%d %H:%i:%s\\') \\", 
							"		AND ${bindingColumn} <= str_to_date(\\'${max}\\', \\'%Y-%m-%d %H:%i:%s\\')',", 
							"		{ columns: columns, table: table, ", 
							"		bindingColumn: bindingColumn, ", 
							"		min: min, max: max } ", 
							"	);"
						].join('\n');
					} else if(args.dbVendor === 'mssql') {
						mainQueryVariable = [
							"	var mainQuery = format( ",
							"		'SELECT ${columns}' \\",
							"		FROM ${table} \\",
							"		WHERE ${bindingColumn} > ${min} \\",
							"		AND ${bindingColumn} <= ${max}', ",
							"		{ columns: columns, table: table, ", 
							"		bindingColumn: bindingColumn, ", 
							"		min: min, max: max } ", 
							"	);"
						].join('\n');
					} else {
						mainQueryVariable = [
							"	var mainQuery = format( ", 
							"		'SELECT ${columns} \\", 
							"		FROM ${table} \\", 
							"		WHERE ${bindingColumn} > to_date(\\'${min}\\', \\'YYYY-MM-DD HH24:MI:SS\\') \\", 
							"		AND ${bindingColumn} <= to_date(\\'${max}\\', \\'YYYY-MM-DD HH24:MI:SS\\')',", 
							"		{ columns: columns, table: table, ", 
							"		bindingColumn: bindingColumn, ", 
							"		min: min, max: max } ", 
							"	);"
						].join('\n');
					}
				break;
				case 'sequence':
					mainQueryVariable = [
						"	var mainQuery = format( ",
						"		'SELECT ${columns}' \\",
						"		FROM ${table} \\",
						"		WHERE ${bindingColumn} > ${min} \\",
						"		AND ${bindingColumn} < ${max}', ",
						"		{ columns: columns, table: table, ", 
						"		bindingColumn: bindingColumn, ", 
						"		min: min, max: max } ", 
						"	);"
					].join('\n');
				break;
			}

			return this;
		},

		//args: bindingType
		storeMax2Min: function(args) {
			if(args.bindingType === 'simple') return this;
			storeMax2Min = "repo('min', max);";
			return this;
		},

		get: function() {
			return [
				"/* ",
				"type: db2file ",
				"*/",
				variable,
				"jdbc.username = decrypt(jdbc.username); ",
				"jdbc.password = decrypt(jdbc.password); ",
				"schedule(period).run(function() { ",
				maxQueryVariable,
				minMaxVariable,
				"	database(jdbc)",
				"		.select(mainQuery)", 
				"		.result(function(resultset) {", 
				"			return resultset.join(delimiter).split('\\n').join('') + '\\n';", 
				"		})", 
				"		.group(100)", 
				"		.writeFile({",
				"			filename: outputFile,", 
				"			charset: charset", 
				"		});",
				storeMax2Min
				"});"
			].join('\n');
		}
	};
};

module.exports = CodePanel;