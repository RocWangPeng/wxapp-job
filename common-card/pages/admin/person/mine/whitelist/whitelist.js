let utils = require('../../../../../utils/util.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		whiteList: [], //名单列表
		hasMsg: false,
		cardId: '',
		targetCardId:'',
		whiteObj: {},
		toggle:false,
		whiteCardPhone: '',
		visibleRemarks: false, //手动添加modal
		actions: [
            {
                name: '删除',
                color: '#fff',
				width : 100,
                background : '#ed3f14'
            }
        ],
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		var cardId = options.cardId
		var infoType = options.infoType
		var targetCardId = options.targetCardId
		if (targetCardId) {
			this.setData({
				targetCardId:targetCardId,
				cardId: cardId,
			})
			this.getInfo(targetCardId,infoType)

		} else if (cardId) {
			this.setData({
				cardId: cardId,
			})
			// this.getWhiteList(cardId)
		}


	},
	// 查询个人白名单列表
	getWhiteList(cardId) {
		var data = {
			cardId : cardId
		}
		utils.request(utils.personApi + '/personal/get/white/list', 'GET', data)
			.then(res => {
				if (res.code == 0) {
					var whiteList = res.data.whistList.items
					if (whiteList.length == 1) {
						this.setData({
							hasMsg: true
						})
					}else{
						this.setData({
							hasMsg:false
						})
					}

					this.setData({
						whiteList: whiteList
					})
				}
			})
	},
	// 跳转名片夹
	addFromCardCase() {
		wx.navigateTo({
			url: '/pages/admin/person/mine/cardcase/cardcase?type=white'
		})
	},
	addFromManual() {
		this.setData({
			visibleRemarks: true
		})
	},
	// 添加到白名单
	addWhiteList(obj) {
		var data = obj
		utils.request(utils.personApi + '/personal/add/white/info', 'POST', data)
			.then(res => {
				if (res.code == 0) {
					this.getWhiteList(this.data.cardId)
				}
			})
	},
	// 获取名片信息
	getInfo(cardId,infoType) {
		var data = {
			id: cardId,
		}
		var url = ''
		if(infoType == 1){
			url = utils.personApi + '/personal/get/cardInfo'
		}else if(infoType == 2){
			url = utils.teamApi + '/team/get/cardInfo'
		}
		utils.request(url, 'GET', data)
			.then(res => {
				if (res.code == 0) {
					var whiteObj = {
						cardId:this.data.cardId,
						whiteCardName: res.data.cardInfo.cardName,
						whiteCardPhone: res.data.cardInfo.cardPhone,
						origin: 1,
						type: 2
					}
					// this.addWhiteList(whiteObj)
				}
			})
	},
	// 监听手动添加输入框
	addremarNamekHandle(e) {
		var value = e.detail.value
		this.setData({
			whiteCardName: value
		})
	},
	// 监听手动添加输入框
	addremarkHandle(e) {
		var value = e.detail.value
		this.setData({
			whiteCardPhone: value
		})
	},
	// 手动添加框取消
	remarkBtnCancel() {
		this.setData({
			visibleRemarks: false
		})
	},
	// 手动添加框确认
	remarkBtnEnter() {
		var whiteObj = {
			cardId:this.data.cardId,
			whiteCardName: this.data.whiteCardName,
			whiteCardPhone: this.data.whiteCardPhone,
			origin: 2,
			type: 2
		}
		this.addWhiteList(whiteObj)
		this.setData({
			visibleRemarks: false
		})
	},
	// 删除个人名片白名单信息
	deleteWhiteList(e){
		this.setData({
			toggle: false
		})
		var id = e.target.dataset.id
		var data = {
			id:id
		}
		utils.request(utils.personApi + '/personal/delete/white/info', 'POST', data,'application/x-www-form-urlencoded')
			.then(res=>{
				if(res.code == 0){
					this.setData({
						toggle: true
					})
					this.getWhiteList(this.data.cardId)
				}else{
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
	onShow: function(options) {
		if(this.data.cardId){
			this.getWhiteList(this.data.cardId)
		}
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
