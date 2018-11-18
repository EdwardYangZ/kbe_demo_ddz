
/*
	[ts]通知属性装饰器
*/
function notify(func) {
	return function (target, propKey) {
		let realKey = '_$'+propKey
		let defaultVal = target[propKey]
		Object.defineProperty(target, propKey, {
			get(){
				if (this[realKey] == undefined) {
					this[realKey] = defaultVal
				}
				return this[realKey]
			},
			set(val){
				let old = this[propKey]
				this[realKey] = val
				func.call(this, old, val, propKey)
			}
		})
	}
}

/*
	[ts]触发事件属性, 对象包含 emit 方法才生效
*/
function emit(func) {
	return function (target, propKey) {
		return notify(function (old, val, propKey) {
			if (func) {
				func.call(this, old, val, propKey)
			}
			if (this.emit) {
				try {
					this.emit(propKey)
				} catch (error) {
					cc.error(error.toString(), error.stack)
				}
			}
		})(target, propKey)
	}
}

/*
	[js]倒计时属性, set时记录时间, get时减去逝去时间
	name: 属性名称
*/
function cutdown(opt){
	let name = opt.name
	let _name = '_'+name
	let tname = '__time_'+name
	opt.get = function () {
		if (this[tname] && this[_name]) {
			let now = cc.sys.now()
			let cur = this[_name] - (now - this[tname])/1000
			if (cur >= 0) {
				return cur
			}
			return 0 
		}
		return this[_name] || 0
	}
	opt.set = function (val) {
		if (val) {
			this[tname] = cc.sys.now()
		}
		this[_name] = val
	}
	return opt
}
module.exports = {
	notify: notify,
	cutdown: cutdown,
	emit: emit,
}
