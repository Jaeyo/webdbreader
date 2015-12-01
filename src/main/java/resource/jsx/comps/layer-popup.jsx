var React = require('react'),
	ReactCSS = require('reactcss'),
	Loading = require('react-loading'),
	Layer = require('react-layer'),
	boxShadow = require('../utils/util.js').boxShadow,
	MaterialWrapper = require('./material-wrapper.jsx'),
	CircularProgress = MaterialWrapper.CircularProgress,
	Button = MaterialWrapper.Button;

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

var CurtainCancelableLoadingAlert = React.createClass({
	mixins: [ modalMixin ],
	getDefaultProps() {
		return {
			msg: '',
			hide: null
		};
	},

	styles() {
		return {
			modal: this.getModalDivStyle(),
			msgDiv: {
				paddingTop: '10px',
				textAlign: 'center'
			},
			loadingDiv: {
				textAlign: 'center'
			},
			btnDiv: {
				paddingBottom: '10px',
				textAlign: 'center'
			},
			cancelBtn: {
				width: '100px'
			}
		};
	},

	render() {
		var style = this.styles();
		return (
			<div>
				<Curtain onClick={this.props.hide} />
				<div style={styles.modal}>
					<div style={style.msgDiv}>{this.props.msg}</div>
					<div style={style.loadingDiv}>
						<CircularProgress mode="indeterminate" />
					</div>
					<div style={style.btnDiv}>
						<Button 
							style={style.cancelBtn} 
							label="cencel"
							onClick={this.props.hide} />
					</div>
				</div>
			</div>
		);
	}
});
exports.getCurtainCancelableLoadingAlert = function(msg) {
	var hide = function() {
		layer.destroy();
	}.bind(this);

	var layer = new Layer(document.body, function() {
		return (<CurtainCancelableLoadingAlert msg={msg} hide={hide} />);
	});

	return {
		show() {
			layer.render();
		},
		hide() {
			layer.destroy();
		}
	};
};


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
						<Button
							ref="btn" 
							style={{ width: '100px' }} 
							onClick={this.onClick}
							label="ok" />
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
						<Button
							ref="yesBtn"
							style={{ width: '80px', marginRight: '10px' }} 
							onClick={this.onYesClick}
							label={this.state.btnNames[0]} />
						<Button
							style={{ width: '80px' }} 
							onClick={this.onNoClick}
							label={this.state.btnNames[1]} />
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

	getDefaultProps() {
		return { onClick: null };
	},

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

	onClick() {
		if(this.props.onClick)
			this.props.onClick();
	},

	styles() {
		return this.css();
	},

	render() {
		return (
			<div is="outer" onClick={this.onClick} />
		);
	}
});
exports.Curtain = Curtain;