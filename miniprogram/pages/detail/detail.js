import { formatTime } from './../../utils/utils.js';
const db = wx.cloud.database();
const App = getApp()

Page({
  data: {
    id: '',
    topic: {},
    userInfo: {},
    message: '',
    replies:[]
  },
  onLoad: function(options) {
    this.getTopics(options.id);
    this.getUserInfo();
    this.getReplies(options.id);
  },
  getTopics: function(id) {
    db.collection('topic').doc(id).get({
      success: (res)=> {
        let topic = res.data;
        this.setData({ topic, id })
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
  getUserInfo: function() {
    let userInfo = App.globalData.userInfo;
    if(userInfo.nickName){
      this.setData({
        userInfo: userInfo
      })
    }
  },
  onGetUserInfo: function(e) {
    if (e.detail.userInfo) {
      let userInfo = e.detail.userInfo;
      App.getUserInfo((res)=>{
        console.log('111')
        this.setData({
          userInfo: res.userInfo
        })
      })
    }
  },
  handleChange: function(e){
    let message = e.detail.value;
    this.setData({ message })
  },
  handleSubmit: function() {
    let date = new Date();
    let content = this.data.message;
    let userInfo = App.globalData.userInfo;
    let date_display = formatTime(date);
    let createTime = db.serverDate();
    let topic_id = this.data.id;
    let replies = this.data.replies;
    console.log(content, userInfo, date_display, topic_id, createTime)
    if(!content){
      wx.showToast({ title: '评论不能为空', icon: 'none'})
      return
    }

    wx.showLoading({ 
      title: '上传中',
      mask: true
    });

    db.collection('reply').add({
      data: {
        content, userInfo, date_display, topic_id, createTime
      },
      success: res => {
        wx.showToast({ title: '评论成功' })
        replies.unshift({ content, userInfo, date_display, topic_id, createTime });
        this.setData({ replies, message: '' });
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },
  getReplies: function(id) {
    db.collection('reply').orderBy('createTime', 'desc').where({
      topic_id: id
    }).get({
      success: (res)=> {
        let replies = res.data;
        this.setData({ replies, id })
      }
    })
  },
})