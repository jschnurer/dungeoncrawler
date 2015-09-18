var $levelUpPanel = null;
var $lChar1 = null;
var $lChar2 = null;
var $lChar3 = null;
var $lChar4 = null;
var $levelUpHeroStats = null;
var $levelUpHeroName = null;
var $levelUpMight = null;
var $levelUpDexterity = null;
var $levelUpToughness = null;
var $levelUpAccuracy = null;
var $levelUpSpeed = null;
var $levelUpCognition = null;
var $levelUpPiety = null;
var $levelUpIntellect = null;

var $levelUpLife = null;
var $levelUpMana = null;
var $levelUpMightDamageBonus = null;
var $levelUpDexterityDamageBonus = null;
var $levelUpDodge = null;
var $levelUpTurnsPerRound = null;
var $levelUpPortentDamageBonus = null;
var $levelUpSpellDamageBonus = null;
var $levelUpResistPhysical = null;
var $levelUpResistFire = null;
var $levelUpResistWater = null;
var $levelUpResistEarth = null;
var $levelUpResistAir = null;
var $levelUpResistBody = null;
var $levelUpResistMind = null;
var $levelUpResistSpirit = null;

var $levelUpLevel = null;
var $levelUpCost = null;

var levelUpChooseHero1Callback = function () { levelUpChooseHero(0); };
var levelUpChooseHero2Callback = function () { levelUpChooseHero(1); };
var levelUpChooseHero3Callback = function () { levelUpChooseHero(2); };
var levelUpChooseHero4Callback = function () { levelUpChooseHero(3); };

$(function() {
	$levelUpPanel = $('#levelUpPanel');
	$lChar1 = $('#levelChar1');
	$lChar2 = $('#levelChar2');
	$lChar3 = $('#levelChar3');
	$lChar4 = $('#levelChar4');
	$lChar1.click(levelUpChooseHero1Callback);
	$lChar2.click(levelUpChooseHero2Callback);
	$lChar3.click(levelUpChooseHero3Callback);
	$lChar4.click(levelUpChooseHero4Callback);
	$('#levelNone').click(function() { dismissLevelUpPanel(); });

	$levelUpHeroStats = $('#levelUpHeroStats');
	$levelUpHeroName = $('#levelUpHeroName');
	$levelUpMight = $('#levelUpMight span');
	$levelUpDexterity = $('#levelUpDexterity span');
	$levelUpToughness = $('#levelUpToughness span');
	$levelUpAccuracy = $('#levelUpAccuracy span');
	$levelUpSpeed = $('#levelUpSpeed span');
	$levelUpCognition = $('#levelUpCognition span');
	$levelUpPiety = $('#levelUpPiety span');
	$levelUpIntellect = $('#levelUpIntellect span');
	
	$('#levelUpConfirm').click(function() { confirmAllotment(); });
	$('#levelUpCancel').click(function() { cancelAllotment(); });
	
	$levelUpLevel = $('#levelUpLevel span');
    $levelUpCost = $('#levelUpCost span');
	
	$levelUpLife = $('#levelUpLife span');
	$levelUpMana = $('#levelUpMana span');
	$levelUpMightDamageBonus = $('#levelUpMightDamageBonus span');
	$levelUpDexterityDamageBonus = $('#levelUpDexterityDamageBonus span');
	$levelUpDodge = $('#levelUpDodge span');
	$levelUpTurnsPerRound = $('#levelUpTurnsPerRound span');
	$levelUpPortentDamageBonus = $('#levelUpPortentDamageBonus span');
	$levelUpSpellDamageBonus = $('#levelUpSpellDamageBonus span');
	$levelUpResistPhysical = $('#levelUpResistPhysical span');
	$levelUpResistFire = $('#levelUpResistFire span');
	$levelUpResistWater = $('#levelUpResistWater span');
	$levelUpResistEarth = $('#levelUpResistEarth span');
	$levelUpResistAir = $('#levelUpResistAir span');
	$levelUpResistBody = $('#levelUpResistBody span');
	$levelUpResistMind = $('#levelUpResistMind span');
	$levelUpResistSpirit = $('#levelUpResistSpirit span');
});

function handlePlaceOfPower() {
	party.fullHeal();
	
	showChoices('You commune with this place of power. Your life is restored and your magical reserves replenished.', [ {
		text: 'Level up',
		callback: function() {
			showLevelUpPanel();
		}
	}, {
		text: 'Leave',
		callback: function() {
			finishChoice();
		}
	}]);
}

function handleLevelUpInput(e) {
	if(e.which == KEY_1) {
		levelUpChooseHero1Callback();
		e.preventDefault();
	} else if(e.which == KEY_2) {
		levelUpChooseHero2Callback();
		e.preventDefault();
	} else if(e.which == KEY_3) {
		levelUpChooseHero3Callback();
		e.preventDefault();
	} else if(e.which == KEY_4) {
		levelUpChooseHero4Callback();
		e.preventDefault();
	} else if(e.which == KEY_5) {
		dismissLevelUpPanel();
		e.preventDefault();
	}
}

function showLevelUpPanel() {
	GAME_MODE = MODE_LEVEL_UP;
	$levelUpPanel.show();
	$levelUpHeroStats.hide();
	$lChar1.html(party.heroes[0].name);
	$lChar2.html(party.heroes[1].name);
	$lChar3.html(party.heroes[2].name);
	$lChar4.html(party.heroes[3].name);
}

function dismissLevelUpPanel() {
	GAME_MODE = MODE_CHOICE;
	$levelUpPanel.hide();
}

function levelUpChooseHero(heroIx) {
	$levelUpHeroStats.show();
	
	var h = party.heroes[heroIx];
	
	$levelUpHeroName.html(h.name);
    $levelUpMight.html(h.might);
    $levelUpDexterity.html(h.dexterity);
    $levelUpToughness.html(h.toughness);
    $levelUpAccuracy.html(h.accuracy);
    $levelUpSpeed.html(h.speed);
    $levelUpCognition.html(h.cognition);
    $levelUpPiety.html(h.piety);
    $levelUpIntellect.html(h.intellect);
	
	$levelUpLevel.html(h.level);
	$levelUpCost.html(h.getAdvancementCost());
	$levelUpLife.html(h.maxLife);
	$levelUpMana.html(h.maxMana);
	$levelUpMightDamageBonus.html(h.getMightDamageBonusString());
	$levelUpDexterityDamageBonus.html(h.getDexDamageBonusString());
	$levelUpDodge.html(h.dodge);
	$levelUpTurnsPerRound.html(h.turnsPerRound);
	$levelUpPortentDamageBonus.html(h.getPortentDamageBonusString());
	$levelUpSpellDamageBonus.html(h.getSpellDamageBonusString());
	$levelUpResistPhysical.html(h.getResistance(ELEM_PHYS));
	$levelUpResistFire.html(h.getResistance(ELEM_FIRE));
	$levelUpResistWater.html(h.getResistance(ELEM_WATER));
	$levelUpResistEarth.html(h.getResistance(ELEM_EARTH));
	$levelUpResistAir.html(h.getResistance(ELEM_AIR));
	$levelUpResistBody.html(h.getResistance(ELEM_BODY));
	$levelUpResistMind.html(h.getResistance(ELEM_MIND));
	$levelUpResistSpirit.html(h.getResistance(ELEM_SPIRIT));
}