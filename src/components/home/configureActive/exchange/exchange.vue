<template>
  <div id="exchange" v-loading="loading">
    <div class="content-box-pack">
      <P class="content-box-title">项目配置</P>
      <div class="content-box-form">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <div>
            <el-form-item label="项目编号" prop="numname">
              <el-input disabled v-model="ruleForm.numname" placeholder="请输入项目编号"></el-input>
            </el-form-item>
          </div>
          <div class="clearfix">
            <el-form-item class="fl" label="项目名称" prop="app_name">
              <el-input disabled v-model="ruleForm.app_name" placeholder="请输入项目名称"></el-input>
            </el-form-item>
            <el-form-item class="fl ml10" label="活动名称" prop="app_external_name" label-width="120px">
              <el-input v-model="ruleForm.app_external_name" placeholder="请输入活动名称"></el-input>
            </el-form-item>
          </div>
          <div class="clearfix">
            <el-form-item class="fl" label="项目负责人" prop="region">
              <!-- <el-select v-model="ruleForm.region" placeholder="请输入项目负责人">
                                <el-option label="区域一" value="shanghai"></el-option>
                                <el-option label="区域二" value="beijing"></el-option>
              </el-select>-->
              <el-cascader
                expand-trigger="hover"
                :options="options"
                v-model="ruleForm.selectedOptions"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
            <el-form-item class="fl ml10" label="运营/配置负责人" prop="real_name" label-width="120px">
              <el-input disabled v-model="ruleForm.real_name" placeholder="请输入运营负责人"></el-input>
            </el-form-item>
          </div>
          <el-form-item id="form_item_width" class="form_item_width time_input" label="项目周期">
            <el-date-picker
              v-model="timeArray"
              type="datetimerange"
              :clearable="false"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="setDateTime"
              :unlink-panels="unlinkpanels"
            ></el-date-picker>
          </el-form-item>
          <p class="moren_tip">
            <i>*</i>
            后台周期为:{{timeArrayCun[0]+'至'+timeArrayCun[1]}}
          </p>
          <!-- <el-form-item>
                        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
                        <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>-->
        </el-form>
      </div>
    </div>
    <!-- 上一步   下一步 -->
    <div class="step-btn">
      <button class="last-step" @click="prev">上一步</button>
      <el-button class="next-btn" :loading="loginContent.onColse" @click="setPage(ruleForm)">下一步</el-button>
    </div>
  </div>
</template>

