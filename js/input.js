var GAME_MODE = MODE_NAV;
var SELECTED_HERO = 1;

$(function() {
	$('#char1').click(function () { selectChar(1); });
	$('#char2').click(function () { selectChar(2); });
	$('#char3').click(function () { selectChar(3); });
	$('#char4').click(function () { selectChar(4); });
});

$(document).keydown(function(e) {
	console.log(e.which);
	
	if(GAME_MODE == MODE_LEVEL_UP) {
		handleLevelUpInput(e);
		return;
	}
	
	if(GAME_MODE == MODE_CONTINUE) {
		handleContinueInput(e);
		return;
	}
	
	if(GAME_MODE == MODE_CHOICE) {
		var choiceNum = 0;
		
		if(e.which == KEY_1 || e.which == KEY_SPACE) {
			choiceNum = 1;
		} else if(e.which == KEY_2) {
			choiceNum = 2;
		} else if(e.which == KEY_3) {
			choiceNum = 3;
		} else if(e.which == KEY_4) {
			choiceNum = 4;
		} else if(e.which == KEY_5) {
			choiceNum = 5;
		}
		
		if(choiceNum == 0) 
			return;
		
		$('#choice' + choiceNum).click();
		
		e.preventDefault();
		return;
	}
	
	if(GAME_MODE != MODE_COMBAT && e.which == KEY_TAB) {
		SELECTED_HERO++;
		if(SELECTED_HERO > 4) SELECTED_HERO = 1;
		updateSelector();
		
		e.preventDefault();
		return;
	}
	
	if(GAME_MODE != MODE_COMBAT && [KEY_1, KEY_2, KEY_3, KEY_4].indexOf(e.which) != -1) {
		if(e.which == KEY_1) SELECTED_HERO = 1;
		if(e.which == KEY_2) SELECTED_HERO = 2;
		if(e.which == KEY_3) SELECTED_HERO = 3;
		if(e.which == KEY_4) SELECTED_HERO = 4;
		
		updateSelector();
		
		e.preventDefault();
		return;
	}
	
	if(GAME_MODE == MODE_NAV) {	
		nav.handleInput(e.which);
	} else if(GAME_MODE == MODE_COMBAT) {
		handleCombatInput(e.which);
	}
});

function showSelector() {
	$('#selector').show();
}

function hideSelector() {
	$('#selector').hide();
}

function selectHero(num) {
	SELECTED_HERO = num;
	showSelector();
	updateSelector();
}

function updateSelector() {
	var selector = $('#selector');
	selector.detach()
	var charPanel = $('#char' + SELECTED_HERO);
	selector.appendTo(charPanel);
}