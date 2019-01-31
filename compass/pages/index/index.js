Page({
	data: {
		x: 0, //水平仪x方向
		y: 0,
		enabled: true,
		direction: 0, //罗盘旋转角度
		directionSouth:0,
		weatherShow:false,//显示天气
		manualOnoff:false,//手动切换
		lockOnoff:false,//锁定开关
		touchstartX:0,//开始拖动坐标
		touchstartY:0,//开始拖动坐标
		text:''
	},
	onLoad(){
		this.setData({
			direction: parseInt(180, 10)
		})
	},
	onReady() {
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
				console.log(res.x)
  console.log(res.y)
  console.log(res.z)
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
			console.log(res);
			var directions = res.direction.toFixed(2);
			self.setData({
				direction: directions,
				text:self.check(directions)
			})
		})

	},
	 // 判断文字
	 check(i){
      if(22.5<i && i<67.5){
        return '东北'
      }else if(67.5<i && i<112.5){
        return '正东'
      }else if(112.5<i && i<157.5){
        return '东南'
      }else if(157.5<i && i<202.5){
        return '正南'
      }else if(202.5<i && i<247.5){
        return '西南'
      }else if(247.5<i && i<292.5){
        return '正西'
      }else if(292.5<i && i<337.5){
        return '西北'
      }else{
        return '正北'
      }
    }, 
	// 切换罗盘模式
	togglePanMode() {
	  wx.showActionSheet({
	    itemList: ['主盘', '地图盘', '实景盘'],
	    success(e) {
	      var tabIndex = e.tapIndex
		  var url = ''
		  if(tabIndex == 0){
			  url = '/pages/index/index'
		  }else if(tabIndex == 1){
			  url = '/pages/map/map'
		  }else if(tabIndex == 2){
			   url = '/pages/live-action/live-action'
		  }
		  wx.navigateTo({
		  	url:url
		  })
		  
	    }
	  })
	},
	// 锁定
	lock(){
		this.setData({
			lockOnoff:!this.data.lockOnoff
		})
		if(this.data.lockOnoff){
			wx.stopCompass()
		}else{
			wx.startCompass()
		}
	},
	// 手动转盘
	manual(){
		this.setData({
			manualOnoff:!this.data.manualOnoff
		})
		
	},
	touchstart(e){
		this.setData({
			touchstartX:e.touches[0].clientX,
			touchstartY:e.touches[0].clientY
		})
	},
	touchmove(e){
		if(!this.data.manualOnoff){
			return
		}
		
		var clientX = e.touches[0].clientX
		var clientY = e.touches[0].clientY
		var direction = this.data.directionSouth
		// 判断手指在左右方位
		
		if(this.data.touchstartX<150){
			// 手指在左边
			if(clientY > this.data.touchstartY){
				direction-=3
			}else{
				direction+=3
			}
		}else{
			// 手指在右边
			if(clientY > this.data.touchstartY){
				direction+=3
			}else{
				direction-=3
			}
			
		}
		
		
		
		this.setData({
			directionSouth: direction
		})
	},
	
	// 罗盘展开隐藏
	togglePan(){
		this.setData({
			showPan: !this.data.showPan
		})
	},
	// 跳转天气界面
	toWeather(){
		this.setData({
			weatherShow:!this.data.weatherShow
		})
		
		setTimeout(()=>{
			this.setData({
				weatherShow:!this.data.weatherShow
			})
		},6000)
	},


})
