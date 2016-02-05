var srcDbVendor = 'oracle';
var srcDbIp = '192.168.10.101';
var srcDbPort = '1521';
var srcDbSid = '';
var srcJdbcDriver = '';
var srcJdbcConnUrl = '';
var srcJdbcUsername = '';
var srcJdbcPassword = '';
var srcTable = '';
var srcColumns = '';
var destDbVendor = '';
var destDbIp = '';
var destDbPort = '';
var destDbSid = '';
var destJdbcDriver = '';
var destJdbcConnUrl = '';
var destJdbcUsername = '';
var destJdbcPassword = '';
var destTable = '';
var destColumns = '';
var period = '';
var srcBindingColumn = '';

var repeat = newRepeat({ period: period });
var repo = newRepo();
var logger = newLogger();
var crypto = newCrypto();
var srcDb = newDatabase({
	driver: srcJdbcDriver,
	connUrl: srcJdbcConnUrl,
	username: srcJdbcUsername,
	password: srcJdbcPassword
});
var destDb = newDatabase({
	driver: destJdbcDriver,
	connUrl: destJdbcConnUrl,
	username: destJdbcUsername,
	password: destJdbcPassword
});


//simple
repeat.run(function() {
	try {
		srcDb
			.query('SELECT ? FROM ?', [ srcColumns, srcTable ])
			.eachRow(function(row) {
				var values = [];
				row.eachColumn(function(column) {
					if(typeof column === 'number') values.push(column);
					else values.push("'" + column + "'");
				});
				destDb.update('INSERT INTO ? (?) VALUES(?)', [ destTable, destColumns, values.join(',') ]);
			});
	} catch(err) {
		logger.error(err);
		logger.error(err.rhinoException);
	}
});


//seq
repeat.run(function() {
	try {
		var min = repo.get('min', { isNull: '0' });
		var max = srcDb.query('SELECT MAX(?) FROM ?', [ srcBindingColumn, srcTable ]).get({ row: 1, col: 1 });
		if(max == null) return;

		srcDb
			.query('SELECT ? FROM ? WHERE ? > ? AND ? <= ?', [ srcColumns, srcTable, srcBindingColumn, min, srcBindingColumn, max ])
			.eachRow(function(row) {
				var values = [];
				row.eachColumn(function(column) {
					if(typeof column === 'number') values.push(column);
					else values.push("'" + column + "'");
				});
				destDb.update('INSERT INTO ? (?) VALUES(?)', [ destTable, destColumns, values.join(',') ]);
			});
	} catch(err) {
		logger.error(err);
		logger.error(err.rhinoException);
	}
});

//date
repeat.run(function() {
	try {
		var min = repo.get('min', { isNull: '2015-11-11 11:11:11' });
		var max = srcDb.query('SELECT MAX(?) FROM ?', [ srcBindingColumn, srcTable ]).get({ row: 1, col: 1 });
		if(max == null) return;
		else max = dateFormat(max, '$yyyy-$mm-$dd $hh:$mi:$ss');

		srcDb
			.query('SELECT ? FROM ? WHERE ? > ? AND ? <= ?', [ srcColumns, srcTable, srcBindingColumn, min, srcBindingColumn, max ])
			.eachRow(function(row) {
				var values = [];
				row.eachColumn(function(column) {
					if(typeof column === 'number') values.push(column);
					else values.push("'" + column + "'");
				});
				destDb.update('INSERT INTO ? (?) VALUES(?)', [ destTable, destColumns, values.join(',') ]);
			});
	} catch(err) {
		logger.error(err);
		logger.error(err.rhinoException);
	}
});