var GAME_MODE = MODE_NAV;
var SELECTED_CHAR = 1;

$(function() {
	$('#char1').click(function () { selectChar(1); });
	$('#char2').click(function () { selectChar(2); });
	$('#char3').click(function () { selectChar(3); });
	$('#char4').click(function () { selectChar(4); });
});

$(document).keydown(function(e) {
	console.log(e.which);
	
	if(GAME_MODE != MODE_COMBAT && e.which == KEY_TAB) {
		SELECTED_CHAR++;
		if(SELECTED_CHAR > 4) SELECTED_CHAR = 1;
		updateSelector();
		
		e.preventDefault();
	}
	
	if(GAME_MODE == MODE_NAV) {	
		nav.handleInput(e.which);
	} else if(GAME_MODE == MODE_COMBAT) {
		handleCombatInput(e.which);
	}
});

function selectChar(num) {
	SELECTED_CHAR = num;
	updateSelector();
}

function updateSelector() {
	var selector = $('#selector');
	selector.detach()
	var charPanel = $('#char' + SELECTED_CHAR);
	selector.appendTo(charPanel);
}