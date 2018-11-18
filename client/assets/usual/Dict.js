
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

var KeyVal = cc.Class({
	name: 'Dict.KeyVal',
	properties: {
		key: '',
		node: cc.Node,
		prop: {
			default: '',
			notify(){
				this.node = null
			}
		},
		val: {
			get (){
				if (this.prop && this.node) {
					try {
						return findGet(this.node, this.prop)
					} catch (error) {
						cc.warn(error)
					}
				}
				return false
			},
			set( val ){
				if (this.prop && this.node) {
					findSet(this.node, this.prop, val)
				}
			}
		}
	},
})

/**
 * !#zh 
 * @class Dict
 */
var Dict = cc.Class({
	/* 项， */
	extends: cc.Component,

	properties: function () {
		return {
			keyVals: {
				default: [],
				type: KeyVal,
			},
			dict:{
				get(){
					let dict = {}
					for (const keyVal of this.keyVals) {
						dict[keyVal.key] = keyVal.val
					}
					return dict
				},
				set(val){
					this.setDict(val)
				}
			},
		}
	},

	setDict (dict){
		if (cc.js.isString(dict)) {
			dict = JSON.parse(dict)
		}
		for (var i = 0; i < this.keyVals.length; i++) {
			var item = this.keyVals[i];
			var val = dict[item.key]
			if (this._setters && this._setters[item.key]) {
				val = this._setters[item.key](val)
			}
			if (val === undefined) {
				cc.warn('DictV: set dict value is undefined')
			}else{
				item.val = val
			}
		}
	},

	setByKey (key, val){
		for (const item of this.keyVals) {
			if (item.key === key) {
				if (this._setters && this._setters[item.key]) {
					val = this._setters[item.key](val)
				}
				if (val === undefined) {
					cc.warn('DictV: set dict value is undefined')
				}else{
					item.val = val
				}
			}
		}
	},

	getDict (){
		var dict = {}
		for (let i = 0; i < this.keyVals.length; i++) {
			var item = this.keyVals[i];
			if (item.key && item.node && item.prop) {
				const item = this.keyVals[i];
				dict[item.key] = item.val
			}
		}
		return dict
	},

	/* 得到 key 对应的 node 或组件 */
	getView: function (key, compType) {
		for (let i = 0; i < this.keyVals.length; i++) {
			var item = this.keyVals[i];
			if (item.key === key) {
				if (compType) {
					return item.node.getComponent(compType)
				}
				return item.node
			}
		}
	},

	/* 设置填充值 转换回调 将在 set 调用 */
	setSetter: function (key, callback) {
		if (this._setters == undefined) {
			this._setters = []
		}
		this._setters[key] = callback
	},
	
	editor: {
		menu: "common/Dict",
	},
});


module.exports = Dict