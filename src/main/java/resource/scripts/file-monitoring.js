continousFile('/data/$yyyy$MM').listen(function(line) {
	var splited = line.split(';');
	var item1 = splited[1];
	var item2 = splited[2];
	//blabla
});