const app = getApp()
let utils = require('../../../../utils/util.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		current: 'member',
		tabBar: '',
		memberModel: false,
		teamlist: [], //已加入的成员
		pepoleNum: 0, //成员人数
		hasApply: false, //是否有待审核成员
		hasMsg: false,
		spinShow: true
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		this.setData({
			tabBar: app.globalData.tabBar.team
		})
		this.teamnotice()
	},
	// tabBar切换
	handleChange({
		detail
	}) {
		var tabBarData = app.globalData.tabBar.team
		var routeType = getCurrentPages().length >= 9 ? 'reLaunch' : 'navigateTo'
		tabBarData.map((item) => {
			if (detail.key == item.key) {
				wx[routeType]({
					url: item.url
				})
			}
		})
	},
	toMemberInfo(e) {
		var cardid = e.currentTarget.dataset.cardid
		wx.navigateTo({
			url:'/pages/admin/team/memberInfo/memberInfo?cardId='+cardid
		})
	},
	// 查询当前团队最新公告
	teamnotice(){
		const activeCardId = wx.getStorageSync('activeCardId')
		
		var data = {
			teamId: activeCardId,
		}
		utils.requestTeam(utils.teamApi + '/team/get/teamnotice', 'GET', data, 'application/x-www-form-urlencoded')
			.then(res => {
				if (res.code == 0) {
					this.setData({
						teamnotice:res.data.teamnotice
					})
				}
			})
	},
	// 获取团队成员信息
	teamlist(status = 2) {
		var data = {
			status: status
		}
		return new Promise((resolve, reject) => {
			utils.requestTeam(utils.teamApi + '/team/find/teamlist', 'GET', data)
				.then(res => {
					if (res.code == 0) {
						if (status == 2) {
							var teamMemberList = res.data.teamMemberList
							if (res.data.pepoleNum) {
								this.setData({
										pepoleNum: res.data.pepoleNum
									}),
									this.setData({
										hasMsg: false
									})
							}
							if (teamMemberList.length == 0) {
								this.setData({
									hasMsg: true
								})
							} else {
								this.setData({
									hasMsg: false
								})
							}
							resolve(teamMemberList)
						} else {
							var teamMemberList = res.data.teamMemberList
							resolve(teamMemberList)
						}

					}
					// 隐藏spin
					setTimeout(() => {
						this.setData({
							spinShow: false
						})
					}, 100)
				})
		})
	},
	// 审核 删除成员
	teamapply(e) {
		var carPersonalId = e.currentTarget.dataset.carpersonalid
		var data = {
			carPersonalId: carPersonalId,
			status: 3

		}
		utils.requestTeam(utils.teamApi + '/team/review/teamapply', 'POST', data, 'application/x-www-form-urlencoded')
			.then(res => {
				if (res.code == 0) {
					wx.showToast({
						title: '已删除',
						icon: 'none',
						duration: 2000
					})
					this.setData({
						memberModel: false
					})
				} else {
					wx.showToast({
						title: res.error,
						icon: 'none',
						duration: 2000
					})
				}
				// 获取所有已加入的成员
				this.teamlist().then(res => {
					this.setData({
						teamlist: res
					})
				})
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
		// 获取待审核成员
		this.teamlist(1).then(res => {
			if (res.length && res.length > 0) {
				this.setData({
					hasApply: true
				})
			} else {
				this.setData({
					hasApply: false
				})
			}
		})
		// 获取所有已加入的成员
		this.teamlist().then(res => {
			this.setData({
				teamlist: res
			})
		})
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
