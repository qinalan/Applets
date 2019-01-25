App({
    globalData: {
        songs_list: {}, // 歌单, 提供切换功能, 然后赋值到页面, 最后到song里边
        songs: {}, // 当前播放歌曲, 当第一次打开小程序, 这里应该有默认的, 以及播放状态
        isFirst: false, // 是否已使用过此播放器
    }
});

/*
* 点击播放按钮:
*   ①: 存到本地缓存(歌单个当前歌曲信息)
*   ②: 如果用户是第一次使用, 进来首页后, 那么提示他当前不可播放(使用一个布尔值, 需要选择播放的歌曲)
*   ③: 如果点击推荐播放, 那么把相关数据存到本地缓存(执行①)
*   ④: 如果进入搜索页面并播放, 应该是追加到当前播放里或者是更新整个播放列表(执行第一步)
*   ⑤: 用户之前已经使用过了, 那么可以直接从本地缓存里访问, 提供给用户点击播放
*
* 由于在小程序加载时是先执行App的onLaunch的, 然后再执行page里的onLoad, 但是如果是异步的情况,
* 那么会出现问题, 会出现先执行onLoad(或已完全加载), App的onLaunch(异步)才会赋值完成
* 解决方案:
*   ①: 就是不在App里加载异步方法, 把App当做一个仓库使用, 获取啥的全部交给onLoad, 然后给App赋值
*   ②: 可以使用回调函数, 在page里先做一次判断, 然后在App里的异步执行存起来, 最后在OnLoad里调用
*   ③: 需要异步(需联网)获取的数据, 在onLoad里获取后保存到本地缓存, App里获取本地缓存是可以的
* */