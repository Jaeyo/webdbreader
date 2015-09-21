// require jquery
// require bootbox
// require jade

function getScriptInfos(callback) {
	$.getJSON('/REST/Script/Info/', {})
	.done(function(resp) {
		if(resp.success !== 1) {
			callback(resp.errmsg, null);
		} else {
			callback(null, resp.scriptInfos);
		} //if
	}).fail(function(jqXHR, textStatus, err) {
		callback(JSON.stringify(err), null);
	});
} //getScriptInfos

function getScriptChartData(callback) {
	$.getJSON('/REST/Chart/ScriptScoreStatistics/Total/', {})
	.done(function(resp) {
		if(resp.success !== 1) {
			callback(resp.errmsg, null);
		} else {
			callback(null, resp.data);
		} //if
	}).fail(function(jqXHR, textStatus, err) {
		callback(JSON.stringify(err), null);
	});
} //getScriptChartData

function getOperationHistory(callback) {
	$.getJSON('/REST/OperationHistory/', {})
	.done(function(resp) {
		if(resp.success !== 1) {
			callback(resp.errmsg, null);
		} else {
			callback(null, resp.history);
		} //if
	}).fail(function(jqXHR, textStatus, err) {
		callback(JSON.stringify(err), null);
	});
} //getOperationHistory


var ScriptInfoPanel = function(scriptInfo) {
	this.dom = $(jade.compile(
		'div.panel.script-panel.' + (scriptInfo.IS_RUNNING == true ? 'panel-primary' : 'panel-red') + ' \
			div.panel-heading \
				span.glyphicon.glyphicon-console \
				span.script-name #{scriptInfo.SCRIPT_NAME} \
				div.clearfix \
			a(href="/Script/View/#{scriptInfo.SCRIPT_NAME}") \
				div.panel-footer \
					span view-detail \
					span \
						span.glyphicon.glyphicon-chevron-right \
					div.clearfix'
	)({ scriptInfo: scriptInfo }));
}; //ScriptInfoPanel
ScriptInfoPanel.prototype = {
	getDOM: function() {
		return this.dom;
	} //getDOM
}; //ScriptInfoPanel

var OperationHistoryListGroup = function(histories) {
	if(histories.length === 0) {
		this.dom = $(jade.compile(
			'div.list-group \
				span.center-xy no data'
		)());
	} else {
		this.dom = $(jade.compile(
			'div.list-group \
				each history in histories \
					if history.IS_STARTUP == true \
						a.list-group-item.startup-history \
							span.glyphicon.glyphicon-upload \
							span.pretty-date #{history.PRETTY_REGDATE} \
							div.clearfix \
					else \
						a.list-group-item.shutdown-history \
							span.glyphicon.glyphicon-download \
							span.pretty-date #{history.PRETTY_REGDATE} \
							div.clearfix'
		)({ histories: histories }));
	} //if
}; //OperationHistoryListGroup
OperationHistoryListGroup.prototype = {
	getDOM: function() {
		return this.dom;
	} //getDOM
}; //OperationHistoryListGroup


$(function() {
	getScriptInfos(function(err, scriptInfos) {
		if(err) {
			bootbox.alert('failed to load script infos, ' + err);
			return;
		} //if
		
		scriptInfos.every(function(scriptInfo) {
			$('#script-infos').append(new ScriptInfoPanel(scriptInfo).getDOM());
			return true;
		});
		$('#script-infos').append('<div class="clearfix"></div>');
	});
	
	getScriptChartData(function(err, data) {
		if(err) {
			bootbox.alert('failed to load script chart data, ' + err);
			return;
		} //if
		
		if(data.length === 0) {
			$('totalStatisticsChart').empty().append('<span class="center-xy">no data</span>');
		} else {
			new Morris.Line({
				element: 'totalStatisticsChart',
				data: data.data,
				xkey: 'timestamp',
				ykeys: data.yKeys,
				labels: data.yKeys
			});
		} //if
	});
	
	getOperationHistory(function(err, histories) {
		if(err) {
			bootbox.alert('failed to load operation histories, ' + err);
			return;
		} //if
		
		$('.operation-history-panel panel-body').empty().append(new OperationHistoryListGroup(histories).getDOM());
	});
});