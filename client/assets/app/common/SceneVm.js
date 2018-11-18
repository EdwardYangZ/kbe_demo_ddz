let kbeM = require('kbeM')
let app = require('app')

/**
 * !#zh 登录场景
 */
cc.Class({
	extends: require('BaseV'),

	properties: {
	},

	onStart (){
		app.debugVm.addBtn( ()=> {
			app.kbeM.doLogin('test002', '123456', 'nick')
		}, '登录2')
		
		this.when(app.kbeM, 'onLoginOK', function () {
			if (app.busingV) {
				app.busingV.node.active = false
			}
		})
		this.when(app.kbeM, 'logining', function () {
			if (app.busingV) {
				app.busingV.node.active = true
			}
		})

		this.when(app.gameDdzM, 'enterGame', this.delayCaller(function () {
			// if (app.kbeM.player && app.kbeM.player.className == 'PlayerDdz') {
			// 	if (cc.director.getScene().name != 'game_ddz') {
			// 		cc.director.loadScene('game_ddz')
			// 	}
			// }
		}))
	},
});
