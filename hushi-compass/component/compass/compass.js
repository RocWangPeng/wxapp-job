Component({
	properties: {
		
	},
	data:{
		directionSouth:0
	},
	lifetimes: {
		ready() {
			// 罗盘监听
			var self = this
			wx.onCompassChange(function(res) {
				self.setData({
					directionSouth:360 - res.direction.toFixed(0)
				})
			})
		},
	},
	methods: {
	}
});



