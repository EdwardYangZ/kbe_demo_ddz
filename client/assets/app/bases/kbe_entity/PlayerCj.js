
/**
 * !#zh 玩家
 * 显式声明 Kbe 中的属性配置
 */
var KBEngine = require('kbengine')
var GameObject = require('GameObject')

// 玩家角色
KBEngine.PlayerCj = cc.Class({
	name: 'PlayerCj',
    extends: GameObject,

    properties: {
		cfgGravity: {
			tooltip: '重力加速度',
			default: -1300.0,
		},
		cfgRise: {
			tooltip: '上升加速度',
			default: 500.0,
		},
		nick: {
			default: '',
			notify (){
				// app.gameCjM.emit('playerids')
			}
		},
		seat: {
			default: 0,
			tooltip: '座位，1，2',
			type: cc.Integer
		},
		y: {
			default: 0,
			type: cc.Float,
			notify (){
				this.emit('y')
			}
		},
		yv: {
			default: 0,
			tooltip: '速度',
			type: cc.Float,
			notify (old){
				this.emit('yv')
			}
		},
		isRising: {
			get(){
				return this.yv > 0? 1:(this.yv < 0 ? -1:0)
			}
		},
		ya: {
			default: 0,
			tooltip: '速度',
			type: cc.Float,
			notify (){
				this.emit('ya')
			}
		},
		rise: {
			default: 0,
			notify (){
				this.emit('rise')
			}
		},
		hasBuffLife: {
			default: 0,
			notify (){
				this.emit('hasBuffLife')
			}
		},
		width: {
			get (){
				// return app.gameCjM.cfgPlayerSize.width
			}
		},
		height: {
			get (){
				// return app.gameCjM.cfgPlayerSize.height
			}
		},
		dead: {
			default: 0,
			notify (){
				this.emit('dead')
			}
		},
		life: {
			default: 0,
			type: cc.Integer,
			notify (){
				this.emit('life')
			}
		}
	},

	onEnterWorld(){
		// if (KBEngine.app.entity_id === this.id) {
		// 	app.gameCjM.state = 1
		// }
		// app.gameCjM.emit('playerids')
	},

	update (time){
		if (!this.yv && ! this.ya) {
			return
		}
		let y = this.y + this.yv * time
		if (this.ya) {
			this.yv += this.ya * time
			y += 0.5 * this.ya * time * time
		}
		this.y = y
		if (this.y < 0) {
			this.yv = 0
			this.ya = 0
			this.y = 0
		}
	}
});

