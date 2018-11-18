
/**
 * !#zh 玩家
 * 显式声明 Kbe 中的属性配置
 */
let app = require('app')
var KBEngine = require('kbengine')
var GameObject = require('GameObject')

// 玩家角色
KBEngine.PlayerDdz = cc.Class({
	name: 'PlayerDdz',
	extends: GameObject,

	properties: {
		seat: -1,
		nick: {
			default: '',
			notify (){
				this.emit('nick')
			}
		},
		gold: {
			default: '',
			notify (){
				this.emit('gold')
			}
		},
		bankerJiao: {
			default: -1,
			notify (){
				this.emit('bankerJiao')
			}
		},
		bankerQiang: {
			default: -1,
			notify (){
				this.emit('bankerQiang')
			}
		},
		poker: {
			default: [],
			type: cc.Integer,
			notify (){
				if (app.kbeM.player && this.id == app.kbeM.player.id) {
					app.gameDdzM.emit('myHandPoker')
				}
			}
		},
		pokerCount: {
			default: 0,
			type: cc.Integer,
			notify (){
				this.emit('pokerCount')
			}
		},
		discard: {
			default: [],
			type: cc.Integer,
			notify (){
				this.emit('discard')
			}
		},
		discardPass: {
			default: 0,
			type: cc.Integer,
			notify (){
				this.emit('discardPass')
			}
		},
	},

	getDiscard(){
		return this.discard.map(a => app.gameDdzM.toCard(a))
	},

	onEnterWorld(){
		// if (KBEngine.app.entity_id === this.id) {
		// 	app.gameCjM.state = 1
		// }
		// app.gameCjM.emit('playerids')
	},

});

