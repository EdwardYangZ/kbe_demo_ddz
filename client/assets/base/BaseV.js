


/**
 * !#zh 基础组件封装
 */
var BaseV = cc.Class({
	extends: cc.Component,
	mixins: [
		require('Logger').Logger,
		require('Base')
	],

	checkComp (comp){
		var view = this.getComponent(comp)
		if (!view) {
			view = this.addComponent(comp)
		}
		return view
	},

	// 监听事件，target evtName 可设置多个
	when (target, evtName, callback, delay){
		if (Array.isArray(target)) {
			target.forEach(element => {
				this.when(element, evtName, callback, delay)
			});
			return callback.bind(this)
		}
		if (Array.isArray(evtName)) {
			evtName.forEach(element => {
				this.when(target, element, callback, delay)
			});
			return callback.bind(this)
		}
		cc.assert('on' in target)
		if (delay != undefined) {
			callback = this.delayCaller(callback, delay)
		}
		target.on(evtName, callback, this)
		return callback.bind(this)
	},

	delayCaller(callback, delay){
		if (delay == undefined) {
			delay = 0.1
		}
		return function (evt) {
			this.scheduleOnce(()=>{
				// if (evt != undefined) {
				// 	evt.detail = detail
				// }
				callback.call(this, evt)
			}, delay)
		}
	},

	/* 延迟调用 */
	delay(interval){
		return new Promise(callback=>{
			this.scheduleOnce(callback, interval)
		})
	},

	isStarted(){
		return !!this._isStarted
	},

	start () {
		this._isStarted = true
		try {
			this.onStart()
		} catch (error) {
			this.error(error.toString(), error.stack)
		}
	},

	/* 定时检查, 直到满足条件 */
	until(until, interval, timeout){
		return new Promise(callback=>{
			let ret = until()
			if (ret) {
				callback(ret)
				return
			}
			let begin = cc.sys.now()
			let _callback = null
			_callback = ()=>{
				if (timeout) {
					if (cc.sys.now() - begin >= timeout * 1000) {
						callback(false)
						return
					}
				}
				let ret = until()
				if (ret) {
					this.unschedule(_callback)
					callback(ret)
				}
			}
			this.schedule(_callback, interval || 0.3)
		})
	},

	forOnce(target, evtName, timeout){
		return new Promise(callback=>{
			if (timeout) {
				this.scheduleOnce(callback, timeout)
			}
			target.once(evtName, callback, this)
		})
	},

	// 自定义 start, try 保护
	onStart (){

	},
	
	editor: {
		executeInEditMode: false,
		playOnFocus: false,
		menu: 'base/BaseV'
	}
});

module.export = BaseV