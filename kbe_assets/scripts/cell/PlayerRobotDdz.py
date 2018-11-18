# -*- coding: utf-8 -*-
import weakref
import random
import Async


class PlayerRobotDdz:
    def __init__(self, player):
        self.player = weakref.proxy(player, self.onDestroy)
        self._onCheckUpdate()

    def onDestroy(self, *args):
        pass

    @Async.async_func
    def _onCheckUpdate(self):
        yield self.player.delay(2)
        player = self.player
        room = self.player.room
        if player._waitBankerJiao and random.random() > 0.3:
            player.reqBankerJiao(player.id, random.randint(0, 1))
        elif player._waitBankerQiang and random.random() > 0.3:
            player.reqBankerQiang(player.id, random.randint(0, 1))
        elif player._ableDiscard and random.random() > 0.3:
            player.reqDiscard(player.id, player.getDiscard(room.getLastDiscard()))
        self._onCheckUpdate()

