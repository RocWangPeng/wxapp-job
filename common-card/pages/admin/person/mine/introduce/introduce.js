let utils = require('../../../../../utils/util.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		tempFilePaths: [],
		totalFile2: [],//当前选择
		cardCompanyProfilePhotosUrlOld:'',
		introduce: '',
		cardId: '', //名片id
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
		this.formSubmit()
	},
	// 获取名片信息
	cardByInfoType(cardId) {
		var data = {
			id: cardId,
			infoType: 2
		}
		utils.request(utils.personApi + '/personal/get/cardByInfoType', 'GET', data)
			.then(res => {
				if (res.code == 0) {
					var tempShowArr = []
					var cardCompanyProfilePhotosUrl = res.data.info.cardPersonalProfilePhotosUrl
					var cardCompanyProfilePhotosUrlOld = res.data.info.cardPersonalProfilePhotosUrl
					if (cardCompanyProfilePhotosUrl) {
						cardCompanyProfilePhotosUrl = cardCompanyProfilePhotosUrl.split('|')
						for (var i = 0; i < cardCompanyProfilePhotosUrl.length; i++) {
							if(cardCompanyProfilePhotosUrl[i]){
								tempShowArr.push(cardCompanyProfilePhotosUrl[i]+'&'+Math.random())
							}
						}
					}
					
					this.setData({
						introduce: res.data.info.cardPersonalProfile == 'null' ? ' ' : res.data.info.cardPersonalProfile,
						tempFilePaths: tempShowArr,
						cardCompanyProfilePhotosUrl:cardCompanyProfilePhotosUrlOld
					})
					if(res.data.info.cardProfileDisplayStatus){
						this.setData({
							isShow: res.data.info.cardProfileDisplayStatus,
						})
					}
				}
			})
	},
	bindshowDesc(e) {
		this.setData({
			introduce: e.detail.value,
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
				var totalFile = self.data.tempFilePaths.concat(res.tempFilePaths)
				
				self.setData({
					tempFilePaths: totalFile,
				})
	
	
				const tempFilePaths2 = res.tempFilePaths
				var totalFile2 = self.data.totalFile2.concat(res.tempFilePaths)
				self.setData({
					totalFile2: totalFile2,
				})
			}
		})
	},
	// 提交信息
	formSubmit(e) {
		var self = this
		var data = {
			id: this.data.cardId,
			cardPersonalProfile: this.data.introduce,
			cardProfileDisplayStatus: this.data.isShow,
			cardPersonalProfilePhotosUrl:this.data.cardCompanyProfilePhotosUrl
		}
		
		var tempFilePathsPATH = {
			path: self.data.totalFile2
		}
		
		if(self.data.totalFile2.length > 0){
			self.uploadimg(tempFilePathsPATH)
			return
		}
		
		wx.showLoading({
		  title: '加载中',
		  mask:true
		})

		utils.request(utils.personApi + '/personal/update/card/profile', 'POST', data, 'application/x-www-form-urlencoded')
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
		//多张图片上传
	uploadimg(data) {
		
		var formData = {
			id: this.data.cardId,
			cardPersonalProfile: this.data.introduce,
			cardProfileDisplayStatus: this.data.isShow,
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
			url: utils.personApi + '/personal/update/card/profile',
			header: {
				'cookie': "_auth=" + wx.getStorageSync('_auth'),
				"Content-Type": "multipart/form-data"
			},
			filePath: data.path[i],
			name: 'personalProfileImage', //这里根据自己的实际情况改
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
// 					that.setData({
// 						totalFile2:[]
// 					})
					// that.cardByInfoType(that.data.cardId)
					
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
				utils.request(utils.personApi + '/personal/delete/card/personalProfileImg', 'POST', data,'application/x-www-form-urlencoded')
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
})
