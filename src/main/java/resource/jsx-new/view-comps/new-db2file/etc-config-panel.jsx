var React = require('react'),
	PolymerIcon = require('../../comps/polymer-icon.jsx'),
	MaterialWrapper = require('../../comps/material-wrapper.jsx'),
	Button = MaterialWrapper.Button,
	TextField = MaterialWrapper.TextField,
	SelectField = MaterialWrapper.SelectField,
	Card = MaterialWrapper.Card,
	CardHeader = MaterialWrapper.CardHeader,
	CardText = MaterialWrapper.CardText;

var EtcConfigPanel = React.createClass({
	PropTypes: {
		period: React.PropTypes.string.isRequired,
		charset: React.PropTypes.string.isRequired,
		delimiter: React.PropTypes.string.isRequired,
		outputFile: React.PropTypes.string.isRequired
	},

	styles() {
		return {
			card: {
				marginBottom: '10px'
			},
			textField
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
						value={this.props.period}
						floatingLabelText="period"
					//TODO IMME
				</CardText>
			</Card>
		);
	}
});

module.exports = EtcConfigPanel;