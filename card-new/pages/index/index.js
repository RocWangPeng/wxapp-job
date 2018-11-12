// pages/agent/index/index.js
var cityData = require('../../utils/region.js')
//获取应用实例
const app = getApp()

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		userInfo: {},
		agentData: {}, //会员数据
		getCityResultstr: '', //城市
		cityData: [],
		shareTitle: '', //自定义转发标题
		imageUrl: '', //自定义转发封面
		isManyTeam: false, //是否多团队
		manyTeam: [], //多团队数据
		noTeam: true, //是否有加入团队
		visible1: false,
		actions1: [],
		actions2: []
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		var self = this

		wx.showLoading({
			title: '努力加载中...'
		})

		// 获取扫码状态下的用户id
		var scenes = decodeURIComponent(options.scene)
		var userId = options.userId || scenes.split('=')[1] || wx.getStorageSync('agentId');
		if (userId) {
			this.getInfo(userId)
		}

		//将城市数据赋值 
		self.setData({
			cityData: cityData
		})



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
	//所属团队 
	getJoinedTeams(id) {
		var that = this
		wx.request({
			url: `https://ii.sinelinked.com/tg_web/api/user/XCX/getJoinedTeams`,
			data: {
				userId: id
			},
			success: function(res) {
				if (res.data.code == 0) {
					if (res.data.data.length == 1) { //加入一个团队直接跳转
						that.setData({
							isManyTeam: false,
							noTeam: true,
							manyTeam: res.data.data
						})
					} else if (res.data.data.length > 1) { //加入多个团队，弹出列表
						that.setData({
							isManyTeam: true,
							noTeam: true,
							manyTeam: res.data.data
						})
					} else if (res.data.data.length == 0) {
						that.setData({
							noTeam: false,
						})
					}

				}
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
	handleOpen1() {
		this.setData({
			visible2: true
		});
	},
	handleCancel2() {
		this.setData({
			visible2: false
		});
	},
	handleClickItem1({
		detail
	}) {
		const index = detail.index + 1;
		console.log('点击了选项' + index)
		// $Message({
		//   content: '点击了选项' + index
		// });
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
			imageUrl: this.data.agentData.coverTempletUrl || this.data.imageUrl
		}
	}
})
