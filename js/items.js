function item (data) {
	this.id = data.id;
	this.name = data.name;
	this.type = data.type;
	this.weight = data.weight;
	this.icon = data.icon;
	this.minDamage = data.minDamage;
	this.maxDamage = data.maxDamage;
	this.damageType = data.damageType;
	this.accBonus = data.accBonus;
	this.reqs = data.reqs;
	this.dodge = data.dodge;
	this.resistances = data.resistances;
}

item.prototype.clone = function() {
	return new item(this);
}

item.prototype.getTooltip = function() {
	var tooltip = this.name + '<br />';
	
	if(this.type == ITEM_MELEE) {
		tooltip += WEAPON_WEIGHT_NAMES[this.weight] + ' ' + ITEM_TYPE_NAMES[this.type] + '<br /><br />';
		
		tooltip += this.minDamage + ' to ' + this.maxDamage + ' ' + ELEM_NAMES[this.damageType] + ' damage';
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

ITEMS[0] = new item ({
	id: 0,
	name: 'Club',
	icon: 'club.png',
	type: ITEM_MELEE,
	weight: WEAPON_HEAVY,
	minDamage: 1,
	maxDamage: 3,
	damageType: ELEM_PHYS,
	accBonus: 0,
	reqs: [2, 0, 0, 0, 0, 0, 0, 0]
});

ITEMS[1] = new item ({
	id: 1,
	name: 'Clothes',
	icon: 'clothes.png',
	type: ITEM_ARMOR,
	dodge: 1
});

ITEMS[2] = new item ({
	id: 2,
	name: 'Leather Armor',
	icon: 'leather.png',
	type: ITEM_ARMOR,
	dodge: 2,
	resistances: [2, 0, 0, 0, 0, 0, 0, 0]
});

ITEMS[3] = new item ({
	id: 3,
	name: 'Dagger',
	icon: 'dagger.png',
	type: ITEM_MELEE,
	weight: WEAPON_LIGHT,
	minDamage: 1,
	maxDamage: 4,
	damageType: ELEM_PHYS,
	accBonus: 1,
	reqs: [1, 5, 0, 0, 0, 0, 0, 0]
});