


var hotupdCfg = cc.Class({
	extends: cc.Component,

	properties: {
		// pkgUrl: {
		// 	get: ()=> app.cfgUrl.checkPkg
		// },
		pkgVersion: '1.0',
		pathName: 'assets',
		manifestUrl: {
			default: null,
			type: cc.Asset,
		},
	},
});
