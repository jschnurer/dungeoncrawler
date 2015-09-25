function hero (values) {
	var self = this;
	self.num = values.num;
	self.status = STATUS_OK;
	
	self.portraitBox = $('#char' + values.num);
	
	var lifeBar = $('#life' + values.num);
	var manaBar = $('#mana' + values.num);
	
	this.portrait = values.portrait;
	self.name = values.name;
	self.gender = values.gender;
	self.charClass = CLASS_KNIGHT;
	
	// stat block
	self.level = values.level || 1;
	self.stats = values.stats;
	
	this.getStat = function(statId) {
		if(statId < 8) {
			return self.stats[statId];
		} else {
			switch (statId) {
				case STAT_LIFE: return this.maxLife;
				case STAT_MANA: return this.maxMana;
				case STAT_MIGHTBONUS: return this.getMightDamageBonusString();
				case STAT_DEXBONUS: return this.getDexDamageBonusString();
				case STAT_DODGE: return this.getDodge();
				case STAT_TURNS: return this.getTurns();
				case STAT_PORTENTBONUS: return this.getPortentDamageBonusString();
				case STAT_SPELLBONUS: return this.getSpellDamageBonusString();
			}
		}
	}
	
	this.canAdvance = function() {
		return self.level < PARTY.getAverageLevel() + 3;
	}
	
	this.advanceStat = function(statId, amount) {
		self.level += amount;
		self.stats[statId] += amount;
		
		switch (statId) {
			case STAT_TGH:
				self.maxLife += (amount * tghToLife[self.charClass]);
				self.life += (amount * tghToLife[self.charClass]);
				break;
			case STAT_COG:
				self.maxMana += (amount * cogToMana[self.charClass]);
				self.mana += (amount * cogToMana[self.charClass]);
				break;
			case STAT_PIE:
				self.maxMana += (amount * pieIntToMana[self.charClass]);
				self.mana += (amount * pieIntToMana[self.charClass]);
				break;
			case STAT_INT:
				self.maxMana += (amount * pieIntToMana[self.charClass]);
				self.mana += (amount * pieIntToMana[self.charClass]);
				break;
		}
	}
	
	self.getAdvancementCost = function () {
		var lv = self.level + 1;
		return 150 + (lv*lv + lv*lv*16) + (self.level*self.level + self.level*self.level*16);
	};
	
	// derived stat block	
	self.mana = values.mana;
	self.maxMana = values.maxMana;
	if(values.mana == undefined) {
		self.mana = self.getStat(STAT_COG) * cogToMana[values.charClass]
					+ self.getStat(STAT_PIE) * pieIntToMana[values.charClass]
					+ self.getStat(STAT_INT) * pieIntToMana[values.charClass];
		self.maxMana = self.mana;
	}
	
	self.life = values.life;
	self.maxLife = values.maxLife;
	if(values.life == undefined) {
		self.life = values.life != undefined ? values.life : self.getStat(STAT_TGH) * tghToLife[values.charClass];
		self.maxLife = self.life;
	}
	
	self.mightMinDamageBonusRatio = .25;
	self.mightMaxDamageBonusRatio = 1;
	self.getMightDamageBonusString = function () { return Math.floor(self.getStat(STAT_MGHT) * self.mightMinDamageBonusRatio) + ' - ' + Math.round(self.getStat(STAT_MGHT) * self.mightMaxDamageBonusRatio); };
	self.getMightDamageBonus = function() { return Math.floor(rand(self.getStat(STAT_MGHT)*self.mightMinDamageBonusRatio, self.getStat(STAT_MGHT)*self.mightMaxDamageBonusRatio)); }
	
	self.dexMinDamageBonusRatio = .25;
	self.dexMaxDamageBonusRatio = 1;
	self.getDexDamageBonusString = function () { return Math.floor(self.getStat(STAT_DEX) * self.dexMinDamageBonusRatio) + ' - ' + Math.round(self.getStat(STAT_DEX) * self.dexMaxDamageBonusRatio); };
	self.getDexDamageBonus = function() { return Math.floor(rand(self.getStat(STAT_DEX)*self.dexMinDamageBonusRatio, self.getStat(STAT_DEX)*self.dexMaxDamageBonusRatio)); }
	
	self.getDodge = function() {
		return Math.round(self.getStat(STAT_SPD) / 3);
	}
	
	self.getTurns = function() {
		return 1 + Math.floor(self.getStat(STAT_SPD) / 30);
	}
	
	self.spellMinDamageBonusRatio = .25;
	self.spellMaxDamageBonusRatio = 1;
	self.getSpellDamageBonusString = function () { return Math.round(self.getStat(STAT_INT) * self.spellMinDamageBonusRatio) + ' - ' + Math.round(self.getStat(STAT_INT) * self.spellMaxDamageBonusRatio); };
	self.getSpellDamageBonus = function() {
		return rand(Math.round(self.getStat(STAT_INT) * self.spellMinDamageBonusRatio), Math.round(self.getStat(STAT_INT) * self.spellMaxDamageBonusRatio));
	}
	
	self.portentMinDamageBonusRatio = .25;
	self.portentMaxDamageBonusRatio = 1;
	self.getPortentDamageBonusString = function () { return Math.round(self.getStat(STAT_PIE) * self.portentMinDamageBonusRatio) + ' - ' + Math.round(self.getStat(STAT_PIE) * self.portentMaxDamageBonusRatio); };
	self.getPortentDamageBonus = function() {
		return rand(Math.round(self.getStat(STAT_PIE) * self.portentMinDamageBonusRatio), Math.round(self.getStat(STAT_PIE) * self.portentMaxDamageBonusRatio));
	}
	
	// P,F,W,E,A,B,M,S
	self.resistances = values.resistances;
	if(values.resistances == undefined) {
		self.resistances = [0,0,0,0,0,0,0,0];
	}
	
	this.getResistance = function (type) {
		var resistanceVal = self.resistances[type];
		for(var i = 0; i < self.equipment.length; i++)
			resistanceVal += self.getEquipmentResistance(self.equipment[i], type);
		
		if(type == ELEM_PHYS) {
			resistanceVal += Math.floor(self.getStat(STAT_TGH) / 3);
		} else {
			resistanceVal += Math.round(self.getStat(STAT_INT) / 2 + self.getStat(STAT_PIE) / 2);
		}
		
		return resistanceVal;
	}
	
	// Equipment
	self.equipment = [];
	self.equipment[ITEM_MELEE] = ITEMS[0].clone();
	self.equipment[ITEM_SHIELD] = null;
	self.equipment[ITEM_ARMOR] = ITEMS[1].clone();
	self.equipment[ITEM_RANGED] = null;
	self.equipment[ITEM_ACCESSORY] = null;
	
	this.updateForEquipBonuses = function (item, equipping) {
		var bonusMod = equipping ? 1 : -1;
		
		if(item.maxLifeBonus) {
			self.maxLife += bonusMod * item.maxLifeBonus;
			this.updateBars();			
		}
		
		// TODO: handle other possible bonuses
	}
	
	this.getEquipmentResistance = function (item, resistanceType) {
		if(item == null)
			return 0;
		if(item.resistances == undefined)
			return 0;
		return item.resistances[resistanceType] || 0;
	}
	
	this.getEquipment = function (itemType) {
		return self.equipment[itemType];
	}
	
	this.equipItem = function (item) {		
		self.equipment[item.type] = item;
		self.updateForEquipBonuses(item, true);
		
		return true;
	}
	
	this.canEquip = function (item) {
		if(item.reqs != undefined) {
			for(var i = 0; i < item.reqs.length; i++) {
				if (item.reqs[i] > self.stats[i])
					return false;
			}
		}
		if(item.classes != undefined) {
			if(!item.classes[self.charClass])
				return false;
		}
		
		if(item.type == ITEM_MELEE
			&& item.hands == 2
			&& this.getEquipment(ITEM_SHIELD)) {
			return false;
		} else if(item.type == ITEM_SHIELD) {
			var eWep = this.getEquipment(ITEM_MELEE);
			if(eWep
				&& eWep.hands == 2)
				return false;
		}
		
		return true;
	}
	
	this.removeEquipment = function (itemType) {
		if(self.equipment[itemType] == null)
			return null;
		
		var theItem = self.getEquipment(itemType);
		self.equipment[itemType] = null;
		self.updateForEquipBonuses(theItem, false);
		return theItem;
	}
	
	// Skills
	this.skills = values.skills || [];
	
	this.learnSkill = function(skillId) {
		this.skills[skillId] = true;
	}
	
	this.hasSkill = function(skillId) {
		return this.skills[skillId] != undefined && this.skills[skillId] != null;
	}
	
	// Spells
	this.spells = values.spells || [];
	
	this.canLearnSpell = function(spell) {
		if(spell.reqs != undefined && spell.reqs != null) {
			for(var i = 0; i < spell.reqs.length; i++) {
				if(this.getStat(i) < spell.reqs[i])
					return false;
			}
		}
		
		return true;
	}
	
	this.knowsSpell = function(spell) {
		for(var i = 0; i < this.spells.length; i++) {
			if(this.spells[i] != null
			&& this.spells[i].id == spell.id)
				return true;
		}
		
		return false;
	}
	
	this.learnSpell = function(spell) {
		for(var i = 0; i < SPELLBOOK.maxLength; i++) {
			if(this.spellSlotEmpty(i)) {
				this.setSpell(spell, i);
				return i;
			}
		}
		return -1;
	}
	
	this.spellSlotEmpty = function(slot) {
		return this.spells[slot] == null || this.spells[slot] == undefined;
	}
	
	this.getSpell = function(slot) {
		return this.spells[slot];
	}
	
	this.setSpell = function(spell, slot) {
		this.spells[slot] = spell;
	}
	
	this.receiveCasting = function(casting) {
		if(casting.type == SPELL_TYPE_HEAL) {
			self.life += casting.value;
			if(!casting.healingBreaksMaxLife && self.life > self.maxLife)
				self.life = self.maxLife;
			
			this.updateBars();
			log(this.name + ' recovers ' + casting.value + ' life.');
		}
	}
	
	this.canAffordSpell = function(spell) {
		return this.mana >= spell.cost;
	}
	
	this.payForSpell = function(spell) {
		this.mana -= spell.cost;
		this.updateBars();
	}
	////////
	
	if(values.gender == GENDERS_MALE) {
		this.pronoun = 'he';
		this.ownershipPronoun = 'his';
	}
	else {
		this.pronoun = 'she';
		this.ownershipPronoun = 'her';
	}
	
	this.getInitiative = function () {
		return rollStat(self.getStat(STAT_SPD));
	}
	
	this.fullHeal = function () {
		self.life = self.maxLife;
		self.mana = self.maxMana;
		this.updateBars();
		self.setStatus(STATUS_OK);
	}
	
	this.heal = function (amount, breakMax) {
		if(self.status == STATUS_DEAD) {
			return;
		}
		
		self.life += amount;
		
		if(self.life - amount <= 0 && self.life > 0) {
			self.setStatus(STATUS_OK);
		}
		
		if(!breakMax && self.life > self.maxLife)
			self.life = self.maxLife;
		
		this.updateBars();
	}
	
	this.getMeleeAttack = function () {
		var meleeWeapon = self.getEquipment(ITEM_MELEE);
		
		var acc = rollStat(self.getStat(STAT_ACC) + (meleeWeapon == null ? 0 : meleeWeapon.accBonus));
		
		if(meleeWeapon == null) {
			return {
				dodgeable: true,
				accuracy: acc,
				damages: [{damage: 1, type: ELEM_PHYS}] + self.getMightDamageBonus()
			};
		} else {
			return {
				dodgeable: true,
				accuracy: acc,
				damages: [{
					damage: meleeWeapon.damage + (meleeWeapon.weight == WEAPON_HEAVY ? self.getMightDamageBonus() : self.getDexDamageBonus()),
					type: meleeWeapon.damageType
				}]
			};
		}
	}
		
	this.takeAttack = function (attack) {
		if(self.status == STATUS_DEAD) {
			return { dodged: false, totalDamageDealt: 0, effectWorked: false };
		}
		
		if(attack.dodgeable && rollStat(self.getDodge()) > attack.accuracy) {
			return { dodged: true };
		} else {
			var totalDamageDealt = 0;
			
			for(var i = 0; i < attack.damages.length; i++) {
				totalDamageDealt += self.takeDamage(attack.damages[i]);
			}
			
			var effectWorked = false;
			
			if(attack.effect != null) {
				effectWorked = self.takeEffect(attack.effect);
			}
			
			return { dodged: false, totalDamageDealt: totalDamageDealt, effectWorked: effectWorked };
		}
	}
	
	this.takeDamage = function (damage) {
		var damageTaken = computeDamage(damage.damage, self.resistances[damage.type]);
		
		if(damageTaken < 0) {
			if(self.life < self.maxLife) {
				self.life += damageTaken;
				if(self.life > self.maxLife)
					self.life = self.maxLife;
			}
			log(self.name + ' absorbs ' + damageTaken + ' ' + ELEM_NAMES[damage.type] + ' damage.');
			return damageTaken;
		}
		
		self.life -= damageTaken;
		this.updateBars();
		
		log(self.name + ' suffers ' + damageTaken + ' ' + ELEM_NAMES[damage.type] + ' damage.');
		
		if(self.life <= 0 && self.life > -(self.maxLife * .2)) {
			self.setStatus(STATUS_UNCONSCIOUS);
		} else if(self.life <= 0) {
			self.setStatus(STATUS_DEAD);
		}
		
		return damageTaken;
	}
	
	this.takeEffect = function (effect) {
		// TODO: try to resist the effect
		return false;
	}
	
	this.updateBars = function (){
		lifeBar.html(self.life + '/' + self.maxLife);
		
		var lifePercent = self.life / self.maxLife;
		
		if(self.life >= self.maxLife)
			lifeBar.css('background-size', '100% 100%');
		else if(self.life <= 0)
			lifeBar.css('background-size','0% 100%');
		else
			lifeBar.css('background-size',(lifePercent * 100) + '% 100%');
		
		if(lifePercent <= .25)
			lifeBar.css('background-image', "url('images/red.png')");
		else if(lifePercent <= .75) {
			lifeBar.css('background-image', "url('images/yellow.png')");
		}
		else if(lifePercent > .75 && self.life <= self.maxLife)
			lifeBar.css('background-image', "url('images/green.png')");
		else if(self.life > self.maxLife) {
			lifeBar.css('background-image', "url('images/silver.png')");
		}
		
		manaBar.html(self.mana + '/' + self.maxMana);
		
		var manaPercent = self.mana / self.maxMana;
		
		if(self.mana >= self.maxMana)
			manaBar.css('background-size', '100% 100%');
		else if(self.mana <= 0)
			manaBar.css('background-size','0% 100%');
		else
			manaBar.css('background-size',(manaPercent * 100) + '% 100%');
	}
	
	this.setStatus = function (status) {
		self.status = status;
		if(status == STATUS_DEAD) {
			self.portraitBox.css("background-image", "url('images/portraits/dead.png'), url('" + self.portrait + "')");
			log(self.name + ' is killed!');
		} else if(status == STATUS_UNCONSCIOUS) {
			self.portraitBox.css("background-image", "url('images/portraits/unconscious.png'), url('" + self.portrait + "')");
			log(self.name + ' is knocked unconscious.');
		} else {
			self.portraitBox.css("background-image", "url('" + self.portrait + "')");
		}
	}
	
	this.canAct = function () {
		return !(self.status == STATUS_UNCONSCIOUS
			|| self.status == STATUS_DEAD
			|| self.status == STATUS_PARALYZED
			|| self.status == STATUS_ASLEEP);
	}
	
	this.canCast = function() {
		return this.canAct();
	}
}