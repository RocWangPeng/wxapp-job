const app = getApp()
let utils = require('../../../../utils/util.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		current: 'team',
		tabBar: '',
		hasMsg: false,
		hasTeam: false,
		teamList: [], //团队列表
		teamCount: 0, //团队个数
		searchTeamResult: [], //团队搜索结果
		visibleJoinTeam: false,
		activeTeamId: '',
		spinShow: true,
		cardList: [
			// 			{
			// 				title:'贤心',
			// 				id:'2222'
			// 			},
		],
		title: {
			show: true,
			title: '选择加入团队的名片'
		},
		visibilityCardList: false, //个人名片选择弹框
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		wx.setNavigationBarTitle({
			title: '团队'
		})
		this.setData({
			tabBar: app.globalData.tabBar.person
		})

	},
	// tabBar切换
	handleChange({
		detail
	}) {
		var tabBarData = app.globalData.tabBar.person
		var routeType = getCurrentPages().length >= 9 ? 'reLaunch' : 'navigateTo'
		tabBarData.map((item) => {
			if (detail.key == item.key) {
				wx[routeType]({
					url: item.url
				})
			}
		})
	},
	// 查询团队
	getMyTeamList() {
		utils.request(utils.personApi + '/personal/getMyTeamList', 'GET')
			.then(res => {
				if (res.code == 0) {
					let teamList = res.data.teamList

					if (teamList.length == 0) {
						this.setData({
							hasMsg: true
						})
					}
					this.setData({
						teamList: teamList,
						teamCount: res.data.teamCount
					})

				}
				// 隐藏spin
				setTimeout(() => {
					this.setData({
						spinShow: false
					})
				}, 100)
			})
	},
	// 查询团队信息（根据团队名模糊查询）
	serchTeamHandle(e) {
		var searchVal = e.detail.detail.value
		if (searchVal) {
			this.searchTeamByName(searchVal)
		} else {
			this.setData({
				hasTeam: false
			})
		}
	},
	searchTeamByName(searchVal) {
		var data = {
			teamName: searchVal
		}
		utils.request(utils.personApi + '/personal/searchTeamByName', 'GET', data)
			.then(res => {
				if (res.code == 0) {
					let teamList = res.data.teamList.items
					if (teamList.length == 0) {
						this.setData({
							hasTeam: false
						})
					} else {
						teamList.map(item => {
							item.createTime = item.createTime.slice(0, 10)
						})
						this.setData({
							hasTeam: true,
							searchTeamResult: teamList
						})
					}

				}
			})
	},
	// 搜索提示帮助信息
	searchTip() {
		wx.showModal({
			title: '提示',
			showCancel: false,
			content: '可以在此搜索系统内所有团队并且申请加入',
			success(res) {
				if (res.confirm) {

				} else if (res.cancel) {
					// console.log('用户点击取消')
				}
			}
		})
	},
	// 获取名片列表
	getCardList() {
		wx.showLoading({
			title: '加载中',
		})
		utils.request(utils.personApi + '/personal/get/card/List', 'GET')
			.then(res => {
				wx.hideLoading()
				if (res.code == 0) {
					var userCardList = res.data.cardList
					var cardList = userCardList.map(item => {
						return {
							title: item.cardName,
							id: item.id
						}
					})
					this.setData({
							cardList: cardList
						}),
						this.setData({
							visibilityCardList: true
						})
				}
			})
	},
	// 申请加入团队
	joinTeamHandle(e) {
		this.setData({
			activeTeamId: e.currentTarget.dataset.id
		})
		this.getCardList()

	},
	// 获取当前所选名片
	getChooseCard(e) {
		var data = {
			cardId: this.data.cardList[e.detail.index].id,
			teamId: this.data.activeTeamId
		}
		this.enterJoinTeam(data)
	},
	// 确认加入团队
	enterJoinTeam(data) {
		utils.request(utils.personApi + '/personal/applyAddTeam', 'POST', data, 'application/x-www-form-urlencoded')
			.then(res => {
				if (res.code == 0) {
					this.setData({
						visibleJoinTeam: false,
						hasMsg: false
					})
					wx.showToast({
						title: '已申请加入,等待团队审核',
						icon: 'none',
						duration: 2000
					})
					this.getMyTeamList()
				} else {
					this.setData({
						visibleJoinTeam: false
					})
					wx.showToast({
						title: res.error,
						icon: 'none',
						duration: 2000
					})
				}
			})
	},
	// 取消加入团队
	closeJoinTeam() {
		this.setData({
			visibleJoinTeam: false
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
		this.getMyTeamList()
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

})
