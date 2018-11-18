

var UrlImg = cc.Class({
	/* 项， */
	extends: cc.Component,

	properties: function () {
		return {
			urlImgType: 'jpg',
			url: {
				get (){
					return this._url || ''
				},
				set (val){
					this._url = val
					let spriteFrame = new cc.SpriteFrame();
					this.getComponent(cc.Sprite).spriteFrame = spriteFrame
					this.getComponent(cc.Sprite).enabled = false
					if (!val) {
						return
					}
					cc.loader.load({url: val, type: this.urlImgType}, (err, texture) => {
						if (!err) {
							this.getComponent(cc.Sprite).enabled = true
							spriteFrame.setTexture(texture)
						}
						else {
							cc.warn("加载失败", err);
						}
					})
				}
			}
		}
	},

	
	editor: {
		menu: "usual/UrlImg",
		requireComponent: cc.Sprite,
	},
});


module.exports = UrlImg