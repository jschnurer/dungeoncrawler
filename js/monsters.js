function monster(data) {
	this.debuffs = [];
	this.name = data.name;
	this.accuracy = data.accuracy;
	this.damage = {
		min: data.damage.min,
		max: data.damage.max,
		type: data.damage.type
	};
	this.target = data.target;
	this.attackIsDodgeable = data.attackIsDodgeable;
	this.randomLife = data.randomLife;
	this.life = data.life;
	this.maxLife = data.life;
	this.image = data.image;
	this.resistances = [];
	for(var i = 0; i < data.resistances.length; i++)
		this.resistances[i] = data.resistances[i];
	this.experience = data.experience;
	this.dodge = data.dodge;
	this.treasureClass = data.treasureClass;
	this.speed = data.speed;
	this.initBonus = data.initBonus;
	this.tactics = data.tactics;
	this.onDeath = data.onDeath;
	this.turboable = data.turboable;
}

monster.prototype.clone = function () {
	var m = new monster(this);
	m.life = m.maxLife = m.maxLife + rand(1, this.randomLife);
	
	if(this.turboable && rand(1, 100) == 100) {
		m.turbo = true;
		m.life *= 2;
		m.maxLife *= 2;
		m.damage.min *= 2;
		m.damage.max *= 2;
		m.accuracy *= 2;
		m.dodge = Math.floor(m.dodge * 1.5);
		m.experience = Math.floor(m.experience * 2.25);
		m.speed *= 2;
		m.treasureClass++;
		m.initBonus *= 2;
		m.name = 'Turbo ' + m.name;
	} else {
		m.turbo = false;
	}
	
	return m;
}

monster.prototype.receiveCasting = function(casting, hero) {
	if(casting.type == SPELL_TYPE_DAMAGE) {
		var damage = computeDamage(casting.value, this.resistances[casting.element]);
		this.life -= damage;
		if(hero != null && hero != undefined) {
			var msg = hero.name + ' casts ' + casting.spellName + ' dealing ' + damage + ' ' + ELEM_NAMES[casting.element] + ' damage';
			if(this.life <= 0)
				msg += ', slaying ' + this.name + '!';
			else
				msg += ' to ' + this.name + '.';
			log(msg)
		}
		
		if(casting.debuff != undefined && this.life > 0 && rand(1, 100) / 100.0 <= casting.debuffChance) {
			this.debuffs[casting.debuff] = true;
			log(this.name + ' is ' + DEBUFF_APPLIED_STRINGS[casting.debuff] + '!');
		}
	}
}

monster.prototype.getDodge = function () {
	if(this.debuffs[DEBUFF_DODGE])
		return Math.round(this.dodge * .66);
	
	return this.dodge;
}

monster.prototype.receiveAttack = function(attack) {
	if(attack.dodgeable && rollStat(this.getDodge()) > attack.accuracy) {
		return { dodged: true };
	} else {
		var dmgData = [0,0,0,0,0,0,0,0];
		var totalDamageDealt = 0;
		for(var i = 0; i < attack.damages.length; i++) {
			var thisDamage = this.takeDamage(attack.damages[i], this);
			totalDamageDealt += thisDamage;
			dmgData[attack.damages[i].type] += thisDamage;
		}
		return { dodged: false, totalDamageDealt: totalDamageDealt, damageData: dmgData };
	}
}

monster.prototype.takeDamage = function(damage) {		
	var damageTaken = computeDamage(damage.damage, this.resistances[damage.type]);
	this.life -= damageTaken;
	return damageTaken;
}

monster.prototype.getAttack = function() {
	return {
		dodgeable: this.attackIsDodgeable,
		accuracy: rollStat(this.accuracy),
		damages: [{damage: rand(this.damage.min, this.damage.max), type: this.damage.type}]
	};
}

monster.prototype.$getMonsterBlock = function(num) {
	return $('<div class="monster' + (this.turbo ? ' turbo' : '') + '" data-num="' + num + '"><span>' + this.name + '</span><img src="images/monsters/' + this.image + '" /></div>');
}

function getXMonsters(monster, count) {
	var m = [];
	for(var i = 0; i < count; i++)
		m.push(monster.clone());
	return m;
}

var MONSTERS = [];

MONSTERS[0] = new monster({
	name: 'Gnasher',
	accuracy: 4,
	damage: {min: 2, max: 3, type: ELEM_PHYS},
	target: TARGET_RANDOM_HERO,
	attackIsDodgeable: true,
	life: 8,
	randomLife: 8,
	image: 'gnasher.png',
	resistances: [0, 0, 0, 0, 0, 0, 0],
	experience: 50,
	dodge: 6,
	treasureClass: 1,
	speed: 7,
	initBonus: 0,
	turboable: true
});

MONSTERS[1] = new monster({
	name: 'Gnasher Nest',
	accuracy: 9,
	damage: {min: 6, max: 10, type: ELEM_PHYS},
	target: TARGET_RANDOM_HERO,
	attackIsDodgeable: true,
	life: 60,
	randomLife: 40,
	image: 'gnasher_nest.png',
	resistances: [0, 0, 0, 0, 0, 0, 0],
	experience: 2000,
	dodge: 4,
	treasureClass: 2,
	speed: 12,
	initBonus: 0,
	turboable: true,
	tactics: function() {
		var monsterCount = COMBAT.getMonsterCount();
		// 40% chance to spawn a monster if <6 monsters
		if(monsterCount < 6 && rand(1, 100) >= 60) {
			COMBAT.addMonsters([cloneMonster(MONSTERS[0])]);
			
			// another 60% chance to spawn another one if there's still room
			if(monsterCount+1 < 6 && rand(1, 100) >= 40) {
				COMBAT.addMonsters([cloneMonster(MONSTERS[0])]);
			}
			
			this.charged = false;
		} else {
			COMBAT.monsterAttacks(this, TARGET_RANDOM_HERO);
		}
	},
	onDeath: function() {
		setGameVar(SORPIGAL_DUNGEON_QUEST, 2);
	}
});

MONSTERS[2] = new monster({
	name: 'Murk Dweller',
	accuracy: 6,
	damage: {min: 4, max: 7, type: ELEM_PHYS},
	target: TARGET_RANDOM_HERO,
	attackIsDodgeable: true,
	life: 12,
	randomLife: 10,
	image: 'murk_dweller.png',
	resistances: [33, 10, 10, 10, -25, -25, -25],
	experience: 75,
	dodge: 8,
	treasureClass: 1,
	speed: 5,
	initBonus: 1,
	turboable: true
});