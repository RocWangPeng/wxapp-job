//获取应用实例
var app = getApp();
var cityData = require('../../../lib/region.js')

Page({
  data: {
    value1:'sss',
    cityData: [],
    agentData: {},
    ImgHeadPath: '',
    defaultHeadImg: 'http://www.sinelinked.com/static/other/default_head.png',
    consultData: {
      name: '', //姓名
      tel: '', //电话
      c: '', //内容
      tel_token: '', //验证码
    },
    teamPop: false,
    joinTeams: [], //已加入的团队
    chooseActive: 0, //当前选择的团队
    getCityResultstr: '', //区域结果
    pointerEvent: false,
    sendTxt: '',
    city: '',
    iCode: '', //返回验证码
    team_id: '',
    scenes: '', //二级码参数
    account_id: '',
    xcx_title: '您的贴心保险顾问',
    customItem: '全部'
  },
  imageError: function (e) {
    var that = this
    if (e.target.id == "shareImageUrl") {
      var cMI = 'agentData.coverTempletUrl'
      this.setData({
        [cMI]: 'http://www.sinelinked.com/static/other/pic-bg3.jpg',
      })
    } else if (e.target.id == "ImgHeadPath") {
      //头像读取失败使用默认头像 
      var cMI = 'agentData.ImgHeadPath'
      this.setData({
        [cMI]: 'http://www.sinelinked.com/static/other/default_head.png'
      })
    }
  },
  //跳转所属团队 
  navigatorTeam: function () {
    var that = this
    wx.request({
      url: `https://ii.sinelinked.com/tg_web/api/user/XCX/getJoinedTeams`,
      data: {
        userId: this.data.agentData.userId
      },
      success: function (res) {
        if (res.data.code == 0) {
          if (res.data.data.length == 1) { //加入一个团队直接跳转
            wx.navigateTo({
              url: `/pages/pro-team/index/index?teamId=${res.data.data[0].userId}`
            })
          } else if (res.data.data.length > 1) { //加入多个团队，弹出列表
            that.setData({
              joinTeams: res.data.data,
              teamPop: true
            })
          } else {
            wx.showToast({
              title: '未加入团队',
              icon: 'none',
              duration: 2000
            })
          }
        }
      }
    })

  },
  //选择团队
  chooseTeam(ev) {
    this.setData({
      chooseActive: ev.target.dataset.index
    })

    this.setData({
      teamPop: false
    })

    wx.navigateTo({
      url: `/pages/pro-team/index/index?teamId=${ev.target.dataset.userid}`
    })

  },
  makePhoneCall: function () {
    var that = this
    wx.makePhoneCall({
      phoneNumber: that.data.agentData.phone //仅为示例，并非真实的电话号码
    })
  },
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },
  previewImages: function (e) {
    var that = this;
    wx.previewImage({
      current: that.data.ImgHeadPath,
      urls: [that.data.ImgHeadPath],
      success: function () {

      }
    })
    wx.hideLoading()
  },
  goHome() {
    wx.reLaunch({
      url: '/pages/home/index/index',
      success: function () {
        console.log('home 跳转成功');
      },
      fail: function () {
        console.log('home 跳转失败');
      }
    })
  },
  // 根据代码匹配城市
  getCityResult(cityDatas, sheng, shi) {
    var getCityResultstr = ''
    cityDatas.forEach((item) => {
      // 匹配省
      if (item.regionId == sheng) {
        getCityResultstr += item.regionName + ' '



        item.children.forEach((item) => {
          if (item.regionId == shi) {
            getCityResultstr += item.regionName + ' '
          }
        })
      }
    })
    this.setData({
      getCityResultstr: getCityResultstr
    })
    return getCityResultstr
  },

  onLoad: function (options) {

    var that = this
    app.editTabBarAgent()
    //将城市数据赋值 
    that.setData({
      cityData: cityData
    })

    // 获取扫码状态下的用户id
    var scenes = decodeURIComponent(options.scene)

    var sceneAccount_id = scenes.split('=')[1]
    if (sceneAccount_id) {
      that.setData({
        scenes: sceneAccount_id
      })
      wx.setStorageSync('account_id', sceneAccount_id)
    }
    // 获取url参数如果没有获取本地储藏
    var account_idzf = options.account_id || wx.getStorageSync('account_id')
    console.log('index获取本地', account_idzf)
    if (account_idzf) {
      that.setData({
        account_id: account_idzf
      })
      wx.setStorageSync('account_id', account_idzf)
    }

  },
  onShow: function () {
    var that = this

    wx.showLoading({
      title: '加载中',
      mask: true
    })

    //  scenes存在情景下
    if (that.data.scenes) {
      wx.request({
        url: `https://ii.sinelinked.com/tg_web/api/XCX/agent/search`,
        data: {
          agentId: that.data.scenes
        },
        success: function (res) {
          var ImgHeadPath = res.data[0].headImg + '?' + Math.random()
          // var ImgHeadPath = 'http://www.sinelinked.com/static/other/default_head.png' //临时头像
          var areaArr = []
          if (res.data[0].area) {
            areaArr = res.data[0].area.split('|')
          }

          wx.setStorageSync('agentName', res.data[0].userName)

          that.getCityResult(that.data.cityData, areaArr[0], areaArr[1])

          that.setData({
            agentData: res.data[0],
            ImgHeadPath: ImgHeadPath,
            // team_id: res.data.message.teamId,
            xcx_title: res.data[0].xcxTitle
          })

          wx.hideLoading()
        }
      })
    } else if (that.data.account_id) {
      wx.request({
        url: `https://ii.sinelinked.com/tg_web/api/XCX/agent/search`,
        data: {
          agentId: that.data.account_id
        },
        success: function (res) {
          var ImgHeadPath = res.data[0].headImg + '?' + Math.random()
          var areaArr = []
          if (res.data[0].area) {
            areaArr = res.data[0].area.split('|')
          }

          wx.setStorageSync('agentName', res.data[0].userName)

          that.getCityResult(that.data.cityData, areaArr[0], areaArr[1])
          that.setData({
            agentData: res.data[0],
            ImgHeadPath: ImgHeadPath,
          })
          wx.hideLoading()
        }
      })
    } else {
      setTimeout(function () {
        wx.hideLoading()
      }, 6000)
    }

  },
  onShareAppMessage: function (res) {
    var that = this;
    console.log(that.data.agentData.xcxTitle);
    return {
      title: that.data.agentData.xcxTitle,
      path: `/pages/agent/index/index?account_id=${that.data.agentData.userId}`,
      imageUrl: that.data.agentData.coverTempletUrl + '?' + Math.random(),
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})