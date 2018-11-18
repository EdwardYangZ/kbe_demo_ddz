
/**
 * !#zh 拖动控件
 */
cc.Class({
	extends: cc.Component,
	mixins: [
		require('Logger').Logger,
	],

	properties: {
		
	},

	ctor(){
		this._fromPos = null
	},

	// 自定义 start, try 保护
	start (){
		this.node.on('touchstart', function (evt) {
			this._fromPos = this.node.position
			var touchPos = evt.touch.getLocation()
			this.node.emit('drag-start', touchPos)
		}, this)

		this.node.on('touchmove', function (evt) {
			var touchPos = evt.touch.getLocation()
			var old = evt.touch.getStartLocation()
			this.node.position = this._fromPos.add( touchPos.sub(old))
		}, this)

		this.node.on('touchend', function (evt) {
			var touchPos = evt.touch.getLocation()
			this.node.position = this.node.parent.convertToNodeSpaceAR(touchPos)
			this.node.emit('drag-end', touchPos)
		}, this)

		this.node.on('touchcancel', function (evt) {
			this.node.position = this._fromPos
		}, this)
	},

	editor: {
		menu: 'usual/Drag'
	}
});