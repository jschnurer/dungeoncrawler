function navigator() {
	var self = this;
	var canvas = document.getElementById('view');
	var SCALE = 4;
	
	canvas.width = 160 * SCALE;
	canvas.height = 120 * SCALE;
	
	var ctx = canvas.getContext('2d');
	var map;
	var partyPosition = {x:0,y:0,facing:'S'};
	
	this.backgrounds = [];
	this.backgrounds[0] = new Image();
	this.backgrounds[0].src = 'images/backgrounds/nightsky.png';
		
	this.tileSets = [];
	this.tileSets[TILE_WALL] = 'dungeon_wall.png';
	this.tileSets[TILE_PILLAR] = 'pillar_interior.png';
	this.tileSets[TILE_FOREST] = 'tree_evergreen.png';
	this.tileSets[TILE_FAKE_WALL] = 'dungeon_wall.png';
	this.tileSets[TILE_DOOR] = 'dungeon_door.png';
	this.tileSets[TILE_EVENT_DOOR] = 'dungeon_door.png';
	this.tileSets[TILE_DOOR] = 'dungeon_door.png';
	this.tileSets[TILE_WATER] = 'water.png';
	this.tileSets[TILE_FLOOR] = 'dungeon_floor.png';
	this.tileSets[TILE_CEILING] = 'dungeon_ceiling.png';
	this.tileSets[TILE_GRASS] = 'grass.png';
	
	for(var key in this.tileSets) {
		var img = new Image();
		img.src = 'images/tiles/' + this.tileSets[key];
		this.tileSets[key] = img;
	}
	
	var tileDestWidth = 80 * SCALE;
	var tileDestHeight = 120 * SCALE;
	var rightSideOffset = tileDestWidth;
	
	this.hardness = [];
	this.hardness[TILE_WALL] = true;
	this.hardness[TILE_PILLAR] = true;
	this.hardness[TILE_FOREST] = true;
	this.hardness[TILE_WATER] = true;
	
	this.events = [];
	
	this.setMap = function(map) {
		this.map = map;
		this.events.length = 0;
		
		if(map.events != undefined && map.events != null) {
			var splitUpEvents = map.events.split('\n');
			for(var i = 0; i < splitUpEvents.length; i++) {
				var eventData = splitUpEvents[i].split(':');
				var eventCoords = this.getCoordinatesByCode(eventData[0]);
				if (eventCoords != null) {
					this.parseAndSaveEvent(eventData[1], eventData[2], eventCoords);
				}
			}
		}
	}
	
	this.parseAndSaveEvent = function (trigger, data, coords) {
		if(data.indexOf('teleport') == 0) {
			var teleportData = data.split('|')[1].split(',');
			var event = {
				x: coords.x,
				y: coords.y,
				trigger: trigger,
				method: function () {
					self.teleportParty(parseInt(teleportData[0]),
						parseInt(teleportData[1]),
						teleportData[2]);
				}
			};
			this.events.push(event);
		}
	}
	
	this.getEvent = function (trigger, x, y) {
		for(var i = 0; i < this.events.length; i++) {
			if (this.events[i].x == x && this.events[i].y == y && this.events[i].trigger == this.events[i].trigger) {
				return this.events[i];
			}
		}
	}
	
	this.getCoordinatesByCode = function (code) {
		for(var y = 0; y < this.map.tiles.length; y++) {
			for(var x = 0; x < this.map.tiles[y].length; x++) {
				if(this.map.tiles[y][x].code == code)
					return { x: x, y: y };
			}
		}
		
		return null;
	}
	
	this.teleportParty = function (x, y, facing) {
		partyPosition.x = x;
		partyPosition.y = y;
		if(facing)
			partyPosition.facing = facing;
		this.draw();
	}
	
	this.faceParty = function (dir) {
		partyPosition.facing = dir;
	}
	
	function drawTile(mapY, mapX, srcX, srcY, xOffset) {
		var y = mapY + partyPosition.y;
		var x = mapX + partyPosition.x;
		
		if(y < 0 || x < 0 || y > self.map.tiles.length || x > self.map.tiles[0].length)
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
			var tileSet = self.tileSets[mapTile.tile];
		
			if(tileSet != undefined)
				ctx.drawImage(tileSet, srcX, srcY, 80, 120, xOffset, 0, tileDestWidth, tileDestHeight);
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
		if (key == KEY_W) {
			clearText();
			move('F');
		} else if (key == KEY_S) {
			clearText();
			move('B');
		} else if (key == KEY_A) {
			clearText();
			turn('L');
		} else if (key == KEY_D) {
			clearText();
			turn('R');
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
		
		var otherTile = self.map.tiles[partyPosition.y + yOffset][partyPosition.x + xOffset]
		if(!self.hardness[otherTile.tile]) {
			partyPosition.y += yOffset;
			partyPosition.x += xOffset;
			
			var evt = self.getEvent('touch', partyPosition.x, partyPosition.y);
			if(evt != null) {
				evt.method();
			} else if(otherTile.tile == TILE_DOOR) {
				// if the tile we just stepped onto is a normal door, move the party 1 more block in the direction they moved
				// so that they move through the door
				partyPosition.y += yOffset;
				partyPosition.x += xOffset;
			}
		}
		
		console.log(partyPosition);
		
		self.draw();
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
		
		console.log(partyPosition);
		
		self.draw();
	}
}