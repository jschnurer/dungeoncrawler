function monster(data) {
	this.name = data.name;
	this.accuracy = data.accuracy;
	this.damage = data.damage;
	this.target = data.target;
	this.attackIsDodgeable = data.attackIsDodgeable;
	this.randomLife = data.randomLife;
	this.life = data.life;
	this.maxLife = data.maxLife;
	this.image = data.image;
	this.resistances = data.resistances;
	this.experience = data.experience;
	this.dodge = data.dodge;
	this.treasureClass = data.treasureClass;
	this.speed = data.speed;
	this.initBonus = data.initBonus;
	this.charged = data.charged;
	this.chargeAt = data.chargeAt;
	this.tactics = data.tactics;
	this.onDeath = data.onDeath;
}

monster.prototype.clone = function () {
	var m = new monster(this);
	m.life = m.maxLife = m.maxLife + rand(1, this.randomLife);
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
	}
}

monster.prototype.receiveAttack = function(attack) {
	if(attack.dodgeable && rollStat(this.dodge) > attack.accuracy) {
		return { dodged: true };
	} else {
		var totalDamageDealt = 0;
		for(var i = 0; i < attack.damages.length; i++) {
			totalDamageDealt += this.takeDamage(attack.damages[i], this);
		}
		return { dodged: false, totalDamageDealt: totalDamageDealt };
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
	return $('<div class="monster" data-num="' + num + '"><span>' + this.name + '</span><img src="images/monsters/' + this.image + '" /></div>');
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
	accuracy: 8,
	damage: {min: 3, max: 5, type: ELEM_PHYS},
	target: TARGET_RANDOM_HERO,
	attackIsDodgeable: true,
	life: 12,
	maxLife: 8,
	randomLife: 8,
	image: 'gnasher.png',
	resistances: [0, 0, 0, 0, 0, 0, 0],
	experience: 50,
	dodge: 6,
	treasureClass: 1,
	speed: 7,
	initBonus: 0,
	charged: false
});

MONSTERS[1] = new monster({
	name: 'Gnasher Nest',
	accuracy: 13,
	damage: {min: 5, max: 11, type: ELEM_PHYS},
	target: TARGET_RANDOM_HERO,
	attackIsDodgeable: true,
	life: 60,
	maxLife: 60,
	randomLife: 40,
	image: 'gnasher_nest.png',
	resistances: [0, 0, 0, 0, 0, 0, 0],
	experience: 4500,
	dodge: 4,
	treasureClass: 2,
	speed: 12,
	initBonus: 0,
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