// pages/show/show.js
//获取应用实例
var app = getApp();

Page({
  data: {
    agentShowData: {},
    ImgSelfPath: [],
    ImgSelfCoverPath: '',
    ImgHeadPath: '',
    defaultHeadImg: 'http://www.sinelinked.com/static/other/default_head.png',
    accountId:'',
    xcx_title: '您的贴心保险顾问'
  },
  imageError: function (e) {
    var that = this
    if (e.target.id == "shareImageUrl") {
      var cMI = 'agentShowData.coverTempletUrl'
      this.setData({
        [cMI]: 'http://www.sinelinked.com/static/other/pic-bg3.jpg',
      })
    } else if (e.target.id == "ImgHeadPath") {
      var cMI = 'agentShowData.headImg'
      this.setData({
        [cMI]: 'http://www.sinelinked.com/static/other/default_head.png'
      })
    }

    if (e.target.id == "ImgSelfCoverPath") {
      var cMI2 = 'ImgSelfCoverPath'
      this.setData({
        [cMI2]: 'http://www.sinelinked.com/static/other/show-bg.jpg'
      })
    }


  },

  onHide: function () {

  },
  onShow: function () {
    wx.showLoading({
      title: '加载中',
      mask:true
    })

    var that = this;

    var accountId = that.data.accountId || wx.getStorageSync('account_id')
    if (accountId) {
			
			wx.request({
				url: `https://ii.sinelinked.com/tg_web/api/XCX/agent/search`,
				data: {
					agentId: accountId
				},
				success: function (res) {
					// 防止图片缓存begin
					that.setData({
						agentShowData: res.data[0],
            ImgSelfCoverPath: res.data[0].selfShowCover + '?' + Math.random(),
						ImgHeadPath:  res.data[0].headImg + '?' + Math.random(),
						xcx_title: res.data[0].xcxTitle
					})
					var newImgSelfPath = []
					for (var i = 0; i < res.data[0].selfImg.length; i++) {
						newImgSelfPath.push(res.data[0].selfImg[i] + '?' + Math.random())
					}
					that.setData({
						ImgSelfPath: newImgSelfPath
					})
					wx.hideLoading()
				}
			})
			
    }
    
  },

  onLoad: function (options) {
    var accountId = options.account_id || wx.getStorageSync('account_id')
    app.editTabBarAgent()
    wx.showLoading({
      title: '加载中',
      mask: true
    })

    this.setData({
      accountId: accountId
    })

  },
  random: function () {
    console.log(Math.random() * 2)
    return '111'
  },
  previewImages: function (e) {
    var that = this;
    wx.previewImage({
      current: e.currentTarget.dataset.item,
      urls: that.data.ImgSelfPath,
      success: function () {
        wx.setStorageSync('account_id', that.data.agentShowData.data[0].id)
      }
    })
    wx.hideLoading()
  },

  onShareAppMessage: function () {
    var that = this;
    return {
      // title: that.data.agentShowData.data[0].xcx_title || '您的贴心保险顾问',
      title: that.data.agentShowData.xcxTitle,
      path: `/pages/agent/show/show?account_id=${that.data.agentShowData.userId}`,
      imageUrl: that.data.agentShowData.coverTempletUrl + '?' + Math.random(),
      success: function (res) {
        // 转发成功
        wx.setStorageSync('account_id', that.data.agentShowData.userId)
      },
      fail: function (res) {
        // 转发失败
      }
    }

  }
})
