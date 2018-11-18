# kbe_demo_ddz
* 基于 kbengine 2.0 和 cocos creator 2.0
* 斗地主 demo, 传统金币场, 高效算牌算法, 简单陪玩机器人
* Promise 风格的 async 异步同步化实现, 并大量运用在 demo 中
* 仅供学习交流使用，请勿用于非法用途

-------------
## 安装
* kbengine 下载
> https://github.com/kbengine/kbengine/releases/tag/v2.0.0-preview5
* cocos creator 下载
> http://download.cocos.com/CocosCreator/v2.0.5/CocosCreator_v2.0.5_2018110602_win.7z
* kbengine 安装
> https://www.comblockengine.com/docs/1.0/install/index/

-------------

## 服务器说明

### Promise 风格的 async 异步同步化实现
> https://github.com/EdwardYangZ/kbe_async

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
