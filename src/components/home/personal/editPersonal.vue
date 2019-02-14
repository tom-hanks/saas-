<template>
  <div id="editPersonal" v-loading="loading">
    <p class="content-title">
      <span class="content-last-title">编辑</span>
    </p>
    <div class="editPersonal_content">
      <p class="editPersonal_content_title">
        <span></span>编辑个人信息
      </p>
      <el-form
        :model="editPersonalForm"
        :rules="editPersonalRules"
        ref="editPersonalForm"
        label-width="100px"
        @submit.native.prevent
      >
        <el-form-item label="上传头像：" class="upHeaderImg">
          <el-upload
            class="avatar-uploader"
            :action="editPersonalForm.uploadUrl"
            :show-file-list="false"
            :on-success="handleLogoSuccess"
            :data="editPersonalForm.uploadParam"
          >
            <img v-if="editPersonalForm.LogoUrl" :src="editPersonalForm.LogoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <p class="upload_title">(
            <i class="red_star">*</i>建议上传尺寸60*60像素)
          </p>
          <div class="img_obscuration">更换头像</div>
        </el-form-item>
        <el-form-item label="账户名称：">{{personal.user_name}}</el-form-item>
        <el-form-item label="员工名称：">{{personal.real_name}}</el-form-item>
        <el-form-item label="性别：">
          <span v-if="personal.sex == 1">男</span>
          <span v-if="personal.sex == 2">女</span>
        </el-form-item>
        <el-form-item class="input_item passward_item" label="账户密码：" prop="passward">
          <el-input
            :disabled="isDisabled"
            type="password"
            v-model="editPersonalForm.passward"
            maxlength
            placeholder="请输入账户密码"
          ></el-input>
          <span class="edit_passward" @click="editPassFun">修改</span>
        </el-form-item>
        <el-form-item class="input_item" label="联系方式：" prop="phone">
          <el-input v-model="editPersonalForm.phone" maxlength placeholder="请输入联系方式"></el-input>
        </el-form-item>
        <el-form-item class="input_item" label="邮箱：" prop="Email">
          <el-input v-model="editPersonalForm.Email" maxlength placeholder="请输入邮箱"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <saas-dialog :html="html" v-if="showSaasDialog"></saas-dialog>
    <!-- 上一步   下一步 -->
    <div class="step-btn">
      <button class="last-step" @click="backFun">返回</button>
      <el-button class="next-btn" @click="submiteDitPersonalForm(editPersonalForm)">确定</el-button>
    </div>
  </div>
</template>
<script>
import { httpServer, apiSetting } from "../../../assets/js/http.js";
const saasDialog = () =>
  import(/* webpackChunkName:"dialog" */ "../../dialog/dialog");

