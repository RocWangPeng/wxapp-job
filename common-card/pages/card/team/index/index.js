var utils = require('../../../../utils/util.js')
let wechat = require('../../../../utils/wechat.js');
//获取应用实例
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		cardId:'',
		cardInfo: {}, //名片信息
		cityData: '', 
		headImg: '', 
		phone: '',
		cardForwardTitle:'',//转发标题
		cardForwardCoverUrl:'',//转发封面
		collectionData:{},
		cardOthersDetailsStatus:0,
		spinShow:true,
		isCollect:false,//是否已收藏
		unionId: '',
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		var self = this
		var scenes = decodeURIComponent(options.scene)
		var cardId = options.cardId || scenes.split('=')[1]
		if (cardId) {
			this.setData({
				cardId:cardId
			})
		}
	},
	// 判断名片是否已收藏
	isCollect(data){
		utils.request(utils.personApi + '/personal/card/holder/isCollect', 'GET', data)
			.then(res=>{
				if(res.code == 0){
					if(res.data.isCollect){
						this.setData({
							isCollect:true
						})
					}
				}
			})
	},
	//获取信息
	getInfo(cardId) {
		var self = this;
		var data = {
			cardId: cardId,
			type:1
		}
		utils.requestTeam(utils.teamApi + '/team/get/cardInfoByType', 'GET', data)
			.then((res) => {
				if (res.code == 0) {
					var cardInfo = res.data.info
					for (let val in cardInfo) {
						if (cardInfo[val] === null) {
							cardInfo[val] = ''
						}
					}
					var currentUnionId = wx.getStorageSync('currentUnionId')//当前微信用户的unionId
					var currentOpenId = wx.getStorageSync('currentOpenId') //当前微信用户的openId
					if(currentUnionId){
						// 有unionId
					}else{
						// 没有unionId
						currentUnionId = ''
					}
					var collectionData = {
						unionId: currentUnionId, //unionId
						openId: currentOpenId, //openId
						cardId:cardInfo.id,//名片id
						cardHeadUrl:cardInfo.cardHeadUrl,
						cardName:cardInfo.cardName,//名片姓名
						cardType:"2"//名片类型 ：1-个体  2-团队  3-商铺
					}
					var phone = self.formatPhone(cardInfo.cardPhone)
					self.setData({
						cardInfo: cardInfo,
						phone: phone,
						collectionData:collectionData
					})
					// 隐藏spin
					setTimeout(()=>{
						this.setData({spinShow:false})
					},150)
					
					self.isCollect({
						unionId: currentUnionId, //unionId
						openId: currentOpenId, //openId
						cardId:cardInfo.id,//名片id
						cardType:2
					})

					try {
						// 存储当前名片id
						wx.setStorageSync('activeCardId', cardInfo.id)
						// 存储当前名片头像
						if(cardInfo.cardHeadUrl){
							wx.setStorageSync('headImgTeam',cardInfo.cardHeadUrl + '&' + Math.random() )
						}else{
							wx.setStorageSync('headImgTeam','http://ii.sinelinked.com/miniProgramAssets/defaultHeadImg.jpg' )
						}
						// 存储当前名片转发相关信息
						if(cardInfo.cardForwardTitle){
							wx.setStorageSync('cardForwardTitleTeam', cardInfo.cardForwardTitle)
						}else{
							wx.setStorageSync('cardForwardTitleTeam', '')
						}
						if(cardInfo.cardForwardCoverUrl){
							wx.setStorageSync('cardForwardCoverUrlTeam', cardInfo.cardForwardCoverUrl)
						}else{
							wx.setStorageSync('cardForwardCoverUrlTeam', '')
						}
						const cardForwardTitle = wx.getStorageSync('cardForwardTitleTeam')
						const cardForwardCoverUrl = wx.getStorageSync('cardForwardCoverUrlTeam')

						if(cardForwardTitle){
							self.setData({
								cardForwardTitle: cardForwardTitle
							})
						}
						if(cardForwardCoverUrl){
							self.setData({
								cardForwardCoverUrl: cardForwardCoverUrl+'&'+Math.random()
							})
						}
						
					} catch (e) {
						console.log(e);
					}

				}
			})
	},
	// 全屏预览图片
	previewImages(e) {
		var self = this;
		wx.previewImage({
			current: self.data.cardInfo.headImg,
			urls: [self.data.cardInfo.headImg]
		})
	},
	//所属团队 
	getJoinedTeams(id) {

		var that = this
		wx.request({
			url: `https://ii.sinelinked.com/tg_web/api/user/XCX/getJoinedTeams`,
			data: {
				userId: id
			},
			success: function(res) {
				wx.hideNavigationBarLoading()
				if (res.data.code == 0) {
					that.setData({
						manyTeam: res.data.data
					})

					try {
						wx.setStorageSync('joinedTeams', res.data.data)
					} catch (e) {}


				}
			}
		})

	},
	// 播打电话
	makePhoneCall: function() {
		var that = this
		wx.makePhoneCall({
			phoneNumber: that.data.cardInfo.cardPhone
		})
	},
	toMsg: function() {
		utils.navigateTo({
			url: '/pages/card/team/msg/msg'
		})
	},
	// 格式化手机号码
	formatPhone: function(phone) {
		var phone = String(phone)
		if (phone) {
			return phone.slice(0, 3) + '-' + phone.slice(3, 7) + '-' + phone.slice(7, 11)
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
	onShow: function(options) {
		
		var cardId = this.data.cardId
		if (cardId) {
			if(JSON.stringify(this.data.cardInfo) == "{}"){
				this.getInfo(cardId)
			}
		}
		wx.setStorageSync('userType', 'team')
	},
	onError: function(msg) {
		console.log(msg)
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
		return {
			title: this.data.cardForwardTitle || '',
			path: '/pages/card/team/index/index?cardId=' + this.data.cardInfo.id,
			imageUrl: this.data.cardForwardCoverUrl
		}
	}
})
