
let app = require('app')
let hotupdCfg = require('hotupdCfg')

cc.Class({
	extends: require('BaseV'),

	properties: {
		tUpdInfo: cc.Label,
		updateM: {
			get (){
				return require('updateM')
			}
		}
	},

	onStart: function () {
		if (!cc.sys.isNative && !CC_EDITOR) {
			cc.director.loadScene("login");
			return;
		}
		var comp = this.getComponent(hotupdCfg) || this.addComponent(hotupdCfg)
		app.updateM.hotupdCfg = comp

		this.when(app.updateM, 'curUpd', this.updView)
		this.when(app.updateM, 'state', this.updView)

		this.schedule(function () {
			/* 进度条 */
			var isShowProgress =  app.updateM.state === 'upding'
			// this.updProgress = isShowProgress? app.updateM.updProgress: -1
		}, 0.5);

		// this.when(app.updateM, 'onPkgUpd_needUpd', ()=> {
		// 	this.doPop('请下载最新版本', function () {
				
		// 	}, cc.game.end)
		// });

		this.when(app.updateM, 'onHotupdEnd', ()=> {
			if (!cc.sys.isNative && !CC_EDITOR) {
				cc.director.loadScene("login");
				return;
			}
		});
		app.updateM.doStartHotUpd()
	},

	// doPop: function (content, callback) {
	// 	if (content) {
	// 		this.updatePop.active = true
	// 		zz.vset(this.updatePop, 'string', content)
	// 		this.updatePop.targetOff(this)
	// 		this.updatePop.once('onBtnOK', callback, this)
	// 	}
	// },

	updView: function () {
		var curUpd = app.updateM.curUpd
		var state = app.updateM.state
		var stateToStr = {
			pkg: '准备更新中，请稍后...',
			sure: '有新的版本...',
			upding: '更新中...',
			upd_fail: '更新失败...',
			upd_ok: '更新成功...',
			upd_end: '更新结束...',
		}
		zz.vset(this.tUpdInfo, 'string', stateToStr[state])

		/* 确认弹窗 */
		var showPop = state === 'sure' && !app.updateM.isSureUpd
		var closePop = state === 'upd_ok'
		if (showPop) {
			app.updateM.onHotupdUserSure()
			// zz.vset(this.updatePop, 'active', showPop)
			// this.doPop('检测到有新版本，是否下载更新？', function () {
			// 	app.updateM.isSureUpd = true
			// }, cc.game.end)
		}else if (closePop){
			// cc.director.loadScene('login')
			// zz.vset(this.updatePop, 'active', closePop)
			// zz.vset(this.updatePop, 'hideTips2', false)
			// this.doPop('更新完毕，请重新启动游戏！', function () {
			// 	cc.director.end();
			// }, cc.game.end)
		}else{
			// zz.vset(this.updatePop, 'active', false)
		}
	},

});
