var React = require('react'),
	Promise = require('promise'),
	util = require('util'),
	StageMap = require('../../comps/stage-map.jsx').StageMap,
	Btn = require('../../comps/btn.jsx').Btn,
	Clearfix = require('../../comps/clearfix.jsx').Clearfix,
	Panel = require('../../comps/panel.jsx').Panel,
	DashedTagTextBox = require('../../comps/tag-textbox.jsx').DashedTagTextBox,
	DarkBlueXSBtn = require('../../comps/btn.jsx').DarkBlueXSBtn,
	color = require('../../utils/util.js').color;

Array.prototype.remove = require('array-remove-by-value');

var SelectColumnPanel = React.createClass({
	selectedTableName: '',
	jdbcInfo: {},

	getDefaultProps() {
		return {
			visible: false,
			onPrev: null,
			onNext: null
		}
	},

	getInitialState() {
		return {
			selectedColumns: [],
			columns: []
		};
	},

	beforeNext() {
		return new Promise(function(resolve, reject) {
			resolve(true);
		}.bind(this));
	},

	beforePrev() {
		return new Promise(function(resolve, reject) {
			resolve(true);
		}.bind(this));
	},

	componentDidMount() {
		window.store.listen(function(action, data) {
			if(action !== window.store.actions.SELECT_TABLE) return;
			this.selectedTableName = data;
		}.bind(this));

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
			msg: '컬럼 목록을 자동으로 불러올까요?',
			onClick: function(result) {
				if(result === true) {
					this.loadColumns()
					.then(function(columns) {
						this.setState({ columns: columns, selectedColumns: [] });
					}.bind(this))
					.catch(function(err) {
						window.curtainAlert.show({ msg: util.format('컬럼 목록 로드에 실패했습니다. (%s)', err)});
					}.bind(this));
				} else {
					this.setState({ columns: [] });
				}
			}.bind(this)
		});
	},

	loadColumns() {
		return new Promise(function(resolve, reject) {
			window.curtainLoadingAlert.show({ msg: '컬럼을 불러오는 중...' });
			$.getJSON(util.format('/REST/Database/Columns/%s/', this.selectedTableName), this.jdbcInfo)
			.fail(function(err) {
				window.curtainLoadingAlert.hide();
				reject(err.statusText);
			}).done(function(resp) {
				window.curtainLoadingAlert.hide();
				if(resp.success !== 1) reject(resp.errmsg);
				else resolve(resp.columns);
			});
		}.bind(this));
	},

	addSelectedColumn(column) {
		this.setState({
			selectedColumns: this.state.selectedColumns.concat([ column ])
		});
	},

	removeSelectedColumn(column) {
		var selectedColumns = this.state.selectedColumns;
		selectedColumns.remove(column);
		this.setState({ selectedColumns: selectedColumns });
	},

	selectAll(evt) {
		var columns = [];
		this.state.columns.forEach(function(column) {
			if(this.state.selectedColumns.indexOf(column.columnName) === -1)
				columns.push(column.columnName);
		}.bind(this));

		this.setState({
			selectedColumns: this.state.selectedColumns.concat(columns)
		});
	},

	render() {
		var outerDivStyle = { 
			display: this.props.visible === true ? 'block' : 'none',
			float: 'left',
			width: 'calc(100% - 150px)'
		};

		var stages = [ 'database 설정', 'table 설정', 'column 설정', 'binding type 설정', '기타 설정', 'script 확인' ];

		return (
			<div style={outerDivStyle}>
				<div style={{ width: '100%', height: '70px' }}>
					<StageMap stages={stages} pos={2} />
				</div>
				<Panel>
					<Panel.Heading glyphicon="console">컬럼 선택</Panel.Heading>
					<Panel.Body>
						<label>컬럼 입력: </label>
						<DashedTagTextBox 
							tags={this.state.selectedColumns}
							addTagCallback={this.addSelectedColumn}
							removeTagCallback={this.removeSelectedColumn} />
						<ColumnBox 
							columns={this.state.columns}
							selectColumnCallback={this.addSelectedColumn} />
						<div style={{ float: 'right' }}>
							<Btn onClick={this.selectAll}>전체 선택</Btn>
						</div>
						<Clearfix />
					</Panel.Body>
					<Panel.Footer>
						<span style={{ float: 'left' }}>
							<Btn onClick={this.props.onPrev}>prev</Btn>
						</span>
						<span style={{ float: 'right' }}>
							<Btn onClick={this.props.onNext}>next</Btn>
						</span>
						<Clearfix />
					</Panel.Footer>
				</Panel>
			</div>
		);
	}
});
exports.SelectColumnPanel = SelectColumnPanel;

var ColumnBox = React.createClass({
	getDefaultProps() {
		return { 
			columns: [],
			selectColumnCallback: null
		};
	},

	render() {
		var columns = this.props.columns.map(function(column) {
			var selectFn = function() {
				this.props.selectColumnCallback(column.columnName);
			}.bind(this);

			return (
				<div
					key={column.columnName} 
					style={{
						padding: '1px 15px',
						borderBottom: '1px dotted ' + color.lightGray
					}}>
					<label style={{ marginRight: '3px' }}>
						{util.format('%s (%s)', column.columnName, column.columnType)}
						<DarkBlueXSBtn onClick={selectFn}>선택</DarkBlueXSBtn>
					</label>
				</div>
			);
		}.bind(this));

		return (<div style={{ maxHeight: '200px', overflow: 'auto' }}>{columns}</div>);

	}
});