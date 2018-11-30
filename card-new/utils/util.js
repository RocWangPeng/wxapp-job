const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

	// 根据代码匹配城市
	const getCityResult = (cityDatas, sheng, shi) =>{
		var getCityResultstr = ''
		cityDatas.forEach((item) => {
			// 匹配省
			if (item.regionId == sheng) {
				getCityResultstr += item.regionName + ' '

				item.children.forEach((item) => {
					if (item.regionId == shi) {
						getCityResultstr += item.regionName + ' '
					}
				})
			}
		})
		return getCityResultstr
	}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime,
  getCityResult
}
