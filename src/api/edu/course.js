import request from '@/utils/request'

export default {
//   1添加课程信息
  addCourseInfo(courseInfo){
    // data中的数据会传到后端接口中去
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
  },
//   根据课程id查询课程基本信息
  getCourseInfoId(id){
    return request({
      url:`/eduservice/course/getCourseInfo/${id}`,
      method:`get`
    })
  },

//   修改课程信息
  updateCourseInfoId(courseInfo){
    return request({
      url:`/eduservice/course/updateCourseInfo`,
      method:`post`,
      data:courseInfo
    })
  }
}
