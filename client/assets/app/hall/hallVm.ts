import { hallDdzM } from "../bases/hallDdzM";
import { kbeM } from "../bases/kbeM";

const {ccclass, property} = cc._decorator;
let app = require('../app')
let gameDdzM = require('../bases/gameDdzM')

@ccclass
export default class hallVm extends app.BaseVm {

	@property(cc.Node)
	btnGame = null

	@property(cc.Label)
	tNick = null

	@property(cc.Label)
	tGold = null

	onStart(){
		this.when(hallDdzM, 'nick', function () {
			this.tNick.string = hallDdzM.nick
		})()
		this.when(hallDdzM, 'gold', function () {
			this.tGold.string = hallDdzM.gold
		})()
		
		this.when(gameDdzM, 'enterGame', function () {
			cc.director.loadScene('game_ddz')
		})
		
		if (!kbeM.player) {
			kbeM.doLogin('test002', '123456', 'nick')
		}

		this.updGameLevel()
	}

	async updGameLevel(){
		await this.until(()=>!!kbeM.player && kbeM.player.className == 'Account')
		let levels = await kbeM.reqCall('reqGameLevel')
		this.btnGame.getComponent('Item').setDatas(levels, (item, cfg, idx)=>{
			let map = item.getComponent('Map')
			item.getComponent('StateSwitch').state = idx
			map.get('baseScore', 'FormatLabel').val = cfg.baseScore
			map.get('goldMin', 'FormatLabel').val = cfg.goldMin
			item.node.targetOff(this)
			item.node.on('click', function () {
				if (kbeM.player) {
					kbeM.reqCall('reqStartGame', 'GameDdz', idx)
				}
			}, this)
		})
	}
}

