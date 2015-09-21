// require jquery

var NewScriptBtn = function(dom) {
	this.dom = dom;
	
	this.menuDOM = 
		$('<div class="dropdown-menu"> \
			<a href="#">db2db</a> \
			<a href="#">db2file</a> \
			<a href="#">import script</a> \
		</div>');
	
	this.menuDOM.css('position', 'absolute');
	this.menuDOM.css('left', this.dom.offsetLeft);
	this.menuDOM.css('top', this.dom.offsetTop + this.dom.offsetHeight);
	this.menuDOM.css('width', '200px');
	this.menuDOM.hide();
	
	$(document.body).append(this.menuDOM);
	
	$(dom).click(function() {
		this.toggle();
	}.bind(this));
};
NewScriptBtn.prototype = {
	toggle: function() {
		if(this.menuDOM.css('display') === 'none') {
			this.menuDOM.show();
		} else {
			this.menuDOM.hide();
		} //if
	} //toggle
}; //NewScriptBtn

$(function() {
	var newScriptBtn = new NewScriptBtn($('#new-script-btn')[0]);
});