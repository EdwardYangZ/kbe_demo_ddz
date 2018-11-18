
let app = require('app')
cc.Class({
	extends: require('BaseV'),

	properties: {
		goldImg: cc.Node,
		viewSeats: [cc.Node],
		test: {
			type: cc.Integer,
			get(){return -1},
			set (val){
				if (val == 0) {
					this.playSettleGold([-1, -1, 1])
				}
				if (val == 1) {
					this.playSettleGold([-1, 11, 1])
				}
			}
		},
		changeText: require('Item')
	},

	onStart (){
		this.changeText.count = 0
		this.goldImg.count = 0
		this.when(app.kbeM, 'onSettle', this.delayCaller(function () {
			let players = app.gameDdzM.playersByView()
			let golds = []
			for (let i = 0; i < 3; i++) {
				golds.push(players[i].settle)
			}
			this.playSettleGold(golds)
		}))
	},
	
	playSettleGold (golds){
		let winNodes = this.viewSeats.filter((v, i)=> golds[i] >= 0)
		let loseNodes = this.viewSeats.filter((v, i)=> golds[i] < 0)
		let dou = 40
		let theItem = this.goldImg.getComponent('Item')
		theItem.setDatas(theItem.maxCount, (item, i)=> {
			let win = i < theItem.maxCount/2? winNodes[0]: winNodes[winNodes.length - 1]
			let toP = item.node.parent.convertToNodeSpaceAR(win.convertToWorldSpaceAR(cc.v2(0,0)))
			let lose = i < theItem.maxCount/2? loseNodes[0]: loseNodes[loseNodes.length - 1]
			let fromP = item.node.parent.convertToNodeSpaceAR(lose.convertToWorldSpaceAR(cc.v2(0,0)))
			item.node.stopAllActions()
			item.node.runAction(cc.sequence(
				cc.hide(),
				cc.delayTime(0.05*i),
				cc.fadeIn(0.2),
				cc.place(cc.v2(fromP.x + (Math.random()-0.5)*dou, fromP.y + (Math.random()-0.5)*dou)),
				cc.show(),
				cc.moveTo(0.6, cc.v2(toP.x + (Math.random()-0.5)*dou, toP.y + (Math.random()-0.5)*dou)),
				cc.fadeOut(0.3),
				cc.hide(),
				cc.callFunc(()=> {
					if (i == theItem.maxCount - 1) {
						theItem.count = 0
					}
				})
			))
		})
		this.changeText.setDatas(golds, (item, gold, idx)=> {
			let node = this.viewSeats[idx]
			item.node.position = item.node.parent.convertToNodeSpaceAR(node.convertToWorldSpaceAR(cc.v2(0,0)))
			item.getComponent(cc.Label).string = gold>=0? '+'+gold: gold
			item.getComponent('StateSwitch').state = gold>=0? 1: 0
			item.node.runAction(cc.sequence(
				cc.hide(),
				cc.delayTime(gold>=0? 1.2: 0.2),
				cc.show(),
				cc.fadeIn(0.5),
				cc.delayTime(3),
				cc.fadeOut(0.3),
				cc.callFunc(()=> {
					if (idx == 2) {
						this.changeText.count = 0
					}
				})
			))
		})
	},
});
