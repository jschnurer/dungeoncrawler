function party(data) {
	this.experience = data.experience || 0;
	this.heroes = data.heroes;
	
	this.loadHeroPortraits();
	$('#essencePanel').html(this.experience);
}

party.prototype.loadHeroPortraits = function() {
	this.heroes.forEach(function(hero) {
		hero.setStatus(STATUS_OK);
		hero.portraitBox.attr('title', hero.name);
		hero.updateBars();
	});
}

party.prototype.gainExperience = function (amount) {
	this.experience += amount;
	$('#essencePanel').html(this.experience);
}

party.prototype.hasExperience = function (amount) {
	return this.experience >= amount;
}

party.prototype.loseExperience = function (amount) {
	if(this.experience < amount) {
		return false;
	}
	
	this.experience -= amount;
	$('#essencePanel').html(this.experience);
	return true;
}

party.prototype.getFirstActingHero = function () {
	for(var i = 0; i < this.heroes.length; i++) {
		if(this.heroes[i].canAct())
			return this.heroes[i];
	}
	
	return this.heroes[i];
}

party.prototype.fullHeal = function () {
	this.heroes.forEach(function(hero) {
		hero.fullHeal();
	});
}

party.prototype.getAverageLevel = function () {
	var avgLvl = 0;
	this.heroes.forEach(function(hero) {
		avgLvl += hero.level;
	});
	return avgLvl / 4;
}

party.prototype.anyConsciousHeroWithSkill = function (skillId) {
	var hasSkill = false;
	this.heroes.forEach(function(hero) {
		if(hero.hasSkill(skillId))
			hasSkill = true;
	});
	return hasSkill;
}

party.prototype.clearHeroCombatBuffs = function () {
	this.heroes.forEach(function(hero) {
		hero.clearBuffs();
	});
}

party.prototype.anyHeroCarryingTorch = function () {
	var torchFound = false;
	this.heroes.forEach(function(hero) {
		var shield = hero.getEquipment(ITEM_SHIELD);
		if(shield != null && shield != undefined && shield.id == ITEM_TORCH)
			torchFound = true;
	});
	return torchFound;
}

party.prototype.tpk = function () {
	var canAct = false;
	this.heroes.forEach(function(hero) {
		if(hero.canAct())
			canAct = true;
	});
	return !canAct;
}

var PARTY = null;