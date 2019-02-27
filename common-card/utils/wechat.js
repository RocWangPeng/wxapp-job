class wechat {
	/* 
		登录
		@return {Promise}
	 */
	static login() {
		return new Promise((resolve, reject) => {
			wx.login({
				success: res => {
					// 发送 res.code 到后台换取 openId, sessionKey, unionId
					resolve(res.code)
				},
				fail: (err) => {
					rejecte('登陆失败')
				}
			})

		})
	}
	
	/* 
	 通过openId获取unionId
	 */
	static getUnionIdByOpenId(openId){
		return new Promise((resolve, reject) => {
			wx.request({
				url: "https://www.tcrunner.com/UniversalCards/apiPersonal/personal/getUnionIdByOpenId",
				data: {
					openId,
					role:1
				},
				success: (res) => {
					resolve(res)
				},
				fail: (err) => {
					
					reject(err)
				}
			})
		
		})
	}

	/* 
		是否授权
		@return {Promise}
	 */
	static getUserInfo() {
		return new Promise((resolve, reject) => {
			wx.getSetting({
				success: res => {
					if (res.authSetting['scope.userInfo']) {
						// 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
						this.login().then(code => {
							wx.getUserInfo({
								lang: "zh_CN",
								success: res => {
									// 可以将 res 发送给后台解码出 unionId
									res.code = code
									resolve(res)
								}
							})
						})
					} else {
						// 未授权
						reject('未授权')
					}
				}
			})
		})
	}

	/* 
		获取UnineId
		@return {Promise}
	*/
	static getUnineId(params) {
		// console.log(params);
		// return
		return new Promise((resolve, reject) => {
			wx.request({
				url: "https://www.tcrunner.com/UniversalCards/apiPersonal/personal/decodeUnionId",
				data: params,
				success: (res) => {
					resolve(res)
				},
				fail: (err) => {
					console.log('fail',err);
					reject(err)
				}
			})

		})
	}

	/* 
		获取openId
		@return {Promise}
	*/
	static getOpenIdOrUnionId(params) {
		return new Promise((resolve, reject) => {
			this.login()
				.then(code => {
					wx.request({
						url: "https://www.tcrunner.com/UniversalCards/apiPersonal/personal/decodeUnionId",
						data: {
							code: code,
						},
						success: (res) => {
							if(res.data.code == 0){
								var data = res.data.data
								var obj = {
									openId: data.openId,
									unionId: data.unionId
								}
								
								resolve(obj)
							}else{
								reject()
							}
							
						},
						fail: (err) => {
							reject(err)
						}
					})
				})


		})
	}
}


module.exports = wechat;
