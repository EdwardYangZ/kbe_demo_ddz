
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
});
