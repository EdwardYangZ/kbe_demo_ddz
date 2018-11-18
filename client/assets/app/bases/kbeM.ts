
let app = require('../app')
var KBEngine = require('kbengine')
var BaseM = require('../../base/BaseM')
var prop = require('../../funs/prop')

/**
 * !#zh kbe model
 */
export class KbeM extends BaseM{
	ipList = ['192.168.1.5']
	ipIdx = 0
	get ip(){
		return this.ipList[this.ipIdx]
	}
	port = 20013

	get player(){
		return KBEngine.app && KBEngine.app.player()
	}

	@prop.emit()
	isLogining = false

	doLogin(account, pass, data){
		KBEngine.destroy()
		this.initKbe()
		KBEngine.Event.fire("login", account, pass, data)
		this.isLogining = true
		this.emit('logining')
		return new Promise( (resolve)=>{
			this.once('onLoginFailed', (failCode)=> {
				this.isLogining = this._checkLoginState()
				resolve(failCode)
			})
			this.once('onLoginOK', ()=> {
				this.isLogining = this._checkLoginState()
				resolve()
			})
			this.once('onConnectionState', evt=>{
				if (evt == false) {
					this.isLogining = this._checkLoginState()
					resolve('onConnectionState')
				}
			})
		})
	}

	_checkLoginState(){
		let socket = KBEngine.app && KBEngine.app.socket
		this.isLogining = !socket || socket.readyState != 1
		return this.isLogining
	}

	/* 重连 */
	doReconnect(){
		if (KBEngine.app) {
			if (KBEngine.app.reloginBaseapp()) {
				return true
			}
		}
	}

	/* 请求型调用 */
	reqCall(callName){
		if (!this.player) {
			return
		}
		let call = 'cellCall'
		if (callName in KBEngine.moduledefs[this.player.className].base_methods) {
			call = 'baseCall'
		}
		this.player[call].apply(this.player, arguments)
		return new Promise( (resolve, reject)=> {
			this.once(callName, function (evt) {
				let args = evt
				resolve(args)
			}, this)
		} )
	}

	handleEvent(callName, args){
		cc.log('kbe:', callName, args)
		if (args.length === 1) {
			args = args[0]
		}
		this.emit.apply(this, [callName, args])
	}
	
	initKbe () {
		if (KBEngine.app != undefined) {
			return
		}
		var args = new KBEngine.KBEngineArgs();
		args.ip = this.ip;
		args.port = this.port;
		KBEngine.create(args);
		cc.log('kbe 初始化：', KBEngine.app.ip)
	}

	getEntity (eid) {
		return KBEngine.app && KBEngine.app.findEntity(eid)
	}
}

export let kbeM = new KbeM()
app.kbeM = kbeM
