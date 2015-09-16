var combatants = [];
var currCombatantIx = -1;
var combatTimer = null;
var currKeyboardInputOptions = [];
var $monsterList = null;
var $combatView = null;
var combatAwaitingInput = false;
var heroBlockStatuses = [false,false,false,false,false];

$(function () {
	$monsterList = $('#monsterList');
	$combatView = $('#combatView');
});

function beginCombat(monsters) {
	combatAwaitingInput = false;
	combatants.length = [];
	GAME_MODE = MODE_COMBAT;
	clearText();
	
	$combatView.show();
	
	// add heroes to combatants list
	for(var i = 0; i < 4; i++)
		combatants.push({ init: party.heroes[i].getInitiative(), isHero: true, num: party.heroes[i].num, combatant: party.heroes[i] });
	
	// add monsters too
	for(var i = 0; i < monsters.length; i++) {
		// assign a number to the monster
		monsters[i].num = i;
		
		// roll the monster's init
		combatants.push({
			init: rollStat(monsters[i].speed + monsters[i].initBonus),
			isHero: false,
			num: i,
			combatant: monsters[i]
		});
		
		var $monsterBlock = $getMonsterBlock(monsters[i], i);
		$monsterBlock.click(monsterClicked);
		$monsterList.append($monsterBlock);
	}
	$monsterList.append('<div style="clear: both;"></div>');
		
	combatants.sort(function(a, b) {
		if(b.init == a.init) {
			return (b.init + rand(1, 100)) - (a.init + rand(1, 100));
		} else {
			return b.init - a.init;
		}
	});
	
	currCombatantIx = 0;
	
	combatTimer = window.setTimeout(function () { takeTurn(); }, 500);
}

function endCombat() {
	$combatView.hide();
	showText('The party is victorious in glorious combat!');
	log('The party is victorious in glorious combat!');
	GAME_MODE = MODE_NAV;
	selectHero(party.getFirstActingHero().num);
}

function takeTurn() {
	if(currCombatantIx >= combatants.length)
		currCombatantIx = 0;
	
	var currCombatant = combatants[currCombatantIx];
	if(currCombatant.isHero) {
		takeHeroTurn();
	} else {
		hideSelector();
		takeMonsterTurn();
	}
}

function takeHeroTurn() {
	var currCombatant = combatants[currCombatantIx].combatant;
	
	if(!currCombatant.canAct()) {
		combatAwaitingInput = false;
		currCombatantIx++;
		combatTimer = window.setTimeout(function () { takeTurn(); }, 500);
		return;
	}
	
	selectHero(currCombatant.num);
	
	heroBlockStatuses[currCombatant.num] = false;
	
	currKeyboardInputOptions.length = 0;

	var atkCall = function() { if(combatAwaitingInput) { clearText(); heroAttacks(); } };
	var castCall = function() { if(combatAwaitingInput) { clearText(); heroCasts(); } };
	var dodgeCall = function() { if(combatAwaitingInput) { clearText(); heroBlocks(); } };
	
	currKeyboardInputOptions[KEY_A] = atkCall;
	currKeyboardInputOptions[KEY_D] = dodgeCall;
	currKeyboardInputOptions[KEY_C] = castCall;
	
	showChoices(currCombatant.name + '\'s up! What will ' + currCombatant.pronoun + ' do?', [{
			text: '[A]ttack first target',
			callback: atkCall
		}, {
			text: '[C]ast a spell',
			callback: castCall
		}, {
			text: '[D]odge',
			callback: dodgeCall
		}
	]);
	
	combatAwaitingInput = true;
}

function handleCombatInput(key) {
	var call = currKeyboardInputOptions[key];
	
	if(call == undefined)
		return;
	
	call();
}

function getMonsterCombatantIndex(num) {
	for(var i = 0; i < combatants.length; i++) {
		if(combatants[i].isHero)
			continue;
		
		if(combatants[i].num == num)
			return i;
	}
	
	return -1;
}

