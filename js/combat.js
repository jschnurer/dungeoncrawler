var COMBAT = null;

$(function() {
	COMBAT = new combat();
});

function combat() {
	var self = this;
	var monsterNum = 0;
	var combatants = [];
	var currCombatantIx = -1;
	var combatTimer = null;
	var currKeyboardInputOptions = [];
	var $monsterList = null;
	var $combatView = null;
	var combatAwaitingInput = false;
	var heroBlockStatuses = [false,false,false,false,false];
	var buffs = [];

	$monsterList = $('#monsterList');
	$combatView = $('#combatView');

	this.loadEncounterGroupAndBeginCombat = function(encounterGroup) {
		var monsters = [];
		for(var i = 0; i < encounterGroup.length; i++)
			monsters.push(MONSTERS[parseInt(encounterGroup[i])].clone());
		self.beginCombat(monsters);
	}

	this.beginCombat = function(monsters) {
		buffs.length = 0;
		combatAwaitingInput = false;
		combatants.length = 0;
		GAME_MODE = MODE_COMBAT;
		
		
		$combatView.show();
		
		// add heroes to combatants list
		for(var i = 0; i < 4; i++)
			combatants.push({ init: PARTY.heroes[i].getInitiative(), isHero: true, num: PARTY.heroes[i].num, combatant: PARTY.heroes[i] });
		
		// add monsters too
		for(var i = 0; i < monsters.length; i++) {
			// assign a number to the monster
			monsters[i].num = ++monsterNum;
			
			// roll the monster's init
			combatants.push({
				init: rollStat(monsters[i].speed + monsters[i].initBonus),
				isHero: false,
				num: monsterNum,
				combatant: monsters[i]
			});
			
			var $monsterBlock = monsters[i].$getMonsterBlock(monsterNum);
			$monsterBlock.click(self.monsterClicked);
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
		
		combatTimer = window.setTimeout(function () { self.takeTurn(); }, 500);
	}

	this.endCombat = function() {
		$combatView.hide();
		showText('The party is victorious in glorious combat!');
		log('The party is victorious in glorious combat!');
		PARTY.clearHeroCombatBuffs();
	}

	this.takeTurn = function() {
		if(currCombatantIx >= combatants.length)
			currCombatantIx = 0;
		
		var currCombatant = combatants[currCombatantIx];
		if(currCombatant.isHero) {
			self.takeHeroTurn();
		} else {
			hideSelector();
			self.takeMonsterTurn();
		}
	}

	this.takeHeroTurn = function() {
		var currCombatant = combatants[currCombatantIx].combatant;
		
		if(!currCombatant.canAct()) {			
			combatAwaitingInput = false;
			
			// check to see if everyone is dead
			if(PARTY.tpk()) {
				combatants.length = 0;
				this.endCombat();
				gameOver();
				return;
			}
			
			self.finishTurn();
			return;
		}
		
		selectHero(currCombatant.num);
		
		heroBlockStatuses[currCombatant.num] = false;
		
		currKeyboardInputOptions.length = 0;

		var atkCall = function() { if(combatAwaitingInput) { clearText(); self.heroAttacks(); } };
		var castCall = function() { if(combatAwaitingInput) { SPELLBOOK.open(currCombatant.num - 1, MODE_COMBAT); } };
		var dodgeCall = function() { if(combatAwaitingInput) { clearText(); self.heroBlocks(); } };
		var useItemCall = function() { if(combatAwaitingInput) { INVENTORY.open(currCombatant.num - 1, false, true); } };
				
		currKeyboardInputOptions[KEY_A] = atkCall;
		currKeyboardInputOptions[KEY_1] = atkCall;
		currKeyboardInputOptions[KEY_D] = dodgeCall;
		currKeyboardInputOptions[KEY_2] = dodgeCall;
		currKeyboardInputOptions[KEY_C] = castCall;
		currKeyboardInputOptions[KEY_3] = castCall;
		currKeyboardInputOptions[KEY_U] = useItemCall;
		currKeyboardInputOptions[KEY_4] = useItemCall;
		
		showChoices(currCombatant.name + '\'s up! What will ' + currCombatant.pronoun + ' do?', [{
				text: '[A]ttack first target',
				callback: atkCall
			}, {
				text: '[C]ast a spell',
				callback: castCall
			}, {
				text: '[U]se item',
				callback: useItemCall
			}, {
				text: '[D]odge',
				callback: dodgeCall
			}
		]);
		
		// showing choices automatically changes the game mode to choices but we want to revert back to combat
		GAME_MODE = MODE_COMBAT;
		
		combatAwaitingInput = true;
	}

	this.handleCombatInput = function(key) {
		var call = currKeyboardInputOptions[key];
		
		if(call == undefined)
			return;
		
		call();
	}

	this.getMonsterCombatantIndex = function(num) {
		for(var i = 0; i < combatants.length; i++) {
			if(combatants[i].isHero)
				continue;
			
			if(combatants[i].num == num)
				return i;
		}
		
		return -1;
	}

	this.getMonsterCombatantByNum = function(num) {
		return combatants[self.getMonsterCombatantIndex(num)];
	}
	
	this.getMonstersByNums = function(nums) {
		var monsters = [];
		for(var i = 0; i < nums.length; i++) {
			for(var m = 0; m < combatants.length; m++) {
				if(m.num == nums[i]
					&& !m.isHero)
					monsters.push(combatants[m].combatant);
			}
		}
		return monsters;
	}
	
	this.getAllMonsterNums = function() {
		var monsterNums = [];
		for(var i = 0; i < combatants.length; i++) {
			if(combatants[i].isHero)
				continue;
			
			monsterNums.push(combatants[i].num);
		}
		
		return monsterNums;
	}

	this.monsterClicked = function() {	
		if(!combatAwaitingInput || !combatants[currCombatantIx].isHero) {
			return;
		}
		
		clearText();
		
		if(SPELLBOOK.isOpen)
			SPELLBOOK.monsterClicked($(this).data('num'));
		else
			self.heroAttacks($(this).data('num'));
	}

	this.heroAttacks = function(clickedMonsterNum) {
		combatAwaitingInput = false;
		
		var hero = combatants[currCombatantIx].combatant;
		var monsterNum = clickedMonsterNum;
		
		if(monsterNum == undefined)
			monsterNum = $monsterList.find('.monster:first').data('num');
		
		var monster = self.getMonsterCombatantByNum(monsterNum).combatant;
		
		var atk = self.addBuffsToHeroAttack(hero.getMeleeAttack());
		
		var atkResult = monster.receiveAttack(atk);
	
		var dmgData = atkResult.damageData;
		var dmgTooltip = '';
		for(var i = 0; i < dmgData.length; i++) {
			if(dmgData[i] > 0) {
				if(dmgTooltip != '')
					dmgTooltip += '\n';
				dmgTooltip += dmgData[i] + ' ' + ELEM_NAMES[i];
			}
		}
		
		var attackDescription = atkResult.glancing
			? 'lands a glancing blow, dealing only'
			: 'attacks and deals';
		
		if(monster.life <= 0) {
			
			log(hero.name + ' ' + attackDescription + ' <i title="' + dmgTooltip + '">' + atkResult.totalDamageDealt + '</i> damage, slaying the ' + monster.name + '!');
			log('The party gains ' + monster.experience + ' essence.');
			PARTY.gainExperience(monster.experience);
			
			if(monster.onDeath != undefined && monster.onDeath != null)
				monster.onDeath();
			
			if(!self.removeMonsterFromCombat(monsterNum))
				return true;
		} else {
			log(hero.name + ' ' + attackDescription + ' <i title="' + dmgTooltip + '">' + atkResult.totalDamageDealt + '</i> damage to the ' + monster.name + '.');
			self.updateMonsterBlock(monsterNum);
		}
		
		self.finishTurn();
	}
	
	var glancingTexts = ['lands a glancing blow, dealing only',
						'connects awkwardly, only dealing',
						'swings off-balance, dealing a mere',
						'attacks clumsily, nearly misses, and deals only',
						'fumbles the strike, dealing only',
						'strikes gracelessly, only dealing'];
	var hitTexts = ['attacks and deals',
					'strikes dealing',
					'slashes and deals',
					'smashes and deals',
					'bashes dealing'];
	function getAttackLogDescriptionChunk(glancing) {
		if(glancing) {
			return getRandomItem(glancingTexts);
		} else {
			return getRandomItem(hitTexts);
		}
	}
	
	this.finishTurn = function() {
		self.finishTurn();
	}
	
	this.addPartyBuff = function(casting) {
		var existingBuff = buffs[casting.spellId];
		
		if(existingBuff != undefined && existingBuff != null) {
			buffs[casting.spellId].casterNum = casting.casterNum;
			buffs[casting.spellId].value = casting.value;
			return;
		}
		
		buffs[casting.spellId] = {
			spellId: casting.spellId,
			value: casting.value,
			casterNum: casting.casterNum
		};
	}
	
	this.getBuff = function (spellId) {
		if(buffs[spellId] == undefined)
			return null;
		return buffs[spellId];
	}
	
	this.addBuffsToHeroAttack = function(atk) {
		var buff = null;
		
		buff = self.getBuff(SPELL_AURA_OF_VALOR);
		if(buff) {
			atk.accuracy += buff.value;
		}
		
		return atk;
	}
	
	this.heroCastsAtParty = function(casting, hero) {
		if(casting.type == SPELL_TYPE_BUFF) {
			self.addPartyBuff(casting);
		}
		
		self.finishTurn();
	}

	this.heroCastsAtMonsters = function(casting, hero, monsterNums) {
		combatAwaitingInput = false;
		
		for(var i = 0; i < monsterNums.length; i++){
			var monsterNum = monsterNums[i];
			
			var monster = self.getMonsterCombatantByNum(monsterNum).combatant;
			monster.receiveCasting(casting, hero);
			
			if(monster.life <= 0) {
				log('The party gains ' + monster.experience + ' essence.');
				PARTY.gainExperience(monster.experience);
				
				if(monster.onDeath != undefined && monster.onDeath != null)
					monster.onDeath();
				
				if(!self.removeMonsterFromCombat(monsterNum))
					return true;
			} else {
				self.updateMonsterBlock(monsterNum);
			}
		}
		
		self.finishTurn();
		return false;
	}

	this.heroBlocks = function() {
		combatAwaitingInput = false;
		var hero = combatants[currCombatantIx];
		heroBlockStatuses[hero.num] = true;
		log(hero.combatant.name + ' stands defensively to try to avoid incoming attacks.');
		self.finishTurn();
	}

	this.takeMonsterTurn = function() {
		var monster = combatants[currCombatantIx].combatant;
		
		if(monster.tactics != undefined) {
			monster.tactics();
			self.finishTurn();
		} else {
			self.monsterAttacks(monster, monster.target);
		}
	}
	
	this.monsterAttacks = function(monster, target) {
		var atk = monster.getAttack();
		var hero = null;
		
		if(target == TARGET_RANDOM_HERO) {
			var availableHeroes = [];
			
			for(var i = 0; i < PARTY.heroes.length; i++) {
				if(PARTY.heroes[i].status != STATUS_DEAD) {
					availableHeroes.push(PARTY.heroes[i]);
				}
			}
			
			hero = getRandomItem(availableHeroes);
		}
		
		if(hero == null || hero == undefined) {
			log(monster.name + ' can\'t find anyone to attack...');
			self.finishTurn();
			return;
		}
		
		// if the hero is blocking, decrease accuracy
		if(heroBlockStatuses[hero.num]) {
			atk.accuracy -= rollStat(hero.dodge * .2);
		}
		
		log(monster.name + ' attacks...');
		
		var atkResult = hero.takeAttack(atk);
		
		if(atkResult.dodged) {
			log('... but misses!');
		}
		
		self.finishTurn();
	}
	
	this.finishTurn = function() {
		clearText();
		currCombatantIx++;
		combatTimer = window.setTimeout(function () { self.takeTurn(); }, 500);
	}

	this.updateMonsterBlock = function(num) {
		var $mb = $monsterList.find('.monster[data-num=' + num + ']');
		var monster = self.getMonsterCombatantByNum(num).combatant;
		
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

	this.removeMonsterFromCombat = function(num) {
		var ix = self.getMonsterCombatantIndex(num);
		if (ix == -1)
			return false;
		
		combatants.splice(ix, 1);
		
		$monsterList.find('.monster[data-num=' + num + ']').remove();
		
		for (var i = 0; i < combatants.length; i++) {
			if(!combatants[i].isHero)
				return true;
		}
		
		self.endCombat();
		return false;
	}
	
	this.getMonsterCount = function() {
		var monsterCount = 0;
		
		for(var i = 0; i < combatants.length; i++) {
			if(!combatants[i].isHero)
				monsterCount++;
		}
		
		return monsterCount;
	}
	
	this.addMonsters = function (monsters) {
		for(var i = 0; i < monsters.length; i++) {
			var m = MONSTERS[monsters[i]].clone();
			
			// assign a number to the monster
			m.num = ++monsterNum;
			
			// roll the monster's init
			combatants.push({
				init: 0,
				isHero: false,
				num: monsterNum,
				combatant: m
			});
			
			var $monsterBlock = $getMonsterBlock(m, monsterNum);
			$monsterBlock.click(self.monsterClicked);
			$monsterList.append($monsterBlock);
		}
		$monsterList.append('<div style="clear: both;"></div>');
	}
}