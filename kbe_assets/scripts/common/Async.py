# -*- coding: utf-8 -*-
from Functor import *
import types
from collections import Iterator
import Promise


class async_func:
    """
    仿 javascript async/await 异步函数装饰器，函数中可以配合 Promise 实现异步调用同步化
    
    @async_func
    def funcName():
        result = yield XX
        return result
    XX 必须为 Promise 实例，会在 promise 结束后将结果放入到 result 接着执行函数体
    funcName 返回一个 Promise 对象

    例：
    @async_func
    def test1():
        ret = yield test2()
        print(ret)
        ret = yield test3()
        print(ret)
        return 'test1 end'

    def test2():
        return Promise.Promise(lambda resolve: resolve('test2 end'))

    @async_func
    def test3():
        return 'test3 end'

    >>> test1().then(print)
    test2 end
    test3 end
    test1 end
    """
    func = None

    def __init__(self, func):
        self.func = func

    def __get__(self, obj, *a):
        if not obj:
            return self.func
        return types.MethodType(self, obj)

    def __call__(self, *args, **kwargs):
        ret = self.func(*args, **kwargs)
        if isinstance(ret, Iterator):
            def _func(resolve):
                _do_await(ret, resolve)
            return Promise.Promise(_func)
        if isinstance(ret, Promise.Promise):
            def _func(resolve):
                ret.then(resolve)
            return Promise.Promise(_func)
        promise = Promise.Promise()
        promise.resolve(ret)
        return promise


def _do_await(it, callback, args=None):
    try:
        nextCall = it.send(args)
        if isinstance(nextCall, Promise.Promise):
            nextCall.then(Functor(_do_await, it, callback))
    except StopIteration as result:
        rets = result.value
        if isinstance(rets, Promise.Promise):
            rets.then(callback)
            return
        if rets == None:
            callback()
        else:
            callback(rets)
        return rets
