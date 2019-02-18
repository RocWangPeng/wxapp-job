const formatTime = date => {
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	const hour = date.getHours()
	const minute = date.getMinutes()
	const second = date.getSeconds()

	return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
	n = n.toString()
	return n[1] ? n : '0' + n
}

// 验证手机号
function regPhone(val) {
	var myreg = /^1(3|4|5|7|8)[0-9]\d{8}$/;
	if (myreg.test(val)) {
		return true
	} else {
		return false
	}
}

function navigateTo(object) {
        if (getCurrentPages().length > 9) {
            wx.reLaunch(object)
        } else {
            wx.navigateTo(object)
        }
    }

function request(url, method, params,ContentType) {
	let promise = new Promise(function(resolve, reject) {
		// 从缓存中获取cookie信息
		const _authval = wx.getStorageSync('_auth')
		wx.request({
			url: url,
			data: params,
			method: method,
			header: {
				'Content-Type':ContentType || "application/json",
				'cookie':"_auth="+_authval
			},
			success: function(res) {
				if(res.data.code == 1 || res.data.code == 401){
					wx.removeStorageSync('_auth')
					wx.reLaunch({
						url:'/pages/user/authorization/authorization?role=1'
					})
					return
				}
				
				resolve(res.data);
			}
		})
	});
	return promise
}

function requestTeam(url, method, params,ContentType) {
	let promise = new Promise(function(resolve, reject) {
		// 从缓存中获取cookie信息
		const _authval = wx.getStorageSync('_auth_team')
		wx.request({
			url: url,
			data: params,
			method: method,
			header: {
				'Content-Type':ContentType || "application/json",
				'cookie':"_auth="+_authval
			},
			success: function(res) {
				if(res.data.code == 1 || res.data.code == 401){
					wx.removeStorageSync('_auth_team')
					wx.reLaunch({
						url:'/pages/user/authorization/authorization?role=2'
					})
					return
				}
				
				resolve(res.data);
			}
		})
	});
	return promise
}

// var authApi = 'http://192.168.0.117:7009' //登陆注册相关
// var personApi = 'http://192.168.0.117:8013'	//个人相关
// var teamApi = 'http://192.168.0.117:8015'	//团队相关

var authApi = 'https://www.tcrunner.com/UniversalCards/apiAuth' //登陆注册相关
var personApi = 'https://www.tcrunner.com/UniversalCards/apiPersonal'	//个人相关
var teamApi = 'https://www.tcrunner.com/UniversalCards/apiTeam'	//团队相关

module.exports = {
	formatTime: formatTime,
	regPhone: regPhone,
	request: request,
	requestTeam:requestTeam,
	authApi:authApi,
	personApi:personApi,
	teamApi:teamApi,
	navigateTo
}