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
		agentData:{},//顾问信息
		cityData:'',//城市信息数据
		transFormArea:'',//转换后城市

	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		var self = this
		// wx.showLoading({
		// 	title: '努力加载中...'
		// })
		
		if(app.globalData.agentData){
			self.setData({agentData:app.globalData.agentData})
			var areaArr = []
			if (self.data.agentData.area) {
				areaArr = self.data.agentData.area.split('|')
				self.setData({transFormArea:utils.getCityResult(cityData,areaArr[0], areaArr[1])})
			}
		}else{
			// 防止app.js还没执行完就已经page.onload，所以增加回调
			app.callBack =res=>{
				self.setData({agentData:res})
				var areaArr = []
				if (self.data.agentData.area) {
					areaArr = self.data.agentData.area.split('|')
					self.setData({transFormArea:utils.getCityResult(cityData,areaArr[0], areaArr[1])})
				}
			}
		}

		// 获取扫码状态下的用户id
// 		var scenes = decodeURIComponent(options.scene)
// 		var userId = options.userId || scenes.split('=')[1] || wx.getStorageSync('agentId');
// 		if (userId) {
// 			// this.getInfo(userId)
// 		}

		// 将城市数据赋值 
		// self.setData({
		// 	cityData: cityData
		// })

	},
	//获取信息
	getInfo(id) {
		setTimeout(function() {
			wx.hideLoading()
		}, 6000)
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
					wx.setStorageSync('agentId', result.userId)
					wx.setStorageSync('phone', result.phone)
					that.setData({
						agentData: result
					})
					var areaArr = []
					if (res.data[0].area) {
						areaArr = res.data[0].area.split('|')
					}
					that.getCityResult(that.data.cityData, areaArr[0], areaArr[1])
				} else {

				}

				// 用户如果没有传头像，赋默认值
				if (!that.data.agentData.headImg) {
					var headImg = 'agentData.headImg'
					that.setData({
						[headImg]: 'http://ii.sinelinked.com/miniProgramAssets/headImg.jpg'
					})
				}

				that.getJoinedTeams(id)
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
			path: '/pages/index/index?userId=' + this.data.agentData.userId,
		}
	}
})
