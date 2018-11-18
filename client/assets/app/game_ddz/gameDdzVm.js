require('gameDdzM')
let app = require('app')

cc.Class({
	extends: require('BaseV'),

	properties: {
		gameDdzM: {
			get(){
				return app.gameDdzM
			}
		},
		playerDdzVms: [require('playerDdzV')],
		btnBack: cc.Node,
		btnJiao: cc.Node,
		btnJiaoNo: cc.Node,
		btnQiang: cc.Node,
		btnQiangNo: cc.Node,
		btnChangeRoom: cc.Node,
		cutdown: cc.Node,
		tCurRate: cc.Label,
		tBaseScore: cc.Label,
		bankerPoker: require('DiscardV'),
		bankerImg: cc.Node,
		viewSeats: [cc.Node],
	},

	onStart: function () {
		app.debugVm.addBtn( ()=> {
			app.kbeM.reqCall('reqStartDdz')
		}, '开始斗地主')
		app.debugVm.addBtn( ()=> {
			app.kbeM.reqCall('reqQuitRoom')
		}, '退出斗地主')

		this.initBtns()
		this.init()
	},

	initBtns (){
		this.when(this.btnJiao, 'click', function () {
			app.kbeM.reqCall('reqBankerJiao', 1)
			this.btnJiao.active = false
			this.btnJiaoNo.active = false
		})
		this.when(this.btnJiaoNo, 'click', function () {
			app.kbeM.reqCall('reqBankerJiao', 0)
			this.btnJiao.active = false
			this.btnJiaoNo.active = false
		})
		this.when(this.btnQiang, 'click', function () {
			app.kbeM.reqCall('reqBankerQiang', 1)
			this.btnQiang.active = false
			this.btnQiangNo.active = false
		})
		this.when(this.btnQiangNo, 'click', function () {
			app.kbeM.reqCall('reqBankerQiang', 0)
			this.btnQiang.active = false
			this.btnQiangNo.active = false
		})
		this.when(this.btnChangeRoom, 'click', function () {
			app.kbeM.reqCall('reqChangeRoom')
			this.btnChangeRoom.active = false
		})
		this.when(this.btnBack, 'click', function () {
			app.kbeM.reqCall('reqQuitRoom')
			cc.director.loadScene('hall')
		})
	},
	
	init (){
		this.when(app.gameDdzM, 'playerids', this.delayCaller(function () {
			let playersByView = app.gameDdzM.playersByView()
			this.playerDdzVms.forEach((v, idx) => {
				let player = playersByView[idx]
				v.node.active = !!player
				if (player) {
					v.setPlayer(player)
				}
			});
		}))();

		this.when(app.kbeM, 'onTurn', this.delayCaller(this.updBtns))();
		this.when(app.gameDdzM, 'started', this.updBtns)
		// this.when(app.gameDdzM, 'onLeaveWorld', function () {
		// 	cc.director.loadScene('hall')
		// })

		this.when(app.gameDdzM, 'curTurn', function () {
			this.updBtns()
			this.cutdown.active = app.gameDdzM.curTurn >= 0
			if (!this.cutdown.active) {
				return
			}
			let discard = this.playerDdzVms[app.gameDdzM.curTurn].discard
			this.cutdown.position = this.cutdown.parent.convertToNodeSpaceAR(discard.node.convertToWorldSpaceAR(cc.v2(0,0)))
		})()

		this.when(app.gameDdzM, 'turnCutdown', function () {
			this.updCutdown()
		})()

		this.when(app.gameDdzM, 'curRate', function () {
			this.tCurRate.string = app.gameDdzM.curRate
		})()
		this.when(app.gameDdzM, 'baseScore', function () {
			this.tBaseScore.string = app.gameDdzM.baseScore
		})()
		this.when(app.gameDdzM, 'bankerPoker', function () {
			this.bankerPoker.setPoker(app.gameDdzM.getBankerPoker())
		})()
		this.when(app.gameDdzM, 'bankerSeat', function () {
			let seatNode = this.viewSeats[app.gameDdzM.bankerSeat]
			this.bankerImg.active = !!seatNode
			if (this.bankerImg.active) {
				this.bankerImg.position = this.bankerImg.parent.convertToNodeSpaceAR(seatNode.convertToWorldSpaceAR(cc.v2(0,0)))
			}
		})()
	},

	updBtns (){
		this.btnJiao.active = app.gameDdzM.canJiaoState()
		this.btnJiaoNo.active = app.gameDdzM.canJiaoState()
		this.btnQiang.active = app.gameDdzM.canQiangState()
		this.btnQiangNo.active = app.gameDdzM.canQiangState()
		this.btnChangeRoom.active = app.gameDdzM.canQuitState()
		this.btnBack.active = app.gameDdzM.canQuitState()
	},

	updCutdown (){
		let cutdown = app.gameDdzM.turnCutdown
		this.unschedule(this.onTimeCutdown)
		this.cutdown.getComponentInChildren(cc.Label).string = String(cutdown)
		this.schedule(this.onTimeCutdown, 1, Math.ceil(cutdown))
	},

	onTimeCutdown (){
		let cutdown = Number(this.cutdown.getComponentInChildren(cc.Label).string)
		if (cutdown && cutdown > 0) {
			cutdown -= 1
		}
		if (cutdown <= 0) {
			this.cutdown.active = false
		}
		this.cutdown.getComponentInChildren(cc.Label).string = String(cutdown)
	},

});
