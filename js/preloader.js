/*
	preloader was obtained from http://codepen.io/MrHill/pen/avKfz
*/

var preloadImages = [{t:'t',k:TILE_WALL,u:'images/tiles/dungeon_wall.png'},
	{t:'t',k:TILE_PILLAR,u:'images/tiles/pillar_interior.png'},
	{t:'t',k:TILE_MASK_DUNGEON_BUTTON,u:'images/tiles/dungeon_button_mask.png'},
	{t:'t',k:TILE_FOREST,u:'images/tiles/tree_evergreen.png'},
	{t:'t',k:TILE_FAKE_WALL,u:'images/tiles/dungeon_wall.png'},
	{t:'t',k:TILE_DOOR,u:'images/tiles/dungeon_door.png'},
	{t:'t',k:TILE_WATER,u:'images/tiles/water.png'},
	{t:'t',k:TILE_FLOOR,u:'images/tiles/dungeon_floor.png'},
	{t:'t',k:TILE_CEILING,u:'images/tiles/dungeon_ceiling.png'},
	{t:'t',k:TILE_GRASS,u:'images/tiles/grass.png'},
	{t:'t',k:TILE_DIRT,u:'images/tiles/dirt.png'},
	{t:'t',k:TILE_MASK_PLACE_OF_POWER,u:'images/tiles/place_of_power.png'},
	{t:'t',k:TILE_MASK_CHEST,u:'images/tiles/chest.png'},
	{t:'t',k:TILE_WHIRLPOOL,u:'images/tiles/whirlpool.png'},
	{t:'t',k:TILE_MASK_TOWN,u:'images/tiles/city_tile.png'},
	{t:'t',k:TILE_MASK_TABLE,u:'images/tiles/table.png'},
	{t:'t',k:TILE_MOUNTAIN,u:'images/tiles/mountain.png'},
	{t:'t',k:TILE_MASK_CAVE_ENTRANCE,u:'images/tiles/cave_entrance_mask.png'},
	{t:'b',k:BG_NIGHTSKY,u:'images/backgrounds/nightsky.png'},
	{t:'b',k:BG_BLACK,u:'images/backgrounds/black.png'}];

function queueItemsForPreload() {
	for(var i = 0; i < ITEMS.length; i++) {
		preloadImages.push({t:'i',k:ITEMS[i].id,u:'images/items/'+ITEMS[i].icon});
	}
}

function queueSpellsForPreload() {
	for(var i = 0; i < SPELLS.length; i++) {
		preloadImages.push({t:'i',k:SPELLS[i].id,u:'images/spells/'+SPELLS[i].icon});
	}
}
	
// Stripes interval
var stripesAnim;
var calcPercent;

/* WHEN LOADED */
$(window).load(function() {
	loaded = true;
	$progress.animate({
		width: "100%"
	}, 100, function() {
		$('#loadedMessage').text('Loaded!').addClass('loaded');
		$percent.text('100%');
		clearInterval(calcPercent);
		clearInterval(stripesAnim);
		beginGame();
	});
});

/*** FUNCTIONS ***/

/* LOADING */
function preload(imgArray) {
	var increment = Math.floor(100 / imgArray.length);
	
	$(imgArray).each(function() {
		var t = this.t; // type
		var k = this.k; // key
		var u = this.u; // url
		
		$('<img>').attr("src", this.u).load(function() {
			$progress.animate({
				width: "+=" + increment + "%"
			}, 100);
			
			if(t == 't')
				NAV.setTile(k, $(this)[0]);
			else if(t == 'b')
				NAV.setBG(k, $(this)[0]);
		});
	});
	
	calcPercent = setInterval(function() {
		//loop through the items
		var p = Math.floor(($progress.width() / $('.loader').width()) * 100);
		$percent.text(p + '%');
		if(p >= 60)
			$('#loadedMessage').html('Mumbling incantations...');
		else if(p >= 30)
			$('#loadedMessage').html('Etching black geometries...');
	});
}

/* STRIPES ANIMATION */
function stripesAnimate() {
	animating();
	stripesAnim = setInterval(animating, 2500);
}

function animating() {
	$stripes.animate({
		marginLeft: "-=30px"
	}, 2500, "linear").append('/');
} 

function setSkin(skin){
	$('.loader').attr('class', 'loader '+skin);
	$('#loadedMessage').hasClass('loaded') ? $('#loadedMessage').attr('class', 'loaded '+skin) : $('#loadedMessage').attr('class', skin);
}