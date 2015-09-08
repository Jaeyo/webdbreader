searchDropdown = {
	newSearchDropdown: function(domId, params, optionArr){
		this.createDOM(domId, this.initParams(params), optionArr);
	}, //newSearchDropdown
	initParams: function(params){
		if(params == null)
			params = {};
		if(params.selectionColor == null)
			params.selectionColor = '#f5f5f5';
		if(params.backgroundColor == null)
			params.backgroundColor = 'white';
		if(params.borderColor == null)
			params.borderColor = 'gray';
		if(params.maxHeight == null)
			params.maxHeight = '300px';
		return params;
	}, //initParams
	createDOM: function(domId, params, optionArr){
		var dom = $(domId).empty();
		dom.attr('value', optionArr[0]);
		var searchDropdownSelection = $('<div />')
										.attr('id', 'search-dropdown-selection')
										.css('padding', '10px')
										.css('width', '100%')
										.css('width', '100%')
										.css('background-color', params.selectionColor)
										.css('cursor', 'pointer')
										.click({domId: domId}, searchDropdown.toggleOptionMenu)
										.append(optionArr[0])
										.append(searchDropdown.getCaret());
		dom.append(searchDropdownSelection);

		var optionMenu = $('<div />')
							.attr('id', 'search-dropdown-option-menu')
							.css('display', 'none')
							.css('background-color', params.backgroundColor)
							.css('border', '1px solid ' + params.borderColor)
							.css('padding', '3px')
							.css('margin', '0px 5px 0px 5px');
		dom.append(optionMenu);

		var searchInput = $('<input />')
							.attr('type', 'text')
							.attr('placeholder', 'search...')
							.css('padding', '4px 8px')
							.css('border', '1px solid #CCC')
							.css('padding', '3px')
							.css('width', '100%')
							.keyup({domId: domId}, searchDropdown.search);
		optionMenu.append(searchInput);
		var options = $('<div />')
						.attr('id', 'search-dropdown-options')
						.css('max-height', params.maxHeight)
						.css('overflow-y', 'auto');
		optionMenu.append(options);
		
		$.each(optionArr, function(index ,value){
			searchDropdown.addOption(domId, value, params);
		});
	}, //createDOM
	addOption: function(domId, option, params){
		var optionDOM = $('<div />').css('padding', '10px')
									.css('cursor', 'pointer')
									.hover(function(){
										$(this).css('background-color', params.selectionColor);
									}, function(){
										$(this).css('background-color', '');
									})
									.click({domId: domId, option: option}, searchDropdown.select)
									.append(option);
		$('#' + domId).find('#search-dropdown-options').append(optionDOM);
	}, //addOption
	getCaret: function(){
		return $('<div class="pull-right"><span class="caret"></span></div>');
	}, //getCaret
	toggleOptionMenu: function(event){
		var domId = event.data.domId;
		
		var optionMenu = $('#' + domId).find('#search-dropdown-option-menu');
		if(optionMenu.css('display') == 'none'){
			optionMenu.show(100);
		} else{
			optionMenu.hide(100);
		} //if
	}, //toggleOptionMenu
	search: function(event){
		var domId = event.data.domId;
		var dom = $('#' + domId);
		var keyword = dom.find('input[type="text"]').val();
		
		dom.find('#search-dropdown-options').children().each(function(index, value){
			var optionDOM = $(value);
			if(keyword == null || keyword.trim().length == 0){
				optionDOM.show();
				return;
			} //if
			
			if(optionDOM.text().toLowerCase().indexOf(keyword.toLowerCase()) >= 0){
				optionDOM.show();
			} else{
				optionDOM.hide();
			} //if
		});
	}, //search
	select: function(event){
		var domId = event.data.domId;
		var selectedOption = event.data.option;
		
		var dom = $('#' + domId);
		dom.find('#search-dropdown-selection').empty().append(selectedOption).append(searchDropdown.getCaret());
		dom.find('#search-dropdown-option-menu').hide(100);
		
		dom.attr('value', selectedOption);
	} //select
}; //searchDropdown