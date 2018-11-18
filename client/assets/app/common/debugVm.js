
let app = require('app')
/**
 * !#zh 调试模块
 */
var debugVm = cc.Class({
	extends: require('BaseV'),

	properties: {
		btnTemp: cc.Node,
		tTemp: cc.Node,
	},

	ctor (){
		app.debugVm = this
	},
	
	/* 添加调试按钮 */
	addBtn (callback, btnName){
		if (CC_EDITOR) {
			return
		}
		let labels = this.getComponentsInChildren(cc.Label)
		if (labels.find(s=> s.string===btnName)) {
			return
		}
		let btn = cc.instantiate(this.btnTemp)
		btn.parent = this.node
		btn.active = true
		let s = btn.getComponentInChildren(cc.Label)
		s.string = btnName
		btn.on('click', callback)
		return btn
	},

	/* 添加调试文字 */
	addLabel (defaultStr){
		if (CC_EDITOR || !this.tTemp) {
			return
		}
		let label = cc.instantiate(this.tTemp)
		label.parent = this.node
		label.active = true
		label = label.getComponent(cc.Label)
		label.string = defaultStr
		return label
	},

	editor: {
		executeInEditMode: true,
		playOnFocus: true,
	}
});
