var React = require('react'), 
	ReactCSS = require('reactcss'),
	Layer = require('react-layer'),
	jsUtil = require('../../utils/util.js'),
	color = jsUtil.color,
	server = require('../../utils/server.js'),
	Panel = require('../../comps/panel.jsx').Panel,
	KeyValueLine = require('../../comps/etc.jsx').getKeyValueLine('100px'),
	TextBox = require('../../comps/textbox.jsx').TextBox,
	DarkBlueSmallBtn = require('../../comps/btn.jsx').DarkBlueSmallBtn,
	LayerPopup = require('../../comps/layer-popup.jsx').LayerPopup,
	modalMixin = require('../../comps/layer-popup.jsx').modalMixin,
	Curtain = require('../../comps/layer-popup.jsx').Curtain,
	CurtainAlert = require('../../comps/layer-popup.jsx').CurtainAlert,
	ListItem = require('../../comps/etc.jsx').ListItem;


var BindingTypePanel = React.createClass({
	mixins: [ ReactCSS.mixin ],

	getDefaultProps() {
		return {
			bindingType: 'simple',
			bindingColumn: '',
			jdbcDriver: '',
			jdbcConnUrl: '',
			jdbcUsername: '',
			jdbcPassword: '',
			table: '',
			onChange: null
		};
	},

	onBindingColumnTextBoxClicked() {
		this.refs.bindingColumnModal.show();
	},

	classes() {
		return {
			default: {
				BindingTypeLine: {
					textAlign: 'center',
					padding: '10px'
				},
				BindingColumnTextBox: {
					width: '400px'
				}
			}
		};
	},

	styles() {
		return this.css();
	},

	render() {
		var bindingColumnLine = 
			this.props.bindingType === 'simple' ? null : 
				(<KeyValueLine label="바인딩 컬럼">
					<TextBox 
						is="BindingColumnTextBox"
						placeholder="binding column"
						value={this.props.bindingColumn}
						onClick={this.onBindingColumnTextBoxClicked} />
				</KeyValueLine>);

		return (
			<Panel>
				<Panel.SmallHeading glyphicon="cog">바인딩 타입</Panel.SmallHeading>
				<Panel.Body>
					<KeyValueLine label="바인딩 타입">
						<BindingTypeBtn 
							name="simple" 
							isClicked={this.props.bindingType === 'simple'} 
							onChange={this.props.onChange} />
						<BindingTypeBtn 
							name="date" 
							isClicked={this.props.bindingType === 'date'} 
							onChange={this.props.onChange} />
						<BindingTypeBtn 
							name="seq" 
							isClicked={this.props.bindingType === 'seq'} 
							onChange={this.props.onChange} />
					</KeyValueLine>
					{bindingColumnLine}
				</Panel.Body>
				<BindingColumnModal 
					ref="bindingColumnModal"
					table={this.props.table}
					jdbcDriver={this.props.jdbcDriver}
					jdbcConnUrl={this.props.jdbcConnUrl}
					jdbcUsername={this.props.jdbcUsername}
					jdbcPassword={this.props.jdbcPassword}
					onChange={this.onBindingColumnChanged} />
			</Panel>
		);
	}
});


