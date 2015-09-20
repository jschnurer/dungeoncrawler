function inventory() {}

inventory.prototype.handleInput = function (e) {
	if(e.which == KEY_I || e.which == KEY_ESC) {
		this.close();
	}
}
inventory.prototype.maxLength = 45;
inventory.prototype.items = [];
inventory.prototype.gainItem = function (item, cloneItem) {
	if(cloneItem)
		this.items.push(item.clone());
	else
		this.items.push(item);
}
inventory.prototype.putItemInPosition = function (item, pos) {
	this.items[pos] = item;
}
inventory.prototype.getItemInPosition = function (pos) {
	return this.items[pos];
}
inventory.prototype.hasItem = function (itemId, count) {
	var numFound = 0;
	
	for(var i = 0; i < this.maxLength; i++) {
		if(this.items[i] != undefined && this.items[i] != null && this.items[i].id == itemId) {
			numFound++;
		}
	}
	
	return numFound >= (count || 1);
}
inventory.prototype.loseItem = function (itemId, count) {
	var numToRemove = (count || 1);
	
	for(var i = 0; i < this.maxLength; i++) {
		if(this.items[i] != undefined && this.items[i] != null && this.items[i].id == itemId) {
			this.items[i] = null;
			numToRemove--;
			
			if(numToRemove == 0)
				return;
		}
	}
}
inventory.prototype.emptyPosition = function (pos) {
	var theItem = this.items[pos];
	this.items[pos] = null;
	return theItem;
}
inventory.prototype.isEmpty = function (ix) {
	if(ix != undefined)
		return this.items[ix] == undefined
			|| this.items[ix] == null;
	else {
		for(var i = 0; i < this.maxLength; i++) {
			if(this.items[i] != undefined && this.items[i] != null)
				return false;
		}
		return true;
	}
}
inventory.prototype.close = function () {
	$('#partyInventory label img').remove();
	
	$('#partyInventory').hide();
	$('#essencePanel').show();
	GAME_MODE = MODE_NAV;
}
inventory.prototype.open = function (heroIx) {
	GAME_MODE = MODE_INVENTORY;
	
	inventoryHero = party.heroes[heroIx];
	
	$('#partyInventory').show();
	$('#essencePanel').hide();
	
	// create all the items in the inventory
	for(var i = 0; i < this.maxLength; i++) {
		if(this.items[i] != null) {
			var $itemImg = $('<img src="images/items/' + this.items[i].icon + '" title="" data-pos="' + i + '" data-isEquipped="false" data-equipSlot="' + this.items[i].type + '" data-item="' + this.items[i].id + '" />');
			$('#invItems label:nth-child(' + (i + 1) + ')').append($itemImg);
			$itemImg.tooltip({
				track: true,
				content: function() {
					return ITEMS[$(this).attr('data-item')].getTooltip();
				}
			});
			$itemImg.draggable({ containment: '#partyInventory', helper: 'clone' });
		}
	}
	
	this.loadEquipment();
}

inventory.prototype.loadEquipment = function() {
	$('#invCurrHero label img').remove();
	
	$('#invHeroName').html(inventoryHero.name);
	
	var $hm = $('#heroMelee');
	var $hs = $('#heroShield');
	var $ha = $('#heroArmor');
	var $hc = $('#heroAccessory');
	
	var slotHolders = [];
	slotHolders[ITEM_MELEE] = $hm;
	slotHolders[ITEM_SHIELD] = $hs;
	slotHolders[ITEM_ARMOR] = $ha;
	slotHolders[ITEM_ACCESSORY] = $hc;
	
	$hm.children().remove();
	$hs.children().remove();
	$ha.children().remove();
	$hc.children().remove();
	
	// create all the equipped items
	var equipSlots = [];
	equipSlots.push(ITEM_MELEE);
	equipSlots.push(ITEM_ARMOR);
	equipSlots.push(ITEM_ACCESSORY);
	equipSlots.push(ITEM_SHIELD);
	
	for(var i = 0; i < equipSlots.length; i++) {
		var item = inventoryHero.getEquipment(equipSlots[i]);
		if(item != null) {
			var $itemImg = $('<img src="images/items/' + item.icon + '" title="" data-pos="-1" data-isEquipped="true" data-equipSlot="'
				+ equipSlots[i] + '" data-item="' + item.id + '" />');
			
			slotHolders[equipSlots[i]].append($itemImg);
			
			$itemImg.tooltip({
				track: true,
				content: function() {
					return ITEMS[$(this).attr('data-item')].getTooltip();
				}
			});
			
			$itemImg.draggable({ containment: '#partyInventory', helper: 'clone' });
		}
	}
}

inventory.prototype.selectHero = function(heroIx) {
	inventoryHero = party.heroes[heroIx];
	this.loadEquipment();
}

var INVENTORY = new inventory();
var inventoryHero = null;

$(function() {
	$('#invItems label').droppable({
		drop: function(event, ui) {
			var newPosition = parseInt($(this).attr('data-pos'));
			if(INVENTORY.isEmpty(newPosition)) {
				var isEquipped = $(ui.draggable.context).attr('data-isEquipped');
				var equipSlot = $(ui.draggable.context).attr('data-equipSlot');
				var itemPos = $(ui.draggable.context).attr('data-pos');
				var droppedItem = null;
				
				if(isEquipped == 'true') {
					droppedItem = inventoryHero.removeEquipment(equipSlot);
				} else {
					droppedItem = INVENTORY.emptyPosition(itemPos);
				}
				
				INVENTORY.putItemInPosition(droppedItem, newPosition);
				
				var $droppedElement = $(ui.draggable.context);
				
				$droppedElement.attr('data-pos', newPosition);
				$droppedElement.attr('data-isEquipped', 'false');
				
				$droppedElement.appendTo($(this));
			}
		}
	});
	
	$('#invCurrHero label').droppable({
		drop: function(event, ui) {
			var newEquipSlot = $(this).attr('data-equipSlot');
			if(inventoryHero.getEquipment(newEquipSlot) == null) {
				var isEquipped = $(ui.draggable.context).attr('data-isEquipped');
				
				if(isEquipped == 'true')
					return; // can't drag an equipped item into an equip slot
				
				var equipSlot = $(ui.draggable.context).attr('data-equipSlot');
				
				if(equipSlot != newEquipSlot)
					return; // can't drag an inventory item into an equip slot if the item's slot type doesn't match (e.g. can't put an armor into weapon slot)
				
				// get the item position in inventory
				var itemPos = parseInt($(ui.draggable.context).attr('data-pos'));
				
				if(!inventoryHero.canEquip(INVENTORY.getItemInPosition(itemPos)))
					return; // hero can't equip it
				
				var droppedItem = INVENTORY.emptyPosition(itemPos);
				inventoryHero.equipItem(droppedItem);
				
				var $droppedElement = $(ui.draggable.context);
				
				// set its inventory slot to -1 (not in inventory)
				$droppedElement.attr('data-pos', '-1');
				// set its equipped flat to true
				$droppedElement.attr('data-isEquipped', 'true');
				
				$droppedElement.appendTo($(this));
			}
		}
	});
});