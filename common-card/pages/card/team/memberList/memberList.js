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
		spinShow: true,
		ifTeamuser:null,
		teamnotice:'',
		signature:[
			'怀才就像怀孕，时间久了才能让人看出来。',
			'你既然认准一条道路，何必去打听要走多久。',
			'生活可以是甜的，也可以是苦的，但不能是没味的。你可以胜利，也可以失败，但你不能屈服。',
			'不是井里没有水，而是挖的不够深；不是成功来的慢，而是放弃速度快。得到一件东西需要智慧，放弃一样东西则需要勇气！'
		],
		active_signature:'',
		focusList:[],//关联团队
		fansList:[],//团队粉丝

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
		
		this.teamuser()
		this.teamnotice()
		this.focuslist()
	},
	// 查询当前团队最新公告
	teamnotice(){
		const activeCardId = wx.getStorageSync('activeCardId')
		
		var data = {
			teamId: activeCardId,
		}
		utils.requestTeam(utils.teamApi + '/team/get/teamnotice', 'GET', data, 'application/x-www-form-urlencoded')
			.then(res => {
				console.log(res);
				if (res.code == 0) {
					this.setData({
						teamnotice:res.data.noticeContent
					})
				}else{
					var signature = this.data.signature
					this.setData({
						active_signature:signature[Math.floor(Math.random()*signature.length)]
					})
				}
			})
	},
	// 验证当前浏览用户是否属于当前团队的用户
	teamuser(){
		const currentOpenId = wx.getStorageSync('currentOpenId')
		const activeCardId = wx.getStorageSync('activeCardId')
		var data = {
			teamId:activeCardId,
			openId:currentOpenId
		}
		utils.requestTeam(utils.teamApi + '/team/valid/teamuser', 'POST', data,'application/x-www-form-urlencoded')
			.then(res=>{
				if(res.code == 0){
					this.setData({
						ifTeamuser:true
					})
				}else{
					this.setData({
						ifTeamuser:false
					})
				}
			})
	},
	toMsgBoard(e){
		var ifTeamuser = this.data.ifTeamuser
		if(!ifTeamuser){
			return
		}
		if(ifTeamuser){
			utils.navigateTo({
				url: '/pages/card/team/msgBoard/msgBoard'
			})
		}else{
			utils.navigateTo({
				url: '/pages/card/team/msg/msg'
			})
		}
		
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
	// 查询 关联团队 和 团队粉丝
	focuslist(){
		const currentOpenId = wx.getStorageSync('currentOpenId')
		const activeCardId = wx.getStorageSync('activeCardId')
		var data = {
			teamId:activeCardId,
			openId:currentOpenId
		}
		utils.requestTeam(utils.teamApi + '/team/get/focuslist', 'POST', data, 'application/x-www-form-urlencoded')
			.then(res => {
				if (res.code == 0) {
					this.setData({
						focusList:res.data.focusList,
						fansList:res.data.fansList
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
