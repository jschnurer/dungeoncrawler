function item (data) {
	this.id = data.id;
	this.name = data.name;
	this.type = data.type;
	this.weight = data.weight;
	this.icon = data.icon;
	this.damage = data.damage;
	this.damageType = data.damageType;
	this.accBonus = data.accBonus;
	this.reqs = data.reqs;
	this.dodge = data.dodge;
	this.resistances = data.resistances;
	this.statBonuses = data.statBonuses;
	this.maxLifeBonus = data.maxLifeBonus;
	this.hands = data.hands;
	this.value = data.value;
}

item.prototype.clone = function() {
	return new item(this);
}

item.prototype.getTooltip = function() {
	var tooltip = this.name + '<br />';
	
	if(this.type == ITEM_MELEE) {
		tooltip += this.hands + '-handed ' + WEAPON_WEIGHT_NAMES[this.weight] + ' ' + ITEM_TYPE_NAMES[this.type] + '<br /><br />';
		
		tooltip += this.damage + ' ' + ELEM_NAMES[this.damageType] + ' damage';
	} else {
		tooltip += ITEM_TYPE_NAMES[this.type] + '<br />';
	}
	
	if(this.accBonus) {
		tooltip += '<br />' + this.accBonus + ' to hit';
	}
	
	if(this.dodge != undefined && this.dodge != 0) {
		tooltip += '<br />' + this.dodge + ' dodge';
	}
	if(this.resistances != undefined) {
		for(var i = 0; i < this.resistances.length; i++) {
			if(this.resistances[i] != 0) {
				tooltip += '<br />' + this.resistances[i] + ' ' + ELEM_NAMES[i] + ' resistance';
			}
		}
	}
	
	if(this.maxLifeBonus != undefined) {
		tooltip += '<br />' + this.maxLifeBonus + ' life';
	}
	
	if(this.statBonuses != undefined) {
		var statString = '';
		
		for(var i = 0; i < this.statBonuses.length; i++) {
			if(this.statBonuses[i] != 0) {
				statString += '<br />' + this.statBonuses[i] + ' ' + STAT_NAMES[i];
			}
		}
		
		tooltip += statString;
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
			tooltip += '<br /><br />' + reqString.substr(0, reqString.length - 2);
		}
	}
	
	tooltip += '<br /><br />Value: ' + this.value;
	
	return tooltip;
}

var ITEMS = [];

var ITEM_MELEE = 1;
var ITEM_ARMOR = 2;
var ITEM_ACCESSORY = 3;
var ITEM_SHIELD = 4;
var ITEM_RANGED = 5;

var WEAPON_HEAVY = 1;
var WEAPON_LIGHT = 2;

var ITEM_TYPE_NAMES = [];
ITEM_TYPE_NAMES[ITEM_MELEE] = 'Melee Weapon';
ITEM_TYPE_NAMES[ITEM_ARMOR] = 'Armor';
ITEM_TYPE_NAMES[ITEM_ACCESSORY] = 'Accessory';
ITEM_TYPE_NAMES[ITEM_SHIELD] = 'Shield';
ITEM_TYPE_NAMES[ITEM_RANGED] = 'Ranged Weapon';

var WEAPON_WEIGHT_NAMES = [];
WEAPON_WEIGHT_NAMES[WEAPON_HEAVY] = 'Heavy';
WEAPON_WEIGHT_NAMES[WEAPON_LIGHT] = 'Light';

var ITEM_CLUB = 0;
var ITEM_CLOTHES = 1;
var ITEM_LEATHERARMOR = 2;
var ITEM_DAGGER = 3;
var ITEM_FANGNECKLACE = 4;
var ITEM_GEMSTONEBROACH = 5;
var ITEM_MAUL = 6;
var ITEM_BUCKLER = 7;
var ITEM_ROBE = 8;
var ITEM_STAFF = 9;
var ITEM_HATCHET = 10;
var ITEM_HAMMER = 11;

