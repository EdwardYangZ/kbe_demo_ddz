
/**
 * !#zh 
 * @class Map
 */
var Map = cc.Class({
	/* 项， */
	extends: cc.Component,

	properties: {
		map: {
			default: [],
			type: cc.Class({
				name: 'Map.keyNode',
				properties: {
					key: '',
					node: cc.Node
				},
			})
		}
	},

	get(key, comp){
		for (const it of this.map) {
			if (key == it.key) {
				if (comp != undefined) {
					return it.node.getComponent(comp)
				}
				return it.node
			}
		}
		// cc.warn(this.map.map(a=>a.key), 'no key:', key)
	},

	getComp(key, comp){
		let node = this.get(key)
		if (!node) {
			cc.error('getComp node is null', key, comp)
		}
		return node.getComponent(comp)
	},

	editor: {
		menu: "usual/Map",
	},
});


module.exports = Map