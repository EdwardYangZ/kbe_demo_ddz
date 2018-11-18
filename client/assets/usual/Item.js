

/**
 * !#zh 列表型 Item: 面向编辑器的模版行为; 数据填充
 * @class VItem
 */
var Item = cc.Class({
	/* 项， */
	extends: cc.Component,

	properties: function () {
		return {
			mould: {
				default: true,
				tooltip: '模板Item, 样式修改请在其进行，然后再选择同步'
			},
			
			count: {
				default: 1,
				type: cc.Integer,
				tooltip: '[editor], item数量, 复制自身, 只有 mould 为 true 有效',
				notify: function (val) {
					if (this.count > this.maxCount) {
						this.count = this.maxCount
						cc.warn('超过最大数量限制', this.maxCount)
						return
					}
					if (this.count !== val) {
						this._updViews(this.count)
					}
				}
			},

			datas: {
				default: null,
				visible: false,
				notify(){
					if (this.mould) {
						this.setDatas(this.datas)
					}
				}
			},
	
			/**
			 * !#zh 最大数量限制
			 */
			maxCount: {
				default: 50,
				tooltip: '最大数量限制',
			},

			items: {
				type: Item,
				get: function () {
					if (this.mould) {
						return this.getItems()
					}
				}
			},

			updItems: {
				displayName: '更新其他Item',
				tooltip: '[editor], 触发更新操作',
				get (){return false},
				set (){
					if (!this.mould && !CC_EDITOR) {
						cc.warn('updItems not is mould')
					}else{
						var items = this._allViews()
						if (!Array.isArray(items)) {
							return
						}
						items.forEach(item => {
							if (item.mould) {
								return
							}
							var newItem = cc.instantiate(this.node)
							newItem.getComponent('Item').mould = false
							newItem.parent = item.node.parent
							var keys = [
								'name','x','y','name','width','height','rotation','scaleX','scaleY',
								'opacity','color','anchorX','anchorY'
							]
							for (const key of keys) {
								newItem[key] = item.node[key]
							}
							item.node.destroy()
							cc.log('item upd ok')
						})
					}
				}
			},
		}
	},

	ctor: function () {
		this._items = []
	},

	setDatas: function (datas, callback) {
		if (!Array.isArray(datas)) {
			datas = new Array(datas)
		}
		if (!this.mould) {
			return
		}
		if (!callback) {
			callback = this.onItemUpd
		}
		this.count = datas.length
		var views = this._allViews()
		for (var i = 0; i < datas.length; i++) {
			var view = views[i];
			callback(view, datas[i] == undefined? i: datas[i], i)
		}
	},

	onItemUpd(item, data){
		let dict = item.getComponent('Dict')
		if (dict) {
			dict.dict = data
		}
	},

	onItemEnable(item){
		item.node.active = true
	},

	onItemDisable(item){
		item.node.active = false
	},

	getItems: function () {
		return this._allViews()
	},

	_allViews: function () {
		var items = this.node.parent.children.map(c => c.getComponent(this.constructor)).filter(c=>!!c && c.node.name == this.node.name)
		return items.filter(it=> !!it)
	},

	/* 更新列表view */
	_updViews: function (count) {
		if (!this.mould) {
			return
		}
		var views = this._allViews()
		for (var i = 0; i < count; i++) {
			var vitem = views[i]
			if (!vitem) {
				vitem = cc.instantiate(this.node)
				vitem.parent = this.node.parent
				vitem = vitem.getComponent(Item)
				vitem.mould = false
			}
			this.onItemEnable(vitem)
		}
		for (var j = count; j < views.length; j++) {
			this.onItemDisable(views[j])
		}
	},

	getMouldItem(){
		return this._allViews().find(a=>a.mould==true)
	},

	editor: {
		menu: "usual/Item",
	},
	
});


module.exports = Item