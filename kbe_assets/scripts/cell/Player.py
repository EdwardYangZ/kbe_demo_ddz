# -*- coding: utf-8 -*-
import KBEngine
from KBEDebug import *
from Functor import *
import importlib
import Async
import kbe
import cfg_room
importlib.reload(cfg_room)


class Player(kbe.Entity):
    def __init__(self):
        self.robot = None
        if self.isRobot:
            self.robot = self.onNewRobot()
            self.online = 1

    def onDestroy(self):
        ''' 销毁回调 '''
        if self.room:
            self.room.onLeave(self.id)

    @property
    def room(self):
        if self.roomid:
            return KBEngine.entities.get(self.roomid)

    def onNewRobot(self):
        ''' 准备机器人回调 '''

    def onJoinRoom(self, roomid):
        ''' 加入房间 '''
        room = KBEngine.entities.get(roomid)
        room.onJoin(self)

    def checkGoldMin(self):
        ''' 检查最低金币, 不足退出房间 '''
        room = self.room
        if room:
            if self.gold < room.getGoldMin():
                self.reqQuitRoom()
            else:
                return True

    def reqQuitRoom(self, eid=0):
        ''' 请求退出房间 '''
        room = self.room
        if room and not room.isGaming():
            KBEngine.globalData['Hall'].doPlayerLeaveRoom(self.id)
            self.room.onLeave(self.id)

    def reqChangeRoom(self, eid):
        ''' 请求更换房间 '''
        room = self.room
        if room and not room.isGaming():
            roomid = room.id
            level = room.level
            KBEngine.globalData['Hall'].doMatchGame(self.base, room.className, level, roomid)
            self.room.onLeave(self.id)

    def setGold(self, gold):
        ''' 设置金币 '''
        self.gold = gold
        self.base.call('onUpdGold', gold)

    def callClient(self, callName, *args):
        ''' 调用客户端函数 '''
        if self.robot:
            call = getattr(self.robot, callName, None)
            if call:
                call(*args)
        elif self.base and self.client and self.online:
            getattr(self.client, callName)(*args)
