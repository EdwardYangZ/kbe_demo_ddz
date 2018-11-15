# -*- coding: utf-8 -*-


class Promise:
	'''
		仿 javascript 的 Promise 实现
		一个 Promise 有两个状态：未结束/结束，实例化的 promise 实例可以通过 then
		绑定多个监听回调，通过调用 resolve 来结束 promise, 将会回调所有监听，之后再调用
		then 的监听将会立即得到结果
		* 用法1
		promise = Promise()
		promise.then(callback)
		promise.resolve(0)
		* 用法2
		def _func(resolve):
			resolve(0)
		promise = Promise(_func)
		promise.then(callback)
	'''
	def __init__(self, func=None):
		self.funcs = []
		if func:
			func(self.resolve)

	def resolve(self, result=None):
		''' 结束 Promise, 传入结果参数，多次调用无效 '''
		if hasattr(self, 'result'):
			return
		self.result = result
		for func in self.funcs:
			func(self.result)

	def then(self, func):
		''' 监听结束回调，已经结束则立刻调用 '''
		if hasattr(self, 'result'):
			func(self.result)
		else:
			self.funcs.append(func)

	def __bool__(self):
		return not hasattr(self, 'result')
