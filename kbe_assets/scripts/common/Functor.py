# -*- coding: utf-8 -*-
from collections import Iterable

"""
用法:
a = 1
b = 2
def abc(a, b):
   print a, b
   
func = Functor(abc, a)
func(b)
"""


class Functor:
    def __init__(self, func, *args):
        self.func = func
        self.args = args

    def __call__(self, *args):
        self.func(*(self.args + args))


def it_count(it):
    ''' 迭代器计数 '''
    assert isinstance(it, Iterable), 'it must be Iterable'
    c = 0
    for v in it:
        c += 1
    return c


def it_first(it):
    ''' 取迭代器第一个元素 '''
    assert isinstance(it, Iterable), 'it must be Iterable'
    for v in it:
        return v


def find(it, func):
    for v in it:
        if func(v):
            return v
