

let KBEngine = require('kbengine')
let app = require('app')
require('kbeM')
require('PlayerDdz')
require('GameDdz')


let MAX_SEAT = 3

// 
let gameDdzM = cc.Class({
	name: 'gameDdzM',
	extends: require('BaseM'),

	properties: {
		playerids: {
			default: [],
			type: cc.Integer,
			notify (){
				this.emit('playerids')
			}
		},
		baseScore: {
			default: 0,
			type: cc.Integer,
			notify (){
				this.emit('baseScore')
			}
		},
		started: {
			default: 0,
			type: cc.Integer,
			notify (){
				this.emit('started')
			}
		},
		bankerSeat: {
			default: -1,
			type: cc.Integer,
			notify (){
				this.emit('bankerSeat')
			}
		},
		bankerPoker: {
			default: [],
			type: cc.Integer,
			notify (old){
				this.emit('bankerPoker')
			}
		},
		curRate: {
			default: 0,
			type: cc.Integer,
			notify (){
				this.emit('curRate')
			}
		},
		curTurn: {
			default: -1,
			type: cc.Integer,
			notify (){
				this.emit('curTurn')
			}
		},
		turnCutdown: {
			default: -1,
			notify (){
				this.emit('turnCutdown')
			}
		},
	},

	getBankerPoker(){
		return this.bankerPoker.map(a => this.toCard(a))
	},

	allPlayers (){
		return this.playerids.map(id=> app.kbeM.getEntity(id)).filter(e=>!!e)
	},

	/* 数据转换 */
	toCard (card){
		if (card >= 160 && card < 170) {
			card -= 140
		}else
		if (card >= 170){
			card -= 10
		}
		return card
	},

	toCards (cards) {
		return cards.map(a=> this.toCard(a))
	},

	fromCard (card){
		if (card < 30) {
			card += 140
		}else
		if (card >= 160) {
			card += 10
		}
		return card
	},

	ctor (){
		
	},

	mySeat (){
		let player = app.kbeM.player
		if (player) {
			return player.seat
		}
	},

	/* 发牌状态 */
	isFapaiState (){
		return this.started === 1
	},

	canJiaoState (){
		return this.started === 2 && this.curTurn == this.mySeat()
	},

	canQiangState (){
		return this.started === 3 && this.curTurn == this.mySeat() && this.bankerSeat < 0
	},

	canDiscardState (){
		return this.started === 4 && this.curTurn == this.mySeat()
	},

	canQuitState (){
		return this.started === 0 || this.started === 6
	},

	/* 是否是第一个出牌 */
	isFirstDiscard (){
		return this.allPlayers().every(p=> p.discard.length == 0)
	},

	toViewSeat (seat){
		if (seat < 0) {
			return seat
		}
		let mySeat = this.mySeat()
		if (mySeat != undefined) {
			seat -= mySeat
			if (seat < 0) {
				seat = MAX_SEAT + seat
			}
		}
		return seat
	},

	// 经过座位转换后的玩家
	playersByView (){
		let players = this.allPlayers()
		let playersView = {}
		for (const player of players) {
			playersView[this.toViewSeat(player.seat)] = player
		}
		return playersView
	},

});
app.gameDdzM = new gameDdzM()

module.exports = app.gameDdzM
