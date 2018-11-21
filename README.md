# kbe_demo_ddz
* 基于 kbengine 1.0 和 cocos creator 2.0
* 斗地主 demo, 传统金币场, 高效算牌算法, 简单陪玩机器人
* Promise 风格的 async 异步同步化实现, 异步编程最佳实践
* 仅供学习交流使用，请勿用于非法用途

-------------
## 安装
* kbengine 下载
> https://github.com/kbengine/kbengine/releases/tag/v1.0.0
* kbengine 安装
> https://www.comblockengine.com/docs/1.0/install/index/
* cocos creator 下载
> http://download.cocos.com/CocosCreator/v2.0.5/CocosCreator_v2.0.5_2018110602_win.7z

-------------

## 服务器说明

### Promise 风格的 async 异步同步化
> https://github.com/EdwardYangZ/kbe_async

```
import KBEngine
import kbe
import Async

class Hall(KBEngine.Base, kbe.Base):
    def __init__(self):
        KBEngine.Base.__init__(self)

    @Async.async_func
    def test(self):
        print('函数执行开始')
        yield self.delay(5)
        print('5秒之后才打印这句话')
```
* **kbe.Entity.request** 对另一个实体发起远程请求
```
@Async.async_func
def foo(self):
    gold, = yield self.request(self.cell, 'getProps', ['gold'])
    print(gold)
```

### Entity 说明
* Hall
    * 单例, 大厅实体
    * 管理所有房间
    * 处理玩家进入退出房间
* Account
    * 大厅中的玩家实体 Proxy
    * 处理玩家在大厅里的请求
* PlayerDdz
    * 斗地主房间中的玩家实体
    * 处理玩家对局中的操作
* GameDdz
    * 斗地主房间实体
    * 一个房间一个 space
