let utils = require('../../../../../utils/util.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		current: 'guanzhu',
		timeout: null,
		tips: '',
		result: [],
		focusList: [], //关注团队
		fansList: [], //粉丝团队

	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		this.focuslistsys()
	},
	handleChange({
		detail
	}) {
		this.setData({
			current: detail.key
		});
	},
	/* bindKeyInput */
	bindKeyInput: utils.debounce(function(e) {
		var value = e.detail.value
		this.searchteam(value)
	}),
	// 搜索团队
	searchteam(value) {
		var data = {
			teamName: value
		}
		utils.requestTeam(utils.teamApi + '/team/find/searchteam', 'POST', data, 'application/x-www-form-urlencoded	')
			.then(res => {
				if (res.code == 0) {
					this.setData({
						tips: '',
						result: res.data.cardList
					})
				} else if (res.code == 307) {
					this.setData({
						tips: '没有匹配到结果',
						result: []
					})
				} else {
					this.setData({
						tips: '',
						result: []
					})
				}
			})
	},
	/*
	 关注/取消关注
	 */
	focus(e, type = 1) {
		// type 1:顶部搜索模式  2，列表模式
		var dataset = e.target.dataset
		var index = dataset.index

		var data = {
			focusTeamId: dataset.focusteamid,
			status: dataset.status
		}
		utils.requestTeam(utils.teamApi + '/team/update/focus', 'POST', data, 'application/x-www-form-urlencoded')
			.then(res => {
				if (res.code == 0) {
					switch (dataset.status) {
						case '1':
							wx.showToast({
								title: '关注成功',
								icon: 'success',
								duration: 1500
							})
							// 改变当前状态
							if (type == 1) {
								var choose = "result[" + index + "].focusStatus"
								this.setData({
									[choose]: 1
								})
							}
							this.focuslistsys()
							break;
						case '3':
							wx.showToast({
								title: '取消关注',
								icon: 'success',
								duration: 1500
							})
							// 改变当前状态
							if (type == 1) {
								var choose = "result[" + index + "].focusStatus"
								this.setData({
									[choose]: 4
								})
							}
							this.focuslistsys()

							break;
						default:
							break;
					}

				} else {
					wx.showToast({
						title: res.error,
						icon: 'none',
						duration: 2000
					})
				}
			})
	},
	/* 查询 关联团队 和 团队粉丝 */
	focuslistsys() {
		// var dataset = e.target.dataset
		// var index = dataset.index
		utils.requestTeam(utils.teamApi + '/team/get/focuslistsys', 'GET', {}, 'application/x-www-form-urlencoded')
			.then(res => {
				if (res.code == 0) {
					this.setData({
						focusList: res.data.focusList,
						fansList: res.data.fansList
					})
				}
			})
	},
	/* 长按 */
	showAction(e) {
		var self = this
		var dataset = e.currentTarget.dataset

		wx.getSystemInfo({
			success: function(result) {
				//选项集合
				let itemList;
				if (result.platform == 'android') {
					itemList = ['取消关注', '查看团队', '取消']
				} else {
					itemList = ['取消关注', '查看团队']
				}
				wx.showActionSheet({
					itemList: itemList,
					success: function(res) {
						if (res.tapIndex == 0) {
							self.focus({
								target: {
									dataset
								},
							}, 2)
						} else if (res.tapIndex == 1) {
							utils.navigateTo({
								url:'/pages/card/team/index/index?cardId='+dataset.focusteamid
							})
						} else if (res.tapIndex == 2) {
							//取消操作
						}
					},
				})
			},
		})
	},
	toCard(e){
		var dataset = e.currentTarget.dataset
		utils.navigateTo({
			url:'/pages/card/team/index/index?cardId='+dataset.focusteamid
		})
	},
	tabsHandleChange(e){
		var { key } = e.detail 
		console.log(key);
		this.setData({
			current:key
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
