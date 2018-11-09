class wechat {
	/* 
		登录
		@return {Promise}
	 */
	login(){
		return new Promise((resolve,reject)=>{
			wx.login({
				success() {
					resolve
				},
				fail() {
					reject
				}
			})
		})
	}
}


module.exports = Wechat;