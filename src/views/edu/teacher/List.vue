<template>
  <div class="app-container">
    <h2>讲师列表</h2>
    <!--查询列表-->
    <el-form :inline="true" :model="teacherQuery" class="demo-form-inline">
      <el-form-item label="讲师名">
        <el-input v-model="teacherQuery.name" placeholder="讲师名"></el-input>
      </el-form-item>

      <el-form-item label="讲师头衔">
        <el-select v-model="teacherQuery.level" placeholder="讲师头衔">
          <el-option label="高级讲师" :value="1"></el-option>
          <el-option label="特级讲师" :value="2"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="开始时间">
        <el-date-picker
          v-model="teacherQuery.begin"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label="结束时间">
        <el-date-picker
          v-model="teacherQuery.end"
          placeholder="选择结束时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        ></el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="getList()">查询</el-button>
        <el-button type="default" @click="resetData()">清空</el-button>
      </el-form-item>
    </el-form>

    <!--展示列表-->
    <el-table
      :data="
        showList.filter(
          (data) =>
            !search || data.name.toLowerCase().includes(search.toLowerCase())
        )
      "
      style="width: 100%"
    >
      <el-table-column width="70" align="center" label="序号">
        <template slot-scope="scope">
          {{ (page - 1) * pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="名称" prop="name" width="80"> </el-table-column>
      <el-table-column label="头衔" width="80">
        <template slot-scope="scope">
          {{ scope.row.level === 1 ? "高级讲师" : "首席讲师" }}
        </template>
      </el-table-column>
      <el-table-column label="资历" prop="intro"></el-table-column>
      <el-table-column label="添加时间" prop="gmtCreate" width="160">
      </el-table-column>
      <el-table-column label="排序" prop="sort" width="60"></el-table-column>
      <el-table-column align="right">
        <template slot="header" slot-scope="{}">
          <el-input v-model="search" size="mini" placeholder="输入关键字搜索" />
        </template>

        <template slot-scope="scope">
          <router-link :to="`/eduteacher/edit/${scope.row.id}`">
            <el-button size="mini">Edit</el-button>
          </router-link>

          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row.id)"
            >Delete</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="getList"
      :current-page="page"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
//引入调用teacher.js文件
import * as teacher from "@/api/edu/teacher";
export default {
  name: "List",
  data() {
    return {
      search: "",
      list: [],
      teacherQuery: {},
      page: 1,
      pageSize: 10,
      total: 100,
    };
  },
  computed: {
    showList() {
      return this.list;
    },
  },
  created() {
    this.getList();
  },
  methods: {
    handleEdit(row) {
      // this.$router.replace({
      //   path: "/eduteacher/edit",
      //   query: { teacher: row, id: row.id },
      // });
      // this.$router.push({
      //   // path: `/eduteacher/edit/${row.id}`,
      //   name: "teacherEdit",
      //   params: {
      //     id:row.id,
      //   },
      // });
    },
    handleDelete(id) {
      this.$confirm("此操作将永久删除讲师记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        teacher.deleteTeacher(id).then((response) => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.getList();
        });
      });
    },
    //讲师列表的方法
    getList(page = 1) {
      this.page = page;
      teacher
        .getTeacherList(this.page, this.pageSize, this.teacherQuery)
        .then((response) => {
          const { data } = response;
          console.log(data);
          this.list = data.items;
          this.total = data.total;
        })
        .catch((error) => {});
    },
    resetData() {
      //表单输入项数据清空
      this.teacherQuery = {};
      //重新刷新数据
      this.getList();
    },
    handleSizeChange(pageSize = 10) {
      this.pageSize = pageSize;
      this.getList();
    },
  },
};
</script>

<style>
</style>