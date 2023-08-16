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
      // data中的数据会传到后端接口中去
    })
  },
//   课程确认信息显示
  getPublishCourseInfoId(id){
    return request({
      url:`/eduservice/course/getPublishCourseInfo/${id}`,
      method:`get`
    })
  },
//   课程最终发布
  PublishCourse(id){
    return request({
      url:`/eduservice/course/publishCourse/${id}`,
      method:`get`
    })
  },
  //   课程列表
  getListCourse(){
    return request({
      url:`/eduservice/course/getCourseList`,
      method:`get`
    })
  },
  // 删除课程
  removeById(courseId){
    return request({
      url: `/eduservice/course/${courseId}`,
      method: 'delete'
    })
  },
}
