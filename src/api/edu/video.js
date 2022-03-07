import request from '@/utils/request'

const url = "/eduservice/eduService/video"

//添加小节
export function addVideo(video) {
  return request({
    url: `${url}`,
    method: 'post',
    data: video
  })
}

//更新小节
export function updateVideo(video) {
  return request({
    url: `${url}`,
    method: 'put',
    data: video
  })
}

//添加小节通过课程Id
export function addVideoByCourseId(courseId, video) {
  return request({
    url: `${url}/${courseId}`,
    method: 'post',
    data: video
  })
}

//通过id查询小节信息
export function getVideoById(videoId) {
  return request({
    url: `${url}/${videoId}`,
    method: 'get'
  })
}

//删除小节
export function deleteVideo(videoId) {
  return request({
    url: `${url}/${videoId}`,
    method: 'delete'
  })
}

