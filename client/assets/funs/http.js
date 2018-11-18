
/*
	填入 http 请求的参数
	返回一个 promise 对象
	url:
	POST:
	GET:
	data:
	timeout:
*/
module.exports = function (opt) {
	let url = opt.url
	let POST = opt.POST
	let GET = opt.GET || !POST
	let data = opt.data
	var xhr = cc.loader.getXMLHttpRequest();
	xhr.timeout = opt.timeout || 5000;
	let dataRaw = null
	if (GET) {
		let idx = 0
		for (const key in data) {
			if (data.hasOwnProperty(key)) {
				const element = data[key];
				if (idx > 0) {
					url += '&'
				}else{
					url = url+'?'
				}
				idx += 1
				url += key + '=' + String(element)
			}
		}
		cc.log('url', url)
		xhr.open("GET", url, true)
	}else{
		dataRaw = POST(data)
		xhr.open("POST", url, true)
	}
	return new Promise( (resolve, reject)=> {
		xhr.onreadystatechange = ()=> {
			try {
				// cc.assert(xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300), '状态错误'+xhr.status)
				// cc.assert(xhr.responseText == 1, xhr.responseText)
				if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {
					cc.log("http res("+ xhr.responseText.length + "):" + xhr.responseText);
					resolve(xhr.responseText);
				}
			} catch (e) {
				cc.error("err:" + e.toString(), );
				reject(e, xhr.responseText)
			}
		};
		xhr.send(dataRaw);
	} )
}
