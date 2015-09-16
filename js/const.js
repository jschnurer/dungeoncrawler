var KEY_W = 87;
var KEY_A = 65;
var KEY_S = 83;
var KEY_D = 68;
var KEY_Q = 81;
var KEY_TAB = 9;
var KEY_B = 66;
var KEY_F = 70;
var KEY_C = 67;

var GENDERS_MALE = 1;
var GENDERS_FEMALE = 2;

var MODE_NAV = 1;
var MODE_COMBAT = 2;
var MODE_MENUS = 3;
var MODE_CHOICE = 4;

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

function rand(min, max) {
	return Math.floor((Math.random() * max) + min);
}

function rollStat(statValue) {
	return rand(0, statValue * 2);
}

function getRandomItem(items) {
	return items[rand(0, items.length-1)];
}