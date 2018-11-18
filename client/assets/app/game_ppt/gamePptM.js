

let KBEngine = require('kbengine')
require('kbeM')
require('PlayerPpt')

// 
let gamePptM = cc.Class({
	name: 'gamePptM',
	extends: require('BaseM'),

	properties: {
		playerids: {
			default: [],
			type: cc.Integer,
			notify (){
				this.emit('playerids')
			}
		},
		
	},

	getPlayer (id){
		return this._players[id]
	},

	myPlayer (){
		if (this._myPlayer == undefined) {
			this._myPlayer = new KBEngine.PlayerPpt()
			this._myPlayer.id = 10
			this._players[10] = this._myPlayer
		}
		return this._myPlayer
	},

	ctor (){
		this._players = {}
		this.grave = {
			position: cc.v2(0,0),
			radius: 90,
		}
	},

	players (){
		let players = []
		for (const key in this._players) {
			if (this._players.hasOwnProperty(key)) {
				const p = this._players[key];
				players.push(p)
			}
		}
		return players
	},

	isCollide (player, other) {
		if (other.radius) {
			let r = other.radius + player.radius
			return cc.pDistanceSQ(player.position, other.position) <= r * r
		}
	},

	update(t){
		for (const k in this._players) {
			if (this._players.hasOwnProperty(k)) {
				let p = this._players[k]
				p.update(t)
				p.setInGrave(this.isCollide(p, this.grave))
				p.collideWall(cc.size(1000, 550))
			}
		}
	},

});

module.exports = new gamePptM()