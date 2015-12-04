var type = 'db2file';
var period = 6 * 1000;
var jdbc = {
	driver: 'oracle.jdbc.driver.OracleDriver',
	connUrl: 'jdbc:oracle:thin:@localhost:1521:spiderx',
	username: 'encrypted',
	password: 'encrypted'
};
var columns = '*';
var table = 'testtable';
var bindingColumn = 'col';
var delimiter = '|';
var charset = 'utf8';
var outputFile = '/data/output/$yyyy$mm$dd$hh$mm.log';



//simple
jdbc.username = decrypt(jdbc.username);
jdbc.password = decrypt(jdbc.password);
schedule(period).run(function() {
	var mainQuery = format(
		'SELECT ${columns}  \
		FROM ${table}', 
		{ columns: columns, table: table }
	);

	database(jdbc)
		.select(mainQuery)
		.map(function(resultset) {
			return resultset.join(delimiter).split('\n').join('') + '\n';
		})
		.group(100)
		.writeContinousFile({
			filename: outputFile,
			charset: charset
		}).run();
});


//sequence
jdbc.username = decrypt(jdbc.username);
jdbc.password = decrypt(jdbc.password);
schedule(peroid).run(function() {
	var maxQuery = format(
		'SELECT MAX(${bindingColumn}) \
		FROM ${table}', 
		{ bindingColumn: bindingColumn, table: table }
	);

	var min = repo('min');
	var max = database(jdbc).select(maxQuery).get();

	var mainQuery = format(
		'SELECT ${columns} \
		FROM ${table} \
		WHERE ${bindingColumn} > ${min} \
		AND ${bindingColumn} < ${max}', 
		{ columns: columns, table: table, 
		bindingColumn: bindingColumn, 
		min: min, max: max }
	);

	
	database(jdbc)
		.select(mainQuery)
		.map(function(resultset) {
			return resultset.join(delimiter).split('\n').join('') + '\n';
		})
		.group(100).
		writeContinousFile({
			filename: outputFile,
			charset: charset
		}).run();

	repo('min', max);
});


//date
jdbc.username = decrypt(jdbc.username);
jdbc.password = decrypt(jdbc.password);
schedule(period).run(function() {
	var min = repo('min');
	var max = now().format('yyyy-MM-dd hh:MM:ss');

	var mainQuery = format(
		'SELECT ${columns} \
		FROM ${table} \
		WHERE ${bindingColumn} > ${min} \
		AND ${bindingColumn} < ${max}', 
		{ columns: columns, table: table, 
		bindingColumn: bindingColumn
		min: min, max: max }
	);

	database(jdbc)
		.select(mainQuery)
		.map(function(resultset) {
			return resultset.join(delimiter).split('\n').join('') + '\n';
		})
		.group(100)
		.writeContinousFile({
			filename: outputFile,
			charset: charset
		}).run();

	repo('min', max);
});