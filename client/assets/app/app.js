
let prop = require('prop')

var BaseVm = cc.Class({
	extends: require('BaseV'),
	properties: {
	},

	onLoad(){
		let name = cc.js.getClassName(this)
		if (!CC_EDITOR && cc.isValid(app[name])) {
			// cc.warn(name + " has exist", app[name])
		}
		app[name] = this
	},

	get(key, comp){
		if (!this.node) {
			return
		}
		let map = this.getComponent('Map')
		if (map) {
			return map.get(key, comp)
		}
	}
});

/**
 * !#zh app 根管理对象
 */
var App = cc.Class({
	extends: require('BaseM'),
	properties: {
		KBEngine: {
			get: function () {
				return require('kbengine')
			}
		}
	},

	ctor: function () {
		this.BaseM = require('BaseM')
		this.BaseV = require('BaseV')
		this.BaseVm = BaseVm
	},

	get(key){
		let obj = this[key]
		if (obj && cc.isValid(obj)) {
			return obj
		}
	},

	log(){
		if (this.sceneVm && cc.isValid(this.sceneVm)) {
			this.sceneVm.addLog.apply(this.sceneVm, arguments)
		}
	},

	/** 刷新控件属性装饰器 */
	upd_view(func) {
		return prop.notify(function (old, val, propKey) {
			if (func) {
				try {
					if (this.node && cc.isValid(this.node)) {
						func.call(this, old, val, propKey)
					}
				} catch (error) {
					cc.error(error.toString(), error.stack)
				}
			}
		})
	}

	// start: function (name) {
	// 	if (CC_EDITOR) {
	// 		return
	// 	}
	// 	cc.game.addPersistRootNode(this.node)
	// },
});

if (!window.app) {
	window.app = new App()
}
module.exports = app
