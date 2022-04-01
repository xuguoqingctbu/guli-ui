<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>
    <el-steps
      :active="1"
      simple
      align-center
      process-status="wait"
      style="margin-bottom: 40px"
    >
      <el-step title="填写课程基本信息" icon="el-icon-edit"></el-step>
      <el-step title="创建课程大纲" icon="el-icon-upload"></el-step>
      <el-step title="最终发布" icon="el-icon-picture"></el-step>
    </el-steps>

    <el-form label-width="120px">
      <el-form-item label="课程标题">
        <el-input
          v-model="courseInfo.title"
          placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"
        />
      </el-form-item>

      <!-- 所属分类 TODO -->
      <!-- 所属分类：级联下拉列表 -->
      <!-- 一级分类 -->
      <el-form-item label="课程类别">
        <el-select
          v-model="courseInfo.subjectParentId"
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
        <el-select v-model="courseInfo.subjectId" placeholder="二级分类">
          <el-option
            v-for="subject in subjectTwoList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>
      </el-form-item>

      <!-- 课程讲师 TODO -->
      <el-form-item label="课程讲师">
        <el-select v-model="courseInfo.teacherId" placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number
          :min="0"
          v-model="courseInfo.lessonNum"
          controls-position="right"
          placeholder="请填写课程的总课时数"
        />
      </el-form-item>

      <el-form-item label="课程价格">
        <el-input-number
          :min="0"
          v-model="courseInfo.price"
          controls-position="right"
          placeholder="免费课程请设置为0元"
        />
        元
      </el-form-item>

      <!-- 课程封面 TODO -->
      <el-form-item label="课程封面">
        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API + '/ossService/admin/file/upload'"
          class="avatar-uploader"
        >
          <img :src="courseInfo.cover" width="400px" />
        </el-upload>
      </el-form-item>

      <!-- 课程简介-->
      <el-form-item label="课程简介">
        <Tinymce
          v-model="courseInfo.description"
          :disabled="false"
          :value="courseInfo.description"
          @input="content"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          :disabled="saveBtnDisabled"
          type="primary"
          @click="saveOrUpdate"
          >保存并下一步</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Tinymce from "@/components/Tinymce";
import * as course from "@/api/edu/course";
import * as teacher from "@/api/edu/teacher";
import * as subject from "@/api/edu/subject";
const defaultForm = {
  title: "",
  subjectParentId: "",
  subjectId: "",
  teacherId: "",
  lessonNum: 0,
  description: "",
  cover: "/subject/01.jpg",
  price: 0,
};

export default {
  name: "CourseInfo",
  components: { Tinymce },
  data() {
    return {
      subjectOneList: [], //一级分类列表
      subjectTwoList: [], //二级分类列表
      teacherList: [], //封装所有的讲师
      saveBtnDisabled: false, // 保存按钮是否禁用
      courseInfo: defaultForm,
      courseId: "",
      BASE_API: process.env.VUE_APP_BASE_API, //获取dev.env.js里面地址
    };
  },
  created() {
    this.init();
  },
  mounted() {},
  watch: {
    $route(to, from) {
      this.init();
    },
  },
  methods: {
    content(value) {},
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    handleAvatarSuccess({ data }) {
      this.courseInfo.cover = data.url;
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
    //初始化数据
    init() {
      if (this.$route.params && this.$route.params.id) {
        this.courseId = this.$route.params.id;
        //初始化课程
        this.getCourseInfo();
      } else {
        this.courseInfo = { ...defaultForm };
        //初始化所有讲师
        this.getListTeacher();
        //初始化一级分类
        this.getOneSubject();
      }
    },
    //获取课程
    getCourseInfo() {
      course.getCourseInfoById(this.courseId).then((response) => {
        this.courseInfo = response.data.courseInfo;
        //初始化一级分类
        subject.getSubjectList().then(({ data }) => {
          this.subjectOneList = data.subjectList;
          for (let i = 0; i < this.subjectOneList.length; i++) {
            if (this.subjectOneList[i].id === this.courseInfo.subjectParentId) {
              this.subjectTwoList = this.subjectOneList[i].children;
              break;
            }
          }
        });
        //初始化所有讲师
        this.getListTeacher();
      });
    },
    //保存课时
    saveCourse() {
      course.saveCourseInfo(this.courseInfo).then((response) => {
        this.$router.push({
          path: "/course/chapter/" + response.data.courseId,
        });
      });
    },
    //更新课时
    updateCourse() {
      course
        .updateCourseById(this.courseId, this.courseInfo)
        .then((response) => {
          this.$router.push({ path: "/course/chapter/" + this.courseId });
        });
    },
    //保存和更新操作
    saveOrUpdate() {
      if (this.$route.params && this.$route.params.id) {
        this.courseId = this.$route.params.id;
        this.updateCourse();
      } else {
        this.saveCourse();
      }
    },
  },
};
</script>

<style lang="css" scoped>
.tinymce-container {
  line-height: 29px;
}
</style>