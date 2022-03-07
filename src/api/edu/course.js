import request from '@/utils/request'

const url = "/eduservice/eduService/course"

export function getCourseList(page, pageSize, data) {
  return request({
    url: `${url}/${page}/${pageSize}`,
    method: "post",
    data,
  })
}

export function saveCourseInfo(courseInfoVo) {
  return request({
    url: `${url}`,
    method: 'post',
    data: courseInfoVo
  })
}

export function getCourseInfoById(courseId) {
  return request({
    url: `${url}/${courseId}`,
    method: 'get',
  })
}

export function updateCourseById(courseId, courseInfoVo) {
  return request({
    url: `${url}/${courseId}`,
    method: 'put',
    data: courseInfoVo
  })
}

export function updateCourse(courseInfoVo) {
  return request({
    url: `${url}`,
    method: 'put',
    data: courseInfoVo
  })
}

export function getCoursePublishInfoById(id) {
  return request({
    url: `${url}/course-publish-info/${id}`,
    method: 'get'
  })
}

export function publishCourse(id) {
  return request({
    url: `${url}/publish-course/${id}`,
    method: 'put'
  })
}

export function deleteCourse(id) {
  return request({
    url: `${url}/${id}`,
    method:'delete'
  })
}