function getMonsterCombatantByNum(num) {
	return combatants[getMonsterCombatantIndex(num)];
}

function monsterClicked() {	
	if(!combatAwaitingInput || !combatants[currCombatantIx].isHero) {
		return;
	}
	
	clearText();
	
	heroAttacks($(this).data('num'));
}

function heroAttacks(clickedMonsterNum) {
	combatAwaitingInput = false;
	
	var hero = combatants[currCombatantIx].combatant;
	var monsterNum = clickedMonsterNum;
	
	if(monsterNum == undefined)
		monsterNum = $monsterList.find('.monster:first').data('num');
	
	var monster = getMonsterCombatantByNum(monsterNum).combatant;
	
	var atk = hero.getMeleeAttack();
	
	var atkResult = inflictAttackOnMonster(atk, monster);
	if(atkResult.dodged) {
		log(hero.name + ' attacks ' + monster.name + ' but misses.');
	} else {
		if(monster.life <= 0) {
			log(hero.name + ' attacks and deals ' + atkResult.totalDamageDealt + ' damage, slaying the ' + monster.name + '!');
			log('The party gains ' + monster.experience + ' essence.');
			party.gainExperience(monster.experience);
			if(!removeMonsterFromCombat(monsterNum))
				return;
		} else {
			log(hero.name + ' attacks and deals ' + atkResult.totalDamageDealt + ' damage to the ' + monster.name + '.');
			updateMonsterBlock(monsterNum);
		}
	}
	
	currCombatantIx++;
	
	combatTimer = window.setTimeout(function () { takeTurn(); }, 500);
}

function heroCasts() {
}

function heroBlocks() {
	combatAwaitingInput = false;
	var hero = combatants[currCombatantIx];
	heroBlockStatuses[hero.num] = true;
	log(hero.combatant.name + ' stands defensively to try to avoid incoming attacks.');
	currCombatantIx++;
	combatTimer = window.setTimeout(function () { takeTurn(); }, 500);
}

function takeMonsterTurn() {
	var currCombatant = combatants[currCombatantIx].combatant;
	
	// TODO: take monster turn
	var atk = getMonsterAttack(currCombatant);
	
	var availableHeroes = [];
	
	for(var i = 0; i < party.heroes.length; i++) {
		if(party.heroes[i].status != STATUS_DEAD) {
			availableHeroes.push(party.heroes[i]);
		}
	}
	
	var hero = getRandomItem(availableHeroes);
	
	// if the hero is blocking, decrease accuracy
	if(heroBlockStatuses[hero.num]) {
		atk.accuracy -= rollStat(hero.dodge * .2);
	}
	
	log(currCombatant.name + ' attacks...');
	
	var atkResult = hero.takeAttack(atk);
	
	if(atkResult.dodged) {
		log('... but misses!');
	}
	
	currCombatantIx++;
	
	combatTimer = window.setTimeout(function () { takeTurn(); }, 500);
}

function updateMonsterBlock(num) {
	var $mb = $monsterList.find('.monster[data-num=' + num + ']');
	var monster = getMonsterCombatantByNum(num).combatant;
	
	var lifePercent = monster.life / monster.maxLife;
	
	if(lifePercent <= .25)
		$mb.css('border-color', "red");
	else if(lifePercent <= .75) {
		$mb.css('border-color', "yellow");
	} else if(lifePercent > .75 && self.life <= self.maxLife)
		$mb.css('border-color', "white");
	else if(self.life > self.maxLife) {
		$mb.css('background-image', "silver");
	}
}

function removeMonsterFromCombat(num) {
	var ix = getMonsterCombatantIndex(num);
	if (ix == -1)
		return false;
	
	combatants.splice(ix, 1);
	
	$monsterList.find('.monster[data-num=' + num + ']').remove();
	
	for (var i = 0; i < combatants.length; i++) {
		if(!combatants[i].isHero)
			return true;
	}
	
	endCombat();
	return false;
}