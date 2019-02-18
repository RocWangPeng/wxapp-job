let utils = require('../../../../../utils/util.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		tempFilePaths: [],
		teamInfo: '',
		showDesc: '',
		cardShowPhotosUrls: '',
		totalFile2: [],
		imgUrl: [], //当前所有上传成功的图片地址
		isShow: 1, //是否展示
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		this.cardTeamInfo()
	},
	isShow() {
		var isShow = this.data.isShow == 1 ? '2' : 1
		this.setData({
				isShow: isShow
			}),
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
				
				wx.showLoading({
				  title: '加载中',
				  mask:true
				})

				var tempFilePathsPATH = {
					path: res.tempFilePaths
				}
				self.uploadimg(tempFilePathsPATH)
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
						teamInfo.cardForwardCoverUrl = teamInfo.cardForwardCoverUrl + "&"+Math.random()
					}
					
					var showImgs = []
					var NewshowImgs = []
					if (teamInfo.cardShowPhotosUrls) {
						showImgs = teamInfo.cardShowPhotosUrls.split('|')
						console.log(showImgs);
						if (showImgs.length == 1) {
							NewshowImgs.push(showImgs[0])
						} else {
							for (var i = 0; i < showImgs.length; i++) {
								NewshowImgs.push(showImgs[i])
							}
						}
					
					}
					
					if(teamInfo.cardShowDescribe == null){
						teamInfo.cardShowDescribe = ''
					}
					
					this.setData({
						teamInfo: teamInfo,
						tempFilePaths: NewshowImgs,
						imgUrl: NewshowImgs,
						isShow: teamInfo.cardShowDisplayStatus
					})
					
					this.setData({
						cardInfo: teamInfo,
					})
					
				}
			})
	},
	bindshowDesc(e) {
		this.setData({
			['teamInfo.describe']: e.detail.value,
		})
	},
	// 提交信息
	formSubmit(e) {
		var self = this
		var imgUrl = this.data.imgUrl
		console.log(imgUrl,imgUrl.length);
		var tempUrl = ''
		if (imgUrl.length > 0) {
// 			imgUrl.map(item => {
// 				console.log(item);
// 				tempUrl += item + '|'
// 			})
			
// 			for (let i = 0; i < imgUrl.length; i++) {
// 				tempUrl += imgUrl[i] + '|'
// 			}


			tempUrl = imgUrl.join('|')
				
		}
		var formData = {
			'coverUrl': '',
			'describe': this.data.teamInfo.describe || '',
			'photosUrls': tempUrl || '',
			'showStatus': this.data.isShow,
		}

		utils.requestTeam(utils.teamApi + '/team/save/teamshow', 'POST', formData, 'application/x-www-form-urlencoded')
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
	//多张图片上传
	uploadimg(data) {
		var that = this,
			i = data.i ? data.i : 0, //当前上传的哪张图片
			success = data.success ? data.success : 0, //上传成功的个数
			fail = data.fail ? data.fail : 0; //上传失败的个数
		wx.uploadFile({
			url: utils.teamApi + '/team/save/teamshowimg',
			header: {
				'cookie': "_auth=" + wx.getStorageSync('_auth_team'),
				"Content-Type": "multipart/form-data"
			},
			filePath: data.path[i],
			name: 'files', //这里根据自己的实际情况改
			formData: {
				flag: 3
			},
			success: (resp) => {
				success++; //图片上传成功，图片上传成功的变量+1
				console.log(resp)
				var respData = JSON.parse(resp.data)
				// 将每次上传的图片保存下来
				that.setData({
					imgUrl: that.data.imgUrl.concat(respData.data)
				})

			},
			fail: (res) => {
				fail++; //图片上传失败，图片上传失败的变量+1
				wx.hideLoading()
			},
			complete: () => {
				i++; //这个图片执行完上传后，开始上传下一张
				if (i == data.path.length) { //当图片传完时，停止调用          
					console.log('执行完毕');
					wx.hideLoading()
				} else { //若图片还没有传完，则继续调用函数
					data.i = i;
					data.success = success;
					data.fail = fail;
					that.uploadimg(data);
				}
			}
		});
	},
	// 长按删除
	deleteImg(e) {
		var imgUrl = e.currentTarget.dataset.imgurl
		var self = this
		wx.showModal({
			title: '删除图片',
			content: '是否删除此张相片',
			success(res) {
				if (res.confirm) {
					var data = {
						imgUrl: imgUrl,
						flag: 3
					}
					utils.requestTeam(utils.teamApi + '/team/deleteImg', 'POST', data, 'application/x-www-form-urlencoded')
						.then(res => {
							if (res.code == 0) {
								self.cardTeamInfo()
							} else {
								wx.showToast({
									title: res.error,
									icon: 'none',
									duration: 2000
								})
							}
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
