<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>
    <el-steps
      :active="2"
      simple
      align-center
      process-status="wait"
      style="margin-bottom: 40px"
    >
      <el-step title="填写课程基本信息" icon="el-icon-edit"></el-step>
      <el-step title="创建课程大纲" icon="el-icon-upload"></el-step>
      <el-step title="最终发布" icon="el-icon-picture"></el-step>
    </el-steps>

    <el-button type="text" @click="openChapterDialog()">添加章节</el-button>
    <!-- 章节 -->
    <ul class="chapterList">
      <li v-for="chapter in chapterList" :key="chapter.id">
        <div class="chapterContent" @click.stop>
          {{ chapter.title }}
          <span class="acts">
            <el-button style="" type="text" @click="openVideo(chapter.id)"
              >添加小节</el-button
            >
            <el-button style="" type="text" @click="openEditChatper(chapter.id)"
              >编辑</el-button
            >
            <el-button type="text" @click="removeChapter(chapter.id)"
              >删除</el-button
            >
          </span>
        </div>
        <ul class="chapterList videoList">
          <li v-for="video in chapter.children" :key="video.id">
            <p>
              {{ video.title }}
              <span class="acts">
                <el-button style="" type="text" @click="openEditVideo(video.id)"
                  >编辑</el-button
                >
                <el-button type="text" @click="removeVideo(video.id)"
                  >删除</el-button
                >
              </span>
            </p>
          </li>
        </ul>
      </li>
    </ul>

    <el-form label-width="120px">
      <el-form-item>
        <el-button @click="previous">上一步</el-button>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next"
          >下一步</el-button
        >
      </el-form-item>
    </el-form>

    <!-- 添加和修改章节表单 -->
    <el-dialog
      :visible.sync="dialogChapterFormVisible"
      :title="chapter.id ? '修改章节' : '添加章节'"
    >
      <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model.trim="chapter.title" />
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number
            v-model.number="chapter.sort"
            :min="0"
            controls-position="right"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加和修改小节表单 -->
    <el-dialog
      :visible.sync="dialogVideoFormVisible"
      :title="video.id ? '修改小节' : '添加小节'"
    >
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model.trim="video.title" />
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number
            v-model.number="video.sort"
            :min="0"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.isFree">
            <el-radio :label="1">免费</el-radio>
            <el-radio :label="0">默认</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传视频">
          <el-upload
            :on-success="handleVodUploadSuccess"
            :on-remove="handleVodRemove"
            :before-remove="beforeVodRemove"
            :on-exceed="handleUploadExceed"
            :file-list="fileList"
            :action="BASE_API + '/eduvideo/vod/video/upload'"
            :limit="1"
            class="upload-demo"
          >
            <el-button size="small" type="primary">上传视频</el-button>
            <el-tooltip placement="right-end">
              <div slot="content">
                最大支持1G，<br />
                支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br />
                GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br />
                MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br />
                SWF、TS、VOB、WMV、WEBM 等视频格式上传
              </div>
              <i class="el-icon-question" />
            </el-tooltip>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button
          :disabled="saveVideoBtnDisabled"
          type="primary"
          @click="saveOrUpdateVideo"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as chapter from "@/api/edu/chapter";
