module.exports = {
	toCss: function(jsStyle) {
		var css = '';
		Object.keys(jsStyle).forEach(function(selector) {
			var style = jsStyle[selector];
			var styleBody = '';
			Object.keys(style).forEach(function(attrKey) {
				var attrValue = style[attrKey];
				styleBody += attrKey + ': ' + attrValue + ';';
			});
			css += selector + ' { ' + styleBody + ' } ';
		});
		return css;
	}
};