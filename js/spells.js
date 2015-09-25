function spell(data) {
	this.id = data.id;
	this.name = data.name;
	this.icon = data.icon;
	this.school = data.school;
	this.description = data.description;
	this.type = data.type;
	this.target = data.target;
	this.cost = data.cost;
	this.element = data.element;
	this.value = data.value;
	this.damage = data.damage;
	this.heal = data.heal;
	this.healingBreaksMaxLife = data.healingBreaksMaxLife;
	this.bonusMultiplier = data.bonusMultiplier;
	this.reqs = data.reqs;
	this.mode = data.mode;
	this.buffAmt = data.buffAmt;
	this.debuff = data.debuff;
	this.debuffChance = data.debuffChance;
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
		tt += '<br />Restores ' + this.heal + ' life.';
	} else if(this.type == SPELL_TYPE_DAMAGE) {
		tt += '<br />Deals ' + this.damage + ' ' + ELEM_NAMES[this.element] + ' damage.';
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
		spellId: this.id,
		spellName: this.name,
		type: this.type,
		element: this.element,
		school: this.school,
		casterNum: castingHero.num,
		debuff: this.debuff,
		debuffChance: this.debuffChance
	};
	
	if(this.type == SPELL_TYPE_HEAL) {
		casting.value = this.heal;
		casting.healingBreaksMaxLife = this.healingBreaksMaxLife;
	} else if(this.type == SPELL_TYPE_DAMAGE) {
		casting.value = this.damage;
	} else if(this.type == SPELL_TYPE_BUFF) {
		casting.value = this.buffAmt;
	}
	
	if(this.school == SCHOOL_PORTENT) {
		casting.value += (castingHero.getPortentDamageBonus() * this.bonusMultiplier);
	} else if(this.school == SCHOOL_SPELL) {
		casting.value += (castingHero.getSpellDamageBonus() * this.bonusMultiplier);
	}
	
	casting.value = Math.floor(casting.value);
	
	return casting;
}

var SPELLS = [];

var SPELL_TYPE_HEAL = 0;
var SPELL_TYPE_DAMAGE = 1;
var SPELL_TYPE_CURE = 2;
var SPELL_TYPE_BUFF = 3;
var SPELL_TYPE_DEBUFF = 4;

var DEBUFF_DODGE = 0;

var DEBUFF_NAMES = [];
DEBUFF_NAMES[DEBUFF_DODGE] = ' clumsiness';

var SCHOOL_PORTENT = 0;
var SCHOOL_SPELL = 1;

var SCHOOL_NAMES = [];
SCHOOL_NAMES[SCHOOL_PORTENT] = 'Portent';
SCHOOL_NAMES[SCHOOL_SPELL] = 'Spell';

// [KNIGHT, THIEF, SORCERER, CLERIC, PALADIN, DRUID]
var SPELL_MEND_MINOR_WOUNDS = 0;
var SPELL_STATIC_JOLT = 1;
var SPELL_FROSTFALL = 2;
var SPELL_AURA_OF_VALOR = 3;
var SPELL_DEADLY_SWARM = 4;

SPELLS[SPELL_MEND_MINOR_WOUNDS] = new spell({
	id: SPELL_MEND_MINOR_WOUNDS,
	name: 'Mend Minor Wounds',
	icon: 'bandage-roll.png',
	description: 'Soothing energy radiates from your fingers and mends the wounds of the hero you touch.',
	school: SCHOOL_PORTENT,
	type: SPELL_TYPE_HEAL,
	target: TARGET_SINGLE_HERO,
	cost: 8,
	element: ELEM_BODY,
	mode: SPELL_MODE_BOTH,
	value: 300,
	heal: 2,
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
	element: ELEM_AIR,
	mode: SPELL_MODE_COMBAT,
	value: 300,
	damage: 3,
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
	element: ELEM_WATER,
	mode: SPELL_MODE_COMBAT,
	value: 500,
	damage: 4,
	bonusMultiplier: .25,
	reqs: [0, 0, 0, 0, 0, 0, 0, 10]
});

SPELLS[SPELL_AURA_OF_VALOR] = new spell({
	id: SPELL_AURA_OF_VALOR,
	name: 'Aura of Valor',
	icon: 'sparkling-sabre.png',
	description: 'An aura of valor surrounds the party, invigorating them and granting an increased chance of hitting foes for the duration of the battle.',
	school: SCHOOL_PORTENT,
	type: SPELL_TYPE_BUFF,
	target: TARGET_PARTY,
	cost: 5,
	element: ELEM_SPIRIT,
	mode: SPELL_MODE_COMBAT,
	value: 250,
	buffAmt: 1,
	bonusMultiplier: .25,
	reqs: [0, 0, 0, 0, 0, 0, 4, 0]
});

SPELLS[SPELL_DEADLY_SWARM] = new spell({
	id: SPELL_DEADLY_SWARM,
	name: 'Deadly Swarm',
	icon: 'wasp-sting.png',
	description: 'A wave of the hand spawns a deadly swarm of stinging insects that surround an enemy, damaging them and possibly lowering their ability to dodge attacks.',
	school: SCHOOL_SPELL,
	type: SPELL_TYPE_DAMAGE,
	target: TARGET_SINGLE_MONSTER,
	cost: 9,
	element: ELEM_EARTH,
	mode: SPELL_MODE_COMBAT,
	value: 450,
	damage: 3,
	bonusMultiplier: .85,
	debuff: DEBUFF_DODGE,
	debuffChance: .85,
	reqs: [0, 0, 0, 0, 0, 0, 0, 7]
});