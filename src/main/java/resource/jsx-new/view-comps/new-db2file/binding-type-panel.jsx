var React = require('react'), 
	jsUtil = require('../../utils/util.js'),
	color = jsUtil.color,
	server = require('../../utils/server.js'),
	PolymerIcon = require('../../comps/polymer-icon.jsx'),
	MaterialWrapper = require('../../comps/material-wrapper.jsx'),
	Button = MaterialWrapper.Button,
	TextField = MaterialWrapper.TextField,
	SelectField = MaterialWrapper.SelectField,
	Card = MaterialWrapper.Card,
	CardHeader = MaterialWrapper.CardHeader,
	CardText = MaterialWrapper.CardText,
	CircularProgress = MaterialWrapper.CircularProgress,
	List = MaterialWrapper.List,
	ListItem = MaterialWrapper.ListItem,
	ListDivider = MaterialWrapper.ListDivider,
	Dialog = MaterialWrapper.Dialog,
	RadioButton = MaterialWrapper.RadioButton,
	RadioButtonGroup = MaterialWrapper.RadioButtonGroup;


var BindingTypePanel = React.createClass({
	PropTypes: {
		bindingType: React.PropTypes.string.isRequired,
		bindingColumn: React.PropTypes.string.isRequired,
		jdbcDriver: React.PropTypes.string.isRequired,
		jdbcConnUrl: React.PropTypes.string.isRequired,
		jdbcUsername: React.PropTypes.string.isRequired,
		jdbcPassword: React.PropTypes.string.isRequired,
		table: React.PropTypes.string.isRequired,
		onChange: React.PropTypes.func.isRequired
	},

	getDefaultProps() {
		return { bindingType: 'simple' };
	},

	getInitialState() {
		return {
			isBindingColumnConfigDialogVisible: false
		};
	},

	onBindingTypeChanged(evt) {
		this.props.onChange({ 
			bindingType: evt.target.value,
			bindingColumn: ''
		});
	},

	onBindingColumnChange(bindingColumn) {
		this.props.onChange({ bindingColumn: bindingColumn });
	},

	toggleBindingColumnConfigDialog() {
		this.setState({ isBindingColumnConfigDialogVisible: !this.state.isBindingColumnConfigDialogVisible });
	},

	styles() {
		return {
			card: {
				marginBottom: '10px'
			},
			textfieldInputStyle: {
				color: 'black'
			}
		};
	},

	render() {
		var style = this.styles();
		var jdbc = {
			driver: this.props.jdbcDriver,
			connUrl: this.props.jdbcConnUrl,
			username: this.props.jdbcUsername,
			password: this.props.jdbcPassword
		};

		return (
			<Card style={style.card}>
				<CardHeader
					title="바인딩 타입 설정"
					subtitle="바인딩 타입을 설정합니다."
					avatar={ <PolymerIcon icon="config" /> } />
				<CardText>
					<RadioButtonGroup 
						name="bindingType" 
						defaultSelected="simple"
						onChange={this.onBindingTypeChanged}>
						<RadioButton
							value="simple"
							label="simple binding" />
						<RadioButton
							value="date"
							label="date binding" />
						<RadioButton
							value="sequence"
							label="sequence binding" />
					</RadioButtonGroup>
					{
						this.props.bindingType === 'simple' ? null : (
							<div>
								<TextField
									value={this.props.bindingColumn}	
									floatingLabelText="binding columns"
									inputStyle={style.textfieldInputStyle}
									fullWidth={true}
									onFocus={this.toggleBindingColumnConfigDialog} />
								<BindingColumnConfigDialog
									visible={this.state.isBindingColumnConfigDialogVisible}
									onClose={this.toggleBindingColumnConfigDialog}
									table={this.props.table}
									bindingColumn={this.props.bindingColumn}
									onBindingColumnChange={this.onBindingColumnChange}
									jdbc={jdbc} />
							</div>
						)
					}
				</CardText>
			</Card>
		);
	}
});


var BindingColumnConfigDialog = React.createClass({
	PropTypes: {
		visible: React.PropTypes.bool.isRequired,
		onClose: React.PropTypes.func.isRequired,
		table: React.PropTypes.string.isRequired,
		bindingColumn: React.PropTypes.string.isRequired,
		onBindingColumnChange: React.PropTypes.func.isRequired,
		jdbc: React.PropTypes.object.isRequired
	},

	getDefaultProps() {
		return { visible: false };
	},

	getInitialState() {
		return {
			isColumnsLoaded: false,
			loadedColumns: null
		};
	},

	componentDidUpdate(prevProps, prevState) {
		if(prevProps.visible === false && this.props.visible === true)
			this.loadColumns();
	},

	onBindingColumnTextFieldChange(evt) {
		this.props.onBindingColumnChange(evt.target.value);
	},

	loadColumns() {
		server.loadColumns(this.props.jdbc, this.props.table)
		.then(function(columns) {
			this.setState({
				isColumnsLoaded: true,
				loadedColumns: columns
			});
		}.bind(this)).catch(function(err) {
			console.error(err.stack);
			this.setState({ isColumnsLoaded: false });
			if(typeof err !== 'string') err = JSON.stringify(err);
			//TODO layer popup alert error
			alert(err);
		}.bind(this));
	},

	renderColumnList() {
		if(this.state.isColumnsLoaded === false) 
			return (<CircularProgress mode="indeterminate" size={0.5} />);

		return (
			<List>
			{
				this.state.loadedColumns.map(function(column) {
					var columnName = column.columnName.toLowerCase();
					var columnType = column.columnType;

					var onClick = function() {
						this.props.onBindingColumnChange(columnName);
					}.bind(this);

					return (
						<ListItem
							key={columnName}
							primaryText={columnName}
							secondaryText={columnType}
							onClick={onClick} />
					);
				}.bind(this))
			}
			</List>
		);
	},

	render() {
		return (
			<Dialog
				actions={[
					{ text: 'close', onClick: this.props.onClose }
				]}
				actionFocus="close"
				autoDetectWindowHeight={true}
				autoScrollBodyContent={true}
				open={this.props.visible}>
				<Card>
					<CardHeader
						title="binding column 설정"
						subtitle="binding column 정보를 설정합니다."
						avatar={ <PolymerIcon icon="config" /> } />
					<CardText>
						<TextField
							floatingLabelText="columns"
							value={this.props.bindingColumn} 
							onChange={this.onBindingColumnTextFieldChange}
							fullWidth={true} />
						<div style={{ width: '100%', height: '300px', overflow: 'auto' }}>
							{ this.renderColumnList() }
						</div>
					</CardText>
				</Card>
			</Dialog>
		);
	}
});



module.exports = BindingTypePanel;