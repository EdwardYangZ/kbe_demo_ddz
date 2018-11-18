# -*- coding: utf-8 -*-
import KBEngine
from KBEDebug import *
from Functor import *
import importlib
import random
import kbe
import Async
import cfg_room
importlib.reload(cfg_room)


class Room:
    ''' 记录房间相关信息 '''
    def __init__(self, base, cell, className, level):
        self.base = base
        self.cell = cell
        self.className = className
        self.level = level
        self.players = []
        self.robots = []


class Hall(KBEngine.Base, kbe.Base):
    '''
    大厅
    * 管理房间
    * 玩家加入/退出房间
    '''
    def __init__(self):
        KBEngine.Base.__init__(self)
        # 放入全局变量中, 这样所有 baseapp/cellapp 都能与之通信
        KBEngine.globalData['Hall'] = self
        # 所有房间
        self._rooms = {}
        # player 所在 room.id
        self._player_roomids = {}
        # 开启定时器
        self.schedule('_onCheckRoomRobot', 4)

    @Async.async_func
    def doCreateRoom(self, gameName, level):
        ''' 创建房间并等待 initCell 获取到 room 的 cell '''
        room = yield kbe.createBaseAnywhere(gameName, {'level': level})
        if room:
            roomCell = yield self.request(room, 'initCell')
            self._rooms[room.id] = Room(room, roomCell, gameName, level)
            return room.id

    @Async.async_func
    def doMatchGame(self, player, gameName, level=0, filterRoomid=0):
        '''
        匹配游戏, 远程定义
        @param player : 玩家实体对象/Mailbox
        @param gameName : 匹配的游戏名称, 也就是类名
        @param level : 匹配的游戏等级
        @param filterRoomid : 筛除的房间id, 用于更换房间功能
        '''
        if self._player_roomids.get(player.id, 0) != 0:
            # 保证玩家不在房间中, 在的话就退出房间, 再进入匹配房间流程
            yield self.doPlayerLeaveRoom(player.id)
        # 选择人数尽量多并且能加入的房间
        foundRoomid = 0
        seatMin = cfg_room.game_seat_min[gameName]
        for i in range(1, seatMin):
            for roomid, r in self._rooms.items():
                if not r:
                    continue
                if r.className != gameName:
                    continue
                if r.level != level:
                    continue
                if filterRoomid == roomid:
                    continue
                if seatMin - i != len(r.players):
                    continue
                foundRoomid = roomid
                break
        if not foundRoomid:
            # 没有找到合适的房间就创建一个新的, 这里会等到房间创建完成
            foundRoomid = yield self.doCreateRoom(gameName, level)
        self._doPlayerJoinRoom(player, foundRoomid)
        return foundRoomid

    def _doPlayerJoinRoom(self, player, roomid):
        ''' 玩家加入房间 '''
        room = self._rooms[roomid]
        room.players.append(player)
        self._player_roomids[player.id] = roomid
        player.call('doJoinRoom', (room.cell, ))

    @Async.async_func
    def doPlayerLeaveRoom(self, playerid):
        ''' 玩家离开房间, 玩家完全退出房间 cell 被销毁 return
        '''
        roomid = self._player_roomids[playerid]
        if roomid:
            room = self._rooms[roomid]
            self._player_roomids[playerid] = 0
            for i, p in enumerate(room.players):
                if p.id == playerid:
                    player = room.players.pop(i)
                    yield self.request(player, 'doLeaveRoom')
                    return

    def _onCheckRoomRobot(self):
        ''' 定时检查所有房间机器人添加或移除情况 '''
        for roomid, room in self._rooms.items():
            playerCount = len(room.players)
            seatMin = cfg_room.game_seat_min[room.className]
            robotCount = len(room.robots)
            if playerCount and robotCount < playerCount and playerCount < seatMin:
                ''' 添加机器人 '''
                goldMin = cfg_room.game_level[room.level]['goldMin']
                player = KBEngine.createBase(cfg_room.game_player_classname[room.className], {
                    'isRobot': 1,
                    'nick': 'robot' + str(random.randint(1, 500)),
                    'gold': goldMin + random.randint(500, 3000)
                })
                room.robots.append(player)
                self._doPlayerJoinRoom(player, roomid)
            elif playerCount and playerCount == robotCount:
                ''' 移除机器人 '''
                robot = room.robots.pop()
                self.doPlayerLeaveRoom(robot.id)
                robot.whenLoseCell().then(robot.destroy)
