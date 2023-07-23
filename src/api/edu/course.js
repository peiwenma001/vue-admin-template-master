import request from '@/utils/request'

export default {
//   1添加课程信息
  addCourseInfo(courseInfo){
    return request({
      url: `/eduservice/course/addCourseInfo`,
      method: 'post',
      data:courseInfo
    })
  },
//   查询所有讲师
  getTeacher(){
    return request({
      url:`/eduservice/teacher/findAllTeacher`,
      method:`get`
    })
  }
}
