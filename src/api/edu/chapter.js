import request from '@/utils/request'

const url = "/eduservice/eduService/chapter"

export function getChapterAndVideoByCourseId(courseId) {
  return request({
    url: `${url}/getList/${courseId}`,
    method: 'get',
  })
}

export function addChapter(chapter) {
  return request({
    url: `${url}`,
    method: 'post',
    data: chapter
  })
}

export function updateChapter(chapter) {
  return request({
    url: `${url}`,
    method: 'put',
    data: chapter
  })
}

export function addChapterByCourseId(courseId, chapter) {
  return request({
    url: `${url}/${courseId}`,
    method: 'post',
    data: chapter
  })
}

export function getChapterById(chapterId) {
  return request({
    url: `${url}/${chapterId}`,
    method:'get'
  })
}

export function deleteChapter(chapterId) {
  return request({
    url: `${url}/${chapterId}`,
    method: 'delete'
  })
}
