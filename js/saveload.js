function saveLoader() {
}

saveLoader.prototype.doesSaveExist = function() {
	return $.jStorage.get('saveGame', null) != null;
}

saveLoader.prototype.load = function() {
	var savedGame = $.jStorage.get('saveGame');
	var heroes = savedGame.party.heroes;
	
	for(var i = 0; i < heroes.length; i++) {
		heroes[i] = new hero(heroes[i]);
	}
	
	PARTY = new party(savedGame.party);
	
	var items = savedGame.items;
	for(var i = 0; i < items.length; i++) {
		if(items[i] != undefined)
			items[i] = new item(items[i]);
		else
			items[i] = null;
	}
	INVENTORY = new inventory(items);
	
	gameVars = savedGame.gameVars;
	nav.teleportToMap(savedGame.mapId, savedGame.partyPosition.x, savedGame.partyPosition.y, savedGame.partyPosition.facing);
}

saveLoader.prototype.save = function(party, inventory, nav, gameVars) {
	var savedGame = {
		party: party,
		partyPosition: nav.getPartyPosition(),
		items: inventory.items,
		mapId: nav.getMapId(),
		gameVars: gameVars
	};
	
	$.jStorage.set('saveGame', savedGame);
}

var SAVELOADER = new saveLoader();