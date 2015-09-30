var currentCell = { x:0, y:0 };
var KEY_W = 87;
var KEY_A = 65;
var KEY_S = 83;
var KEY_D = 68;
var KEY_R = 82;
var KEY_ESC = 27;
var KEY_ARROW_UP = 38;
var KEY_ARROW_DOWN = 40;
var KEY_ARROW_LEFT = 37;
var KEY_ARROW_RIGHT = 39;
var KEY_DELETE = 46;
var KEY_NUM_0 = 96;
var KEY_Q = 81;
var KEY_E = 69;
var KEY_0 = 48;
var KEY_1 = 49;
var KEY_2 = 50;
var KEY_3 = 51;
var KEY_4 = 52;
var KEY_5 = 53;
var KEY_6 = 54;
var KEY_7 = 55;
var KEY_8 = 56;
var KEY_9 = 57;
var KEY_O = 79;
var KEY_P = 80;
var KEY_TILDE = 192;
var KEY_F = 70;
var KEY_C = 67;
var KEY_B = 66;
var KEY_G = 71;
var KEY_X = 88;
var KEY_Z = 90;
var KEY_D = 68;

var arrowKeys = [KEY_ARROW_UP, KEY_ARROW_DOWN, KEY_ARROW_LEFT, KEY_ARROW_RIGHT];
var tileKeys = [];
tileKeys[KEY_1] = 'wall';
tileKeys[KEY_2] = 'door';
tileKeys[KEY_3] = 'fake';
tileKeys[KEY_4] = 'house';
tileKeys[KEY_5] = 'forest';
tileKeys[KEY_6] = 'mountain';
tileKeys[KEY_7] = 'water';
tileKeys[KEY_P] = 'pillar';
tileKeys[KEY_O] = 'pillar_button';
tileKeys[KEY_F] = 'floor';
tileKeys[KEY_C] = 'ceiling';
tileKeys[KEY_B] = 'floor_ceiling';
tileKeys[KEY_G] = 'grass';
tileKeys[KEY_R] = 'whirlpool';
tileKeys[KEY_D] = 'dirt';

var mapWidth = 32;
var mapHeight = 32;

var eventPopupOpen = false;

$(function () {	
	$('#save').click(save);
	$('#load').click(load);
	$('#saveEvent').click(saveEvent);
	$('#deleteEvent').click(deleteEvent);
	$('#cancelEvent').click(cancelEvent);
	
	// build a 32 x 32 grid
	var tbl = $('#map');
	for(var i = 0; i < mapHeight; i++) {
		var $row = $('<tr>');
		for(var j = 0; j < mapWidth; j++) {
			$row.append('<td data-x="' + j + '" data-y="' + i + '">');
		}
		tbl.append($row);
	}
	
	moveCursor(0,0);
	
	$('#map tr td').click(function() {
		setCursor(parseInt($(this).attr('data-x')), parseInt($(this).attr('data-y')));
	});
	
	for(var i = 0; i < atlas.length; i++){
		$('#ddMap').append($('<option value="' + atlas[i].id + '">' + atlas[i].name + '</option>'));
	}
});

$(document).keydown(function(e) {
	console.log(e.which);
	
	if(e.which == KEY_ESC && eventPopupOpen){
		$('#eventPopup').hide();
		return;
	}
	
	if (e.target.tagName.toLowerCase() == 'input' ||
        e.target.tagName.toLowerCase() == 'textarea') {
		return;
	}

	if(e.altKey) {
		getCurrentCell().html(String.fromCharCode(e.which));
		e.preventDefault();
		return;
	}
	
	if(e.which == KEY_E) {
		handleEventPopup();
		return;
	}
	
	if(e.which == KEY_DELETE || e.which == KEY_TILDE) {
		var hasEvent = getCurrentCell().hasClass('eventCell');
		
		getCurrentCell().removeClass();
		if(hasEvent)
			getCurrentCell().addClass('eventCell');
		getCurrentCell().prop('data-tile', null);
		moveCursor(0,0);
		e.preventDefault();
		return;
	}
	
    var xOffset = 0;
	var yOffset = 0;

	if(e.which == KEY_ARROW_UP) yOffset = -1;
	else if(e.which == KEY_ARROW_LEFT) xOffset = -1;
	else if(e.which == KEY_ARROW_DOWN) yOffset = 1;
	else if(e.which == KEY_ARROW_RIGHT) xOffset = 1;

	if(xOffset != 0 || yOffset != 0) {
		moveCursor(xOffset, yOffset);
		e.preventDefault();
		return;
	}
	
	if(tileKeys[e.which] !== undefined) {
		var cell = getCurrentCell();
		var hasEvent = cell.hasClass('eventCell');
		cell.removeClass();
		if(hasEvent)
			cell.addClass('eventCell');
		cell.addClass(tileKeys[e.which] + ' selectedCell');
		cell.prop('data-tile', e.which);
		e.preventDefault();
		return;
	}
});

