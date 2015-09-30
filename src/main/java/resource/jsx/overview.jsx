var React = require('react'),
	Bs = require('react-bootstrap'),
	AreaLayout = require('./area-layout.jsx'),
	TopArea = AreaLayout.TopArea,
	BottomArea = AreaLayout.BottomArea;

var OverviewContentsView = React.createClass({
	render: function() {
		//TODO IMME
	} //render
});

React.render(
	<Bs.Grid fluid>	
		<TopArea title="overview" />
		<BottomArea contentsAreaComponent={<OverviewContentsView />} />
	</Bs.Grid fluid>,
	document.body
);