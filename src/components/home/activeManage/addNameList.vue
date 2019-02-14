<template>
  <div id="addNameList">
    <p class="content-title">
      <span>我的活动</span>
      <i class="el-icon-arrow-right content-title-jiantou"></i>
      <span>活动管理</span>
      <i class="el-icon-arrow-right content-title-jiantou"></i>
      <span class="content-last-title">添加名单</span>
    </p>
    <div class="addNameList_content">
      <div class="write_news">
        <p class="active_name" v-show="appDetaildata.app_name">
          <span></span>
          {{appDetaildata.app_name}}
        </p>
        <el-form
          :model="nameListFormResources"
          :rules="nameListRule"
          ref="nameListFormResources"
          label-width="80px"
        >
          <el-form-item class="select_resouce" label="选择资源" prop="selectResouce">
            <el-select
              v-model="nameListFormResources.mid_material_allot_id"
              placeholder="请选择资源"
              @change="changeResources"
            >
              <el-option
                v-for="(item,index) in nameListFormResources.resouceItem"
                :key="index"
                :label="item.material_name"
                :value="item.mid_material_allot_id"
              ></el-option>
              <!-- <el-option label="资源二" value="2"></el-option>
              <el-option label="资源三" value="3"></el-option>-->
            </el-select>
          </el-form-item>
          <el-form-item class="residue_num">
            <p>剩余数量：{{surplus_count}}</p>
          </el-form-item>
          <el-form-item class="guideName">
            <div class="download">
              <a :href="getDownload" target="view_window">模版下载</a>
            </div>
            <div class="upBtn">
              <el-upload
                class="upload-demo"
                ref="upload"
                :action="UploadUrl()"
                :headers="headers"
                :data="uploadParam"
                :on-change="upChange"
                :on-success="uploadSuccess"
                :on-error="uploaderror"
                :before-upload="beforeAvatarUpload"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                :showFileList="false"
              >
                <el-button slot="trigger" size="small" :loading="loadingloader" type="primary">导入名单</el-button>
              </el-upload>
            </div>
          </el-form-item>
          <el-form-item class="select_resouce" label="发放形式" prop="grant">
            <el-select
              v-model="nameListFormResources.grant"
              style="height:0"
              :disabled="zichongDisabled"
              placeholder="平台码发放"
              @change="changeDistribution"
            >
              <el-option label="平台码发放" value="1"></el-option>
              <el-option label="原始码发放" value="2"></el-option>
              <el-option v-if="zichongDisabled" label="直接充值" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发放时间" prop="grantTime" class="grantTime">
            <el-date-picker
              v-model="nameListFormResources.grantTime"
              :default-value="valuePostponeTime"
              type="datetime"
              placeholder="选择日期时间"
              @change="setDateTime"
              format="yyyy-MM-dd HH:mm:ss"
              :picker-options="pickerOptions0"
              value-format="yyyy-MM-dd HH:mm:ss"
              default-time="12:00:00"
            ></el-date-picker>
          </el-form-item>
          <el-form-item class="apply_reason" label="申请理由">
            <div class="apply_reason_btn" @click="fillReasonFun">
              <span class="reason_btn_cla" v-if="applyForm.reason">{{applyForm.reason}}</span>
              <span v-if="!applyForm.reason">
                <i></i> 填写理由
              </span>
            </div>
          </el-form-item>
          <!-- 原始码不能有有效时长 -->
          <el-form-item
            class="xiao_time"
            v-if="nameListFormResources.grant != 2"
            label="有效时长"
            prop="time"
          >
            <template>
              <el-input-number
                v-model="nameListFormResources.time"
                @change="handleChange"
                :min="1"
                label="天"
              ></el-input-number>
              <span>天</span>
            </template>
          </el-form-item>
          <el-button
            class="fr addbutton addPartment"
            title="增加"
            v-if="!addstate"
            :loading="addloading"
            @click="addloading == false?submitResouceForm():''"
            icon="el-icon-addPlus"
          >增加</el-button>
          <el-button
            class="fr addbutton noaddPartment"
            title="增加"
            :disabled="true"
            v-if="addstate"
            icon="el-icon-addPlus"
          >增加</el-button>
        </el-form>
      </div>
      <div class="batchList" v-if="batchData">
        <ul>
          <li
            v-for="(item,index) in batchData"
            :key="index"
            :class="batchDataSelcet == index?'new_add':''"
            @click="changebatchData(index,item.id,item.audit_status,item.mid_material_allot_id)"
          >
            <i
              v-if="batchDataSelcet !== 0 && batchDataSelcet==1 && (item.audit_status == 30||item.audit_status == 5)"
              @click="deleteDirectBatch"
            ></i>
            {{item.name}}
            <span v-if="item.audit_status ==5">:待提交审核</span>
            <span v-if="item.audit_status ==10">:待审核</span>
            <span v-if="item.audit_status ==30">:已驳回</span>
          </li>
          <!-- <li>全部</li>
                    <li>批次1</li>
                    <li>批次2</li>
          <li class="new_add"><i></i> 批次3</li>-->
        </ul>
      </div>
      <div v-loading="loadingbottom">
        <div class="resouce_news">
          <div class="grant_num">
            <i></i>
            发放人员数量：{{batchDataTop.user_count}}
          </div>
          <div class="grant_resouce">
            <i></i>
            发放资源数量：{{batchDataTop.material_count}}
          </div>
          <div class="grant_time" v-if="batchDataSelcet">
            <i></i>
            发放时间：{{batchDataTop.release_time}}
          </div>
          <div class="activeAllot_box_search">
            <i class="el-icon-close" v-if="seachclick_close" @click="seachclick(0)"></i>
            <input
              @keyup.13="seachValue?seachclick():''"
              v-model="seachValue"
              type="text"
              placeholder="请输入姓名或手机号"
              @input="seachValue==''?seachclick_close=false:seachclick_close=true"
            >
            <span class="seach" @click="seachValue?seachclick():''">搜索</span>
          </div>
        </div>
        <div class="table">
          <table class="resouce_table_list" border="0" cellspacing="0" cellpadding="0">
            <thead>
              <tr class="resouce_table_title">
                <th>序号</th>
                <th>姓名</th>
                <th>手机号</th>
                <th v-if="uploadParam.grant_type !=3">发放数量</th>
                <th v-if="uploadParam.grant_type == 3">发放金额</th>
                <th>批次</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item,index) in itemList" :key="index" class="resouce_table_item">
                <td>{{item.serial_no}}</td>
                <td>{{item.name}}</td>
                <td>{{item.mobile}}</td>
                <td>{{item.user_count}}</td>
                <td>{{item.batch_name}}</td>
              </tr>
            </tbody>
          </table>
          <p class="nodata_tip" v-if="!nodata_tip">暂无数据</p>
        </div>
      </div>
    </div>
    <!-- itemListloading判断是为了阻止分页点击过快做成的bug,注意下面还有样式 -->
    <el-pagination
      :style="!no_data&&itemListloading==true?'visibility:visible':'visibility:hidden'"
      :class="itemListloading?'el-paginationshow':'el-paginationhide'"
      v-on:size-change="page.changeSize"
      v-on:current-change="page.gotoPage"
      :current-page="page.pageIndex"
      :page-sizes="page.pageSizeList"
      :page-size="page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.total"
    ></el-pagination>
    <!-- 上一步   下一步 -->
    <div class="step-btn">
      <button class="last-step" @click="prev">返回</button>
      <button class="next-btn" v-if="sendpreview" @click="preview()">发送审核</button>
    </div>
    <!-- 填写申请理由 -->
    <el-dialog class="editNoteDialog" title="填写申请理由" :visible.sync="showAppllyDialog">
      <el-form :model="applyForm" :rules="applyRules" ref="applyForm" @submit.native.prevent>
        <el-form-item prop="textOne" label="申请理由">
          <el-input
            type="textarea"
            v-model="applyForm.reason"
            auto-complete="off"
            maxlength
            placeholder="请输入申请理由"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAppllyDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitAppllyForm()">确 定</el-button>
      </div>
    </el-dialog>
    <saas-dialog :html="html" v-if="showSaasDialog"></saas-dialog>
  </div>
