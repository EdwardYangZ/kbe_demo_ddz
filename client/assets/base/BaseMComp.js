
// require('Base')

cc.Class({
    // extends: cc.Object,
	mixins: [
		require('Logger').Logger,
	],

	properties: {
		base: {
			visible: false,
			get (){
				return this.getBase && this.getBase()
			}
		}
	},

	__ctor__(model){
		this.getBase = function () {
			return model
		}
		this.onInit()
	},

	onInit(){

	}

});

