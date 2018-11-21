#!/usr/bin/env python
# -*- coding: utf-8 -*-
import importlib
import poker_util
importlib.reload(poker_util)
import random
import functools

'''
    合法牌型配置
    rect{width, height}: 牌型矩形，如 3,3,4,4,5,5 矩形为 {width:3, height:2}
    tail{num, height}: 带牌，个数、高度
    (rectWidth, rectHeight, tailNum, tailHeight)
'''
ABLES = (
    (1,4,0,0	),
    (1,4,2,2	),
    (1,4,2,1	),
    (6,3,6,2	),
    (6,3,6,1	),
    (6,3,0,0	),
    (5,3,5,2	),
    (5,3,5,1	),
    (5,3,0,0	),
    (4,3,4,2	),
    (4,3,4,1	),
    (4,3,0,0	),
    (3,3,3,2	),
    (3,3,3,1	),
    (3,3,0,0	),
    (2,3,2,2	),
    (2,3,2,1	),
    (2,3,0,0	),
    (1,3,1,2	),
    (1,3,1,1	),
    (1,3,0,0	),
    (8,2,0,0	),
    (7,2,0,0	),
    (6,2,0,0	),
    (5,2,0,0	),
    (4,2,0,0	),
    (3,2,0,0	),
    (1,2,0,0	),
    (13,1,0,0	),
    (12,1,0,0	),
    (11,1,0,0	),
    (10,1,0,0	),
    (9,1,0,0	),
    (8,1,0,0	),
    (7,1,0,0	),
    (6,1,0,0	),
    (5,1,0,0	),
    (1,1,0,0	)
)

class DDZPoker(poker_util.Poker):
    def enableType(self):
        ''' 是否符合牌型 '''
        for w, y, tnum, ty in ABLES:
            for rectCards, pk in self.iterFlipRect(w, y):
                # print(rectCards, pk)
                if DDZPoker(pk).isComprise(ty, tnum):
                    return w, y, tnum, ty, next(iter(rectCards)).x

    def ableDiscards(self, w, y, tnum=0, ty=0, xmin=0):
        ''' 所有合法的出牌 '''
        for rectCards, pk in self.iterFlipRect(w, y, xmin+1):
            pk = DDZPoker(pk)
            if tnum == 0 or ty == 0:
                yield rectCards
            else:
                for cards in pk.iterTails(tnum, ty):
                    yield rectCards + cards
        bomb = 0
        if w == 1 and y == 4 and not tnum and not ty:
            bomb = xmin
        for rectCards, pk in self.iterFlipRect(1, 4, bomb+1):
            yield rectCards

    def ableDiscard(self, discardType):
        ''' 对于目标牌型是否合法 '''
        able = self.enableType()
        if not able or not discardType:
            return able
        w, y, tnum, ty, xmin = discardType
        w_, y_, tnum_, ty_, xmin_ = able
        isBomb = self.isBomb()
        if isBomb:
            if tnum == 0 and w == 1 and y == 4 and isBomb <= xmin:
                return
            else:
                return able
        if w_ == w and y == y_ and tnum_ == tnum and ty_ == ty and xmin_ > xmin:
            return able

    def isBomb(self):
        ''' 是否炸弹 '''
        if not len(self):
            return
        c = self[0]
        if len(self) == 2 and poker_util.isKing(c) and poker_util.isKing(self[1]):
            return c.x
        if len(self) == 4 and sum(1 for a in self if a.x == c.x) == 4:
            return c.x


def fapai():
    ''' 发牌 '''
    poker = poker_util.getAllPoker()
    random.shuffle(poker)
    bankerPoker, poker = poker[:3], poker[3:]
    count = int(len(poker)/3)
    for i in range(3):
        yield poker[i*count:(i+1)*count]
    yield bankerPoker


def allDiscards(myPoker):
    ''' 所有出牌 '''
    myPoker = DDZPoker(myPoker)
    for w, y, tnum, ty in reversed(ABLES):
        for v in myPoker.ableDiscards(w, y, tnum, ty):
            yield v


def allDiscardsWithPoker(myPoker, poker):
    ''' 合法出牌 '''
    myPoker = DDZPoker(myPoker)
    poker = DDZPoker(poker)
    args = poker.enableType()
    assert args
    return myPoker.ableDiscards(*args)
