var utils = require('../../../../utils/util.js')
const {
	$Toast
} = require('../../../../dist/base/index');
let wechat = require('../../../../utils/wechat.js');
//获取应用实例
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		cardId: '',
		cardInfo: {}, //名片信息
		cityData: '',
		headImg: '',
		phone: '',
		cardForwardTitle: '', //转发标题
		cardForwardCoverUrl: '', //转发封面
		collectionData: {}, //收藏数据
		teamList: [], //所加入团队
		teamChooseData: [], //选择团队
		visibleTeamChoose: false, //团队选择框
		spinShow: true,
		cardDisplayTeamsStatus: 0, //是否显示当前团队
		isCollect: false, //是否已收藏
		unionId: '',
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		var self = this
		var scenes = decodeURIComponent(options.scene)
		var cardId = options.cardId || scenes.split('=')[1]
		if (cardId) {
			this.setData({
				cardId: cardId
			})
		}
	},
	// 判断名片是否已收藏
	isCollect(data) {
		utils.request(utils.personApi + '/personal/card/holder/isCollect', 'GET', data)
			.then(res => {
				if (res.code == 0) {
					if (res.data.isCollect) {
						this.setData({
							isCollect: true
						})
					}
				}
			})
	},
	//获取信息
	getInfo(cardId, type = 1) {
		var self = this;
		var data = {
			cardId: cardId,
			type: type
		}
		utils.request(utils.personApi + '/personal/get/card/info', 'GET', data)
			.then((res) => {
				if (res.code == 0) {
					if (type == 1) {
						var cardInfo = res.data.info
						for (let val in cardInfo) {
							if (cardInfo[val] === null) {
								cardInfo[val] = ''
							}
						}

						var currentUnionId = wx.getStorageSync('currentUnionId') //当前微信用户的unionId
						var currentOpenId = wx.getStorageSync('currentOpenId') //当前微信用户的openId
						if (!currentOpenId) {
							wechat.getOpenIdOrUnionId()
								.then(res => {
									var data = res
									currentUnionId = data.unionId
									currentOpenId = data.openId

									var collectionData = {
										unionId: currentUnionId || '', //unionId
										openId: currentOpenId, //openId
										cardId: cardInfo.id, //名片id
										cardHeadUrl: cardInfo.cardHeadUrl,
										cardName: cardInfo.cardName, //名片姓名
										cardType: "1" //名片类型 ：1-个体  2-团队  3-商铺
									}
									var phone = self.formatPhone(cardInfo.cardPhone)
									self.setData({
										collectionData: collectionData,
									})

									// 判断当前名片是否已收藏
									self.isCollect({
										unionId: currentUnionId || '', //unionId
										openId: currentOpenId, //openId
										cardId: cardInfo.id, //名片id
										cardType: 1
									})

								})

						} else {
							var collectionData = {
								unionId: currentUnionId || '', //unionId
								openId: currentOpenId, //openId
								cardId: cardInfo.id, //名片id
								cardHeadUrl: cardInfo.cardHeadUrl,
								cardName: cardInfo.cardName, //名片姓名
								cardType: "1" //名片类型 ：1-个体  2-团队  3-商铺
							}
							var phone = self.formatPhone(cardInfo.cardPhone)
							self.setData({
								collectionData: collectionData,
							})

							// 判断当前名片是否已收藏
							self.isCollect({
								unionId: currentUnionId || '', //unionId
								openId: currentOpenId, //openId
								cardId: cardInfo.id, //名片id
								cardType: 1
							})

						}

						self.setData({
							cardInfo: cardInfo,
							phone: phone,
							['cardInfo.cardHeadUrl']: cardInfo.cardHeadUrl + '#&' + Math.random()
						})

						// 隐藏spin
						setTimeout(() => {
							this.setData({
								spinShow: false
							})
						}, 150)

						this.counter(1)


						try {
							// 	// 存储是非团队成员是否可以查看团队成员
							wx.setStorageSync('cardOthersDetailsStatus', cardInfo.cardOthersDetailsStatus)
							// 存储当前名片id
							wx.setStorageSync('activeCardId', cardInfo.id)
							// 存储当前名片头像
							if (cardInfo.cardHeadUrl) {
								wx.setStorageSync('headImg', cardInfo.cardHeadUrl + '#&' + Math.random())
							} else {
								wx.setStorageSync('headImg', 'http://ii.sinelinked.com/miniProgramAssets/defaultHeadImg.jpg')
							}
							// 存储当前名片转发相关信息
							if (cardInfo.cardForwardTitle) {
								wx.setStorageSync('cardForwardTitle', cardInfo.cardForwardTitle)
							} else {
								wx.setStorageSync('cardForwardTitle', '')
							}
							if (cardInfo.cardForwardCoverUrl) {
								wx.setStorageSync('cardForwardCoverUrl', cardInfo.cardForwardCoverUrl)
							} else {
								wx.setStorageSync('cardForwardCoverUrl', '')
							}
							const cardForwardTitle = wx.getStorageSync('cardForwardTitle')
							const cardForwardCoverUrl = wx.getStorageSync('cardForwardCoverUrl')

							if (cardForwardTitle) {
								self.setData({
									cardForwardTitle: cardForwardTitle
								})
							}
							if (cardForwardCoverUrl) {
								self.setData({
									cardForwardCoverUrl: cardForwardCoverUrl + '&' + Math.random()
								})
							}

						} catch (e) {
							console.log(e);
						}
					} else if (type == 4) {
						var teamList = res.data.teamList
						var tempArr = []
						teamList.map(item => {
							tempArr.push({
								name: item.cardName,
								userId: item.id
							})
						})
						self.setData({
							teamList: teamList,
							teamChooseData: tempArr
						})
					}
				}



			})
	},
	// 统计收藏
	counter(type) {
		var data = {
			cardId: this.data.cardInfo.id,
			type: type
		}
		var requestUrl = utils.personApi + '/counter/refresh'
		utils.request(requestUrl, 'POST', data)
	},
	// 全屏预览图片
	previewImages(e) {
		var self = this;
		wx.previewImage({
			current: self.data.cardInfo.headImg,
			urls: [self.data.cardInfo.headImg]
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
			phoneNumber: that.data.cardInfo.cardPhone
		})
	},
	toMsg: function() {
		utils.navigateTo({
			url: '/pages/card/person/msg/msg'
		})
	},
	tointroduce(){
		utils.navigateTo({
			url: '/pages/card/person/introduce/introduce?cardId=' + this.data.cardInfo.id
		})
	},
	tocompany(){
		utils.navigateTo({
			url: '/pages/card/person/company/company?cardId=' + this.data.cardInfo.id
		})
	},
	toshow(){
		utils.navigateTo({
			url: '/pages/card/person/show/show?cardId=' + this.data.cardInfo.id
		})
	},
	toTeam: function() {
		// 判断是否展示该团队
		if (this.data.cardInfo.cardDisplayTeamsStatus == 1) {
			wx.showToast({
				title: '该团队暂未开放',
				icon: 'none',
				duration: 2000
			})
			return
		}
		var teamList = this.data.teamList
		if (teamList.length == 1) {
			utils.navigateTo({
				url: '/pages/card/team/index/index?cardId=' + teamList[0].id
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
	teamChooseHandle(e) {
		var cardId = e.currentTarget.dataset.cardid
		utils.navigateTo({
			url: '/pages/card/team/index/index?cardId=' + cardId
		})
		// 		wx.navigateTo({
		// 			url: '/pages/card/team/index/index?cardId=' + cardId
		// 		})
	},
	// 格式化手机号码
	formatPhone: function(phone) {
		var phone = String(phone)
		if (phone) {
			return phone.slice(0, 3) + '-' + phone.slice(3, 7) + '-' + phone.slice(7, 11)
		}
	},
	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function(options) {
		this.setData({
			visibleTeamChoose: false
		})
		var cardId = this.data.cardId
		if (cardId) {
			if (JSON.stringify(this.data.cardInfo) == "{}") {
				this.getInfo(cardId, 1)
				this.getInfo(cardId, 4)
			}

		}

		wx.setStorageSync('userType', 'person')
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
		this.counter(3)
		return {
			title: this.data.cardForwardTitle || '',
			path: '/pages/card/person/index/index?cardId=' + this.data.cardInfo.id,
			imageUrl: this.data.cardForwardCoverUrl
		}
	}
})
