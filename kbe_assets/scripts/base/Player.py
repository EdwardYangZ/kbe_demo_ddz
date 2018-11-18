# -*- coding: utf-8 -*-
import KBEngine
from KBEDebug import *
import importlib
import kbe
import Async
importlib.reload(kbe)
importlib.reload(Async)


class Player(kbe.Base):
    ''' 
    玩家实体, 由房间创建, 客户端以挂载方式关联(giveClientTo)
    '''
    def __init__(self):
        self.accountid = 0
        self.isRobot = self.cellData.get('isRobot')

    def getAccount(self):
        if self.accountid:
            return KBEngine.entities.get(self.accountid)

    def onEntitiesEnabled(self):
        """
        KBEngine method.
        该entity被正式激活为可使用， 此时entity已经建立了client对应实体， 可以在此创建它的
        cell部分。
        """
        INFO_MSG("Player[%i] entities enable. mailbox:%s" % (self.id, self.client))
        if self.cell:
            self.cell.setProps(dict(online=1))
        elif hasattr(self, 'cellData'):
            self.cellData['online'] = 1

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
        if self.cell:
            self.cell.setProps(dict(online=0))
        elif hasattr(self, 'cellData'):
            self.cellData['online'] = 0

    @Async.async_func
    def doJoinRoom(self, roomCell):
        ''' 加入房间 '''
        assert not self.cell
        # Account 的客户端转移给 Player
        account = self.getAccount()
        if account and account.hasClient:
            account.giveClientTo(self)
        # 创建 cell 并等待创建完毕
        self.createCellEntity(roomCell)
        yield self.whenGetCell()
        # 通知 cell 部分
        self.cell.call('onJoinRoom', (roomCell.id, ))

    @Async.async_func
    def doLeaveRoom(self):
        ''' 离开房间, 保证 cell 被销毁 '''
        account = self.getAccount()
        if account and self.hasClient:
            # 把客户端还给 Acount
            self.giveClientTo(account)
        if self.cell:
            self.destroyCellEntity()
            yield self.whenLoseCell()

    def onUpdGold(self, gold):
        ''' 金币更新 '''
        if self.getAccount():
            self.getAccount().gold = gold