</template>
<script>
import { httpServer, apiSetting } from "../../../assets/js/http.js";
import page from "../../../assets/js/page.js";
const saasDialog = () =>
  import(/* webpackChunkName:"dialog" */ "../../dialog/dialog");
export default {
  name: "addNameList",
  props: {},
  components: {
    saasDialog
  },
  data() {
    return {
      cun_id: "", //记录table的id 给分页用
      appDetaildata: "", //项目详情
      zichongDisabled: false, //直充不允许选择发放类型
      surplus_count: 0, //已使用资源的剩余数量
      record_count: "", //记录增加够选择的是哪个资源
      states: 90, //状态
      uploadBooler: false,
      stateArry: [],
      getDownload: apiSetting.getDownload.url, //Excel模板下载
      loadingbottom: true, //表格的loading
      showSaasDialog: false, //导入成功后的提示
      // 填写理由弹框
      showAppllyDialog: false,
      sendpreview: false, //发送审核的显示隐藏
      applyForm: {
        reason: ""
      },
      applyRules: {},
      // 是否有数据
      nodata_tip: false,
      page: page,
      itemListloading: true, //如果列表正在请求中分页就不能触发，不然会有bug
      seachclick_close: false, //主页的搜索按钮叉号
      isclickshow: false, //tab事件控制
      itemList: [],
      seachValue: "",
      no_data: false,
      nameListFormResources: {
        selectResouce: "",
        resouceItem: "",
        material_type_id: "", //资源类型id
        mid_material_allot_id: "", //项目资源分配id
        grant: "1", // 发放形式 平台grant=1，原始grant=2
        grantTime: "",
        time: "30"
      },
      addloading: false,
      addstate: false, //通过驳回或待审核判断是否可以继续添加
      audit_status: 0, //记录驳回或待审核
      uploadParam: {
        app_id: "",
        template_id: "",
        material_id: "",
        material_type_id: "",
        grant_type: "",
        validityday: ""
      },
      batchData: [], //批次获取后的对象
      batchDataTop: {
        user_count: "", //发放人员数量
        material_count: "", //发放资源数量
        release_time: "" //发放时间
      },
      batchDataSelcet: 0, //0代表全部
      batchDataSelcetId: 0, //批次id
      pickerOptions0: {
        //   必须大于等于当前时间 不带 - 8.64e7是选不了今天的
        disabledDate(time) {
          return time.getTime() <= Date.now() - 8.64e7;
        }
      }, //为了限制选择日期
      valuePostponeTime: "",
      loadingloader: false,
      nameListRule: {
        selectResouce: [
          {
            required: true,
            message: "请选择资源",
            trigger: "change"
          }
        ],
        grantTime: [
          {
            required: true,
            message: "请选择发放时间",
            trigger: "blur"
          }
        ],
        time: [
          {
            required: true,
            message: "请选择有效时长",
            trigger: "change"
          }
        ]
      }
    };
  },
  created() {},
  mounted() {
    this.getAppdetailTop(); //获取项目详情
    this.getUseMaterialByAppId(); //获取资源列表
    let $emit = this;
    this.page.pageIndex = 1;
    $emit.page.pageSize = 30; //修改每页显示数
    $emit.page.pageSizeList = [30, 60, 90]; //修改可以下拉框选择的每页显示数
    // this.getDirectUserListClik();
    this.getdatatime(); //获取此刻的时间
    //分页调用的获取列表方法
    $emit.page.query = function() {
      if ($emit.itemListloading) {
        $emit.getDirectUserListClik($emit.cun_id);
        this.itemList = [];
        $emit.itemListloading = false; //以防分页点击过快的flag节流阀
      }
    };
    apiSetting.getDirectUserList.page = this.page; //api接口分页赋值
    apiSetting.getDirectUserList.dataList = this.dataList; //api分页数据赋值
    // 导入名单需要传入的id
    this.uploadParam.template_id = this.$getsessionStorage("template_id");
    this.uploadParam.app_id = this.$getsessionStorage("appid");
    // this.createDirectBatch().then(data => {
    //     console.log("请求成功后的操作");
    //     this.record_count = this.nameListFormResources.selectResouce;
    //     console.log(this.record_count);
    //     //后面可以用传过来的数据做些其他操作
    //     //......
    // });
  },
  computed: {
    headers() {
      return {
        Authorization: "Bearer " + this.getCookie("Authorization")
      };
    }
  },
  methods: {
    // 获取名称
    getAppdetailTop() {
      httpServer(apiSetting.appDetailTop, {
        appId: this.$getsessionStorage("appid"),
        template_id: this.$getsessionStorage("template_id")
      })
        .then(response => {
          this.appDetaildata = response;
          console.log(response);
        })
        .catch(error => {
          this.loading = false;
        });
    },
    getdatatime() {
      this.ct_month = new Date();
      //   this.ct_month.setTime(this.ct_month.getTime() - 3600 * 1000 * 24 * 30); //获取上个月的日期（这一行去掉就是获取今天计算机上的日期了）
      var now = this.ct_month;
      var year = now.getFullYear(); //年
      var month = now.getMonth() + 1; //月
      var day = now.getDate(); //日

      var hh = now.getHours(); //时
      var mm = now.getMinutes(); //分

      var clock = year + "-";

      if (month < 10) {
        clock += "0";
      }

      clock += month + "-";

      if (day < 10) {
        clock += "0";
      }

      clock += day + " ";

      if (hh < 10) {
        clock += "0";
      }

      clock += hh + ":";
      if (mm < 10) {
        clock += "0";
      }
      clock += mm;
      this.valuePostponeTime = clock;
    },
    //已使用资源
    getUseMaterialByAppId() {
      return new Promise((resolve, reject) => {
        httpServer(apiSetting.getUsedirectUser, {
          app_id: this.$getsessionStorage("appid")
        })
          .then(response => {
            console.log("已使用资源");
            console.log(response[0]);
            if (!this.record_count) {
              if (response.length > 0) {
                this.nameListFormResources.selectResouce =
                  response[0].material_id;
                this.nameListFormResources.material_type_id =
                  response[0].material_type_id;
                this.nameListFormResources.mid_material_allot_id =
                  response[0].mid_material_allot_id;
                this.surplus_count = response[0].surplus_count;
                resolve("随便什么数据1");

                this.uploadParam.material_id = response[0].material_id;
                this.uploadParam.material_type_id =
                  response[0].material_type_id;
                this.uploadParam.grant_type = this.nameListFormResources.grant;
                this.uploadParam.validityday = this.nameListFormResources.time; //有效时长
                console.log("我会资源");
                if (response[0].type_ename == "zichong") {
                  if (response[0].grant_type == 1) {
                    this.nameListFormResources.grant = "1";
                  } else {
                    this.nameListFormResources.grant = "3";
                  }
                  this.zichongDisabled = true;
                }
                this.uploadParam.grant_type = response[0].grant_type; //为了让后台区分是直接发放 还是其他资源（关乎到上传Excel上传他们要判断）
                this.getDirectBatchList();
              }
            } else {
              response.forEach((value, index, array) => {
                console.log(value);
                console.log(index);
                console.log(this.record_count);
                console.log(array[index].material_id);
                if (array[index].material_id == this.record_count) {
                  this.nameListFormResources.selectResouce =
                    array[index].material_id;
                  this.nameListFormResources.material_type_id =
                    array[index].material_type_id;
                  this.nameListFormResources.mid_material_allot_id =
                    array[index].mid_material_allot_id;
                  this.surplus_count = array[index].surplus_count;
                  this.uploadParam.material_id = array[index].material_id;
                  this.uploadParam.material_type_id =
                    array[index].material_type_id;
                  this.uploadParam.grant_type = this.nameListFormResources.grant;
                  this.uploadParam.validityday = this.nameListFormResources.time; //有效时长
                }
              });
            }

            //批次
            this.nameListFormResources.resouceItem = response;
          })
          .catch(error => {
            this.$message({
              message: error.data.message,
              duration: 1000
            });
            // this.loading = false;
          });
      });
    },
    //增加
    createDirectBatch() {
      return new Promise((resolve, reject) => {
        httpServer(apiSetting.createDirectBatch, {
          app_id: this.$getsessionStorage("appid"),
          template_id: this.$getsessionStorage("template_id"),
          material_id: this.nameListFormResources.selectResouce,
          material_type_id: this.nameListFormResources.material_type_id,
          mid_material_allot_id: this.nameListFormResources
            .mid_material_allot_id,
          grant_type: this.nameListFormResources.grant, //发放形式
          release_time: this.nameListFormResources.grantTime, //发放时间
          valid_duration: this.nameListFormResources.time, //有效时长
          reason: this.applyForm.reason //申请理由
        })
          .then(response => {
            console.log("增加按钮");
            // 清空表单
            this.nameListFormResources.grantTime = "";
            this.applyForm.reason = ""; //理由展示
            this.nameListFormResources.time = 30; //有效时长
            this.applyForm.reason = ""; //申请弹窗

            this.addloading = false;
            this.batchDataSelcet = 1; //添加成功后选全部后面的
            this.getDirectBatchList(1);
            resolve("随便什么数据1");
            console.log(response);
          })
          .catch(error => {
            this.addloading = false;
            this.$message({
              message: error.data.message,
              duration: 1000
            });
            // this.loading = false;
          });
      });
    },
    //导入名单
    UploadUrl() {
      return apiSetting.upLoadUsers.url;
    },
    // 填写理由按钮
    fillReasonFun() {
      this.showAppllyDialog = true;
    },
    // 申请理由
    submitAppllyForm() {
      console.log("我是理由");
      console.log(this.applyForm.reason);
      this.showAppllyDialog = false;
    },
    // 获取批次
    getDirectBatchList(number) {
      httpServer(apiSetting.getDirectBatchList, {
        app_id: this.$getsessionStorage("appid"),
        batch_enums: "10", //入口判断：10添加名单处调用，20活动预览处的调用
        template_id: this.$getsessionStorage("template_id"),
        material_id: this.nameListFormResources.selectResouce,
        mid_material_allot_id: this.nameListFormResources.mid_material_allot_id,
        start: "20", //相当于false
        id: "0" //批次id 0即为查全部
      })
        .then(response => {
          // alert(this.nameListFormResources.selectResouce);
          console.log("我是批次");
          console.log("sssssss");
          this.batchData = response;
          if (number == 1) {
            this.batchDataSelcetId = response[1].id;
            this.batchDataTop.user_count = response[1].user_count;
            this.batchDataTop.material_count = response[1].material_count;
            this.batchDataTop.release_time = response[1].release_time;
          } else {
            // this.batchData = response;
            this.batchDataSelcetId = response[0].id;
            this.batchDataTop.user_count = response[0].user_count;
            this.batchDataTop.material_count = response[0].material_count;
            this.batchDataTop.release_time = response[0].release_time;
          }
          this.stateArry = [];
          this.batchData.forEach((value, index, array) => {
            this.stateArry.push(value.audit_status);
            // 审核状态 5.提交待审核 10.待审核 20.审核成功 30.审核失败 ,
            if (value.audit_status == 5 || value.audit_status == 30) {
              // this.addstate = true;
              this.batchDataSelcet = index;
              this.batchDataSelcetId = array[index].id;
              this.batchDataTop.user_count = array[index].user_count;
              this.batchDataTop.material_count = array[index].material_count;
              this.batchDataTop.release_time = array[index].release_time;
              if (number == 1) {
                this.audit_status = array[index].audit_status;
              }

              console.log(array[index]);
            }
          });
          console.log("我是---数组");
          console.log(this.stateArry);
          if (this.stateArry.includes(5) || this.stateArry.includes(30)) {
            this.addstate = true;
            this.sendpreview = true;
          } else {
            this.addstate = false;
            this.sendpreview = false;
            this.batchDataSelcet = 0; //否则就是选中全部
          }

          this.getDirectUserListClik(
            this.nameListFormResources.mid_material_allot_id
          );

          console.log(response);
        })
        .catch(error => {
          this.$message({
            message: error.data.message,
            duration: 1000
          });
          console.log(error);
        });
    },
    // 删除批次
    deleteDirectBatch() {
      return new Promise((resolve, reject) => {
        this.loadingbottom = true;
        httpServer(apiSetting.deleteDirectBatch, {
          id: this.batchDataSelcetId //批次id
        })
          .then(response => {
            resolve("随便什么数据1");
            console.log("我是delete");
            this.getDirectBatchList();
            this.addstate = false; //删除成功就可以继续添加了
            this.batchDataSelcet = 0; //删除成功到全部上
            this.sendpreview = false; //显示发送审核按钮
            // 删除后剩余的使用资源重新请求 为了数量和后台对应
            this.record_count = this.nameListFormResources.selectResouce;
            return this.getUseMaterialByAppId(); //为了重新请求数量
            console.log(response);
          })
          .catch(error => {
            this.$message({
              message: error.data.message,
              duration: 1000
            });
            console.log(error);
          });
      });
    },
    // 切换批次
    changebatchData(index, id, audit_status, mid_material_allot_id) {
      this.batchDataSelcet = index;
      this.page.pageIndex = index;
      this.batchDataSelcetId = id; //批次id
      this.seachValue = "";
      this.isclickshow = false;
      this.page.pageIndex = 1;
      console.log(audit_status);
      // console.log(this.batchData[index]);
      if (this.batchData.length > 0) {
        this.batchDataTop.user_count = this.batchData[index].user_count;
        this.batchDataTop.material_count = this.batchData[index].material_count;
        this.batchDataTop.release_time = this.batchData[index].release_time;
      }
      this.getDirectUserListClik(mid_material_allot_id);
    },
    // 获取下面表格
    getDirectUserListClik(material_allot_idName) {
      this.cun_id = material_allot_idName;
      // alert(this.nameListFormResources.selectResouce);
      this.itemListloading = false;
      this.loadingbottom = true;
      this.isclickshow = false;
      httpServer(apiSetting.getDirectUserList, {
        app_id: this.$getsessionStorage("appid"),
        material_id: this.nameListFormResources.selectResouce,
        mid_direct_batch_id: this.batchDataSelcetId, //批次号
        mid_material_allot_id: material_allot_idName,
        keywords: this.seachValue, //搜索条件 名称/手机号
        PageIndex: this.page.pageIndex,
        PageSize: this.page.pageSize,
        Conditions: ""
      })
        .then(response => {
          console.log("我是表格");
          this.isclickshow = true;
          this.loadingbottom = false;

          this.dataList = apiSetting.getDirectUserList.dataList;
          this.itemList = apiSetting.getDirectUserList.dataList;
          if (this.dataList.length <= 0) {
            this.nodata_tip = false;
          } else {
            this.nodata_tip = true;
            this.itemListloading = true;
          }
        })
        .catch(error => {
          this.$message({
            message: error.data.message,
            duration: 1000
          });
          console.log(error);
          this.isclickshow = true;
        });
    },
    // 发送审核
    preview() {
      this.$confirm("名单添加成功，是否发给项目负责人审核？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          httpServer(apiSetting.appAddRosterAudit, {
            id: this.$getsessionStorage("appid") //上个页面传过来的id
          })
            .then(response => {
              console.log("增加名单---发送审核");
              console.log(response);
              this.prev();
            })
            .catch(error => {
              this.$message({
                message: error.data.message,
                duration: 1000
              });
              console.log(error); //loading层关闭
            });
        })
        .catch(error => {
          this.$message({
            message: error.data.message,
            duration: 1000
          });
        });
    },
    //返回
    prev() {
      // this.$router.back(-1);
      this.$router.push({
        name: "activeManage",
        params: {
          tabName: "preview",
          activeTypeIndex: this.$route.query.activeTypeIndex, //选中的人
          changeid: this.$route.query.changeid,
          activeStateIndex: this.$route.query.activeStateIndex,
          statue: this.$route.query.statue,
          isStauy: this.$route.query.isStauy
        }
      });
    },
    // 搜索
    seachclick(a) {
      if (a == 0) {
        this.seachValue = "";
      }
      this.page.pageIndex = 1;
      if (this.isclickshow) {
        this.getDirectUserListClik(
          this.nameListFormResources.mid_material_allot_id
        ); //搜索请求列表
      }
    },
    //添加
    submitResouceForm() {
      if (this.surplus_count <= 0) {
        this.$message({
          message: "资源剩余数量不足，暂不可添加",
          duration: 1000
        });
        return false;
      }
      if (!this.uploadBooler) {
        this.$message({
          message: "必须先导入名单",
          duration: 1000
        });
        return false;
      }
      this.$refs.nameListFormResources.validate(valid => {
        //验证合格后执行
        if (valid) {
          this.addloading = true;
          this.createDirectBatch()
            .then(data => {
              this.record_count = this.nameListFormResources.selectResouce;
              return this.getUseMaterialByAppId(); //为了重新请求数量
              //后面可以用传过来的数据做些其他操作
              //......
            })
            .then(data => {
              console.log(data);
              console.log("请求成功后的操作");
              this.nameListFormResources.selectResouce = this.record_count;
              // return this.orderGetStatusCount();
              //后面可以用传过来的数据做些其他操作
              //......
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 有效时长
    handleChange() {},
    // 发放时间
    setDateTime(value) {
      // 时间选择器回调
      console.log(this.nameListFormResources.grantTime);
    },
    // 选择发放平台
    changeDistribution(value) {
      console.log(value);
    },
    // select发放资源切换
    changeResources(value) {
      let obj = {};
      obj = this.nameListFormResources.resouceItem.find(item => {
        //这里的userList就是上面遍历的数据源
        return item.mid_material_allot_id === value; //筛选出匹配数据
      });
      console.log("选择的资源");
      console.log(obj);
      // 导入名单 上传文件需要的额
      this.uploadParam.material_id = obj.material_id;
      this.uploadParam.material_type_id = obj.material_type_id;
      this.uploadParam.grant_type = this.nameListFormResources.grant;
      this.uploadParam.validityday = this.nameListFormResources.time; //有效时长
      this.uploadParam.grant_type = obj.grant_type; //为了让后台区分是直接发放 还是其他资源（关乎到上传Excel上传他们要判断）
      if (obj.type_ename == "zichong") {
        if (obj.grant_type == 1) {
          this.nameListFormResources.grant = "1";
        } else {
          this.nameListFormResources.grant = "3";
        }
        console.log("我是发放形式", obj.grant_type);
        this.zichongDisabled = true;
      } else {
        this.nameListFormResources.grant = "1";
        this.zichongDisabled = false;
      }
      this.page.pageIndex = 1;
      console.log(value);
      this.surplus_count = obj.surplus_count; //剩余数量
      this.nameListFormResources.mid_material_allot_id = value; //项目资源分配id
      this.nameListFormResources.material_type_id = obj.material_type_id; //资源类型id
      this.nameListFormResources.selectResouce = obj.material_id; //资源id
      this.getDirectBatchList();
      //表单清空
      this.nameListFormResources.grantTime = "";
      this.applyForm.reason = "";
      this.nameListFormResources.time = 30;
      // this.$refs["nameListFormResources"].clearValidate();
      // this.$refs["nameListFormResources"].resetFields(); //重置表单验证
      // 表单清空
    },
    // 上传失败的回调
    uploaderror(err, file, fileList) {
      console.log("上传失败的回调");
      this.$message({
        message: JSON.parse(err.message).message,
        duration: 4000
      });
      return false;
      console.log(file);
      console.log(fileList);
    },
    upChange(file) {
      console.log("ggggggg");
      console.log(file);
    },
    uploadSuccess(response, file, fileList) {
      console.log("上传成功打印");
      if (response) {
        this.uploadBooler = true;
        this.html = "<p>名单导入成功</p>";
        this.showSaasDialog = true;
        let _this = this;
        let timer = setTimeout(function() {
          _this.showSaasDialog = false;
        }, 2000);
      }
      console.log(response);
      console.log(file);
      console.log(fileList);
    },
    beforeAvatarUpload(file) {},
    handlePreview() {
      console.log("kkkkkkk");
    },
    handleRemove() {
      console.log("hhhhh");
    }
  }
};
</script>
<style>
#addNameList .select_resouce .el-input__inner,
#addNameList .grantTime .el-input__inner {
  width: 160px;
  text-indent: 0px;
  font-size: 12px;
}
#addNameList .grantTime {
  margin-right: 20px;
}
#addNameList .grantTime .el-input__inner {
  padding-right: 10px;
}
#addNameList .grantTime .el-date-editor {
  width: 170px;
}
#addNameList .upBtn .el-button {
  width: 90px;
  height: 32px;
  background-image: linear-gradient(42deg, #00b4ff 0%, #23d7ff 100%);
  border-radius: 6px;
  border: none;
}
#addNameList .upBtn .el-button span {
  background: url(../../../assets/images/images/upIcon.png) no-repeat left
    center;
  background-size: 16px 16px;
  padding-left: 20px;
  height: 100%;
  line-height: 32px;
  display: inline-block;
}
#addNameList .xiao_time .el-input-number {
  width: 120px;
}
#addNameList .editNoteDialog .el-textarea {
  width: 490px;
}
#addNameList .editNoteDialog .el-textarea .el-textarea__inner {
  height: 130px;
  resize: none;
}
</style>

