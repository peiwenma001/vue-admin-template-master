<template>
  <div class="app-container">
    <el-input v-model="filterText" placeholder="Filter keyword" style="margin-bottom:30px;" />

    <el-tree
      ref="tree2"
      :data="data2"
      :props="defaultProps"
      :filter-node-method="filterNode"
      class="filter-tree"
      default-expand-all
    />

  </div>
</template>

<script>
import subject from '../../../api/edu/subject'
export default {

  data() {
    return {
      filterText: '',
      data2: [
      //   表示返回所有分类的数据
      ],
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  created() {
   this.getAllSubject()
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },

  methods: {
    getAllSubject(){
      // 得到后端接口传过来的list数据
      subject.getSubjectList()
        .then(response =>{
         this.data2 = response.data.list
        })
    },
    filterNode(value, data) {
      if (!value) return true
      // toLowerCase把所有值变成小写比较，实现不区分大小写检索   indexOf比较值是否一样
      return data.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
    }
  }
}
</script>