import * as video from "@/api/edu/video";
import * as vod from "@/api/edu/vod";
export default {
  name: "CourseChapter",

  data() {
    return {
      courseId: "",
      saveVideoBtnDisabled: false,
      saveBtnDisabled: false, // 保存按钮是否禁用,
      chapterList: [],
      chapter: {
        //封装章节数据
        title: "",
        sort: 0,
      },
      video: {
        title: "",
        sort: 0,
        isFree: 0,
        videoSourceId: null,
        videoOriginalName: null, //视频名称
      },
      dialogChapterFormVisible: false,
      dialogVideoFormVisible: false, //小节弹框
      fileList: [], //上传文件列表
      BASE_API: process.env.VUE_APP_BASE_API, //获取dev.env.js里面地址
    };
  },
  created() {
    this.init();
  },
  mounted() {},
  methods: {
    //初始化
    init() {
      if (this.$route.params && this.$route.params.id) {
        this.courseId = this.$route.params.id;
        this.getChapterVideo();
      }
    },
    //获取所有的章节
    getChapterVideo() {
      chapter.getChapterAndVideoByCourseId(this.courseId).then(({ data }) => {
        this.chapterList = data.chapterVideoList;
      });
    },
    previous() {
      this.$router.push({ path: "/course/info/" + this.courseId });
    },
    next() {
      this.$router.push({ path: "/course/publish/" + this.courseId });
    },

    //==============================章节操作====================================
    //修改章节
    //添加章节
    openChapterDialog() {
      this.dialogChapterFormVisible = true;
      this.chapter = {
        title: "",
        sort: 0,
      };
    },
    updateChapter() {
      chapter.updateChapter(this.chapter).then(({ data }) => {
        //关闭弹框
        this.dialogChapterFormVisible = false;
        //提示更新成功
        //提示
        this.$message({
          type: "success",
          message: "修改章节成功!",
        });
        //刷新页面
        this.getChapterVideo();
      });
    },
    //保存章节
    saveChapter() {
      //设置课程id到chapter对象里面
      this.chapter.courseId = this.courseId;
      chapter.addChapter(this.chapter).then(({ data }) => {
        //关闭弹框
        this.dialogChapterFormVisible = false;
        //提示
        this.$message({
          type: "success",
          message: "添加章节成功!",
        });
        //刷新页面
        this.getChapterVideo();
      });
    },
    //保存和更新
    saveOrUpdate() {
      if (this.chapter.id) {
        this.updateChapter();
      } else {
        this.saveChapter();
      }
    },
    //打开编辑章节
    openEditChatper(chapterId) {
      //弹框
      this.dialogChapterFormVisible = true;
      chapter.getChapterById(chapterId).then(({ data }) => {
        this.chapter = data.chapter;
      });
    },
    //删除章节
    removeChapter(chapterId) {
      this.$confirm("此操作将删除章节, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        //点击确定，执行then方法
        //执行删除方法
        chapter.deleteChapter(chapterId).then(({ data }) => {
          //提示信息
          this.$message({
            type: "success",
            message: "删除章节成功!",
          });
          //刷新页面
          this.getChapterVideo();
        });
      });
    },
    //==============================小节操作====================================
    //添加小节
    openVideo(chapterId) {
      //打开弹窗
      this.dialogVideoFormVisible = true;
      this.fileList = [];
      (this.video = {
        title: "",
        sort: 0,
        isFree: 0,
        videoSourceId: "",
        videoOriginalName: "", //视频名称
      }),
        (this.video.chapterId = chapterId);
    },

    saveOrUpdateVideo() {
      if (this.video.id) {
        this.updateVideo();
      } else {
        this.saveVideo();
      }
    },
    //保存小节
    saveVideo() {
      this.video.courseId = this.courseId;
      console.log(this.video);
      video.addVideo(this.video).then(({ data }) => {
        //关闭弹框
        this.dialogVideoFormVisible = false;
        //提示
        this.$message({
          type: "success",
          message: "添加小节成功!",
        });
        //刷新页面
        this.getChapterVideo();
      });
    },
    //更新小节
    updateVideo() {
      video.updateVideo(this.video).then(({ data }) => {
        //关闭弹框
        this.dialogVideoFormVisible = false;
        //提示
        this.$message({
          type: "success",
          message: "修改小节成功!",
        });
        //刷新页面
        this.getChapterVideo();
      });
    },
    //删除小节
    removeVideo(videoId) {
      this.$confirm("此操作将删除小节, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        //点击确定，执行then方法
        //执行删除方法
        video.deleteVideo(videoId).then(({ data }) => {
          //提示信息
          this.$message({
            type: "success",
            message: "删除小节成功!",
          });
          //刷新页面
          this.getChapterVideo();
        });
      });
    },
    openEditVideo(videoId) {
      //弹框
      this.fileList = [];
      this.dialogVideoFormVisible = true;
      video.getVideoById(videoId).then(({ data }) => {
        this.video = data.video;
        if (this.video.videoOriginalName != "" && this.video.videoOriginalName!=null) {
          this.fileList = [{ name: this.video.videoOriginalName }];
        } else {
          this.fileList = [];
        }
      });
    },

    //==============================视频上传操作====================================
    //成功回调
    handleVodUploadSuccess({ data }, file, fileList) {
      //上传成功打开保存按钮
      this.saveVideoBtnDisabled = false;
      //上传视频id赋值
      this.video.videoSourceId = data.videoId;
      //上传视频名称赋值
      this.video.videoOriginalName = file.name;
    },
    //删除视频
    handleVodRemove(file,fileList) {
      this.saveVideoBtnDisabled = true;
      if (file == null || file.name == "" ||this.video.videoSourceId =="" ||this.video.videoSourceId==null) {
        return;
      }
      //调用接口的删除视频的方法
      vod.deleteAliyunvod(this.video.videoSourceId).then(({ data }) => {
        //删除成功 提示删除成功
        this.$message({
          type: "success",
          message: "删除小节视频成功!",
        });
        //把文件列表清空
        this.fileList = [];
        //把video视频id和视频名称值清空
        //上传视频id赋值
        this.video.videoSourceId = "";
        //上传视频名称赋值
        this.video.videoOriginalName = "";
        //删除成功保存按钮打开
        this.saveVideoBtnDisabled = false;
      });
    },
    //删除视频之前，确认提示信息
    beforeVodRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    //视图上传多于一个视频
    handleUploadExceed(files, fileList) {
      this.$message.warning("想要重新上传视频，请先删除已上传的视频");
    },
  },
};
</script>

<style scoped>
.chapterList {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
}
.chapterList li {
  position: relative;
}
.chapterContent {
  position: relative;
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  z-index: 10;
  width: 100%;
  border: 1px solid #ddd;
}
.acts {
  position: relative;
  float: right;
  font-size: 20px;
}

.videoList {
  position: relative;
  padding-left: 50px;
}
.videoList p {
  position: relative;
  float: left;
  z-index: 10;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #ddd;
}
</style>