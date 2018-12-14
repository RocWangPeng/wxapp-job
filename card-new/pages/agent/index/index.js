var cityData = require('../../../utils/region.js')
var utils = require('../../../utils/util.js')
//获取应用实例
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		userInfo: {},
		agentData: {}, //顾问信息
		cityData: '', //城市信息数据
		transFormArea: '', //转换后城市
		coverTempletUrl: '',
		phone: ''

	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		var self = this
		var scenes = decodeURIComponent(options.scene)
		var userId = options.userId || scenes.split('=')[1]
		if (userId) {
			this.getInfo(userId)
		} else {
			try {
				var agentData = wx.getStorageSync('agentData')
				if (agentData) {
					self.setData({
						agentData: agentData,
						coverTempletUrl: agentData.coverTempletUrl
					})
					var phone = self.formatPhone(agentData.phone)
					self.setData({
						phone: phone
					})

					var areaArr = []

					if (self.data.agentData.area) {
						areaArr = self.data.agentData.area.split('|')
						self.setData({
							transFormArea: utils.getCityResult(cityData, areaArr[0], areaArr[1])
						})
					}
				}
			} catch (e) {
				// Do something when catch error
			}
		}

	},
	//获取信息
	getInfo(id) {
		wx.showNavigationBarLoading()
		var that = this;
		wx.request({
			url: `https://ii.sinelinked.com/tg_web/api/XCX/agent/search`,
			data: {
				agentId: id
			},
			success: function(res) {
				wx.hideLoading()
				if (Object.prototype.toString.call(res.data) === '[object Array]') {

					var result = res.data[0]
					that.setData({
						agentData: result,
						coverTempletUrl: result.coverTempletUrl
					})
					var phone = that.formatPhone(result.phone)
					that.setData({
						'agentData.headImg': result.headImg + '&' + Math.random() * 10,
						phone: phone
					})

					try {
						wx.setStorageSync('agentData', result)
					} catch (e) {}

					var areaArr = []
					if (res.data[0].area) {
						areaArr = res.data[0].area.split('|')
						that.setData({
							transFormArea: utils.getCityResult(cityData, areaArr[0], areaArr[1])
						})
					}
				}
				that.getJoinedTeams(id)
			}
		})
	},
	// 全屏预览图片
	previewImages(e) {
		var self = this;
		wx.previewImage({
			current: self.data.agentData.headImg,
			urls: [self.data.agentData.headImg]
		})
	},
	//所属团队 
	getJoinedTeams(id) {

		var that = this
		wx.request({
			url: `https://ii.sinelinked.com/tg_web/api/user/XCX/getJoinedTeams`,
			data: {
				userId: id
			},
			success: function(res) {
				wx.hideNavigationBarLoading()
				if (res.data.code == 0) {
					that.setData({
						manyTeam: res.data.data
					})

					try {
						wx.setStorageSync('joinedTeams', res.data.data)
					} catch (e) {}


				}
			}
		})

	},
	// 播打电话
	makePhoneCall: function() {
		var that = this
		wx.makePhoneCall({
			phoneNumber: that.data.agentData.phone //仅为示例，并非真实的电话号码
		})
	},
	toMsg: function() {
		wx.navigateTo({
			url: '/pages/agent/msg/msg'
		})
	},
	// 格式化手机号码
	formatPhone: function(phone) {
		var phone = String(phone)
		if (phone) {
			return phone.slice(0, 3) + '-' + phone.slice(3, 7) + '-' + phone.slice(7, 11)
		}
	},
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function() {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function(options) {

	},
	onError: function(msg) {
		console.log(msg)
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
			title: this.data.agentData.xcxTitle || '您的贴心保险顾问',
			path: '/pages/agent/index/index?userId=' + this.data.agentData.userId,
			imageUrl: this.data.coverTempletUrl
		}
	}
})
