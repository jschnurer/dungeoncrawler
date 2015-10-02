$(function() {
	$('#stats').click(function() {
		if(GAME_MODE == MODE_NAV) {
			PLACEOFPOWER.open(true);
		} else if(GAME_MODE == MODE_SPELLBOOK) {
			this.closeLevelUpMenu();
		}
	});
});

function placeOfPower () {
	this.statsOnly = false;
	this.setup();
}

placeOfPower.prototype.setup = function () {
	this.$lChar1 = $('#levelChar1');
	this.$lChar2 = $('#levelChar2');
	this.$lChar3 = $('#levelChar3');
	this.$lChar4 = $('#levelChar4');
	this.$lChar1.click(function () { PLACEOFPOWER.selectHero(0); });
	this.$lChar2.click(function () { PLACEOFPOWER.selectHero(1); });
	this.$lChar3.click(function () { PLACEOFPOWER.selectHero(2); });
	this.$lChar4.click(function () { PLACEOFPOWER.selectHero(3); });
	$('#levelNone').click(function() { PLACEOFPOWER.closeLevelUpMenu(); });
	
	$('#levelUpConfirm').click(function() { PLACEOFPOWER.confirmAllotment(); });
	$('#levelUpCancel').click(function() { PLACEOFPOWER.cancelAllotment(); });
	
	this.$levelUpLevel = $('#levelUpLevel span');
    this.$levelUpCost = $('#levelUpCost span');
	
	this.$levelUpResistPhysical = $('#levelUpResistPhysical span');
	this.$levelUpResistFire = $('#levelUpResistFire span');
	this.$levelUpResistWater = $('#levelUpResistWater span');
	this.$levelUpResistEarth = $('#levelUpResistEarth span');
	this.$levelUpResistAir = $('#levelUpResistAir span');
	this.$levelUpResistBody = $('#levelUpResistBody span');
	this.$levelUpResistMind = $('#levelUpResistMind span');
	this.$levelUpResistSpirit = $('#levelUpResistSpirit span');
	
	$('.levelUpPlus').click(function() { PLACEOFPOWER.plusClick($(this)); });
	$('.levelUpMinus').click(function() { PLACEOFPOWER.minusClick($(this)); });	
};

placeOfPower.prototype.plusClick = function($element) {
	if(!this.selectedHero.canAdvance())
		return;
	
	var advCost = this.selectedHero.getAdvancementCost();
	var paidOk = PARTY.loseExperience(advCost);
	
	if(!paidOk)
		return;
	
	var parent = $element.parent().parent();
	var currStatVal = parent.children('span').html();
	
	parent.children('span').html(parseInt(currStatVal) + 1);
	parent.children('span').css('color', 'cyan');
	
	var statId = parseInt(parent.attr('data-statId'));
	
	this.selectedHero.advanceStat(statId, 1);
	this.pendingChanges[statId]++;
	this.costsPaid.push(advCost);
	this.pendingPoints = true;
	this.updateDerivedStats();
}

placeOfPower.prototype.minusClick = function($element) {
	var parent = $element.parent().parent();
	var statId = parseInt(parent.attr('data-statId'));
	
	if(this.pendingChanges[statId] == 0)
		return;
	
	this.reduceStat(statId);
	
	parent.children('span').html(this.selectedHero.getStat(statId));
	if(this.pendingChanges[statId] > 0)
		parent.children('span').css('color', 'cyan');	
	else
		parent.children('span').css('color', 'white');
	
	this.updateDerivedStats();
}

placeOfPower.prototype.reduceStat = function(statId) {
	this.selectedHero.advanceStat(statId, -1);
	this.pendingChanges[statId]--;
	PARTY.gainExperience(this.costsPaid.pop());
}

