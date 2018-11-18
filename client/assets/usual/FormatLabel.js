

var FormatLabel = cc.Class({
	/* 格式化 */
	extends: cc.Component,

	properties: function () {
		return {
			formatStr: {
				default: '',
				notify(){
					this.upd()
				}
			},
			val: {
				default: '',
				notify(){
					this.vals = [this.val]
				}
			},
			vals: {
				default: [],
				type: cc.String,
				notify(){
					this.upd()
				}
			}
		}
	},

	upd(){
		var str = ''
		try {
			str = cc.js.formatStr.apply(null, [this.formatStr].concat(this.vals) )
		} catch (error) {
			cc.log(error.toString())
		}
		this.getComponents(cc.Component).forEach(cmp => {
			if ('string' in cmp) {
				cmp['string'] = str
			}
		});
	},
	
	editor: {
		menu: "usual/FormatLabel",
	},
});


module.exports = FormatLabel