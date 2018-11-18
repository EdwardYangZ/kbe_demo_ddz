
let app = require('app')
/**
 * !#zh 调试模块
 */
cc.Class({
	extends: require('BaseV'),

	properties: {
		
	},

	ctor (){
		app.busingV = this
	},

	onEnable (){
		// this.getComponentInChildren(cc.ParticleSystem).active = true
	},

	onDisable (){
		// this.getComponentInChildren(cc.ParticleSystem).active = false
	},
	
	editor: {
		executeInEditMode: true,
		playOnFocus: true,
	}
});
