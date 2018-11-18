
/**
 * !#zh 对象池
 */
cc.Class({
	extends: cc.Component,
	mixins: [
		require('Logger').Logger,
	],

	properties: {
		idx: -1,
		pool: {
			visible: false,
			get(){
				if (CC_EDITOR) {
					return
				}
				if (!this.mould) {
					return this.getMouldItem().pool
				}
				if (this._pool == undefined) {
					this._pool = new cc.NodePool()
				}
				return this._pool
			}
		},
		mould: true,
	},

	ctor(){
		this._items = {}
		this._idPool = -1
	},

	getMouldItem(){
		if (this.mould) {
			return this
		}
		return this._mouldItem
	},

	getItems(){
		let mould = this.getMouldItem()
		let items = []
		for (const key in mould._items) {
			if (mould._items.hasOwnProperty(key)) {
				const element = mould._items[key];
				if (cc.isValid(element)) {
					items.push(element)
				}
			}
		}
		return items
	},

	onLoad(){
		if (this.mould) {
			this.node.active = false
		}
	},

	newItem(parent){
		let node = null
		let mouldItem = this.getMouldItem()
		if (!mouldItem) {
			return
		}
		let pool = mouldItem.pool
		if (pool.size() > 0) {
			node = pool.get()
		}else{
			node = cc.instantiate(mouldItem.node)
			mouldItem._idPool += 1
			node.getComponent('Pool').idx = mouldItem._idPool
		}
		let item = node.getComponent('Pool')
		item.mould = false
		item._mouldItem = mouldItem
		if (!parent) {
			parent = mouldItem.node.parent
		}
		node.parent = parent
		node.active = true
		mouldItem._items[item.idx] = node
		mouldItem.node.emit('newItem', node)
		if (item._newHandler) {
			item._newHandler()
		}
		return node
	},

	getItemCount(){
		let count = 0
		let items = this.getMouldItem()._items
		for (const key in items) {
			if (items.hasOwnProperty(key)) {
				if (items[key]) {
					count += 1
				}
			}
		}
		return count
	},

	delItem(){
		if (!cc.isValid(this.node)) {
			return
		}
		if (this.mould) {
			return
		}
		let item = this.getMouldItem()
		if (!item) {
			return
		}
		item._items[this.idx] = null
		// this.node.active = false
		item.node.emit('delItem', this.node)
		this.node.stopAllActions()
		this.pool.put(this.node)
		if (item._delHandler) {
			item._delHandler()
		}
		return true
	},

	setHandler(newHandler, delHandler){
		this._newHandler = newHandler
		this._delHandler = delHandler
	},

	editor: {
		executeInEditMode: false,
		playOnFocus: false,
		menu: 'usual/Pool'
	}
});