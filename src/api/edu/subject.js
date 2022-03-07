import request from '@/utils/request'

//课程分类列表
const url = "/eduservice/eduService/subject"
export function getSubjectList() {
  return request({
    url: `${url}/subjectinfo`,
    method: "get",
  })
}