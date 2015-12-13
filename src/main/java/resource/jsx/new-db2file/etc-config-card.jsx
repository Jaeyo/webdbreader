var React = require('react');
var PolymerIcon = require('../comps/polymer-icon.jsx');
var MaterialWrapper = require('../comps/material-wrapper.jsx');
var Button = MaterialWrapper.Button;
var TextField = MaterialWrapper.TextField;
var SelectField = MaterialWrapper.SelectField;
var Card = MaterialWrapper.Card;
var CardHeader = MaterialWrapper.CardHeader;
var CardText = MaterialWrapper.CardText;


var EtcConfigCard = React.createClass({
	PropTypes: {
		handleStateChange: React.PropTypes.func.isRequired,

		period: React.PropTypes.string.isRequired,
		charset: React.PropTypes.string.isRequired,
		delimiter: React.PropTypes.string.isRequired,
		outputPath: React.PropTypes.string.isRequired
	},

	getInitialState() {
		return { 
			timeUnit: 'min',
			simplePeriod: '1'
		};
	},

	componentWillMount() {
		this.initTimeUnitAndSimplePeriod();
	},

	initTimeUnitAndSimplePeriod() {
		var period = this.props.period.split(' ').join('');
		if(String.contains(period, '*24*60*60*1000')) {
			this.setState({
				timeUnit: 'day',
				simplePeriod: period.replace('*24*60*60*1000')
			});
		} else if(String.contains(period, '*60*60*1000')) {
			this.setState({
				timeUnit: 'hour',
				simplePeriod: period.replace('*60*60*1000')
			});
		} else if(String.contains(period, '*60*1000')) {
			this.setState({
				timeUnit: 'min',
				simplePeriod: period.replace('*60*1000')
			});
		} else if(String.contains(period, '*1000')) {
			this.setState({
				timeUnit: 'sec',
				simplePeriod: period.replace('*1000')
			});
		}
	},

	handleChange(name, evt) {
		evt.stopPropagation();

		switch(name) {
		case 'simplePeriod':
		case 'timeUnit':
			var state = {
				simplePeriod: this.state.simplePeriod,
				timeUnit: this.state.timeUnit
			};
			state[name] = evt.target.value;
			this.setState(state);
			this.updatePeriod(state.simplePeriod, state.timeUnit);
			break;
		case 'charset':
		case 'delimiter':
		case 'outputPath':
			var state = {};
			state[name] = evt.target.value;
			this.props.handleStateChange(state);
			break;
		}
	},

	updatePeriod(simplePeriod, timeUnit) {
		var period = simplePeriod;
		switch(timeUnit) {
		case 'sec':
			period += ' * 1000';
			break;
		case 'min':
			period += ' * 60 * 1000';
			break;
		case 'hour': 
			period += ' * 60 * 60 * 1000';
			break;
		case 'day': 
			period += ' * 24 * 60 * 60 * 1000';
			break;
		}
		this.props.handleStateChange({ period: period });
	},

	render() {
		return (
			<Card style={{ marginBottom: '10px' }}>
				<CardHeader
					title="기타 설정"
					subtitle="기타 설정"
					avatar={ <PolymerIcon icon="config" /> } />
				<CardText>
					<TextField
						style={{ width: '100px', float: 'left' }}
						value={this.state.simplePeriod}
						floatingLabelText="period"
						onChange={this.handleChange.bind(this, 'simplePeriod')} />
					<SelectField
						style={{ width: '100px', float: 'left' }}
						floatingLabelText="timeunit"
						value={this.state.timeUnit}
						onChange={this.handleChange.bind(this, 'timeUnit')}
						menuItems={[
							{ text: '초', payload: 'sec' },
							{ text: '분', payload: 'min' },
							{ text: '시간', payload: 'hour' },
							{ text: '일', payload: 'day' },
							{ text: '일2', payload: 'day2' }
						]} />
					<TextField
						fullWidth={true}
						value={this.props.charset}
						floatingLabelText="charset"
						onChange={this.handleChange.bind(this, 'charset')} />
					<TextField
						fullWidth={true}
						value={this.props.delimiter}
						floatingLabelText="delimiter"
						onChange={this.handleChange.bind(this, 'delimiter')} />
					<TextField
						fullWidth={true}
						value={this.props.outputPath}
						floatingLabelText="outputPath"
						onChange={this.handleChange.bind(this, 'outputPath')} />
				</CardText>
			</Card>
		);
	}
});

module.exports = EtcConfigCard;