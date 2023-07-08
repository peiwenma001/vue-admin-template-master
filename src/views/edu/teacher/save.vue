<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name"/>
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" controls-position="right" min="0"/>
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career"/>
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea"/>
      </el-form-item>

      <!-- 讲师头像：TODO -->

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate()">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import teacherapi from '../../../api/edu/teacher'
export default {
  data(){
    return{
      teacher: {
        name: '',
        sort: 0,
        level: 1,
        career: '',
        intro: '',
        avatar: ''
      },
      saveBtnDisabled: false // 保存按钮是否禁用,
    }
  },
  created() {//页面渲染之前执行
   this.init()
  },
  watch:{//监听
    $route(){//路由变化的方式，路由发生变化，方法就会执行
      this.init()
    }
  },
  methods:{
    init(){
      //判断路径是否有id值
      if(this.$route.params && this.$route.params.id){
        //从路径获取id值
        const id = this.$route.params.id
        //根据id查询的方法
        this.getInfo(id)
      }else {//路径没有id值做添加
        //清空表单
        this.teacher={}
      }
    },
    //根据讲师id查询方法
    getInfo(id){
      teacherapi.getTeacherInfo(id)
        .then(response =>{
          this.teacher = response.data.teacher
        })
    },
    saveOrUpdate(){
      //判断是修改还是添加
      //根据teacher是否存在id判断，有id为修改，没有id为添加
      if(!this.teacher.id){
        //添加
        this.saveTeacher()
      }else {
        this.updateTeacher()
      }
    },
    //修改讲师的方法
    updateTeacher(){
      teacherapi.updateTeacherInfo(this.teacher)
        .then(response =>{
          this.$message({
            type:'success',
            message:'修改成功'
          })
          this.$router.push({
            path:'/teacher/table'
          })
        })
    },
    //添加讲师方法
    saveTeacher(){
      teacherapi.addTeacher(this.teacher)
        .then(response =>{
          //添加成功
          this.$message({
            type:'success',
            message:'添加成功'
          })
        // 回到首页  路由跳转
          this.$router.push({
            path:'/teacher/table'
          })
        })
    }
  }
}
</script>
<style>

</style>
