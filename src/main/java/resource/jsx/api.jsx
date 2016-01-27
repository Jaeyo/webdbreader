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




// var CssAvenirWhite = (props) => {
// 	return (
// 		<InlineCss stylesheet={`
// 			& body {
// 				font-family: "Avenir Next", Helvetica, Arial, sans-serif;
// 				padding:1em;
// 				margin:auto;
// 				max-width:42em;
// 				background:#fefefe;
// 			}
// 			& h1, h2, h3, h4, h5, h6 {
// 				font-weight: bold;
// 			}
// 			& h1 {
// 				color: #000000;
// 				font-size: 28pt;
// 			}
// 			& h2 {
// 				border-bottom: 1px solid #CCCCCC;
// 				color: #000000;
// 				font-size: 24px;
// 			}
// 			& h3 {
// 				font-size: 18px;
// 			}
// 			& h4 {
// 				font-size: 16px;
// 			}
// 			& h5 {
// 				font-size: 14px;
// 			}
// 			& h6 {
// 				color: #777777;
// 				background-color: inherit;
// 				font-size: 14px;
// 			}
// 			& hr {
// 				height: 0.2em;
// 				border: 0;
// 				color: #CCCCCC;
// 				background-color: #CCCCCC;
// 			}
// 			& p, blockquote, ul, ol, dl, li, table, pre {
// 				margin: 15px 0;
// 			}
// 			& a, a:visited {
// 				color: #4183C4;
// 				background-color: inherit;
// 				text-decoration: none;
// 			}
// 			& #message {
// 				border-radius: 6px;
// 				border: 1px solid #ccc;
// 				display:block;
// 				width:100%;
// 				height:60px;
// 				margin:6px 0px;
// 			}
// 			& button, #ws {
// 				font-size: 10pt;
// 				padding: 4px 6px;
// 				border-radius: 5px;
// 				border: 1px solid #bbb;
// 				background-color: #eee;
// 			}
// 			& code, pre, #ws, #message {
// 				font-family: Monaco;
// 				font-size: 10pt;
// 				border-radius: 3px;
// 				background-color: #F8F8F8;
// 				color: inherit;
// 			}
// 			& code {
// 				border: 1px solid #EAEAEA;
// 				margin: 0 2px;
// 				padding: 0 5px;
// 			}
// 			& pre {
// 				border: 1px solid #CCCCCC;
// 				overflow: auto;
// 				padding: 4px 8px;
// 			}
// 			& pre > code {
// 				border: 0;
// 				margin: 0;
// 				padding: 0;
// 			}
// 			& #ws { background-color: #f8f8f8; }
// 			& .send { color:#77bb77; }
// 			& .server { color:#7799bb; }
// 			& .error { color:#AA0000; }
// 			`}>
// 			{props.children}
// 		</InlineCss>
// 	);
// };