var BindingTypeBtn = React.createClass({
	mixins: [ ReactCSS.mixin ],

	getDefaultProps() {
		return {
			isClicked: false,
			name: '',
			onChange: null
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

	onClick() {
		if(this.props.isClicked === false && this.props.onChange != null) {
			this.props.onChange({ bindingType: this.props.name });
		}
	},

	classes() {
		return {
			'default': {
				outer: {
					display: 'inline-block',
					width: '200px',
					height: '100px',
					cursor: 'pointer',
					textAlign: 'center',
					padding: '20px',
					overflow: 'hidden',
					backgroundColor: 'inherit',
					border: '1px solid ' + color.lightGray
				},
				title: {
					cursor: 'pointer',
					fontSize: '150%',
					display: 'block'
				},
				label: {
					cursor: 'pointer'
				}
			},
			'isClicked-true': {
				outer: {
					backgroundColor: color.darkGray,
					color: 'white'
				}
			},
			'isMouseOver': {
				outer: {
					backgroundColor: color.lightGray,
					color: 'black'
				}
			}
		};
	},

	styles() {
		return this.css({
			'isMouseOver': this.state.isMouseOver === true && this.props.isClicked === false
		});
	},

	render() {
		return (
			<div is="outer"
				onMouseOver={this.onMouseOver}
				onMouseOut={this.onMouseOut}
				onClick={this.onClick}>
				<label is="title"
					onClick={this.onClick}>
					{this.props.name}
				</label>
				<label is="label"
					onClick={this.onClick}>
					binding type
				</label>
			</div>
		);
	}
});


var BindingColumnModal = React.createClass({
	mixins: [ ReactCSS.mixin, modalMixin ],

	getDefaultProps() {
		return {
			table: '',
			jdbcDriver: '',
			jdbcConnUrl: '',
			jdbcUsername: '',
			jdbcPassword: '',
			onChange: null
		};
	},

	getInitialState() {
		return {
			visible: false,
			loadedColumnsStatus: 'loading',
			loadedColumns: []
		};
	},

	show() {
		this.loadColumns();
		this.setState({ visible: true });
	},

	hide() {
		this.setState({ visible: false });
	},

	loadColumns() {
		var jdbc = {
			driver: this.props.jdbcDriver,
			connUrl: this.props.jdbcConnUrl,
			username: this.props.jdbcUsername,
			password: this.props.jdbcPassword
		};

		server.loadColumns(jdbc, this.props.table).then(function(columns) {
			this.setState({
				loadedColumnsStatus: 'loaded',
				loadedColumns: columns
			});
		}.bind(this)).catch(function(err) {
			this.setState({ loadedColumnsStatus: 'failed' });
		}.bind(this));
	},

	onListChange(column) {
		this.props.onChange({ bindingColumn: column.columnName });
		this.hide();
	},

	classes() {
		return {
			'default': {
				loadingBox: {
					textAlign: 'center',
					padding: '10px',
					fontSize: '90%'
				},
				outer: {
					display: this.state.visible === true ? 'block' : 'none'
				}
			}
		}
	},

	styles() {
		return this.css();
	},

	render() {
		var loadedColumns = null;
		if(this.state.loadedColumnsStatus === 'loading') {
			loadedColumns = ( <div is="loadingBox">loading...</div> );
		} else if(this.state.loadedColumnsStatus === 'failed') {
			loadedColumns = ( <div is="loadingBox">load fail</div> );
		} else if(this.state.loadedColumnsStatus === 'loaded') {
			//TODO IMME

			loadedColumns = (
				<ColumnList
					items={this.state.loadedColumns}
					onChange={this.props.onChange} />
			);
		}

		return (
			<div is="outer">
				<Curtain />
				<div style={this.getModalDivStyle()}>
					{loadedColumns}
					<DarkBlueSmallBtn onClick={this.hide}>ok</DarkBlueSmallBtn>
				</div>
			</div>
		);
	}
});

var ColumnList = React.createClass({
	getDefaultProps() {
		return { 
			items: [],
			onChange: null
		};
	},

	render() {
		var outer = {
			height: '100px',
			overflow: 'auto'
		};

		var body = [];
		this.props.items.forEach(function(item) {
			var onClickFn = function() {
				this.props.onChange({ bindingColumn: item.columnName });
			}.bind(this);

			var name = util.format('%s (%s)', item.columnName, item.columnType);
			body.push(<ListItem key={name} name={name} onClick={onClickFn} />);
		}.bind(this));

		return (
			<div style={outer}>
				{body}
			</div>
		);
	}
});


module.exports = BindingTypePanel;