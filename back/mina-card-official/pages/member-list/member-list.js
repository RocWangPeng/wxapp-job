// pages/member-list/member-list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  memList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let pageInstance = getCurrentPages()
    	var that = this
			
			this.setData({
				teamId: options.teamId
			})
			
    	wx.request({
    		url: 'https://ii.sinelinked.com/tg_web/api/user/XCX/getTeamAgent',
    		data: {
    			teamId: this.data.teamId
    		},
    		success: function (res) {
    			if (res.data.code == 0) {
    				that.setData({
    					memList: res.data.data.memList
    				})
    			}
    		}
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