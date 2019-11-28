const db = wx.cloud.database()

Page({
  data: {
  	fullScreen: false,
    topics: [],
  },
  onShow: function() {
    this.getTopics()
  },
  getTopics: function(cb) {
    db.collection('topic').orderBy('createTime', 'desc').where({
      _openid: App.globalData.openid,
    }).get({
      success: res => {
        console.log('[数据库] [查询记录] 成功: ', res)
        let topics = res.data;
        this.setData({ topics })
        typeof cb === 'function' && cb();
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },
  onPullDownRefresh: function() {
    this.getTopics(()=>{
      wx.stopPullDownRefresh()
    })
  },
})