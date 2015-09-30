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

spell.prototype.getTooltip = function (isShop) {
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
		
		var currHero = SPELLBOOK.selectedHero;
		
		for(var i = 0; i < this.reqs.length; i++) {
			if(this.reqs[i] > 0) {
				if(currHero != null && currHero.getStat(i) < this.reqs[i])
					reqString += '<span class="badStat">';
				reqString += this.reqs[i] + ' ' + STAT_NAMES[i];
				if(currHero != null && currHero.getStat(i) < this.reqs[i])
					reqString += '</span>';
				reqString += ', ';
				
				anyReqs = true;
			}
		}
		
		if(anyReqs) {
			tt += '<br /><br />' + reqString.substr(0, reqString.length - 2);
		}
	}
	
	if(isShop) {
		tt += '<br /><br />Value: ';
		if(!PARTY.hasExperience(this.value))
			tt += '<span class="badStat">';
		tt += this.value;
		if(!PARTY.hasExperience(this.value))
			tt += '</span>';
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
DEBUFF_NAMES[DEBUFF_DODGE] = 'off balance';

var DEBUFF_APPLIED_STRINGS = [];
DEBUFF_APPLIED_STRINGS[DEBUFF_DODGE] = 'knocked off balance';

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
var SPELL_FLAMING_WEAPON = 5;
var SPELL_MIND_BLAST = 6;
var SPELL_CHAIN_LIGHTNING = 7;
var SPELL_WATER_WALKING = 8;
var SPELL_TORCHLIGHT = 9;
var SPELL_INNER_LIGHT = 10;

//////////////////////////////////// Portents //////////////////////////////////////////////////////
////////////// BODY ////////////////
SPELLS[SPELL_MEND_MINOR_WOUNDS] = new spell({
	id: SPELL_MEND_MINOR_WOUNDS,
	name: 'Mend Minor Wounds',
	icon: 'bandage-roll.png',
	description: 'Soothing energy radiates from your fingers and mends the wounds of the hero you touch.',
	school: SCHOOL_PORTENT,
	type: SPELL_TYPE_HEAL,
	target: TARGET_SINGLE_HERO,
	cost: 9,
	element: ELEM_BODY,
	mode: SPELL_MODE_BOTH,
	value: 300,
	heal: 2,
	healingBreaksMaxLife: false,
	bonusMultiplier: 1,
	reqs: [0, 0, 0, 0, 0, 0, 6, 0]
});
////////////// MIND ////////////////
SPELLS[SPELL_MIND_BLAST] = new spell({
	id: SPELL_MIND_BLAST,
	name: 'Mind Blast',
	icon: 'psychic-waves.png',
	description: 'A blast of pure, psychic energy assails a foe.',
	school: SCHOOL_PORTENT,
	type: SPELL_TYPE_DAMAGE,
	target: TARGET_SINGLE_MONSTER,
	cost: 9,
	element: ELEM_MIND,
	mode: SPELL_MODE_COMBAT,
	value: 450,
	damage: 1,
	bonusMultiplier: .75,
	reqs: [0, 0, 0, 0, 0, 0, 10, 0]
});
////////////// SPIRIT ////////////////
SPELLS[SPELL_AURA_OF_VALOR] = new spell({
	id: SPELL_AURA_OF_VALOR,
	name: 'Aura of Valor',
	icon: 'sparkling-sabre.png',
	description: 'An aura of valor surrounds the party, invigorating them and granting an increased chance of hitting foes for the duration of the battle.',
	school: SCHOOL_PORTENT,
	type: SPELL_TYPE_BUFF,
	target: TARGET_PARTY,
	cost: 4,
	element: ELEM_SPIRIT,
	mode: SPELL_MODE_COMBAT,
	value: 250,
	buffAmt: 1,
	bonusMultiplier: .25,
	reqs: [0, 0, 0, 0, 0, 0, 4, 0]
});

SPELLS[SPELL_INNER_LIGHT] = new spell({
	id: SPELL_INNER_LIGHT,
	name: 'Inner Light',
	icon: 'beams-aura.png',
	description: 'A calming boon soothes the soul and releases your inner light. This aura lights dark places.',
	school: SCHOOL_PORTENT,
	type: SPELL_TYPE_BUFF,
	target: TARGET_PARTY,
	cost: 2,
	element: ELEM_SPIRIT,
	mode: SPELL_MODE_NAV,
	value: 50,
	bonusMultiplier: 1,
	reqs: [0, 0, 0, 0, 0, 0, 3, 0]
});

//////////////////////////////////// Spells //////////////////////////////////////////////////////
////////////// AIR ////////////////
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

SPELLS[SPELL_CHAIN_LIGHTNING] = new spell({
	id: SPELL_CHAIN_LIGHTNING,
	name: 'Chain Lightning',
	icon: 'chain-lightning.png',
	description: 'From your palms you cast outward a thundering bolt of lightning. Upon striking a foe, the bolt will leap to another, and another, and another.',
	school: SCHOOL_SPELL,
	type: SPELL_TYPE_DAMAGE,
	target: TARGET_SINGLE_MONSTER,
	cost: 35,
	element: ELEM_AIR,
	mode: SPELL_MODE_COMBAT,
	value: 5000,
	damage: 12,
	bonusMultiplier: 1.25,
	reqs: [0, 0, 0, 0, 0, 0, 0, 22]
});
////////////// WATER ////////////////
SPELLS[SPELL_FROSTFALL] = new spell({
	id: SPELL_FROSTFALL,
	name: 'Frostfall',
	icon: 'snowing.png',
	description: 'A damaging frost settles over the area, chilling all monsters to the bone.',
	school: SCHOOL_SPELL,
	type: SPELL_TYPE_DAMAGE,
	target: TARGET_ALL_MONSTERS,
	cost: 13,
	element: ELEM_WATER,
	mode: SPELL_MODE_COMBAT,
	value: 500,
	damage: 3,
	bonusMultiplier: .25,
	reqs: [0, 0, 0, 0, 0, 0, 0, 10]
});

SPELLS[SPELL_WATER_WALKING] = new spell({
	id: SPELL_WATER_WALKING,
	name: 'Water Walking',
	icon: 'water-walking.png',
	description: 'An enchantment grants the party the ability to walk across the surface of calm water.',
	school: SCHOOL_SPELL,
	type: SPELL_TYPE_BUFF,
	target: TARGET_PARTY,
	cost: 15,
	element: ELEM_WATER,
	mode: SPELL_MODE_NAV,
	value: 2000,
	bonusMultiplier: 1,
	reqs: [0, 0, 0, 0, 0, 0, 0, 16]
});
////////////// EARTH ////////////////
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
////////////// FIRE ////////////////
SPELLS[SPELL_TORCHLIGHT] = new spell({
	id: SPELL_TORCHLIGHT,
	name: 'Torchlight',
	icon: 'torch.png',
	description: 'Summon a heatless ball of burning light above the party. This light bobs above you and lights dark places.',
	school: SCHOOL_SPELL,
	type: SPELL_TYPE_BUFF,
	target: TARGET_PARTY,
	cost: 2,
	element: ELEM_FIRE,
	mode: SPELL_MODE_NAV,
	value: 50,
	bonusMultiplier: 1,
	reqs: [0, 0, 0, 0, 0, 0, 0, 3]
});

SPELLS[SPELL_FLAMING_WEAPON] = new spell({
	id: SPELL_FLAMING_WEAPON,
	name: 'Flaming Weapon',
	icon: 'flaming-trident.png',
	description: 'An aura of burning energy envelopes the weapon of an ally, causing their attacks to do additional fire damage.',
	school: SCHOOL_SPELL,
	type: SPELL_TYPE_BUFF,
	target: TARGET_SINGLE_HERO,
	cost: 11,
	element: ELEM_FIRE,
	mode: SPELL_MODE_COMBAT,
	value: 600,
	buffAmt: 1,
	bonusMultiplier: .25,
	reqs: [0, 0, 0, 0, 0, 0, 0, 12]
});
