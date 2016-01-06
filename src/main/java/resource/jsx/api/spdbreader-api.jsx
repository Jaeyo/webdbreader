var React = require('react');
var Glyphicon = require('react-bootstrap').Glyphicon;
var MaterialWrapper = require('../comps/material-wrapper.jsx');
var Card = MaterialWrapper.Card;
var CardHeader = MaterialWrapper.CardHeader;
var CardText = MaterialWrapper.CardText;
var Tabs = MaterialWrapper.Taps;
var Tab = MaterialWrapper.Tap;
var Paper = MaterialWrapper.Paper;

var SpDbReaderAPI = React.createClass({
	render() {
		try {
			return (
				<Paper style={{ padding: '10px' }}>
					<API_DateUtil_format />
				</Paper>
			);
		} catch(err) {
			console.error(err.stack);
		}
	}
});
module.exports = SpDbReaderAPI;

var API_DateUtil_format = (props) => {
	return (
		<MethodAPI
			title="dateUtil.format"
			subtitle="String format(long date, String format)">
			<Desc items={[
				'long 형으로 주어진 시간(date)을 포맷(format)에 맞춰서 출력한다. long 형의 시간 값은 DateUtil.parse(), DateUtil.currentTimeMillis() 를 통해서 구할 수 있다.',
				'Returns 포맷팅된 날짜',
				'Example'
			]} />
			<pre>
				var formattedDate = dateUtil.format(1414460642364, "yyyyMMddHHmmss"); // => 20141028104502 
				var formattedDate = dateUtil.format(1414460642364, "yyyyMMdd"); // => 20141028
				var formattedDate = dateUtil.format(1414460642364, "yyyy-MM-dd"); // => 2014-10-28
			</pre>
		</MethodAPI>
	);
};

var MethodAPI = (props) => {
	return (
		<Card>
			<CardHeader
				title={props.title}
				subtitle={props.subtitle}
				avatar={ <Glyphicon glyph="console" /> } />
			<CardText>
				{props.children}
			</CardText>
		</Card>
	);
};

var Desc = (props) => {
	return (
		<div>
			<ul>
			{
				props.items.map(function(item) {
					<li style={{ display: 'list-item' }}>item</li>
				})
			}
			</ul>
		</div>
	);
};