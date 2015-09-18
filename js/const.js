var KEY_W = 87;
var KEY_A = 65;
var KEY_S = 83;
var KEY_D = 68;
var KEY_Q = 81;
var KEY_TAB = 9;
var KEY_B = 66;
var KEY_F = 70;
var KEY_C = 67;
var KEY_1 = 49;
var KEY_2 = 50;
var KEY_3 = 51;
var KEY_4 = 52;
var KEY_5 = 53;
var KEY_UP_ARROW = 38;
var KEY_DOWN_ARROW = 40
var KEY_LEFT_ARROW = 37;
var KEY_RIGHT_ARROW = 39;
var KEY_SPACE = 32;

var GENDERS_MALE = 1;
var GENDERS_FEMALE = 2;

var MODE_NAV = 1;
var MODE_COMBAT = 2;
var MODE_MENUS = 3;
var MODE_CHOICE = 4;
var MODE_CONTINUE = 5;
var MODE_LEVEL_UP = 6;

var ELEM_PHYS = 0;
var ELEM_FIRE = 1;
var ELEM_WATER = 2;
var ELEM_EARTH = 3;
var ELEM_AIR = 4;
var ELEM_BODY = 5;
var ELEM_MIND = 6;
var ELEM_SPIRIT = 7;

var ELEM_NAMES = [];
ELEM_NAMES[ELEM_PHYS] = 'physical';
ELEM_NAMES[ELEM_FIRE] = 'fire';
ELEM_NAMES[ELEM_WATER] = 'water';
ELEM_NAMES[ELEM_EARTH] = 'earth';
ELEM_NAMES[ELEM_AIR] = 'air';
ELEM_NAMES[ELEM_BODY] = 'body';
ELEM_NAMES[ELEM_MIND] = 'mind';
ELEM_NAMES[ELEM_SPIRIT] = 'spirit';

var TILE_WALL = 49;
var TILE_DOOR = 50;
var TILE_FAKE_WALL = 51;
var TILE_EVENT_DOOR = 52;
var TILE_FOREST = 53;
var TILE_MOUNTAIN = 54;
var TILE_WATER = 55;
var TILE_PILLAR = 80;
var TILE_FLOOR = 70;
var TILE_CEILING = 67;
var TILE_CEILING_FLOOR = 66;
var TILE_GRASS = 71;
var TILE_PLACE_OF_POWER = 1;

var CLASS_KNIGHT = 1;
var CLASS_THIEF = 2;
var CLASS_SORCERER = 3;
var CLASS_CLERIC = 4;
var CLASS_ARCHER = 5;
var CLASS_PALADIN = 6;
var CLASS_DRUID = 7;

var STATUS_OK = 1;
var STATUS_UNCONSCIOUS = 2;
var STATUS_DEAD = 3;
var STATUS_PARALYZED = 4;
var STATUS_ASLEEP = 5;

var BG_NIGHTSKY = 1;

var tghToLife = [];
tghToLife[CLASS_KNIGHT] = 5;
tghToLife[CLASS_THIEF] = 4;
tghToLife[CLASS_SORCERER] = 3;
tghToLife[CLASS_CLERIC] = 4;
tghToLife[CLASS_ARCHER] = 4;
tghToLife[CLASS_PALADIN] = 5;
tghToLife[CLASS_DRUID] = 3;

var cogToMana = [];
cogToMana[CLASS_KNIGHT] = 2;
cogToMana[CLASS_THIEF] = 3;
cogToMana[CLASS_SORCERER] = 5;
cogToMana[CLASS_CLERIC] = 5;
cogToMana[CLASS_ARCHER] = 3;
cogToMana[CLASS_PALADIN] = 3;
cogToMana[CLASS_DRUID] = 4;

var pieIntToMana = [];
pieIntToMana[CLASS_KNIGHT] = 1;
pieIntToMana[CLASS_THIEF] = 1;
pieIntToMana[CLASS_SORCERER] = 1;
pieIntToMana[CLASS_CLERIC] = 1;
pieIntToMana[CLASS_ARCHER] = 1;
pieIntToMana[CLASS_PALADIN] = 1;
pieIntToMana[CLASS_DRUID] = 1;

function rand(min, max) {
	return Math.floor((Math.random() * max) + min);
}

function rollStat(statValue) {
	return rand(0, statValue * 2);
}

function getRandomItem(items) {
	return items[rand(0, items.length-1)];
}

function computeDamage(damage, resistance) {
	var damageMult = 1;
	var testNum = 1;
	
	while(true) {
		if(rand(0, 100) <= (1.0 - 30.0 / (30.0 + resistance)) * 100) {
			testNum = testNum / 2.0;
		}
		testNum++;
		if(testNum == 4)
			break;
	}
	
	return Math.floor(damageMult * damage);
}