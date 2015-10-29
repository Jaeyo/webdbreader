var React = require('react'),
	Panel = require('../../comps/panel.jsx').Panel,
	KeyValueLine = require('../../comps/etc.jsx').getKeyValueLine('100px'),
	TextBox = require('../../comps/textbox.jsx').TextBox,
	SelectBox = require('../../comps/select-box.jsx').SelectBox;

var EtcPanel = React.createClass({
	getInitialState() {
		return {
			period: '',
			periodUnit: '분',
			delimiter: ''
		};
	},

	onPeriodChanged(evt) {
		this.setState({ period: evt.target.value });
	},

	onPeriodUnitChanged(evt) {
		this.setState({ periodUnit: evt.target.value });
	},

	onDelimiterChanged(evt) {
		this.setState({ delimiter: evt.target.value });
	},

	render() {
		return (
			<Panel>
				<Panel.SmallHeading glyphicon="cog">기타 설정</Panel.SmallHeading>
				<Panel.Body>
					<KeyValueLine label="주기">
						<TextBox 
							value={this.state.period}
							onChange={this.onPeriodChanged} />
						<SelectBox 
							values={[ '시간', '분', '초' ]}
							value={this.state.periodUnit}
							onChange={this.onPeriodUnitChanged} />
					</KeyValueLine>
					<KeyValueLine label="구분자">
						<TextBox 
							value={this.state.delimiter}
							onChange={this.onDelimiterChanged} />
					</KeyValueLine>
				</Panel.Body>
			</Panel>
		);
	}
});

module.exports = EtcPanel;