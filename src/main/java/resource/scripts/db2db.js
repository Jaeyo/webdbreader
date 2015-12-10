//db2db

//simple
var type = 'db2file';
var period = 4 * 1000; 

var srcJdbcDriver = 'oracle.jdbc.driver.OracleDriver'; 
var srcJdbcConnUrl= 'jdbc:oracle:thin:@192.168.10.101:1521:spiderx'; 
var srcJdbcUsername = 'admin'; 
var srcJdbcPassword = 'admin'; 

var srcColumns = 'cola, colb';
var srcTable = 'testtable';
var srcBindingType = 'simple'

var destJdbcDriver = 'oracle.jdbc.driver.OracleDriver'; 
var destJdbcConnUrl= 'jdbc:oracle:thin:@192.168.10.101:1521:spiderx'; 
var destJdbcUsername = 'admin'; 
var destJdbcPassword = 'admin'; 

var destColumns = 'cola, colb';
var destTable = 'testtable';

var srcJdbc = { driver: srcJdbcDriver, connUrl: srcJdbcConnUrl, username: srcJdbcUsername, password: srcJdbcPassword };
var destJdbc = { driver: destJdbcDriver, connUrl: destJdbcConnUrl, username: destJdbcUsername, password: destJdbcPassword };

schedule(period).run(function() {
	var mainQuery = format(
		'SELECT {columns} FROM {table}',
		{ columns: srcColumns, table: srcTable }
	);

	database(srcJdbc)
		.select(mainQuery)
		.map(function(row) {
			var values = row.map(function(col) {
				if(typeof col === 'string') return '\'' + col + '\'';
				else return col;
			}).join(',');

			var insertQuery = format(
				'insert into {table} ({columns}) values({values})',
				{ table: destTable, columns: destTable, values: values }
			);

			return insertQuery;
		})
		.group(500)
		.map(function(queries) {
			database(destJdbc).update(queries).run();
		})
		.run();
});




//sequence
var type = 'db2file';
var period = 4 * 1000; 

var srcJdbcDriver = 'oracle.jdbc.driver.OracleDriver'; 
var srcJdbcConnUrl= 'jdbc:oracle:thin:@192.168.10.101:1521:spiderx'; 
var srcJdbcUsername = 'admin'; 
var srcJdbcPassword = 'admin'; 

var srcColumns = 'cola, colb';
var srcTable = 'testtable';
var srcBindingType = 'sequence'
var srcConditionColumn = 'simple'

var destJdbcDriver = 'oracle.jdbc.driver.OracleDriver'; 
var destJdbcConnUrl= 'jdbc:oracle:thin:@192.168.10.101:1521:spiderx'; 
var destJdbcUsername = 'admin'; 
var destJdbcPassword = 'admin'; 

var destColumns = 'cola, colb';
var destTable = 'testtable';

var srcJdbc = { driver: srcJdbcDriver, connUrl: srcJdbcConnUrl, username: srcJdbcUsername, password: srcJdbcPassword };
var destJdbc = { driver: destJdbcDriver, connUrl: destJdbcConnUrl, username: destJdbcUsername, password: destJdbcPassword };

schedule(period).run(function() {
	var maxQuery = format(
		'SELECT MAX({column}) FROM {table}',
		{ column: srcConditionColumn, table: srcTable }
	);

	var min = repo('min');
	if(min == null) min = 0;
	var max = null;
	database(srcJdbc)
		.select(maxQuery)
		.first(function(row) {
			max = row[0];
		})
		.run();

	var mainQuery = format(
		'SELECT {columns} \
		FROM {table} \
		WHERE {conditionColumn} > {min} \
		AND {conditionColumn} <= {max}',
		{ columns: srcColumns, table: srcTable, conditionColumn: srcConditionColumn, min: min, max: max }
	);

	database(srcJdbc)
		.select(mainQuery)
		.map(function(row) {
			var values = row.map(function(col) {
				if(typeof col === 'string') return '\'' + col + '\'';
				else return col;
			}).join(',');

			var insertQuery = format(
				'insert into {table} ({columns}) values({values})',
				{ table: destTable, columns: destTable, values: values }
			);

			return insertQuery;
		})
		.group(500)
		.map(function(queries) {
			database(destJdbc).update(queries).run();
		})
		.run();
});



//date
var type = 'db2file';
var period = 4 * 1000; 

var srcJdbcDriver = 'oracle.jdbc.driver.OracleDriver'; 
var srcJdbcConnUrl= 'jdbc:oracle:thin:@192.168.10.101:1521:spiderx'; 
var srcJdbcUsername = 'admin'; 
var srcJdbcPassword = 'admin'; 

var srcColumns = 'cola, colb';
var srcTable = 'testtable';
var srcBindingType = 'date'
var srcConditionColumn = 'simple'

var destJdbcDriver = 'oracle.jdbc.driver.OracleDriver'; 
var destJdbcConnUrl= 'jdbc:oracle:thin:@192.168.10.101:1521:spiderx'; 
var destJdbcUsername = 'admin'; 
var destJdbcPassword = 'admin'; 

var destColumns = 'cola, colb';
var destTable = 'testtable';

var srcJdbc = { driver: srcJdbcDriver, connUrl: srcJdbcConnUrl, username: srcJdbcUsername, password: srcJdbcPassword };
var destJdbc = { driver: destJdbcDriver, connUrl: destJdbcConnUrl, username: destJdbcUsername, password: destJdbcPassword };

schedule(period).run(function() {
	var min = repo('min');
	if(min == null) min = 0;
	var max = now();

	var mainQuery = format(
		'SELECT {columns} \
		FROM {table} \
		WHERE {conditionColumn} > {min} \
		AND {conditionColumn} <= {max}',
		{ columns: srcColumns, table: srcTable, conditionColumn: srcConditionColumn, min: min, max: max }
	);

	database(srcJdbc)
		.select(mainQuery)
		.map(function(row) {
			var values = row.map(function(col) {
				if(typeof col === 'string') return '\'' + col + '\'';
				else return col;
			}).join(',');

			var insertQuery = format(
				'insert into {table} ({columns}) values({values})',
				{ table: destTable, columns: destTable, values: values }
			);

			return insertQuery;
		})
		.group(500)
		.map(function(queries) {
			database(destJdbc).update(queries).run();
		})
		.run();
});











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