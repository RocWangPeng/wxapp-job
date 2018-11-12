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
		isScope: 2,
		inputValue: '',
		searchResult: [],
		isResult: '',
		resultTip: '请输入搜索内容',
		spinShow: false,
		userInfo: {}, //用户信息
		agent: {},
		unineId: '',
		currentCode: '',
		prevUrls: [],
		joinedTeams: [] //所属团队

	},
	search(e) {
		var type = e.target.dataset.type
		var url = ''
		if (type == 'agent') {
			url = 'http://ii.sinelinked.com/tg_web/api/agent/searchByNameOrTel'
		} else {
			url = 'http://ii.sinelinked.com/tg_web/api/team/searchByNameOrTel'
		}

		var self = this
		wx.request({
			url: url,
			data: {
				nameOrTel: this.data.inputValue
			},
			success(res) {
				if (res.data.data) {
					self.setData({
						searchResult: res.data.data
					})

					switch (res.data.data.length) {
						case 0:
							self.setData({
								resultTip: '没有搜索到相关内容'
							})
							break;
						case 1:
							// 顾问
							if (res.data.data[0].type == 1) {
								wx.reLaunch({
									url: '/pages/index/index?userId=' + res.data.data[0].userId
								})
							} else if (res.data.data[0].type == 2) {
								// 团队
								wx.navigateToMiniProgram({
									appId: 'wx45ab72d81dc8cd72',
									path: '/pages/index/index?userId=' + res.data.data[0].userId,
									success(res) {
										// 打开成功
									}
								})
							}
							break;
						default:
							self.setData({
								resultTip: '搜索结果大于一，请输入执业证书编号搜索'
							})
							break;
					}

				} else {
					self.setData({
						resultTip: '没有搜索到相关内容'
					})
				}

			}
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

					that.setData({
						joinedTeams: res.data.data
					})
				}
			}
		})

	},
	bindKeyInput: function(e) {
		this.setData({
			inputValue: e.detail.value
		})
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {

		if (app.globalData.isScope) {
			this.setData({
				isScope: app.globalData.isScope,
			})
			var isScope = this.data.isScope
			/* 
				1 如果isScope已授权，则获取本地存储中的UnineId
				2 获取到后查询信息
				3 没有获取到本地中的UnineId，则让用户重新授权
			 */
			if (isScope == 1) {
				var UnineId = wx.getStorageSync('UnineId')
				if (UnineId) {
					this.setData({
						unineId: UnineId,
					})
					this.searchByUnionId(UnineId, false)
				} else {
					this.setData({
						isScope: 2,
					})
				}
			} else {

			}

		} else {
			app.readCallBackFn = res => {
				this.setData({
					isScope: res
				})
				var isScope = this.data.isScope
				if (isScope == 1) {
					var UnineId = wx.getStorageSync('UnineId')
					if (UnineId) {
						this.setData({
							unineId: UnineId,
						})
						this.searchByUnionId(UnineId, false)
					} else {
						this.setData({
							isScope: 2,
						})
					}
				} else {

				}
			}
		}
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
		this.searchByUnionId(this.data.unineId, true)
	},
	toTeam() {
		var joinedTeams = this.data.joinedTeams
		if (joinedTeams.length == 1) { //加入一个团队直接跳转
			wx.navigateToMiniProgram({
				appId: 'wx45ab72d81dc8cd72',
				path: '/pages/index/index?userId=' + joinedTeams[0].userId,
				success(res) {/* 打开成功 */}
			})
		
		} else if (joinedTeams.length > 1) { //加入多个团队，弹出列表
		
		} else if (joinedTeams.length == 0) {
			$Toast({
				content: '暂未加入团队',
				type: 'warning'
			});
		}
	},
	// 获取UnineId并查询用户信息
	getUnineId() {

		$Toast({
			content: '加载中',
			type: 'loading'
		});
		wechat.login()
			.then(res => {
				var code = res
				var params = {
					code: code,
					encryptedData: this.data.userInfo.encryptedData,
					iv: this.data.userInfo.iv,
					type: 1
				}

				wechat.getUnineId(params)
					.then(res => {
						var unionId = res.data.data.unionId
						this.setData({
							unineId: unionId,
							spinShow: false
						})
						// 存储unionId
						wx.setStorageSync('UnineId', unionId)
						this.searchByUnionId(unionId, true)
					})
					.catch(err => {
						console.log(err);
					})
			})

	},
	// 根据unionId获取顾问信息
	searchByUnionId: function(unionId, isSkip) {
		wx.request({
			url: 'http://ii.sinelinked.com/tg_web/api/agent/searchByUnionId',
			data: {
				unionId: unionId,
				type: 1
			},
			success: (res) => {
				this.setData({
					agent: res.data.data[0]
				})

				this.getJoinedTeams(res.data.data[0].userId)

				if (isSkip) {
					wx.reLaunch({
						url: '/pages/index/index?userId=' + res.data.data[0].userId
					})
				}

			}
		})
	},
	//预览太阳码
	previewImage: function() {
		var urls = []
		urls.push(this.data.agent.qrCodePath)
		wx.previewImage({
			current: this.data.agent.qrCodePath, // 当前显示图片的http链接
			urls: urls // 需要预览的图片http链接列表
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
