# -*- coding: utf-8 -*-
from KBEDebug import *
from Functor import *
import traceback
import Promise


class Entity:
	'''
	拓展 Entity, 必须用于 Base/cell 中的实体
	'''
	def onTimer(self, id, userArg):
		"""
		KBEngine method.
		使用addTimer后， 当时间到达则该接口被调用
		@param id		: addTimer 的返回值ID
		@param userArg	: addTimer 最后一个参数所给入的数据
		"""
		# DEBUG_MSG("onTimer(%d, %d)" % (id, userArg))
		self._timers = getattr(self, '_timers', {})
		callback = self._timers.get(id)
		if callable(callback):
			self.delTimer(id)
			self._timers.pop(id)
			try:
				callback()
			except Exception as e:
				ERROR_MSG('onTimer error:', e, traceback.print_exc())
		elif callback:
			try:
				getattr(self, callback)()
			except Exception as e:
				ERROR_MSG('onTimer error:', e, traceback.print_exc())
		else:
			self.delTimer(id)

	def delay(self, interval):
		''' 延迟调用, 可 async 调用 '''
		def _func(callback):
			self._timers = getattr(self, '_timers', {})
			timerID = self.addTimer(interval, 0, 0)
			self._timers[timerID] = callback
		return Promise.Promise(_func)

	def schedule(self, callName, interval):
		'''
		创建定时器
		@param callName : 定时器回调的成员函数名称，一个定时器对应一个函数
		@param interval : 定时器间隔
		'''
		assert hasattr(self, callName), 'method not found:' + callName
		self._timers = getattr(self, '_timers', {})
		timerID = self.addTimer(interval, interval, 0)
		self._timers[timerID] = callName

	def unschedule(self, callName):
		'''
		移除定时器
		'''
		self._timers = getattr(self, '_timers', {})
		for key, v in self._timers.items():
			if v == callName:
				self._timers.pop(key)
				return

	def request(self, owner, callName, callArgs=tuple()):
		''' 远程调用请求 '''
		self._requestID = getattr(self, '_requestID', 0)
		self._requestID += 1
		self._requests = getattr(self, '_requests', {})
		
		def _func(callback):
			self._requests[self._requestID] = callback
			if not isinstance(callArgs, tuple):
				owner.onRequest(callName, (callArgs, ), self, self._requestID)
			else:
				owner.onRequest(callName, callArgs, self, self._requestID)
		return Promise.Promise(_func)

	def onRequest(self, callName, callArgs, owner, requestID):
		''' 处理远程调用 '''
		func = getattr(self, callName, None)
		if not func:
			ERROR_MSG('onRequest error:', callName, callArgs, owner, requestID)
			return
		ret = func(*callArgs)
		if isinstance(ret, Promise.Promise):
			ret.then(Functor(owner.onResponse, requestID))
		else:
			owner.onResponse(requestID, ret)

	def onResponse(self, requestID, args):
		''' 远程调用结果 '''
		self._requests = getattr(self, '_requests', {})
		callback = self._requests.pop(requestID, None)
		if callback:
			callback(args)

	def getProps(self, keys):
		''' 得到属性值 '''
		return [getattr(self, k, None) for k in keys]

	def setProps(self, props):
		''' 设置属性值 '''
		for k, v in props.items():
			setattr(self, k, v)

	def call(self, callName, args=tuple()):
		''' 调用函数 '''
		if not isinstance(args, tuple):
			args = (args,)
		func = getattr(self, callName)
		func(*args)


class Base(Entity):
	'''
	Base 中的 Entity
	1. whenGetCell/whenLoseCell 等待 cell 创建和消耗的异步函数，可不再使用 onGetCell/onLoseCell
	'''
	def onGetCell(self):
		''' cell 创建成功的回调 '''
		if hasattr(self, '_getCellPromise'):
			self._loseCellPromise = Promise.Promise()
			self._getCellPromise.resolve(self.cell)

	def onLoseCell(self):
		''' cell 移除回调 '''
		if hasattr(self, '_loseCellPromise'):
			self._getCellPromise = Promise.Promise()
			self._loseCellPromise.resolve()

	def whenGetCell(self):
		''' async, 等待 cell 创建成功 '''
		if not hasattr(self, '_getCellPromise'):
			self._getCellPromise = Promise.Promise()
		return self._getCellPromise

	def whenLoseCell(self):
		''' async, 等待 cell 移除 '''
		if not hasattr(self, '_loseCellPromise'):
			self._loseCellPromise = Promise.Promise()
		return self._loseCellPromise
