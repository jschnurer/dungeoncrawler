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

var MODE_NONE = -1;
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

var GAME_MODE = MODE_NONE;
var SELECTED_HERO = 1;

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
var TILE_FOREST = 53;
var TILE_MOUNTAIN = 54;
var TILE_WATER = 55;
var TILE_PILLAR = 80;
var TILE_FLOOR = 70;
var TILE_CEILING = 67;
var TILE_CEILING_FLOOR = 66;
var TILE_GRASS = 71;
var TILE_WHIRLPOOL = 82;
var TILE_DIRT = 68;

var TILE_MASK_CAVE_ENTRANCE = -1;
var TILE_MASK_TABLE = -2;
var TILE_MASK_TOWN = -3;
var TILE_MASK_PLACE_OF_POWER = -4;
var TILE_MASK_CHEST = -5;
var TILE_MASK_DUNGEON_BUTTON = -6;

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

var SKILL_PATHFINDING = 0;
var SKILL_DIRECTION_SENSE = 1;

var BG_NIGHTSKY = 0;
var BG_BLACK = 1;

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
tghToLife[CLASS_KNIGHT] = 5;
tghToLife[CLASS_THIEF] = 5;
tghToLife[CLASS_SORCERER] = 5;
tghToLife[CLASS_CLERIC] = 5;
tghToLife[CLASS_PALADIN] = 5;
tghToLife[CLASS_DRUID] = 5;

var cogToMana = [];
cogToMana[CLASS_KNIGHT] = 5;
cogToMana[CLASS_THIEF] = 5;
cogToMana[CLASS_SORCERER] = 5;
cogToMana[CLASS_CLERIC] = 5;
cogToMana[CLASS_PALADIN] = 5;
cogToMana[CLASS_DRUID] = 5;

var pieIntToMana = [];
pieIntToMana[CLASS_KNIGHT] = 1;
pieIntToMana[CLASS_THIEF] = 1;
pieIntToMana[CLASS_SORCERER] = 1;
pieIntToMana[CLASS_CLERIC] = 1;
pieIntToMana[CLASS_PALADIN] = 1;
pieIntToMana[CLASS_DRUID] = 1;


var ITEM_MELEE = 1;
var ITEM_ARMOR = 2;
var ITEM_ACCESSORY = 3;
var ITEM_SHIELD = 4;
var ITEM_RANGED = 5;
var ITEM_SCROLL = 6;
var ITEM_TOME = 7;
var ITEM_QUEST = 8;

var WEAPON_HEAVY = 1;
var WEAPON_LIGHT = 2;

var ITEM_TYPE_NAMES = [];
ITEM_TYPE_NAMES[ITEM_MELEE] = 'Melee Weapon';
ITEM_TYPE_NAMES[ITEM_ARMOR] = 'Armor';
ITEM_TYPE_NAMES[ITEM_ACCESSORY] = 'Accessory';
ITEM_TYPE_NAMES[ITEM_SHIELD] = 'Shield';
ITEM_TYPE_NAMES[ITEM_RANGED] = 'Ranged Weapon';
ITEM_TYPE_NAMES[ITEM_SCROLL] = 'Scroll';
ITEM_TYPE_NAMES[ITEM_TOME] = 'Tome';
ITEM_TYPE_NAMES[ITEM_QUEST] = 'Quest Item';

var WEAPON_WEIGHT_NAMES = [];
WEAPON_WEIGHT_NAMES[WEAPON_HEAVY] = 'Heavy';
WEAPON_WEIGHT_NAMES[WEAPON_LIGHT] = 'Light';

var ITEM_CLUB = 0;
var ITEM_CLOTHES = 1;
var ITEM_LEATHERARMOR = 2;
var ITEM_DAGGER = 3;
var ITEM_FANGNECKLACE = 4;
var ITEM_GEMSTONEBROACH = 5;
var ITEM_MAUL = 6;
var ITEM_BUCKLER = 7;
var ITEM_ROBE = 8;
var ITEM_STAFF = 9;
var ITEM_HATCHET = 10;
var ITEM_HAMMER = 11;
var ITEM_WHIP = 12;
var ITEM_TORCH = 13;
var ITEM_SCROLL_MEND_MINOR_WOUNDS = 14;
var ITEM_TOME_TORCHLIGHT = 15;
var ITEM_SWORD_CLAW_KEY = 16;
var ITEM_CRYSTAL_KEY = 17;
var ITEM_ORB_WAND = 18;
var ITEM_CRYSTAL_WAND = 19;
var ITEM_LUNAR_WAND = 20;
var ITEM_ROUND_SHIELD = 21;
var ITEM_PAINTED_SHIELD = 22;
var ITEM_FORTRESS_SHIELD = 23;
var ITEM_RING_OF_THOUGHT = 24;

var SPELL_TYPE_HEAL = 0;
var SPELL_TYPE_DAMAGE = 1;
var SPELL_TYPE_CURE = 2;
var SPELL_TYPE_BUFF = 3;
var SPELL_TYPE_DEBUFF = 4;

var DEBUFF_DODGE = 0;

var DEBUFF_NAMES = [];
DEBUFF_NAMES[DEBUFF_DODGE] = 'off balance';

var DEBUFF_APPLIED_STRINGS = [];
DEBUFF_APPLIED_STRINGS[DEBUFF_DODGE] = 'knocked off balance';

var SCHOOL_PORTENT = 0;
var SCHOOL_SPELL = 1;

var SCHOOL_NAMES = [];
SCHOOL_NAMES[SCHOOL_PORTENT] = 'Portent';
SCHOOL_NAMES[SCHOOL_SPELL] = 'Spell';

var SPELL_MEND_MINOR_WOUNDS = 0;
var SPELL_STATIC_JOLT = 1;
var SPELL_FROSTFALL = 2;
var SPELL_AURA_OF_VALOR = 3;
var SPELL_DEADLY_SWARM = 4;
var SPELL_FLAMING_WEAPON = 5;
var SPELL_MIND_BLAST = 6;
var SPELL_CHAIN_LIGHTNING = 7;
var SPELL_WATER_WALKING = 8;
var SPELL_TORCHLIGHT = 9;
var SPELL_INNER_LIGHT = 10;

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