function moveCursor(x, y) {
	getCurrentCell().removeClass('selectedCell');
	currentCell.x += x;
	currentCell.y += y;
	
	if(currentCell.x > mapWidth - 1) currentCell.x = mapWidth - 1;
	if(currentCell.y > mapHeight - 1) currentCell.y = mapHeight - 1;
	if(currentCell.x < 0) currentCell.x = 0;
	if(currentCell.y < 0) currentCell.y = 0;
	
	getCurrentCell().addClass('selectedCell');
	$('#currCellDisplay').html(currentCell.x + ', ' + currentCell.y);
}

function setCursor(x, y) {
	getCurrentCell().removeClass('selectedCell');
	currentCell.x = x;
	currentCell.y = y;
	getCurrentCell().addClass('selectedCell');
	$('#currCellDisplay').html(currentCell.x + ', ' + currentCell.y);
}

function getCurrentCell() {
	return $('#map tr:nth-child(' + (currentCell.y + 1) + ') td:nth-child(' + (currentCell.x + 1) + ')');
}

function save() {
	var rowCount = $('#map tr').length;
	var cellCount = $('#map tr:first td').length;
	
	var tiles = [];
	
	for(var y = 0; y < rowCount; y++) {
		var row = [];
		tiles.push(row);
		
		for(var x = 0; x < cellCount; x++) {
			var tcell = $('#map tr:nth-child(' + (y+1) + ') td:nth-child(' + (x+1) + ')');
			
			var cell = {};
			
			cell.event = jQuery.data(tcell[0], 'event');
			cell.tile = tcell.prop('data-tile');
			cell.code = tcell.html();
			
			row.push(cell);
		}
	}
	
	var map = {};
	map.name = $('#name').val();
	map.id = $('#mapId').val();
	map.background = $('#background').val();
	map.isDark = $('input[name=isDark]:checked').val();
	map.tiles = tiles;
	
	var encounterGroups = [];
	var ec = $('#encounterGroups').val().split('\n');
	for(var i = 0; i < ec.length; i++) {
		var g = ec[i].replace(/\s+/g, '');
		if(g != '') {
			encounterGroups.push(g.split(','));
		}
	}
	map.encounterGroups = encounterGroups;
	
	$('#saveTo').val(JSON.stringify(map));
}

function load() {
	
	loadMap(atlas[$('#ddMap').val()]);
}

function loadMap(json) {
	//var map = JSON.parse(json);
	var map = json;
	$('#name').val(map.name);
	$('#mapId').val(map.id);
	$('#background').val(map.background);
	$('input[name=isDark]').val([map.isDark]);
	
	$('td').removeClass();
	
	var rowCount = $('#map tr').length;
	var cellCount = $('#map tr:first td').length;
		
	for(var y = 0; y < rowCount; y++) {		
		for(var x = 0; x < cellCount; x++) {
			var tcell = $('#map tr:nth-child(' + (y+1) + ') td:nth-child(' + (x+1) + ')');
			tcell.removeClass();
			
			jQuery.data(tcell[0], 'event', null);
			
			var cell = map.tiles[y][x];
			
			if(cell.tile) {
				tcell.addClass(tileKeys[cell.tile]);
				tcell.prop('data-tile', cell.tile);
			}
			
			if(cell.event != null && cell.event != undefined) {
				jQuery.data(tcell[0], 'event', cell.event);
				tcell.addClass('eventCell');
			}
				
			tcell.html(cell.code);
		}
	}
	
	$('#encounterGroups').val('');
	
	if(map.encounterGroups != undefined && map.encounterGroups != null) {
		for(var i = 0; i < map.encounterGroups.length; i++) {
			var groupString = '';
			for(var m = 0; m < map.encounterGroups[i].length; m++) {
				groupString += ',' + map.encounterGroups[i][m];
			}
			if(groupString != '') {
				if($('#encounterGroups').val() != '') {
					$('#encounterGroups').val($('#encounterGroups').val() + '\n' + groupString.substr(1));
				} else {
					$('#encounterGroups').val(groupString.substr(1));
				}
			}
		}
	}
	
	currentCell.x = 0;
	currentCell.y = 0;
	moveCursor(0, 0);
}

