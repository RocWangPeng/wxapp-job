// pages/agent/index/index.js
var cityData = require('../../../utils/region.js')
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		agentData: {}, //会员数据
		getCityResultstr: '', //城市
		createTime: '', //创建时间
		isStarAgent: false, //是否有团队之星
		starAgent: {}, //团队之星
		cityData: [],
		phone: '',
		spinShow:true,
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		var self = this;
		var scenes = decodeURIComponent(options.scene)

		var teamId = options.teamId || scenes.split('=')[1]
		// 获取扫码状态下的用户id
		if (teamId) {
			this.getInfo(teamId)
		} else {
			try {
				var teamData = wx.getStorageSync('teamData')
				if (teamData) {
					self.setData({
						agentData: teamData,
						coverTempletUrl: teamData.coverTempletUrl
					})
					
					if (teamData.createTime) {
						self.setData({
							createTime: self.formatDate(teamData.createTime)
						})
					}
					var phone = self.formatPhone(teamData.phone)
					self.setData({
						phone: phone
					})
					wx.setStorageSync('teamId', teamData.userId)

				}
			} catch (e) {
				// Do something when catch error
				console.log(e);
			}
		}


		//将城市数据赋值 
		self.setData({
			cityData: cityData
		})

	},
	//获取信息
	getInfo(teamId) {
		var self = this;
		wx.request({
			url: `https://ii.sinelinked.com/tg_web/api/XCX/team/search`,
			data: {
				teamId: teamId
			},
			success: function(res) {
				// 隐藏spin
				setTimeout(()=>{
					self.setData({spinShow:false})
				},200)
				if (Object.prototype.toString.call(res.data) === '[object Array]') {
					var result = res.data[0]

					self.setData({
						agentData: result,
						coverTempletUrl: result.coverTempletUrl
					})
					var phone = self.formatPhone(result.phone)
					self.setData({
						phone: phone
					})

					try {
						wx.setStorageSync('teamData', result)
						wx.setStorageSync('teamId', result.userId)
					} catch (e) {

					}
					// 匹配城市
					var areaArr = []
					if (res.data[0].area) {
						areaArr = res.data[0].area.split('|')
					}
					self.getCityResult(self.data.cityData, areaArr[0], areaArr[1])
					// 格式化创建时间
					if (res.data[0].createTime) {
						self.setData({
							createTime: self.formatDate(res.data[0].createTime)
						})
					}
				} else {

				}
				// 用户如果没有传头像，赋默认值
				if (!self.data.agentData.headImg) {
					var headImg = 'agentData.headImg'
					self.setData({
						[headImg]: 'http://ii.sinelinked.com/miniProgramAssets/headImg.jpg'
					})
				}
				// self.getTeamStar(res.data[0].userId)
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
	// 获取团队之星
	getTeamStar: function(teamId) {
		var that = this;
		//获取团队之星
		wx.request({
			url: 'https://ii.sinelinked.com/tg_web/api/user/XCX/getTeamStar',
			data: {
				teamId: teamId
			},
			success: function(res) {
				if (res.data.code == 0 && res.data.data.starAgent) {
					that.setData({
						starAgent: res.data.data.starAgent,
						isStarAgent: true
					})
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
			url: '/pages/team/msg/msg'
		})
	},
	// 跳转团队成员轮播
	toMember() {
		wx.navigateTo({
			url: '/pages/member/member?title=' + this.data.agentData.userId
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
	formatDate: function(date) {
		var time = String(date)
		var year = time.slice(0, 4)
		var month = time.slice(4, 6)
		var date = time.slice(6, 8)
		var hour = time.slice(8, 10)
		var minute = time.slice(10, 12)
		return year + '-' + month + '-' + date
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
			title: this.data.agentData.teamXcxTitle || '您的贴心保险顾问',
			path: '/pages/team/index/index?teamId=' + this.data.agentData.userId,
			imageUrl: this.data.coverTempletUrl
		}
	}
})
