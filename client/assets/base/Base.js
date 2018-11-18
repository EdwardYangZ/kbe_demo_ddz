

/**
 * !#zh 基础对象
 */
cc.Class({

	/* 等待一次事件触发 */
	forOnce(target, evtName){
		return new Promise(callback=>{
			target.once(evtName, callback, this)
		})
	},

	/* 触发通知的属性 set */
	emitSet (propName, val){
		this[propName] = val
		this.emit(propName)
	},

});
