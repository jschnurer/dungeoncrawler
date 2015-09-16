var MONSTERS = [];

function cloneMonster(monster) {
	var newMonster = {};
	newMonster.name = monster.name;
	newMonster.accuracy = monster.accuracy;
	newMonster.damage = {};
	newMonster.damage.min = monster.damage.min;
	newMonster.damage.max = monster.damage.max;
	newMonster.damage.type = monster.damage.type;
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
	name: 'Skeleton',
	accuracy: 3,
	damage: {min: 1, max: 4, type: ELEM_PHYS},
	attackIsDodgeable: true,
	life: 5,
	maxLife: 5,
	randomLife: 8,
	image: 'skeleton.png',
	resistances: [0, 0, 0, 0, 0, 0, 0],
	experience: 50,
	dodge: 5,
	treasureClass: 2,
	speed: 5,
	initBonus: 0
};