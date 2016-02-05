'use strict';

import React from 'react';
import Promise from 'promise';
import server from '../../utils/server.js';
import {
	Dialog,
	RadioButton,
	RadioButtonGroup,
	Button
} from '../../comps/material-wrapper.jsx';
import util from 'util';
import LoadedColumns from './column-mapping-dialog/loaded-columns.jsx';


var ColumnMappingDialog = React.createClass({
	PropTypes: {
		handleStateChange: React.PropTypes.func.isRequired,

		srcTable: React.PropTypes.string.isRequired,
		srcJdbcDriver: React.PropTypes.string.isRequired,
		srcJdbcConnUrl: React.PropTypes.string.isRequired,
		srcJdbcUsername: React.PropTypes.string.isRequired,
		srcJdbcPassword: React.PropTypes.string.isRequired,
		srcColumns: React.PropTypes.string.isRequired,

		destTable: React.PropTypes.string.isRequired,
		destJdbcDriver: React.PropTypes.string.isRequired,
		destJdbcConnUrl: React.PropTypes.string.isRequired,
		destJdbcUsername: React.PropTypes.string.isRequired,
		destJdbcPassword: React.PropTypes.string.isRequired,
		destColumns: React.PropTypes.string.isRequired
	},

	getInitialState() {
		return {
			loadedSrcColumns: [],
			loadedDestColumns: [],
			visible: false
		};
	},

	show() {
		var { props, state, refs } = this;

		this.setState({ 
			loadedColumns: [],
			visible: true
		}, () => {
			refs.loadedColumns.loadColumns();
		});
	},

	hide() {
		this.setState({ visible: false });
	},

	onAddMappingBtnClick(evt) {
		try {
			var { props, state, refs } = this;
			evt.stopPropagation();

			var {
				srcColumn,
				destColumn
			} = refs.getSelectedColumns();

			if(props.destColumns.split(',').indexOf(destColumn) !== -1) return;

			props.handleStateChange({
				srcColumns: props.srcColumns.split(',').concat([ srcColumns ]),
				destColumns: props.destColumns.split(',').concat([ destColumns ])
			});
		} catch(err) {
			console.error(err.stack);
		}
	},

	onClose(evt) {
		evt.stopPropagation();
		this.hide();
	},

	render() {
		try {
			var { props, state } = table;
			return (
				<Dialog
					title="column mapping"
					action={[
						{ text: 'close', onClick: this.onClose }
					]}
					actionFocus="close"
					autoDetectWindowHeight={true}
					autoScrollBodyContent={true}
					open={state.visible}>
					<LoadedColumns 
						refs="loadedColumns"
						srcTable={props.srcTable}
						srcJdbcDriver={props.srcJdbcDriver}
						srcJdbcConnUrl={props.srcJdbcConnUrl}
						srcJdbcUsername={props.srcJdbcUsername}
						srcJdbcPassword={props.srcJdbcPassword}
						destTable={props.destTable}
						destJdbcDriver={props.destJdbcDriver}
						destJdbcConnUrl={props.destJdbcConnUrl}
						destJdbcUsername={props.destJdbcUsername}
						destJdbcPassword={props.destJdbcPassword} />
					<div style={{ textAlign: 'right' }}>
						<Button 
							label="add mapping"
							onClick={this.onAddMappingBtnClick} />
					</div>
				</Dialog>
			);
		} catch(err) {
			console.error(err.stack);
		}
	}
});
module.exports = ColumnMappingDialog;