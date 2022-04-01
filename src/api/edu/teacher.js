import request from '@/utils/request'

//分页查询
const url = "/eduService/teacher"
export function getTeacherList(page, pageSize, data) {
  return request({
    url: `${url}/${page}/${pageSize}`,
    method: "post",
    data,
  })
}

//获得所有讲师
export function getTeacherAll() {
  return request({
    url: `${url}/getAll`,
    method:'get',
  })
}

//删除讲师
export function deleteTeacher(id) {
  return request({
    url: `${url}/${id}`,
    method: 'delete',
  })
}
//根据id查询讲师
export function getTeacherById(id) {
  return request({
    url: `${url}/${id}`,
    method: 'get',
  })
}

//添加讲师
export function addTeacher(data) {
  return request({
    url: `${url}`,
    method: 'post',
    data
  })
}

//修改讲师
export function updateTeacherByID(id, data) {
  return request({
    url: `${url}/${id}`,
    method: 'put',
    data,
  })
}
//修改讲师传递id
export function updateTeacher(data) {
  return request({
    url: `${url}/updateTeacher`,
    method: 'post',
    data,
  })
}