'use strict';

import React from 'react';
import util from 'util';
import {
	FlatButton
} from '../../comps/material-wrapper.jsx';


var MappedColumns = React.createClass({
	PropTypes: {
		handleStateChange: React.PropTypes.func.isRequired,
		srcColumns: React.PropTypes.string.isRequired,
		destColumns: React.PropTypes.string.isRequired
	},

	render() {
		try {
			var { props } = this;

			if(props.srcColumns.trim().length === 0 || props.destColumns.trim().length === 0) return null;

			var srcColumns = props.srcColumns.split(',');
			var destColumns = props.destColumns.split(',');

			var mappedColumns = [];
			for(var i=0; i<srcColumns.length; i++) {
				mappedColumns.push( 
					<MappedColumn 
						srcColumns={props.srcColumns}
						srcColumn={srcColumns[i]} 
						destColumns={props.destColumns}
						destColumn={destColumns[i]}
						handleStateChange={props.handleStateChange}
						key={ util.format('%s-%s', srcColumns[i], destColumns[i]) } />
				);
			}
			return ( <div>{mappedColumns}</div> );
		} catch(err) {
			console.error(err.stack);
		}
	}
});
module.exports = MappedColumns;

//props: srcColumns, srcColumn, destColumns, destColumn, handleStateChange
var MappedColumn = (props) => {
	var onDeleteBtnClick = () => {
		var newSrcColumns = props.srcColumns.split(',').filter((col) => {
			return col !== props.srcColumn;
		});
		var newDestColumns = props.destColumns.split(',').filter((col) => {
			return col !== props.destColumn;
		});
		props.handleStateChange({
			srcColumns: newSrcColumns.join(','),
			destColumns: newDestColumns.join(',')
		});
	};

	return (
		<div 
			style={{
				padding: '10px',
				border: '1px dashed gray'
			}}>
			<span>{ util.format('%s => %s', props.srcColumn, props.destColumn) }</span>
			<FlatButton label="x" onClick={onDeleteBtnClick} />
		</div>
	);
};