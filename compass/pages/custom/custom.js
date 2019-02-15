// pages/custom/custom.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tempFilePaths:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 切换罗盘模式
  togglePanMode() {
    wx.getSystemInfo({
      success: function (result) {
        //选项集合
        let itemList;
        if (result.platform == 'android') {
          itemList = ['主盘', '地图盘', '实景盘', '图片盘', '取消']
        } else {
          itemList = ['主盘', '地图盘', '实景盘', '图片盘']
        }

        wx.showActionSheet({
          itemList: itemList,
          success(e) {
            var tabIndex = e.tapIndex
            var url = ''
            if (tabIndex == 0) {
              url = '/pages/index/index'
            } else if (tabIndex == 1) {
              url = '/pages/map/map'
            } else if (tabIndex == 2) {
              url = '/pages/live-action/live-action'
            } else if (tabIndex == 3) {
              url = '/pages/custom/custom'
            } else if (tabIndex == 4) {

            }
            wx.redirectTo({
              url: url
            })

          }
        })


      },
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  // 选择相片
  chooseImage(){
    var self = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        self.setData({
          tempFilePaths: res.tempFilePaths
        })
      }
    })
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