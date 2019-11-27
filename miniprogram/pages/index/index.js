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
    db.collection('topic').orderBy('createTime', 'desc').get({
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
  handlePreviewImage: function (e) {
    let url = e.currentTarget.dataset.url;
    wx.previewImage({
      current: url,
      urls: [url]
    })
  },
  handlePreviewVideo: function (e) {
    let id = e.currentTarget.dataset.id;
    let videoCtx = wx.createVideoContext(id);
    let fullScreen = this.data.fullScreen;
    if(fullScreen){
      videoCtx.pause();
      videoCtx.exitFullScreen();
      this.setData({ fullScreen: false })
    }else{
      videoCtx.requestFullScreen();
      videoCtx.play();
      this.setData({ fullScreen: true })
    }
  },
  onPullDownRefresh: function() {
    this.getTopics(()=>{
      wx.stopPullDownRefresh()
    })
  },
})