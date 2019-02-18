//获取应用实例
const app = getApp()
let wechat = require('../../../../utils/wechat.js');
var utils = require('../../../../utils/util.js')
const {
	$Toast
} = require('../../../../dist/base/index');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		isScope: 1, //1已授权 2未授权
		inputValue: '',
		searchResult: [],
		isResult: '',
		resultTip: '请输入搜索内容',
		tipIcon: 'http://ii.sinelinked.com/miniProgramAssets/tip04.png',
		userInfo: {}, //用户信息
		agent: {},
		unineId: '',
		currentCode: '',
		prevUrls: [],
		joinedTeams: [], //所属团队
		activeTeamid: '', //当前所选团队
		qrCodeUrl: '',
		qrCodeTeamUrl: '',
		resultTipShow: false, //搜索结果显示
		previewImageShow: false,
		previewImageTeamShow: false, //团队太阳码显示
		cardList: [
			// 			{
			// 				title:'贤心',
			// 				id:'2222'
			// 			},
		],
		teamList: [
			// 			{
			// 				title:'贤心',
			// 				id:'2222'
			// 			},
		],
		visibilityCardList: false, //个人名片选择弹框
		visibilityTeamList: false, //个人团队选择弹框
		selfMyTeam: {}, //本微信号创建的团队
		spinShow: true
	},
	search(e) {
		var self = this
		var type = e.target.dataset.type
		var url = ''

		if (!this.data.inputValue) {
			self.setData({
				searchResult: '请输入搜索内容',
				resultTipShow: true
			})
			return
		}

		if (type == 'person') {
			url = utils.personApi + '/personal/search/cards'
		} else {
			url = utils.teamApi + '/team/search/cards'
		}

		wx.request({
			url: url,
			data: {
				searchName: this.data.inputValue
			},
			success: (res) => {
				if (res.data.code == 0) {
					self.setData({
						searchResult: res.data.data.cardList
					})
					switch (res.data.data.cardList.length) {
						case 0:
							self.setData({
								resultTip: '没有搜索到相关内容',
								tipIcon: 'http://ii.sinelinked.com/miniProgramAssets/tip04.png',
								resultTipShow: true
							})
							break;
						case 1:

							if (type == 'person') {
								utils.navigateTo({
									url: '/pages/card/person/index/index?cardId=' + res.data.data.cardList[0].id
								})
							} else if (type == 'team') {
								// 团队
								utils.navigateTo({
									url: '/pages/card/team/index/index?cardId=' + res.data.data.cardList[0].id
								})

							}
							break;
						default:
							self.setData({
								resultTip: '搜索结果大于一，请输入执业证书编号搜索',
								resultTipShow: true
							})
							break;
					}
				}
			}
		})

	},
	// 从个人名片弹框选择名片
	getChooseCard(e) {
		var index = e.detail.index
		utils.navigateTo({
			url: '/pages/card/person/index/index?cardId=' + this.data.cardList[index].id
		})
	},
	// 从个人团队弹框选择名片
	getChooseTeamCard(e) {
		var index = e.detail.index
		utils.navigateTo({
			url: '/pages/card/team/index/index?cardId=' + this.data.teamList[index].id
		})
	},
	bindKeyInput: function(e) {
		this.setData({
			inputValue: e.detail.value
		})
	},
	// 根据当前微信用户openid获取unionId
	getUnionIdByOpenId(openId) {
		return new Promise((resolve, reject) => {
			var data = {
				openId: openId,
				role: 1
			}
			utils.request(utils.personApi + '/personal/getUnionIdByOpenId', 'GET', data)
				.then(res => {
					var data = res.data
					if (data.unionId) {
						resolve(data.unionId)
					} else {
						reject(false)
					}
				})
		})
	},
	// 获取unionId
	getUnineId(unionId) {
		var self = this
		if (unionId) {
			self.setData({
				unineId: unionId
			})
			// 通过unionId获取个人名片列表
			self.cardListByUnion(unionId)
			self.teambyunion(unionId)
		}
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		var self = this
		// 存储当前小程序用户openId || unionId
		wechat.getOpenIdOrUnionId()
			.then(res => {
				var data = res
				console.log('app启动 获取 当前用户openId,unionId', data);
				// 存储当前小程序用户openId || unionId
				wx.setStorageSync('currentOpenId', data.openId)
				wx.setStorageSync('currentUnionId', data.unionId)
				var openId = data.openId
				if (openId) {
					this.getUnionIdByOpenId(openId)
						.then(unionId => {
							this.getUnineId(unionId)
						})
						.catch(() => {
							// 还没有名片
							wx.showModal({
								title: '提示',
								content: '您还未创建个人名片，是否马上进行创建',
								success(res) {
									if (res.confirm) {
										utils.navigateTo({
											url: '/pages/user/person/register/register'
										})
									} else if (res.cancel) {
										console.log('用户点击取消')
										self.setData({
											spinShow: false
										})
									}
								}
							})
						})
				}
				
			})
			
		
	},
	toCard() {
		var self = this
		// 如果只有一个名片，点击直接跳转，否则弹出选择框
		if (this.data.cardList.length == 1) {
			utils.navigateTo({
				url: '/pages/card/person/index/index?cardId=' + this.data.cardList[0].id
			})
		} else if (this.data.cardList.length > 1) {
			this.setData({
				visibilityCardList: true,
			})
		} else {

			// 还没有名片
			wx.showModal({
				title: '提示',
				content: '您还未创建个人名片，是否马上进行创建',
				success(res) {
					if (res.confirm) {
						utils.navigateTo({
							url: '/pages/user/person/register/register'
						})
					} else if (res.cancel) {
						console.log('用户点击取消')
						self.setData({
							spinShow: false
						})
					}
				}
			})
		}
	},
	toTeam() {
		var self = this
		// 如果只有一个名片，点击直接跳转，否则弹出选择框
		if (this.data.teamList.length == 1) {
			utils.navigateTo({
				url: '/pages/card/team/index/index?cardId=' + this.data.teamList[0].id
			})
		} else if (this.data.teamList.length > 1) {
			this.setData({
				visibilityTeamList: true,
			})
		} else {
			// 还没有名片
			wx.showModal({
				title: '提示',
				content: '您还未创建团队名片，是否马上进行创建',
				success(res) {
					if (res.confirm) {
						utils.navigateTo({
							url: '/pages/user/team/register/register'
						})
					} else if (res.cancel) {
						console.log('用户点击取消')
						self.setData({
							spinShow: false
						})
					}
				}
			})
		}
	},
	// 通过unionId获取个人名片列表
	cardListByUnion(unionId) {
		var self = this
		var data = {
			unionId: unionId
		}
		utils.request(utils.personApi + '/personal/get/cardListByUnion', 'GET', data, 'application/x-www-form-urlencoded')
			.then(res => {
				if (res.code == 0) {
					var userCardList = res.data.userCardList
					// 隐藏spin
					setTimeout(() => {
						this.setData({
							spinShow: false
						})
					}, 100)
					if (userCardList.length > 0) {
						var cardList = userCardList.map(item => {
							return {
								title: item.cardName,
								id: item.id
							}
						})
						this.setData({
							cardList: cardList
						})
					} else {
						// 还没有名片
						wx.showModal({
							title: '提示',
							content: '您还未创建个人名片，是否马上进行创建',
							success(res) {
								if (res.confirm) {
									utils.navigateTo({
										url: '/pages/user/person/register/register'
									})
								} else if (res.cancel) {
									console.log('用户点击取消')
									self.setData({
										spinShow: false
									})
								}
							}
						})
					}

				}
				
			})
	},
	// 根据cardId获取所加入的团队
	getJoinedTeam(cardId) {
		var data = {
			cardId: cardId,
			type: 4
		}
		utils.request(utils.personApi + '/personal/get/card/info', 'GET', data)
			.then(res => {
				if (res.code == 0) {
					this.teambyunion((result) => {
						var selfMyTeam, userTeamList
						userTeamList = res.data.teamList
						selfMyTeam = result.data

						if (userTeamList.length > 0) {
							var teamList = userTeamList.map(item => {
								return {
									title: item.cardName,
									id: item.id
								}
							})

							let flag = false;
							if (selfMyTeam) {
								teamList.map(item => {
									if (item.title == selfMyTeam.cardName) {
										flag = true
									}
								})
							}

							if (!flag) {
								teamList.push({
									title: selfMyTeam.cardName,
									id: selfMyTeam.id
								})
							}

							this.setData({
								teamList: teamList
							})
						} else {
							if (selfMyTeam) {
								var teamList = []
								teamList.push({
									title: selfMyTeam.cardName,
									id: selfMyTeam.id
								})
								this.setData({
									teamList: teamList
								})
							}

						}

					})

				}
			})
	},
	// 根据微信unionId查询创建团队名片信息
	teambyunion() {
		var data = {
			unionId: this.data.unineId
		}
		utils.requestTeam(utils.teamApi + '/team/get/teambyunion', 'POST', data, 'application/x-www-form-urlencoded')
			.then(res => {
				console.log(res);
				if (res.code == 0) {
					var selfMyTeam, userTeamList;
					userTeamList = res.data
					selfMyTeam = res.data

					if (userTeamList.length > 0) {
						var teamList = userTeamList.map(item => {
							return {
								title: item.cardName,
								id: item.id
							}
						})

						console.log(teamList);

						function unique(array) { // 对象去重方法
							var allArr = []; //建立新的临时数组
							for (var i = 0; i < array.length; i++) {
								var flag = true;
								for (var j = 0; j < allArr.length; j++) {
									if (array[i].title == allArr[j].title) {
										flag = false;
									};
								};
								if (flag) {
									allArr.push(array[i]);
								};
							};
							return allArr;
						}
						var newData = unique(teamList)
						console.log(newData);


						this.setData({
							teamList: newData
						})
					} else {
						if (selfMyTeam) {
							var teamList = []
							teamList.push({
								title: selfMyTeam.cardName,
								id: selfMyTeam.id
							})
							this.setData({
								teamList: teamList
							})
						}

					}
				}
			})
	},
	//预览太阳码
	previewImage: function() {
		this.setData({
			qrCodeUrl: this.data.agent.qrCodePath,
			previewImageShow: true,
		})
	},
	//预览太阳码
	previewImageTeam: function() {
		if (this.data.teamChooseData.length == 0) {
			$Toast({
				content: '您还未有任何团队,请完善团队信息或加入团队',
				type: 'warning'
			});
		} else if (this.data.teamChooseData.length == 1) {
			this.setData({
				qrCodeTeamUrl: this.data.teamChooseData[0].qrCodePath,
				previewImageTeamShow: true,
			})
		} else if (this.data.teamChooseData.length > 1) {
			if (this.data.activeTeamid) {
				this.data.teamChooseData.map(item => {
					if (item.userId == this.data.activeTeamid) {
						this.setData({
							qrCodeTeamUrl: item.qrCodePath,
							previewImageTeamShow: true,
						})
					}
				})
			} else {
				this.setData({
					visibleTeamChoose: true
				});
			}
		}
	},
	// 弹出框 选择团队
	teamChooseHandle(e) {
		var userId = e.currentTarget.dataset.userid
		this.setData({
			activeTeamid: userId,
			visibleTeamChoose: false
		});
		wx.setStorageSync('teamId', userId)
	},
	// 关闭团队太阳码预览
	closePreviewImageTeam() {
		this.setData({
			previewImageTeamShow: false,
			activeTeamid: ''
		})
	},
	// 关闭码预览
	closePreviewImage() {
		this.setData({
			previewImageShow: false,
		})
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function() {},

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

	}
})
