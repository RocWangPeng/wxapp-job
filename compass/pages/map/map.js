Page({
	data: {
		x: 0, //水平仪x方向
		y: 0,
		enabled: true,
		direction: 0, //罗盘旋转角度
		showPan: true,
		weatherShow: false,
		location:{},
		scale:18,
		latitude: 23.099994,
		longitude: 113.324520,
		test:0,
    enable3D: true
	},
	onLoad(){
		wx.getSetting({
		  success(res) {
			// res.authSetting = {
			//   "scope.userInfo": true,
			//   "scope.userLocation": true
			// }
		  }
		})
	},
	onReady() {
		this.getLocation()
		var self = this;
		var obj = wx.createSelectorQuery();
		var gradienter = obj.select('.gradienter')
		var gradienterWidth = 0
		var gradienterHeight = 0
		var gradienterLeft = 0
		var gradienterTop = 0
		gradienter.boundingClientRect(function(rect) {
			gradienterWidth = rect.width
			gradienterHeight = rect.height
			gradienterLeft = rect.left
			gradienterTop = rect.top

			var positionX = gradienterWidth / 2
			var positionY = gradienterHeight / 2
			// 水平仪监听
			wx.onAccelerometerChange(function(res) {
				if (res.x > 0) {
					positionX += 6
				} else {
					positionX -= 6
				}

				if (res.y < 0) {
					positionY += 6
				} else {
					positionY -= 6
				}
				if (positionX < 0) {
					positionX = 0
				} else if (positionX > (gradienterWidth - 12)) {
					positionX = gradienterWidth - 12
				}

				if (positionY < 0) {
					positionY = 0
				} else if (positionY > (gradienterHeight - 12)) {
					positionY = gradienterHeight - 12
				}

				self.setData({
					x: positionX,
					y: positionY,
				})
			})
		}).exec()

		// 罗盘监听
		wx.onCompassChange(function(res) {
			self.setData({
				direction: parseInt(res.direction, 10)
			})
		})

	},
	
  // 切换罗盘模式
  togglePanMode() {
    wx.getSystemInfo({
      success: function (result) {
        console.log(result.platform)
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

	// 罗盘展开隐藏
	togglePan() {
		this.setData({
			showPan: !this.data.showPan
		})
	},
	// 跳转天气界面
	toWeather() {
		this.setData({
			weatherShow: !this.data.weatherShow
		})

		setTimeout(() => {
			this.setData({
				weatherShow: !this.data.weatherShow
			})
		}, 6000)
	},

	// 提示
	tips() {
		if (this.data.showPan) {
			wx.showToast({
				title: '操作地图,先点击下方收起罗盘',
				icon: 'none'
			})
		}
	},
	getLocation() {
		const that = this
		wx.getLocation({
			success(res) {
				that.setData({
					hasLocation: true,
					longitude: res.longitude,
					latitude: res.latitude,
					scale:14,
					location: that.formatLocation(res.longitude, res.latitude)
				})
			},
			fail(err) {
				console.log('err',err);
			}
		})
	},
	formatLocation(longitude, latitude) {
		if (typeof longitude === 'string' && typeof latitude === 'string') {
			longitude = parseFloat(longitude)
			latitude = parseFloat(latitude)
		}

		longitude = longitude.toFixed(2)
		latitude = latitude.toFixed(2)

		return {
			longitude: longitude.toString().split('.'),
			latitude: latitude.toString().split('.')
		}
	}


})
