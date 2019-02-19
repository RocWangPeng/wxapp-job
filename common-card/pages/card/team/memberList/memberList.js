const {
	$Toast
} = require('../../../../dist/base/index');
var utils = require('../../../../utils/util.js')
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		memList: [],
		inputValue: '',
		cardId: '',
		spinShow: true
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
				cardId: cardId,
				teamId:options.teamId
			})
			this.getTeamAgent(cardId)
		}

	},
	toMsgBoard(e){
		utils.navigateTo({
			url: '/pages/card/team/msgBoard/msgBoard'
		})
	},
	toCard(e){
		var cardId = e.currentTarget.dataset.cardid
		utils.navigateTo({
			url: '/pages/card/person/index/index?cardId='+cardId
		})
	},
	toTeam(e){
		var teamid = e.currentTarget.dataset.teamid
		utils.navigateTo({
			url: '/pages/card/team/index/index?teamId='+teamid
		})
	},
	getTeamAgent(cardId) {
		var data = {
			cardId: cardId,
			type: 2
		}
		utils.requestTeam(utils.teamApi + '/team/get/cardInfoByType', 'GET', data)
			.then(res => {
				if (res.code == 0) {
					this.setData({
						memList: res.data.memberList
					})
				}
				// 隐藏spin
				setTimeout(() => {
					this.setData({
						spinShow: false
					})
				}, 150)
			})
	},
	bindKeyInput: function(e) {
		var that = this
		this.setData({
			inputValue: e.detail.value
		})
		if (e.detail.value == '') {
			that.getTeamAgent(that.data.cardId)
		}

	},
	searchByNameOrTel() {
		var that = this
		if (!this.data.inputValue) {
			$Toast({
				content: '请输入搜索内容',
				type: 'warning'
			});

			return
		}
		
		var data = {
			teamId:this.data.teamId,
			searchName:this.data.inputValue
		}

		utils.requestTeam(utils.teamApi + '/team/get/some/member', 'GET', data)
			.then(res => {
				if (res.code == 0) {
					this.setData({
						memList: res.data.memberList
					})
				}
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

})
