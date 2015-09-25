var KEY_TAB = 9;

var KEY_ESC = 27;
var KEY_SPACE = 32;

var KEY_LEFT_ARROW = 37;
var KEY_UP_ARROW = 38;
var KEY_RIGHT_ARROW = 39;
var KEY_DOWN_ARROW = 40

var KEY_1 = 49;
var KEY_2 = 50;
var KEY_3 = 51;
var KEY_4 = 52;
var KEY_5 = 53;

var KEY_A = 65;
var KEY_B = 66;
var KEY_C = 67;
var KEY_D = 68;
var KEY_E = 69;
var KEY_F = 70;
var KEY_G = 71;
var KEY_H = 72;
var KEY_I = 73;
var KEY_J = 74;
var KEY_K = 75;
var KEY_L = 76;
var KEY_M = 77;
var KEY_N = 78;
var KEY_O = 79;
var KEY_P = 80;
var KEY_Q = 81;
var KEY_R = 82;
var KEY_S = 83;
var KEY_T = 84;
var KEY_U = 85;
var KEY_V = 86;
var KEY_W = 87;
var KEY_X = 88;
var KEY_Y = 89;
var KEY_Z = 90;

var GENDERS_MALE = 1;
var GENDERS_FEMALE = 2;

var MODE_GAMEOVER = 0;
var MODE_NAV = 1;
var MODE_COMBAT = 2;
var MODE_MENUS = 3;
var MODE_CHOICE = 4;
var MODE_CONTINUE = 5;
var MODE_LEVEL_UP = 6;
var MODE_INVENTORY = 7;
var MODE_SPELLBOOK = 8;
var MODE_SHOP = 9;
var MODE_MAINMENU = 10;

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
var TILE_PILLAR_BUTTON = 79;
var TILE_PILLAR = 80;
var TILE_FLOOR = 70;
var TILE_CEILING = 67;
var TILE_CEILING_FLOOR = 66;
var TILE_GRASS = 71;
var TILE_PLACE_OF_POWER = 1;
var TILE_CHEST = 84;

var CLASS_KNIGHT = 0;
var CLASS_THIEF = 1;
var CLASS_SORCERER = 2;
var CLASS_CLERIC = 3;
var CLASS_PALADIN = 4;
var CLASS_DRUID = 5;

var STATUS_OK = 1;
var STATUS_UNCONSCIOUS = 2;
var STATUS_DEAD = 3;
var STATUS_PARALYZED = 4;
var STATUS_ASLEEP = 5;

var STAT_MGHT = 0;
var STAT_DEX = 1;
var STAT_TGH = 2;
var STAT_ACC = 3;
var STAT_SPD = 4;
var STAT_COG = 5;
var STAT_PIE = 6;
var STAT_INT = 7;
var STAT_LIFE = 8;
var STAT_MANA = 9;
var STAT_MIGHTBONUS = 10;
var STAT_DEXBONUS = 11;
var STAT_DODGE = 12;
var STAT_TURNS = 13;
var STAT_PORTENTBONUS = 14;
var STAT_SPELLBONUS = 15;

var STAT_NAMES = [];
STAT_NAMES[STAT_MGHT] = 'Might';
STAT_NAMES[STAT_DEX] = 'Dexterity';
STAT_NAMES[STAT_TGH] = 'Toughness';
STAT_NAMES[STAT_ACC] = 'Accuracy';
STAT_NAMES[STAT_SPD] = 'Speed';
STAT_NAMES[STAT_COG] = 'Cognition';
STAT_NAMES[STAT_PIE] = 'Piety';
STAT_NAMES[STAT_INT] = 'Intellect';

var BG_NIGHTSKY = 1;

var TARGET_RANDOM_HERO = 1;
var TARGET_SINGLE_HERO = 2;
var TARGET_PARTY = 3;
var TARGET_SINGLE_MONSTER = 4;
var TARGET_ALL_MONSTERS = 5;
var TARGET_ALL_HEROES = 6;

var SPELL_MODE_COMBAT = 0;
var SPELL_MODE_NAV = 1;
var SPELL_MODE_BOTH = 2;

var tghToLife = [];
tghToLife[CLASS_KNIGHT] = 4;
tghToLife[CLASS_THIEF] = 4;
tghToLife[CLASS_SORCERER] = 4;
tghToLife[CLASS_CLERIC] = 4;
tghToLife[CLASS_PALADIN] = 4;
tghToLife[CLASS_DRUID] = 4;

var cogToMana = [];
cogToMana[CLASS_KNIGHT] = 4;
cogToMana[CLASS_THIEF] = 4;
cogToMana[CLASS_SORCERER] = 4;
cogToMana[CLASS_CLERIC] = 4;
cogToMana[CLASS_PALADIN] = 4;
cogToMana[CLASS_DRUID] = 4;

var pieIntToMana = [];
pieIntToMana[CLASS_KNIGHT] = 1;
pieIntToMana[CLASS_THIEF] = 1;
pieIntToMana[CLASS_SORCERER] = 1;
pieIntToMana[CLASS_CLERIC] = 1;
pieIntToMana[CLASS_PALADIN] = 1;
pieIntToMana[CLASS_DRUID] = 1;

function rand(min, max) {
	return Math.floor((Math.random() * max) + min);
}

function rollStat(statValue) {
	return rand(Math.floor(statValue * .4), Math.floor(statValue * 1.25));
}

function getRandomItem(items) {
	return items[rand(1, items.length)-1];
}

function computeDamage(damage, resistance) {
	if(resistance == 100)
		return 0;
	else if(resistance > 100)
		return Math.floor(damage * ((100 - resistance)/100.0));
	else
		return Math.floor(damage * (100 - resistance)/100.0);
}

function gameOver() {
	GAME_MODE = MODE_GAMEOVER;
	$('#gameOver').show();
}