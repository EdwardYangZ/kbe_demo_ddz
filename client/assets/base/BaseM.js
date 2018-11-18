
let BaseMComp = require('BaseMComp')

cc.Class({
    // extends: cc.Object,
	mixins: [
		require('Logger').Logger,
		require('Base'),
		cc.EventTarget
	],

	properties: {
	},

	ctor (){
		this._comps = {}
	},

	addComp (cls){
		if (typeof cls == 'string') {
			cls = require(cls)
		}else
		if (cc.isChildClassOf(cls, BaseMComp)) {
			let comp = new cls(this)
			this._comps[comp.name] = comp
			return comp
		}
	},

	getComp (comp){
		if (typeof comp == 'string') {
			return this._comps[comp]
		}
		return this._comps[comp.name]
	}
});
