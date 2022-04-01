import request from '@/utils/request'

const url = "/eduService/user"
export function login(data) {
  return request({
    url:`${url}/login`,
    method: 'post',
    // data
  })
}

export function getInfo(token) {
  return request({
    url: `${url}/info`,
    method: 'get',
    // params: { token }
  })
}

export function logout() {
  return request({
    url: `${url}/logout`,
    method: 'post'
  })
}
