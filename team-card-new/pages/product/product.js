Page({

  /**
   * 页面的初始数据
   */
  data: {
    guannianData: [
      
    ], //商品数据
    page:1,
    totalPage:1,
    isProductData: false //就否有商品数据
  },
  //获取商品数据
  shopProduct() {
    var that = this;
   
    wx.request({
      url: 'https://ii.sinelinked.com/tg_web/api/cms/searchArtByCategoryId',
      data: {
        categoryId: 13,
        page: this.data.page
      },
      success:function(res){
        that.setData({
          totalPage: res.data.data.totalPage
        })

        var arr = that.data.guannianData
        var newArr =arr.concat(res.data.data.items)
        that.setData({
          guannianData: newArr
        })
      }
    })

  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.shopProduct()
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
    var num = this.data.page
    num++
    if (num > this.data.totalPage){
      return
    }
    this.setData({
      page: num
    })
    console.log(this.data.page)
    this.shopProduct()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})