var React = require('react'), 
	util = require('util'),
	Promise = require('promise'),
	StageMap = require('../../comps/stage-map.jsx').StageMap,
	Panel = require('../../comps/panel.jsx').Panel,
	DashedTextBox = require('../../comps/textbox.jsx').DashedTextBox,
	Btn = require('../../comps/btn.jsx').Btn,
	DarkBlueXSBtn = require('../../comps/btn.jsx').DarkBlueXSBtn,
	Clearfix = require('../../comps/clearfix.jsx').Clearfix,
	color = require('../../utils/util.js').color;

var SelectTablePanel = React.createClass({
	jdbcInfo: {},

	getDefaultProps() {
		return {
			visible: false,
			prevCallback: null,
			nextCallback: null
		};
	},

	getInitialState() {
		return { 
			tableName: '',
			tables: []
		};
	},

	componentDidMount() {
		window.store.listen(function(action, data) {
			if(action !== window.store.actions.INPUT_DATABASE_INFO) return;
			this.jdbcInfo = {
				driver: data.jdbcDriver,
				connUrl: data.jdbcConnUrl,
				username: data.jdbcUsername,
				password: data.jdbcPassword
			};
		}.bind(this));
	},

	componentDidUpdate(prevProps, prevState) {
		if(prevProps.visible !== false || this.props.visible !== true) return;

		window.curtainYesOrNo.show({
			msg: '테이블 목록을 자동으로 불러올까요?',
			onClick: function(result) {
				if(result === false) return;
				this.loadTables()
				.then(function(tables) {
					this.setState({ tables: tables });
				}.bind(this))
				.catch(function(err) {
					window.curtainAlert.show({ msg: util.format('테이블 목록 로드에 실패했습니다. (%s)', err)});
				}.bind(this));
			}.bind(this)
		});
	},

	prev() {
		this.setState({ tableName: '' });
		this.props.prevCallback();
	},

	next() {
		window.store.dispatch(window.store.actions.SELECT_TABLE, this.state.tableName);
		this.props.nextCallback();
	},

	setTableName(tableName) {
		this.setState({ tableName: tableName });
	},

	loadTables() {
		return new Promise(function(resolve, reject) {
			window.curtainLoadingAlert.show({ msg: '테이블을 불러오는 중...' });
			$.getJSON('/REST/Database/Tables/', this.jdbcInfo) 
			.fail(function(err) {
				window.curtainLoadingAlert.hide();
				reject(err.statusText);
			}).done(function(resp) {
				window.curtainLoadingAlert.hide();
				if(resp.success !== 1) reject(resp.errmsg);
				else resolve(resp.tables);
			});
		}.bind(this));
	},

	render() {
		var outerDivStyle = {
			position: 'absolute',
			width: '700px',
			top: '50%',
			left: '50%',
			transform: 'translate(-50%, -50%)',
			display: this.props.visible === true ? 'block' : 'none'
		};

		var stages = [ 'DB정보 입력', '테이블 선택', '컬럼 선택' ];

		return (
			<div style={outerDivStyle}>
				<div style={{ width: '100%', height: '70px' }}>
					<StageMap stages={stages} pos={1} />
				</div>
				<Panel>
					<Panel.Heading glyphicon="console">테이블 선택</Panel.Heading>
					<Panel.Body>
						<TableBox 
							selectedTable={this.state.tableName}
							setTableNameCallback={this.setTableName}
							tables={this.state.tables} />
					</Panel.Body>
					<Panel.Footer>
						<span style={{ float: 'left' }}>
							<Btn onCLick={this.prev}>prev</Btn>
						</span>
						<span style={{ float: 'right' }}>
							<Btn onClick={this.next}>next</Btn>
						</span>
						<Clearfix />
					</Panel.Footer>
				</Panel>
			</div>
		);
	}
});
exports.SelectTablePanel = SelectTablePanel;

var TableBox = React.createClass({
	getDefaultProps() {
		return { 
			selectedTable: '', 
			setTableNameCallback: null,
			tables: []
		};
	},

	onChange(evt) {
		this.props.setTableNameCallback(evt.target.value);
	},

	render() {
		var tables = null;
		if(this.props.tables.length !== 0) {
			tables = this.props.tables.map(function(table) {
				if(this.props.selectedTable !== null && 
					table.toUpperCase().indexOf(this.props.selectedTable.toUpperCase()) == -1)
					return;

				var selectFn = function() {
					this.props.setTableNameCallback(table);
				}.bind(this);

				return (
					<div 
						key={table} 
						style={{ 
							padding: '1px 15px',
							borderBottom: '1px dotted ' + color.lightGray
						}}>
						<label style={{ marginRight: '3px' }}>{table}</label>
						<DarkBlueXSBtn onClick={selectFn}>선택</DarkBlueXSBtn>
					</div>
				);
			}.bind(this));
		}

		return (
			<div>
				<DashedTextBox 
					style={{ float: 'left ', width: '200px', marginRight: '4px' }}
					placeholder="table name"
					value={this.props.selectedTable}
					onChange={this.onChange} />
				<div style={{ maxHeight: '200px', overflow: 'auto' }}>
					{tables}
				</div>
				<Clearfix />
			</div>
		);
	}
});