export default {
  name: "editPersonal",
  props: {},
  components: {
    saasDialog
  },
  data() {
    return {
      loading: false,
      personal: {},
      showSaasDialog: false,
      editPersonalForm: {
        //上传头像
        uploadUrl: "http://oss.esurl.cn/api/images/UploadForSaas",
        LogoUrl: "",
        uploadParam: {
          pnum: "",
          uid: "",
          sign: "",
          ossPath: "",
          timestamp: ""
        },
        passward: "********",
        phone: "",
        Email: ""
      },
      isDisabled: true,
      editPersonalRules: {
        phone: [
          {
            required: true,
            message: "*请输正确的手机号码",
            trigger: "blur"
          },
          {
            pattern: /^1\d{10}$/,
            message: "*请输正确的手机号码",
            trigger: "blur"
          }
        ],
        passward: [
          { required: true, message: "*请输入账户密码", trigger: "blur" },
          {
            min: 8,
            max: 20,
            message: "长度在 8 到 20 位",
            trigger: "blur"
          }
        ],
        Email: [
          {
            required: true,
            message: "*请输入正确的邮箱地址",
            trigger: "blur"
          },
          {
            type: "email",
            message: "*请输入正确的邮箱地址",
            trigger: ["blur"]
          }
        ]
      }
    };
  },
  created() {
    // window.addEventListener("setItem", () => {
    //     //监听缓存
    //     if (this.$getsessionStorage("personalSuccess")) {
    //         this.getUser();
    //     }
    // });
  },
  mounted() {
    this.$eventBus.$on("eventBusName", val => {
      console.log("这个是用transimissiontwo的val值为：");
      console.log(val);
      if (val == "haole") {
        this.getUser();
      }
    });
    if (this.$getsessionStorage("personalSuccess")) {
      this.getUser();
    }
    this.getOssConfig();
  },
  methods: {
    //修改密码
    editPassFun() {
      this.isDisabled = false;
      this.editPersonalForm.passward = "";
    },
    //上传头像
    getOssConfig() {
      // 保存轮播图
      this.loading = true;
      httpServer(apiSetting.getOssConfig, {
        target: "middle_system"
      })
        .then(response => {
          // console.log("所有信息");
          // console.log(response);
          this.editPersonalForm.uploadParam.pnum = response.pnum;
          this.editPersonalForm.uploadParam.uid = response.uid;
          this.editPersonalForm.uploadParam.sign = response.sign;
          this.editPersonalForm.uploadParam.ossPath = response.oss_path;
          this.editPersonalForm.uploadParam.timestamp = response.timestamp;
          // console.log("所有信息");
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          console.log(error); //loading层关闭
        });
    },
    //上传成功
    handleLogoSuccess(response, file, fileList) {
      if (response.IsSuccess) {
        this.editPersonalForm.LogoUrl =
          response.ResultData.list[0].OriginImgUrl;
      }
    },
    getUser() {
      if (this.$getsessionStorage("personal")) {
        this.personal = this.$getsessionStorage("personal");
        this.editPersonalForm.LogoUrl = this.personal.head_img;
        this.editPersonalForm.phone = this.personal.phone;
        this.editPersonalForm.Email = this.personal.mail;
        //移除事件监听 以免消耗性能
        // window.addEventListener(
        //     "setItem",
        //     () => {
        //         if (this.$getsessionStorage("personalSuccess")) {
        //             this.getUser();
        //         }
        //     },
        //     false
        // );
        console.log(this.personal);
      }
    },

    //返回
    backFun() {
      this.$router.back(-1);
    },
    // 确定
    submiteDitPersonalForm(form) {
      this.$refs.editPersonalForm.validate(valid => {
        if (valid) {
          if (this.$getsessionStorage("personal")) {
            if (this.isDisabled == true) {
              this.editPersonalForm.passward = "";
            }
            httpServer(apiSetting.editUser, {
              id: this.$getsessionStorage("personal").id,
              user_name: this.$getsessionStorage("personal").user_name,
              password: this.editPersonalForm.passward,
              real_name: this.$getsessionStorage("personal").real_name,
              sex: this.$getsessionStorage("personal").sex,
              mail: this.editPersonalForm.Email,
              phone: this.editPersonalForm.phone,
              head_img: this.editPersonalForm.LogoUrl //头像
            })
              .then(response => {
                console.log(response);
                // 分配成功 提示
                this.html = "<p>修改成功</p>";
                this.showSaasDialog = true;
                let _this = this;
                let timer = setTimeout(() => {
                  _this.showSaasDialog = false;
                  this.$router.back(-1);
                }, 1000);
              })
              .catch(error => {
                this.loading = false;
                console.log(error); //loading层关闭
                this.html = "<p>" + error.data.message + "</p>";
                this.showSaasDialog = true;
                let _this = this;
                let timer = setTimeout(() => {
                  _this.showSaasDialog = false;
                }, 1000);
              });
          }
          console.log("成功");
        }
      });
    }
  },
  destroyed() {}
};
</script>
<style scoped lang="less">
#editPersonal {
  .editPersonal_content {
    width: 900px;
    min-height: 380px;
    padding: 20px;
    background-color: #ffffff;
    border-radius: 8px;
    border: solid 1px rgba(206, 206, 206, 0.46);
    margin-bottom: 20px;
    .editPersonal_content_title {
      margin-bottom: 20px;
      span {
        float: left;
        display: block;
        width: 4px;
        height: 14px;
        background-color: #5a0ae0;
        margin-right: 10px;
        margin-top: 3px;
      }
    }
    .upload_title {
      float: left;
      line-height: 20px;
      font-size: 12px;
      margin-top: 40px;
      color: #9ca0a6;
      margin-left: 10px;
    }
    .img_obscuration {
      width: 60px;
      height: 16px;
      background: rgba(0, 0, 0, 0.6);
      position: absolute;
      color: #fff;
      bottom: 0px;
      font-size: 12px;
      line-height: 16px;
      text-align: center;
    }
    .avatar-uploader {
      float: left;
    }
  }
}
</style>
<style lang="less">
#editPersonal {
  .el-upload {
    display: block;
    width: 60px;
    height: 60px;
    background-color: #d7d7d7;
    border-radius: 4px;
    img {
      display: block;
      width: 60px;
      height: 60px;
    }
  }
  .el-icon-plus {
    display: none;
  }
  .el-form-item {
    margin-bottom: 10px;
  }
  .input_item {
    margin-bottom: 15px;
  }
  .passward_item {
    .el-input {
      float: left;
      width: 300px;
    }
    .edit_passward {
      float: left;
      color: #00b4ff;
      text-decoration-line: underline;
      cursor: pointer;
    }
  }
  .el-input__inner {
    width: 280px;
    height: 32px;
    background-color: #ffffff;
    box-shadow: inset 0px 2px 2px 0px rgba(215, 215, 215, 0.2);
    border-radius: 6px;
    border: solid 1px #d7d7d7;
    text-indent: 0px;
    font-size: 12px;
  }
}
</style>
