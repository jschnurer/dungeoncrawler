function shop (data){
	this.id = data.id;
	this.name = data.name;
	this.type = data.type;
	this.itemIds = data.itemIds;
	this.sellMultiplier = data.sellMultiplier;
}

shop.prototype.open = function(prevGameMode) {
	// open inventory to first hero in store mode so the game type doesn't change
	if(this.type == SHOP_ITEMS)
		INVENTORY.open(0, true);
	else if(this.type == SHOP_MAGIC)
		SPELLBOOK.open(0, MODE_NAV, true);
	
	$('#shopPanel').show();
	$('#shopPanel .items span').html(this.name);
	
	this.previousGameMode = prevGameMode == undefined ? MODE_NAV : prevGameMode;
	GAME_MODE = MODE_SHOP;
	CURRENT_SHOP = this;
	
	// create all the items in the inventory
	for(var i = 0; i < this.itemIds.length; i++) {
		if(this.itemIds[i] != null) {
			var item = null;
			var basePath = '';
			if(this.type == SHOP_ITEMS){
				item = ITEMS[this.itemIds[i]];
				basePath = 'images/items/';
			} else if(this.type == SHOP_MAGIC) {
				item = SPELLS[this.itemIds[i]];
				basePath = 'images/spells/';
			}
			
			var $itemImg = $('<img src="' + basePath + item.icon + '" title="" data-itemId="' + item.id + '" />');
			$('#shopPanel .items label:nth-child(' + (i + 1) + ')').append($itemImg);
			$itemImg.tooltip({
				track: true,
				content: function() {
					if(CURRENT_SHOP.type == SHOP_ITEMS)
						return ITEMS[$(this).attr('data-itemId')].getTooltip(true);
					else if(CURRENT_SHOP.type == SHOP_MAGIC)
						return SPELLS[$(this).attr('data-itemId')].getTooltip(true);
				}
			});
			$itemImg.click(function () {
				CURRENT_SHOP.purchase($(this).attr('data-itemId'));
			});
		}
	}
}

shop.prototype.purchase = function(itemId) {
	var item = null;
	if(this.type == SHOP_ITEMS)
		item = ITEMS[itemId];
	else if(this.type == SHOP_MAGIC)
		item = SPELLS[itemId];
	
	if(!PARTY.hasExperience(item.value)) {
		log('You can\'t afford ' + item.name + ' for ' + item.value + ' essence.');
		return;
	} 
	
	if(this.type == SHOP_ITEMS) {
		if(!INVENTORY.gainItem(item, true, true)) {
			log('You don\'t have room to hold ' + item.name + '.');
			return;
		}
		PARTY.loseExperience(item.value)
		log('Purchased ' + item.name + ' for ' + item.value + ' essence');
	} else if(this.type == SHOP_MAGIC) {
		if(SPELLBOOK.selectedHero.knowsSpell(item)) {
			log(SPELLBOOK.selectedHero.name + ' already knows ' + item.name + '.');
			return;
		}		
		if(!SPELLBOOK.selectedHero.canLearnSpell(item)) {
			log(SPELLBOOK.selectedHero.name + ' does not meet the requirements to learn ' + item.name + '.');
			return;
		}
		var spellSlot = SPELLBOOK.selectedHero.learnSpell(item);
		if(spellSlot == -1) {
			log(SPELLBOOK.selectedHero.name + '\'s spellbook is already full.');
			return;
		}
		PARTY.loseExperience(item.value)
		SPELLBOOK.createElement(item, spellSlot);
		log(SPELLBOOK.selectedHero.name + ' learned ' + item.name + ' for ' + item.value + ' essence');
	}
}

shop.prototype.close = function() {
	GAME_MODE = this.previousGameMode;
	if(this.type == SHOP_ITEMS)
		INVENTORY.close();
	else if(this.type == SHOP_MAGIC)
		SPELLBOOK.close();
	
	$('#shopPanel').hide();
	$('#shopPanel .items label img').remove();
	CURRENT_SHOP = null;
}

shop.prototype.handleInput = function(e) {
	if(e.which == KEY_ESC) {
		this.close();
	} else if(e.which == KEY_1) {
		this.selectHero(0);
	} else if(e.which == KEY_2) {
		this.selectHero(1);
	} else if(e.which == KEY_3) {
		this.selectHero(2);
	} else if(e.which == KEY_4) {
		this.selectHero(3);
	}
}

shop.prototype.selectHero = function(ix) {
	if(this.type == SHOP_ITEMS)
		INVENTORY.selectHero(ix);
	else if(this.type == SHOP_MAGIC)
		SPELLBOOK.selectHero(ix);
}

function openShop(shopId, prevGameMode) {
	SHOPS[shopId].open(prevGameMode);
}

$(function() {
	$('#shopPanel .message > a').click(function () {
		if(CURRENT_SHOP != null) {
			CURRENT_SHOP.close();
		}
	});
	$('#shopPanel .items label').droppable({
		drop: function(event, ui) {			
			var isEquipped = $(ui.draggable.context).attr('data-isEquipped');
			var equipSlot = $(ui.draggable.context).attr('data-equipSlot');
			var itemPos = $(ui.draggable.context).attr('data-pos');
			var soldItem = null;
			
			if(isEquipped == 'true') {
				soldItem = INVENTORY.selectedHero.removeEquipment(equipSlot);
			} else {
				soldItem = INVENTORY.emptyPosition(itemPos);
			}
			
			var amt = Math.round(soldItem.value * .5);
			log('Sold ' + soldItem.name + ' for ' + amt + ' essence');
			PARTY.gainExperience(amt);
			
			var $droppedElement = $(ui.draggable.context);
			$droppedElement.remove();
		}
	});
});

var CURRENT_SHOP = null;

var SHOP_ITEMS = 0;
var SHOP_MAGIC = 1;

var SHOPS = [];
var SHOP_SORPIGAL_BLACKSMITH = 0;
var SHOP_SORPIGAL_GUILD = 1;

SHOPS[SHOP_SORPIGAL_BLACKSMITH] = new shop({
	id: SHOP_SORPIGAL_BLACKSMITH,
	name: 'J&J Blacksmithing',
	type: SHOP_ITEMS,
	sellMultiplier: .5,
	itemIds: [
		ITEM_CLUB,
		ITEM_DAGGER,
		ITEM_STAFF,
		ITEM_HAMMER,
		ITEM_HATCHET,
		ITEM_MAUL,
		null,
		ITEM_CLOTHES,
		ITEM_LEATHERARMOR,
		null,
		null,
		null,
		null,
		null,
		ITEM_TORCH
	]
});

SHOPS[SHOP_SORPIGAL_GUILD] = new shop({
	id: SHOP_SORPIGAL_GUILD,
	name: '&thorn;',
	type: SHOP_MAGIC,
	itemIds: [
		SPELL_MEND_MINOR_WOUNDS,
		SPELL_MIND_BLAST,
		SPELL_INNER_LIGHT,
		SPELL_AURA_OF_VALOR,
		SPELL_TORCHLIGHT,
		SPELL_FLAMING_WEAPON,
		SPELL_STATIC_JOLT,
		SPELL_DEADLY_SWARM,
		SPELL_FROSTFALL
	]
});