//// Weapons ////
// Tier 1 //
ITEMS[ITEM_CLUB] = new item ({
	id: ITEM_CLUB,
	name: 'Club',
	icon: 'club.png',
	type: ITEM_MELEE,
	weight: WEAPON_HEAVY,
	damage: 1,
	damageType: ELEM_PHYS,
	accBonus: 0,
	hands: 1,
	value: 50,
	reqs: [2, 0, 0, 0, 0, 0, 0, 0]
});
ITEMS[ITEM_DAGGER] = new item ({
	id: ITEM_DAGGER,
	name: 'Dagger',
	icon: 'dagger.png',
	type: ITEM_MELEE,
	weight: WEAPON_LIGHT,
	damage: 1,
	damageType: ELEM_PHYS,
	accBonus: 1,
	hands: 1,
	value: 75,
	reqs: [1, 5, 0, 0, 0, 0, 0, 0]
});
// Tier 2 //
ITEMS[ITEM_MAUL] = new item ({
	id: ITEM_MAUL,
	name: 'Maul',
	icon: 'flat-hammer.png',
	type: ITEM_MELEE,
	weight: WEAPON_HEAVY,
	damage: 8,
	damageType: ELEM_PHYS,
	accBonus: 0,
	hands: 2,
	value: 325,
	reqs: [9, 0, 0, 0, 0, 0, 0, 0]
});
ITEMS[ITEM_HAMMER] = new item ({
	id: ITEM_HAMMER,
	name: 'Hammer',
	icon: 'gavel.png',
	type: ITEM_MELEE,
	weight: WEAPON_HEAVY,
	damage: 5,
	damageType: ELEM_PHYS,
	accBonus: 0,
	hands: 1,
	value: 275,
	reqs: [5, 0, 0, 0, 0, 0, 0, 0]
});
ITEMS[ITEM_STAFF] = new item ({
	id: ITEM_STAFF,
	name: 'Staff',
	icon: 'wizard-staff.png',
	type: ITEM_MELEE,
	weight: WEAPON_HEAVY,
	damage: 3,
	damageType: ELEM_PHYS,
	accBonus: 0,
	hands: 2,
	value: 175,
	reqs: [2, 0, 0, 0, 0, 0, 0, 0]
});
ITEMS[ITEM_HATCHET] = new item ({
	id: ITEM_HATCHET,
	name: 'Hatchet',
	icon: 'wood-axe.png',
	type: ITEM_MELEE,
	weight: WEAPON_LIGHT,
	damage: 3,
	damageType: ELEM_PHYS,
	accBonus: 2,
	hands: 1,
	value: 300,
	reqs: [2, 7, 0, 0, 0, 0, 0, 0]
});

// Armors //
// Tier 1 //
ITEMS[ITEM_CLOTHES] = new item ({
	id: ITEM_CLOTHES,
	name: 'Clothing',
	icon: 'clothes.png',
	type: ITEM_ARMOR,
	dodge: 1,
	value: 50
});
// Tier 2 //
ITEMS[ITEM_LEATHERARMOR] = new item ({
	id: ITEM_LEATHERARMOR,
	name: 'Leather Armor',
	icon: 'leather.png',
	type: ITEM_ARMOR,
	dodge: 3,
	resistances: [2, 0, 0, 0, 0, 0, 0, 0],
	reqs: [3],
	value: 175
});
ITEMS[ITEM_ROBE] = new item ({
	id: ITEM_ROBE,
	name: 'Robe',
	icon: 'robe.png',
	type: ITEM_ARMOR,
	dodge: 2,
	resistances: [0, 1, 1, 1, 1, 1, 1, 1],
	value: 150
});

// Shields //
ITEMS[ITEM_BUCKLER] = new item ({
	id: ITEM_BUCKLER,
	name: 'Buckler',
	icon: 'round-shield.png',
	type: ITEM_SHIELD,
	dodge: 1,
	classes: [true, true, false, true, true, false],
	reqs: [4],
	value: 75
});

// Accessories //
ITEMS[ITEM_FANGNECKLACE] = new item ({
	id: ITEM_FANGNECKLACE,
	name: 'Fang Necklace',
	icon: 'fang_necklace.png',
	type: ITEM_ACCESSORY,
	statBonuses: [2, 1, 0, 0, 0, 0, 0, 0],
	value: 750
});

ITEMS[ITEM_GEMSTONEBROACH] = new item ({
	id: ITEM_GEMSTONEBROACH,
	name: 'Gemstone Broach',
	icon: 'gemstone_broach.png',
	type: ITEM_ACCESSORY,
	maxLifeBonus: 12,
	value: 600
});