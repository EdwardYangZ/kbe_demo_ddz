
/* 正态分布 */
function getNumberInNormalDistribution(mean,std_dev){
	return mean+(randomNormalDistribution()*std_dev);
}

function randomNormalDistribution(){
	var u=0.0, v=0.0, w=0.0, c=0.0;
	do{
		//获得两个（-1,1）的独立随机变量
		u=Math.random()*2-1.0;
		v=Math.random()*2-1.0;
		w=u*u+v*v;
	}while(w==0.0||w>=1.0)
	//这里就是 Box-Muller转换
	c=Math.sqrt((-2*Math.log(w))/w);
	//返回2个标准正态分布的随机数，封装进一个数组返回
	//当然，因为这个函数运行较快，也可以扔掉一个
	//return [u*c,v*c];
	return u*c;
}


module.exports = {
	/*
		列表切片
	*/
	slice (list, from, to) {
		from = from? from: 0
		to = to? to: list.length
		if (to < 0) {
			to = list.length - to
		}
		var args = []
		for (var i = from; i < to; i++) {
			args.push(list[i])
		}
		return args
	},

	/*
		时间格式化, 将秒转换为 xhxmxs
	*/
	timeFormat(sec){
		let h = Math.floor(sec/3600)
		let m = Math.floor((sec-h*3600)/60)
		let s = Math.round(sec-h*3600-m*60)
		h = h < 10? "0"+h: h
		m = m < 10? "0"+m: m
		s = s < 10? "0"+s: s
		return cc.js.formatStr('%sh%sm%ss', h, m, s)
	},

	getNumberInNormalDistribution: getNumberInNormalDistribution
}
