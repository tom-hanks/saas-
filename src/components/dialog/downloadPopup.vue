<template>
  <div id="download">
    <!-- 导出报表弹框 -->
    <el-dialog
      class="ediAwardDialog warn_dialog"
      title="导出报表"
      :visible.sync="childModel.showReportDialog"
      :before-close="handleClose"
    >
      <el-form :model="reportForm" :rules="reportRules" ref="reportForm" @submit.native.prevent>
        <el-form-item prop="radio2">
          <el-radio-group v-model="reportForm.radio2" @change="radio2change">
            <el-radio :label="1">导出至本地</el-radio>
            <el-radio :label="2">发送至自己邮箱</el-radio>
            <el-radio :label="3">发送至自己和上级邮箱</el-radio>
            <el-radio :label="4" class="customRadio">
              <el-input
                :disabled="reportForm.disabled"
                v-model="reportForm.input"
                @keyup.enter.native="addwaremails()"
                type="text"
                placeholder="自定义提醒：请填写要发送的邮箱且点击回车"
              ></el-input>
              <p class="eorrtip" v-if="reportForm.istextTip">{{reportForm.textTip}}</p>
              <el-button
                class="fr addbutton addEmli"
                :disabled="reportForm.disabled"
                title="请在选择当前项且在输入框内输入正确的邮箱地址点击增加"
                @click="addwaremails()"
              >增加</el-button>
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div class="add_emile">
        <p>
          <i>*</i>
          {{'已添加邮箱'}}
        </p>
        <div class="emile_list">
          <ul>
            <li
              v-for="(itememail,indexemail) in reportForm.waremails"
              :key="indexemail"
              :title="itememail"
            >
              {{itememail}}
              <i class="el-icon-close" @click="deleteemails(indexemail)"></i>
            </li>
          </ul>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="childClick">取 消</el-button>
        <el-button
          type="primary"
          :loading="loadingss"
          @click="loadingss?'':awardFormalertquery()"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { httpServer, apiSetting } from "../../assets/js/http.js";

