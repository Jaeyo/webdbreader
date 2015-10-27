var React = require('react'),
	_ = require('underscore'),
	jsUtil = require('./utils/util.js'),
	color = jsUtil.color,
	Layout = require('./comps/layout.jsx').Layout,
	LayerPopup = require('./comps/layer-popup.jsx').LayerPopup,
	InputDatabasePanel = require('./view-comps/new-db2file/input-database-panel.jsx').InputDatabasePanel,
	SelectTablePanel = require('./view-comps/new-db2file/select-table-panel.jsx').SelectTablePanel,
	SelectColumnPanel = require('./view-comps/new-db2file/select-column-panel.jsx').SelectColumnPanel;

window.store = {
	actions: {
		INPUT_DATABASE_INFO: 'input_database_info',
		SELECT_TABLE: 'select_table',
	},
	listeners: [],
	listen(listener) {
		this.listeners.push(listener);
	},
	dispatch(action, data) {
		this.listeners.forEach(function(listener) {
			listener(action, data);
		});
	}
};


var NewDb2FileView = React.createClass({
	getInitialState() {
		return { currentPage: 'database 설정' };
	},

	inputDatabasePanelNext() {
		this.refs.inputDatabasePanel.beforeNext().then(function(goNext) {
			if(goNext === true) 
				this.setState({ currentPage: 'table 설정' });
		}.bind(this)).catch(function(err) {
			console.error(err);
		});
	},

	selectTablePanelPrev() {
		this.refs.selectTablePanel.beforePrev().then(function(goPrev) {
			if(goPrev === true) 
				this.setState({ currentPage: 'database 설정' });
		}.bind(this)).catch(function(err) {
			console.error(err);
		});
	},

	selectTablePanelNext() {
		this.refs.selectTablePanel.beforeNext().then(function(goNext) {
			if(goNext === true)
				this.setState({ currentPage: 'column 설정' });
		}.bind(this)).catch(function(err) {
			console.error(err);
		});
	},

	selectColumnPanelPrev() {
		this.refs.selectColumnPanel.beforePrev().then(function(goPrev) {
			if(goPrev === true)
				this.setState({ currentPage: 'table 설정' });
		}.bind(this)).catch(function(err) {
			console.error(err);
		});
	},

	selectColumnPanelNext() {
		//TODO
	},

	onMenuClick(menu) {
		this.refs[this.state.currentPage].beforeNext();
		this.setState({ currentPage: menu });
	},

	render() {
		return (
			<div style={{ position: 'relative', width: '100%', height: '100%' }}>
				<div style={{ float: 'right' }}>
					<MenuNav 
						currentPage={this.state.currentPage}
						linkable={false}
						onClick={this.onMenuClick} />
				</div>
				<InputDatabasePanel 
					visible={this.state.currentPage === 'database 설정'} 
					ref="inputDatabasePanel" 
					key="inputDatabasePanel" 
					onNext={this.inputDatabasePanelNext} />
				<SelectTablePanel 
					visible={this.state.currentPage === 'table 설정'} 
					ref="selectTablePanel" 
					key="selectTablePanel"
					onPrev={this.selectTablePanelPrev} 
					onNext={this.selectTablePanelNext} />
				<SelectColumnPanel
					visible={this.state.currentPage === 'column 설정'}
					ref="selectColumnPanel"
					key="selectColumnPanel"
					onPrev={this.selectColumnPanelPrev}
					onNext={this.selectColumnPanelNext} />

			</div>
		);
	}
});


var MenuNav = React.createClass({
	getDefaultProps() {
		return { 
			currentPage: 'database 설정',
			isClickable: false,
			onClick: null
		};
	},

	onMenuClick(evt) {
		if(this.props.onClick) this.props.onClick(evt.target.value);
	},

	render() {
		var menus = [
			'database 설정',
			'table 설정',
			'column 설정',
			'binding type 설정',
			'기타 설정',
			'script 확인'
		];

		var listItems = menus.map(function(menu) {
			return (
				<MenuNav.Item 
					isActive={this.props.currentPage === menu}
					isClickable={this.props.isClickable}
					onClick={this.props.onClick}
					key={menu}
					value={menu} />);
		}.bind(this));

		return ( <ul style={{ margin: '0', padding: '0' }}>{listItems}</ul> );
	}
});


MenuNav.Item = React.createClass({
	getDefaultProps() {
		return {
			isActive: false,
			isClickable: false,
			onClick: null,
			value: ''
		};
	},

	getInitialState() {
		return { isHover: false };
	},

	onClick(evt) {
		if(this.props.isClickable === true)
			this.props.onClick(evt.target.value);
	},

	onMouseOver(evt) {
		this.setState({ isHover: true });
	},

	onMouseOut(evt) {
		this.setState({ isHover: false });
	},

	render() {
		var style = { 
			listStyle: 'none',
			padding: '3px 3px 3px 10px',
			width: '145px',
			borderRight : '6px solid ' + color.darkBlue,
			margin: '0 0 3px 5px',
			backgroundColor: 'inherit',
			color: color.darkBlue
		};

		if(this.state.isHover === true || this.props.isActive) {
			style.backgroundColor = color.darkBlue;
			style.color = 'white';
		}

		if(this.props.isClickable === true) 
			style.cursor = 'pointer';

		return (
			<li
				style={style}
				value={this.props.value}
				onClick={this.onClick}
				onMouseOver={this.onMouseOver}
				onMouseOut={this.onMouseOut}>
				{this.props.value}
			</li>
		);
	}
});


React.render(
	<Layout active="script">
		<NewDb2FileView />
		<LayerPopup />
	</Layout>,
	document.body
);