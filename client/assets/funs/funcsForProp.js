require('funcs')

zz.asTest = function (opt) {
	opt.type = cc.Integer
	var data = opt.data
	var cases = opt.cases

	var curIdx = -1
	opt.get = function () {
		return curIdx
	}
	opt.set = function (idx) {
		var cs = cases[idx]
		curIdx = -1
		if (typeof cs === 'function') {
			curIdx = idx
			cc.log('test: filter', idx)
			try {
				cs.call(this, this, data)
			} catch (error) {
				cc.error(error.toString())
			}
		}
	}
	// opt.range = [-1,cases.length-1]
	return opt
}

zz.asCase = function () {
	let dict = {}
	dict.type = cc.Integer
	let cases = zz.slice(arguments).filter(v=> typeof(v)==='function')
	let curIdx = -1
	dict.get = function () {
		return curIdx
	}
	dict.set = function (idx) {
		var cs = cases[idx]
		curIdx = -1
		if (typeof cs === 'function') {
			curIdx = idx
			cc.log('test: filter', idx)
			try {
				cs.call(this, this)
			} catch (error) {
				cc.error(error.toString())
			}
		}
	}
	return dict
}

/* 懒加载属性（第一次使用时准备） */
// zz.asLazy = function (opt) {
// 	let name = opt.name
// 	let _name = '_$'+name
// 	let init = opt.init

// 	opt.get = function () {
// 		var 
// 	}
// }
