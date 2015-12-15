var type = 'db2file-simple';
var period = 6 * 1000;
var jdbcDriver = 'oracle.jdbc.driver.OracleDriver';
var jdbcConnUrl = 'jdbc:oracle:thin:@192.168.10.101:1521:spiderx';
var jdbcUsername = 'admin_test';
var jdbcPassword = 'admin_test';
var columns = '*';
var table = 'test_table';
var delimiter = '|';
var charset = 'utf8';
var outputFile = 'd:\\tmp\\tmp\\$yyyy$mm$dd$hh$mm.log';



var jdbc = {
	driver: jdbcDriver,
	connUrl: jdbcConnUrl,
	username: jdbcUsername,
	password: jdbcPassword
};

schedule(period).run(function() {
	var mainQuery = format(
		'SELECT {columns}  FROM {table}', 
		{ columns: columns, table: table }
	);

	database(jdbc)
		.select(mainQuery)
		.map(function(row) {
			return row.join(delimiter).split('\n').join('') + '\n';
		})
		.group(100)
		.writeTextFile({
			filename: outputFile,
			charset: charset,
			dateFormat: true
		}).run();
});


//sequence
schedule(period).run(function() {
	var maxQuery = format(
		'SELECT MAX({bindingColumn}) FROM {table}', 
		{ bindingColumn: bindingColumn, table: table }
	);

	var min = repo('min');
	if(min == null) min = 0;
	var max = null;
	database(jdbc).select(maxQuery).first(function(row) {
		max = row[0];
	}).run();

	if(min === max) return;

	var mainQuery = format(
		'SELECT {columns} FROM {table} WHERE {bindingColumn} > {min} AND {bindingColumn} <= {max}', 
		{ columns: columns, table: table, bindingColumn: bindingColumn, min: min, max: max }
	);
	
	database(jdbc)
		.select(mainQuery)
		.map(function(resultset) {
			return resultset.join(delimiter).split('\n').join('') + '\n';
		})
		.group(100)
		.writeTextFile({
			filename: outputFile,
			charset: charset,
			dateFormat: true
		}).run();

	repo('min', max);
});


//date
schedule(period).run(function() {
	var maxQuery = format(
		'SELECT MAX({bindingColumn}) FROM {table}', 
		{ bindingColumn: bindingColumn, table: table }
	);

	var min = repo('min');
	var max = null;
	database(jdbc).select(maxQuery).first(function(row) {
		max = date(row[0]).format('yyyy-MM-dd HH:mm:ss');
	}).run();

	if(min === max) return;
	if(min == null) {
		repo('min', max);
		return;
	}

	var mainQuery = format(
		'SELECT {columns} FROM {table} ' + 
		' WHERE {bindingColumn} > to_date(\'{min}\', \'YYYY-MM-DD HH24:MI:SS\') '+ 
		' AND {bindingColumn} < to_date(\'{max}\', \'YYYY-MM-DD HH24:MI:SS\') ',
		{ columns: columns, table: table, bindingColumn: bindingColumn, min: min, max: max }
	);

	database(jdbc)
		.select(mainQuery)
		.map(function(resultset) {
			return resultset.join(delimiter).split('\n').join('') + '\n';
		})
		.group(100)
		.writeTextFile({
			filename: outputFile,
			charset: charset,
			dateFormat: true
		}).run();

	repo('min', max);
});