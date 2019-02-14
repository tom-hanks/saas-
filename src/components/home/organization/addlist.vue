<template>
  <div id="addlist">
    <div class="addaccount" v-loading="loading" v-if="true">
      <el-form
        class="addlist_form"
        :rules="rules"
        :label-position="labelPosition"
        label-width="80px"
        :model="formLabelAlign"
        ref="formLabelAlign"
      >
        <el-form-item class="singularItem" label="账户名称" prop="user_name">
          <el-input v-model="formLabelAlign.user_name" :disabled="disable" placeholder="请输入账户名称"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input v-model="formLabelAlign.phone" maxlength="11" placeholder="请输入11位的手机号码"></el-input>
        </el-form-item>
        <el-form-item class="singularItem" id="password" label="账户密码" prop="password">
          <el-input type="password" v-model="formLabelAlign.password" placeholder="请输入账户密码"></el-input>
          <p class="moren_tip">*默认初始密码12345678</p>
        </el-form-item>
        <el-form-item label="邮箱" prop="mail">
          <el-input v-model="formLabelAlign.mail" placeholder="请输入邮箱地址"></el-input>
        </el-form-item>
        <el-form-item class="singularItem" label="员工名称" prop="real_name">
          <el-input v-model="formLabelAlign.real_name" placeholder="请输入员工名称"></el-input>
        </el-form-item>
        <el-form-item label="上传头像" prop="head_img" class="upHeaderImg">
          <el-upload
            class="avatar-uploader"
            :action="formLabelAlign.uploadUrl"
            :show-file-list="false"
            :on-success="handleLogoSuccess"
            :data="formLabelAlign.uploadParam"
          >
            <img v-if="formLabelAlign.headerUrl" :src="formLabelAlign.headerUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <p class="error_tip" v-if="isError">*请上传头像</p>
          <p class="upImgNotice">建议上传尺寸60*60像素</p>
        </el-form-item>
        <el-form-item class="singularItem" label="性别" prop="gender">
          <el-radio @change="changeGender" v-model="formLabelAlign.gender" label="1">男</el-radio>
          <el-radio @change="changeGender" v-model="formLabelAlign.gender" label="2">女</el-radio>
        </el-form-item>
      </el-form>
      <div class="step-btn">
        <!-- @click="prev" -->
        <button class="last-step" @click="prev">返回</button>
        <button class="next-btn" type="primary" @click="next(formLabelAlign)">下一步</button>
      </div>
    </div>
  </div>
</template>
<script>
import { httpServer, apiSetting } from "../../../assets/js/http.js";

