<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="最终发布"/>
    </el-steps>

    <el-form label-width="120px">

      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
      </el-form-item>

      <!-- 所属分类 TODO -->
      <el-form-item label="课程分类">
        <el-select
          v-model="courseInfo.subjectParentId"
          placeholder="一级分类" @change="subjectLevelOneChanged">
          <el-option
            v-for="subject in subjectOneList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>
        <!-- 二级分类 -->
        <el-select v-model="courseInfo.subjectId" placeholder="二级分类">
          <el-option
            v-for="subject in subjectTwoList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>
      </el-form-item>
      <!-- 课程讲师 TODO -->
      <!-- 课程讲师 -->
      <el-form-item label="课程讲师">
        <el-select
          v-model="courseInfo.teacherId"
          placeholder="请选择">
          <el-option
            v-for="teacher in TeacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"/>
        </el-select>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
      </el-form-item>

      <!-- 课程简介 TODO -->
      <!-- 课程简介-->
      <el-form-item label="课程简介">
        <!--        富文本编辑器使用-->
        <tinymce :height="300" v-model="courseInfo.description"/>
      </el-form-item>

      <!-- 课程封面 TODO -->
      <!-- 课程封面-->
      <el-form-item label="课程封面">

        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API+'/eduoss/fileoss'"
          class="avatar-uploader">
          <img :src="courseInfo.cover" :width="200" :height="200">
        </el-upload>

      </el-form-item>

      <el-form-item label="课程价格">
        <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/> 元
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存并下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import courseInfo from 'svg-sprite-loader/examples/custom-runtime-generator/build/main'
import course from '../../../api/edu/course'
import subject from '../../../api/edu/subject'
import tinymce from '../../../components/Tinymce/index.vue'//引入组件
export default {
  // 声明组件，第三方组件必须声明才能用
  components:{tinymce},
  computed: {
    courseInfo() {
      return courseInfo
    }
  },
  data() {
    return {
      saveBtnDisabled: false, // 保存按钮是否禁用
      courseInfo:{
        title: '',
        subjectId: '',//二级分类
        subjectParentId:'',//一级分类
        teacherId: '',
        lessonNum: 0,
        description: '',
        cover: '/static/1.jpg',
        price: 0
      },
      TeacherList:[],//封装所有讲师
      subjectOneList:[],//一级分类
      subjectTwoList:[],//二级分类
      BASE_API: process.env.BASE_API, // 接口API地址
      courseId:''
    }
  },

  created() {
    // 数据回显，获取路由中的id
    if(this.$route.params.id && this.$route.params.id){
      this.courseId = this.$route.params.id
      this.getInfo()
      this.getListTeacher()
    }else {
      //   初始化所有讲师
      this.getListTeacher()
      // 初始化一级分类
      this.getOneSubject()
    }
  },

  methods: {
  //   添加课程
    addCourse(){
      course.addCourseInfo(this.courseInfo)
        .then(response =>{
          //   提示
          this.$message({
            type:'success',
            message:'添加课程信息成功'
          })
          // 跳转到第二步页面
          this.$router.push({ path: '/course/chapter/'+ response.data.courseId})
        })
    },
    // 修改课程
    updateCourse(){
      course.updateCourseInfoId(this.courseInfo)
        .then(response =>{
          this.$message({
            type:'success',
            message:'修改课程信息成功'
          })
          // 跳转到第二步页面
          this.$router.push({ path: '/course/chapter/'+ this.courseId})
        })
    },
    saveOrUpdate() {
    // 判断是添加还是修改
      if (!this.courseInfo.id){
      //   添加
       this.addCourse()
      }else {
        //   修改
        this.updateCourse()
      }
    },
  //   查询所有讲师
    getListTeacher() {
      course.getTeacher()
        .then(response =>{
          this.TeacherList = response.data.items
        })
    },
  //   查询所有一级分类
    getOneSubject(){
      subject.getSubjectList()
        .then(response =>{
         this.subjectOneList = response.data.list
        })
    },
  //   点击某个一级分类，触发change事件，显示对应二级分类
    subjectLevelOneChanged(value){
    //   value,就是一级分类id,框架已经帮我们把值传过来了
      for (let i = 0; i < this.subjectOneList.length; i++) {
        if (this.subjectOneList[i].id === value) {
          this.subjectTwoList = this.subjectOneList[i].children
          this.courseInfo.subjectId = ''
        }
      }
    },
  //   上传封面成功调用方法
    handleAvatarSuccess(res, file){
      this.courseInfo.cover = res.data.url//得到上传成功的地址赋值传入数据库图片地址
    },
  //   上传封面之前调用方法
    beforeAvatarUpload(file){
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
  //   数据回显，根据课程id查询信息
    getInfo(){
      course.getCourseInfoId(this.courseId)
        .then(response =>{
          // 在courseInfo中，包含一级分类id，二级分类id
          this.courseInfo = response.data.courseInfoVo
        //   查询所有分类
          subject.getSubjectList()
            .then(response =>{
              // 获取一级所有分类
              this.subjectOneList = response.data.list
            //   把所有一级分类数据遍历，比较当前courseInfoVo中的一级分类id和所有的一级分类id是否一样
              for (let i = 0;i<this.subjectOneList.length;i++){
              //   获取每个一级分类
                let oneSubject = this.subjectOneList[i]
              //   比较当前courseInfoVo中的一级分类id和所有的一级分类id是否一样
                if (this.courseInfo.subjectParentId === oneSubject.id){
                //   获取一级分类中的所有分类
                  this.subjectTwoList = oneSubject.children


                  // console.log(this.courseInfo)
                }
              }
            })
        })
    }
  }
}
</script>
<!--富文本编辑器样式-->
<style scoped>
.tinymce-container {
  line-height: 29px;
}
</style>
