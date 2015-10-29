var React = require('react'),
	ReactCSS = require('reactcss'),
	Loading = require('react-loading'),
	DarkBlueBtn = require('./btn.jsx').DarkBlueBtn,
	boxShadow = require('../utils/util.js').boxShadow;

var Z_INDEX_CURTAIN = 100;
var Z_INDEX_OVER_CURTAIN = 200;


var modalMixin = {
	getModalDivStyle() {
		return {
			position: 'absolute',
			zIndex: Z_INDEX_OVER_CURTAIN,
			left: '50%',
			top: '50%',
			transform: 'translate(-50%, -50%)',
			backgroundColor: 'white',
			width: '400px',
			padding: '20px 30px 15px 30px',
			borderRadius: '5px',
			boxShadow: boxShadow.modalBox
		};
	}
};
exports.modalMixin = modalMixin;

var CurtainLoadingView = React.createClass({
	mixins: [ ReactCSS.mixin ],

	getInitialState() {
		return { visible: false };
	},

	show() {
		this.setState({ visible: true });
	},

	hide() {
		this.setState({ visible: false });
	},

	classes() {
		return {
			'default': {
				innerSpan: {
					position: 'absolute',
					left: '50%',
					top: '50%',
					transform: 'translate(-50%, -50%)'
				}			
			}
		}
	},

	styles() {
		return this.css();
	},

	render() {
		return (
			<div style={{ display: this.state.visible === true ? 'block' : 'none' }}>
				<Curtain />
				<span is="innerSpanStyle">
					<Loading type="bubbles" color="#e4e4e4" />
				</span>
			</div>
		);
	}
});


var CurtainLoadingAlert = React.createClass({
	mixins: [ ReactCSS.mixin, modalMixin ],

	getInitialState() {
		return { 
			visible: false,
			msg: ''
		};
	},

	show(args) {
		this.setState({ visible: true, msg: args.msg });
	},

	hide() {
		this.setState({ visible: false });
	},

	classes() {
		return {
			'default': {
				outer: {
					display: this.state.visible === true ? 'block' : 'none'
				}
			}
		}
	},

	styles() {
		return this.css();
	},

	render() {
		return (
			<div is="outer">
				<Curtain />
				<div style={this.getModalDivStyle()}>
					<div>
						<label>{this.state.msg}</label>
					</div>
					<div style={{ textAlign: 'center' }}>
						<Loading type="bubbles" color="#e4e4e4" />
					</div>
				</div>
			</div>
		);
	}
});


var CurtainAlert = React.createClass({
	mixins: [ ReactCSS.mixin, modalMixin ],

	getInitialState() {
		return { 
			visible: false,
			onClick: null,
			msg: ''
		};
	},

	componentDidUpdate() {
		if(this.state.visible === true)
			this.refs.btn.getDOMNode().focus();
	},

	show(args) {
		var state = {
			visible: true,
			msg: args.msg
		};
		if(args.onClick) state.onClick = args.onClick;
		this.setState(state);
	},


	hide() {
		this.setState({ visible: false });
	},

	onClick() {
		this.hide();
		if(this.state.onClick) this.state.onClick();
	},

	classes() {
		return {
			'default': {
				outer: {
					display: this.state.visible === true ? 'block' : 'none'
				}
			}
		}
	},

	styles() {
		return this.css();
	},

	render() {
		return (
			<div is="outer">
				<Curtain />
				<div style={this.getModalDivStyle()}>
					<div>
						<label>{this.state.msg}</label>
					</div>
					<div style={{ textAlign: 'center' }}>
						<DarkBlueBtn 
							ref="btn" 
							style={{ width: '100px' }} 
							onClick={this.onClick}>
							ok
						</DarkBlueBtn>
					</div>
				</div>
			</div>
		);
	}
});


var CurtainYesOrNo = React.createClass({
	mixins: [ ReactCSS.mixin, modalMixin ],
	getInitialState() {
		return {
			visible: false,
			onClick: null,
			btnNames: ['ok', 'cancel'],
			msg: ''
		};
	},

	componentDidUpdate() {
		if(this.state.visible === true) 
			this.refs.yesBtn.getDOMNode().focus();
	},

	show(args) {
		var state = { 
			visible: true, 
			onClick: args.onClick,
			msg: args.msg
		};
		if(args.btnNames) state.btnNames = args.btnNames;
		this.setState(state);
	},

	hide() {
		this.setState({ visible: false });
	},

	onYesClick(evt) {
		this.setState({ visible: false });
		this.state.onClick(true);
	},

	onNoClick(evt) {
		this.setState({ visible: false });
		this.state.onClick(false);
	},

	classes() {
		return {
			'default': {
				outer: {
					display: this.state.visible === true ? 'block' : 'none'
				}
			}
		}
	},

	styles() {
		return this.css();
	},

	render() {
		return (
			<div is="outer">
				<Curtain />
				<div style={this.getModalDivStyle()}>
					<div>
						<label>{this.state.msg}</label>
					</div>
					<div style={{ textAlign: 'center' }}>
						<DarkBlueBtn 
							ref="yesBtn"
							style={{ width: '80px', marginRight: '10px' }} 
							onClick={this.onYesClick}>
							{this.state.btnNames[0]}
						</DarkBlueBtn>
						<DarkBlueBtn 
							style={{ width: '80px' }} 
							onClick={this.onNoClick}>
							{this.state.btnNames[1]}
						</DarkBlueBtn>
					</div>
				</div>
			</div>
		);
	}
});


var LayerPopup = React.createClass({
	componentDidMount() {
		window.curtainLoadingView = this.refs.curtainLoadingView;
		window.curtainLoadingAlert = this.refs.curtainLoadingAlert;
		window.curtainAlert = this.refs.curtainAlert;
		window.curtainYesOrNo = this.refs.curtainYesOrNo;
	},

	render() {
		return (
			<div>
				<CurtainLoadingView ref="curtainLoadingView" />
				<CurtainLoadingAlert ref="curtainLoadingAlert" />
				<CurtainAlert ref="curtainAlert" />
				<CurtainYesOrNo ref="curtainYesOrNo" />
			</div>
		);
	}
});
exports.LayerPopup = LayerPopup;

var Curtain = React.createClass({
	mixins: [ ReactCSS.mixin ],

	classes() {
		return {
			'default': {
				outer: {
					position: 'absolute',
					zIndex: Z_INDEX_CURTAIN,
					left: '0',
					top: '0',
					width: '100%',
					height: '100%',
					backgroundColor: 'gray',
					opacity: '0.6'
				}
			}
		}
	},

	styles() {
		return this.css();
	},

	render() {
		return (
			<div is="outer" />
		);
	}
});
exports.Curtain = Curtain;