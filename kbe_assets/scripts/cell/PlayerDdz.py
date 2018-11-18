# -*- coding: utf-8 -*-
import KBEngine
from KBEDebug import *
from Functor import *
import importlib
import traceback
import Async
import ddz_util
import Player
import Promise
import PlayerRobotDdz
importlib.reload(Async)
importlib.reload(Player)
importlib.reload(Promise)
importlib.reload(ddz_util)
importlib.reload(PlayerRobotDdz)


class PlayerDdz(KBEngine.Entity, Player.Player):
    def __init__(self):
        KBEngine.Entity.__init__(self)
        Player.Player.__init__(self)
        self._waitBankerJiao = None
        self._waitBankerQiang = None
        self._ableDiscard = None
        self.reset()

    def onNewRobot(self):
        return PlayerRobotDdz.PlayerRobotDdz(self)

    def reset(self):
        # 叫地主
        self.bankerJiao = -1
        # 抢地主
        self.bankerQiang = -1
        # 手牌
        self.poker = []
        self.pokerCount = 0
        # 出牌
        self.discard = []
        # 过牌
        self.discardPass = 0
        self.settle = 0

    def isBankerJiaoNo(self):
        return self.bankerJiao == 0

    def isBankerJiaoYes(self):
        return self.bankerJiao == 1

    def doFapai(self, poker):
        ''' 发牌 '''
        poker = ddz_util.DDZPoker(poker)
        self.poker = poker
        self.pokerCount = len(poker)
        self.callClient('onFapai')

    def addBankerPoker(self, poker):
        ''' 加入地主牌 '''
        pk = []
        for p in self.poker:
            pk.append(p)
        for p in ddz_util.DDZPoker(poker):
            pk.append(p)
        self.poker = ddz_util.DDZPoker(pk)
        self.pokerCount = len(self.poker)
        self.callClient('onBankerPoker')

    def waitBankerJiao(self):
        self._waitBankerJiao = Promise.Promise()
        return self._waitBankerJiao

    def reqBankerJiao(self, eid, jiao):
        room = self.room
        assert self.seat == self.room.curTurn
        assert jiao in (0, 1)
        assert self.bankerJiao == -1
        assert room.isBankerJiaoState()
        self._waitBankerJiao.resolve(jiao)

    def waitBankerQiang(self):
        self._waitBankerQiang = Promise.Promise()
        return self._waitBankerQiang

    def hasBankerQiang(self):
        return self.bankerQiang >= 0

    def isBankerQiangNo(self):
        return self.bankerQiang == 0

    def isBankerQiangYes(self):
        return self.bankerQiang == 1

    def reqBankerQiang(self, eid, qiang):
        room = self.room
        assert self.seat == self.room.curTurn
        assert qiang in (0, 1)
        assert self.bankerQiang == -1
        assert room.isBankerQiangState()
        self._waitBankerQiang.resolve(qiang)

    def waitDiscard(self):
        ''' 等待出牌 '''
        self._ableDiscard = Promise.Promise()
        self.discard = []
        self.discardPass = 0
        return self._ableDiscard

    def reqDiscard(self, eid, poker=None):
        # print('poker', poker)
        poker = poker or []
        self._ableDiscard.resolve(poker)

    def getDiscard(self, lastDiscard=None):
        if lastDiscard and len(lastDiscard):
            it = ddz_util.allDiscardsWithPoker(self.poker, lastDiscard)
            return it_first(it)
        return list(self.poker)[0:1]

    def reqHintDiscard(self, eid=None):
        if not self._ableDiscard:
            return
        isFirst = False
        if not getattr(self._ableDiscard, 'hint', False):
            isFirst = True
            lastDiscard = self.room.getLastDiscard()
            if lastDiscard:
                self._ableDiscard.hint = ddz_util.allDiscardsWithPoker(self.poker, lastDiscard)
            else:
                self._ableDiscard.hint = ddz_util.allDiscards(self.poker)
        try:
            poker = next(self._ableDiscard.hint)
            self.callClient('reqHintDiscard', poker)
        except StopIteration:
            self._ableDiscard.hint = False
            if isFirst:
                self.reqDiscard(self.id)
                return
            self.reqHintDiscard()
