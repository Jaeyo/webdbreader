var React = require('react'),
	Promise = require('promise'),
	util = require('util'),
	StageMap = require('../../comps/stage-map.jsx').StageMap,
	Btn = require('../../comps/btn.jsx').Btn,
	Clearfix = require('../../comps/clearfix.jsx').Clearfix,
	Panel = require('../../comps/panel.jsx').Panel;

var SelectColumnPanel = React.createClass({
	selectedTableName: '',
	jdbcInfo: {},

	getDefaultProps() {
		return {
			visible: false,
			prevCallback: null,
			nextCallback: null
		}
	},

	getInitialState() {
		return {
			columns: []
		};
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
				if(result === false) return;
				this.loadColumns();
				.then(function(columns) {
					this.setState({ columns: columns });
				}.bind(this))
				.catch(function(err) {
					window.curtainAlert.show({ msg: util.format('컬럼 목록 로드에 실패했습니다. (%s)', err)});
				}.bind(this));
			}.bind(this)
		});
	},

	loadColumns() {
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
					<StageMap stages={stages} pos={2} />
				</div>
				<Panel>
					<Panel.Heading glyphicon="console">컬럼 선택</Panel.Heading>
					<Panel.Body>
						//TODO IMME
					</Panel.Body>
					<Panel.Footer>
						<span style={{ float: 'left' }}>
							<Btn onCLick={this.prev}>prev</Btn>
						</span>
						<span style={{ float: 'right' }}>
							<Btn onCLick={this.next}>next</Btn>
						</span>
						<Clearfix />
					</Panel.Footer>
				</Panel>
			</div>
		);
	}
});