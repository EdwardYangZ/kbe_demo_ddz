

cc.Class({
	extends: require('BaseV'),

	properties: {
		CardItem: require('Item')
	},
	
	onStart (){

	},

	setPoker(poker){
		this.CardItem.setDatas(poker, (v, card)=> v.getComponent('CardV').card = card)
	}
});
