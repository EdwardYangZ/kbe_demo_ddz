# -*- coding: utf-8 -*-
import KBEngine
from KBEDebug import *
import kbe
import Async


class Room(kbe.Base):

    @Async.async_func
    def initCell(self):
        ''' 初始化房间 cell '''
        assert not self.cell
        self.createInNewSpace(0)
        yield self.whenGetCell()
        return self.cell
