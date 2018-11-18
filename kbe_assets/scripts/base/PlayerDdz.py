# -*- coding: utf-8 -*-
import KBEngine
from KBEDebug import *
import importlib
import traceback
import Room
import Async
import Player
import Promise
importlib.reload(Player)
importlib.reload(Async)
importlib.reload(Room)


class PlayerDdz(KBEngine.Proxy, Player.Player):
    def __init__(self):
        KBEngine.Proxy.__init__(self)
        Player.Player.__init__(self)
