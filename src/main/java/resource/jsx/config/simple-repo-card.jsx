var React = require('react');
var PolymerIcon = require('../comps/polymer-icon.jsx');
var MaterialWrapper = require('../comps/material-wrapper.jsx');
var Button = MaterialWrapper.Button;
var Card = MaterialWrapper.Card;
var CardHeader = MaterialWrapper.CardHeader;
var CardText = MaterialWrapper.CardText;
var Table = require('react-bootstrap').Table;
var SimpleRepoDialog = require('./simple-repo-card/simple-repo-dialog.jsx');
var AlertDialog = require('../comps/dialog/alert-dialog.jsx');
var ConfirmDialog = require('../comps/dialog/confirm-dialog.jsx');
var server = require('../utils/server.js');

var SimpleRepoCard = React.createClass({
	getInitialState() {
		return {
			simpleRepoData: null
		};
	},

	componentDidMount() {
		try {
			this.loadSimpleRepo(function(data) {
				this.setState({ simpleRepoData: data });
			}.bind(this));
		} catch(err) {
			console.error(err.stack);
		}
	},

	loadSimpleRepo(callback) {
		server
			.getSimpleRepoAll()
			.then(function(data) {
				callback(data);
			}).catch(function(err) {
				this.refs.alertDialog.show('danger', err);
			}.bind(this));
	},

	//args: scriptName, key, newKey, newValue
	updateSimpleRepo(args) {
		server.updateSimpleRepo({
			scriptName: args.scriptName,
			key: args.key,
			newKey: args.newKey,
			newValue: args.newValue
		}).then(function() {
			this.refs.alertDialog.show('success', '변경되었습니다.');
			this.loadSimpleRepo(function(data) {
				this.setState({ simpleRepoData: data });
			}.bind(this));
		}.bind(this)).catch(function(err) {
			this.refs.alertDialog.show('danger', err);
		}.bind(this));
	},

	//args: scriptName, key, callback
	removeSimpleRepo(args) {
		server.removeSimpleRepo({
			scriptName: args.scriptName,
			key: args.key
		}).then(function() {
			this.refs.alertDialog.show('success', '삭제되었습니다.');
			this.loadSimpleRepo(function(data) {
				this.setState({ simpleRepoData: data });
			}.bind(this));
		}.bind(this)).catch(function(err) {
			this.refs.alertDialog.show('danger', err);
		}.bind(this));
	},

	//args: scriptName, key, value
	addSimpleRepo(args) {
		server.addSimpleRepo({
			scriptName: args.scriptName,
			key: args.key,
			value: args.value
		}).then(function() {
			this.refs.alertDialog.show('success', '저장되었습니다.');
			this.loadSimpleRepo(function(data) {
				this.setState({ simpleRepoData: data });
			}.bind(this));
		}.bind(this)).catch(function(err) {
			this.refs.alertDialog.show('danger', err);
		}.bind(this));
	},

	//args: scriptName, key, value
	onRowClick(args) {
		var self = this;
		self.refs.simpleRepoDialog.show({
			scriptName: args.scriptName,
			key: args.key,
			value: args.value,
			btns: [ 'update', 'delete', 'cancel' ],
			callback: function(cbArgs) {
				switch(cbArgs.action) {
					case 'update':
						cbArgs.hide();
						self.updateSimpleRepo({
							scriptName: cbArgs.scriptName,
							key: args.key,
							newKey: cbArgs.key,
							newValue: cbArgs.value
						});
						break;
					case 'delete':
						cbArgs.hide();
						self.refs.confirmDialog
							.onOk(function() {
								self.removeSimpleRepo({
									scriptName: cbArgs.scriptName,
									key: cbArgs.key
								});
							}).show('삭제하시겠습니까?');
						break;
					case 'cancel':
						cbArgs.hide();
						break;
				}
			}
		});
	},

	onAddBtnClick(evt) {
		evt.stopPropagation();
		var self = this;

		self.refs.simpleRepoDialog.show({
			scriptName: '',
			key: '',
			value: '',
			btns: [ 'add', 'cancel' ],
			callback: function(cbArgs) {
				switch(cbArgs.action) {
					case 'add':
						cbArgs.hide();
						self.addSimpleRepo({
							scriptName: cbArgs.scriptName,
							key: cbArgs.key,
							value: cbArgs.value
						});
						break;
					case 'cancel':
						cbArgs.hide();
						break;
				}
			}
		});
	},

	render() {
		try {
			return (
				<Card>
					<CardHeader
						title="simple repo"
						subtitle="simple repo 내에 저장되어 있는 데이터를 조회합니다."
						avatar={ <PolymerIcon icon="config" /> } />
					<CardText>
						{
							this.state.simpleRepoData == null ? null : (
								<Table striped bordered condensed hover>
									<SimpleRepoTableHead />
									<SimpleRepoTableBody 
										onRowClick={this.onRowClick}
										data={this.state.simpleRepoData} />
								</Table>
							)
						}
						<div style={{ textAlign: 'right' }}>
							<Button label="add" onClick={this.onAddBtnClick} />
						</div>
						<ConfirmDialog ref="confirmDialog" />
						<AlertDialog ref="alertDialog" />
						<SimpleRepoDialog ref="simpleRepoDialog" />
					</CardText>
				</Card>
			);
		} catch(err) {
			console.error(err.stack);
		}
	}
});
module.exports = SimpleRepoCard;


var SimpleRepoTableHead = (props) => {
	return (
		<thead>
			<TableRow isHeader={true} data={[ 'script name', 'key', 'value' ]} />
		</thead>
	);
};

//props: data, onRowClick
var SimpleRepoTableBody = (props) => {
	var rows = props.data.map(function(data) {
		return (
			<TableRow 
				key={JSON.stringify(data)} 
				data={[ data.SCRIPT_NAME, data.SIMPLE_REPO_KEY, data.SIMPLE_REPO_VALUE]}
				onRowClick={function(evt) {
					evt.stopPropagation();
					props.onRowClick({
						scriptName: data.SCRIPT_NAME,
						key: data.SIMPLE_REPO_KEY,
						value: data.SIMPLE_REPO_VALUE
					})
				}} />
		);
	});
	return (<tbody>{rows}</tbody>);
};


//props: isHeader, data, onRowClick
var TableRow = (props) => {
	if(props.isHeader === true) {
		return (
			<tr>
				{
					props.data.map(function(data, index) {
						return (<th key={data + index} style={{ fontWeight: 'bolder'}}>{data}</th>);
					})
				}
			</tr>
		);
	} else {
		return (
			<tr onClick={props.onRowClick}>
				{
					props.data.map(function(data, index) {
						return ( <td style={{ cursor: 'pointer' }} key={data + index}>{data}</td> );
					})
				}
			</tr>
		);
	}
};