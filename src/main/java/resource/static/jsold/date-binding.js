var conf = {
	period: {period}
	selectColumn: '[selectColumn}',
	tableName: '{table}';
	outputPath: '{outputPath}',
	delimiter: '{delimiter}',
	charset: '{charset}',
	scriptId: '{id}',
	conditionColumnh: '{conditionColumn}',

	database: {
		ip: '{database_ip}',
		port: {database_port},
		encryptedUsername: '{database_encrypted_username}',
		encryptedPassword: '{database_encrypted_password}'
	} //database
};

function main(){ //no condition
	logger.info('task started');

	var query = 'SELECT ' + selectColumn +
				'FROM ' + getTableName(tableName);
	
	var filename = outputPath + 'output_' + dateUtil.format(dateUtil.currentTimeMillis(), 'yyyyMMddHHmm') + '.txt';

	dbHandler.selectAndAppend(JSON.stringify(conf.database), query, conf.delimiter, filename, conf.charset);

	logger.info('task finished');
} //main

function getTableName(originalTableName){ 
	var currentTime = dateUtil.currentTimeMillis();
	var yyyy = dateUtil.format(currentTime, 'yyyy');
	var mm = dateUtil.format(currentTime, 'MM');
	var dd = dateUtil.format(currentTime, 'dd');
	var hh = dateUtil.format(currentTime, 'HH');
	var mi = dateUtil.format(currentTime, 'mm');

	return originalTableName.replace("$yyyy", yyyy).replace("$mm", mm).replace("$dd", dd).replace("$hh", hh).replace("$mi", mi);
} //getTableName 
