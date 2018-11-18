# -*- coding: utf-8 -*-
import KBEngine
from KBEDebug import *
import importlib
import traceback
import Async
importlib.reload(Async)
import kbe
importlib.reload(kbe)
import Promise
importlib.reload(Promise)
import cfg_room
importlib.reload(cfg_room)


class Account(KBEngine.Proxy, kbe.Base):
    def __init__(self):
        KBEngine.Proxy.__init__(self)
        self.playerid = 0

    def getPlayer(self):
        if self.playerid:
            return KBEngine.entities.get(self.playerid)

    def onEntitiesEnabled(self):
        """
        KBEngine method.
        该entity被正式激活为可使用， 此时entity已经建立了client对应实体， 可以在此创建它的
        cell部分。
        """
        self.updUserInfo()
        # INFO_MSG("account[%i] entities enable. entityCall:%s" % (self.id, self.client))
        player = self.getPlayer()
        if player and player.cell:
            self.giveClientTo(player)

    def updUserInfo(self):
        if not len(self.nick):
            self.nick = self.__ACCOUNT_NAME__

    def onLogOnAttempt(self, ip, port, password):
        """
        KBEngine method.
        客户端登陆失败时会回调到这里
        """
        INFO_MSG(ip, port, password)
        return KBEngine.LOG_ON_ACCEPT

    def onClientDeath(self):
        """
        KBEngine method.
        客户端对应实体已经销毁
        """
        DEBUG_MSG("Account[%i].onClientDeath:" % self.id)
        # self.destroy()

    def reqStartGame(self, gameName, level):
        '''
        请求匹配游戏, def 中定义, 客户端请求
        @param gameName : 游戏名称
        @param level    : 房间等级
        '''
        player = self.getPlayer()
        if player and player.cell:
            # 还在房间中
            return
        if level < 0 or level >= len(cfg_room.game_level):
            # 不存在的等级
            return
        if self.gold < cfg_room.game_level[level]['goldMin']:
            # 金币不到房间最低金币限制
            return
        if player and player.className != gameName:
            player.destroy()
            self.playerid = player.id
            player = None
        if not player:
            # 创建 Player
            player = self.createPlayer(cfg_room.game_player_classname[gameName])
        # 由 Hall 处理为玩家匹配房间
        KBEngine.globalData['Hall'].doMatchGame(player, gameName, level, 0)

    def createPlayer(self, className):
        '''
        创建 Player, Account 与 Player 会在同一个进程
        nick/gold 属性会在这个时候传给 Player, 这样可以在房间中看到自己和其他玩家的属性
        '''
        assert not self.playerid
        player = KBEngine.createBase(className, {
            'nick': self.nick,
            'gold': self.gold,
        })
        # 相互记录 id, 用于相互调用, 避免循环引用
        self.playerid = player.id
        player.accountid = self.id
        return player

    def reqGameLevel(self):
        ''' 请求获取游戏等级配置 '''
        if self.hasClient:
            self.client.reqGameLevel(cfg_room.game_level)

