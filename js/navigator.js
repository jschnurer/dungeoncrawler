function navigator() {
	var self = this;
	var canvas = document.getElementById('view');
	var SCALE = 4;
	
	canvas.width = 160 * SCALE;
	canvas.height = 120 * SCALE;
	
	var ctx = canvas.getContext('2d');
	var map;
	var buffs = [];
	var partyPosition = {x:0,y:0,facing:'S'};
	
	this.backgrounds = [];
	this.backgrounds[0] = $('#IMG_BG_' + BG_NIGHTSKY)[0];
		
	this.tileSets = [];
	this.tileSets[TILE_WALL] = $('#IMG_TILE_' + TILE_WALL)[0];
	this.tileSets[TILE_PILLAR] = $('#IMG_TILE_' + TILE_PILLAR)[0];
	this.tileSets[TILE_PILLAR_BUTTON] = $('#IMG_TILE_' + TILE_PILLAR_BUTTON)[0];
	this.tileSets[TILE_FOREST] = $('#IMG_TILE_' + TILE_FOREST)[0];
	this.tileSets[TILE_FAKE_WALL] = $('#IMG_TILE_' + TILE_FAKE_WALL)[0];
	this.tileSets[TILE_DOOR] = $('#IMG_TILE_' + TILE_DOOR)[0];
	this.tileSets[TILE_EVENT_DOOR] = $('#IMG_TILE_' + TILE_EVENT_DOOR)[0];
	this.tileSets[TILE_DOOR] = $('#IMG_TILE_' + TILE_DOOR)[0];
	this.tileSets[TILE_WATER] = $('#IMG_TILE_' + TILE_WATER)[0];
	this.tileSets[TILE_FLOOR] = $('#IMG_TILE_' + TILE_FLOOR)[0];
	this.tileSets[TILE_CEILING] = $('#IMG_TILE_' + TILE_CEILING)[0];
	this.tileSets[TILE_GRASS] = $('#IMG_TILE_' + TILE_GRASS)[0];
	this.tileSets[TILE_PLACE_OF_POWER] = $('#IMG_TILE_' + TILE_PLACE_OF_POWER)[0];
	this.tileSets[TILE_CHEST] = $('#IMG_TILE_' + TILE_CHEST)[0];
	this.tileSets[TILE_WHIRLPOOL] = $('#IMG_TILE_' + TILE_WHIRLPOOL)[0];
	
	var tileDestWidth = 80 * SCALE;
	var tileDestHeight = 120 * SCALE;
	var rightSideOffset = tileDestWidth;
	
	this.hardness = [];
	this.hardness[TILE_WALL] = true;
	this.hardness[TILE_PILLAR] = true;
	this.hardness[TILE_FOREST] = true;
	this.hardness[TILE_WATER] = true;
	this.hardness[TILE_WHIRLPOOL] = true;
	this.hardness['P'] = true;
	
	this.getPartyPosition = function() {
		return partyPosition;
	}
	
	this.getMapId = function() {
		return this.map.id;
	}
	
	this.setMap = function(map) {
		this.map = map;
		this.setCombatTiles(false);
		buffs.length = 0;
	}
	
	this.setCombatTiles = function(combatComplete) {
		for(var y = 0; y < this.map.tiles.length; y++) {
			for(var x = 0; x < this.map.tiles[y].length; x++) {
				this.map.tiles[y][x].combatComplete = combatComplete;
			}
		}
	}
	
	this.teleportParty = function (x, y, facing) {
		partyPosition.x = x;
		partyPosition.y = y;
		if(facing)
			partyPosition.facing = facing;
		this.draw();
	}
	
	this.teleportToMap = function(mapId, x, y, facing) {
		self.setMap(atlas[mapId]);
		self.teleportParty(x, y, facing);
	}
	
	this.faceParty = function (dir) {
		partyPosition.facing = dir;
	}
	
	function drawTile(mapY, mapX, srcX, srcY, xOffset) {
		var y = mapY + partyPosition.y;
		var x = mapX + partyPosition.x;
		
		if(y < 0 || x < 0 || y > self.map.tiles.length - 1 || x > self.map.tiles[0].length - 1)
			return;
		
		var mapTile = self.map.tiles[y][x];
		if(mapTile == undefined)
			return;
		
		if(mapTile.tile == undefined)
			return;
		
		if(mapTile.tile == TILE_CEILING_FLOOR) {
			ctx.drawImage(self.tileSets[TILE_CEILING], srcX, srcY, 80, 120, xOffset, 0, tileDestWidth, tileDestHeight);
			ctx.drawImage(self.tileSets[TILE_FLOOR], srcX, srcY, 80, 120, xOffset, 0, tileDestWidth, tileDestHeight);
		} else {
			if(mapY == 0 && mapX == 0 && mapTile.tile == TILE_FAKE_WALL) {
				ctx.drawImage(self.tileSets[TILE_CEILING], srcX, srcY, 80, 120, xOffset, 0, tileDestWidth, tileDestHeight);
				ctx.drawImage(self.tileSets[TILE_FLOOR], srcX, srcY, 80, 120, xOffset, 0, tileDestWidth, tileDestHeight);				
			}
			
			var tileSet = self.tileSets[mapTile.tile];
		
			if(tileSet != undefined)
				ctx.drawImage(tileSet, srcX, srcY, 80, 120, xOffset, 0, tileDestWidth, tileDestHeight);
		}
		
		if(mapTile.code == 'P') {
			ctx.drawImage(self.tileSets[TILE_PLACE_OF_POWER], srcX, srcY, 80, 120, xOffset, 0, tileDestWidth, tileDestHeight);
		}
		if(getEventShowChest(x, y)) {
			ctx.drawImage(self.tileSets[TILE_CHEST], srcX, srcY, 80, 120, xOffset, 0, tileDestWidth, tileDestHeight);
		}
	}
	
	this.draw = function () {
		ctx.fillStyle="#000";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(self.backgrounds[0], 0, 0, 160, 120, 0, 0, tileDestWidth * 2, tileDestHeight);

		//////////////////////////////////////////////////////////////
		// BACK ROW
		//////////////////////////////////////////////////////////////
		
		if(partyPosition.facing == 'N')	{
			// back tiles
			drawTile(-2, -2, 0, 0, 0);
			drawTile(-2, 2, 80, 0, rightSideOffset);
			drawTile(-2, -1, 160, 0, 0);
			drawTile(-2, 1, 240, 0, rightSideOffset);
			drawTile(-2, 0, 320, 0, 0);
			drawTile(-2, 0, 400, 0, rightSideOffset);
			
			// mid tiles
			drawTile(-1, -2, 480, 0, 0);
			drawTile(-1, 2, 560, 0, rightSideOffset);
			drawTile(-1, -1, 0, 120, 0);
			drawTile(-1, 1, 80, 120, rightSideOffset);
			drawTile(-1, 0, 160, 120, 0);
			drawTile(-1, 0, 240, 120, rightSideOffset);
			
			// front tiles
			drawTile(0, -1, 320, 120, 0);
			drawTile(0, 1, 400, 120, rightSideOffset);
		} else if(partyPosition.facing == 'S') {
			// back tiles
			drawTile(2, 2, 0, 0, 0);
			drawTile(2, -2, 80, 0, rightSideOffset);
			drawTile(2, 1, 160, 0, 0);
			drawTile(2, -1, 240, 0, rightSideOffset);
			drawTile(2, 0, 320, 0, 0);
			drawTile(2, 0, 400, 0, rightSideOffset);
			
			// mid tiles
			drawTile(1, 2, 480, 0, 0);
			drawTile(1, -2, 560, 0, rightSideOffset);
			drawTile(1, 1, 0, 120, 0);
			drawTile(1, -1, 80, 120, rightSideOffset);
			drawTile(1, 0, 160, 120, 0);
			drawTile(1, 0, 240, 120, rightSideOffset);
			
			// front tiles
			drawTile(0, 1, 320, 120, 0);
			drawTile(0, -1, 400, 120, rightSideOffset);	
		} else if(partyPosition.facing == 'E') {
			// back tiles
			drawTile(-2, 2, 0, 0, 0);
			drawTile(2, 2, 80, 0, rightSideOffset);
			drawTile(-1, 2, 160, 0, 0);
			drawTile(1, 2, 240, 0, rightSideOffset);
			drawTile(0, 2, 320, 0, 0);
			drawTile(0, 2, 400, 0, rightSideOffset);
			
			// mid tiles
			drawTile(-2, 1, 480, 0, 0);
			drawTile(2, 1, 560, 0, rightSideOffset);
			drawTile(-1, 1, 0, 120, 0);
			drawTile(1, 1, 80, 120, rightSideOffset);
			drawTile(0, 1, 160, 120, 0);
			drawTile(0, 1, 240, 120, rightSideOffset);
			
			// front tiles
			drawTile(-1, 0, 320, 120, 0);
			drawTile(1, 0, 400, 120, rightSideOffset);
		} else if(partyPosition.facing == 'W') {
			// back tiles
			drawTile(2, -2, 0, 0, 0);
			drawTile(-2, -2, 80, 0, rightSideOffset);
			drawTile(1, -2, 160, 0, 0);
			drawTile(-1, -2, 240, 0, rightSideOffset);
			drawTile(0, -2, 320, 0, 0);
			drawTile(0, -2, 400, 0, rightSideOffset);
			
			// mid tiles
			drawTile(2, -1, 480, 0, 0);
			drawTile(-2, -1, 560, 0, rightSideOffset);
			drawTile(1, -1, 0, 120, 0);
			drawTile(-1, -1, 80, 120, rightSideOffset);
			drawTile(0, -1, 160, 120, 0);
			drawTile(0, -1, 240, 120, rightSideOffset);
			
			// front tiles
			drawTile(1, 0, 320, 120, 0);
			drawTile(-1, 0, 400, 120, rightSideOffset);
		}
		
		drawTile(0, 0, 480, 120, 0);
		drawTile(0, 0, 560, 120, rightSideOffset);
	}
	
	this.handleInput = function (key) {
	if (key == KEY_W || key == KEY_UP_ARROW) {
			clearText();
			move('F');
		} else if (key == KEY_S || key == KEY_DOWN_ARROW) {
			clearText();
			move('B');
		} else if (key == KEY_A || key == KEY_LEFT_ARROW) {
			clearText();
			turn('L');
		} else if (key == KEY_D || key == KEY_RIGHT_ARROW) {
			clearText();
			turn('R');
		} else if(key == KEY_SPACE) {
			clearText();
			doActivate();
		} else if(key == KEY_I) {
			INVENTORY.open(0);
		} else if(key == KEY_C) {
			SPELLBOOK.open(0, MODE_NAV);
		}
	}
	
	function move(dir) {
		var yOffset = 0;
		var xOffset = 0;
		
		if(partyPosition.facing == 'N') {
			if(dir == 'F') yOffset = -1;
			else if(dir == 'B') yOffset = 1;
			else if(dir == 'R') xOffset = 1;
			else if(dir == 'L') xOffset = -1;
		} else if(partyPosition.facing == 'S') {
			if(dir == 'F') yOffset = 1;
			else if(dir == 'B') yOffset = -1;
			else if(dir == 'R') xOffset = -1;
			else if(dir == 'L') xOffset = 1;
		} else if(partyPosition.facing == 'E') {
			if(dir == 'F') xOffset = 1;
			else if(dir == 'B') xOffset = -1;
			else if(dir == 'R') yOffset = 1;
			else if(dir == 'L') yOffset = -1;
		} else if(partyPosition.facing == 'W') {
			if(dir == 'F') xOffset = -1;
			else if(dir == 'B') xOffset = 1;
			else if(dir == 'R') yOffset = -1;
			else if(dir == 'L') yOffset = 1;
		}
		
		var otherTile = self.map.tiles[partyPosition.y + yOffset][partyPosition.x + xOffset];
		var otherTileEventHardness = getEventHardness(partyPosition.x + xOffset, partyPosition.y + yOffset);
		
		if((!self.hardness[otherTile.tile]
				|| (otherTile.tile == TILE_FOREST && PARTY.anyConsciousHeroWithSkill(SKILL_PATHFINDING))
				|| (otherTile.tile == TILE_WATER && buffs[SPELL_WATER_WALKING]))
			&& (otherTile.code != undefined && !self.hardness[otherTile.code])
			&& !otherTileEventHardness) {
			partyPosition.y += yOffset;
			partyPosition.x += xOffset;
			
			if(doTouchEventAtTile(partyPosition.x, partyPosition.y)) {
				// if it returned true that just means we do the event there.
				// this only matters if the tile is a door.
				// because a door with an event on it usually means that we teleport to a new map
			} else if(otherTile.tile == TILE_DOOR) {
				// if the tile we just stepped onto is a normal door, move the party 1 more block in the direction they moved
				// so that they move through the door
				partyPosition.y += yOffset;
				partyPosition.x += xOffset;
				// now that the party moved through the door, encounter the tile they ended up on instead
				doTouchEventAtTile(partyPosition.x, partyPosition.y);
			}
		} else {
			// encounter the event on the current tile since the party didn't move
			doTouchEventAtTile(partyPosition.x, partyPosition.y);
		}
		
		self.draw();
	}
	
	function doTouchEventAtTile(tileX, tileY) {
		var eventScript = getEventScriptAtTile(tileX, tileY, 'touch');
		if(eventScript != null) {
			eval(eventScript);
			return true;
		}
		
		return false;
	}
	
	function turn(dir) {		
		if(partyPosition.facing == 'N') {
			if(dir == 'R') partyPosition.facing = 'E';
			else if(dir == 'L') partyPosition.facing = 'W';
		} else if(partyPosition.facing == 'S') {
			if(dir == 'R') partyPosition.facing = 'W';
			else if(dir == 'L') partyPosition.facing = 'E';
		} else if(partyPosition.facing == 'E') {
			if(dir == 'R') partyPosition.facing = 'S';
			else if(dir == 'L') partyPosition.facing = 'N';
		} else if(partyPosition.facing == 'W') {
			if(dir == 'R') partyPosition.facing = 'N';
			else if(dir == 'L') partyPosition.facing = 'S';
		}
		
		doTouchEventAtTile(partyPosition.x, partyPosition.y);
		
		self.draw();
	}
	
	function getEventHardness(x, y) {
		var tile = self.map.tiles[y][x];
		if(tile != undefined
			&& tile.event != null) {
			if(tile.event.hardnessScript != ''
			&& tile.event.hardnessScript != undefined) {
				return eval(tile.event.hardnessScript);
			} else if(tile.event.isChest
				&& self.getChestGameVar(tile.event.chestGameVar) == 0) {
				return true;
			}
		} else {			
			return false;
		}
	}
	
	function getEventShowChest(x, y) {
		var tile = self.map.tiles[y][x];
		if(tile != undefined
			&& tile.event != null
			&& tile.event.isChest
			&& self.getChestGameVar(tile.event.chestGameVar) == 0) {
			return true;
		} else {
			return false;
		}
	}
	
	function getEventScriptAtTile(x, y, trigger) {
		var tile = self.map.tiles[y][x];
		if(tile != undefined
			&& tile.event != null
			&& tile.event != undefined
			&& tile.event.trigger == trigger
			&& (tile.event.facing == '*' || tile.event.facing == partyPosition.facing)) {
			return tile.event.script.replace(/\n/g, '');
		} else if(trigger == 'activate'
			&& tile.code == 'P') {
				return 'PLACEOFPOWER.open()';
		} else if(trigger == 'touch'
			&& !tile.combatComplete
			&& tile.code == 'Z'
			&& self.map.encounterGroups.length > 0) { // shortcut for a 10% fight
			if(rand(1, 10) == 5) { // why 5? why not?
				COMBAT.loadEncounterGroupAndBeginCombat(getRandomItem(self.map.encounterGroups));
				tile.combatComplete = true;
			}
			return true;
		} else if(trigger == 'touch'
			&& !tile.combatComplete
			&& tile.code == 'X'
			&& self.map.encounterGroups.length > 0) { // shortcut for a 100% fight
			COMBAT.loadEncounterGroupAndBeginCombat(getRandomItem(self.map.encounterGroups));
			tile.combatComplete = true;
			return true;
		}
		
		return null;
	}
	
	this.getChestGameVar = function (eventChestGameVarString) {
		return getGameVar(window[eventChestGameVarString]);
	}
	
	function handleChestActivateAtTile(x, y) {
		var tile = self.map.tiles[y][x];
		if(tile == null
			|| tile == undefined
			|| tile.event == null
			|| tile.event == undefined
			|| !tile.event.isChest)
			return false;
			
		if(self.getChestGameVar(tile.event.chestGameVar) != 0)
			return false;
		
		if(tile.event.chestItem != undefined && tile.event.chestItem != null && tile.event.chestItem != '') {
			if(INVENTORY.gainItem(ITEMS[window[tile.event.chestItem]], true)) {
				showText('You find ' + ITEMS[window[tile.event.chestItem]].name + '.');
				setGameVar(window[tile.event.chestGameVar], 1);
				self.draw();
			} else {
				showText('You find ' + ITEMS[window[tile.event.chestItem]].name + ' but have no room to carry it.');
			}
		} else if(tile.event.chestEssence != undefined && tile.event.chestEssence != null) {
			PARTY.gainExperience(parseInt(tile.event.chestEssence));
			setGameVar(window[tile.event.chestGameVar], 1);
			showText('The party gains ' + tile.event.chestEssence + ' essence.');
			self.draw();
		}
	}
	
	function doActivate() {
		var x = partyPosition.x;
		var y = partyPosition.y;
		
		if(handleChestActivateAtTile(x, y))
			return;
		
		var thisTilesEventScript = getEventScriptAtTile(x, y, 'activate');
		if(thisTilesEventScript != null) {
			if(!eval(thisTilesEventScript))
				return;
		}
				
		var nextTilesEventScript = null;
		if(partyPosition.facing == 'N') {
			if(handleChestActivateAtTile(x, y-1))
				return;
			nextTilesEventScript = getEventScriptAtTile(x, y-1, 'activate');
		} else if(partyPosition.facing == 'S') {
			if(handleChestActivateAtTile(x, y+1))
				return;
			nextTilesEventScript = getEventScriptAtTile(x, y+1, 'activate');
		} else if(partyPosition.facing == 'E') {
			if(handleChestActivateAtTile(x, x+1))
				return;
			nextTilesEventScript = getEventScriptAtTile(x+1, y, 'activate');
		} else if(partyPosition.facing == 'W') {
			if(handleChestActivateAtTile(x-1, y))
				return;
			nextTilesEventScript = getEventScriptAtTile(x-1, y, 'activate');
		}
		
		if(nextTilesEventScript != null) {
			eval(nextTilesEventScript);
			return;
		}
	}
	
	this.heroCastsAtParty = function (casting, castingHero) {
		buffs[casting.spellId] = true;
	}
}