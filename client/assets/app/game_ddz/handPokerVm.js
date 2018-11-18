require('gameDdzM')
let CardV = require('CardV')
let app = require('app')

let isPicked = function (card) {
	return card.node.y > 0
}

cc.Class({
	extends: require('BaseV'),

	properties: {
		gameDdzM: {
			get(){
				return app.gameDdzM
			}
		},
		touchRect: cc.Node,
		touchAble: true,
		CardV: CardV,
		cardItem: {
			type: require('Item'),
			get (){
				if (!cc.isValid(this.node)) {
					return null
				}
				return this.CardV.getComponent('Item')
			}
		},
		btnDiscard: cc.Node,
		btnDiscardNo: cc.Node,
		btnHint: cc.Node,
	},

	onStart: function () {
		this.initTouch()
		this._updCardsIdx()

		// 更新牌
		let updPoker = this.delayCaller(function () {
			let poker = app.kbeM.player && app.kbeM.player.poker
			if (!poker) {
				poker = []
			}
			this.setPoker(poker)
			if (app.gameDdzM.isFapaiState()) {
				this.playFapai(poker)
			}
		})

		this.when(app.kbeM, 'onFapai', updPoker);
		this.when(app.gameDdzM, 'myHandPoker', updPoker)();

		// 庄家牌提起
		this.when(app.kbeM, 'onBankerPoker', this.delayCaller(function () {
			if (app.gameDdzM.bankerPoker.length > 0) {
				this.pickCards(app.gameDdzM.getBankerPoker(), true)
			}
		}, 0.2));

		this.when(app.gameDdzM, ['curTurn', 'started'], this.delayCaller(function () {
			this.btnDiscard.active = app.gameDdzM.canDiscardState()
			this.btnDiscardNo.active = app.gameDdzM.canDiscardState() && !app.gameDdzM.isFirstDiscard()
			this.btnHint.active = app.gameDdzM.canDiscardState()
		}))();

		this.when(this.btnDiscard, 'click', function () {
			let cards = this.getPickedPoker()
			this.log('cards', cards)
			app.kbeM.reqCall('reqDiscard', cards)
		})
		this.when(this.btnDiscardNo, 'click', function () {
			app.kbeM.reqCall('reqDiscard', [])
		})
		this.when(this.btnHint, 'click', function () {
			app.kbeM.reqCall('reqHintDiscard')
		})
		this.when(app.kbeM, 'reqHintDiscard', function (evt) {
			let poker = evt
			this.log('poker', JSON.stringify(poker))
			this.pickCards(this.getCardVs(), false)
			this.pickCards(app.gameDdzM.toCards(poker), true)
		})
		this.when(this.node, 'pickCards', function () {
			let cards = this.getPickedPoker()
			this.btnDiscard.getComponent(cc.Button).interactable = cards && cards.length > 0
		})()
	},

	getPickedPoker (){
		return this.getCardVs().filter(v => this.isPickedCard(v)).map(v => app.gameDdzM.fromCard(v.card))
	},

	// 设置牌
	setPoker (poker){
		this.cardItem.setDatas(poker, (v, card, idx)=>{
			card = app.gameDdzM.toCard(card)
			v.getComponent(CardV).card = card
		})
		this._updCardsIdx()
	},

	// 播放发牌
	playFapai (poker){
		this.cardItem.count = 0
		if (poker.length == 0) {
			return
		}
		let times = 0
		this.schedule(function () {
			times += 1
			this.cardItem.count = times
		}, 0.1, poker.length-1)
	},

	// 更新牌索引
	_updCardsIdx (){
		this.getCardVs().forEach((c, idx) => {
			c.idx = idx
		});
		this.pickCards(this.getCardVs(), false)
	},
	
	initTouch (){
		this.moveTimes = 0
		this.touchIdx = -1
		this.when(this.touchRect, 'touchstart', function (evt) {
			let card = this._getCardByTouch(evt.touch)
			if (card) {
				this.touchIdx = card.idx
				this._pickTouch = !isPicked(card)
			}
		})
		this.when(this.touchRect, 'touchmove', function (evt) {
			this.moveTimes += 1
		})
		this.when(this.touchRect, 'touchend', function (evt) {
			let card = this._getCardByTouch(evt.touch)
			let moveTimes = this.moveTimes
			let touchIdx = this.touchIdx
			this.moveTimes = 0
			this.touchIdx = -1
			if (moveTimes > 5 && touchIdx >= 0) {
				if (card && card.idx >= 0) {
					let low = card.idx >= touchIdx? touchIdx: card.idx
					let high = card.idx < touchIdx? touchIdx: card.idx
					let cards = this.getCardVs()
					for (let i = 0; i < cards.length; i++) {
						cc.log('i', i, cards[i].idx)
						if (i >= low && i <= high) {
							this.pickCards([cards[i]], this._pickTouch)
						}
					}
					return
				}
			}
			if (card) {
				this.pickCards([card])
			}
		})
		this.when(this.node, 'touchcancel', function (evt) {
			this.moveTimes = 0
			this.touchIdx = -1
		})
	},

	getCardVs (){
		return this.getComponentsInChildren('CardV').filter(c=> !!c.node.active)
	},

	// 根据触摸点获取 card
	_getCardByTouch (touch){
		if (!this.touchAble) {
			return
		}
		let cardVs = this.getCardVs()
		for (const c of cardVs.reverse()) {
			let p = c.node.convertTouchToNodeSpace(touch)
			if (p.x >= 0 && p.y >= 0 && p.x <= c.node.width && p.y <= c.node.height) {
				return c
			}
		}
	},

	pickCards (cards, isPick){
		let changed = false
		for (let i = 0; i < cards.length; i++) {
			let card = cards[i];
			if (!((card && card.node) instanceof cc.Node)) {
				card = this.getCardVs().find(c=> c.card === card)
			}
			if (!card) {
				continue
			}
			changed = true
			if (isPick == undefined) {
				card.node.y = this.isPickedCard(card)? 0: card.node.height * 0.2
			}else
			if (isPick) {
				card.node.y = card.node.height * 0.2
			}else{
				card.node.y = 0
			}
		}
		if (changed) {
			this.node.emit('pickCards')
		}
	},

	isPickedCard (card){
		return card.node.y > 5
	},

});
