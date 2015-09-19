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
	self.might = values.might;
	self.dexterity = values.dexterity;
	self.toughness = values.toughness;
	self.accuracy = values.accuracy;
	self.speed = values.speed;
	self.cognition = values.cognition;
	self.piety = values.piety;
	self.intellect = values.intellect;
	
	self.getAdvancementCost = function () {
		var lv = self.level + 1;
		return 150 + (lv*lv + lv*lv*16) + (self.level*self.level + self.level*self.level*16);
	};
	
	// derived stat block	
	self.mana = values.mana;
	self.maxMana = values.maxMana;
	if(values.mana == undefined) {
		self.mana = values.cognition * cogToMana[values.charClass]
					+ values.piety * pieIntToMana[values.charClass]
					+ values.intellect * pieIntToMana[values.charClass];
		self.maxMana = self.mana;
	}
	
	self.life = values.life;
	self.maxLife = values.maxLife;
	if(values.life == undefined) {
		self.life = values.life != undefined ? values.life : values.toughness * tghToLife[values.charClass];
		self.maxLife = self.life;
	}
	
	self.mightMinDamageBonusRatio = .25;
	self.mightMaxDamageBonusRatio = 1;
	self.getMightDamageBonusString = function () { return Math.round(self.might * self.mightMinDamageBonusRatio) + ' - ' + Math.round(self.might * self.mightMaxDamageBonusRatio); };
	
	self.dexMinDamageBonusRatio = .25;
	self.dexMaxDamageBonusRatio = .1;
	self.getDexDamageBonusString = function () { return Math.round(self.dexterity * self.dexMinDamageBonusRatio) + ' - ' + Math.round(self.dexterity * self.dexMaxDamageBonusRatio); };
		
	self.dodge = values.dodge;
	if(values.dodge == undefined) {
		self.dodge = Math.round(self.speed / 3);
	}
	
	self.turnsPerRound = values.turnsPerRound;	
	if(values.turnsPerRound == undefined) {
		self.turnsPerRound = 1 + Math.floor(self.speed / 30);
	}
	
	self.spellMinDamageBonusRatio = .25;
	self.spellMaxDamageBonusRatio = 1;
	self.getSpellDamageBonusString = function () { return Math.round(self.intellect * self.spellMinDamageBonusRatio) + ' - ' + Math.round(self.intellect * self.spellMaxDamageBonusRatio); };
	
	self.portentMinDamageBonusRatio = .25;
	self.portentMaxDamageBonusRatio = 1;
	self.getPortentDamageBonusString = function () { return Math.round(self.piety * self.portentMinDamageBonusRatio) + ' - ' + Math.round(self.piety * self.portentMaxDamageBonusRatio); };
	
	// P,F,W,E,A,B,M,S
	self.resistances = values.resistances;
	if(values.resistances == undefined) {
		self.resistances = [0,0,0,0,0,0,0,0];
		
		self.resistances[ELEM_PHYS] = Math.floor(self.toughness / 3);
		
		for(var i = 1; i < self.resistances.length; i++) {
			self.resistances[i] = Math.round(self.intellect / 2 + self.piety / 2);
		}
	}
	
	self.getResistance = function (type) {
		return self.resistances[type];
	}
	
	if(values.gender == GENDERS_MALE) {
		this.pronoun = 'he';
		this.ownershipPronouns = 'his';
	}
	else {
		this.pronoun = 'she';
		this.ownershipPronouns = 'her';
	}
	
	self.meleeWeapon = ITEMS[0];
	
	updateBars();
	
	this.getInitiative = function () {
		return rollStat(self.speed);
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
		var acc = rollStat(self.accuracy + (self.meleeWeapon == null ? 0 : self.meleeWeapon.accBonus));
		
		if(self.meleeWeapon == null) {
			return {
				dodgeable: true,
				accuracy: acc,
				damages: [{damage: 1, type: ELEM_PHYS}] + Math.floor(rand(self.might*self.mightMinDamageBonusRatio, self.might*self.mightMaxDamageBonusRatio))
			};
		} else {
			return {
				dodgeable: true,
				accuracy: acc,
				damages: [{damage: rand(self.meleeWeapon.minDamage, self.meleeWeapon.maxDamage) + Math.floor(rand(self.might*self.mightMinDamageBonusRatio, self.might*self.mightMaxDamageBonusRatio)), type: self.meleeWeapon.damageType}]
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