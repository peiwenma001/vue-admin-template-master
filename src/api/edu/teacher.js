import request from '@/utils/request'

export default {
//   讲师列表（条件查询分页）
  getTeacherListPage(current,limit,teacherQuery){
    return request({
      url: `/eduservice/teacher/pageTeacherCondition/${current}/${limit}`,
      method: 'post',
    //   teacherQuery条件的对象，后端使用RequestBody获取数据
    //   data表示把对象转换json进行传递到接口里面
      data:teacherQuery
    })
  },
  // 删除
  removeById(id){
    return request({
      url: `/eduservice/teacher/${id}`,
      method: 'delete'
    })
  },
  //添加讲师
  addTeacher(teacher){
    return request({
      url: `/eduservice/teacher/addTeacher`,
      method: 'post',
      data:teacher
    })
  },
  //根据id查询讲师，修改需要调用此接口，实现数据回显
  getTeacherInfo(id){
    return request({
      url: `/eduservice/teacher/getTeacher/${id}`,
      method: 'get',
    })
  },
  //修改讲师
  updateTeacherInfo(teacher){
    return request({
      url: `/eduservice/teacher/updateTeacher`,
      method: 'post',
      data:teacher
    })
  }
}
