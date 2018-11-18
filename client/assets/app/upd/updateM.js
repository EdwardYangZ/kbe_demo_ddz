
let app = require('app')

/* 热更新管理模块 */
var updateM = cc.Class({
	name: 'updateM',
	extends: require('BaseM'),

	properties: {
		
		/* 热更新配置 */
		cfgUpdate: require('hotupdCfg'),
		
		/* 热更新管理器 */
		assetsManager: {
			visible: false,
			get: function () {
				if (!this._am && !CC_EDITOR && cc.sys.isNative && jsb.AssetsManager) {
					var manifestUrl = this._getCfg('manifestUrl');
					var storePath = this._getStorePath();
					if (manifestUrl && storePath) {
						this._am = new jsb.AssetsManager(manifestUrl, storePath);
						this._am.retain();
					}
				}
				return this._am
			}
		},

		/* pkg/ */
		curUpd: {
			default: '',
			tooltip: "pkg/hot",
			notify: function (old) {
				this.emit('curUpd')
			}
		},
		state: {
			default: '',
			tooltip: "check/sure/upding/upd_fail/upd_ok/upd_end",
			notify: function (old) {
				this.emit('state')
			}
		},
		isSureUpd: {
			default: false,
			tooltip: '是否确定更新',
			notify: function (old) {
				if (this.isSureUpd && this.state === 'sure') {
					this.onHotupdUserSure()
				}
			}
		},

		updProgress: -1
	},

	/* 开始包更新 */
	doStartPkgUpd: function () {
		if (CC_EDITOR) {
			return
		}
		cc.assert(this.state === 'upd_end' || !this.state, '状态错误')
		this.state = 'check'
		this.curUpd = 'pkg'
		this._requirer = app.httpM.requirer(this._getCfg('pkgUrl'), {})
		this._requirer.then(function (data) {
			this.log('data', data)
			var version = this._getCfg('pkgVersion')
			if (version !== data.bbh) {
				this.onPkgUpd_needUpd()
			}else{
				this.onPkgUpd_end()
			}
		}.bind(this), this.onPkgUpdError.bind(this))
	},

	/* 需要包更新 */
	onPkgUpd_needUpd: function () {
		this.emit('onPkgUpd_needUpd')
	},
	/* 包更新检查结束 */
	onPkgUpd_end: function () {
		this.state = 'upd_end'
		this.info('onPkgUpd_end')
		try {
			this.doStartHotUpd()
		} catch (error) {
			cc.info('error', error.toString())
		}
	},
	/* 包更新错误 */
	onPkgUpdError: function (info) {
		this.state = 'upd_fail'
		this.warn('onPkgUpdError', info)
	},

	doStartHotUpd: function () {
		if (CC_EDITOR || !cc.sys.isNative || cc.sys.platform == cc.sys.WIN32) {
			this.onHotupdEnd()
			return
		}
		this.state = 'check'
		var am = this.assetsManager
		cc.assert(am.getLocalManifest().isLoaded(), 'doStartHotUpd getLocalManifest')
		cc.log('doStartHotUpd')
		this._checkListener = new jsb.EventListenerAssetsManager(am, this.onHotupdChecked.bind(this));
		cc.eventManager.addListener(this._checkListener, 1);
		am.checkUpdate()
	},

	onHotupdChecked: function (event) {
		var code = event.getEventCode()
		switch (event.getEventCode())
		{
			case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
				this.onHotupdError('ERROR_NO_LOCAL_MANIFEST')
				break;
			case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
				this.onHotupdError('ERROR_DOWNLOAD_MANIFEST')
			case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
				this.onHotupdError('ERROR_PARSE_MANIFEST')
				break;
			case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
				
				this.onHotupdEnd()
				break;
			case jsb.EventAssetsManager.NEW_VERSION_FOUND:
				if (!this.isSureUpd) {
					this.state = 'sure'
				}
				else{
					this.onHotupdUserSure()
				}
				break;
			default:
				return
		}
		cc.eventManager.removeListener(this._checkListener);
	},

	onHotupdUserSure: function () {
		this.state = 'upding'
		this.updProgress = 0
		try {
			this._updateListener = new jsb.EventListenerAssetsManager(this._am, this.onHotupding.bind(this));
			cc.eventManager.addListener(this._updateListener, 1);

			this._failCount = 0;
			this._am.update();
		} catch (error) {
			this.error('onHotupdUserSure', error)
		}
	},

	/* 热更新检查 */
	onHotupding: function (event) {
		var needRestart = false;
		var failed = false;
		switch (event.getEventCode())
		{
			case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
				cc.log('No local manifest file found, hot update skipped.');
				failed = true;
				break;
			case jsb.EventAssetsManager.UPDATE_PROGRESSION:
				var percent = event.getPercent();
				var percentByFile = event.getPercentByFile();

				var msg = event.getMessage();
				if (msg) {
					cc.log(msg);
				}
				if (cc.js.isNumber(percent) && percent > 0) {
					this.updProgress = Math.floor(percent*10000)/10000
				}
				break;
			case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
			case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
				cc.log('Fail to download manifest file, hot update skipped.');
				failed = true;
				break;
			case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
				cc.log('Already up to date with the latest remote version.');
				failed = true;
				break;
			case jsb.EventAssetsManager.UPDATE_FINISHED:
				cc.log('Update finished. ' + event.getMessage());
				this.emit('onHotupdEnd')
				needRestart = true;
				break;
			case jsb.EventAssetsManager.UPDATE_FAILED:
				cc.log('Update failed. ' + event.getMessage());

				this._failCount ++;
				if (this._failCount < 5)
				{
					this._am.downloadFailedAssets();
				}
				else
				{
					cc.log('Reach maximum fail count, exit update process');
					this._failCount = 0;
					failed = true;
				}
				break;
			case jsb.EventAssetsManager.ERROR_UPDATING:
				cc.log('Asset update error: ' + event.getAssetId() + ', ' + event.getMessage());
				break;
			case jsb.EventAssetsManager.ERROR_DECOMPRESS:
				cc.log(event.getMessage());
				break;
			default:
				break;
		}

		if (failed) {
			cc.eventManager.removeListener(this._updateListener);
			this.state = 'upd_fail'
		}

		if (needRestart) {
			cc.eventManager.removeListener(this._updateListener);
			var searchPaths = jsb.fileUtils.getSearchPaths();
			var newPaths = this._am.getLocalManifest().getSearchPaths();
			Array.prototype.unshift(searchPaths, newPaths);
			cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));

			jsb.fileUtils.setSearchPaths(searchPaths);
			
			this.state = 'upd_ok'
			cc.game.restart();
		}
	},

	onHotupdEnd: function () {
		this.state = 'upd_end'
		this.info('onHotupdEnd')
		this.emit('onHotupdEnd')
	},

	onHotupdError: function (error) {
		this.state = 'upd_fail'
		this.info('onHotupdError', error)
		this.emit('onHotupdError', error)
	},

	_getCfg: function (cfgName) {
		if (this.hotupdCfg) {
			return this.hotupdCfg[cfgName]
		}
	},

	_getStorePath: function () {
		if (!jsb) {
			return
		}
		var storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + this._getCfg('pathName'));
		this.info('storagePath', storagePath)
		return storagePath
	}

});

app.updateM = new updateM()

module.exports = app.updateM
