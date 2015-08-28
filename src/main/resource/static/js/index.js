Model = function(){
}; //INIT
Model.prototype = {
}; //Model

View = function(){
}; //INIT
View.prototype = {
	initCharts: function(){
		$.getJSON('/REST/Chart/ScriptScoreStatistics/Total/', {})
		.fail(function(e){
			bootbox.alert(JSON.stringify(e));
		}).done(function(resp){
			if(resp.success !== 1){
				bootbox.alert(JSON.stringify(resp));
				return;
			} //if

			new Morris.Line({
				element: 'totalStatisticsChart',
				data: resp.data,
				xkey: 'timestamp',
				ykeys: resp.yKeys,
				labels: resp.yKeys
			});
		});
	} //initCharts
}; //View

Controller = function(){
}; //INIT
Controller.prototype = {
}; //Controller

$(function(){
	model = new Model();
	view = new View();
	controller = new Controller();

	view.initCharts();
});