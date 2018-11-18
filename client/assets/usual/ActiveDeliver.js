
/* 得到某节点下包括组件的属性 */
let findGet = function (node, propName) {
	if (propName in node) {
		return node[propName]
	}
	for (const comp of node.getComponents(cc.Component)) {
		if (propName in comp) {
			return comp[propName]
		}
	}
}
/* 设置某节点下包括组件的属性 */
let findSet = function (node, propName, val) {
	if (propName in node) {
		node[propName] = val
		return
	}
	for (const comp of node.getComponents(cc.Component)) {
		if (propName in comp) {
			comp[propName] = val
			return
		}
	}
}


var ActiveDeliver = cc.Class({
	/* 监听事件传递值 */
	extends: cc.Component,

	properties: function () {
		return {
			targetNode: cc.Node,
			propName: {
				default: 'active',
				tooltip: "设置的属性名称, 遍历填充"
			},
			evtName: {
				default: '',
				tooltip: "事件名称"
			}
		}
	},

	onEnable(){
		if (this.targetNode && this.propName) {
			findSet(this.targetNode, this.propName, true)
		}
		if (this.evtName && this.targetNode) {
			this.targetNode.emit(this.evtName, true)
		}
	},

	onDisable(){
		if (this.targetNode && this.propName) {
			findSet(this.targetNode, this.propName, false)
		}
		if (this.evtName && this.targetNode) {
			this.targetNode.emit(this.evtName, false)
		}
	},
	
	editor: {
		menu: "usual/ActiveDeliver",
		executeInEditMode: true,
	},
});


module.exports = ActiveDeliver