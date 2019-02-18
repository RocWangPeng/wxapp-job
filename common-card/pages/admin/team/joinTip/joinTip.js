let utils = require('../../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
	joinList:[],//申请列表
	hasMsg:false,
	spinShow:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	 // 获取申请列表
	this.teamlist(1).then(res=>{
		this.setData({
			joinList:res
		})
	})
  },
  	// 获取团队成员信息
  teamlist(status = 2) {
  	var data = {
  		status: status
  	}
  	return new Promise((resolve, reject) => {
  		utils.requestTeam(utils.teamApi + '/team/find/teamlist', 'GET', data)
  			.then(res => {
  				if (res.code == 0) {
  					var teamMemberList = res.data.teamMemberList
					if(teamMemberList.length == 0){
						this.setData({hasMsg:true})
					}
  					resolve(teamMemberList)
  				}
  			})
  	})
  },
  // 审核
  teamapply(e){
	  var status = e.currentTarget.dataset.status
	  var carPersonalId = e.currentTarget.dataset.carpersonalid
	  var data = {
		  carPersonalId:carPersonalId,
		  status:status
		  
	  }
	  utils.requestTeam(utils.teamApi + '/team/review/teamapply', 'POST', data,'application/x-www-form-urlencoded')
	  	.then(res => {
	  		if (res.code != 0) {
				wx.showToast({ title: res.error,  icon: 'none',  duration: 1000})
	  		}
			this.teamlist(1).then(res=>{
				this.setData({
					joinList:res
				})
			})
	  	})
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