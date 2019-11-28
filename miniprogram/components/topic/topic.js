Component({
  properties: {
    topics: {
      type: Array,
      value: [],
    }
  },
  data: {
    fullScreen: false
  },
  methods: {
    handlePreviewImage: function (e) {
      let url = e.currentTarget.dataset.url;
      wx.previewImage({
        current: url,
        urls: [url]
      })
    },
    handlePreviewVideo: function (e) {
      let id = e.currentTarget.dataset.id;
      let videoCtx = wx.createVideoContext(id,this);
      let fullScreen = this.data.fullScreen;
      console.log(id,videoCtx,fullScreen);
      if(fullScreen){
        videoCtx.pause();
        videoCtx.exitFullScreen();
        this.setData({ fullScreen: false })
      }else{
        videoCtx.requestFullScreen();
        videoCtx.play();
        this.setData({ fullScreen: true })
      }
    }
  }
})