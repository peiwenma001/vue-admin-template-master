<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="最终发布"/>
    </el-steps>
    <el-button type="text" @click="openChapterDialog()">添加章节</el-button>
    <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
      <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="chapter.title"/>
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number v-model="chapter.sort" :min="0" controls-position="right"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加和修改小节表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title"/>
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.free">
            <el-radio :label="true">免费</el-radio>
            <el-radio :label="false">默认</el-radio>
          </el-radio-group>
        </el-form-item>
          <el-form-item label="上传视频">
            <el-upload
              :on-success="handleVodUploadSuccess"
              :on-remove="handleVodRemove"
              :before-remove="beforeVodRemove"
              :on-exceed="handleUploadExceed"
              :file-list="fileList"
              :action="BASE_API+'/eduvod/video/uploadAlyiVideo'"
              :limit="1"
              class="upload-demo">
              <el-button size="small" type="primary">上传视频</el-button>
              <el-tooltip placement="right-end">
                <div slot="content">最大支持1G，<br>
                  支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
                  GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
                  MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
                  SWF、TS、VOB、WMV、WEBM 等视频格式上传</div>
                <i class="el-icon-question"/>
              </el-tooltip>
            </el-upload>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button :disabled="saveVideoBtnDisabled" type="primary" @click="saveOrUpdateVideo">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 章节 -->
    <ul class="chanpterList">
      <li
        v-for="chapter in chapterVideoList"
        :key="chapter.id">
        <p>
          {{ chapter.title }}

          <span class="acts">
                <el-button type="text" @click="openVideo(chapter.id)">添加小节</el-button>
                <el-button style="" type="text" @click="openEditChatper(chapter.id)">编辑章节</el-button>
                <el-button type="text" @click="removeChapter(chapter.id)">删除章节</el-button>
            </span>
        </p>

        <!-- 视频 -->
        <ul class="chanpterList videoList">
          <li
            v-for="video in chapter.children"
            :key="video.id">
            <p>{{ video.title }}
              <span class="acts">
                        <el-button type="text" @click="oneVideo(video.id)">编辑</el-button>
                        <el-button type="text" @click="removeVideo(video.id)">删除</el-button>
                    </span>
            </p>
          </li>
        </ul>
      </li>
    </ul>
    <el-form label-width="120px">

      <el-form-item>
        <el-button @click="previous">上一步</el-button>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import chp from '../../../api/edu/chapter'
