
cc.Class({
	name: "Cfg",
	properties: {
		file: {
			type: cc.Asset,
			default: null,
		},
	},
	getCfg(){
		if (this._promise == undefined) {
			this._promise = new Promise((resolve, reject)=>{
				if (this.file) {
					cc.loader.load(this.file, (err, data)=> {
						if (err) {
							reject(err)
						}else{
							resolve(data)
						}
					});
				}else{
					reject('no file')
				}
			})
		}
		return this._promise
	}
});
