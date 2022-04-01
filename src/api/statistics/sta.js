import request from '@/utils/request'
const url = "/statisticsService/sta"
export default {

  createStatistics(day) {
    return request({
      url: `${url}/${day}`,
      method: 'get'
    })
  },
  showData(searchObj) {
    return request({
      url: `${url}/showData/${searchObj.type}/${searchObj.begin}/${searchObj.end}`,
      method: 'get'
    })
  }
}
