# -*- coding: utf-8 -*-
import KBEngine
from KBEDebug import *
from Functor import *
import importlib
import random
import time
import kbe
import Async
import ddz_util
import cfg_room
import Room
importlib.reload(ddz_util)
importlib.reload(cfg_room)


class GameDdz(KBEngine.Entity, Room.Room):
    def __init__(self):
        KBEngine.Entity.__init__(self)
        self.reset()

    def reset(self):
        self.baseScore = cfg_room.game_level[self.level]['baseScore']
        # 开局标志
        self.started = 0
        # 庄家座位号
        self._preBankerSeat = 0
        self.bankerSeat = -1
        # 当前倍率
        self.curRate = 0
        # 当前轮次
        self.curTurn = -1
        self.turnCutdown = -1
        # 地主牌
        self.bankerPoker = []
        # 隐藏地主牌
        self._bankerPoker = []
        self.lastDiscardSeat = -1

    def onAbleStart(self):
        ''' 可以开局, 重写 '''
        self.doStart()

    def getPlayer(self, seat):
        return KBEngine.entities.get(self.playerids[seat])

    def getTurnPlayer(self):
        if self.curTurn >= 0:
            return self.getPlayer(self.curTurn)

    def isGaming(self):
        return self.started != 0 and self.started != 6

    def isBankerState(self):
        return self.isGaming() and self.bankerSeat < 0

    def isBankerJiaoState(self):
        ''' 是否是叫地主状态 '''
        return self.isBankerState() and not any(p for p in self.players() if p.isBankerJiaoYes())

    def isBankerQiangState(self):
        ''' 是否是抢地主状态 '''
        return self.isBankerState() and not self.isBankerJiaoState()

    def isAbleQuitRoomState(self):
        return self.started in (0, 6)

    @Async.async_func
    def doStart(self):
        ''' 开始 '''
        self.reset()
        for p in self.players():
            p.reset()
        self.started = 1
        self.doFapai()
        yield self.delay(2.5)
        ret = yield self.doBankerJiao()
        if not ret:
            ''' 叫地主失败则重新开始 '''
            self.doStart()
            return False
        bankerSeat = yield self.doBankerQiang()
        self._doSetBanker(bankerSeat)
        yield self.delay(1.5)
        winSeat = yield self.doDiscard()
        self.doSettle(winSeat)
        yield self.delay(4)
        self.started = 6
        yield self.delay(4)
        self.reset()
        self.onCheckStart()
        return True

    @Async.async_func
    def doBankerJiao(self):
        ''' 叫地主 '''
        self.started = 2
        while True:
            self.doNextTurn()
            player = self.getTurnPlayer()
            promise = player.waitBankerJiao()
            self._onTimeoutBankerJiao(promise)
            ret = yield promise
            player.bankerJiao = ret
            if ret == 1:
                ''' 叫地主则进入下一阶段 '''
                self.curRate = 1
                return True
            if all(p.isBankerJiaoNo() for p in self.players()):
                ''' 没人叫地主 '''
                return False

    @Async.async_func
    def _onTimeoutBankerJiao(self, promise):
        self.turnCutdown = 5
        yield self.delay(self.turnCutdown)
        promise.resolve(0)

    @Async.async_func
    def doBankerQiang(self):
        ''' 抢地主 '''
        self.started = 3
        preBanker = self.curTurn
        while True:
            if self._isBankerQiangEnd():
                return preBanker
            self.doNextTurn()
            player = self.getTurnPlayer()
            effect = player.waitBankerQiang()
            self.turnCutdown = 5
            self.delay(self.turnCutdown).then(lambda a: effect.resolve(0))
            ret = yield effect
            player.bankerQiang = ret
            if ret == 1:
                ''' 抢地主 '''
                self.curRate *= 2
                preBanker = self.curTurn

    def _isBankerQiangEnd(self):
        ''' 抢地主是否结束 '''
        seat = self._nextTurn()
        player = self.getPlayer(seat)
        if player.bankerQiang >= 0:
            return True
        if player.bankerJiao == 0:
            return True
        if player.bankerJiao == 1 and all(p.bankerQiang <= 0 for p in self.players()):
            return True

    def _doSetBanker(self, bankerSeat):
        ''' 定地主 '''
        self.bankerSeat = bankerSeat
        self.curTurn = self.bankerSeat
        self.getTurnPlayer().addBankerPoker(self._bankerPoker)
        self.bankerPoker = self._bankerPoker

    @Async.async_func
    def doDiscard(self):
        ''' 出牌过程 '''
        self.started = 4
        curDiscardType = None
        self.lastDiscardSeat = -1
        while True:
            if self.started != 4:
                return
            player = self.getTurnPlayer()
            player.discardPass = 0
            player.discard = []
            if self.lastDiscardSeat == player.seat:
                ''' 变成第一次出牌 '''
                curDiscardType = None
                player.discard = []
                self.lastDiscardSeat = -1
            effect = player.waitDiscard()
            self.turnCutdown = 8
            t = time.time()
            self.delay(self.turnCutdown).then(effect.resolve)
            poker = yield effect
            handPoker = ddz_util.DDZPoker(player.poker)
            if (not poker or len(poker) == 0) and curDiscardType == None:
                poker = player.getDiscard()
            if poker and handPoker.isContain(poker):
                poker = ddz_util.DDZPoker(poker)
                discardType = poker.ableDiscard(curDiscardType)
                if discardType:
                    self.lastDiscardSeat = player.seat
                    curDiscardType = discardType
                    player.discard = poker
                    player.poker = ddz_util.DDZPoker(handPoker - poker)
                    player.pokerCount = len(player.poker)
                    if poker.isBomb():
                        self.curRate *= 2
                    if player.pokerCount == 0:
                        ''' 结束 '''
                        for p in self.players():
                            if len(p.poker):
                                p.discard = p.poker
                                p.discardPass = 0
                        return player.seat
                    self.doNextTurn()
                    continue
            player.discardPass = 1
            self.doNextTurn()

    def getLastDiscard(self):
        ''' 得到最后出牌 '''
        if self.lastDiscardSeat >= 0:
            return self.getPlayer(self.lastDiscardSeat).discard

    def doSettle(self, winSeat):
        ''' 结算 '''
        self.started = 5
        num = self.baseScore * self.curRate
        if winSeat == self.bankerSeat:
            ''' 地主胜利 '''
            num = -num
        bankerNum = - num * 2
        for p in self.players():
            p.settle = bankerNum if p.seat == self.bankerSeat else num
            p.setGold(p.gold + p.settle)
        for p in self.players():
            p.callClient('onSettle')

    def _nextTurn(self):
        if self.curTurn < 0:
            return random.choice(range(self.getSeatMin()))
        turn = self.curTurn + 1
        if turn >= self.getSeatMin():
            turn = 0
        return turn

    def doNextTurn(self):
        ''' 轮到下一个 '''
        self.curTurn = self._nextTurn()
        self.getPlayer(self.curTurn).callClient('onTurn')

    def doFapai(self):
        ''' 发牌 '''
        pokers = list(ddz_util.fapai())
        self._bankerPoker = pokers.pop()
        self.bankerPoker = [0] * 3
        for p in self.players():
            p.doFapai(pokers[p.seat])
