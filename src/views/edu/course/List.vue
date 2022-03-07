<template>
  <div class="app-container">
    <h2>讲师列表</h2>
    <!--查询列表-->
    <el-form :inline="true" :model="courseQuery" class="demo-form-inline">
      <el-form-item label="课程标题">
        <el-input v-model="courseQuery.title" placeholder="课程标题"></el-input>
      </el-form-item>

      <!-- 课程讲师 TODO -->
      <el-form-item label="课程讲师">
        <el-select v-model="courseQuery.teacherId" placeholder="课程讲师">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"
          />
        </el-select>
      </el-form-item>

      <!-- 所属分类 TODO -->
      <!-- 所属分类：级联下拉列表 -->
      <!-- 一级分类 -->
      <el-form-item label="课程类别">
        <el-select
          v-model="courseQuery.subjectParentId"
          placeholder="一级分类"
          @change="subjectLevelOneChanged"
        >
          <el-option
            v-for="subject in subjectOneList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>

        <!-- 二级分类 -->
        <el-select v-model="courseQuery.subjectId" placeholder="二级分类">
          <el-option
            v-for="subject in subjectTwoList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="课程状态">
        <el-select v-model="courseQuery.status" placeholder="课程状态">
          <el-option label="已发布" value="Normal"></el-option>
          <el-option label="未发布" value="Draft"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="最低价格">
        <el-input
          v-model="courseQuery.minPrice"
          placeholder="最低价格"
        ></el-input>
      </el-form-item>

      <el-form-item label="最高价格">
        <el-input
          v-model="courseQuery.maxPrice"
          placeholder="最高价格"
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="getCourseList()">查询</el-button>
        <el-button type="default" @click="resetData()">清空</el-button>
      </el-form-item>
    </el-form>

    <!--展示列表-->
    <el-table
      :data="
        showList.filter(
          (data) =>
            !search || data.title.toLowerCase().includes(search.toLowerCase())
        )
      "
      style="width: 100%"
    >
      <el-table-column width="60" align="center" label="序号" fixed>
        <template slot-scope="scope">
          {{ (page - 1) * pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column label="标题" prop="title" width="150"> </el-table-column>
      <el-table-column
        label="教师Id"
        prop="teacherId"
        width="150"
      ></el-table-column>
      <el-table-column
        label="一级分类Id"
        prop="subjectParentId"
        width="150"
      ></el-table-column>
      <el-table-column
        label="二级分类Id"
        prop="subjectId"
        width="150"
      ></el-table-column>
      <el-table-column label="价格" prop="price" width="150"></el-table-column>
      <el-table-column
        label="总课时"
        prop="lessonNum"
        width="60"
      ></el-table-column>
      <el-table-column
        label="销售数量"
        prop="buyCount"
        width="60"
      ></el-table-column>
      <el-table-column
        label="浏览数量"
        prop="viewCount"
        width="60"
      ></el-table-column>
      <el-table-column
        label="课程状态"
        width="100"
      >
      <template  slot-scope="scope">
      {{scope.row.status=="Normal"?'已发布':'未发布'}}
      </template>
      </el-table-column>
      <el-table-column align="right" fixed="right" width="150">
        <template slot="header" slot-scope="{}">
          <el-input v-model="search" size="mini" placeholder="输入关键字搜索" />
        </template>

        <template slot-scope="scope">
          <router-link :to="`/course/info/${scope.row.id}`">
            <el-button size="mini">编辑</el-button>
          </router-link>

          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="getCourseList"
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
import * as teacher from "@/api/edu/teacher";
import * as subject from "@/api/edu/subject";
import * as course from "@/api/edu/course";
export default {
  name: "CourseList",

  data() {
    return {
      search: "",
      courseQuery: {},
      teacherList: [],
      subjectOneList: [],
      subjectTwoList: [],
      showList: [],
      page: 1,
      pageSize: 10,
      total: 100,
    };
  },
  created() {
    this.init();
  },
  mounted() {},

  methods: {
    //初始化
    init() {
      this.getListTeacher();
      this.getOneSubject();
      this.getCourseList();
    },
    //获取所有老师
    getListTeacher() {
      teacher.getTeacherAll().then(({ data }) => {
        this.teacherList = data.teacherList;
      });
    },
    //获取所有一级菜单
    getOneSubject() {
      subject.getSubjectList().then((response) => {
        this.subjectOneList = response.data.subjectList;
      });
    },
    //讲师列表的方法
    getCourseList(page = 1) {
      this.page = page;
      course
        .getCourseList(this.page, this.pageSize, this.courseQuery)
        .then(({ data }) => {
          this.showList = data.course;
          this.total = data.total;
        });
    },
    //选中一级菜单进行变化
    subjectLevelOneChanged(value) {
      for (let i = 0; i < this.subjectOneList.length; i++) {
        var oneSubject = this.subjectOneList[i];
        if (value === oneSubject.id) {
          this.subjectTwoList = oneSubject.children;
          //把二级分类id值清空
          this.courseInfo.subjectId = "";
          break;
        }
      }
    },
    resetData() {
      //表单输入项数据清空
      this.courseQuery = {};
      //重新刷新数据
      this.getCourseList();
    },
    handleSizeChange(pageSize = 10) {
      this.pageSize = pageSize;
      this.getCourseList();
    },
    //删除课程
    handleDelete(id){
       this.$confirm("此操作将永久删除课程记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        course.deleteCourse(id).then((response) => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.getCourseList();
        });
      });
    }
  },
};
</script>

<style scoped>
</style>