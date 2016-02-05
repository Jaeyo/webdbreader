'use strict';

import React from 'react';
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
			var srcColumns = props.srcColumns.split(',');
			var destColumns = props.destColumns.split(',');

			var mappedColumns = [];
			for(var i=0; i<srcColumns.length; i++)
				var onDeleteClick = () => {
					var newSrcColumns = props.srcColumns.split(',').filter((col) => {
						return col !== srcColumns[i];
					});
					var newDestColumns = props.destColumns.split(',').filter((col) => {
						return col !== destColumns[i];
					});
					props.handleStateChange({
						srcColumns: newSrcColumns.join(','),
						destColumns: newDestColumns.join(',')
					});
				};

				mappedColumns.push( 
					<MappedColumn 
						srcColumn={srcColumns[i]} 
						destColumn={destColumns[i]}
						onDeleteClick={onDeleteClick}
						key={util.format('%s-%s', srcColumns[i], destColumns[i])} /> 
				);

			return mappedColumns;
		} catch(err) {
			console.error(err.stack);
		}
	}
});
module.exports = MappedColumns;

//props: srcColumn, destColumn, onDeleteClick
var Mapped = (props) => {
	return (
		<div style={{
			padding: '10px',
			border: '1px dashed gray'
		}}>
			<span>{ util.format('%s => %s', props.srcColumn, props.destColumn) }</span>
			<FlatButton label="x" onClick={props.onDeleteClick} />
		</div>
	);
};