Model = function(){
}; //INIT
Model.prototype = {
}; //Model

View = function(){
}; //INIT
View.prototype = {
	toggleSelect: function(dom){
		var isSelect = dom.attr('isselect');
		isSelect = (isSelect == 'false' ? 'true' : 'false');
		dom.attr('isselect', isSelect);
		dom.css('background-color', isSelect == 'true' ? 'rgb(31, 37, 48)' : '');
	} //toggleSelect
}; //View

Controller = function(){
	this.model = new Model();
	this.view = new View();
}; //INIT
Controller.prototype = {
	selectAllScripts: function(){
		var isNoneSelectExists = false;
		$('#div-script-info').each(function(index, value){
			if($(value).attr('isselect') == 'false')
				isNoneSelectExists = true;
		});
		
		if(isNoneSelectExists){
			$('#div-script-info').attr('isselect', 'true').css('background-color', 'rgb(31, 37, 48)');
		} else{
			$('#div-script-info').attr('isselect', 'false').css('background-color', '');
		} //if
	} //selectAllScripts
}; //Controller

$(function(){
	console.log('cp1'); //DEBUG
	controller = new Controller();
	console.log('cp2'); //DEBUG
});