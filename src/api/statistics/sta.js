import request from '@/utils/request'
const url = "/statisticsService/sta"
export default {

  createStatistics(day) {
    return request({
      url: `${url}/${day}`,
      method: 'get'
    })
  },
  showData(type, begin, end) {
    return request({
      url: `${url}/showData/${type}/${begin}/${end}`,
      method: 'get'
    })
  }
}
