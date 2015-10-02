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
	this.spell = data.spell;
	this.castStat = data.castStat;
	this.castPower = data.castPower;
}

item.prototype.clone = function() {
	return new item(this);
}

item.prototype.getTooltip = function(isShop) {	
	var currHero = INVENTORY.selectedHero;
	
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
			tooltip += '<br /><br />' + reqString.substr(0, reqString.length - 2);
		}
	}
	
	if(this.type == ITEM_TOME) {
		tooltip += '<br/>' + SPELLS[this.spell].getTooltip(isShop, currHero);
	} else if(this.type == ITEM_SCROLL) {
		tooltip += '<br />' + SPELLS[this.spell].getScrollTooltip(this.castPower, this.castStat);
	} else {
		if(isShop) {
			tooltip += '<br /><br />Value: ';
			if(!PARTY.hasExperience(this.value))
				tooltip += '<span class="badStat">';
			tooltip += this.value;
			if(!PARTY.hasExperience(this.value))
				tooltip += '</span>';
		} else {
			tooltip += '<br /><br />Value: ' + this.value;
		}
	}
	return tooltip;
}

var ITEMS = [];

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
	accBonus: 1,
	hands: 2,
	value: 325,
	reqs: [12, 0, 0, 0, 0, 0, 0, 0]
});
ITEMS[ITEM_HAMMER] = new item ({
	id: ITEM_HAMMER,
	name: 'Hammer',
	icon: 'gavel.png',
	type: ITEM_MELEE,
	weight: WEAPON_HEAVY,
	damage: 5,
	damageType: ELEM_PHYS,
	accBonus: 2,
	hands: 1,
	value: 275,
	reqs: [7, 0, 0, 0, 0, 0, 0, 0]
});
ITEMS[ITEM_STAFF] = new item ({
	id: ITEM_STAFF,
	name: 'Staff',
	icon: 'wizard-staff.png',
	type: ITEM_MELEE,
	weight: WEAPON_HEAVY,
	damage: 3,
	damageType: ELEM_PHYS,
	accBonus: 1,
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
	accBonus: 3,
	hands: 1,
	value: 300,
	reqs: [4, 11, 0, 0, 0, 0, 0, 0]
});
ITEMS[ITEM_WHIP] = new item ({
	id: ITEM_WHIP,
	name: 'Whip',
	icon: 'whip.png',
	type: ITEM_MELEE,
	weight: WEAPON_LIGHT,
	damage: 4,
	damageType: ELEM_PHYS,
	accBonus: 10,
	hands: 1,
	value: 800,
	reqs: [0, 15, 0, 0, 0, 0, 0, 0]
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
	reqs: [4],
	value: 75
});
ITEMS[ITEM_TORCH] = new item ({
	id: ITEM_TORCH,
	name: 'Torch',
	icon: 'torch.png',
	type: ITEM_SHIELD,
	dodge: 0,
	value: 50
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

// Scrolls //
ITEMS[ITEM_SCROLL_MEND_MINOR_WOUNDS] = new item ({
	id: ITEM_SCROLL_MEND_MINOR_WOUNDS,
	name: 'Scroll of Mend Minor Wounds',
	icon: 'scroll-unfurled.png',
	type: ITEM_SCROLL,
	castStat: STAT_PIE,
	castPower: 8,
	spell: SPELL_MEND_MINOR_WOUNDS,
	value: 100
});

// Tomes //
ITEMS[ITEM_TOME_TORCHLIGHT] = new item ({
	id: ITEM_TOME_TORCHLIGHT,
	name: 'Tome of Torchlight',
	icon: 'black-book.png',
	type: ITEM_TOME,
	spell: SPELL_TORCHLIGHT
});
