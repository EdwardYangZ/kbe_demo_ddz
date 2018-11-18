
cc.Class({
	extends: cc.Component,

	properties: {
		card0: [cc.SpriteFrame],
		card2: [cc.SpriteFrame],
		card3: [cc.SpriteFrame],
		card4: [cc.SpriteFrame],
		card5: [cc.SpriteFrame],
		card6: [cc.SpriteFrame],
		card7: [cc.SpriteFrame],
		card8: [cc.SpriteFrame],
		card9: [cc.SpriteFrame],
		card10: [cc.SpriteFrame],
		card11: [cc.SpriteFrame],
		card12: [cc.SpriteFrame],
		card13: [cc.SpriteFrame],
		card14: [cc.SpriteFrame],
		card16: [cc.SpriteFrame],
		card17: [cc.SpriteFrame],
	},

	getCardRes (card){
		let rank = Math.floor(card/10)
		let color = card - rank * 10
		if (color < 0) {
			color = 0
		}
		let cards = this['card'+rank]
		return cards[color]
	}
});
