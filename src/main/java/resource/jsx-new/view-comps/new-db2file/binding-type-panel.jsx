var React = require('react'),
	jsUtil = require('../../utils/util.js'),
	color = jsUtil.color,
	Panel = require('../../comps/panel.jsx').Panel,
	KeyValueLine = require('../../comps/etc.jsx').getKeyValueLine('100px'),
	TextBox = require('../../comps/textbox.jsx').TextBox,
	LayerPopup = require('../../comps/layer-popup.jsx').LayerPopup,
	Curtain = require('../../comps/layer-popup.jsx').Curtain;


var BindingTypePanel = React.createClass({
	getInitialState() {
		return {
			bindingType: 'simple',
			bindingColumn: ''
		};
	},

	onChange(bindingType) {
		this.setState({ bindingType: bindingType });
	},


	onBindingColumnTextBoxClicked() {
		//TODO
	},


	render() {
		return (
			<Panel>
				<Panel.SmallHeading glyphicon="cog">바인딩 타입</Panel.SmallHeading>
				<Panel.Body>
					<KeyValueLine label="바인딩 타입" style={{ textAlign: 'center', padding: '10px' }}>
						<BindingTypeBtn 
							name="simple" 
							isClicked={this.state.bindingType === 'simple'} 
							onChange={this.onChange} />
						<BindingTypeBtn 
							name="date" 
							isClicked={this.state.bindingType === 'date'} 
							onChange={this.onChange} />
						<BindingTypeBtn 
							name="seq" 
							isClicked={this.state.bindingType === 'seq'} 
							onChange={this.onChange} />
					</KeyValueLine>
					<KeyValueLine label="바인딩 컬럼" style={{ display: this.state.bindingType === 'simple' ? 'none' : 'display' }}>
						<TextBox 
							placeholder="binding column"
							value={this.state.bindingColumn}
							onClick={this.onBindingColumnTextBoxClicked} />
					</KeyValueLine>
				</Panel.Body>
			</Panel>
		);
	}
});


var BindingTypeBtn = React.createClass({
	getDefaultProps() {
		return {
			isClicked: false,
			name: '',
			onChange: null
		};
	},

	getInitialState() {
		return { isMouseOver: false };
	},

	onMouseOver() {
		this.setState({ isMouseOver: true });
	},

	onMouseOut() {
		this.setState({ isMouseOver: false });
	},

	onClick() {
		if(this.props.isClicked === false && this.props.onChange)
			this.props.onChange(name);
	},

	render() {
		var outer = {
			width: '100px',
			height: '100px',
			cursor: 'pointer',
			textAlign: 'center',
			padding: '30px 10px',
			overflow: 'hidden',
			backgroundColor: 'inherit',
			border: '1px solid ' + color.lightGray
		};

		var titleStyle = { fontSize: '150%' };

		if(this.props.isClicked === true) {
			outer.backgroundColor = color.darkGray;
			outer.color = 'white';
		} else if(this.state.isMouseOver === true) {
			outer.backgroundColor = color.lightGray;
		}

		return (
			<div
				style={outer}
				onMouseOver={this.onMouseOver}
				onMouseOut={this.onMouseOut}
				onClick={this.onClick}>
				<label style={titleStyle}>{this.props.name}</label>
				<label>binding type</label>
			</div>
		);
	}
});


var BindingColumnModal = React.createClass({
	mixins = [ LayerPopup.modalMixin ],

	getDefaultProps() {
		return {
			//TODO
		};
	},

	getInitialState() {
		return { visible: false };
	},

	show() {
		//TODO
	},

	hide() {
		//TODO
	},

	loadColumns() {
		//TODO
	},

	render() {
		return (
			<div style={{ display: this.state.visible === true ? 'block' : 'none' }}>
				<Curtain />
				<div style={this.getModalDivStyle()}>
					//TODO IMME
				</div>
			</div>
		);
	}
});


module.exports = BindingTypePanel;