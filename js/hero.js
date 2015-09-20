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
		return self.stats[statId];
	}
	
	this.levelUpStat = function(statId) {
		self.stats[statId]++;
		// TODO: update derived stats
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
	self.getMightDamageBonusString = function () { return Math.round(self.getStat(STAT_MGHT) * self.mightMinDamageBonusRatio) + ' - ' + Math.round(self.getStat(STAT_MGHT) * self.mightMaxDamageBonusRatio); };
	
	self.dexMinDamageBonusRatio = .25;
	self.dexMaxDamageBonusRatio = .1;
	self.getDexDamageBonusString = function () { return Math.round(self.getStat(STAT_DEX) * self.dexMinDamageBonusRatio) + ' - ' + Math.round(self.getStat(STAT_DEX) * self.dexMaxDamageBonusRatio); };
		
	self.dodge = values.dodge;
	if(values.dodge == undefined) {
		self.dodge = Math.round(self.getStat(STAT_SPD) / 3);
	}
	
	self.turnsPerRound = values.turnsPerRound;	
	if(values.turnsPerRound == undefined) {
		self.turnsPerRound = 1 + Math.floor(self.getStat(STAT_SPD) / 30);
	}
	
	self.spellMinDamageBonusRatio = .25;
	self.spellMaxDamageBonusRatio = 1;
	self.getSpellDamageBonusString = function () { return Math.round(self.getStat(STAT_INT) * self.spellMinDamageBonusRatio) + ' - ' + Math.round(self.getStat(STAT_INT) * self.spellMaxDamageBonusRatio); };
	
	self.portentMinDamageBonusRatio = .25;
	self.portentMaxDamageBonusRatio = 1;
	self.getPortentDamageBonusString = function () { return Math.round(self.getStat(STAT_PIE) * self.portentMinDamageBonusRatio) + ' - ' + Math.round(self.getStat(STAT_PIE) * self.portentMaxDamageBonusRatio); };
	
	// P,F,W,E,A,B,M,S
	self.resistances = values.resistances;
	if(values.resistances == undefined) {
		self.resistances = [0,0,0,0,0,0,0,0];
		
		self.resistances[ELEM_PHYS] = Math.floor(self.getStat(STAT_TGH) / 3);
		
		for(var i = 1; i < self.resistances.length; i++) {
			self.resistances[i] = Math.round(self.getStat(STAT_INT) / 2 + self.getStat(STAT_PIE) / 2);
		}
	}
	
	this.getResistance = function (type) {
		var resistanceVal = self.resistances[type];
		for(var i = 0; i < self.equipment.length; i++)
			resistanceVal += self.getEquipmentResistance(self.equipment[i], type);
		return resistanceVal;
	}
	
	// Equipment
	self.equipment = [];
	self.equipment[ITEM_MELEE] = ITEMS[0].clone();
	self.equipment[ITEM_SHIELD] = null;
	self.equipment[ITEM_ARMOR] = ITEMS[1].clone();
	self.equipment[ITEM_RANGED] = null;
	self.equipment[ITEM_ACCESSORY] = null;
	
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
		return true;
	}
	
	this.canEquip = function (item) {
		if(item.reqs != undefined) {
			for(var i = 0; i < item.reqs.length; i++) {
				if (item.reqs[i] > self.stats[i])
					return false;
			}
		}
		
		return true;
	}
	
	this.removeEquipment = function (itemType) {
		if(self.equipment[itemType] == null)
			return null;
		
		var theItem = self.getEquipment(itemType);
		self.equipment[itemType] = null;
		return theItem;
	}
	
	if(values.gender == GENDERS_MALE) {
		this.pronoun = 'he';
		this.ownershipPronouns = 'his';
	}
	else {
		this.pronoun = 'she';
		this.ownershipPronouns = 'her';
	}
	
	updateBars();
	
	this.getInitiative = function () {
		return rollStat(self.getStat(STAT_SPD));
	}
	
	this.fullHeal = function () {
		self.life = self.maxLife;
		self.mana = self.maxMana;
		updateBars();
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
		
		updateBars();
	}
	
	this.getMeleeAttack = function () {
		var meleeWeapon = self.getEquipment(ITEM_MELEE);
		
		var acc = rollStat(self.getStat(STAT_ACC) + (meleeWeapon == null ? 0 : meleeWeapon.accBonus));
		
		if(meleeWeapon == null) {
			return {
				dodgeable: true,
				accuracy: acc,
				damages: [{damage: 1, type: ELEM_PHYS}] + Math.floor(rand(self.getStat(STAT_MIGHT)*self.mightMinDamageBonusRatio, self.getStat(STAT_MIGHT)*self.mightMaxDamageBonusRatio))
			};
		} else {
			return {
				dodgeable: true,
				accuracy: acc,
				damages: [{
					damage: rand(meleeWeapon.minDamage, meleeWeapon.maxDamage)
						+ Math.floor(rand(self.getStat(STAT_MIGHT)*self.mightMinDamageBonusRatio, self.getStat(STAT_MIGHT)*self.mightMaxDamageBonusRatio)),
					type: meleeWeapon.damageType
				}]
			};
		}
	}
		
	this.takeAttack = function (attack) {
		if(self.status == STATUS_DEAD) {
			return { dodged: false, totalDamageDealt: 0, effectWorked: false };
		}
		
		if(attack.dodgeable && rollStat(self.dodge) > attack.accuracy) {
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
		
		self.life -= damageTaken;
		updateBars();
		
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
	
	function updateBars() {
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
	}
	
	this.setStatus = function (status) {
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
}