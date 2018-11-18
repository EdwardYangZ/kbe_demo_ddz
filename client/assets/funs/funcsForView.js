
require('zz')

/* 是否是 组件或者节点 */
zz.isView = function (view) {
	if (!cc.isValid(view) ) {
		return
	}
	if (!(view instanceof cc.Node) 
		&& !(view instanceof cc.Component)) {
		return
	}
	return view
}

/* 得到节点 */
zz.nodeV = function (view) {
	let node = view
	if (!(view instanceof cc.Node)) {
		node = cc.isValid(view.node) && view.node;
	}
	return node
}

/* 得到属性，节点和节点下所有组件 */
zz.vget = function (view, propName) {
	view = zz.isView(view)
	cc.assert(view, 'zz.vget', view, propName)
	if (propName.indexOf('@') > 0) {
		var [propName, comp] = propName.split('@')
		if (comp === 'cc.Node') {
			return zz.vget(zz.nodeV(view), propName)
		}
		return zz.vget(view.getComponent(comp), propName)
	}
	if (propName in view) {
		return view[propName];
	}
	if (propName in zz.nodeV(view)) {
		return zz.nodeV(view)[propName];
	}
	for (const iterator of view.getComponents(cc.Component)) {
		if (propName in iterator) {
			return iterator[propName];
		}
	}
	cc.assert(false, 'zz.vget', view, propName)
}


zz.vset = function (view, propName, val) {
	view = zz.isView(view)
	if (propName.indexOf('@') > 0) {
		var [propName, comp] = propName.split('@')
		if (comp === 'cc.Node') {
			zz.nodeV(view)[propName] = val
			return val
		}
		view.getComponent(comp)[propName] = val
		return val
	}
	if (propName in view) {
		return view[propName] = val;
	}
	if (propName in zz.nodeV(view)) {
		return zz.nodeV(view)[propName] = val;
	}
	for (const iterator of view.getComponents(cc.Component)) {
		if (propName in iterator) {
			return iterator[propName] = val;
		}
	}
	cc.assert(false, 'zz.vset', view, propName)
}


zz.vcall = function (view, propName) {
	var func = zz.vget(view, propName)
	return func.apply(view, zz.slice(arguments, 2))
}

/* 按幅度角旋转 */
zz.vRotateAngle = function (node, angle) {
	zz.vset(node, 'rotation', -angle*180/Math.PI)
}

/* 拷贝 Node 的属性 */
zz.vnCopyProps = function (node, fromNode) {
	var keys = [
		'name','x','y','name','width','height','rotation','scaleX','scaleY',
		'opacity','color','anchorX','anchorY'
	]
	zz.copyAttrs(node, fromNode, keys)
}
