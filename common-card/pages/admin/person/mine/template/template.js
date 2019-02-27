let utils = require('../../../../../utils/util.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		cardId: '',
		cardTemplateType: 1,
		defaultSrc: 'http://ii.sinelinked.com/miniProgramAssets/bg2.png',
		tpl_data: [{
				choose: false,
				icon: 'http://ii.sinelinked.com/miniProgramAssets/choose.png',
				src: 'http://ii.sinelinked.com/miniProgramAssets/tpl_01.jpg',
				defaultSrc: 'http://ii.sinelinked.com/miniProgramAssets/bg1.png',
				cardTemplateType: 1
			},
			{
				choose: false,
				icon: 'http://ii.sinelinked.com/miniProgramAssets/choose.png',
				src: 'http://ii.sinelinked.com/miniProgramAssets/tpl_02.jpg',
				defaultSrc: 'http://ii.sinelinked.com/miniProgramAssets/bg2.png',
				cardTemplateType: 2
			},
			{
				choose: false,
				icon: 'http://ii.sinelinked.com/miniProgramAssets/choose.png',
				src: 'http://ii.sinelinked.com/miniProgramAssets/tpl_03.jpg',
				defaultSrc: 'http://ii.sinelinked.com/miniProgramAssets/bg3.png',
				cardTemplateType: 3
			}
		],
		src: 'http://ii.sinelinked.com/miniProgramAssets/chunjie-bg.jpg',
		width: 300, //宽度
		height: 404, //高度
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
		
		 this.cropper = this.selectComponent("#image-cropper");
//             this.setData({
//                 src:"http://ii.sinelinked.com/miniProgramAssets/chunjie-bg.jpg",
//             });
            wx.showLoading({
                title: '加载中'
            })
			
	},
	// 获取名片信息
	cardByInfoType(cardId) {
		var data = {
			id: cardId,
			infoType: 7
		}
		utils.request(utils.personApi + '/personal/get/cardByInfoType', 'GET', data)
			.then(res => {
				if (res.code == 0) {
					var cardTemplateType = parseInt(res.data.info.cardTemplateType)
					var tpl_data = this.data.tpl_data
					var tpl_data_tmp = tpl_data.map(item => {
						item.choose = false
						item.icon = 'http://ii.sinelinked.com/miniProgramAssets/choose.png'
						if (item.cardTemplateType == cardTemplateType) {
							item.choose = true
							item.icon = 'http://ii.sinelinked.com/miniProgramAssets/choose_fill.png'
						}
						return item
					})
					this.setData({
						defaultSrc: tpl_data[cardTemplateType - 1].defaultSrc,
						cardTemplateType,
						tpl_data: tpl_data_tmp
					})
				}
			})
	},
	/* 选择模板 */
	chooseTplHandle(e) {
		var cardTemplateType = e.currentTarget.dataset.cardtemplatetype
		var data = {
			id: this.data.cardId,
			cardTemplateType,
			cardTemplateBackUrl: ''
		}
		utils.request(utils.personApi + '/personal/update/card/template', 'POST', data, 'application/x-www-form-urlencoded')
			.then(res => {
				if (res.code == 0) {
					this.cardByInfoType(this.data.cardId)
				}
			})
	},
	cropperload(e){
		console.log("cropper初始化完成");
	},
	loadimage(e){
		console.log("图片加载完成",e.detail);
		wx.hideLoading();
		//重置图片角度、缩放、位置
		this.cropper.imgReset();
	},
	clickcut(e) {
		console.log(e.detail);
		//点击裁剪框阅览图片
		wx.previewImage({
			current: e.detail.url, // 当前显示图片的http链接
			urls: [e.detail.url] // 需要预览的图片http链接列表
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
