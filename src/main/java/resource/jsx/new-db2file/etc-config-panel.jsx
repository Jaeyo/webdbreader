var React = require('react'),
	PolymerIcon = require('../comps/polymer-icon.jsx'),
	MaterialWrapper = require('../comps/material-wrapper.jsx'),
	Button = MaterialWrapper.Button,
	TextField = MaterialWrapper.TextField,
	SelectField = MaterialWrapper.SelectField,
	Card = MaterialWrapper.Card,
	CardHeader = MaterialWrapper.CardHeader,
	CardText = MaterialWrapper.CardText;

var EtcConfigPanel = React.createClass({
	PropTypes: {
		dataAdapter: React.PropTypes.object.isRequired
	},

	getInitialState() {
		return { 
			timeUnit: 'min',
			simplePeriod: '1'
		};
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
			this.props.dataAdapter.emit('stateChange', state);
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
		this.props.dataAdapter.emit('stateChange', { period: period });
	},

	styles() {
		return {
			card: {
				marginBottom: '10px'
			},
			periodTextField: {
				width: '100px',
				float: 'left'
			},
			timeunitSelectField: {
				width: '100px',
				float: 'left'
			},
			textFieldInputStyle: {
				color: 'black'
			}
		};
	},

	render() {
		var style = this.styles();
		return (
			<Card style={style.card}>
				<CardHeader
					title="기타 설정"
					subtitle="기타 설정"
					avatar={ <PolymerIcon icon="config" /> } />
				<CardText>
					<TextField
						style={style.periodTextField}
						value={this.state.simplePeriod}
						floatingLabelText="period"
						onChange={this.handleChange.bind(this, 'simplePeriod')} />
					<SelectField
						style={style.timeunitSelectField}
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
						inputStyle={style.textFieldInputStyle}
						fullWidth={true}
						value={this.props.dataAdapter.data('charset')}
						floatingLabelText="charset"
						onChange={this.handleChange.bind(this, 'charset')} />
					<TextField
						inputStyle={style.textFieldInputStyle}
						fullWidth={true}
						value={this.props.dataAdapter.data('delimiter')}
						floatingLabelText="delimiter"
						onChange={this.handleChange.bind(this, 'delimiter')} />
					<TextField
						inputStyle={style.textFieldInputStyle}
						fullWidth={true}
						value={this.props.dataAdapter.data('outputPath')}
						floatingLabelText="outputPath"
						onChange={this.handleChange.bind(this, 'outputPath')} />
				</CardText>
			</Card>
		);
	}
});

module.exports = EtcConfigPanel;