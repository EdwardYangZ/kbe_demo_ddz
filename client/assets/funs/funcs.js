
require('zz')

zz.slice = function (list, from, to) {
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
}


/* 线性插值 */
zz.lerp = function (a, b, rate) {
	rate = zz.clamp01(rate)
	return a+rate*(b-a)
}

/* 限定浮点数的取值范围为 0 ~ 1 之间。 */
zz.clamp01 = function (value) {
    return value < 0 ? 0 : value < 1 ? value : 1;
}

/* 最大index */
zz.maxIndex = function (array) {
	var idx = -1
	for (let index = 0; index < array.length; index++) {
		const element = array[index];
		if (array[idx] === undefined || element > array[idx]) {
			idx = index
		}
	}
	return idx
}

/* 最小index */
zz.minIndex = function (array) {
	var idx = -1
	for (let index = 0; index < array.length; index++) {
		const element = array[index];
		if (array[idx] === undefined || element < array[idx]) {
			idx = index
		}
	}
	return idx
}

/* 拷贝元素 */
zz.copyAttrs = function (to, from, attrNames) {
	attrNames.forEach( attr => to[attr] = from[attr] )
}
