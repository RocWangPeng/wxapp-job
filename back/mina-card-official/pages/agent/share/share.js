// pages/agent/share/share.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newsTopData:'',
    agentName: '',
    getFullYear: '',
    getMonth: '',
    getDate: '',
    getDay: '',
		regDays:'',//注册天数
		intype:'',//主营险种
  },
  previewImages: function() {
    var that = this;
    wx.previewImage({
      current: 'http://www.sinelinked.com/sl/img/erweima1.jpg',
      urls: ['http://www.sinelinked.com/sl/img/erweima1.jpg'],
      success: function(e) {

        wx.showToast({
          title: '长按保存到相册',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
		
		wx.showLoading({
			title: '加载中',
			mask: true
		})
		
    var agentName =
    that.setData({
        agentName: wx.getStorageSync('agentName'),
    })
    app.editTabBarAgent()

    var todayTime = new Date()
    var getFullYear = todayTime.getFullYear()
    var getMonth = todayTime.getMonth()+1
    var getDate = todayTime.getDate()
    var getDay = todayTime.getDay()
		console.log(getDay)
		switch (getDay){
			case 0:
				getDay = '一'
				break;
			case 1:
				getDay = '二'
				break;
			case 2:
				getDay = '三'
				break;
			case 3:
				getDay = '四'
				break;
			case 4:
				getDay = '五'
				break;
			case 5:
				getDay = '六'
				break;
			case 6:
				getDay = '日'
				break;
			default:
				break;
		}
    that.setData({
      getFullYear: getFullYear,
      getMonth: getMonth,
      getDate: getDate,
      getDay: getDay
    })
		
		var agentId =  wx.getStorageSync('account_id')
		
		wx.request({
			url: `https://ii.sinelinked.com/tg_web/api/XCX/agent/search`,
			data: {
				agentId: agentId
			},
			success: function (res) {
				that.setData({
					intype: res.data[0].intype,
				})
				 wx.hideLoading()
			}
		})
		
		wx.request({
			url: 'https://ii.sinelinked.com/tg_web/api/user/XCX/getRegDays',
			data: {
				userId: agentId,
			},
			success: function (res) {
				if(res.data.code == 0){
					that.setData({
						regDays: res.data.data.regDays,
					})
				}
			},
			fail: function (err) {
				console.log(err)
			}
		})
   
    // wx.request({
    //   url: 'https://v.juhe.cn/toutiao/index',
    //   data: {
    //     key: '441f3ec7908fba1fe5c51cf020b86f02',
    //     type: 'top'
    //   },
    //   success: function (res) {
    //     that.setData({
    //       newsTopData: res.data.result.data.splice(0,8),
    //     })
    //   },
    //   fail: function (err) {
    //     console.log(err)
    //   }
    // })

//     wx.request({
//       url: 'https://http://ii.sinelinked.com/tg_web/api/user/searchOrAddUserColConf',
//     })







  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
 
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      // title: that.data.productCompanyData.xcx_title || '您的贴心保险顾问',
      title: '每日分享',
      success: function(res) {
        // 转发成功

      },
      fail: function(res) {
        // 转发失败
      }
    }
  }
})