function shop (data){
	this.id = data.id;
	this.name = data.name;
	this.type = data.type;
	this.goodsIds = data.goodsIds;
}

var SHOP_ITEMS = 0;
var SHOP_MAGIC = 1;

var SHOPS = [];
var SHOP_JJBLACKSMITHING = 0;

SHOPS[SHOP_JJBLACKSMITHING] = new shop({
	id: SHOP_JJBLACKSMITHING,
	name: 'J&J Blacksmithing',
	type: SHOP_ITEMS,
	goodsIds: [
		ITEM_CLUB,
		ITEM_DAGGER,
		ITEM_CLOTHES,
		ITEM_LEATHERARMOR
	]
});