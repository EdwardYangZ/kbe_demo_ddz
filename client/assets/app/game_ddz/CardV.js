
let Item = require('Item')

cc.Class({
	extends: require('BaseV'),

	properties: {
		idx: -1,
		card: {
			default: 0,
			type: cc.Integer,
			notify (old){
				if (old !== this.card) {
					this.flushCard()
				}
			}
		},
	},

	getPokerRes (card){
		let cfg = cc.director.getScene().getComponentInChildren('cfgPoker')
		return cfg && cfg.getCardRes(card)
	},

	onStart (){
		if (!this.getComponent(cc.Sprite)) {
			this.addComponent(cc.Sprite)
		}
		if (!this.getComponent('Item')) {
			this.addComponent(Item)
		}
		this.flushCard()
	},

	flushCard (){
		let res = this.getPokerRes(this.card)
		this.getComponent(cc.Sprite).spriteFrame = res
	},

	editor: {
		executeInEditMode: true,
		playOnFocus: true,
	}
});