export default {
  name: "download",
  components: {},
  props: {
    childModel: ""
  },
  data() {
    return {
      // 导出报表弹框---传给父组件的
      childData: {
        childshow: false
      },
      fatherSuccess: true, //发送成功通知父组件显示成功弹窗
      loadingss: false,
      reportForm: {
        radio2: "", // 单选按钮   选中的值
        disabled: true, //如果选择自定义才可以输入，
        input: "", //预警通知弹窗的input追加邮箱的相应绑定
        textTip: "",
        waremails: [], //弹窗输入邮箱数组
        istextTip: false
      },
      reportRules: {
        radio2: [
          {
            required: true,
            message: "请选择或填写预警通知的邮箱",
            trigger: "change"
          }
        ],
        mail: [
          {
            required: true,
            message: "*请输入邮箱地址",
            trigger: "change"
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
  filters: {},
  mounted() {
    //exportDailyReportSum
  },
  watch: {
    childModel: {
      deep: true, //深度监听
      handler(newVal, oldVal) {
        console.log("我是监听");
        this.reportForm = {
          radio2: "", // 单选按钮   选中的值
          disabled: true, //如果选择自定义才可以输入，
          input: "", //预警通知弹窗的input追加邮箱的相应绑定
          textTip: "",
          waremails: [], //弹窗输入邮箱数组
          istextTip: false
        };
        this.$nextTick(function() {
          //清除表单验证提示
          this.$refs["reportForm"].resetFields(); //重置红包表单验证
        });
      }
    }
  },
  methods: {
    //导出报表
    cancelearly() {
      this.showReportDialog = false;
    },
    handleClose() {
      this.loadingss = false;
      this.childModel.showReportDialog = false;
    },
    childClick() {
      // childByValue是在父组件on监听的方法
      // 第二个参数this.childValue是需要传的值
      // this.reportForm.istextTip = false;
      this.loadingss = false;
      this.$emit("childByValue", this.childData);
    },
    exportDailyReportSum() {
      console.log(this.reportForm.waremails);
      let getUrl = "";
      switch (this.childModel.routernName) {
        case "orderDetail":
          getUrl = apiSetting.exportDetails;
          break;
        case "exchangDataDetail":
          getUrl = apiSetting.exportDailyReportSum;
          break;
      }
      this.loadingss = true;
      httpServer(getUrl, {
        app_id: this.childModel.appId, //项目编号----父组件传过来的
        export_type: this.reportForm.radio2, //导出类型 1: 导出本地,直接下载, 2: 发送邮件至当前人, 3: 发送邮件到自己和自己上级, 4: 发送到自定义邮箱
        mails: this.reportForm.waremails //如果是自定义邮箱, 通过该属性接收
      })
        .then(response => {
          console.log("邮箱通知的接口");
          this.loadingss = false;
          // 发送成功
          if (response != "") {
            // 下载文件
            window.location.href = apiSetting.downLoadUrl.url + "/" + response;
          }
          this.$emit("childByfatherSuccess", this.fatherSuccess);

          // console.log(response);
        })
        .catch(error => {
          this.loadingss = false;
          console.log(error.status); //loading层关闭
        });
    },
    addwaremails() {
      //邮箱通知回车追加
      this.ischeckemail(this.reportForm.input);
    },
    //检测邮箱
    ischeckemail(textTip) {
      if (textTip != "") {
        var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
        var isok = reg.test(textTip);
        if (!isok) {
          this.reportForm.istextTip = true;
          this.reportForm.textTip = "邮箱格式不正确，请重新输入！";
          return false;
        } else {
          this.reportForm.waremails.push(this.reportForm.input);
          this.reportForm.input = "";
          this.reportForm.istextTip = false;
        }
      }
    },
    // 删除自定义名单
    deleteemails(index) {
      this.reportForm.waremails.splice(index, 1);
    },
    // 确定按钮
    awardFormalertquery() {
      // 先判断选择自定义的时候有没有输入邮箱
      if (this.reportForm.radio2 == 4) {
        if (this.reportForm.waremails.length <= 0) {
          this.reportForm.istextTip = true;
          this.reportForm.textTip = "请在上面输入框里输入正确邮箱，且点击回车";
          return false;
        }
      }
      this.$refs.reportForm.validate(valid => {
        //验证合格后执行
        if (valid) {
          // 修改后台资源预警
          this.reportForm.istextTip = false;
          this.exportDailyReportSum();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    radio2change() {
      console.log("导入--radio");
      console.log(this.reportForm.radio2);
      if (this.reportForm.radio2 == 4) {
        this.reportForm.disabled = false;
      } else {
        this.reportForm.disabled = true;
      }
    }
  }
};
</script>
<style scoped lang="less">
#download {
  .warn_dialog {
    .el-input {
      width: 305px;
    }
    .add_emile {
      width: 540px;
      background-color: #f5f5f5;
      border-radius: 6px;
      border: solid 1px #ebebeb;
      padding: 10px;
      margin-bottom: 20px;
      p {
        i {
          color: #ef444b;
          margin-right: 6px;
        }
        font-size: 12px;
      }
      .emile_list {
        ul {
          overflow: hidden;
          li {
            width: 183px;
            height: 30px;
            background-color: rgba(74, 0, 224, 0.05);
            border-radius: 6px;
            border: solid 1px rgba(215, 215, 215, 0.26);
            margin-right: 50px;
            float: left;
            margin-top: 10px;
            font-size: 12px;
            line-height: 30px;
            padding: 0px 30px 0px 5px;
            position: relative;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            .el-icon-close {
              position: absolute;
              font-size: 18px;
              top: 5px;
              right: 10px;
              color: #b9b4bc;
              cursor: pointer;
            }
          }
        }
      }
    }
  }
  .addEmli {
    width: 70px;
    position: absolute;
    right: -120px;
    top: 0px;
  }
}
</style>
<style lang="less">
#download {
  .warn_dialog {
    .el-radio {
      display: block;
      margin-left: 0px;
      margin-bottom: 20px;
    }
    .el-dialog__body {
      height: 265px;
      overflow-y: auto;
    }
    .customRadio {
      margin-bottom: 0px;
      .eorrtip {
        color: #f56c6c;
        font-size: 12px;
        margin-top: 5px;
        margin-left: 30px;
      }
    }
    .el-form-item__error {
      margin-left: 25px;
    }
    .el-input__inner {
      background-color: #ffffff;
      -webkit-box-shadow: inset 0px 2px 2px 0px rgba(215, 215, 215, 0.2);
      box-shadow: inset 0px 2px 2px 0px rgba(215, 215, 215, 0.2);
      border-radius: 6px;
      border: solid 1px #d7d7d7;
      font-size: 12px;
      text-indent: 0px;
    }
    .el-button.is-disabled {
      background-image: linear-gradient(41deg, #ffa200 0%, #ffcf00 100%);
      opacity: 0.5;
      color: #fff;
    }
  }
}
</style>

