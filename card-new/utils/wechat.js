class wechat {
	/* 
		登录
		@return {Promise}
	 */
	static login() {
		return new Promise((resolve, reject) => {
			wx.login({
				success(res) {
					resolve(res.code)
				},
				fail(err) {
					rejecte('登陆失败')
				}
			})
		})
	}

	/* 
		是否授权
		@return {Promise}
	 */
	static isAuth() {
		return new Promise((resolve, reject) => {
			wx.getSetting({
				success: res => {
					if (res.authSetting['scope.userInfo']) {
						
						// 已经授权
						resolve('已授权')
					} else {
						// 未授权
						reject('未授权')
					}
				}
			})
		})
	}

	/* 
		获取用户信息
		@return {Promise}
	 */
	static getUserInfo() {
		return new Promise((resolve, reject) => {
			wx.getUserInfo({
				success: (res) => {
					resolve(res)
				},
				fail: (err) => {
					reject
				}
			})
		})
	}
	
	/* 
		获取UnineId
		@return {Promise}
	*/
   static getUnineId(params){
	   return new Promise((resolve,reject)=>{
		   wx.request({
		   	url:"https://ii.sinelinked.com/tg_web/api/user/getUnionId",
			data:params,
			success: (res) => {
				resolve(res)
			},
			fail: (err) => {
				reject(err)
			}
		   })
		   
	   })
   }
}


module.exports = wechat;
