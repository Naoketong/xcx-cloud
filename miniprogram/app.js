App({
  onLaunch: function () {
    this.cloudInit();
    this.getUserInfo();
  },
  
  cloudInit: function() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true
      })
    }
  },
  
  getUserInfo: function(cb) {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              this.getOpenid();
              this.globalData.userInfo = res.userInfo;
              typeof cb === 'function' && cb(res);
            }
          })
        }else{
          console.log('用户未授权');
        }
      }
    })
  },
  
  getOpenid: function() {
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        this.globalData.openid = res.result.openid;
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  // globalData 对象用于存放全局数据
  // globalData.userInfo 用于存放用户信息
  // globalData.openid 存放 openid。
  globalData: {
    userInfo: {},
    openid: '',
  }
})