export default {
  name: "addlist",
  props: {
    stepModel: null
  },
  data() {
    return {
      addlist: {
        isshow: false, //公共按钮隐藏
        isadd: true, //顶部步骤进度显示
        roleSetshow: false,
        step: 1,
        formLabelAlign: null, //为了把此组件的formLabelAlign传给父组件
        real_name: "",
        userid: ""
      },
      labelPosition: "right", //对齐方式
      formLabelAlign: {
        user_name: "", //账户名称
        password: "12345678", //账户密码
        head_img: "", //头像
        phone: "", //联系方式，手机号码，
        mail: "", //邮箱
        real_name: "", //员工名称
        gender: "", //性别
        // 上传头像
        uploadUrl: "http://oss.esurl.cn/api/images/UploadForSaas",
        uploadParam: {
          pnum: "",
          uid: "",
          sign: "",
          ossPath: "",
          timestamp: ""
        },
        // headerUrl: this.$getsessionStorage("personal")
        //     ? this.$getsessionStorage("personal").head_img
        //     : ""
        headerUrl: ""
      },
      loading: true,
      disable: false, //控制禁止输入
      rules: {
        //表单的验证规则
        user_name: [
          {
            required: true,
            message: "*请输入账户名称",
            trigger: "blur"
          },
          {
            pattern: /^[A-Za-z][A-Za-z0-9\._]+$|^[_.A-Za-z0-9]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
            message: "*请输入以字母开头或者邮箱格式的用户名"
          }
        ],
        gender: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value == 0) {
                return callback(new Error("请选择性别"));
              }
              callback();
            },
            trigger: "blur"
          }
        ],
        // head_img: [
        //     {
        //         required: true,
        //         validator: (rule, value, callback) => {
        //             console.log(rule)
        //             console.log(formLabelAlign.headerUrl)
        //             if (value == 0) {
        //                 return callback(new Error("请上传头像"));
        //             }
        //             callback();
        //         },
        //         trigger: "blur"
        //     }
        // ],
        password: [
          { required: true, message: "*请输入密码", trigger: "blur" },
          {
            min: 8,
            max: 20,
            message: "长度在 8 到 20 位",
            trigger: "blur"
          }
        ],
        phone: [
          {
            required: true,
            message: "*请输入11位纯数字的手机号码",
            trigger: "blur"
          },
          {
            min: 0,
            max: 11,
            message: "*请输入11位纯数字的手机号码",
            trigger: "blur"
          },
          {
            validator: (rule, value, callback) => {
              if (/^\d+$/.test(value) == false) {
                callback(new Error("*请输入11位纯数字的手机号码"));
              } else {
                callback();
              }
            },
            trigger: "change"
          },
          {
            pattern: /^1\d{10}$/,
            message: "*请输入11位纯数字的手机号码",
            trigger: "change"
          }
        ],
        mail: [
          {
            required: true,
            message: "*请输入邮箱地址",
            trigger: "blur"
          },
          {
            type: "email",
            message: "*请输入正确的邮箱地址",
            trigger: ["blur"]
          }
        ],
        real_name: [
          {
            required: true,
            message: "*请输入员工名称",
            trigger: "blur"
          },
          {
            min: 2,
            max: 4,
            message: "*中文名字 2 到 4 个字",
            trigger: "blur"
          },
          {
            validator: (rule, value, callback) => {
              //正则匹配中文
              if (/^[\u4e00-\u9fa5]+$/.test(value) == false) {
                callback(new Error("*名字只能输入中文"));
              } else {
                callback();
              }
            },
            trigger: "change"
          }
        ]
      },
      isError: false
    };
  },
  beforeCreate() {},
  mounted() {
    //    console.log('我是第一部')
    console.log(this.stepModel);

    this.addlist.userid = this.stepModel.userid;
    this.$emit("changeStep", this.addlist);
    if (this.stepModel.formLabelAlignxin) {
      this.formLabelAlign.user_name = this.stepModel.formLabelAlignxin.user_name;
      this.formLabelAlign.password = this.stepModel.formLabelAlignxin.password;
      this.formLabelAlign.phone = this.stepModel.formLabelAlignxin.phone;
      this.formLabelAlign.mail = this.stepModel.formLabelAlignxin.mail;
      this.formLabelAlign.real_name = this.stepModel.formLabelAlignxin.real_name;
      this.loading = false;
    }
    if (this.stepModel.userid) {
      //如果有id说明点击的是编辑需要请求最新数据
      //  获取当前id的用户信息
      httpServer(apiSetting.getUser, {
        user_id: this.stepModel.userid
      })
        .then(response => {
          console.log("东岳" + response.sex);
          console.log(response);
          this.formLabelAlign.user_name = response.user_name;
          this.formLabelAlign.password = "12345678";
          this.formLabelAlign.phone = response.phone;
          this.formLabelAlign.mail = response.mail;
          this.formLabelAlign.real_name = response.real_name;
          this.formLabelAlign.gender = response.sex.toString();
          this.formLabelAlign.headerUrl = response.head_img;
          this.disable = true;
          this.loading = false;
        })
        .catch(error => {
          // alert(error)
          this.loading = false;
          console.log(error); //loading层关闭
        });
    } else {
      this.formLabelAlign.gender = "1";
      this.formLabelAlign.headerUrl =
        apiSetting.urlossApi.url +
        "/SAAS/dev-personal/201811191723441bdd56d354ef4d0ba7e276dc29b633b4.png";
      this.loading = false;
    }
    this.getOssConfig();

    // if(this.stepModel.real_name){
    //   this.formLabelAlign.user_name=this.stepModel.real_name.user_name;
    //   this.formLabelAlign.password='12345678';
    //   this.formLabelAlign.phone=this.stepModel.real_name.phone;
    //   this.formLabelAlign.mail=this.stepModel.real_name.mail;
    //   this.formLabelAlign.real_name=this.stepModel.real_name.real_name;
    //   if(this.stepModel.real_name.user_name){
    //       this.disable=true;
    //   }
    // }else{
    //     this.formLabelAlign.user_name='';
    //     this.formLabelAlign.password='';
    //     this.formLabelAlign.phone='';
    //     this.formLabelAlign.mail='';
    //     this.formLabelAlign.real_name='';
    // }
  },
  methods: {
    // 获得oss图片上传参数
    getOssConfig() {
      // 保存轮播图
      this.loading = true;
      httpServer(apiSetting.getOssConfig, {
        target: "personal"
      })
        .then(response => {
          // console.log("所有信息");
          // console.log(response);
          this.formLabelAlign.uploadParam.pnum = response.pnum;
          this.formLabelAlign.uploadParam.uid = response.uid;
          this.formLabelAlign.uploadParam.sign = response.sign;
          this.formLabelAlign.uploadParam.ossPath = response.oss_path;
          this.formLabelAlign.uploadParam.timestamp = response.timestamp;
          // console.log("所有信息");
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          console.log(error); //loading层关闭
        });
    },
    // 头像上传成功的回调函数
    handleLogoSuccess(response, file, fileList) {
      if (response.IsSuccess) {
        this.formLabelAlign.headerUrl =
          response.ResultData.list[0].OriginImgUrl;
        this.formLabelAlign.head_img = response.ResultData.list[0].OriginImgUrl;
      }
    },
    next(formName) {
      //下一步

      //触发验证
      this.$refs.formLabelAlign.validate(valid => {
        if (this.formLabelAlign.headerUrl == "") {
          this.isError = true;
        } else {
          this.isError = false;
          if (valid) {
            //      console.log('我是第一部')
            // console.log(this.stepModel.userid)
            this.addlist.roleSetshow = true; //点击下一步 让 角色配置 显示，自己隐藏
            this.addlist.formLabelAlign = this.formLabelAlign;
            console.log("套路");
            console.log(this.formLabelAlign.headerUrl);
            // Object.assign(this.addlist.formLabelAlign,this.formLabelAlign)
            this.$emit("changeStep", this.addlist);
          } else {
            console.log("error submit!!");
            return false;
          }
        }
      });
    },
    prev() {
      this.addlist.isshow = true; //点击下一步 让 角色配置 显示，自己隐藏
      this.addlist.isadd = false;

      this.$emit("changeStep", this.addlist); //传给父页面 home.vue 的changeStep方法
    },
    //切换性别
    changeGender() {
      if (this.formLabelAlign.gender == 1) {
        this.formLabelAlign.headerUrl =
          apiSetting.urlossApi.url +
          "/SAAS/dev-personal/201811191723441bdd56d354ef4d0ba7e276dc29b633b4.png";
      } else {
        this.formLabelAlign.headerUrl =
          apiSetting.urlossApi.url +
          "/SAAS/dev-personal/201811191724334defc8d5c29246caaf4110f687cfb01b.png";
      }
    }
  }
};
</script>
<style scoped lang="less">
body .content .step-btn {
  margin-top: 40px;
}
body .content .step-btn .next-btn {
  width: 120px;
  height: 36px;
  background-image: linear-gradient(42deg, #8d2de2 0%, #4900e0 100%);
  box-shadow: 0px 2px 20px 0px rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  letter-spacing: 0px;
  color: #ffffff;
}
#addlist {
  margin-top: 18px;
}
.addlist_form {
  width: 880px;
  min-height: 250px;
  background-color: #ffffff;
  border-radius: 8px;
  border: solid 1px rgba(206, 206, 206, 0.46);
  padding-top: 30px;
  // margin: 30px 0px;
  // padding: 20px 0px 20px 0;
  padding-left: 5px;
  padding-bottom: 10px;
  // margin-top: 10px;
}

