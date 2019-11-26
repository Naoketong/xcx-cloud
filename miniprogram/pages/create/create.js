// 1.引用工具函数、全局对象、及实例化云数据库
import { formatTime } from './../../utils/util.js';
const App = getApp();
const db = wx.cloud.database()

Page({
  // 2.定义视图所需要的数据信息
  data: {
    content: '',
    imageUrl: '',
    videoUrl: '',
  },
  // 3. textarea 元素 bindinput 发生改变的回调函数
  // 用于实时监听输入的文本然后设置在 Page.data.content 中
  handleChange: function(e) {
    let content = e.detail.value;
    this.setData({ content })
  },
  // 4. 点击添加按钮 bindtap 的回调函数
  // 唤起 showActionSheet 更具选择调用拍照或者摄像功能
  // 并在选择资源成功之后把资源地址传给 uploadFile 方法
  handleUpload:function(){
    let itemList = ['图片','视频'];
    let itemListType = ['image','video'];
    console.log(this)
    wx.showActionSheet({
      itemList: itemList,
      success: (res) => {
        let type = itemListType[res.tapIndex];
        if(type === 'video'){
          wx.chooseVideo({
            sourceType: ['album','camera'],
            maxDuration: 15,
            camera: 'back',
            success: (res) =>{
              let filePath = res.tempFilePath;
              this.uploadFile(type,filePath)
            }
          })
        }else{
          wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: (res) => {
              let filePath = res.tempFilePaths[0];
              this.uploadFile(type,filePath)
            }
          })
        }
      }
    })
  },
  // 5. 上传功能，接收类型、资源地址两个参数
  // 根据 open_id 和时间戳拼接出文件名
  // 使用 wx.cloud.uploadFile 上传文件到云开发的存储管理内
  uploadFile: function(type, filePath) {
    let openid = App.globalData.openid;
    let timestamp = Date.now();
    let postfix = filePath.match(/\.[^.]+?$/)[0];
    let cloudPath = `${openid}_${timestamp}${postfix}`;

    wx.showLoading({ 
      title: '上传中',
      mask: true
    });

    wx.cloud.uploadFile({
      cloudPath,
      filePath,
      success: (res) => {
        if(type === 'video'){
          this.setData({ videoUrl: res.fileID })
        }else{
          this.setData({ imageUrl: res.fileID })
        }
      },
      fail: (e) => {
        wx.showToast({
          icon: 'none',
          title: '上传失败',
        })
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },
  // 6. 定义发布元素点击的回调函数
  // 当用户点击发布时候，判断文字、图片、视频资源最少有一个。
  // 然后使用 db.collection 连接 topic 数据库，再使用 add 方法为 topic 集合添加一条记录。
  // 记录包含 文字、图片、视频资源、用户信息、时间戳 和 显示时间。
  // 当成功添加后，从成功回调函数中的参数获取到当前记录的 id ，拼接地址，跳转到该 id 的详情页。
  handleSubmit: function() {
    let date = new Date();
    let date_display = formatTime(date);
    let createTime = db.serverDate();
    let content  = this.data.content;
    let imageUrl = this.data.imageUrl;
    let videoUrl = this.data.videoUrl;
    let userInfo = App.globalData.userInfo;

    if(!content && !imageUrl && !videoUrl){
      wx.showToast({
        icon: 'none',
        title: '请输入内容',
      })
      return
    }

    wx.showLoading({ 
      title: '上传中',
      mask: true
    });

    db.collection('topic').add({
      data: {
        content, userInfo, createTime, date_display, imageUrl, videoUrl
      },
      success: (res) => {
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
        let url = '/pages/detail/detail?id=' + res._id;
        wx.redirectTo({ url })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  }
})






// const App = getApp();
// import { formatTime } from './../../utils/utils.js';
// const db = wx.cloud.database();

// Page({
// 	data:{
// 		content:'',
// 		imageUrl:'',
// 		videoUrl:'',
// 	},
// 	handleChange: function(e) {
// 		let content = e.detail.value;
// 		this.setData({ content });
// 		console.log(this.data.content)
// 	},
// 	handleUpload: function() {
// 		let itemList = ['图片','视频'];
// 		let itemListType = ['image','video'];
// 		console.log(this)
// 		wx.showActionSheet({
// 			itemList: itemList,
// 			success: (res) =>{
// 				let type = itemListType[res.tapIndex];
// 				if(type === 'video'){
// 					sourceType: ['album','camera'],
// 					maxDuration: 15,
// 					camera:'back',
// 					success: (res)=>{
// 						let filePath = res.tempFilePath;
// 						this.uploadFile(type.filePath)
// 					}

// 				} else {
// 					wx.chooseImage({
// 						count: 1,
// 						sizeType: ['album', 'camera'],
// 						success: (res)=>{
// 							let filePath = res.tempfilePath[0];
// 							this.uploadFile(type,filePath)
// 						}
// 					})
// 				}
// 			}
// 		})
// 	},
// 	uploadFile: function(){
// 		let openid = App.globalData.openid;
// 		let timestamp = Date.now();
// 		let postfix = filePath.match(/\.[^.]+?$/)[0];
// 		let cloudPath = `${openid}_${timestamp}${postfix}`;

// 		wx.showLoading({
// 			title:'上传中',
// 			mask: true
// 		});

// 		wx.cloud.uploadFile({
// 			cloudPath,
// 			filePath,
// 			success: (res) =>{
// 				if(type === 'video'){
// 					this.setData({ videoUrl: res.fileID})
// 				}else{
// 					this.setData({ imageUrl: res.fileID})
// 				}
// 			},
// 			fail: (e)=>{
// 				wx.showToast({
// 					icon:'none',
// 					title:'上传失败',
// 				})
// 			},
// 			complete: ()=>{
// 				wx.hideLoading()
// 			}
// 		})
// 	},
// 	handleSubmit: function(){
// 		let datae = new Date();
// 		let date_display = db.serverDate(date);
// 		let createTime = db.serverDate();
// 		let content = this.data.content;
// 		let imageUrl = this.data.imageUrl;
// 		let userINfo = App.globalData.userInfo;

// 	},

// })