placeOfPower.prototype.open = function(statsOnly) {
	this.statsOnly = statsOnly;
	
	if(!this.statsOnly) {
		PARTY.fullHeal();
	
		// reset all combat encounters
		NAV.setCombatTiles(false);
		
		SAVELOADER.save(PARTY, INVENTORY, NAV, GAME_VARS);
		
		this.showAdvancement();
		$('#levelUpConfirm').show();
		$('#levelUpCancel').show();
		
		showChoices('Your deeds have been recorded.[br][br]You commune with this place of power. Your life and magical reserves are replenished but danger surrounds you once more.', [ {
			text: 'Level up',
			callback: function() {
				GAME_MODE = MODE_LEVEL_UP;
				PLACEOFPOWER.openLevelUpMenu();
			}
		}, {
			text: 'Leave',
			callback: function() {
				SAVELOADER.save(PARTY, INVENTORY, NAV, GAME_VARS);
				finishChoice();
			}
		}]);
	} else {
		GAME_MODE = MODE_LEVEL_UP;
		PLACEOFPOWER.openLevelUpMenu();
		this.hideAdvancement();
		$('#levelUpConfirm').hide();
		$('#levelUpCancel').hide();
	}
}

placeOfPower.prototype.handleInput = function(e) {
	if(e.which == KEY_1) {
		this.selectHero(0);
		e.preventDefault();
	} else if(e.which == KEY_2) {
		this.selectHero(1);
		e.preventDefault();
	} else if(e.which == KEY_3) {
		this.selectHero(2);
		e.preventDefault();
	} else if(e.which == KEY_4) {
		this.selectHero(3);
		e.preventDefault();
	} else if(e.which == KEY_5 || (this.statsOnly && (e.which == KEY_T || e.which == KEY_ESC))) {
		this.closeLevelUpMenu();
		e.preventDefault();
	}
}

placeOfPower.prototype.openLevelUpMenu = function() {	
	this.pendingChanges = [0,0,0,0,0,0,0,0];
	this.costsPaid = [];
	$('#levelUpPanel').show();
	$('#levelUpHeroStats').hide();
	this.$lChar1.html(PARTY.heroes[0].name);
	this.$lChar2.html(PARTY.heroes[1].name);
	this.$lChar3.html(PARTY.heroes[2].name);
	this.$lChar4.html(PARTY.heroes[3].name);
	this.selectHero(0);
}

placeOfPower.prototype.closeLevelUpMenu = function() {
	$('#levelUpPanel').hide();
	
	if(!this.statsOnly) {
		GAME_MODE = MODE_CHOICE;
	} else {
		GAME_MODE = MODE_NAV;
	}
}

placeOfPower.prototype.selectHero = function(heroIx) {
	$('#levelUpHeroStats').show();
	
	var h = PARTY.heroes[heroIx];
	this.selectedHero = h;
	
	$('#levelUpStats > li').each(function (ix, el) {
		var stat = h.getStat(parseInt($(el).attr('data-statid')));
		$(el).children('span').html(stat);
		$(el).children('span').css('color', 'white');
	});
	
	$('#levelUpHeroName').html(h.name);
	
	this.updateDerivedStats();
}

placeOfPower.prototype.updateDerivedStats = function() {
	this.$levelUpCost.html(this.selectedHero.getAdvancementCost());
	this.$levelUpLevel.html(this.selectedHero.level);

	$('#levelUpDerivedStats1 > li').each(function (ix, el) {
		$(el).children('span').html(PLACEOFPOWER.selectedHero.getStat(parseInt($(el).attr('data-statId'))));
	});
	
	$('#levelUpDerivedStats2 > li').each(function (ix, el) {
		$(el).children('span').html(PLACEOFPOWER.selectedHero.getResistance(parseInt($(el).attr('data-elemId'))));
	});
}

placeOfPower.prototype.confirmAllotment = function() {
	this.selectedHero.updateBars();
	this.closeLevelUpMenu();
}

placeOfPower.prototype.cancelAllotment = function() {
	for(var i = 0; i < this.pendingChanges.length; i++) {
		if(this.pendingChanges[i] > 0) {
			var numTimes = this.pendingChanges[i];
			for(var x = 0; x < numTimes; x++) {
				this.reduceStat(i);
			}
		}
		this.pendingChanges[i] = 0;
	}
	this.closeLevelUpMenu();
}

placeOfPower.prototype.hideAdvancement = function () {
	$('#levelUpStats .levelUpDown').hide();
}

placeOfPower.prototype.showAdvancement = function () {
	$('#levelUpStats .levelUpDown').show();
}

var PLACEOFPOWER = null;

$(function() {
	PLACEOFPOWER = new placeOfPower();
});