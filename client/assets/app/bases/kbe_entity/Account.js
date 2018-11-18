
/**
 * !#zh 账号Entity
 * 显式声明 Kbe 中的属性配置
 */
let app = require('app')
var KBEngine = require('kbengine')
var GameObject = require('GameObject')

KBEngine.Account = cc.Class({
	extends: KBEngine.GameObject,

	properties: {
		
	},
	
	onUpdateProp(propName){
		// app.gameDdzM[propName] = this[propName]
		let hallDdzM = require('hallDdzM').hallDdzM
		if (KBEngine.app.entity_id === this.id) {
			if (propName in hallDdzM) {
				hallDdzM[propName] = this[propName]
			}
		}
	},

	__init__ : function(){
		app.kbeM.emit('onLoginOK')
	},
});
