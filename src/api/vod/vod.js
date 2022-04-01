import request from '@/utils/request'

const url = "/vodService/video"

//删除视频
export function deleteAliyunvod(videoId) {
  return request({
    url: `${url}/${videoId}`,
    method: 'delete'
  })
}