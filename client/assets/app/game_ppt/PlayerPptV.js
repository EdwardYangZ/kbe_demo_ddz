
cc.Class({
	extends: require('BaseV'),

	properties: {
		player: {
			get(){
				return this._player || null
			}
		},
		head: cc.Node
	},

	onStart (){

	},

	setPlayer (player){
		this._player = player
		this.when(player, 'position', function () {
			this.node.position = player.position
		})()
		this.when(player, 'dir', function () {
			this.node.rotation = -player.dir*180/Math.PI
		})()
		this.when(player, 'isStoring', function () {
			if (player.isStoring > 0) {
				this.head.stopAllActions()
				this.head.scaleX = 1
				this.head.runAction(cc.scaleTo(2.5, 4, 1))
			}else{
				this.head.stopAllActions()
				this.head.scaleX = 1
			}
		})()
		this.when(player, 'life', function () {
			this.getComponent(cc.ProgressBar).progress = player.life
		})()
	}
});
