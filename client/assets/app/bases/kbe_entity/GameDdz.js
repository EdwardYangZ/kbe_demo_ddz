
/**
 * !#zh 玩家
 * 显式声明 Kbe 中的属性配置
 */
var KBEngine = require('kbengine')
var GameObject = require('GameObject')
let app = require('app')

// 玩家角色
KBEngine.GameDdz = cc.Class({
	name: 'GameDdz',
	extends: GameObject,

	properties: {
	},

	onEnterWorld(){
		app.gameDdzM.emit('enterGame')
	},

	onLeaveWorld(){
		app.gameDdzM.emit('onLeaveWorld')
	},

	onUpdateProp(propName){
		app.gameDdzM[propName] = this[propName]
	}
});