.singularItem {
  margin-left: 20px;
  margin-right: 80px;
}

#addlist #password {
  margin-bottom: 40px;
}

.moren_tip {
  margin-bottom: 18px;
  padding: 0px;
  font-size: 12px;
  line-height: normal;
  color: #ccc;
}
.upHeaderImg {
  width: 330px;
  position: relative;
}
.avatar-uploader {
  width: 60px;
  height: 60px;
  border-radius: 4px; // text-align: center;
  line-height: 60px;
  border: dashed 1px #aaaeb3;
  font-size: 24px;
  // margin-bottom: 20px;
  .avatar {
    display: block;
    width: 100%;
    height: 100%;
  }
}
.error_tip {
  font-size: 12px;
  color: #f56c6c;
}
.upImgNotice {
  position: absolute;
  color: #9ca0a6;
  font-size: 12px;
  left: 70px;
  bottom: -30px;
  span {
    color: red;
  }
}
</style>
<style>
#addlist .organization_content {
}
#addlist .el-input__inner {
  width: 280px;
  height: 32px;
  background-color: #efefef;
  border-radius: 4px;
  font-size: 12px;
  padding-left: 0;
}
#addlist .el-form-item {
  margin-bottom: 20px;
  height: 32px;
  line-height: 32px;
  float: left;
}
#addlist .el-form-item__label {
  height: 32px;
  line-height: 32px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  padding-right: 11px;
  letter-spacing: 0px;
  color: #393c40;
}
#addlist .el-form-item__content {
  margin-left: 68px;
  height: 32px;
  line-height: 32px;
}
#addlist .avatar-uploader .el-upload {
  width: 100%;
  height: 100%;
}
#addlist #password .el-form-item__error {
  top: 145%;
}
</style>