var currentEventX = null;
var currentEventY = null;

function handleEventPopup() {
	$('#eventPopup').show();
	eventPopupOpen = true;
	
	$('#eventIsChest').attr('checked', false);
	$('#eventChestItem').val('');
	$('#eventChestEssence').val('');
	$('#eventChestGameVar').val('');
	
	$('#eventTrigger').val('touch');
	$('#eventFacing').val('*');
	$('#eventScript').val('');
	$('#eventHardnessScript').val('');
	$('#eventShowChestScript').val('');
	
	var cell = getCurrentCell()[0];
	
	var existingEvent = jQuery.data(cell, 'event');
	
	if(existingEvent != undefined && existingEvent != null) {
		if(existingEvent.isChest) {
			$('#eventIsChest').prop('checked', true);
			$('#eventChestItem').val(existingEvent.chestItem);
			$('#eventChestEssence').val(existingEvent.chestEssence);
			$('#eventChestGameVar').val(existingEvent.chestGameVar);
		} else {
			$('#eventTrigger').val(existingEvent.trigger);
			$('#eventFacing').val(existingEvent.facing);
			$('#eventScript').val(existingEvent.script);
			$('#eventHardnessScript').val(existingEvent.hardnessScript);
			$('#eventShowChestScript').val(existingEvent.showChestScript);
		}
	}
	
	currentEventX = currentCell.x;
	currentEventY = currentCell.y;
}

function saveEvent() {	
	var cell = $('#map tr:nth-child(' + (currentEventY + 1) + ') td:nth-child(' + (currentEventX + 1) + ')')[0];
	var existingEvent = jQuery.data(cell, 'event');
	
	if(existingEvent == null || existingEvent == undefined) {
		var existingEvent = {};
	}
	
	existingEvent.x = currentEventX;
	existingEvent.y = currentEventY;
	
	if($('#eventIsChest').is(':checked')) {
		existingEvent.isChest = true;
		existingEvent.chestItem = $('#eventChestItem').val();
		existingEvent.chestEssence = $('#eventChestEssence').val();
		existingEvent.chestGameVar = $('#eventChestGameVar').val();
		
		existingEvent.trigger = undefined;
		existingEvent.facing = undefined;
		existingEvent.script = undefined;
		existingEvent.hardnessScript = undefined;
		existingEvent.showChestScript = undefined;
	} else {
		existingEvent.isChest = false;
		existingEvent.chestItem = undefined;
		existingEvent.chestEssence = undefined;
		existingEvent.chestGameVar = undefined;
		
		existingEvent.trigger = $('#eventTrigger').val();
		existingEvent.facing = $('#eventFacing').val();
		existingEvent.script = $('#eventScript').val();
		existingEvent.hardnessScript = $('#eventHardnessScript').val();
		existingEvent.showChestScript = $('#eventShowChestScript').val();
	}
	
	jQuery.data(cell, 'event', existingEvent);
	$(cell).addClass('eventCell');
	$('#eventPopup').hide();
}

function cancelEvent() {
	$('#eventPopup').hide();
}

function deleteEvent() {
	var cell = $('#map tr:nth-child(' + (currentEventY + 1) + ') td:nth-child(' + (currentEventX + 1) + ')')[0];
	$(cell).removeClass('eventCell');
	jQuery.removeData(cell, 'event');
	$('#eventPopup').hide();
}