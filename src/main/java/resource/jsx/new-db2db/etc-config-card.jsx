'use strict';

import React from 'react';
import PolymerIcon from '../comps/polymer-icon.jsx';
import {
	Button,
	TextField,
	SelectField,
	Card,
	CardHeader,
	CardText,
	CheckBox
} from '../comps/material-wrapper.jsx';
import { Clearfix } from '../comps/clearfix.jsx';


var EtcConfigCard = React.createClass({
	PropTypes: {
		handleStateChange: React.PropTypes.func.isRequired,
		period: React.PropTypes.string.isRequired,
		deleteAllBeforeInsert: React.PropTypes.string.isRequired,
		bindingType: React.PropTypes.string.isRequired
	},

	getInitialState() {
		return { 
			timeUnit: 'min',
			simplePeriod: '1'
		};
	},

	componentWillMount() {
		try {
			this.initTimeUnitAndSimplePeriod();
		} catch(err) {
			console.error(err.stack);
		}
	},

	initTimeUnitAndSimplePeriod() {
		var { props } = this;

		var period = props.period;
		if(typeof period === 'string') period = eval(period);

		if(period >= (24*60*60*1000) && (period % (24*60*60*1000)) === 0) {
			this.setState({
				timeUnit: 'day',
				simplePeriod: period / (24*60*60*1000)
			});
		} else if(period >= (60*60*1000) && (period % (60*60*1000)) === 0) {
			this.setState({
				timeUnit: 'hour',
				simplePeriod: period / (60*60*1000)
			});
		} else if(period >= (60*1000) && (period % (60*1000)) === 0) {
			this.setState({
				timeUnit: 'min',
				simplePeriod: period / (60*1000)
			});
		} else {
			this.setState({
				timeUnit: 'sec',
				simplePeriod: Math.floor(period / 1000)
			});
		}
	},

	handleChange(name, evt) {
		try {
			evt.stopPropagation();

			var { state } = this;

			switch(name) {
			case 'simplePeriod':
			case 'timeUnit':
				var newState = {
					simplePeriod: state.simplePeriod,
					timeUnit: state.timeUnit
				};
				newState[name] = evt.target.value;
				this.setState(newState);
				this.updatePeriod(newState.simplePeriod, newState.timeUnit);
				break;
			}
		} catch(err) {
			console.error(err.stack);
		}
	},

	updatePeriod(simplePeriod, timeUnit) {
		var { props } = this;

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
		props.handleStateChange({ period: period });
	},

	onClickDeleteAllBeforeInsertCheckBox(evt, result) {
		try {
			evt.stopPropagation();
			var { props } = this;
			props.handleStateChange({
				deleteAllBeforeInsert: result === true ? 'true' : 'false'
			});
		} catch(err) {
			console.error(err.stack);
		}
	},

	renderDeleteAllBeforeInsertCheckBox() {
		var { props } = this;
		if(props.bindingType !== 'simple') return null;
		return (
			<div>
				<CheckBox
					label="insert 쿼리 실행 전에 테이블 비우기"
					checked={props.deleteAllBeforeInsert === 'true'}
					onCheck={this.onClickDeleteAllBeforeInsertCheckBox} />
			</div>
		);
	},

	render() {
		var { state, props } = this;

		try {
			return (
				<Card style={{ marginBottom: '10px' }}>
					<CardHeader
						title="기타 설정"
						subtitle="기타 설정"
						avatar={ <PolymerIcon icon="config" /> } />
					<CardText>
						<div>
							<TextField
								style={{ width: '100px', float: 'left' }}
								value={state.simplePeriod}
								floatingLabelText="period"
								onChange={this.handleChange.bind(this, 'simplePeriod')} />
							<SelectField
								style={{ width: '100px', float: 'left' }}
								floatingLabelText="timeunit"
								value={state.timeUnit}
								onChange={this.handleChange.bind(this, 'timeUnit')}
								menuItems={[
									{ text: '초', payload: 'sec' },
									{ text: '분', payload: 'min' },
									{ text: '시간', payload: 'hour' },
									{ text: '일', payload: 'day' },
									{ text: '일2', payload: 'day2' }
								]} />
							<Clearfix />
						</div>
						{ this.renderDeleteAllBeforeInsertCheckBox() }
					</CardText>
				</Card>
			);
		} catch(err) {
			console.error(err.stack);
		}
	}
});

module.exports = EtcConfigCard;