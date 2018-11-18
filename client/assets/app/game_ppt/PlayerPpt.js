
/**
 * !#zh 玩家
 * 显式声明 Kbe 中的属性配置
 */
var KBEngine = require('kbengine')
var GameObject = require('GameObject')

// 玩家角色
KBEngine.PlayerPpt = cc.Class({
	name: 'PlayerPpt',
	extends: GameObject,

	properties: {
		position: {
			default: cc.v2(200,0),
			type: cc.Vec2,
			notify (){
				this.emit('position')
			}
		},
		radius: 35,
		dir: {
			default: 0,
			notify (){
				this.emit('dir')
			}
		},
		speed: {
			default: 0,
			notify (){
				this.emit('speed')
			}
		},
		damping: {
			default: 800,
		},
		moveDir: {
			default: 0,
			notify (){
				this.emit('moveDir')
			}
		},
		isStoring: {
			default: 0,
			type: cc.Integer,
			tooltip: "是否蓄力",
			notify (){
				this.emit('isStoring')
			}
		},
		life: {
			default: 100,
			notify (){
				this.emit('life')
			}
		}
	},

	onEnterWorld(){
		
	},

	onLeaveWorld(){
		
	},

	setStoring (isStoring, targetPos){
		this.isStoring = isStoring
		if (targetPos != undefined && isStoring > 0) {
			this.dir = cc.pToAngle(cc.pSub(targetPos, this.position))
			this.log('this.dir', this.dir)
			this._storingFrom = cc.sys.now()
		}else
		if (isStoring == 0){
			let t = cc.sys.now() - this._storingFrom
			this.speed = 1000 * (cc.clamp01(t/2500))
			this.moveDir = this.dir
		}
	},

	// 与墙碰撞
	collideWall (wallSize){
		if (Math.abs(this.position.x) + this.radius < wallSize.width * 0.5
		&& Math.abs(this.position.y) + this.radius < wallSize.height * 0.5) {
			return
		}
		let dirX = Math.cos(this.moveDir)
		let dirY = Math.sin(this.moveDir)
		if (Math.abs(this.position.x) + this.radius >= wallSize.width * 0.5) {
			this.moveDir = Math.atan2(dirY, -dirX)
		}else
		if (Math.abs(this.position.y) + this.radius >= wallSize.height * 0.5) {
			this.moveDir = Math.atan2(-dirY, dirX)
		}
	},

	// 陷入墓地
	setInGrave (isInGrave){
		if (isInGrave) {
			this.damping = 3000
		}else{
			this.damping = 800
		}
	},

	update (t){
		if (this.isStoring) {
			
		}else
		if (this.speed > 0) {
			let a = -this.damping
			let speed = this.speed + a*t
			let dis = speed * t - (speed - this.speed) * t * 0.5
			this.speed = speed
			this.position = cc.pAdd(this.position, cc.v2(dis*Math.cos(this.moveDir), dis*Math.sin(this.moveDir)))
		}
		
	}
});

