function party(heroes) {
	self.experience = 0;
	this.heroes = heroes;
	
	this.heroes.forEach(function(hero) {
		hero.setStatus(STATUS_OK);
		hero.portraitBox.attr('title', hero.name);
	});
	
	this.gainExperience = function (amount) {
		self.experience += amount;
		$('#essencePanel').html(self.experience);
	}
}