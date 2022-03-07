<template>
  <div class="tinymce-box">
    <Editor
      id="tinymce"
      :inline="true"
      v-model="myValue"
      :init="init"
      :disabled="disabled"
      :plugins="plugins"
      :toolbar="toolbar"
      :tinymceScriptSrc="baseUrl + '/public/tinymce/js/tinymce.min.js'"
      @click="onClick"
    >
    </Editor>
  </div>
</template>

<script>
// 文档 http://tinymce.ax-z.cn/
// 引入组件
import tinymce from "tinymce/tinymce"; // tinymce默认hidden，不引入不显示
import Editor from "@tinymce/tinymce-vue";

// 引入富文本编辑器主题的js和css
import "tinymce/skins/content/default/content.css";
import "tinymce/themes/silver/theme.min.js";
import "tinymce/icons/default/icons"; // 解决了icons.js 报错Unexpected token '<'

// 编辑器插件plugins
// 更多插件参考：https://www.tiny.cloud/docs/plugins/
import "tinymce/plugins/image"; // 插入上传图片插件
import "tinymce/plugins/media"; // 插入视频插件
import "tinymce/plugins/table"; // 插入表格插件
import "tinymce/plugins/lists"; // 列表插件
import "tinymce/plugins/wordcount"; // 字数统计插件
import "tinymce/plugins/link";
import "tinymce/plugins/code";
import "tinymce/plugins/preview";
import "tinymce/plugins/fullscreen";
import "tinymce/plugins/help";
import "tinymce/plugins/save";
import "tinymce/themes/silver";
import "tinymce/plugins/contextmenu";
import "tinymce/plugins/colorpicker";
import "tinymce/plugins/textcolor";
import "tinymce/plugins/advlist";
import "tinymce/plugins/codesample";
import "tinymce/plugins/hr";
import "tinymce/plugins/textpattern";
import "tinymce/plugins/searchreplace";
import "tinymce/plugins/autolink";
import "tinymce/plugins/directionality";
import "tinymce/plugins/visualblocks";
import "tinymce/plugins/visualchars";
import "tinymce/plugins/template";
import "tinymce/plugins/charmap";
import "tinymce/plugins/nonbreaking";
import "tinymce/plugins/insertdatetime";
import "tinymce/plugins/imagetools";
import "tinymce/plugins/autosave";
import "tinymce/plugins/autoresize";
export default {
  components: {
    Editor,
  },
  name: "Tinymce",
  props: {
    // 默认的富文本内容
    value: {
      type: String,
      default: "",
    },
    // 基本路径，默认为空根目录，如果你的项目发布后的地址为目录形式，
    // 即abc.com/tinymce，baseUrl需要配置成tinymce，不然发布后资源会找不到
    baseUrl: {
      type: String,
      default: window.location.origin ? window.location.origin : "",
    },
    // 禁用
    disabled: {
      type: Boolean,
      default: false,
    },
    plugins: {
      type: [String, Array],
      default:
        "preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template code codesample table charmap hr nonbreaking insertdatetime advlist lists wordcount imagetools textpattern autosave  autoresize",
    },
    toolbar: {
      type: [String, Array],
      default:
        "code undo redo restoredraft | cut copy paste pastetext | forecolor backcolor bold italic underline strikethrough link codesample | alignleft aligncenter alignright alignjustify outdent indent formatpainter | \
    styleselect formatselect fontselect fontsizeselect | bullist numlist | blockquote subscript superscript removeformat | \
    table image media charmap hr pagebreak insertdatetime |fullscreen preview",
    },
  },
  data() {
    return {
      init: {
        selector: "#textarea",
        language_url: `${this.baseUrl}/tinymce/langs/zh_CN.js`,
        language: "zh_CN",
        skin_url: `${this.baseUrl}/tinymce/skins/ui/oxide`,
        // skin_url: 'tinymce/skins/ui/oxide-dark', // 暗色系
        convert_urls: false,
        height: 400,
        min_height: 300,
        max_height: 600,
        toolbar_mode: "wrap",
        // content_css（为编辑区指定css文件）,加上就不显示字数统计了
        //content_css: `${this.baseUrl}tinymce/skins/content/default/content.css`,
        // （指定需加载的插件）
        // plugins: this.plugins,
        // toolbar: this.toolbar, // （自定义工具栏）

        statusbar: true, // 底部的状态栏
        menubar: "file edit insert view format table tools help", // （1级菜单）最上方的菜单
        branding: false, // （隐藏右下角技术支持）水印“Powered by TinyMCE”
        // 此处为图片上传处理函数，这个直接用了base64的图片形式上传图片，
        // 如需ajax上传可参考https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_handler
        images_upload_handler: (blobInfo, success, failure) => {
          const img = "data:image/jpeg;base64," + blobInfo.base64();
          success(img);
        },
      },
      myValue: this.value,
    };
  },
  mounted() {
    tinymce.init({});
  },
  methods: {
    // 添加相关的事件，可用的事件参照文档=> https://github.com/tinymce/tinymce-vue => All available events
    // 需要什么事件可以自己增加
    onClick(e) {
      this.$emit("onClick", e, tinymce);
    },
    // 可以添加一些自己的自定义事件，如清空内容
    clear() {
      this.myValue = "";
    },
  },
  watch: {
    myValue(newValue) {
      this.$emit("input", newValue);
    },
    value(newValue) {
      this.myValue = newValue;
    },
  },
};
</script>
<style scoped>
</style>