# -*- coding: utf-8 -*-
import KBEngine
from KBEDebug import *
from Functor import *
import importlib
import Room
importlib.reload(Room)


class GameDdz(KBEngine.Base, Room.Room):
	"""
	斗地主游戏模块
	"""
	def __init__(self):
		KBEngine.Base.__init__(self)
 