var React = require('react');

var Portal = React.createClass({
	component: null,
	target: null,

	getInitialState() {
		return { visible: false };
	},

	show() {
		this.setState({ visible: true });
	},

	hide() {
		this.setState({ visible: false });
	},

	componentDidMount() {
		this.target = document.createElement('div');
		document.body.appendChild(this.target);

		var element = React.createElement('div', null, this.props.children);
		this.component = React.render(element, this.target);
	},

	componentWillUnmount() {
		React.unmountComponentAtNode(this.target);
		this.component = null;
		document.body.removeChild(this.target);
		this.target = null;
	},

	componentDidUpdate(prevProps, prevState) {
		this.component.setProps(this.props);
		switch(this.state.visible) {
			case true: this.target.style.display = ''; break;
			case false: this.target.style.display = 'none'; break;
		}
	},

	render() {
		return null;
	}
});