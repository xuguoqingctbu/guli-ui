<template>
  <div class="app-container">
    <el-input
      v-model="filterText"
      placeholder="Filter keyword"
      style="margin-bottom: 30px"
    />

    <el-tree
      ref="subjectTree"
      :data="subjectList"
      :props="defaultProps"
      :filter-node-method="filterNode"
      class="filter-tree"
      default-expand-all
    />
  </div>
</template>

<script>
import * as subject from "@/api/edu/subject";
export default {
  data() {
    return {
      filterText: "",
      subjectList: [],
      defaultProps: {
        children: "children",
        label: "title",
      },
    };
  },
  watch: {
    filterText(val) {
      this.$refs.subjectTree.filter(val);
    },
  },
  created() {
    this.getSubJectList();
  },
  methods: {
    //得到所有的课程
    getSubJectList() {
      subject.getSubjectList().then((response) => {
        this.subjectList = response.data.subjectList;
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.title.toLowerCase().indexOf(value.toLowerCase()) !== -1;
    },
  },
};
</script>

