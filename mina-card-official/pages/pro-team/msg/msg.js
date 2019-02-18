// pages/pro-team/msg/msg.js
//获取应用实例
var app = getApp();
Page({
  data: {
		agentData: {},
    consultData: {
      name: '',//姓名
      tel: '',//电话
      c: '',//内容
			tel_token: '',//验证码
    },
    pointerEvent: false,
    sendTxt: '',
		iCode:'',//返回验证码
    xcx_title: '您的贴心保险顾问',
		region: ['请选择地区'],
		customItem: '全部'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.editTabBarProTeam()
		    var that = this;
		    if (app.globalAgentData.data && app.globalAgentData.data != '') {
		      that.setData({
		        agentData: app.globalAgentData
		      })
		    }else{
		      app.employIdCallback = function (agentDatas){
		        that.setData({
		          agentData: agentDatas
		        })
		      }
		    }
  },
  imageError: function (e) {
    var that = this;
    if (e.target.id == "shareImageUrl") {
      var cMI = 'agentData.message.shareImageUrl'
      this.setData({
        [cMI]: 'http://www.sinelinked.com/static/other/pic-bg3.jpg',
        xcx_title: that.data.agentData.data[0].pro_xcx_title
      })
    }

  },
  //监听内容
  bindKeyInputC: function (e) {
    var cStr = 'consultData.c'
    this.setData({
      [cStr]: e.detail.value
    })
  },
  //监听姓名
  bindKeyInputName: function (e) {

    var namelStr = 'consultData.name'
    this.setData({
      [namelStr]: e.detail.value
    })
  },
  //监听电话
  bindKeyInputTel: function (e) {
    var telStr = 'consultData.tel'
    this.setData({
      [telStr]: e.detail.value
    })
  },
  //监听验证码
  bindKeyInputTel_token: function (e) {
    var tel_token = 'consultData.tel_token'
    this.setData({
      [tel_token]: e.detail.value
    })
  },
	bindRegionChange: function (event) {
		var addressCodeResult = event.detail.code[0]+'|' + event.detail.code[1]
		var cAddress = 'consultData.address'
		this.setData({
			region: event.detail.value,
			[cAddress]:addressCodeResult,
		})
	},
  // 提交咨询信息
  agentConsult: function (e) {
    var that = this;
    var uid = e.currentTarget.dataset.id
    wx.request({
      url: `https://ii.sinelinked.com/tg_web/api/order/publishOrders`,
      method:'POST',
      data: {
      	name:that.data.consultData.name,
      	tel: that.data.consultData.tel,
      	address:that.data.consultData.address,
      	content:that.data.consultData.c,
      	proxyId:uid,
      	orign:'4',
      	mtype:'1',
      	verifyCode:that.data.consultData.tel_token
      },
      success: function (res) {
        if (res.data.code == 0) {
        					wx.showModal({
        						title: '提示',
        						content: '提交成功',
        						showCancel: false,
        						success: function (res) {
        							var namelStr = 'consultData.name'
        							var telStr = 'consultData.tel'
        							var conStr = 'consultData.c'
        
        							that.setData({
        								[namelStr]: '',
        								[telStr]: '',
        								[conStr]:''
        							})
        						}
        					})
        				} else {
        					wx.showModal({
        						title: '提示',
        						content: '请完整填写内容,不可为空',
        						showCancel: false,
        						success: function (res) {}
        					})
        				}
      }
    })
  },
  // 发送验证码
  sendPhoneCode(e) {
    var that = this;
    wx.request({
     url: "https://ii.sinelinked.com/tg_web/api/phone/message/send",
     data: {
     	phone: that.data.consultData.tel,
     	flag: "code_7"
     },
      success: function (res) {
        if (res.data.error == 0) {
          wx.showToast({
            title: '发送成功',
            icon: 'success',
            duration: 2000
          })
          that.setData({
            pointerEvent: true
          })
          that.countdown()

        } else {

          wx.showToast({
            title: '发送失败',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  // 倒计时
  countdown: function (e) {
    var that = this;
    var timer;
    console.log(e)
    var countdownNum = 10

    function settime() {
      if (countdownNum <= 0) {
        that.setData({
          sendTxt: '发送验证码'
        })
        clearInterval(timer)
        countdownNum = 90;
        that.setData({
          pointerEvent: false
        })
        return;
      } else {
        that.setData({
          sendTxt: '重新发送' + countdownNum
        })
        countdownNum--;
      }
    }

    timer = setInterval(function () {
      settime()
    }, 1000)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    return {
      // title: that.data.agentData.data[0].pro_xcx_title || '您的贴心保险顾问',
      title: that.data.xcx_title,
      path: `/pages/pro-team/msg/msg?account_id=${that.data.agentData.userId}`,
      imageUrl: that.data.agentData.message.shareImageUrl + '?' + Math.random(),
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }

  },
})