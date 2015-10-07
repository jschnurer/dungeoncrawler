function saveLoader() {
}

saveLoader.prototype.doesSaveExist = function() {
	return $.jStorage.get('saveGame', null) != null;
}

saveLoader.prototype.load = function() {
	var savedGame = $.jStorage.get('saveGame');
	var heroes = [];
	
	for(var i = 0; i < savedGame.heroes.length; i++)
		heroes[i] = new hero(savedGame.heroes[i]);
	
	PARTY = new party({
		experience: savedGame.experience,
		heroes: heroes
	});
	
	// recreate the item objects from the saved items
	var items = [];
	for(var i = 0; i < INVENTORY.maxLength; i++) {
		if(savedGame.inventory[i] != undefined && savedGame.inventory[i] != null)
			items[i] = ITEMS[savedGame.inventory[i]].clone();
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
		if(INVENTORY.getItemInPosition(i) != undefined && INVENTORY.getItemInPosition(i) != null)
			itemsToSave[i] = INVENTORY.getItemInPosition(i).id;
		if(itemsToSave[i] == undefined)
			itemsToSave[i] = null;
	}
	
	var h = [];
	for(var i = 0; i < PARTY.heroes.length; i++) {
		var hero = PARTY.heroes[i];
		var spells = [];
		var equip = [];
		
		for(var s = 0; s < hero.spells.length; s++) {
			if(hero.spells[s] != undefined && hero.spells[s] != null)
				spells[s] = hero.spells[s].id;
		}
		
		for(var e = 0; e < hero.equipment.length; e++) {
			if(hero.equipment[e] != undefined && hero.equipment[e] != null)
				equip[e] = hero.equipment[e].id;
		}
		
		h[i] = {
			num: hero.num,
			portrait: hero.portrait,
			name: hero.name,
			gender: hero.gender,
			charClass: hero.charClass,
			level: hero.level,
			stats: hero.stats,
			mana: hero.mana,
			maxMana: hero.maxMana,
			life: hero.life,
			maxLife: hero.maxLife,
			resistances: hero.resistances,
			skills: hero.skills,
			spells: spells,
			equipment: equip
		};
	}
	
	var savedGame = {
		experience: PARTY.experience,
		heroes: h,
		partyPosition: NAV.getPartyPosition(),
		inventory: itemsToSave,
		mapId: NAV.getMapId(),
		gameVars: gameVars
	};
	
	$.jStorage.set('saveGame', savedGame);
}

var SAVELOADER = new saveLoader();










