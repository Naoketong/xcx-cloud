const App = getApp();

Page({
  data: {
    userInfo: {},
  },
  onLoad: function() {
    this.getUserInfo();
  },
  getUserInfo: function() {
    let userInfo = App.globalData.userInfo;
    if(userInfo.nickName){
      this.setData({
        logged: true,
        userInfo: userInfo
      })
    }
  },
  onGetUserInfo: function(e) {
    if (e.detail.userInfo) {
      let userInfo = e.detail.userInfo;
      App.getUserInfo((res)=>{
        this.setData({
          userInfo: res.userInfo
        })
      })
    }
  }
})