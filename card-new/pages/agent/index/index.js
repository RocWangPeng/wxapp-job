var cityData = require('../../../utils/region.js')
var utils = require('../../../utils/util.js')
let wechat = require('../../../utils/wechat.js');
//获取应用实例
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		userInfo: {},
		agentData: {}, //顾问信息
		userId: '',
		cityData: '', //城市信息数据
		transFormArea: '', //转换后城市
		coverTempletUrl: '',
		phone: '',
		teamList: [], //加入团队
		spinShow: true,
		authModalShow: false,
		isScope: 2, //1已授权 2未授权
		unionId: '',
		collectionData: {}, //收藏数据
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		var self = this
		var scenes = decodeURIComponent(options.scene)
		var userId = options.userId || scenes.split('=')[1]
		if (userId) {
			this.setData({
				userId: userId
			})
			// this.getInfo(userId)
			this.isCollect()
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
		// this.getUnineId()
		// this.isCollect()

	},
	showAuthModal() {
		this.setData({
			authModalShow: true
		})
	},
	closeAuthModal() {
		this.setData({
			authModalShow: false
		})
	},
	//获取信息
	getInfo(id) {
		var that = this;
		var id = id || that.data.userId
		return new Promise((resolve, reject) => {
			console.log('id');
			wx.request({
				url: `https://ii.sinelinked.com/tg_web/api/XCX/agent/search`,
				data: {
					agentId: id
				},
				success: function(res) {
					// 隐藏spin
					setTimeout(() => {
						that.setData({
							spinShow: false
						})
					}, 200)
					if (Object.prototype.toString.call(res.data) === '[object Array]') {

						var result = res.data[0]
						resolve(result)
						that.setData({
							agentData: result,
							coverTempletUrl: result.coverTempletUrl,
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
				if (res.data.code == 0) {
					var teamList = res.data.data
					var joinedTeamsArr = []
					teamList.map(item => {
						joinedTeamsArr.push({
							name: item.userName,
							userId: item.userId
						})
					})

					that.setData({
						teamList: teamList,
						teamChooseData: joinedTeamsArr
					})
				}
			}
		})

	},
	teamChooseHandle(e) {
		var userId = e.currentTarget.dataset.userid
		wx.redirectTo({
			url: '/pages/team/index/index?teamId=' + userId
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
	toTeam: function() {
		var teamList = this.data.teamList
		if (teamList.length == 1) {
			wx.navigateTo({
        url: '/pages/team/index/index?teamId=' + teamList[0].userId
			})
		} else if (teamList.length > 1) {
			this.setData({
				visibleTeamChoose: true,
			})
		} else {
			wx.showToast({
				title: '还未加入任何团队',
				icon: 'none',
				duration: 2000
			})
		}
	},
	// 判断名片是否已收藏
	isCollect() {
		var that = this
		return new Promise((resolve, reject) => {
			Promise.all([that.getInfo(that.data.userId), that.getUnineId()])
				.then(res => {
					var collectionData = {
						unionId: res[1], //unionId
						cardId: res[0].userId, //名片id
						cardName: res[0].userName, //名片姓名
						cardHeadUrl: res[0].headImg,
						cardType: "3" //3-保信顾问  4-保信团队
					}
					that.setData({
						collectionData: collectionData
					})

					wx.request({
						url: `https://ii.sinelinked.com/tg_web/api/card/isCollect`,
						data: {
							unionId: res[1],
							cardId: res[0].userId,
							cardType: 3 //名片类型：1-个体  2-团队 3-保信顾问  4-保信团队  5-商铺
						},
						success(res) {
							if (res.data.code == 0) {
								if (res.data.data.isCollect) {
									that.setData({
										isCollect: true
									})
								}
							}
						}
					})

				})

		})
	},
	getUnineId() {
		wx.showLoading({
			mask: true,
			title: '努力加载中...'
		})
		var self = this
		/* 
			1 如果isScope已授权，则获取本地存储中的UnineId
			2 获取到后查询信息
			3 没有获取到本地中的UnineId，则让用户重新授权
		 */
		return new Promise((resolve, reject) => {
			wechat.isAuth()
				.then(res => {
					self.setData({
						isScope: 1
					})
					wechat.login()
						.then(res => {
							var code = res
							wechat.getUserInfo().then((result) => {
								var params = {
									encryptedData: result.encryptedData,
									iv: result.iv,
									code: code,
									type: 1
								}
								wechat.getUnineId(params).then((result) => {
									wx.hideLoading()
									if (result.data.code == 0) {
										//获取到unionId
										var str = ['collectionData.unionId']
										self.setData({
											[str]: result.data.data.unionId
										})
										resolve(result.data.data.unionId)
									} else {
										wx.showToast({
											title: '系统出错,请关闭重试',
											icon: 'none',
											duration: 2000
										})
									}
								}).catch((err) => {
									wx.hideLoading()
									console.log(err)
								});
							}).catch((err) => {
								wx.hideLoading()
								console.log(err)
							});
						})
						.catch(err => {
							wx.hideLoading()
							console.log(err);
						})
				})
				.catch(err => {
					this.setData({
						isScope: 2
					})
					wx.hideLoading()

				})
		})
	},
	// 授权窗口
	onGotUserInfo(res) {
		this.setData({
			userInfo: res.detail
		})

		if (res.detail.errMsg == "getUserInfo:ok") {
			this.setData({
				isScope: 1,
			})
			this.getUnineId()
		}
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
