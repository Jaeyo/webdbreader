'use strict';

import React from 'react';
import _ from 'underscore';
import {
	FlatButton,
	Button,
	TextField,
	SelectField,
	Card,
	CardHeader,
	CardText,
	CircularProgress,
	List,
	ListItem,
	ListDivider,
	Dialog,
	Toggle
} from '../comps/material-wrapper.jsx';
import PolymerIcon from '../comps/polymer-icon.jsx';
import { Row, Col } from 'react-bootstrap';
import util from 'util';
import MappedColumns from './table-columns-mapping-card/mapped-columns.jsx';
import ColumnMappingDialog from './table-columns-mapping-card/column-mapping-dialog.jsx';
import TableConfigDialog from '../new-db2file/table-column-config-card/table-config-dialog.jsx';


var TableColumnsMappingCard = React.createClass({
	PropTypes: {
		handleStateChange: React.PropTypes.func.isRequired,

		srcJdbcDriver: React.PropTypes.string.required,
		srcJdbcConnUrl: React.PropTypes.string.required,
		srcJdbcUsername: React.PropTypes.string.required,
		srcJdbcPassword: React.PropTypes.string.required,
		srcTable: React.PropTypes.string.required,
		srcColumns: React.PropTypes.string.required,

		destJdbcDriver: React.PropTypes.string.required,
		destJdbcConnUrl: React.PropTypes.string.required,
		destJdbcUsername: React.PropTypes.string.required,
		destJdbcPassword: React.PropTypes.string.required,
		destTable: React.PropTypes.string.required,
		destColumns: React.PropTypes.string.required
	},

	handleChange(name, evt) {
		try {
			evt.stopPropagation();
			var { props, state } = this;
			var state = {};
			state[name] = evt.target.value;
			props.handleStateChange(state);
		} catch(err) {
			console.error(err.stack);
		}
	},

	handleFocus(name, evt) {
		try {
			var { refs } = this;
			evt.stopPropagation();
			if(refs.autoloadToggle.isToggle() === false) return;

			switch(name) {
				case 'srcTable':
					refs.srcTableConfigDialog.show();
					break;
				case 'destTable':
					refs.srcTableConfigDialog.show();
					break;
			}
		} catch(err) {
			console.error(err.stack);
		}
	},

	onColumnMappingBtnClick(evt) {
		try {
			var { refs } = this;
			evt.stopPropagation();
			refs.columnMappingDialog.show();
		} catch(err) {
			console.error(err.stack);
		}
	},

	render() {
		try {
			var { props, state } = this;

			return (
				<Card style={{ marginBottom: '10px' }}>
					<CardHeader
						title="mapping table/columns"
						subtitle="매핑시킬 테이블과 컬럼들을 설정합니다."
						avatar={ <PolymerIcon icon="config" /> } />
					<CardText>
						<Toggle
							name="autoload"
							value="autoload"
							label="autoload"
							ref="autoloadToggle"
							style={{ width: '150px' }}
							defaultToggled={true} />
						<Row>
							<Col xs={6}>
								<TextField
									floatingLabelText="srcTable"
									value={props.srcTable}
									fullWidth={true}
									onChange={this.handleChange.bind(this, 'srcTable')}
									onFocus={this.handleFocus.bind(this, 'srcTable')} />
								<TableConfigDialog
									ref="srcTableConfigDialog"
									handleStateChange={(state) => {
										state.srcTable = state.table;
										delete state.table;
										props.handleStateChange(state);
									}}
									table={props.srcTable}
									jdbcDriver={props.srcJdbcDriver}
									jdbcConnUrl={props.srcJdbcConnUrl}
									jdbcUsername={props.srcJdbcUsername}
									jdbcPassword={props.srcJdbcPassword} />
							</Col>
							<Col xs={6}>
								<TextField
									floatingLabelText="destTable"
									value={props.destTable}
									fullWidth={true}
									onChange={this.handleChange.bind(this, 'destTable')}
									onFocus={this.handleFocus.bind(this, 'destTable')} />
								<TableConfigDialog
									ref="destTableConfigDialog"
									handleStateChange={(state) => {
										state.desetTable = state.table;
										delete state.table;
										props.handleStateChange(state);
									}}
									table={props.destTable}
									jdbcDriver={props.destJdbcDriver}
									jdbcConnUrl={props.destJdbcConnUrl}
									jdbcUsername={props.destJdbcUsername}
									jdbcPassword={props.destJdbcPassword} />
							</Col>
						</Row>
						<MappedColumns
							handleStateChange={props.handleStateChange}
							srcColumns={props.srcColumns}
							destColumns={props.destColumns} />
						<Button
							label="컬럼 매핑"
							onClick={this.onColumnMappingBtnClick} />
						<ColumnMappingDialog
							ref="columnMappingDialog"
							handleStateChange={props.handleStateChange}
							srcTable={props.srcTable}
							srcJdbcDriver={props.srcJdbcDriver}
							srcJdbcConnUrl={props.srcJdbcConnUrl}
							srcJdbcUsername={props.srcJdbcUsername}
							srcJdbcPassword={props.srcJdbcPassword}
							srcColumns={props.srcColumns}
							destTable={props.destTable}
							destJdbcDriver={props.destJdbcDriver}
							destJdbcConnUrl={props.destJdbcConnUrl}
							destJdbcUsername={props.destJdbcUsername}
							destJdbcPassword={props.destJdbcPassword}
							destColumns={props.destColumns} />
					</CardText>
				</Card>
			);
		} catch(err) {
			console.error(err.stack);
		}
	}
});
module.exports = TableColumnsMappingCard;