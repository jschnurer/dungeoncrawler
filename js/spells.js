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
	this.bonusMultiplier = data.bonusMultiplier;
	this.reqs = data.reqs;
}

spell.prototype.clone = function() {
	return new spell(this);
}

spell.prototype.getTooltip = function () {
	var tt = this.name + '<br />'
		+ SCHOOL_NAMES[this.school] + ' - ' + ELEM_NAMES[this.element] + ' magic<br />'
		+ this.description + '<br /><br />'
		+ this.cost + ' mana <br />'
		+ (this.bonusMultiplier * 100) + '% ' + SCHOOL_NAMES[this.school] + ' multiplier';
		
	if(this.type == SPELL_TYPE_HEAL) {
		tt += '<br />Restores ' + this.minHeal + ' to ' + this.maxHeal + ' life.';
	} else if(this.type == SPELL_TYPE_DAMAGE) {
		tt += '<br />Deals ' + this.minDamage + ' to ' + this.maxDamage + ' ' + ELEM_NAMES[this.element] + ' damage.';
	}

	if(this.reqs != undefined) {
		var reqString = 'Requires: ';
		var anyReqs = false;
		
		for(var i = 0; i < this.reqs.length; i++) {
			if(this.reqs[i] > 0) {
				reqString += this.reqs[i] + ' ' + STAT_NAMES[i] + ', ';
				anyReqs = true;
			}
		}
		
		if(anyReqs) {
			tt += '<br /><br />' + reqString.substr(0, reqString.length - 2);
		}
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
		casting.value += (castingHero.getPortentDamageBonus() * this.bonusMultiplier);
	} else if(this.school == SCHOOL_SPELL) {
		casting.value += (castingHero.getSpellDamageBonus() * this.bonusMultiplier);
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
var SPELL_MEND_MINOR_WOUNDS = 0;
var SPELL_STATIC_JOLT = 1;
var SPELL_FROSTFALL = 2;

SPELLS[SPELL_MEND_MINOR_WOUNDS] = new spell({
	id: SPELL_MEND_MINOR_WOUNDS,
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
	healingBreaksMaxLife: false,
	bonusMultiplier: 1,
	reqs: [0, 0, 0, 0, 0, 0, 5, 0]
});

SPELLS[SPELL_STATIC_JOLT] = new spell({
	id: SPELL_STATIC_JOLT,
	name: 'Static Jolt',
	icon: 'lightning-frequency.png',
	description: 'A jolt of static energy jumps from your outstretched finger and zaps a monster of your choosing.',
	school: SCHOOL_SPELL,
	type: SPELL_TYPE_DAMAGE,
	target: TARGET_SINGLE_MONSTER,
	cost: 8,
	classes: [false, true, true, false, false, true],
	element: ELEM_AIR,
	value: 300,
	minDamage: 1,
	maxDamage: 5,
	bonusMultiplier: 1,
	reqs: [0, 0, 0, 0, 0, 0, 0, 5]
});

SPELLS[SPELL_FROSTFALL] = new spell({
	id: SPELL_FROSTFALL,
	name: 'Frostfall',
	icon: 'snowing.png',
	description: 'A freezing frost settles over the area, damaging all monsters.',
	school: SCHOOL_SPELL,
	type: SPELL_TYPE_DAMAGE,
	target: TARGET_ALL_MONSTERS,
	cost: 14,
	classes: [false, true, true, false, false, true],
	element: ELEM_WATER,
	value: 500,
	minDamage: 2,
	maxDamage: 6,
	bonusMultiplier: .25,
	reqs: [0, 0, 0, 0, 0, 0, 0, 10]
});