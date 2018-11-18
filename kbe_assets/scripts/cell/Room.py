# -*- coding: utf-8 -*-
import KBEngine
from KBEDebug import *
from Functor import *
import importlib
import Async
import kbe
import cfg_room
importlib.reload(cfg_room)


class Room(kbe.Entity):
    ''' 房间 '''
    def onCheckStart(self):
        ''' 检查能否开始 '''
        if self.started == 0:
            for p in self.players():
                if not p.checkGoldMin():
                    return
        if self.started == 0 and it_count(self.players()) >= self.getSeatMin():
            self.onAbleStart()

    def onAbleStart(self):
        ''' 可以开局, 待重写 '''

    def getSeatMin(self):
        ''' 最少开局座位数 '''
        return cfg_room.game_seat_min[self.className]

    def getGoldMin(self):
        ''' 至少携带gold '''
        return cfg_room.game_level[self.level]['goldMin']

    def onJoin(self, player):
        ''' 玩家加入 '''
        player.roomid = self.id
        playerids = self.playerids
        if player.id not in playerids:
            for idx, pid in enumerate(playerids):
                if pid == 0:
                    playerids[idx] = player.id
                    player.seat = idx
                    break
            if player.id not in playerids:
                player.seat = len(playerids)
                playerids.append(player.id)
            self.playerids = playerids
        self.onCheckStart()

    def onLeave(self, playerid):
        ''' 玩家离开 '''
        playerids = self.playerids
        idx = playerids.index(playerid)
        playerids[idx] = 0
        self.playerids = playerids

    def players(self):
        for i in self.playerids:
            if i:
                p = KBEngine.entities.get(i)
                if p:
                    yield p
