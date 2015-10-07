function inventory(items) {
	if(items == undefined) {
		this.items.length = 0;
		return;
	}
	
	this.items = items;
}

inventory.prototype.handleInput = function (e) {
	if(this.castingScroll) {
		if(e.which == KEY_ESC) {
			this.castingScroll = false;
			this.$castingScrollElement = null;
			$('#scrollTargeting').hide();
		} else if(e.which == KEY_1) {
			this.castScroll(PARTY.heroes[0]);
		} else if(e.which == KEY_2) {
			this.castScroll(PARTY.heroes[1]);
		} else if(e.which == KEY_3) {
			this.castScroll(PARTY.heroes[2]);
		} else if(e.which == KEY_4) {
			this.castScroll(PARTY.heroes[3]);
		}
	} else {
		if(e.which == KEY_I || e.which == KEY_ESC) {
			this.close();
		} else if(e.which == KEY_1 && this.selectedHero.num != 1) {
			this.selectHero(0);
		} else if(e.which == KEY_2 && this.selectedHero.num != 2) {
			this.selectHero(1);
		} else if(e.which == KEY_3 && this.selectedHero.num != 3) {
			this.selectHero(2);
		} else if(e.which == KEY_4 && this.selectedHero.num != 4) {
			this.selectHero(3);
		}
	}
}
inventory.prototype.maxLength = 45;
inventory.prototype.items = [];
inventory.prototype.gainItem = function (item, cloneItem, drawAfterGain) {
	for(var i = 0; i < this.maxLength; i++) {
		if(this.items[i] == undefined || this.items[i] == null) {
			if(cloneItem)
				this.items[i] = item.clone();
			else
				this.items[i] = item;
			
			if(drawAfterGain) {
				this.createElementInSlot(this.items[i], i);
			}
			
			return true;
		}
	}
	
	return false;
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
	if(!this.storeMode && !this.isCombat)
		GAME_MODE = MODE_NAV;
	
	if(PARTY.anyConsciousHeroWithSkill(SKILL_DIRECTION_SENSE))
		$('#compass').show();
	
	// the only time this will ever matter is if the hero is in a dark map
	// and they do not have a light buff active and they just equipped or
	// unequipped a torch.
	NAV.draw();
}
inventory.prototype.open = function (heroIx, storeMode, isCombat) {
	this.storeMode = storeMode;
	this.isCombat = isCombat;
	
	$('#compass').hide();
	
	if(!this.storeMode)
		GAME_MODE = MODE_INVENTORY;
	
	this.selectedHero = PARTY.heroes[heroIx];
	
	$('#partyInventory').show();
	
	// create all the items in the inventory
	for(var i = 0; i < this.maxLength; i++) {
		if(this.items[i] != null) {
			this.createElementInSlot(this.items[i], i);
		}
	}
	
	this.loadEquipment();
}

inventory.prototype.createElementInSlot = function (item, slotIx) {
	var $itemImg = $('<img src="images/items/' + item.icon + '" title="" data-pos="' + slotIx + '" data-isEquipped="false" data-equipSlot="' + item.type + '" data-item="' + item.id + '" />');
	$('#invItems label:nth-child(' + (slotIx + 1) + ')').append($itemImg);
	$itemImg.tooltip({
		track: true,
		content: function() {
			return ITEMS[$(this).attr('data-item')].getTooltip();
		}
	});
	
	$itemImg.draggable({ helper: 'clone' });
	$itemImg.click(function() { INVENTORY.useItem($(this)); });
}

inventory.prototype.castScroll = function(targetHero, targetMonster) {
	if(!this.castingScroll)
		return;
	
	// destroy the item
	var itemPos = parseInt(this.$castingScrollElement.attr('data-pos'));
	destroyedItem = INVENTORY.emptyPosition(itemPos);
	this.$castingScrollElement.remove();
	
	var spell = SPELLS[destroyedItem.spell];
	var casting = spell.getCasting(null, null, destroyedItem.castPower, this.selectedHero.num);
	
	log(this.selectedHero.name + ' casts ' + spell.name);
	
	if(targetHero) {
		targetHero.receiveCasting(casting);
		if(this.isCombat) {
			COMBAT.finishTurn();
		}
	} else if(targetMonster) {
		// TODO: cast at monsters?
	}
	
	this.castingScroll = false;
	$('#scrollTargeting').hide();
	this.close();
}