import vi from '../../../api/edu/video'
import video from '../../../api/edu/video'
export default {
  data() {
    return {
      saveBtnDisabled: false, // 保存按钮是否禁用
      courseId:'',//课程id
      chapterVideoList:[],
      chapter:{//封装章节数据对象
        title:'',
        sort: 0
      },
      video:{//小节对象
        title: '',
        sort: 0,
        free:0,
        videoSourceId:'',//视频id
        videoOriginalName:''//视频名称
      },
      dialogChapterFormVisible:false,//章节弹框值
      dialogVideoFormVisible:false,//小节弹框值
      fileList: [],//上传文件列表
      BASE_API: process.env.BASE_API // 接口API地址
    }
  },

  created() {
    // 获取路由中的id
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id
    }
    this.getChapterVideo()
  },

  methods: {
    // 上传成功方法
    handleVodUploadSuccess(response,file,fileList){
    //   上传视频id赋值
    this.video.videoSourceId = response.data.videoId
      // 上传视频名称赋值
      this.video.videoOriginalName = file.name
    },
    handleVodRemove(){
    //   根据视频id删除视频
    //   点击确定会调用此方法
    vi.deleteAlyVideo(this.video.videoSourceId)
      .then(response =>{
        this.$message({
          type:'success',
          message:'删除视频成功'
        })
      //   把文件列表清空
        this.fileList = []
        this.video.videoSourceId = ''
        this.video.videoOriginalName = ''
      })
    },
    beforeVodRemove(file,fileList){
    // 点击x会调用此方法
      return this.$confirm(`确定移除 ${ file.name } ?`)
    },
    // 上传之前
    handleUploadExceed(){
      this.$message.warning('想要重新上传视频，请先删除已经上传的视频！')
    },

    // --------------------------------小节操作-------------------------------
    // 添加小节弹框方法
    openVideo(chapterId){
    //   弹框
      this.dialogVideoFormVisible = true
    //   设置章节id
      this.video.chapterId = chapterId
    //   设置课程id
      this.video.courseId = this.courseId
    },


    // 添加小节
    addVideo(video) {
      vi.addVideo(this.video)
        .then(response =>{})
         //   关闭弹框
        this.dialogVideoFormVisible = false
      //   提示信息
      this.$message({
        type:'success',
        message:'添加小节成功'
      })
        // 删除上一次编写内容
        this.video = {}
          //   刷新页面
          this.getChapterVideo()
    },
    // 根据id查询做修改的数据回显
    oneVideo(id){
    this.dialogVideoFormVisible = true
    vi.getOneVideo(id)
      .then(response =>{
        this.video = response.data.OneVideo
      })
    },
    // 修改小节
    updateVideo(){
      vi.updateVideo(this.video)
        .then(response =>{
          //   关闭弹框
          this.dialogVideoFormVisible = false
          //   提示信息
          this.$message({
            type:'success',
            message:'修改小节成功'
          })
          this.video = {}
          //   刷新页面
          this.getChapterVideo()
        })
    },
    // 判断是小节添加操作还是修改
    saveOrUpdateVideo(){
      // 根据id判断是修改还是添加
      if (this.video.id){
        this.updateVideo()//修改
      }else {
        this.addVideo()//添加
      }
    },
    // 删除小节
    removeVideo(id){
      this.$confirm('此操作将永久删除小节, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {//点击确定，执行then方法
        //调用删除方法
        vi.deleteVideo(id)
          .then(response =>{
            //删除成功，提示信息
            this.$message({
              type:'success',
              message:'删除成功!'
            })
            //回到列表页面
            this.getChapterVideo()
          })
      })
    },
    // --------------------------------章节操作-------------------------------
    // 上一步
    previous() {
      this.$router.push({ path: '/course/info/' + this.courseId })
    },
    //下一步
    next() {
      this.$router.push({ path: '/course/publish/'+ this.courseId  })
    },
//   根据课程id获取章节和小节数据列表
    getChapterVideo(){
      chp.getAllChapterVideo(this.courseId)
        .then(response =>{
          this.chapterVideoList = response.data.allChapterVideo
        })
    },
    // 添加章节
    addChapter(chapter) {
      // 设置课程id到chapter对象
      this.chapter.courseId = this.courseId
      chp.addChapter(this.chapter)
        .then(response =>{
          //   关闭弹框
          this.dialogChapterFormVisible = false
          //   提示信息
          this.$message({
            type:'success',
            message:'添加章节成功'
          })
          //   刷新页面
          this.getChapterVideo()
        })
    },
    // 修改章节方法
    updateChapter(chapter){
      chp.updateChapter(this.chapter)
        .then(response =>{
          //   关闭弹框
          this.dialogChapterFormVisible = false
          //   提示信息
          this.$message({
            type:'success',
            message:'修改章节成功'
          })
          //   刷新页面
          this.getChapterVideo()
        })
    },
    // 判断是添加还是修改
    saveOrUpdate(){
      if (this.chapter.id){
        this.updateChapter()
      }else {
        this.addChapter()
      }
    },
    // 修改章节弹框做数据回显方法
    openEditChatper(chapterId){
      // 弹框
      this.dialogChapterFormVisible = true
      // 调用接口
      chp.getChapter(chapterId)
        .then(response =>{
          this.chapter = response.data.chapter
        })
    },
    // 弹出添加章节页面
    openChapterDialog(){
    //   弹框
      this.dialogChapterFormVisible = true
    //   弹框之后清空表单数据
      this.chapter = {}
    },
    // 删除章节
    removeChapter(chapterId){
      this.$confirm('此操作将永久删除章节记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {//点击确定，执行then方法
        //调用删除方法
        chp.deleteChapter(chapterId)
          .then(response =>{
            //删除成功，提示信息
            this.$message({
              type:'success',
              message:'删除成功!'
            })
            //刷新页面表页面
            this.getChapterVideo()
          })
      })
    }
  }
}
</script>
<style scoped>
.chanpterList{
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
}
.chanpterList li{
  position: relative;
}
.chanpterList p{
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #DDD;
}
.chanpterList .acts {
  float: right;
  font-size: 14px;
}

.videoList{
  padding-left: 50px;
}
.videoList p{
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #DDD;
}

</style>
