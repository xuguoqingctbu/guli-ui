import request from '@/utils/request'

const url = "/eduvideo/vod/video"

//删除视频
export function deleteAliyunvod(videoId) {
  return request({
    url: `${url}/${videoId}`,
    method: 'delete'
  })
}