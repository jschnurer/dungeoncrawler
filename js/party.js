function party(heroes) {
	var self = this;
	self.experience = 0;
	self.heroes = heroes;
	
	self.heroes.forEach(function(hero) {
		hero.setStatus(STATUS_OK);
		hero.portraitBox.attr('title', hero.name);
	});
	
	self.gainExperience = function (amount) {
		self.experience += amount;
		$('#essencePanel').html(self.experience);
	}
	
	self.getFirstActingHero = function () {
		for(var i = 0; i < self.heroes.length; i++) {
			if(self.heroes[i].canAct())
				return self.heroes[i];
		}
		
		return self.heroes[i];
	}
	
	self.fullHeal = function () {
		self.heroes.forEach(function(hero) {
			hero.fullHeal();
		});
	}
}