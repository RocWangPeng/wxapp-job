let utils = require('../../../../../utils/util.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		tempFilePaths: '',
		cardForwardTitle: '', //转发标题
		cardId: '', //名片id
		isChooseImg: false,
		teamInfo: {}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		this.cardTeamInfo()
	},
	// 从本地相册选择图片或使用相机拍照。
	chooseImage() {
		var self = this;
		wx.chooseImage({
			count: 9,
			sizeType: ['original', 'compressed'],
			sourceType: ['album', 'camera'],
			success(res) {
				const tempFilePaths = res.tempFilePaths
				self.setData({
					tempFilePaths: tempFilePaths,
					isChooseImg: true
				})

				wx.uploadFile({
					url: utils.teamApi + '/team/save/teamshowimg',
					header: {
						'cookie': "_auth=" + wx.getStorageSync('_auth_team'),
						"Content-Type": "application/x-www-form-urlencoded"
					},
					filePath: self.data.tempFilePaths[0],
					name: 'files',
					formData: {
						flag: 4
					},
					success(res) {
						var res = JSON.parse(res.data)
						self.setData({
							tempFilePaths: res.data[0],
						})
					}
				})

			}
		})
	},
	bindshowDesc(e) {
		this.setData({
			cardForwardTitle: e.detail.value,
		})
	},
	// 获取名片信息
	cardTeamInfo() {
		utils.requestTeam(utils.teamApi + '/team/get/forwardteaminfo', 'GET')
			.then(res=>{
				if(res.code == 0){
					this.setData({
						cardForwardTitle:res.data.cardForwardTitle,
						tempFilePaths:res.data.cardForwardCoverUrl + "&"+Math.random()
					})
				}
			})
	},
	cancleForWard(){
		var self = this
		utils.requestTeam(utils.teamApi  + '/team/update/teamforwad')
			.then(res => {
				if (res.code == 0) {
					wx.showToast({
						title: '已取消',
						icon: 'none',
						duration: 2000
					})
					this.setData({
						tempFilePaths:''
					})
				} else {
					wx.showToast({
						title: res.error,
						icon: 'none',
						duration: 2000
					})
				}
			})
	},
	formSubmit(e) {
		var self = this

		if (!this.data.cardForwardTitle && !this.data.isChooseImg) {
			wx.showToast({
				title: '请输入标题或者选择封面图片',
				icon: 'none',
				duration: 2000
			})
			return
		}
		var data = {
			title:this.data.cardForwardTitle,
			coverUrl:this.data.tempFilePaths,
			templateType:1
		}
		wx.showLoading({
			title: '加载中',
			mask: true
		})
		utils.requestTeam(utils.teamApi + '/team/save/teamforward', 'POST', data, 'application/x-www-form-urlencoded')
			.then(res => {
				wx.hideLoading()
				if (res.code == 0) {
					wx.showToast({
						title: '资料提交成功',
						icon: 'none',
						duration: 2000
					})
				} else {
					wx.showToast({
						title: res.error,
						icon: 'none',
						duration: 2000
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

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function() {

	}
})