inventory.prototype.useItem = function($itemElement) {
	var itemId = $itemElement.attr('data-item');
	var item = ITEMS[itemId];
	if(item.type != ITEM_SCROLL && item.type != ITEM_TOME)
		return;
	
	var spell = SPELLS[item.spell];
	
	if(item.type == ITEM_SCROLL) {
		if(spell.mode == SPELL_MODE_COMBAT && !this.isCombat) {
			log(spell.name + ' can only be cast in combat!');
			return;
		} else if(spell.mode == SPELL_MODE_NAV && this.isCombat) {
			log(spell.name + ' cannot be cast in combat!');
			return;
		}
		
		// todo: implement other target types?
		if(spell.target == TARGET_PARTY) {
			log(this.selectedHero.name + ' casts ' + spell.name);
			NAV.heroCastsAtParty(spell.getCasting(null, null, item.castPower, this.selectedHero.num), this.selectedHero);
		} else if(spell.target == TARGET_SINGLE_HERO) {
			$('#scrollTargeting').html('Cast ' + spell.name + ' on which hero? (1-4 or ESC to cancel)');
			$('#scrollTargeting').show();
			this.castingScroll = true;
			this.$castingScrollElement = $itemElement;
		}
	} else if(item.type == ITEM_TOME) {		
		if(!this.selectedHero.canLearnSpell(spell)) {
			log(this.selectedHero.name + ' does not meet the requirements to learn ' + spell.name + '.');
			return;
		}
		
		if(this.selectedHero.knowsSpell(spell)) {
			log(this.selectedHero.name + ' already knows ' + spell.name + '.');
			return;
		}
		
		this.selectedHero.learnSpell(spell);
		log(this.selectedHero.name + ' learns ' + spell.name + '.');
		
		// destroy the item
		var itemPos = parseInt($itemElement.attr('data-pos'));
		destroyedItem = INVENTORY.emptyPosition(itemPos);
		$itemElement.remove();
	}
}

inventory.prototype.loadEquipment = function() {
	$('#invCurrHero label img').remove();
	
	$('#invHeroName').html(this.selectedHero.name);
	
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
		var item = this.selectedHero.getEquipment(equipSlots[i]);
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
			
			$itemImg.draggable({ helper: 'clone' });
		}
	}
}

inventory.prototype.selectHero = function(heroIx) {
	if(this.castingScroll) {
		this.castScroll(PARTY.heroes[heroIx]);
		return;
	}
		
	this.selectedHero = PARTY.heroes[heroIx];
	this.loadEquipment();
}

inventory.prototype.selectedHero = null;

var INVENTORY = new inventory();

$(function() {
	$('#inventory').click(function() {
		if(GAME_MODE == MODE_NAV) {
			INVENTORY.open(0);
		} else if(GAME_MODE == MODE_INVENTORY) {
			INVENTORY.close();
		}
	});
	
	$('#invItems label').droppable({
		drop: function(event, ui) {
			var newPosition = parseInt($(this).attr('data-pos'));
			if(INVENTORY.isEmpty(newPosition)) {
				var isEquipped = $(ui.draggable.context).attr('data-isEquipped');
				var equipSlot = $(ui.draggable.context).attr('data-equipSlot');
				var itemPos = $(ui.draggable.context).attr('data-pos');
				var droppedItem = null;
				
				if(isEquipped == 'true') {
					droppedItem = INVENTORY.selectedHero.removeEquipment(equipSlot);
					$(ui.draggable.context).attr('data-isEquipped', 'false');
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
			var isTrash = $(this).attr('data-isTrash');
			if(isTrash) {
				var isEquipped = $(ui.draggable.context).attr('data-isEquipped');
				var destroyedItem = null;
				var alreadyLogged = false;
				if(isEquipped == 'true') {
					// unequip and destroy
					var equipSlot = $(ui.draggable.context).attr('data-equipSlot');
					destroyedItem = INVENTORY.selectedHero.removeEquipment(equipSlot);
					
					if(destroyedItem.id == ITEM_CLOTHES) {
						log(INVENTORY.selectedHero.name + ' takes off ' + INVENTORY.selectedHero.ownershipPronoun + ' clothing and discards it... <span style="font-size:1.25em">&#865;&#176; &#860;&#662; &#865;&#176;</span>');
						alreadyLogged = true;
					}
				} else {
					// get the item position in inventory
					var itemPos = parseInt($(ui.draggable.context).attr('data-pos'));
					destroyedItem = INVENTORY.emptyPosition(itemPos);
				}
				
				if(!alreadyLogged)
					log(destroyedItem.name + ' was discarded.');
				
				var $droppedElement = $(ui.draggable.context);
				$droppedElement.remove();
				return;
			}
			
			var newEquipSlot = $(this).attr('data-equipSlot');
			if(INVENTORY.selectedHero.getEquipment(newEquipSlot) == null) {
				var isEquipped = $(ui.draggable.context).attr('data-isEquipped');
				
				if(isEquipped == 'true')
					return; // can't drag an equipped item into an equip slot
				
				var equipSlot = $(ui.draggable.context).attr('data-equipSlot');
				
				if(equipSlot != newEquipSlot)
					return; // can't drag an inventory item into an equip slot if the item's slot type doesn't match (e.g. can't put an armor into weapon slot)
				
				// get the item position in inventory
				var itemPos = parseInt($(ui.draggable.context).attr('data-pos'));
				
				if(!INVENTORY.selectedHero.canEquip(INVENTORY.getItemInPosition(itemPos)))
					return; // hero can't equip it
				
				var droppedItem = INVENTORY.emptyPosition(itemPos);
				INVENTORY.selectedHero.equipItem(droppedItem);
				
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