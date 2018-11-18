let DiscardV = require('DiscardV')

cc.Class({
	extends: require('BaseV'),

	properties: {
		viewseat: {
			default: 0,
			type: cc.Integer
		},
		tNick: cc.Label,
		tGold: cc.Label,
		discard: {
			get (){
				if (this.node && this._discard == undefined) {
					this._discard = this.node.getComponentInChildren(DiscardV)
				}
				return this._discard? this._discard: null
			},
			type: DiscardV
		},
		jiao: require('StateSwitch'),
		pokerCount: cc.Label,
	},
	
	onStart (){

	},

	setPlayer (player){
		this.when(player, 'nick', function () {
			if (this.tNick) {
				this.tNick.string = player.nick
			}
		})();
		this.when(player, 'gold', function () {
			if (this.tGold) {
				this.tGold.string = player.gold.toString()
			}
		})();
		this.when(player, 'discard', function () {
			this.discard.setPoker(player.getDiscard() || [])
		})();
		this.when(player, 'bankerJiao', function () {
			let state = player.bankerJiao
			this.jiao.node.active = state >= 0
			if (this.jiao.node.active) {
				this.jiao.state = state
			}
		})();
		this.when(player, 'bankerQiang', function () {
			let state = player.bankerQiang
			this.jiao.node.active = state >= 0
			if (this.jiao.node.active) {
				this.jiao.state = state + 2
			}
		})();
		this.when(player, 'discardPass', function () {
			let state = player.discardPass
			this.jiao.node.active = state > 0
			if (this.jiao.node.active) {
				this.jiao.state = 4
			}
		})();
		this.when(player, 'pokerCount', function () {
			this.pokerCount.string = player.pokerCount
		})();
	}
});
