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

var PARTY = null;