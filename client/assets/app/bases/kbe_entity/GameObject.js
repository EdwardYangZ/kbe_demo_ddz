
/**
 * !#zh 玩家
 * 显式声明 Kbe 中的属性配置
 */
var KBEngine = require('kbengine')
var kbeEntity = require('kbeEntity')


// 游戏对象抽象
KBEngine.GameObject = cc.Class({
    extends: kbeEntity,

    properties: {
		
	},
	
	ctor(){
	},

	onEnterWorld : function(){
		this.emit('onEnterWorld')
	},
	onEnterSpace : function(){
		this.emit('onEnterSpace')
	},
});
