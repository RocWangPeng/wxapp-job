let utils = require('../../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
		content:'',
		memberId:'',
		spinShow:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	var carPersonalId = options.carPersonalId
	if(carPersonalId){
		this.setData({memberId:carPersonalId})
	}
	// 隐藏spin
	setTimeout(()=>{
		this.setData({spinShow:false})
	},600)
  },
  bindTextAreaBlur(e){
	  this.setData({content:e.detail.value})
  },
  membermsg(memberId){
	  if(!this.data.content){
		  wx.showToast({
			  title: '请填写发送内容',
			  icon: 'none',
			  duration: 2000
			})
		  return
	  }
	  var data = {
		  memberId:this.data.memberId,
		  content:this.data.content
		  
	  }
	  wx.showLoading({
		  title: '加载中',
		  mask:true
		})
	  utils.requestTeam(utils.teamApi + '/team/send/membermsg', 'POST', data ,'application/x-www-form-urlencoded')
		.then(res=>{
			wx.hideLoading()
			if(res.code == 0){
				wx.showToast({
				  title: '发送成功',
				  icon: 'none',
				  duration: 2000
				})
				this.setData({content:''})
			}else{
				wx.showToast({
				  title: res.error,
				  icon: 'none',
				  duration: 2000
				})
			}
			
		})
  },
  submit(){
	  this.membermsg()
  },
	
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
	
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})