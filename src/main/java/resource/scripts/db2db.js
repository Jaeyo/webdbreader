//db2db

var period = 60 * 1000;
var src = {
	jdbc: {
		driver: 'oracle.jdbc.driver.OracleDriver',
		connUrl: 'jdbc:oracle:thin:@localhost:1521:spiderx',
		username: 'encrypted',
		password: 'encrypted'
	},
	columns: 'cola, colb',
	table: 'table111',
	conditionColumn = 'col';
};
var dest = {
	jdbc: {
		driver: 'oracle.jdbc.driver.OracleDriver',
		connUrl: 'jdbc:oracle:thin:@localhost:1521:spiderx',
		username: 'encrypted',
		password: 'encrypted'
	},
	columns: 'another_cola, another_colb',
	table: 'table222'
};


//simple
src.jdbc.username = decrypt(src.jdbc.username);
src.jdbc.password = decrypt(src.jdbc.password);
dest.jdbc.username = decrypt(dest.jdbc.username);
dest.jdbc.password = decrypt(dest.jdbc.password);
schedule(period).run(function() {
	var mainQuery = format(
		'SELECT ${columns}  FROM ${table}',
		{ columns: src.columns, table: src.table }
	);

	database(src.jdbc)
		.select(mainQuery)
		.map(function(resultset) {
			return format(
				'INSERT INTO ${table} (${columns})  VALUES (${values})',
				{ table: dest.table, columns: dest.columns,
				values: src.columns.split(',').map(function(col) {
					var value = resultset[col.trim()];
					if(typeof value === 'number') return value;
					return '\'' + value + '\'';
				}).join(',') }
			);
		})
		.group(100)
		.forEach(function(groupset) {
			database(dest.jdbc).update(groupset);
		}).run();
});



//sequence
src.jdbc.username = decrypt(src.jdbc.username);
src.jdbc.password = decrypt(src.jdbc.password);
dest.jdbc.username = decrypt(dest.jdbc.username);
dest.jdbc.password = decrypt(dest.jdbc.password);
schedule(period).run(function() {
	var maxQuery = format(
		'SELECT MAX(${conditionColumn}) FROM ${table}',
		{ conditionColumn: src.conditionColumn, table: src.table }	
	);

	var min = repo('min');
	var max = database(dest.jdbc).select(maxQuery).get();

	var mainQuery = format(
		'SELECT ${columns} \
		FROM ${table} \
		WHERE ${conditionColumn} > ${min} \
		AND ${conditionColumn} < ${max}',
		{ columns: src.columns, table: src.table, 
		conditionColumn: src.conditionColumn, 
		min: min, max: max }
	);

	database(src.jdbc)
		.select(mainQuery)
		.map(function(resultset) {
			return format(
				'INSERT INTO ${table} (${columns})  VALUES (${values})',
				{ table: dest.table, columns: dest.columns,
				values: src.columns.split(',').map(function(col) {
					var value = resultset[col.trim()];
					if(typeof value === 'number') return value;
					return '\'' + value + '\'';
				}).join(',') }
			);
		})
		.group(100)
		.forEach(function(groupset) {
			database(dest.jdbc).update(groupset);
		}).run();
});



//date
src.jdbc.username = decrypt(src.jdbc.username);
src.jdbc.password = decrypt(src.jdbc.password);
dest.jdbc.username = decrypt(dest.jdbc.username);
dest.jdbc.password = decrypt(dest.jdbc.password);
schedule(period).run(function() {
	var min = repository('min');
	var max = now().format('yyyyMMddhhMMss');

	var mainQuery = format(
		'SELECT ${columns} \
		FROM {table} \
		WHERE ${conditionColumn} > ${min} \
		AND ${conditionColumn} < ${max}',
		{ columns: columns, table: table, min: min, max: max }
	);

	database(src.jdbc)
		.query(mainQuery)
		.map(function(resultset) {
			return format(
				'INSERT INTO ${table} (${columns})  VALUES (${values})',
				{ table: dest.table, columns: dest.columns,
				values: src.columns.split(',').map(function(col) {
					var value = resultset[col.trim()];
					if(typeof value === 'number') return value;
					return '\'' + value + '\'';
				}).join(',') }
			);
		})
		.group(100)
		.forEach(function(groupset) {
			database(dest.jdbc).update(groupset);
		}).run();
});