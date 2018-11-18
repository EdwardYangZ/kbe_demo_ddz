
let gamePptM = require('gamePptM')

cc.Class({
	extends: require('BaseV'),

	properties: {
		
	},

	onStart (){
		let rect = this.node.parent
		this.when(rect, cc.Node.EventType.TOUCH_START, function (evt) {
			this.log('touchstart')
			gamePptM.myPlayer().setStoring(1, this.node.parent.convertTouchToNodeSpaceAR(evt.touch))
			this._moveAct = 0
		})
		this.when(rect, cc.Node.EventType.TOUCH_END, function () {
			this.log('end')
			if (this._moveAct >= 0 && this._moveAct < 8) {
				gamePptM.myPlayer().setStoring(0)
			}else{
				gamePptM.myPlayer().setStoring(-1)
			}
		})
		this.when(rect, cc.Node.EventType.TOUCH_MOVE, function () {
			this._moveAct += 1
		})
	}
});
