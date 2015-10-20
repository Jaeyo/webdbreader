var React = require('react'),
	_ = require('underscore'),
	Layout = require('./comps/layout.jsx').Layout,
	CurtainLoadingView = require('./comps/modal.jsx').CurtainLoadingView,
	CurtainLoadingModalBox = require('./comps/modal.jsx').CurtainLoadingModalBox,
	InputDatabasePanel = require('./view-comps/new-db2file/input-database-panel.jsx').InputDatabasePanel;

window.store = {
	actions: {
		START_LOADING: 'start_loading',
		STOP_LOADING: 'stop_loading',
		INPUT_DATABASE_INFO: 'input_database_info',
		OPEN_MODAL: 'open_modal'
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
	test() {
		window.store.dispatch(window.store.actions.OPEN_MODAL, { msg: 'test' });
	},

	render() {
		return (
			<div style={{ position: 'relative', width: '100%', height: '100%' }}>
				<InputDatabasePanel nextCallback={this.test} />
			</div>
		);
	}
});

var CurtainLoadingViewWrapper = React.createClass({
	getInitialState() {
		return { visible: false };
	},
	componentDidMount() {
		window.store.listen(function(action, data) {
			if(action !== window.store.actions.START_LOADING) return;
			this.setState({ visible: true });
		}.bind(this));
	},
	render() {
		return (
			<div style={{
				position: 'absolute',
				left: '0',
				top: '0',
				height: '100%',
				width: '100%',
				display: this.state.visible === true ? 'block' : 'none'
			}}>
				<CurtainLoadingView  />
			</div>
		);
	}
});

var CurtainModalWrapper = React.createClass({
	onCloseCallback: null,

	getInitialState() {
		return {
			visible: false,
			msg: ''
		};
	},

	componentDidMount() {
		window.store.listen(function(action, data) {
			if(action !== window.store.actions.OPEN_MODAL) return;
			this.onCloseCallback = data.callback;
			this.setState({ visible: true, msg: data.msg });
		}.bind(this));
	},

	onClose() {
		this.setState({ visible: false });
		if(this.onCloseCallback) this.onCloseCallback();
	},

	render() {
		return (
			<div style={{
				position: 'absolute',
				left: '0',
				top: '0',
				height: '100%',
				width: '100%',
				display: this.state.visible === true ? 'block' : 'none'
			}}>
				<CurtainLoadingModalBox onClick={this.onClose}>{this.state.msg}</CurtainLoadingModalBox>
			</div>
		);
	}
});

React.render(
	<Layout active="script">
		<NewDb2FileView />
		<CurtainLoadingViewWrapper />
		<CurtainModalWrapper />
	</Layout>,
	document.body
);