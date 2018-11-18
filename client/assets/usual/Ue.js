
/**
 * !#zh 交互控件
 */
cc.Class({
	extends: cc.Component,
	mixins: [
		require('Logger').Logger,
	],

	properties: {
		eventName: {
			default: 'click',
			tooltip: '需要绑定的事件名称: click.按钮点击 ',
		},
		goto: {
			default: '',
			tooltip: '事件发生后跳转场景, 填入场景名称',
		},
		activeNode:{
			default: null,
			type: cc.Node,
			tooltip: '事件发生后时目标节点 显示/隐藏',
		},
		prefabParent: cc.Node,
		prefab: {
			default: null,
			type: cc.Prefab,
			tooltip: '事件发生后时 prefabParent 下实例化该预制',
		},
		destroyNode: {
			default: null,
			type: cc.Node,
			tooltip: '事件发生后时目标节点 销毁目标',
		}
	},

	getTarget(){
		if (this.activeNode) {
			return this.activeNode
		}
		if (this.prefab && this.prefabParent) {
			return this.prefabParent.getChildByName(this.prefab.name)
		}
	},

	upd (){
		this.node.on(this.eventName, function () {
			if (this.goto) {
				cc.director.loadScene(this.goto)
				return
			}
			let evt = 'ue-show'
			if (this.activeNode) {
				this.activeNode.active = !this.activeNode.active
				if (!this.activeNode.active) {
					evt = "ue-hide"
				}
			}
			if (this.prefabParent && this.prefab) {
				let node = this.prefabParent.getChildByName(this.prefab.name)
				if (!node) {
					node = cc.instantiate(this.prefab)
					node.parent = this.prefabParent
				}
				node.active = true
			}
			if (this.destroyNode) {
				this.destroyNode.destroy()
				evt = "ue-hide"
			}
			this.node.emit(evt)
		}, this)
	},

	// 自定义 start, try 保护
	start (){
		try {
			this.upd()
		} catch (error) {
			cc.error(error.toString())
		}

		this.node.emit('start')
	},
	
	editor: {
		executeInEditMode: true,
		playOnFocus: false,
		menu: 'usual/Ue'
	}
});