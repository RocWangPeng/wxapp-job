// pages/agent/product/product.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
    productData: [
      {
        "product_id": null,
        "inssure_img_url": "http://www.sinelinked.com/static/insurance/logo/d1b16eeb-6686-4a74-9897-0614643e6ac9.jpg",
        "product_type": "财险",
        "product_name": "美亚财险",
        "product_img_url": "http://www.sinelinked.com/static/product/983fc8ad-ed1b-40d9-ac41-f150e0f6c903/image/1.jpg",
        "product_simple_desc": null,
        "rebate": 0,
        "product_price": null,
        "order": null,
        "product_detail_url": "https://www.aig.com.cn/home",
        "buy_url": null,
        "company_full_name": "美亚财产保险有限公司",
        "inssure_index_url": null,
        "product_buy_type": null
      },
      {
        "product_id": null,
        "inssure_img_url": "http://www.sinelinked.com/static/insurance/logo/ha.png",
        "product_type": "财险",
        "product_name": "华安满堂福家庭财产保险",
        "product_img_url": "http://www.sinelinked.com/static/product/cb32d742-6172-4ee4-a05b-faaca6d62f33/image/1.jpg",
        "product_simple_desc": null,
        "rebate": 0,
        "product_price": null,
        "order": null,
        "product_detail_url": "https://mall.sinosafe.com.cn/jjbb/20151015/52315.html",
        "buy_url": null,
        "company_full_name": "华安财产保险股份有限公司",
        "inssure_index_url": null,
        "product_buy_type": null
      },
      {
        "product_id": null,
        "inssure_img_url": "http://www.sinelinked.com/static/insurance/logo/ha.png",
        "product_type": "财险",
        "product_name": "华安一路平安",
        "product_img_url": "http://www.sinelinked.com/static/product/375492cd-b40b-49bd-844f-e17cb99748d2/image/1.jpg",
        "product_simple_desc": null,
        "rebate": 0,
        "product_price": null,
        "order": null,
        "product_detail_url": "https://mall.sinosafe.com.cn/lycx/20151016/52376.html",
        "buy_url": null,
        "company_full_name": "华安财产保险股份有限公司",
        "inssure_index_url": null,
        "product_buy_type": null
      }
    ], //商品数据
    isProductData: false //就否有商品数据
	},
	//获取商品数据
	shopProduct() {


	},
  //小程序查询或新增用户栏目配置
  xcxSearchOrAddUserColConf(id) {
    var userId = wx.getStorageSync('agentId');
    var that = this
    wx.request({
      url: `https://ii.sinelinked.com/tg_web/api/XCX/user/xcxSearchOrAddUserColConf`,
      method:'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: {
        userId: userId
      },
      success: function (res) {
        console.log(res)
        if(res.data.code == 0){
          if (res.data.data.productShowType != 4){
            that.setData({
              isProductData : true
            })
          }
        }
      }
    })

  },
	//复制文本到剪贴板
	copyProductUrl(e) {
		console.log(e)
		wx.setClipboardData({
			data: e.currentTarget.dataset.url,
			success: function (res) {
				wx.getClipboardData({
					success: function (res) {
						wx.showToast({
							icon:'none',
							title: '产品链接复制成功,请打开手机浏览器粘贴访问'
						})
					}
				})
			}
		})
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.shopProduct()
    this.xcxSearchOrAddUserColConf()
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
