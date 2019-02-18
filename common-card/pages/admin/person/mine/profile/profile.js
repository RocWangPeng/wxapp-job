let utils = require('../../../../../utils/util.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		tempFilePaths: '',
		isChooseImg: false,
		cardId: '', //名片id
		imgHeadFile: [], //头像文件
		name: '',
		cardInfo: {}, //名片信息
		phone: ''
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		console.log('onload');
		var cardId = options.cardId
		console.log(cardId);
		if (cardId) {
			this.setData({
				cardId: cardId,
			})
			this.cardByInfoType(cardId)
		}
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
				const tempFilePaths = res.tempFilePaths
				console.log(res.tempFilePaths);
				self.setData({
					tempFilePaths: res.tempFilePaths[0],
					isChooseImg: true,
				})
			}
		})
	},
	// 获取名片信息
	cardByInfoType(cardId) {
		console.log('cardByInfoType');
		var data = {
			id: cardId,
			infoType: 1
		}

		utils.request(utils.personApi + '/personal/get/cardByInfoType', 'GET', data)
			.then(res => {
				if (res.code == 0) {
					var cardInfo = res.data.info
					if (cardInfo.cardHeadUrl && cardInfo.cardHeadUrl !=
						'http://ii.sinelinked.com/miniProgramAssets/defaultHeadImg.jpg') {
						var cardHeadUrl = 'cardInfo.cardHeadUrl'
						this.setData({
							cardInfo: cardInfo,
							phone: cardInfo.cardPhone,
							[cardHeadUrl]: cardInfo.cardHeadUrl + '&' + Math.random(),
							tempFilePaths: cardInfo.cardHeadUrl + '&' + Math.random(),
						})
					} else {
						var cardHeadUrl = 'cardInfo.cardHeadUrl'
						this.setData({
							cardInfo: cardInfo,
							phone: cardInfo.cardPhone,
							[cardHeadUrl]: 'http://ii.sinelinked.com/miniProgramAssets/defaultHeadImg.jpg',
							tempFilePaths: 'http://ii.sinelinked.com/miniProgramAssets/defaultHeadImg.jpg',
						})
					}

				}
			})
	},
	// 预览模板图片
	previewImageTpl(e){
		var currentImage = e.target.dataset.image
		wx.previewImage({
		  current: currentImage, // 当前显示图片的http链接
		  urls: [currentImage] // 需要预览的图片http链接列表
		})
	},
	//修改信息
	formSubmit(e) {
		var formData = e.detail.value
		var self = this
		var data = {
			'id': this.data.cardInfo.id,
			'cardName': formData.cardName,
			'cardPhone': formData.cardPhone,
			'cardRemark': formData.cardRemark,
			'cardDuty': formData.cardDuty || '社会精英',
			'cardUrl': formData.cardUrl,
			'cardEmail': formData.cardEmail,
			'cardAddress': formData.cardAddress,
			'cardCompany': formData.cardCompany,
			'cardHeadUrl': this.data.cardInfo.cardHeadUrl || ''
			// 'cardTemplateType': formData.cardTemplateType

		}
		wx.showLoading({
			title: '加载中',
			mask: true
		})
		if (this.data.isChooseImg) {
			wx.uploadFile({
				url: utils.personApi + '/personal/update/card/info',
				header: {
					'cookie': "_auth=" + wx.getStorageSync('_auth'),
					"Content-Type": "multipart/form-data"
				},
				filePath: self.data.tempFilePaths,
				name: 'imgHeadFile',
				formData: data,
				success(res) {
					var res = JSON.parse(res.data)
					if (res.code == 0) {
						// self.cardByInfoType(self.data.cardId)
						wx.showToast({
							title: '资料提交成功',
							icon: 'none',
							duration: 2000
						})
						self.setData({
							isChooseImg: false,
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

			utils.request(utils.personApi + '/personal/update/card/info', 'POST', data, 'application/x-www-form-urlencoded')
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
