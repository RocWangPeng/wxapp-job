let utils = require('../../../../../utils/util.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		tempFilePaths: [],
		cardId: '', //名片id
		showDesc: '',
		cardHeadUrl: '',
		cardShowPhotosUrls: '',
		totalFile2: [],
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
		const cardHeadUrl = wx.getStorageSync('cardHeadUrl')
		if (cardHeadUrl) {
			this.setData({
				cardHeadUrl: cardHeadUrl,
			})
		}

	},
	isShow() {
		var isShow = this.data.isShow == 1 ? '2' : 1
		this.setData({
			isShow: isShow
		})
		this.formSubmit()
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
				var totalFile = self.data.tempFilePaths.concat(res.tempFilePaths)
				if (totalFile.length > 9 || self.data.tempFilePaths.length > 9) {
					wx.showToast({
						title: '最多上传9张',
						icon: 'none',
						duration: 2000
					})
					return
				}
				self.setData({
					tempFilePaths: totalFile,
				})

				var tempFilePathsPATH = {
					path: self.data.tempFilePaths
				}

				const tempFilePaths2 = res.tempFilePaths
				var totalFile2 = self.data.totalFile2.concat(res.tempFilePaths)
				self.setData({
					totalFile2: totalFile2,
				})
				// self.uploadimg(tempFilePathsPATH)
			}
		})
	},
	// 获取名片信息
	cardByInfoType(cardId) {
		var data = {
			id: cardId,
			infoType: 3
		}
		utils.request(utils.personApi + '/personal/get/cardByInfoType', 'GET', data)
			.then(res => {
				if (res.code == 0) {
					var tempShowArr = []
					var cardShowPhotosUrls = res.data.info.cardShowPhotosUrls
					if (cardShowPhotosUrls) {
						cardShowPhotosUrls = res.data.info.cardShowPhotosUrls.split('|')
						for (var i = 0; i < cardShowPhotosUrls.length; i++) {
							if(cardShowPhotosUrls[i]){
								tempShowArr.push(cardShowPhotosUrls[i]+'&'+Math.random())
							}
						}
					}
					
					this.setData({
						showDesc: res.data.info.cardShowDescribe,
						tempFilePaths: tempShowArr,
						cardShowPhotosUrls: res.data.info.cardShowPhotosUrls
					})
					if(res.data.info.cardShowDisplayStatus){
						this.setData({
							isShow: res.data.info.cardShowDisplayStatus,
						})
					}
				}
			})
	},
	bindshowDesc(e) {
		this.setData({
			showDesc: e.detail.value,
		})
	},
	// 提交信息
	formSubmit(e) {
		var self = this
		var formData = {
			'id': this.data.cardId,
			'cardShowDescribe': this.data.showDesc || '',
			'cardShowDisplayStatus':this.data.isShow,
			'cardShowPhotosUrls': this.data.cardShowPhotosUrls || '',
			'cardShowCoverUrl': ''
		}
		var tempFilePathsPATH = {
			path: self.data.totalFile2
		}

		if (self.data.totalFile2.length > 0) {
			self.uploadimg(tempFilePathsPATH)
		} else {
			wx.showLoading({
			  title: '加载中',
			  mask:true
			})
			utils.request(utils.personApi + '/personal/update/card/show', 'POST', formData,
					'application/x-www-form-urlencoded')
				.then(res => {
					wx.hideLoading()
					if (res.code == 0) {
						wx.showToast({
							title: '资料提交成功',
							icon: 'none',
							duration: 2000
						})
						self.cardByInfoType(self.data.cardId)
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
	//多张图片上传
	uploadimg(data) {
		var formData = {
			'id': this.data.cardId,
			'cardShowDescribe': this.data.showDesc || '',
			'cardShowDisplayStatus': 1,
			'cardShowCoverUrl': ''
		}
		
		wx.showLoading({
		  title: '加载中',
		  mask:true
		})

		var that = this,
			i = data.i ? data.i : 0, //当前上传的哪张图片
			success = data.success ? data.success : 0, //上传成功的个数
			fail = data.fail ? data.fail : 0; //上传失败的个数
		wx.uploadFile({
			url: utils.personApi + '/personal/update/card/show',
			header: {
				'cookie': "_auth=" + wx.getStorageSync('_auth'),
				"Content-Type": "multipart/form-data"
			},
			filePath: data.path[i],
			name: 'selfShowImage', //这里根据自己的实际情况改
			formData: formData, //这里是上传图片时一起上传的数据
			success: (resp) => {
				success++; //图片上传成功，图片上传成功的变量+1
				console.log(resp)
				console.log(i);
				//这里可能有BUG，失败也会执行这里,所以这里应该是后台返回过来的状态码为成功时，这里的success才+1
			},
			fail: (res) => {
				fail++; //图片上传失败，图片上传失败的变量+1
			},
			complete: () => {
				console.log(i);
				i++; //这个图片执行完上传后，开始上传下一张
				if (i == data.path.length) { //当图片传完时，停止调用    
					  wx.hideLoading()
					wx.showToast({
						title: '资料提交成功',
						icon: 'none',
						duration: 2000
					})
					that.setData({
						totalFile2:[]
					})
					that.cardByInfoType(that.data.cardId)
					
				} else { //若图片还没有传完，则继续调用函数
					console.log(i);
					data.i = i;
					data.success = success;
					data.fail = fail;
					that.uploadimg(data);
				}
			}
		});
	},
	// 长按删除
	deleteImg(e){
		var index = e.currentTarget.dataset.index
		this.setData({
			totalFile2:[]
		})
		var self = this
		wx.showModal({
		  title: '删除图片',
		  content: '是否删除此张相片',
		  success(res) {
			if (res.confirm) {
				var data = {
					id: self.data.cardId,
					index:index
				}
				utils.request(utils.personApi + '/personal/delete/card/show', 'POST', data,'application/x-www-form-urlencoded')
					.then(res=>{
						self.cardByInfoType(self.data.cardId)
					})
			} else if (res.cancel) {
			  console.log('用户点击取消')
			}
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
