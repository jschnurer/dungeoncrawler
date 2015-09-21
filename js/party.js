function party(heroes) {
	this.experience = 0;
	this.heroes = heroes;
	
	this.heroes.forEach(function(hero) {
		hero.setStatus(STATUS_OK);
		hero.portraitBox.attr('title', hero.name);
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

var PARTY = null;