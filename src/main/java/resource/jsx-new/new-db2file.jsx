var React = require('react'),
	_ = require('underscore'),
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
		return { currentPage: 'inputDatabasePanel' };
	},

	inputDatabasePanelNext() {
		this.setState({ currentPage: 'selectTablePanel' });
	},

	selectTablePanelPrev() {
		this.setState({ currentPage: 'inputDatabasePanel' });
	},

	selectTablePanelNext() {
		this.setState({ currentPage: 'selectColumnPanel' });
	},

	selectColumnPanelPrev() {
		this.setState({ currentPage: 'selectTablePanel' });
	},

	selectColumnPanelNext() {
		//TODO
	},

	render() {
		return (
			<div style={{ position: 'relative', width: '100%', height: '100%' }}>
				<InputDatabasePanel 
					visible={this.state.currentPage === 'inputDatabasePanel'}
					nextCallback={this.inputDatabasePanelNext} />
				<SelectTablePanel
					visible={this.state.currentPage === 'selectTablePanel'}
					prevCallback={this.selectTablePanelPrev}
					nextCallback={this.selectTablePanelNext} />
				<SelectColumnPanel
					visible={this.state.currentPage === 'selectColumnPanel'}
					prevCallback={this.selectColumnPanelPrev}
					nextCallback={this.selectColumnPanelNext} />

			</div>
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