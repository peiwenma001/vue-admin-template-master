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

    <!-- 章节 -->
    <ul class="chanpterList">
      <li
        v-for="chapter in chapterVideoList"
        :key="chapter.id">
        <p>
          {{ chapter.title }}

          <span class="acts">
                <el-button type="text">添加课时</el-button>
                <el-button style="" type="text" @click="openEditChatper(chapter.id)">编辑</el-button>
                <el-button type="text" @click="removeChapter(chapter.id)">删除</el-button>
            </span>
        </p>

        <!-- 视频 -->
        <ul class="chanpterList videoList">
          <li
            v-for="video in chapter.children"
            :key="video.id">
            <p>{{ video.title }}
              <span class="acts">
                        <el-button type="text">编辑</el-button>
                        <el-button type="text">删除</el-button>
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
      dialogChapterFormVisible:false,//章节弹框值
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
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #DDD;
}

</style>
