var GAME_VARS = [];
var SORPIGAL_DUNGEON_QUEST = 0;
var SORPIGAL_DUNGEON_GNASHER_DOOR = 1;

function setGameVar(gameVar, value) {
	GAME_VARS[gameVar] = value;
}

function getGameVar(gameVar) {
	var val = GAME_VARS[gameVar];
	
	if(val == undefined)
		return 0;
	
	return val;
}