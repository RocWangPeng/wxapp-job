//获取应用实例
const app = getApp()
let wechat = require('../../utils/wechat.js');
const {
	$Toast
} = require('../../dist/base/index');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		isScope: 2, //1已授权 2未授权
		inputValue: '',
		searchResult: [],
		isResult: '',
		resultTip: '请输入搜索内容',
		tipIcon: 'http://ii.sinelinked.com/miniProgramAssets/tip04.png',
		spinShow: false,
		userInfo: {}, //用户信息
		agent: {},
		unineId: '',
		currentCode: '',
		prevUrls: [],
		visibleTeamChoose: false, //显示选择团队弹框
		teamChooseData: [
			// 			{
			// 				name: '记忆的时间差',
			// 				icon: 'group_fill',
			// 				color: '#ff9900'
			// 			}
		],
		joinedTeams: [], //所属团队
		activeTeamid: '', //当前所选团队
		visible1: false,
		qrCodeUrl: '',
		qrCodeTeamUrl: '',
		resultTipShow: false, //搜索结果显示
		previewImageShow: false,
		previewImageTeamShow: false, //团队太阳码显示
	},

	search(e) {
		var self = this
		var type = e.target.dataset.type
		var url = ''
		if (this.data.inputValue == '') {
			self.setData({
				searchResult: '请输入搜索内容',
				resultTipShow: true
			})
			return
		}

		if (type == 'agent') {
			url = 'https://ii.sinelinked.com/tg_web/api/agent/searchByNameOrTel'
		} else {
			url = 'https://ii.sinelinked.com/tg_web/api/team/searchByNameOrTel'
		}


		wx.request({
			url: url,
			data: {
				nameOrTel: this.data.inputValue
			},
			success(res) {

				if (res.data.data.length) {
					self.setData({
						searchResult: res.data.data
					})

					switch (res.data.data.length) {
						case 0:
							self.setData({
								resultTip: '没有搜索到相关内容',
								tipIcon: 'http://ii.sinelinked.com/miniProgramAssets/tip04.png',
								resultTipShow: true
							})
							break;
						case 1:

							if (res.data.data[0].type == 1) {
								wx.reLaunch({
									url: '/pages/agent/index/index?userId=' + res.data.data[0].userId
								})
							} else if (res.data.data[0].type == 2) {
								// 团队
								wx.reLaunch({
									url: '/pages/team/index/index?teamId=' + res.data.data[0].userId
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

				} else {
					self.setData({
						resultTip: '没有搜索到相关内容',
						tipIcon: 'http://ii.sinelinked.com/miniProgramAssets/tip04.png',
						resultTipShow: true
					})
				}

			}
		})
	},
	//所加入的团队 
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
					var joinedTeams = []
					if (res.data.data.length) {
						// 将此用户创建的团队与所加入的团队合并
						res.data.data.map(item => {
							if (item.userName != that.data.agentJoinTeam.userName) {
								joinedTeams.push({
									name: item.userName,
									userId: item.userId,
									qrCodePath: item.qrCodePath
								})
							}
						})

						joinedTeams.push({
							name: that.data.agentJoinTeam.userName,
							userId: that.data.agentJoinTeam.userId,
							qrCodePath: that.data.agentJoinTeam.qrCodePath
						})

						that.setData({
							teamChooseData: joinedTeams,
						})

					} else {
						var temp = []
						temp.push(that.data.agentJoinTeam)
						that.setData({
							teamChooseData: temp,
						})
					}
				}
			}
		})

	},
	bindKeyInput: function(e) {
		this.setData({
			inputValue: e.detail.value
		})
	},
	// 
	searchTeamBrief() {
		var that = this;
		wx.request({
			url: `https://ii.sinelinked.com/tg_web/api/XCX/team/search`,
			data: {
				teamId: this.data.activeTeamid
			},
			success: function(res) {
				if (Object.prototype.toString.call(res.data) === '[object Array]') {
					var result = res.data[0]
					that.setData({
						qrCodePath: result.qrCodePath
					})
				}
			}
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
							
							try {
								var unionId = wx.getStorageSync('unionId')
								if (unionId) {
									// 根据unionId获取顾问信息
									self.searchByUnionId(unionId, false, 1)
									self.searchByUnionId(unionId, false, 2)
									self.setData({
										unionId: unionId
									})
								}else{
									wechat.getUnineId(params).then((result) => {
										if (result.data.code == 0) {
											//获取到unionId
											self.setData({
												unionId: result.data.data.unionId
											})
											wx.setStorageSync('unionId', result.data.data.unionId)
											// 根据unionId获取顾问信息
											self.searchByUnionId(result.data.data.unionId, false, 1)
											self.searchByUnionId(result.data.data.unionId, false, 2)
										} else {
											wx.showToast({
												title: '系统出错,请关闭重试',
												icon: 'none',
												duration: 2000
											})
										}
									}).catch((err) => {
										wx.hideLoading()
									});
								}
							} catch (e) {
								// Do something when catch error
							}
							
							
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
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		this.getUnineId()
		wx.showNavigationBarLoading()
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
	// 获取授权状态
	toCard() {
		this.searchByUnionId(this.data.unionId, true)
	},
	toTeam() {
		var self = this
		if (this.data.activeTeamid) {
			wx.setStorageSync('userType', 'team')
			wx.setStorageSync('teamId', this.data.activeTeamid)
			wx.navigateTo({
				url: '/pages/team/index/index?teamId=' + this.data.activeTeamid,
				success() {
					self.setData({
						activeTeamid: ''
					})
				}
			})

		} else {
			var joinedTeams = this.data.teamChooseData
			if (joinedTeams.length == 1) { //加入一个团队直接跳转
				wx.setStorageSync('userType', 'team')
				wx.setStorageSync('teamId', joinedTeams[0].userId)
				wx.navigateTo({
					url: '/pages/team/index/index?teamId=' + joinedTeams[0].userId,
					success() {
						self.setData({
							activeTeamid: ''
						})
					}
				})
			} else if (joinedTeams.length > 1) { //加入多个团队，弹出列表
				this.setData({
					visibleTeamChoose: true
				});

			} else if (joinedTeams.length == 0) {
				$Toast({
					content: '您还未有任何团队,请完善团队信息或加入团队',
					type: 'warning'
				});
			}
		}

	},
	// 根据unionId获取顾问/团队信息
	searchByUnionId(unionId, isSkip, type = 1) {
		wx.showLoading({
			mask: true,
			title: '努力加载中...'
		})
		var url = ''
		if (type == 1) {
			url = 'https://ii.sinelinked.com/tg_web/api/agent/searchByUnionId'
		} else {
			url = 'https://ii.sinelinked.com/tg_web/api/team/searchByUnionId'
		}

		wx.request({
			url: url,
			data: {
				unionId: unionId,
				type: type
			},
			success: (res) => {
				wx.hideLoading()
				if (res.data.code == 0) {
					if (type == 1) {
						this.setData({
							agent: res.data.data[0]
						})
						this.getJoinedTeams(res.data.data[0].userId)
					} else {
						this.setData({
							agentJoinTeam: res.data.data[0]
						})
					}

					if (isSkip) {
						wx.setStorageSync('userType', 'agent')
						wx.navigateTo({
							url: '/pages/agent/index/index?userId=' + res.data.data[0].userId
						})
					}

				} else {

					if (isSkip) {
						if (res.data.code == 46) {
							$Toast({
								content: '您还不是保信云顾问,请完善顾问信息后再使用名片',
								type: 'warning'
							});
						}
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

	}
})
