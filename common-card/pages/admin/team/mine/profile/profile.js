let utils = require('../../../../../utils/util.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		tempFilePaths: '',
		isChooseImg: false,
		imgHeadFile: [], //头像文件
		name: '',
		teamInfo: {}, //名片信息
		phone: '',
		imgUrl: [], //上传成功后的图片地址
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		this.cardTeamInfo()
	},
	bindKeyInputPhone(e) {
		this.setData({
			phone: e.detail.value
		})
	},
	// 从本地相册选择图片或使用相机拍照。
	chooseImage() {
		var self = this;
		wx.chooseImage({
			count: 1,
			sizeType: ['original', 'compressed'],
			sourceType: ['album', 'camera'],
			success(res) {

				// tempFilePath可以作为img标签的src属性显示图片
				self.setData({
					['teamInfo.cardHeadUrl']:res.tempFilePaths[0]
				})

				self.upPic()

			}
		})
	},
	// 上传图片
	upPic() {
		var self = this;
		wx.uploadFile({
			url: utils.teamApi + '/team/save/teamshowimg',
			header: {
				'cookie': "_auth=" + wx.getStorageSync('_auth_team'),
				"Content-Type": "multipart/form-data"
			},
			filePath: self.data.teamInfo.cardHeadUrl,
			name: 'files',
			formData: {
				flag: 1
			},
			success(res) {
				console.log(res);
				var res = JSON.parse(res.data)
				if (res.code == 0) {
					// 上传成功后的地址
					var imgUrl = res.data[0]
					self.setData({
						imgUrl: imgUrl
					})
				} else {
					console.log(res.error);
					wx.showToast({
						title: '头像上传失败,请退出重新登陆',
						icon: 'none',
						duration: 2000
					})
				}
			}
		})
	},
		// 获取团队名片信息
	cardTeamInfo() {
		utils.requestTeam(utils.teamApi + '/team/get/cardTeamInfo', 'GET')
			.then(res => {
				if (res.code == 0) {
					var teamInfo =  res.data
					if(teamInfo.cardHeadUrl){
						teamInfo.cardHeadUrl = teamInfo.cardHeadUrl + "&"+Math.random()
					}
					
					this.setData({
						cardInfo: teamInfo,
					})
					
				}
				// 隐藏spin
				setTimeout(()=>{
					this.setData({spinShow:false})
				},100)
			})
	},
	//修改信息
	formSubmit(e) {
		var formData = e.detail.value
		var self = this
		console.log(self.data.imgUrl);
		var data = {
			'cardHeadUrl':self.data.imgUrl || self.data.teamInfo.cardHeadUrl || 'http://ii.sinelinked.com/miniProgramAssets/defaultHeadImg.jpg',
			'cardName': formData.cardName,
			'cardPhone': formData.cardPhone,
			// 'cardTemplateType': formData.cardTemplateType

		}
		
		utils.requestTeam(utils.teamApi + '/team/save/teamcard', 'POST', data, 'application/x-www-form-urlencoded')
			.then(res => {
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
