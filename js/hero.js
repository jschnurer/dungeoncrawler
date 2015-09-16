function hero (values) {
	var self = this;
	self.num = values.num;
	
	self.portraitBox = $('#char' + values.num);
	
	var lifeBar = $('#life' + values.num);
	var manaBar = $('#mana' + values.num);
	
	this.portrait = values.portrait;
	self.name = values.name;
	self.gender = values.gender;
	self.charClass = CLASS_KNIGHT;
	self.life = 20;
	self.maxLife = 20;
	self.mana = 10;
	self.maxMana = 10;
	self.defense = 0;
	self.dodge = 0;
	self.accuracy = 6;
	self.speed = 5;
	self.might = 4;
	
	if(values.gender == GENDERS_MALE) {
		this.pronoun = 'he';
		this.ownershipPronouns = 'his';
	}
	else {
		this.pronoun = 'she';
		this.ownershipPronouns = 'her';
	}
	
	// P,F,W,E,A,B,M,S
	self.resistances = [0,0,0,0,0,0,0,0];
	
	self.meleeWeapon = ITEMS[0];
	
	updateBars();
	
	this.getInitiative = function () {
		return rollStat(self.speed);
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
				damages: [{damage: 1, type: ELEM_PHYS}] + Math.floor(rand(self.might*.15, self.might*.4))
			};
		} else {
			return {
				dodgeable: true,
				accuracy: acc,
				damages: [{damage: rand(self.meleeWeapon.minDamage, self.meleeWeapon.maxDamage) + Math.floor(rand(self.might*.15, self.might*.4)), type: self.meleeWeapon.damageType}]
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
		var damageMult = 1;
		var testNum = 1;
		
		while(true) {
			if(rand(0, 100) <= (1.0 - 30.0 / (30.0 + self.resistances[damage.type])) * 100) {
				damageMult = damageMult / 2.0;
			} else {
				break;
			}
			
			testNum++;
			
			if(testNum == 4)
				break;
		}
		
		var damageTaken = Math.floor(damageMult * damage.damage);
		
		self.life -= damageTaken;
		updateBars();
		
		log(self.name + ' suffers ' + damageTaken + ' ' + ELEM_NAMES[damage.type] + ' damage.');
		
		if(self.life <= 0 && self.life > -(self.maxLife * .2)) {
			self.setStatus(STATUS_UNCONSCIOUS);
		} else if(self.life <= 0) {
			self.setStatus(STATUS_DEAD);
		}
		
		return damageMult * damage.damage;
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
			self.portraitBox.css("background-position", "top center, center top");
			
			log(self.name + ' is killed!');
		} else if(status == STATUS_UNCONSCIOUS) {
			self.portraitBox.css("background-image", "url('images/portraits/asleep.png'), url('" + self.portrait + "')");
			self.portraitBox.css("background-position", "top center, center top");
			
			log(self.name + ' is knocked unconscious.');
		} else {
			self.portraitBox.css("background-image", "url('" + self.portrait + "')");
			self.portraitBox.css("background-position", "center top");
		}
	}
}