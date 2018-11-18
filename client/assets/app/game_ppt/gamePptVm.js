
let gamePptM = require('gamePptM')

cc.Class({
	extends: require('BaseV'),

	properties: {
		playerPptV: require('PlayerPptV')
	},

	onStart (){
		this.when(gamePptM, 'playerids', function () {
			this.playerPptV.setPlayer(gamePptM.myPlayer())
		})()
	},

	update(t){
		gamePptM.update(t)
	}
});