<style scope lang="less">
#addNameList {
  .addNameList_content {
    width: 900px;
    background-color: #ffffff;
    border-radius: 8px;
    border: solid 1px rgba(206, 206, 206, 0.46);
    .write_news {
      padding: 20px 20px 10px 20px;
      overflow: hidden;
      .active_name {
        margin-bottom: 30px;
        span {
          display: block;
          width: 4px;
          height: 14px;
          background-color: #5a0ae0;
          float: left;
          margin: 3px 10px 0px 0px;
        }
      }
      .el-form-item {
        float: left;
      }
      .residue_num {
        p {
          font-size: 12px;
        }
        .el-form-item__content {
          margin-left: 40px !important;
          width: 100px;
        }
      }
      .guideName {
        overflow: hidden;
        margin-right: 20px;
        .download {
          float: left;
          a {
            display: block;
            font-size: 12px;
            padding-left: 20px;
            background: url(../../../assets/images/images/down.png) no-repeat
              left center;
            background-size: 16px 16px;
          }
        }
        .upBtn {
          float: left;
          margin-left: 25px;
        }
        .el-form-item__content {
          margin-left: 30px !important;
        }
      }
      .apply_reason {
        margin-right: 20px;
        .apply_reason_btn {
          cursor: pointer;
          margin-top: 5px;
          width: 110px;
          height: 32px;
          border-radius: 4px;
          border: solid 1px #aaaeb3;
          color: #aaaeb3;
          font-size: 12px;
          line-height: 32px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          .reason_btn_cla {
            padding-left: 10px;
          }
          i {
            display: block;
            float: left;
            background: url(../../../assets/images/images/reasonAppy.png)
              no-repeat center;
            background-size: 100% 100%;
            width: 18px;
            height: 18px;
            margin: 8px 10px 0px 15px;
          }
        }
      }
      .el-input-number {
        width: 150px;
        .el-input-number__decrease,
        .el-input-number__increase {
          width: 30px;
          height: 32px;
          border: 0px;
          margin-top: 3px;
          background: #d7d7d7;
          color: #393c40;
          line-height: 32px;
        }
        .el-input__inner {
          padding: 0px 40px;
          text-indent: 0px;
        }
      }
      .addPartment {
        margin-top: 5px;
      }
      .noaddPartment {
        margin-top: 5px;
        background-image: linear-gradient(41deg, #ffa200 0%, #ffcf00 100%);
        opacity: 0.5;
        color: #fff;
      }
    }
    .batchList {
      height: 43px;
      margin-bottom: 20px;
      ul {
        border-bottom: 1px solid #ecedef;
        margin-bottom: 20px;
        overflow: hidden;
        li {
          float: left; // width: 60px;
          padding: 0 10px;
          height: 32px;
          background: #f0f0f0;
          margin-left: 20px;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
          line-height: 32px;
          text-align: center;
          font-size: 12px;
          margin-top: 10px;
          cursor: pointer;
        }
        .new_add {
          background: #4a00e0;
          color: #fff;
          position: relative;
          i {
            position: absolute;
            display: block;
            width: 22px;
            height: 22px;
            background: url(../../../assets/images/images/delete.png);
            right: -6px;
            top: -6px;
          }
        }
      }
    }
    .resouce_news {
      padding: 0px 20px;
      overflow: hidden;
      margin-bottom: 20px;
      .grant_num,
      .grant_resouce,
      .grant_time {
        float: left;
        margin-right: 10px;
        margin-top: 8px;
        i {
          display: block;
          float: left;
          width: 14px;
          height: 14px;
          margin-right: 5px;
          margin-top: 3px;
        }
      }
      .grant_num,
      .grant_resouce {
        width: 170px;
      }
      .grant_num {
        i {
          background: url(../../../assets/images/images/grantNumIcon.png)
            no-repeat center;
          background-size: 100% 100%;
        }
      }
      .grant_resouce {
        i {
          background: url(../../../assets/images/images/grantResouceIcon.png)
            no-repeat center;
          background-size: 100% 100%;
        }
      }
      .grant_time {
        i {
          background: url(../../../assets/images/images/grantTimeIcon.png)
            no-repeat center;
          background-size: 100% 100%;
        }
      }
      .activeAllot_box_search {
        float: right;
        width: 220px;
        margin-right: 10px;
        input {
          width: 120px;
        }
      }
    }
    .table {
      width: 900px;
      min-height: 280px;
      .nodata_tip {
        text-align: center;
        line-height: 330px;
      }
      .resouce_table_list {
        width: 100%;
        .resouce_table_title {
          height: 40px;
          background-color: #f5f5f5;
          th {
            font-size: 12px;
            font-weight: normal;
            color: #aaaeb3;
            font-weight: bold;
          }
          .set_num {
            padding-left: 10px;
          }
        }
        .resouce_table_item {
          height: 40px;
          td {
            text-align: center;
            font-size: 12px;
            border-bottom: 1px #ecedef solid;
            p {
              text-align: center;
              width: 125px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              padding: 0px 5px;
            }
            img {
              display: inline-block;
              width: 40px;
              height: 40px;
            }
            .el-icon-delete {
              color: red;
              cursor: pointer;
              display: inline-block;
              width: 40px;
              height: 40px;
              line-height: 40px;
              font-size: 16px;
              transition: all 0.25s ease;
            }
            .el-icon-delete:hover {
              transform: scale(1.5);
            }
            .star {
              i {
                color: red;
                margin-right: 3px;
              }
              color: #898989;
              font-size: 10px;
            }
          }
        }
      }
    }
  }
}
</style>
    