var React = require('react');
var Glyphicon = require('react-bootstrap').Glyphicon;
var MaterialWrapper = require('./comps/material-wrapper.jsx');
var Card = MaterialWrapper.Card;
var CardHeader = MaterialWrapper.CardHeader;
var CardText = MaterialWrapper.CardText;
var Tabs = MaterialWrapper.Tabs;
var Tab = MaterialWrapper.Tab;
var Markdown = require('react-remarkable');
var spdbreaderAPIDoc = require('../doc/spdbreader-apidoc.md');
var scripterAPIDoc = require('../doc/scripter-apidoc.md');
require('./api/markdown_avenir-white.css');

var ApiView = React.createClass({
	render() {
		try {
			return (
				<Card>
					<CardHeader
						title="API"
						subtitle="스크립트에 사용되는 API"
						avatar={ <Glyphicon glyph="book" /> } />
					<CardText>
						<Tabs>
							<Tab label="scripter">
								<div id="markdown">
									<Markdown>{scripterAPIDoc}</Markdown>
								</div>
							</Tab>
							<Tab label="SpDbReader">
								<div id="markdown">
									<Markdown>{spdbreaderAPIDoc}</Markdown>
								</div>
							</Tab>
						</Tabs>
					</CardText>
				</Card>
			);
		} catch(err) {
			console.error(err.stack);
		}
	}
});
module.exports = ApiView;