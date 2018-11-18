
const {ccclass, property, mixins} = cc._decorator;


export class Logger {
	getProps () {
		var map = {}
		var keys = this.getPropKeys()
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			map[key] = this[key]
		}
		return map
	}

	getPropKeys () {
		var cls = cc.Class.Attr.getClassAttrsProto(this.constructor)
		var keys = []
		var map = {}
		for (const key in cls) {
			if (cls.hasOwnProperty(key)) {
				if (key.indexOf(cc.Class.Attr.DELIMETER) > 0) {
					var k = key.split(cc.Class.Attr.DELIMETER)[0]
					if (!(k in map)) {
						keys.push(k)
						map[k]= true
					}
				}
			}
		}
		return keys
	}

	toString () {
		var output = '---' + this._getLogHead()
		return output+'---'
	}

	getLogInfo () {
		return this._getLogHead()+':'+ this.getPropStr()
	}

	getPropStr () {
		var output = '{'
		var keys = this.getPropKeys()
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			output += ', '+ key + ':' + this[key]
		}
		return output+'}'
	}

	_getLogHead () {
		return '<'+this.constructor.name+'>'
	}

	_getLogs (...inputs) {
		var args = [this._getLogHead(), ':']
		for (var i = 0; i < inputs.length; i++) {
			var arg = inputs[i];
			if (Array.isArray(arg)) {
				args.push(String(arg))
			}else{
				if (typeof arg === 'object' && 'getLogInfo' in arg) {
					args.push(arg.getLogInfo())
				}else{
					try {
						args.push(JSON.stringify(arg))
					} catch (error) {
						args.push(String(arg))
					}
				}
			}
		}
		return args
	}

	log (...inputs) {
		// if (this.$$showLog === false) {
		// 	if (!CC_EDITOR) {
		// 		return
		// 	}
		// 	if (this._$logCaches == undefined) {
		// 		this._$logCaches = []
		// 	}
		// 	this._$logCaches.push(arguments)
		// 	return
		// }
		try {
			cc.log.apply(null, this._getLogs.apply(this, inputs))
		} catch (error) {
			// cc.log.apply('error', arguments)
		}
	}
	info (...inputs) {
		try {
			cc.log.apply(null, this._getLogs.apply(this, inputs))
		} catch (error) {
			// cc.log.apply('error', arguments)
		}
	}
	warn (...inputs) {
		try {
			cc.warn.apply(null, this._getLogs.apply(this, inputs))
		} catch (error) {
			// cc.warn.apply('error', arguments)
		}
	}
	error (...inputs) {
		try {
			cc.error.apply(null, this._getLogs.apply(this, inputs))
		} catch (error) {
			// cc.error.apply('error', arguments)
		}
	}
}
