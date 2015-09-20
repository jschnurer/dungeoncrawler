var GAME_VARS = [];
var SORPIGAL_DUNGEON_QUEST = 0;
var SORPIGAL_DUNGEON_GNASHER_DOOR = 1;
var SORPIGAL_SW_GRASS_CHEST = 2;
var SORPIGAL_WW_CHEST = 3;
var SORPIGAL_ISLAND_CHEST = 4;
var SORPIGAL_TREE_CHEST = 5;
var SORPIGAL_HOUSE_CHEST = 6;
var SORPIGAL_DUNGEON_CHEST = 7;
var SORPIGAL_DUNGEON_CHEST_2 = 8;
var SORPIGAL_DUNGEON_CHEST_3 = 9;
var SORPIGAL_DUNGEON_CHEST_4 = 10;
var SORPIGAL_DUNGEON_CHEST_5 = 11;
var SORPIGAL_DUNGEON_CHEST_6 = 12;
var SORPIGAL_DUNGEON_CHEST_7 = 13;

function setGameVar(gameVar, value) {
	GAME_VARS[gameVar] = value;
}

function getGameVar(gameVar) {
	var val = GAME_VARS[gameVar];
	
	if(val == undefined)
		return 0;
	
	return val;
}