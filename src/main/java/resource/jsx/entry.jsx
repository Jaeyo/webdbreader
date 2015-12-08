var React = require('react');
var ReactDOM = require('react-dom');
var QS = require('query-string');
var jsUtil = require('./utils/util.js');
var Layout = require('./comps/layout.jsx').Layout;
var ApiView = require('./api.jsx');
var ScriptView = require('./script.jsx');
var ScriptInfoView = require('./script-info.jsx');
var NewDb2FileView = require('./new-db2file.jsx');
var NewDb2DbView = require('./new-db2db.jsx');
require('./reset.css');

jsUtil.initPrototypeFunctions();

function getDOM() {
	var pathname = window.location.pathname;
	var params = QS.parse(location.search);

	try {
		if(pathname === '/' || pathname === '/Script') {
			return (
				<Layout active="script">
					<ScriptView />
				</Layout>
			);
		} else if(pathname == '/Script/Info') {
			if(!params.title) throw '404';

			return (
				<Layout active="script">
					<ScriptInfoView title={params.title} />
				</Layout>
			);
		} else if(pathname == '/Script/NewDb2File') {
			return (
				<Layout active="script">
					<NewDb2FileView />
				</Layout>
			);
		} else if(pathname == '/Script/NewDb2Db') {
			return (
				<Layout active="script">
					<NewDb2DbView />
				</Layout>
			);
		} else if(pathname == '/Api') {
			return (
				<Layout active="api">
					<ApiView />
				</Layout>
			);
		} else {
			throw '404';
		}
	} catch(code) {
		//TODO 404	
	}
}


ReactDOM.render(
	getDOM(),
	document.getElementById('container')
);