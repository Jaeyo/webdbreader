var React = require('react'),
	Bs = require('react-bootstrap'),
	util = require('util');

var TopArea = React.createClass({
	getDefaultProps: function() {
		return {
			title: ''
		};
	}, //getDefaultProps
	render: function() {
		return (
			<div className="top-area">
				<div className="logo-area">
					<a href="/">SpDbReader</a>
				</div>
				<div className="title-area">
					<h3>{this.props.title}</h3>
				</div>
			</div>
		);
	} //render
});

var BottomArea = React.createClass({
	getDefaultProps: function() {
		return {
			contentsAreaComponent: null
		};
	}, //getDefaultProps
	render: function() {
		return (
			<div className="bottom-area">
				<BottomArea.MenuArea />
				{this.props.contentsAreaComponent}
			</div>
		);
	} //render
});

BottomArea.MenuArea = React.createClass({
	getInitialState: function() {
		return {
			scripts: []
		};
	}, //getInitialState
	newScript: function() {
		//TODO
	}, //newScript
	render: function() {
		var scriptBtns = null;
		if(this.state.scripts.length === 0) {
			scriptBtns = (<Bs.Well>no script</Bs.Well>);
		} else {
			var scriptMenuItemProps = [];
			this.props.scripts.forEach(function(script) {
				scriptMenuItemProps.push({
					link: util.format('/Script/View/%s', script.SCRIPT_NAME),
					name: script.SCRIPT_NAME,
					glyphiconName: 'console'				
				});
			});
			scriptBtns = (<BottomArea.MenuArea.MenuItem items={scriptMenuItemProps} />);
		} //if

		return (
			<div className="menu-area">
				<div>
					<Bs.Button className="new-script-btn" onClick={this.newScript}>new script</Bs.Button>
				</div>
				<hr />
				<BottomArea.MenuArea.MenuItem items={[
					{ link: '/', name: 'overview', glyphiconName: 'cloud' }
				]} />
				<hr />
				<h5>scripts</h5>
				{scriptBtns}
				<hr />
				<BottomArea.MenuArea.MenuArea items={[
					{ link: '/Config/', name: 'configuration', glyphiconName: 'cog'}
				]} />
			</div>
		);
	} //render
});

BottomArea.MenuArea.MenuItem = React.createClass({
	getDefaultProps: function() {
		return {
			items: []
		};
		// item: {
		// 	link: (string),
		//	name: (string),
		//	glyphiconName: (string)
		// }
	}, //getDefaultProps
	render: function() {
		var items = [];
		this.props.items.forEach(function(item) {
			items.push(
				<li>
					<a href={item.link}>
						<Glyphicon className="pull-left" glyph={item.glyphiconName} />
						<span className="pull-right">{item.name}</span>
						<div className="clearfix" />
					</a>
				</li>
			);
		});
		return (
			<ul>{items}</ul>
		);
	} //render
}); //MenuItem