

/**
 * !#zh 全局容器
 */
var zz = cc.Class({
	// extends: cc.Component,
	properties: {
	},

	ctor: function() {
	}
});


if (window.zz == undefined) {
    window.zz = zz
}

module.exports = zz
