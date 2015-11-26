var React = require('react'),
	util = require('util'),
	ScriptMaker = require('./db2file-script-maker.js'),
	MaterialWrapper = require('../../comps/material-wrapper.jsx'),
	TextField = MaterialWrapper.TextField,
	Card = MaterialWrapper.Card,
	CardHeader = MaterialWrapper.CardHeader,
	CardText = MaterialWrapper.CardText,
	PolymerIcon = require('../../comps/polymer-icon.jsx');

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
		period: React.PropTypes.string.isRequired,
		charset: React.PropTypes.string.isRequired,
		delimiter: React.PropTypes.string.isRequired,
		outputPath: React.PropTypes.string.isRequired,
		onChange: React.PropTypes.func.isRequired
	},

	componentDidMount() {
		this.editor = ace.edit('editor');
		this.editor.setTheme('ace/theme/github');
		this.editor.getSession().setMode('ace/mode/javascript');
		this.editor.setKeyboardHandler('ace/keyboard/vim');
		this.editor.on('change', function(e) {
			this.props.onChange({ script: this.editor.getValue() });
		}.bind(this));
		this.editor.$blockScrolling = Infinity;
	},

	componentWillReceiveProps(newProps) {
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
			outputPath: newProps.outputPath
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
			card: {
				marginBottom: '10px'
			},
			editorWrapper: {
				position: 'relative',
				height: '400px'
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
			<Card style={style.card}>
				<CardHeader
					title="스크립트"
					subtitle="생성된 스크립트를 확인/수정합니다."
					avatar={ <PolymerIcon icon="config" />} />
				<CardText>
					<div id="editor-wrapper" style={style.editorWrapper}>
						<div id="editor" style={style.editor} />
					</div>
				</CardText>
			</Card>
		);
	}
});

module.exports = CodePanel;