<script>
import { httpServer, apiSetting } from "../../../../assets/js/http.js";
import page from "../../../../assets/js/page.js";
export default {
  name: "exchange",
  props: {
    stepModel: null
  },
  components: {},
  data() {
    return {
      unlinkpanels: true, //关闭时间选择的下拉框的联动
      // 是否选中
      isCheck: false,
      loading: true,
      appid: 0,
      ruleForm: {
        numname: "", //项目编号
        app_name: "", //项目名称
        app_external_name: "", //活动名称
        region: "", //项目负责人
        real_name: "", //运营负责人
        operator_id: 0, //运营的id
        selectedOptions: []
      },
      options: [],
      rules: {
        name: [
          {
            required: true,
            message: "请输入活动名称",
            trigger: "change"
          },
          {
            min: 3,
            max: 5,
            message: "长度在 3 到 5 个字符",
            trigger: "blur"
          }
        ],
        app_external_name: [
          {
            required: true,
            message: "*活动名称不能为空",
            trigger: "change"
          },
          {
            max: 50,
            message: "长度最多只能输入50个字",
            trigger: "change"
          }
        ],
        region: [
          {
            required: true,
            type: "array",
            validator: (rule, value, callback) => {
              // console.log(value);
              if (this.ruleForm.selectedOptions.length <= 0) {
                callback(new Error("请选择项目负责人"));
              } else {
                callback();
              }
            },
            trigger: "change"
          }
        ]
      },
      dataModel: {
        isshow: false,
        step: 1, //进入到兑奖平台的下一个步骤
        shownum: 1,
        homeShow: false, //首页要隐藏
        template_id: 0,
        appid: 0,
        type_ename: "exchange",
        typename: "兑换平台"
      },
      loginContent: {
        onColse: false,
        content: "登陆"
      },
      // timeArray: [
      //     new Date(2000, 10, 10, 10, 11),
      //     new Date(2000, 10, 11, 10, 10)
      // ],
      timeArrayCun: [],
      timeArray: [] //login_time   login_time时间
    };
  },
  created() {
    // if (this.stepModel.parameter) {
    //     this.appid = this.stepModel.parameter;
    // }
  },
  mounted() {
    this.appid = this.$getsessionStorage("appid");

    // if (this.stepModel.parameter) {
    //     this.appid = this.stepModel.parameter;
    // } else {
    //     this.appid = this.stepModel.appid;
    // }

    // console.log("jjjjj");
    // console.log(this.stepModel);
    // this.ruleForm.numname = this.stepModel.numname;
    // this.ruleForm.app_name = this.stepModel.app_name;
    // this.ruleForm.app_external_name = this.stepModel.app_external_name;
    // this.ruleForm.real_name = this.stepModel.real_name;
    this.getListnifo();
    console.log("父组建的参数");
    console.log(this.stepModel);
    // 三级联动
    httpServer(apiSetting.getDepart_user, {
      appId: this.appid
    })
      .then(response => {
        this.loading = false;
        // console.log("三级联动");
        this.options = response;
        response.forEach((value, index, array) => {
          if (value.select) {
            this.ruleForm.selectedOptions.push(value.value);
            value.children.forEach((value2, index, array) => {
              if (value2.select) {
                this.ruleForm.selectedOptions.push(value2.value);
                value2.children.forEach((value3, index, array) => {
                  if (value3.select) {
                    this.ruleForm.selectedOptions.push(value3.value);
                  }
                });
              }
              // console.log(this.selectedOptions);
            });
          }
        });
        // console.log(response);
        // this.selectedOptions = ["zujian", "data", "tag"];
      })
      .catch(error => {
        this.loading = false;
        console.log(error); //loading层关闭
      });
  },
  methods: {
    // goPage(id){
    //     this.$router.push({
    //         path: `/configureActive/exchange/${id}`,
    //     })
    // },
    handleChange(value) {
      //三级联动赋值
      if (
        this.ruleForm.selectedOptions[2] ==
        this.$getsessionStorage("personal").id
      ) {
        this.$message({
          message: "项目运营人员与负责人不能为同一人",
          duration: 1000
        });
        return false;
      }
      this.ruleForm.selectedOptions = value;

      console.log(this.ruleForm.selectedOptions[2]);
      console.log(this.$getsessionStorage("personal").id);
    },
    setDateTime: function() {
      // 时间选择器回调
      this.$setsessionStorage("onLineTime", this.timeArray[0]);
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    setPage(ruleForm) {
      // if (this.ruleForm.selectedOptions.length <= 0) {
      //     //判断有没有选择项目负责人
      //     this.$message({
      //         message: "请选择项目负责人",
      //         duration: 1000
      //     });
      //     return false;
      // }
      //触发验证
      this.$refs.ruleForm.validate(valid => {
        //验证合格后执行
        if (valid) {
          // 数组相等 说明没有改变时间选择器
          if (this.$arrayEqual(this.timeArray, this.timeArrayCun)) {
            if (this.timeArray[0] === this.timeArray[1]) {
              this.$message({
                message: "结束时间必须大于开始时间",
                duration: 1000
              });
              return false;
            }
            this.putstimet();
          } else {
            if (this.timeArray[0] === this.timeArray[1]) {
              this.$message({
                message: "结束时间必须大于开始时间",
                duration: 1000
              });
              return false;
            }
            //一旦时间改变，就给出弹窗提示
            this.stimet();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });

      // 提交
    },
    stimet() {
      this.$alert(
        "<p>当前所设项目周期与后台不符，活动审核成功后</br>将以当前所设时间为准</p>",
        "提示",
        {
          dangerouslyUseHTMLString: true,
          showCancelButton: true,
          showConfirmButton: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }
      )
        .then(() => {
          this.putstimet();
        })
        .catch(() => {
          console.log("不重新分配了");
        });
    },
    putstimet() {
      // console.log("看数组");
      // console.log(this.ruleForm.selectedOptions.length);
      this.loginContent.onColse = true;
      httpServer(apiSetting.putAppset, {
        id: this.appid,
        app_external_name: this.ruleForm.app_external_name,
        login_time: this.timeArray[0],
        logout_time: this.timeArray[1],
        user_id: this.ruleForm.selectedOptions[2],
        operator_id: this.ruleForm.operator_id
      })
        .then(response => {
          console.log("提交完成后的");
          console.log(response);
          if (response) {
            this.dataModel.isshow = true;
            this.dataModel.step = 3;
            this.dataModel.shownum = 2;
            this.dataModel.template_id = response; //模板id
            this.dataModel.appid = this.appid;
            this.dataModel.type_ename = "exchange";
            this.$emit("changeStep", this.dataModel); //传给父页面 home.vue 的changeStep方法
            if (this.$getsessionStorage("chooseName") == "directpurchase") {
              // this.$router.push({ name: "directBuyResouce" });
              this.$router.push({ name: "newConfigResouce" });
            } else if (this.$getsessionStorage("chooseName") == "exchange") {
              this.$router.push({ name: "configResouce" });
            }
            this.$setsessionStorage("template_id", response);
            // console.log(response);
          } else {
            this.loginContent.onColse = false;
            this.$message({
              message: "提交失败",
              duration: 1000
            });
          }
        })
        .catch(error => {
          this.loginContent.onColse = false;
          this.$message({
            message: error.data.message,
            duration: 1000
          });
          console.log(error); //loading层关闭
        });
    },
    getListnifo() {
      // 根据id获取基本信息
      httpServer(apiSetting.getAppinfoById, {
        appId: this.appid
      })
        .then(response => {
          // console.log("所有信息");
          this.ruleForm.numname = response.app_num;
          this.ruleForm.app_name = response.app_name;
          this.ruleForm.app_external_name = response.app_external_name;
          this.ruleForm.operator_id = response.operator_id;

          this.timeArray.push(response.login_time);
          this.timeArray.push(response.logout_time);
          this.timeArrayCun.push(response.login_time);
          this.timeArrayCun.push(response.logout_time);
          this.$setsessionStorage("onLineTime", response.login_time);
          //运营负责人有的时候就用有的，没有的时候就用缓存里的
          if (response.operator_id) {
            // alert('kljl')
            this.ruleForm.real_name = response.operation;
          } else {
            if (this.$getsessionStorage("personal")) {
              this.ruleForm.operator_id = this.$getsessionStorage(
                "personal"
              ).id;
            }
          }

          // console.log(response);
          // console.log("所有信息");
        })
        .catch(error => {
          this.loading = false;
          console.log(error); //loading层关闭
        });
    },
    prev() {
      this.$router.push({ name: "activehome" });
      // this.dataModel.isshow = false;
      // this.dataModel.homeShow = true;
      // this.dataModel.step = 1;
      // this.$emit("changeStep", this.dataModel); //传给父页面 home.vue 的changeStep方法
    }
  }
};
</script>

<style lang="less" scoped>
#exchange {
  margin-top: 22px;
  .content-box-pack {
    box-sizing: border-box;
    width: 900px;
    padding-top: 15px;
    padding-left: 17px;
    background-color: #ffffff;
    border-radius: 8px;
    border: solid 1px rgba(206, 206, 206, 0.46);
  }
  .content-box-title {
    font-family: PingFangSC-Semibold;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
    color: #393c40;
  }
  .content-box-form {
    margin-top: 20px;
  }
  .ml10 {
    margin-left: 30px;
  }

  ::-webkit-input-placeholder {
    /* WebKit, Blink, Edge */
    color: #aaaeb3;
    padding-left: 0;
  }
  :-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    color: #aaaeb3;
    padding-left: 0;
  }
  ::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    color: #aaaeb3;
    padding-left: 0;
  }
  :-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: #aaaeb3;
    padding-left: 0;
  }
  .moren_tip {
    margin-left: 97px;
    margin-top: -21px;
    margin-bottom: 16px;
    color: #ccc;
    font-size: 12px;
    i {
      color: red;
      margin-right: 4px;
    }
  }
}
</style>
<style>
#exchange .el-input--small .el-input__inner {
  width: 144px;
}
#exchange body .content .step-btn {
  margin-top: 40px;
}
#exchange .el-cascader-menus .el-cascader-menu__item {
  width: 170px;
}
#exchange .el-cascader-menu__item.is-active {
  color: #5608e0;
}
#exchange .ml10 .el-input__inner {
  width: 300px;
}
#exchange .el-form-item__label {
  height: 36px;
  line-height: 36px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  letter-spacing: 0px;
  color: #393c40;
}
#exchange .el-input__inner {
  width: 320px;
  height: 32px;
  line-height: 32px;
  background-color: #f1f1f1;
  border-radius: 6px;
  padding-left: 0;
  font-size: 12px;
}

#exchange .el-cascader-menus .el-cascader-menu__item {
  width: 170px;
}
#exchange .el-button [class*="el-icon-"] + span {
  margin-left: 0;
}
#exchange .el-cascader__label {
  font-size: 12px;
}
#exchange #form_item_width .el-form-item__content .el-input__inner {
  padding-left: 10px;
}
#exchange .el-form-item {
  margin-bottom: 18px;
}
#exchange .el-date-editor .el-range__close-icon {
  line-height: 26px;
}
#exchange .el-date-editor .el-range-input {
  background-color: #f1f1f1;
  font-size: 12px;
}
#exchange .el-date-editor .el-range-separator {
  line-height: 22px;
}
#exchange .el-date-editor .el-range__icon {
  line-height: 25px;
}
</style>
