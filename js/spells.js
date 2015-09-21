function spell(data) {
	this.id = data.id;
	this.name = data.name;
	this.icon = data.icon;
	this.school = data.school;
	this.description = data.description;
	this.type = data.type;
	this.target = data.target;
	this.cost = data.cost;
	this.classes = data.classes;
	this.element = data.element;
	this.value = data.value;
	this.minDamage = data.minDamage;
	this.maxDamage = data.maxDamage;
	this.minHeal = data.minHeal;
	this.maxHeal = data.maxHeal;
	this.healingBreaksMaxLife = data.healingBreaksMaxLife;
}

spell.prototype.clone = function() {
	return new spell(this);
}

spell.prototype.getTooltip = function () {
	var tt = this.name + '<br />'
		+ ELEM_NAMES[this.element] + ' magic<br />'
		+ this.description + '<br /><br />'
		+ this.cost + ' mana';
		
	if(this.type == SPELL_TYPE_HEAL) {
		tt += '<br />Restores ' + this.minHeal + ' to ' + this.maxHeal + ' life.';
	} else if(this.type == SPELL_TYPE_DAMAGE) {
		tt += '<br />Deals ' + this.minDamage + ' to ' + this.maxDamage + ' ' + ELEM_NAMES[this.element] + ' damage.';
	}
		
	return tt;
}

spell.prototype.getCasting = function(castingHero, targetMonster) {
	var casting = {
		spellName: this.name,
		type: this.type,
		element: this.element,
		school: this.school
	};
	
	if(this.type == SPELL_TYPE_HEAL) {
		casting.value = rand(this.minHeal, this.maxHeal);
		casting.healingBreaksMaxLife = this.healingBreaksMaxLife;
	} else if(this.type == SPELL_TYPE_DAMAGE) {
		casting.value = rand(this.minDamage, this.maxDamage);
	}
	
	if(this.school == SCHOOL_PORTENT) {
		casting.value += castingHero.getPortentDamageBonus();
	} else if(this.school == SCHOOL_SPELL) {
		casting.value += castingHero.getSpellDamageBonus();
	}
	
	return casting;
}

var SPELLS = [];

var SPELL_TYPE_HEAL = 0;
var SPELL_TYPE_DAMAGE = 1;
var SPELL_TYPE_CURE = 2;
var SPELL_TYPE_BUFF = 3;
var SPELL_TYPE_DEBUFF = 4;

var SCHOOL_PORTENT = 0;
var SCHOOL_SPELL = 1;

var SCHOOL_NAMES = [];
SCHOOL_NAMES[SCHOOL_PORTENT] = 'Portent';
SCHOOL_NAMES[SCHOOL_SPELL] = 'Spell';

// [KNIGHT, THIEF, SORCERER, CLERIC, PALADIN, DRUID]

SPELLS[0] = new spell({
	id: 0,
	name: 'Mend Minor Wounds',
	icon: 'bandage-roll.png',
	description: 'Soothing energy radiates from your fingers and mends the wounds of the hero you touch.',
	school: SCHOOL_PORTENT,
	type: SPELL_TYPE_HEAL,
	target: TARGET_SINGLE_HERO,
	cost: 8,
	classes: [false, false, false, true, true, true],
	element: ELEM_BODY,
	value: 300,
	minHeal: 1,
	maxHeal: 4,
	healingBreaksMaxLife: false
});

SPELLS[1] = new spell({
	id: 1,
	name: 'Static Jolt',
	icon: 'lightning-frequency.png',
	description: 'A jolt of static energy jumps from your outstretched finger and zaps a monster of your choosing.',
	school: SCHOOL_SPELL,
	type: SPELL_TYPE_DAMAGE,
	target: TARGET_SINGLE_MONSTER,
	cost: 6,
	classes: [false, true, true, false, false, true],
	element: ELEM_AIR,
	value: 300,
	minDamage: 1,
	maxDamage: 5
});