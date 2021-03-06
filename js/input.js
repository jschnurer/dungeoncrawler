$(function() {
	$('#char1').click(function () { selectHero(0); });
	$('#char2').click(function () { selectHero(1); });
	$('#char3').click(function () { selectHero(2); });
	$('#char4').click(function () { selectHero(3); });

	$(document).keydown(function(e) {
		if(GAME_MODE == MODE_NONE)
			return;
		
		if(GAME_MODE == MODE_MAINMENU) {
			if(e.which == KEY_C) {
				$('#continueGame').click();
			} else if(e.which == KEY_N) {
				newGame();
			}
			return;
		}
		
		if(GAME_MODE == MODE_SHOP) {
			CURRENT_SHOP.handleInput(e);
			return;
		}
		
		if(GAME_MODE == MODE_SPELLBOOK) {
			SPELLBOOK.handleInput(e);
			return;
		}
		
		if(GAME_MODE == MODE_INVENTORY) {
			INVENTORY.handleInput(e);
			return;
		}
		
		if(GAME_MODE == MODE_LEVEL_UP) {
			PLACEOFPOWER.handleInput(e);
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
			NAV.handleInput(e.which);
		} else if(GAME_MODE == MODE_COMBAT) {
			COMBAT.handleCombatInput(e.which);
		}
	});
});

function showSelector() {
	$('#selector').show();
}

function hideSelector() {
	$('#selector').hide();
}

function selectHero(ix) {
	if(GAME_MODE == MODE_INVENTORY) {
		INVENTORY.selectHero(ix);
	} else if(GAME_MODE == MODE_NAV) {
		INVENTORY.open(ix);
	} else if(GAME_MODE == MODE_SPELLBOOK) {
		SPELLBOOK.selectHero(ix);
	} else if(GAME_MODE == MODE_SHOP) {
		CURRENT_SHOP.selectHero(ix);
	}
}

function updateSelector() {
	var selector = $('#selector');
	selector.detach()
	var charPanel = $('#char' + SELECTED_HERO);
	selector.appendTo(charPanel);
}