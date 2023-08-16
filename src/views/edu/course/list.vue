<template>
  <div class="app-container">
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="courseQuery.title" placeholder="课程名称"/>
      </el-form-item>

      <el-form-item>
        <el-select v-model="courseQuery.status" clearable placeholder="课程状态">
          <el-option value="Normal" label="已发布"/>
          <el-option value="Draft" label="未发布"/>
        </el-select>
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>

    <el-table
      :data="list"
      style="width: 100%">
      <el-table-column
        label="序号"
        width="70"
        align="center">
        <template slot-scope="scope">
          {{(page-1) * limit + scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column
        prop="title"
        label="课程名称"
        width="80">
      </el-table-column>
      <el-table-column
        label="课程状态" width="80">
        <template slot-scope="scope">
          {{ scope.row.status==='Normal' ? '已发布':'未发布'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="lessonNum"
        label="课时数">
      </el-table-column>
      <el-table-column
        prop="gmtCreate"
        label="添加时间"
        width="180">
      </el-table-column>
      <el-table-column
        prop="viewCount"
        width="80"
        label="浏览数量">
      </el-table-column>

      <el-table-column label="操作" width="400" align="center">
        <template slot-scope="scope">
          <router-link :to="'/teacher/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑课程基本信息</el-button>
          </router-link>
          <router-link :to="'/teacher/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑课程大纲</el-button>
          </router-link>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import course from '../../../api/edu/course'
export default {
  data(){ //定义变量和初始值
    return{
      list:null,//查询之后接口返回集合结果
      page:1,//当前页
      limit:10,//每页记录数
      total:0,//总记录数
      courseQuery:{}//条件封装对象
    }
  },
  created() { //页面渲染之前执行，一般调用methods定义的方法
    this.getList()
  },
  methods:{ //创建具体方法，调用引入js的方法
    //讲师列表方法
    getList(){
      course.getListCourse()
        .then(response => {
        //   response接口返回的数据
        //   console.log(response)
          this.list = response.data.list
        })//请求成功
        .catch(error => {
          console.log(error)
        })//请求失败
    },
    // 清空
    resetData(){
    this.courseQuery= {}
    this.getList()
    },
    // 删除
    removeDataById(courseId) {
      this.$confirm('此操作将永久删除课程记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {//点击确定，执行then方法
        //调用删除方法
        course.removeById(courseId)
          .then(response =>{
            //删除成功，提示信息
            this.$message({
              type:'success',
              message:'删除成功!'
            })
            //回到列表页面
            this.getList()
          })
      })
    }
  }
}

</script>
<style>

</style>
