function saveLoader() {
}

saveLoader.prototype.doesSaveExist = function() {
	return $.jStorage.get('saveGame', null) != null;
}

saveLoader.prototype.load = function() {
	var savedGame = $.jStorage.get('saveGame');
	var heroes = [];
	
	for(var i = 0; i < 4; i++) {
		// recreate hero objects from the saved heroes
		heroes[i] = new hero(savedGame.party.heroes[i]);
		
		// recreate the spell objects from the saved spells
		var spells = [];
		for(var s = 0; s < heroes[i].spells.length; s++) {
			if(heroes[i].spells[s])
				spells[s] = new spell(heroes[i].spells[s]);
		}
		heroes[i].spells = spells;
	}
	
	PARTY = new party({
		experience: savedGame.party.experience,
		heroes: heroes
	});
	
	// recreate the item objects from the saved items
	var items = [];
	for(var i = 0; i < INVENTORY.maxLength; i++) {
		if(savedGame.items[i] != undefined && savedGame.items[i] != null)
			items[i] = new item(savedGame.items[i]);
		else
			items[i] = null;
	}
	INVENTORY = new inventory(items);
	
	GAME_VARS = savedGame.gameVars;
	NAV.teleportToMap(savedGame.mapId, savedGame.partyPosition.x, savedGame.partyPosition.y, savedGame.partyPosition.facing);
}

saveLoader.prototype.save = function(party, inventory, nav, gameVars) {
	var itemsToSave = [];
	for(var i = 0; i < INVENTORY.maxLength; i++) {
		itemsToSave[i] = INVENTORY.getItemInPosition(i);
		if(itemsToSave[i] == undefined)
			itemsToSave[i] = null;
	}
	
	var savedGame = {
		party: party,
		partyPosition: NAV.getPartyPosition(),
		items: itemsToSave,
		mapId: NAV.getMapId(),
		gameVars: gameVars
	};
	
	$.jStorage.set('saveGame', savedGame);
}

var SAVELOADER = new saveLoader();