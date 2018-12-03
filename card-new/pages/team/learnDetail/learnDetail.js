// pages/learnDetail/learnDetail.js

var WxParse = require('../../../wxParse/wxParse.js');



Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    title:'',
    detailData:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })

    this.getDetail()

  },
  //获取商品数据
  getDetail() {
    var that = this;

    wx.showLoading({ title: '努力加载中...' })

    wx.request({
      url: 'https://ii.sinelinked.com/tg_web/api/cms/searchArtById',
      data: {
        id: this.data.id,
      },
      success: function (res) {
        WxParse.wxParse('article', 'html', res.data.data.content, that, 5);

        that.setData({
          title: res.data.data.title
        })

        wx.hideLoading()

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