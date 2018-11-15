# 在kbengine中实现Promise风格的Async异步同步化编程
## 使用示例
### 远程调用:
````
@Async.async_func
def giveClientToPlayer(self, player):
  ''' 将客户端挂载给 player, player可能是一个远程对象 '''
  self.playerID = player.id
  self.giveClientTo(player)
  
  # 等待player的cell创建成功，已经创建会直接返回，用request发起远程请求
  playerCell = yield self.request(player, 'whenGetCell', (,))
  
  # 远程设置playerCell的属性, setProps 在远程函数中注册
  playerCell.setProps(dict(
    nick=self.nick,
    gold=self.gold
  ))
  self.updGold()
  
@Async.async_func
def updGold(self, playerCell):
  ''' 每5秒更新一次gold属性 '''
  yield self.delay(5)
  while self.playerID == playerCell.id:
    gold, = yield self.request(playerCell, 'getProps', ('gold',))
    self.gold = gold
    yield self.delay(5)
````
### 异步流程化:
````
@Async.async_func
def startGame(self):
  '''开始对局，直对局结束'''
  self.reset()
  self.started = 1
  
  # 发牌并暂停2.5秒
  self.doFapai()
  yield self.delay(2.5)
  
  # 开始叫地主直到结束叫地主状态
  ret = yield self.doBankerJiao()
  if not ret:
    # 叫地主失败则重新开始
    self.doStart()
    return False
    
  # 开始抢地主直到抢地主结束
  bankerSeat = yield self.doBankerQiang()
  
  # 确定地主并暂停1.5秒
  self._doSetBanker(bankerSeat)
  yield self.delay(1.5)
  
  # 开始出牌直到分出胜负
  winSeat = yield self.doDiscard()
  
  # 结算
  self.doSettle(winSeat)
  yield self.delay(4.5)
  self.started = 6
  return True
````
 
