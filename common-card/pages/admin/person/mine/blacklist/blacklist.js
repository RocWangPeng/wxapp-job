let utils = require('../../../../../utils/util.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		blaskList: [], //名单列表
		hasMsg: false,
		cardId: '',
		whiteObj: {},
		toggle:false,
		blackCardName: '',
		blackCardPhone:'',
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
		var targetCardId = options.targetCardId
		if (targetCardId) {
			this.getInfo(targetCardId)
		}

	},
	// 查询个人白名单列表
  getBlaskList(){
	utils.request(utils.personApi + '/personal/get/black/list', 'GET')
		.then(res=>{
			if(res.code == 0){
				var blaskList = res.data.blackList.items
				if(blaskList.length == 0){
					this.setData({
						hasMsg:true
					})
				}else{
					this.setData({
						hasMsg:false
					})
				}
				this.setData({
					blaskList:res.data.blackList.items
				})
			}
		})
  },
	// 跳转名片夹
	addFromCardCase() {
		utils.navigateTo({
			url: '/pages/admin/person/mine/cardcase/cardcase?type=black'
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
		utils.request(utils.personApi + '/personal/add/black/info', 'POST', data)
			.then(res => {
				if (res.code == 0) {
					this.getBlaskList(this.data.cardId)
				}
			})
	},
	// 获取名片信息
	getInfo(cardId) {
		var data = {
			id: cardId,
		}
		utils.request(utils.personApi + '/personal/get/cardInfo', 'GET', data)
			.then(res => {
				if (res.code == 0) {
					var whiteObj = {
						blackCardName: res.data.cardInfo.cardName,
						blackCardPhone: res.data.cardInfo.cardPhone,
						origin: 1,
						type: 2
					}
					this.addWhiteList(whiteObj)
				}
			})
	},
		// 监听手动添加输入框
	addremarNamekHandle(e) {
		var value = e.detail.value
		this.setData({
			blackCardName: value
		})
	},
	// 监听手动添加输入框
	addremarkHandle(e) {
		var value = e.detail.value
		this.setData({
			blackCardPhone: value
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
			blackCardName: this.data.blackCardName,
			blackCardPhone: this.data.blackCardPhone,
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
		utils.request(utils.personApi + '/personal/delete/black/info', 'POST', data,'application/x-www-form-urlencoded')
			.then(res=>{
				if(res.code == 0){
					this.setData({
						toggle: true
					})
					this.getBlaskList(this.data.cardId)
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
		this.getBlaskList()
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
