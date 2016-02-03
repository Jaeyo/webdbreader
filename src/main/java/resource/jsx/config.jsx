'use strict';

import React from 'react';
import PolymerIcon from './comps/polymer-icon.jsx';
import SimpleRepoCard from './config/simple-repo-card.jsx';
import Log4jConfigCard from './config/log4j-config-card.jsx';
import EmbedDbQueryCard from './config/embed-db-query-card.jsx';
import {
	Button,
	Card,
	CardHeader,
	CardText
} from './comps/material-wrapper.jsx';

var ConfigView = React.createClass({
	render() {
		try {
			return (
				<div>
					<div style={{ marginBottom: '10px' }}>
						<SimpleRepoCard />
					</div>
					<div style={{ marginBottom: '10px' }}>
						<Log4jConfigCard />
					</div>
					<div style={{ marginBottom: '10px' }}>
						<EmbedDbQueryCard />
					</div>
				</div>
			);
		} catch(err) {
			console.error(err.stack);
		}
	}
});

module.exports = ConfigView;