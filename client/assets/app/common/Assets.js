
/* 
	公共资源库
*/
cc.Class({
	extends: require('BaseV'),

	properties: {
		debugVm: cc.Prefab,
		busingV: cc.Prefab,
	},

	// LIFE-CYCLE CALLBACKS:

	// onLoad () {},

	onStart () {
		this.initScene()
	},
	
	initScene (){
		let canvas = cc.director.getScene().children.filter(n=> !!n.getComponent(cc.Canvas))[0]
		if (!canvas){
			this.warn('must have cc.Canvas')
		}
		let common = canvas.getChildByName('common')
		if (!common) {
			common = new cc.Node('common')
			canvas.addChild(common)
		}
		if (!canvas.getChildByName('debugVm')) {
			canvas.addChild(cc.instantiate(this.debugVm))
		}
	},
	
	editor: {
		executeInEditMode: true,
		playOnFocus: true,
	}
	// update (dt) {},
});
