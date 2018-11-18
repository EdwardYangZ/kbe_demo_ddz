
/**
 * !#zh 
 * @class StateSwitch
 */
module.exports = cc.Class({
	/* 项， */
	extends: cc.Component,

	properties: function () {
		return {
			state: {
				default: 0,
				type: cc.Integer,
				notify (old){
					if (this.state != old) {
						this.flush()
					}
				}
			},
			spriteFrames: [cc.SpriteFrame],
			colors: [cc.Color],
			strings: {
				default: [],
				type: cc.String,
				multiline: true,
			},
		}
	},

	flush (){
		let spriteFrame = this.spriteFrames[this.state]
		if (spriteFrame != undefined) {
			this.getComponent(cc.Sprite).spriteFrame = spriteFrame
		}
		let color = this.colors[this.state]
		if (color) {
			this.node.color = color
		}
		let str = this.strings[this.state]
		if (str != undefined) {
			this.getComponent(cc.Label).string = str
		}
	},

	onEnable (){
		this.flush()
	},
	
	editor: {
		menu: "usual/StateSwitch",
		executeInEditMode: true,
		playOnFocus: true,
	},
});