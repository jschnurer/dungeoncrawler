var MONSTERS = [];

function cloneMonster(monster) {
	var newMonster = {};
	newMonster.name = monster.name;
	newMonster.accuracy = monster.accuracy;
	newMonster.damage = {};
	newMonster.damage.min = monster.damage.min;
	newMonster.damage.max = monster.damage.max;
	newMonster.damage.type = monster.damage.type;
	newMonster.target = monster.target;
	newMonster.attackIsDodgeable = monster.attackIsDodgeable;
	var randomExtraLife = rand(1, monster.randomLife);
	newMonster.life = monster.life + randomExtraLife;
	newMonster.maxLife = monster.maxLife + randomExtraLife;
	newMonster.image = monster.image;
	newMonster.resistances = [];
	for(var i = 0; i < monster.resistances.length; i++) newMonster.resistances.push(monster.resistances[i]);
	newMonster.experience = monster.experience;
	newMonster.dodge = monster.dodge;
	newMonster.treasureClass = monster.treasureClass;
	newMonster.speed = monster.speed;
	newMonster.initBonus = monster.initBonus;
	newMonster.charged = monster.charged;
	newMonster.chargeAt = monster.chargeAt;
	newMonster.tactics = monster.tactics;
	
	return newMonster;
}

function inflictAttackOnMonster(attack, monster) {	
	if(attack.dodgeable && rollStat(monster.dodge) > attack.accuracy) {
		return { dodged: true };
	} else {
		var totalDamageDealt = 0;
		for(var i = 0; i < attack.damages.length; i++) {
			totalDamageDealt += inflictDamageOnMonster(attack.damages[i], monster);
		}
		return { dodged: false, totalDamageDealt: totalDamageDealt };
	}
}

function inflictDamageOnMonster(damage, monster) {		
	var damageTaken = computeDamage(damage.damage, monster.resistances[damage.type]);
	monster.life -= damageTaken;
	return damageTaken;
}

function getMonsterAttack(monster) {
	return {
		dodgeable: monster.attackIsDodgeable,
		accuracy: rollStat(monster.accuracy),
		damages: [{damage: rand(monster.damage.min, monster.damage.max), type: monster.damage.type}]
	};
}

function $getMonsterBlock(monster, num) {
	return $('<div class="monster" data-num="' + num + '"><span>' + monster.name + '</span><img src="images/monsters/' + monster.image + '" /></div>');
}

function getXMonsters(monster, count) {
	var m = [];
	for(var i = 0; i < count; i++)
		m.push(cloneMonster(monster));
	return m;
}

MONSTERS[0] = {
	name: 'Gnasher',
	accuracy: 8,
	damage: {min: 2, max: 4, type: ELEM_PHYS},
	target: TARGET_RANDOM_HERO,
	attackIsDodgeable: true,
	life: 8,
	maxLife: 8,
	randomLife: 8,
	image: 'skeleton.png',
	resistances: [0, 0, 0, 0, 0, 0, 0],
	experience: 50,
	dodge: 7,
	treasureClass: 1,
	speed: 6,
	initBonus: 0,
	charged: false
};

MONSTERS[1] = {
	name: 'Gnasher Nest',
	accuracy: 12,
	damage: {min: 5, max: 11, type: ELEM_PHYS},
	target: TARGET_RANDOM_HERO,
	attackIsDodgeable: true,
	life: 40,
	maxLife: 40,
	randomLife: 30,
	image: 'skeleton.png',
	resistances: [0, 0, 0, 0, 0, 0, 0],
	experience: 1200,
	dodge: 4,
	treasureClass: 2,
	speed: 4,
	initBonus: 0,
	charged: false,
	chargeAt: 7,
	tactics: function() {
		if(!this.charged && rand(1, 10) >= this.chargeAt) {
			this.charged = true;
		}
		
		var monsterCount = combat.getMonsterCount();
		
		// 50/50 chance to spawn a monster if charged and < 6 monsters
		if(monsterCount < 6 && this.charged && rand(1, 100) >= 50) {
			combat.addMonsters([cloneMonster(MONSTERS[0])]);
			
			if(monsterCount+1 < 6 && rand(1, 100) >= 30) {
				combat.addMonsters([cloneMonster(MONSTERS[0])]);
			}
			
			this.charged = false;
		} else {
			combat.monsterAttacks(this, TARGET_RANDOM_HERO);
		}
	}
};