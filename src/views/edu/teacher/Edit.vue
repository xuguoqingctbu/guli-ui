<template>
  <div>
    <h3>{{ isEdit ? "编辑讲师" : "添加讲师" }}</h3>
    <el-form label-width="120px">
      <el-form-item label="讲师id" v-if="isEdit">
        <el-input v-model.number="teacher.id" readonly />
      </el-form-item>
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name" />
      </el-form-item>

      <el-form-item label="讲师排序">
        <el-input-number
          v-model="teacher.sort"
          controls-position="right"
          :min="0"
        />
      </el-form-item>

      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <el-option :value="1" label="高级讲师" />
          <el-option :value="2" label="首席讲师" />
        </el-select>
      </el-form-item>

      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career" />
      </el-form-item>

      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea" />
      </el-form-item>

      <!-- 讲师头像：TODO -->
      <!-- 讲师头像 -->
      <el-form-item label="讲师头像">
        <!-- 头衔缩略图 -->
        <pan-thumb :image="teacher.avatar" />
        <!-- 文件上传按钮 -->
        <el-button
          type="primary"
          icon="el-icon-upload"
          @click="imagecropperShow = true"
          >更换头像
        </el-button>

        <!--
      v-show：是否显示上传组件
      :key：类似于id，如果一个页面多个图片上传控件，可以做区分
      :url：后台上传的url地址
      @close：关闭上传组件
      @crop-upload-success：上传成功后的回调 
        <input type="file" name="file"/>
      -->
        <image-cropper
          v-show="imagecropperShow"
          :width="300"
          :height="300"
          :key="imagecropperKey"
          :url="'/eduoss/admin1/oss/file/upload'"
          field="file"
          @close="close"
          @crop-upload-success="cropSuccess"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          :disabled="saveBtnDisabled"
          type="primary"
          @click="saveOrUpdate"
          >保存</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import * as teacher from "@/api/edu/teacher";
import ImageCropper from "@/components/ImageCropper";
import PanThumb from "@/components/PanThumb";
export default {
  name: "Edit",
  components: { ImageCropper, PanThumb },
  data() {
    return {
      teacher: {
        name: "",
        sort: 0,
        level: 1,
        career: "",
        intro: "",
        avatar: "",
      },
      saveBtnDisabled: false, // 保存按钮是否禁用,
      isEdit: false, //是否是编辑界面
      //上传弹框组件是否显示
      imagecropperShow: false,
      imagecropperKey: 0, //上传组件key值
    };
  },
  created() {
    this.init();
  },
  watch: {
    //监听
    $route(to, from) {
      //路由变化方式，路由发生变化，方法就会执行
      this.init();
    },
  },
  methods: {
    init() {
      //判断路径有id值,做修改
      // if (this.$route.query && this.$route.query.id) {
      if (this.$route.params && this.$route.params.id) {
        this.isEdit = true;
        //从路径获取id值
        const id = this.$route.params.id;
        this.getInfo(id);
        // this.teacher = this.$route.query.teacher;
      } else {
        //路径没有id值，做添加
        //清空表单
        this.isEdit = false;
        this.teacher = {
          avatar: "",
        };
      }
    },
    getInfo(id) {
      teacher.getTeacherById(id).then((response) => {
        const { data } = response;
        this.teacher = data.teacher;
      });
    },
    saveOrUpdate() {
      this.saveTeacher();
    },
    saveTeacher() {
      teacher.addTeacher(this.teacher).then((response) => {
        //提示信息
        this.$message({
          type: "success",
          message: "添加成功!",
        });
        //回到列表页面 路由跳转
        this.$router.push({ path: "/eduteacher/list" });
      });
    },
    cropSuccess(data) {
      //上传之后接口返回图片地址
    this.teacher.avatar =data.url;
    this.close();
    },
    close() {
      //关闭上传弹框的方法
      this.imagecropperShow = false;
      //上传组件初始化
      this.imagecropperKey = this.imagecropperKey + 1;
    },
  },
};
</script>

<style>
</style>