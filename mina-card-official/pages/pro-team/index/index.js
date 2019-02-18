//index.js
//获取应用实例
var app = getApp();
var cityData = require('../../../lib/region.js')
Page({
	data: {
		agentData: {},
		createTime: '2018',
		defaultHeadImg: 'http://www.sinelinked.com/static/other/default_head.png',
		consultData: {
			name: '', //姓名
			tel: '', //电话
			c: '', //内容
			tel_token: '' //验证码
		},
		getCityResultstr: '', //区域结果
		cityData: [],
		pointerEvent: false,
		sendTxt: '',
		teamId: '',
		scene: '',
		xcx_title: '您的贴心保险顾问',
		isStarAgent: false, //是否有团队之星
		starAgent: {} //团队之星
	},
	imageError: function (e) {
		var that = this;
		if (e.target.id == "shareImageUrl") {
			var cMI = 'agentData.coverTempletUrl'
			// this.setData({
			// 	[cMI]: 'http://www.sinelinked.com/static/other/pic-bg3.jpg',
			// })
		} else if (e.target.id == "ImgHeadPath") {
			//头像读取失败使用默认头像 
			var cMI = 'agentData.ImgHeadPath'
			this.setData({
				[cMI]: 'http://www.sinelinked.com/static/other/default_head.png'
			})
		}

	},
	makePhoneCall: function (phone) {
		var that = this
		wx.makePhoneCall({
			phoneNumber: that.data.agentData.phone
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
	//时间戳转格式
	formatDate: function (date) {
		var time = String(date)
		var year = time.slice(0, 4)
		var month = time.slice(4, 6)
		var date = time.slice(6, 8)
		var hour = time.slice(8, 10)
		var minute = time.slice(10, 12)

		return year + '-' + month + '-' + date
	},
	onLoad: function (options) {
		app.editTabBarProTeam()
		var that = this;
		//将城市数据赋值 
		that.setData({
			cityData: cityData
		})

		if (options.teamId) {
			that.setData({
				scene: options.teamId
			})
			wx.setStorageSync('teamId', options.teamId)
		}

		// 扫码场景下，获取用户信息account_id
		var scene = decodeURIComponent(options.scene)
		var account_id = scene.split('=')[1]
		if (account_id) {
			that.setData({
				teamId: account_id
			})
			wx.setStorageSync('teamId', account_id)
		}
	},
	onShow() {
		wx.showLoading({
			title: '加载中',
			mask: true
		})

		var that = this;

		var teamId = that.data.scene || wx.getStorageSync('teamId')
		if (teamId) {
			that.setData({
				teamId: teamId
			})
			//获取团队基本信息 
			wx.request({
				url: 'https://ii.sinelinked.com/tg_web/api/XCX/team/search',
				data: {
					teamId: teamId
				},
				success: function (res) {
					var areaArr = []
					if (res.data[0].area) {
						areaArr = res.data[0].area.split('|')
					}

					that.getCityResult(that.data.cityData, areaArr[0], areaArr[1])

					that.setData({
						agentData: res.data[0],
						xcx_title: res.data[0].teamXcxTitle,
						createTime: that.formatDate(res.data[0].createTime) //格式团队创建时间 
					})

					wx.hideLoading()
				}
			})

			//获取团队之星
			wx.request({
				url: 'https://ii.sinelinked.com/tg_web/api/user/XCX/getTeamStar',
				data: {
					teamId: teamId
				},
				success: function (res) {
					if (res.data.code == 0 && res.data.data.starAgent) {
						that.setData({
							starAgent: res.data.data.starAgent,
							isStarAgent: true
						})
					}
				}
			})





		} else if (that.data.scene) {
			wx.request({
				url: 'https://ii.sinelinked.com/tg_web/api/XCX/team/search',
				data: {
					teamId: that.data.scene
				},
				success: function (res) {
					var areaArr = []
					if (res.data[0].area) {
						areaArr = res.data[0].area.split('|')
					}

					that.getCityResult(that.data.cityData, areaArr[0], areaArr[1])
					that.setData({
						agentData: res.data,
					})
					wx.setStorageSync('teamId', that.data.scene)
					wx.hideLoading()
				}
			})

		} else {
			var teamId = that.data.teamId
			if (teamId) {
				that.setData({
					teamId: teamId
				})

				wx.request({
					url: 'https://ii.sinelinked.com/tg_web/api/XCX/team/search',
					data: {
						teamId: teamId
					},
					success: function (res) {
						var areaArr = []
						if (res.data[0].area) {
							areaArr = res.data[0].area.split('|')
						}

						that.getCityResult(that.data.cityData, areaArr[0], areaArr[1])
						that.setData({
							agentData: res.data[0],
						})
						//格式团队创建时间 
						that.setData({
							createTime: that.formatDate(new Date(that.data.agentData.data[0].creat_time))
						})
						wx.hideLoading()
					}
				})

				wx.setStorageSync('teamId', teamId)

			}
		}
	},
	navigatorTeam: function () {
		wx.navigateTo({
			url: '/pages/member/member'
		})
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {
		var that = this;
		return {
			title: that.data.agentData.teamXcxTitle,
			path: `/pages/pro-team/index/index?teamId=${that.data.agentData.userId}`,
			imageUrl: that.data.agentData.coverTempletUrl + '?' + Math.random(),
			success: function (res) {
				// 转发成功
			},
			fail: function (res) {
				// 转发失败
			}
		}
	},
})
