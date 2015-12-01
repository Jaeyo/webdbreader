var React = require('react');
var ReactDOM = require('react-dom');
var Layout = require('./comps/layout.jsx').Layout;
var ApiView = require('./api.jsx');
var ScriptView = require('./script.jsx');
var NewDb2FileView = require('./new-db2file.jsx');
require('./reset.css');


function getDOM() {
	var pathname = window.location.pathname;
	if(pathname === '/') {
		return (
			<Layout active="script">
				<ScriptView />
			</Layout>
		);
	} else if(pathname == '/Script/NewDb2File') {
		return (
			<Layout active="script">
				<NewDb2FileView />
			</Layout>
		);
	} else if(pathname == '/Api') {
		return (
			<Layout active="api">
				<ApiView />
			</Layout>
		);
	} else {
		//TODO 404
	}
}


ReactDOM.render(
	getDOM(),
	document.getElementById('container')
);