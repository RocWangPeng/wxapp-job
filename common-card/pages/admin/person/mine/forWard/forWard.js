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
		isShow: 1, //是否展示
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		var cardId = options.cardId
		if (cardId) {
			this.setData({
				cardId: cardId,
			})
			this.cardByInfoType(cardId)
		}
	},
	isShow() {
		var isShow = this.data.isShow == 1 ? '2' : 1
		this.setData({
			isShow: isShow
		})
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

			}
		})
	},
	bindshowDesc(e) {
		this.setData({
			cardForwardTitle: e.detail.value,
		})
	},
	// 获取名片信息
	cardByInfoType(cardId) {
		var data = {
			id: cardId,
			infoType: 5
		}
		utils.request(utils.personApi + '/personal/get/cardByInfoType', 'GET', data)
			.then(res => {
				if (res.code == 0) {
					this.setData({
						cardInfo: res.data.info,
						cardForwardTitle: res.data.info.cardForwardTitle,
						tempFilePaths: res.data.info.cardForwardCoverUrl
					})

				}
			})
	},
	cancleForWard(){
		var self = this
		var data = {
			'id': this.data.cardId,
			'cardForwardTitle': '',
			'cardForwardCoverUrl': ''
		}
		utils.request(utils.personApi + '/personal/update/card/forward', 'POST', data, 'application/x-www-form-urlencoded')
			.then(res => {
				wx.hideLoading()
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
		var data = {
			'id': this.data.cardId,
			'cardForwardTitle': this.data.cardForwardTitle || '',
			'cardForwardCoverUrl': this.data.cardInfo.cardForwardCoverUrl
		}

		if (!this.data.cardForwardTitle && !this.data.isChooseImg) {
			wx.showToast({
				title: '请输入标题或者选择封面图片',
				icon: 'none',
				duration: 2000
			})
			return
		}
		
		wx.showLoading({
		  title: '加载中',
		  mask:true
		})

		if (this.data.isChooseImg) {
			wx.uploadFile({
				url: utils.personApi + '/personal/update/card/forward',
				header: {
					'cookie': "_auth=" + wx.getStorageSync('_auth'),
					"Content-Type": "multipart/form-data"
				},
				filePath: self.data.tempFilePaths[0],
				name: 'cardForwardFile',
				formData: data,
				success(res) {
					wx.hideLoading()
					var res = JSON.parse(res.data)
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
				}
			})
		} else {

			utils.request(utils.personApi + '/personal/update/card/forward', 'POST', data, 'application/x-www-form-urlencoded')
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
		}
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
