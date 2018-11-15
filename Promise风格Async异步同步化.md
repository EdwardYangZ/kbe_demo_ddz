# 在kbengine中实现Promise风格的Async异步同步化编程
### 可以这样编程:
````
@Async.async_func
def startGame(self):
  '''开始对局，直对局结束'''
  self.reset()
  self.started = 1
  # 发牌并暂停2.5秒
  self.doFapai()
  yield self.delay(2.5)
  # 叫地主
  ret = yield self.doBankerJiao()
  if not ret:
    # 叫地主失败则重新开始
    self.doStart()
    return False
  # 抢地主
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
 
