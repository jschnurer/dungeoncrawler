function spellbook(){ };

var SPELLMODE_SELECT_SPELL = 0;
var SPELLMODE_SELECT_TARGET = 1;

spellbook.prototype.previousGameMode = MODE_NAV;
spellbook.prototype.spellMode = SPELLMODE_SELECT_SPELL;
spellbook.prototype.castingSpell = null;
spellbook.prototype.isOpen = false;

spellbook.prototype.handleInput = function (e) {
	if(e.which == KEY_ESC) {
		if(this.spellMode == SPELLMODE_SELECT_SPELL)
			this.close();
		else if(this.spellMode == SPELLMODE_SELECT_TARGET) {
			this.spellMode = SPELLMODE_SELECT_SPELL;
			this.castingSpell = null;
			$('#spellTargeting').hide();
		}
	} else if(e.which == KEY_1 && this.selectedHero.num != 1) {
		this.selectHero(0);
	} else if(e.which == KEY_2 && this.selectedHero.num != 2) {
		this.selectHero(1);
	} else if(e.which == KEY_3 && this.selectedHero.num != 3) {
		this.selectHero(2);
	} else if(e.which == KEY_4 && this.selectedHero.num != 4) {
		this.selectHero(3);
	}
}
spellbook.prototype.maxLength = 30;

spellbook.prototype.selectHero = function (ix) {
	if(this.spellMode == SPELLMODE_SELECT_SPELL) {
		if(this.previousGameMode == MODE_NAV) {
			$('#spellPanel div label img').remove();
			this.selectedHero = PARTY.heroes[ix];
			this.loadHeroSpells();
		}
	} else if(this.spellMode == SPELLMODE_SELECT_TARGET) {
		if(this.castingSpell != null && this.castingSpell.target == TARGET_SINGLE_HERO) {
			this.castAt([PARTY.heroes[ix]]);
		}
	}
}

spellbook.prototype.castAt = function(heroes, monsterNums) {
	var casting = null;
	
	if(monsterNums != null && monsterNums != undefined)
		casting = this.castingSpell.getCasting(this.selectedHero, COMBAT.getMonstersByNums(monsterNums));
	else
		casting = this.castingSpell.getCasting(this.selectedHero, heroes);
	
	this.selectedHero.payForSpell(this.castingSpell);
	log(this.selectedHero.name + ' casts ' + this.castingSpell.name + '.');
	
	if(heroes) {
		for(var i = 0; i < heroes.length; i++) {
			heroes[i].receiveCasting(casting);
		}
	} else {
		if(COMBAT.heroCastsAtMonsters(casting, this.selectedHero, monsterNums)) {
			this.previousGameMode = MODE_CONTINUE;
		} else {
			if(this.previousGameMode == MODE_COMBAT)
				COMBAT.finishTurn();
		}
	}
	
	this.castingSpell = null;
	this.spellMode = SPELLMODE_SELECT_SPELL;
	this.close();
}

spellbook.prototype.monsterClicked = function(monsterNum) {
	if(this.spellMode == SPELLMODE_SELECT_TARGET
		&& this.castingSpell != null
		&& this.castingSpell.target == TARGET_SINGLE_MONSTER
		&& this.selectedHero.canAffordSpell(this.castingSpell)) {
		var monster = COMBAT.getMonsterCombatantByNum(monsterNum).combatant;
		this.castAt(null, [monsterNum]);
	}
}

spellbook.prototype.close = function(didCast) {
	$('#spellPanel div label img').remove();
	
	$('#spellPanel').hide();
	$('#essencePanel').show();
	
	this.isOpen = false;
	GAME_MODE = this.previousGameMode;
}

spellbook.prototype.open = function (heroIx, gameModeToReturnTo) {
	GAME_MODE = MODE_SPELLBOOK;
	this.previousGameMode = gameModeToReturnTo;
	this.selectedHero = PARTY.heroes[heroIx];
	this.isOpen = true;
	
	$('#spellTargeting').hide();
	$('#spellPanel').show();
	this.loadHeroSpells();
}
	
spellbook.prototype.loadHeroSpells = function() {
	$('#spellPanel #spellPanelHeroName').html(this.selectedHero.name + '\'s Spellbook');
	
	// create all the spells in the spellbook
	for(var i = 0; i < this.maxLength; i++) {
		var spell = this.selectedHero.getSpell(i);
		if(spell != undefined && spell != null) {
			var $img = $('<img src="images/spells/' + spell.icon
				+ '" title="" data-pos="' + i + '" data-item="' + spell.id + '" />');
			$('#spellPanel div label:nth-child(' + (i + 1) + ')').append($img);
			$img.tooltip({
				track: true,
				content: function() {
					return SPELLS[parseInt($(this).attr('data-item'))].getTooltip();
				}
			});
			$img.draggable({ containment: '#spellPanel', helper: 'clone' });
			$img.click(function() { SPELLBOOK.beginCasting(SPELLS[parseInt($(this).attr('data-item'))]); });
		}
	}
}

spellbook.prototype.beginCasting = function(spell) {
	if(!this.spellMode == SPELLMODE_SELECT_SPELL)
		return;
	
	if(this.selectedHero.canAffordSpell(spell)) {
		if(spell.target == TARGET_ALL_HEROES) {
			this.castingSpell = spell;
			this.castAt(PARTY.heroes);
		} else if(spell.target == TARGET_ALL_MONSTERS && this.previousGameMode == MODE_COMBAT) {
			this.castingSpell = spell;
			this.castAt(null, COMBAT.getAllMonsterNums());
		} else {
			if(spell.target == TARGET_SINGLE_HERO) {
				$('#spellTargeting').html('Cast ' + spell.name + ' on which hero? (Or ESC to cancel)');
				$('#spellTargeting').show();
				this.castingSpell = spell;
				this.spellMode = SPELLMODE_SELECT_TARGET;
			} else if(spell.target == TARGET_SINGLE_MONSTER && this.previousGameMode == MODE_COMBAT) {
				$('#spellTargeting').html('Cast ' + spell.name + ' at which monster? (Or ESC to cancel)');
				$('#spellTargeting').show();
				this.castingSpell = spell;
				this.spellMode = SPELLMODE_SELECT_TARGET;
			}
		}
	}
}

var SPELLBOOK = new spellbook();


$(function() {	
	$('#spellPanel div label').droppable({
		drop: function(event, ui) {
			var droppedPosition = parseInt($(this).attr('data-pos'));
			var draggedPosition = $(ui.draggable.context).attr('data-pos');
			var droppedSpell = SPELLBOOK.selectedHero.getSpell(droppedPosition);
			var draggedSpell = SPELLBOOK.selectedHero.getSpell(draggedPosition);
			var $droppedElement = $(ui.draggable.context);
			
			var $existingElement = $(this).children();
			
			if(!($existingElement == null || $existingElement == undefined || $existingElement.length == 0)) {
				console.log($droppedElement.parent());
			}
			
			SPELLBOOK.selectedHero.setSpell(draggedSpell, droppedPosition);
			SPELLBOOK.selectedHero.setSpell(droppedSpell, draggedPosition);
			
			$droppedElement.attr('data-pos', droppedPosition);
			$droppedElement.appendTo($(this));
		}
	});
});