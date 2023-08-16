import request from '@/utils/request'

export default {
//   添加小节
  addVideo(video){
    return request({
      url: `/eduservice/video/addVideo`,
      method: 'post',
      data:video
    })
  },
//   修改章节
  updateVideo(video){
    return request({
      url: `/eduservice/video/updateVideo`,
      method: 'post',
      data:video
    })
  },
  getOneVideo(id){
    return request({
      url:`/eduservice/video/${id}`,
      method:'get'
    })
  },
  // 删除小节
  deleteVideo(id){
    return request({
      url: `/eduservice/video/${id}`,
      method: 'delete'
    })
  }
}
