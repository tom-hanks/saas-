<template>
  <div id="activeAudit">
    <p class="content-title">
      <span>审核管理</span>
      <i class="el-icon-arrow-right content-title-jiantou"></i>
      <span class="content-last-title">活动审核</span>
    </p>
    <div class="activeAllot_content">
      <div class="all_active">
        <div class="all_active_title">
          <i></i>
          <span>活动总览</span>
          <div class="change_tab">
            <div
              @click="tabclass(1)"
              class="change_tab_mouth"
              :class="tab_date == 1?'activeTab':''"
            >本月</div>
            <div
              @click="tabclass(2)"
              class="change_tab_year"
              :class="tab_date == 2?'activeTab':''"
            >今年</div>
          </div>
        </div>
        <ul>
          <li class="weit_active_item">
            <p>
              待审核活动
              <span>(个)</span>
            </p>
            <h1>{{topmain.wait_verified_count}}</h1>
          </li>
          <li class="activeAlloted_item">
            <p>
              审核通过活动
              <span>(个)</span>
            </p>
            <h1>{{topmain.verified_count}}</h1>
          </li>
          <li class="active_item">
            <p>
              驳回活动
              <span>(个)</span>
            </p>
            <h1>{{topmain.reject_count}}</h1>
          </li>
        </ul>
      </div>
      <div class="activeAllot_box" v-loading="loading">
        <div class="title_seacch_box">
          <p class="activeAllot_box_title">活动审核</p>
          <div class="activeAllot_box_search">
            <i class="el-icon-search"></i>
            <i class="el-icon-close" v-if="seachclick_close" @click="seachclick(0)"></i>
            <input
              @keyup.13="seachValue?seachclick():''"
              v-model="seachValue"
              type="text"
              placeholder="请输入项目编号或活动名称"
              @input="seachValue==''?seachclick_close=false:seachclick_close=true"
            >
            <span class="seach" @click="seachValue?seachclick():''">搜索</span>
          </div>
        </div>
        <div class="active_type_tab">
          <ul>
            <li
              :class="{typeActive:activeTypeIndex == Tindex}"
              v-for="(type,Tindex) in activeType"
              :key="Tindex"
              @click="isclickshow?typeTab(Tindex,type.id):''"
            >
              <div v-if="countNum">
                {{type.type_name}}
                <span
                  v-for="(item_state_arry,index_increaseName) in notification"
                  :key="index_increaseName+'f'"
                  v-if="item_state_arry.page_code == 'activeAudit'&&item_state_arry.region_code=='stateTable'&&item_state_arry.public_id == type.id"
                >{{item_state_arry.num<10000?item_state_arry.num:'...'}}</span>
              </div>
            </li>
          </ul>
        </div>
        <!-- 包一下 -->
        <div class="main">
          <div class="state_tab">
            <p>状态：</p>
            <ul>
              <li
                :class="{stateActive:activeStateIndex == Sindex}"
                v-for="(state,Sindex) in activeState"
                :key="Sindex"
                @click="isstateTabshow?stateTab(Sindex,state):''"
              >
                <span>
                  <font>{{state.name}}</font>
                  <i
                    v-for="(item_state_arry,index_increaseName) in notification"
                    :key="index_increaseName+'s'"
                    v-if="item_state_arry.page_code == 'activeAudit'&&item_state_arry.region_code=='stateChildTable'&&item_state_arry.code == state.code"
                    class="num_tip"
                  >{{item_state_arry.num<10000?item_state_arry.num:'...'}}</i>
                </span>
                <em></em>
              </li>
            </ul>
          </div>
          <div class="activeAllot_list">
            <ul>
              <transition-group style="display:block" :name="'list'" tag="div">
                <li v-for="(item,index) in itemList" :key="index+1">
                  <div class="activeAllot_state">
                    <img
                      v-if="item.type_ename == 'exchange'"
                      class="activeAllot_state_img"
                      src="../../../assets/images/images/change.png"
                      alt="兑奖平台"
                    >
                    <img
                      v-if="item.type_ename == 'directpurchase'"
                      class="activeAllot_state_img"
                      src="../../../assets/images/images/zhicai.png"
                      alt="直采"
                    >
                    <div class="brand_title">
                      <span>{{item.app_brand_name}}</span>
                      {{item.app_num}}
                    </div>
                    <p>
                      <span class="active_name" :title="item.app_name">{{item.app_name}}</span>
                      <i
                        style="font-style: normal;"
                        v-for="(itemChild,indexChild) in item.app_user_list"
                        :key="indexChild"
                      >
                        <span
                          class="operation_name"
                          v-if="itemChild.user_type == 2"
                        >运营人员：{{itemChild.real_name}}</span>
                      </i>
                    </p>
                  </div>
                  <div class="activeAllot_msg">
                    <div class="activeAllot_msg_left">
                      <p class="time_year" v-if="item.start_year==item.end_year">
                        <span class="start_year onlyOne">{{item.start_year}}年</span>
                      </p>
                      <p class="time_year" v-if="item.start_year!=item.end_year">
                        <span class="start_year">{{item.start_year}}年</span>
                        <span class="end_tear">{{item.end_year}}年</span>
                      </p>
                      <!-- <p class="time_year" v-if="item.start_year == item.end_year">{{item.start_year}}年</p> -->
                      <div class="time_line">
                        <div
                          v-if="item.online_balance != 0 && item.online_did!= 0"
                          :style="'width:'+(item.online_did/(item.online_balance+item.online_did))*100+'%'"
                        ></div>
                        <div
                          v-if="item.online_balance == 0 && item.online_did== 0"
                          :style="'width:'+100+'%'"
                        ></div>
                      </div>
                      <p class="time_day">
                        <span class="start_day">{{item.start_time}}</span>
                        <span class="end_day">{{item.end_time}}</span>
                      </p>
                      <div class="allot_resource">
                        <div class="resource_num">
                          <div class="authorization">授权资源数:{{item.app_material_infos.length}}</div>
                          <div>使用资源数:{{item.use_material_infos .length}}</div>
                          <span
                            v-if="item.app_material_infos.length>0 || item.use_material_infos.length>0"
                            @click="lookResouce(index)"
                          >
                            <i class="el-icon-view"></i>查看
                          </span>
                        </div>
                      </div>
                      <div class="turn_down">
                        <div class="turn_down_stady">
                          <i :class="{wait:isStauy==0,over:isStauy==1,reject:isStauy==2}"></i>状态:
                          <span>{{item.audit_status_name}}</span>
                        </div>
                        <!-- <div class="delayedApply">活动延时申请</div> -->
                        <!-- <div class="turn_down_btn" v-if="isStauy==0">
                                                    <el-button type="primary" @click="rejectFun(0,item.id)">驳回</el-button>
                                                    <el-button type="primary" class="pass" @click="passFun(item.id,item.app_status_code)">通过</el-button>
                        </div>-->
                        <div class="lookReason" v-if="isStauy==2" @click="rejectFun(1,item.id)">
                          <i class="el-icon-view"></i>查看驳回原因
                        </div>
                      </div>
                    </div>
                    <div class="activeAllot_msg_right">
                      <img :src="item.qrcode" alt>
                      <p @click="lookrouter(item.id,item.template_id)">
                        <i class="el-icon-view"></i>查看详细配置规则
                      </p>
                    </div>
                  </div>
                </li>
              </transition-group>
            </ul>
            <div class="no_img" v-if="no_data">
              <img src="../../../assets/images/images/nodata.png" alt>
              <p>空空如也</p>
            </div>
            <div class="no_img" v-if="seacherno_data">
              <img src="../../../assets/images/images/nodata2.png" alt>
              <p>没有搜索到结果，可能飞火星去了</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 查看资源的弹框 -->
    <el-dialog
      title="授权资源"
      :visible.sync="showResouceDialog"
      class="resourceDialog"
      v-if="itemList.length>0"
    >
      <div class="resourceList">
        <p class="resourceList_title">
          <i></i>授权资源
        </p>
        <ul>
          <li
            v-for="(resouce,Rindex) in itemList[lookindex]?itemList[lookindex].app_material_infos:''"
            :key="Rindex"
            :title="resouce.material_name"
          >
            <span class="resouce_num">{{Rindex+1}}.</span>
            <div class="resouce_name">
              <div class="resouce_img_f">
                <img :src="resouce.icon" alt="资源图片">
              </div>
              <span>{{resouce.material_name}}</span>
            </div>
          </li>
        </ul>
      </div>
      <div class="resourceList">
        <p class="resourceList_title">
          <i></i>使用资源
        </p>
        <ul>
          <li
            v-for="(resouce,Rindex) in itemList[lookindex]?itemList[lookindex].use_material_infos:''"
            :key="Rindex"
            :title="resouce.material_name"
          >
            <span class="resouce_num">{{Rindex+1}}.</span>
            <div class="resouce_name">
              <div class="resouce_img_f">
                <img :src="resouce.icon" alt="资源图片">
              </div>
              <span>{{resouce.material_name}}</span>
            </div>
          </li>
          <p
            v-if="itemList[lookindex].use_material_infos.length<=0"
            style="text-align:center"
          >暂无使用资源</p>

          <!-- <li>
                        <span class="resouce_num">01.</span>
                        <div class="resouce_name">
                            <img src="../../../assets/images/images/weixin.png" alt="资源图片">
                            <span>微信红包</span>
                        </div>
          </li>-->
        </ul>
      </div>
      <div slot="footer" class="dialog-footer resourceListFooter">
        <!-- <el-button @click="showResouceDialog = false">取 消</el-button> -->
        <el-button type="primary" @click="showResouceDialog = false">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 填写驳回理由  弹框  -->
    <el-dialog :title="rejection?'驳回理由':'请填写驳回理由'" :visible.sync="showReasonDialog">
      <el-form :model="reasonForm" :rules="rules" ref="reasonForm">
        <el-form-item prop="reason">
          <el-input
            v-if="!rejection"
            class="reasonText"
            type="textarea"
            v-model="reasonForm.reason"
            placeholder="请填写驳回理由"
          ></el-input>
          <p v-if="rejection">{{rejection_reason}}</p>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer resourceListFooter">
        <el-button @click="showReasonDialog = false" v-if="!rejection">取 消</el-button>
        <el-button type="primary" @click="appRejec">确 定</el-button>
      </div>
    </el-dialog>

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
  </div>
</template>
<script>
import { httpServer, apiSetting } from "../../../assets/js/http.js";
import page from "../../../assets/js/page.js";
const saasDialog = () =>
  import(/* webpackChunkName:"dialog" */ "../../dialog/dialog");
export default {
  name: "activeAudit",
  props: {},
  components: {
    saasDialog
  },
  data() {
    return {
      //  活动类型
      activeType: ["兑奖平台", "上传小票", "直采项目"],
      dataList: [],
      itemList: [],
      activeTypeIndex: 0,
      itemListloading: true, //如果列表正在请求中分页就不能触发，不然会有bug
      isclickshow: false, //点击切换的节流阀，避免点击过快
      // 活动状态  待审核
      activeState: [
        { name: "待审核", code: "stateAudit" },
        { name: "审核通过", code: "statePassed" },
        { name: " 驳回", code: "stateRejected" }
      ],
      topmain: {
        wait_verified_count: 0,
        verified_count: 0,
        reject_count: 0
      },
      activeStateIndex: 0,
      isstateTabshow: true,
      //查看资源  弹框
      showResouceDialog: false,
      countNum: false,
      lookindex: 0,
      isStauy: 0, //  0待审核    1审核通过    2驳回
      // 驳回理由   弹框
      showReasonDialog: false,
      seachclick_close: false, //主页的搜索按钮叉号
      seachNameclick_close: false, //弹窗的搜索叉号
      loading: false, //是否内容区域加载，v-loading='loading' 绑定，在请求前设为true，请求完成或失败后设为false
      reasonForm: {
        reason: ""
      },
      inquire: {
        id: "",
        statue: this.$customState.app_status_code_14000
      },
      page: page,
      tab_date: 1, //1表示本月 2表示本年 切换
      seachValue: "", //主页的搜索响应式
      no_data: false, //没有数据的时候控制无数据提示
      seacherno_data: false,
      appid: "",
      rejection: false,
      rejection_reason: "", //驳回理由
      rules: {
        reason: [
          {
            required: true,
            message: "请输入驳回理由",
            trigger: "change"
          }
        ]
      }
    };
  },
  computed: {
    notification: function() {
      //每个页面得消息通知数据监听更新
      return this.$store.state.Heade.notific;
    }
  },
  created() {
    clearInterval(this.timerk2);
    console.log("我是审核页面的参数=========");
    if (this.$route.params.tabName == "preview") {
      this.activeTypeIndex = this.$route.params.activeTypeIndex;
      this.inquire.id = this.$route.params.changeid;
      this.activeStateIndex = this.$route.params.activeStateIndex;
      this.inquire.statue = this.$route.params.statue;
      this.isStauy = this.$route.params.isStauy;
    }
    // console.log(this.$route.query.tabName);
    // console.log(this.$route.query.changeid);
    // console.log(this.$route.query.activeStateIndex);
    // console.log(this.$route.query.statue);
    // console.log(this.$route.query.isStauy);
  },
  mounted() {
    window.scrollTo(0, 0);
    this.getCoundBycode();
    if (this.$route.params.tabName == "preview") {
      this.getAppTypeList();
    } else {
      this.getAppTypeList(0);
    }
    let $emit = this;
    $emit.page.pageSize = 24; //修改每页显示数
    $emit.page.pageSizeList = [24, 48, 72]; //修改可以下拉框选择的每页显示数

    //分页调用的获取列表方法
    $emit.page.query = function() {
      if ($emit.itemListloading) {
        $emit.getList($emit.typeid);
        this.itemList = [];
        $emit.itemListloading = false; //以防分页点击过快的flag节流阀
      }
    };
    apiSetting.getVerifiedList.page = this.page; //api接口分页赋值
    apiSetting.getVerifiedList.dataList = this.dataList; //api分页数据赋值
  },
  methods: {
    typeTab(index, id) {
      this.itemList = [];
      this.isclickshow = false;
      this.isStauy = 0;
      // this.inquire.statue = 50;
      this.lookindex = 0;
      this.seachValue = "";

      if (this.inquire.id != id) {
        this.page.pageIndex = 1;
        this.inquire.id = id; //第一层tab的id
        this.activeStateIndex = 0; //重置默认值
        this.inquire.statue = this.app_status_code_14000;
      }
      // console.log(id);

      this.activeTypeIndex = index;
      this.getList();
    },
    tabclass(num) {
      if (num == 1) {
        this.tab_date = 1;
        this.getCoundBycode();
      } else if (num == 2) {
        this.tab_date = 2;
        this.getCoundBycode();
      }
    },
    //  切换审核状态
    stateTab(index, item) {
      // console.log(index);
      this.notification.forEach(element => {
        if (
          element.page_code == "activeAudit" &&
          element.region_code == "stateChildTable" &&
          element.code == item.code
        ) {
          this.$deleteMid_notify(element, "activeAudit");
        }
      });
      clearInterval(this.timerk2);
      this.isstateTabshow = false;
      this.lookindex = 0;
      this.itemList = [];
      this.isclickshow = false;
      this.seachValue = "";
      this.page.pageIndex = 1;
      this.activeStateIndex = index;

      // console.log("我是审核状态");
      switch (index) {
        case 0:
          this.inquire.statue = this.$customState.app_status_code_14000; //待审核
          this.isStauy = 0;
          break;
        case 1:
          this.inquire.statue = this.$customState.app_status_code_15000; //审核通过
          this.isStauy = 1;
          break;
        case 2:
          this.inquire.statue = this.$customState.app_status_code_16000; //驳回
          this.isStauy = 2;
          break;
      }
      this.getList();
    },
    // 查看资源
    lookResouce(index) {
      this.showResouceDialog = true;
      this.lookindex = index;
      // console.log("索引");
      // console.log(index);
    },
    lookrouter(id, template_id) {
      this.$router.push({
        name: "preview",
        query: {
          tabName: "activeAudit",
          activeTypeIndex: this.activeTypeIndex, //选中的人
          changeid: this.inquire.id,
          activeStateIndex: this.activeStateIndex,
          statue: this.inquire.statue,
          isStauy: this.isStauy
        }
      });
      this.$setsessionStorage("template_id", template_id);
      this.$setsessionStorage("appid", id);
    },
    getCoundBycode() {
      httpServer(apiSetting.countVerifiedBystatus, {
        dt: this.tab_date
      })
        .then(response => {
          // console.log("我说统计");
          // console.log(response);
          this.topmain.wait_verified_count = response.wait_verified_count;
          this.topmain.verified_count = response.verified_count;
          this.topmain.reject_count = response.reject_count;

          // this.topArry.whole_count = response.whole_count;
          // this.topArry.wait_count = response.wait_count;
          // this.topArry.already_count = response.already_count;
        })
        .catch(error => {
          this.loading = false;
          console.log(error); //loading层关闭
        });
    },
    //  获取table选项
    getAppTypeList(num) {
      this.loading = true; //loading层打开
      this.activeType = [];
      httpServer(apiSetting.getAppTypeVerifiedCountList, {
        statusCode: this.app_status_code_14000 //默认50因为导航角标永远代表待审核的数量   由 getAppTypeCount_list
      })
        .then(response => {
          this.$nextTick(function() {
            this.countNum = true;
          });
          if (num == 0) {
            //num等于0的话代表着第一次进来需要把数据第一个id传过去
            this.inquire.id = response[0].id; //默认type取第一个
          }
          console.log("table");
          console.log(response);
          this.getCoundBycode();
          this.activeType = response;
          this.getList();
          this.loading = false; //loading层关闭
        })
        .catch(error => {
          this.loading = false;
          console.log(error); //loading层关闭
        });
    },
    getList(flagName) {
      clearInterval(this.timerk2);
      this.isclickshow = false;
      let timer2 = null; //声明定时器
      this.itemList = [];
      this.itemListloading = false;
      this.loading = true; //loading层打开
      httpServer(apiSetting.getVerifiedList, {
        //由getAppList
        Name: this.seachValue,
        ProductClass: this.inquire.id,
        PageIndex: this.page.pageIndex,
        AppStatusCode: this.inquire.statue,
        PageSize: this.page.pageSize
      })
        .then(response => {
          this.isclickshow = true;
          this.loading = false; //loading层关闭

          // console.log("分配列表");
          this.dataList = apiSetting.getVerifiedList.dataList;
          this.itemListloading = true;
          let item = apiSetting.getVerifiedList.dataList;
          this.$getMid_notify("activeAudit");
          // console.log("大萨达所");
          // console.log(this.dataList);
          let index = 0;
          if (item.length > 0) {
            //但数据大于0的时候可以执行渲染
            this.no_data = false;
            this.seacherno_data = false;
            this.timerk2 = setInterval(() => {
              if (index == item.length - 1) {
                //接口数据已经全部放入渲染列表中，清除定时器
                clearInterval(this.timerk2);
              }
              this.itemList.push(item[index]); //将你的接口数据push到你需要渲染的列表里
              index++;
            }, 120);
          } else {
            this.isclickshow = true;
            if (flagName) {
              //表示搜索的时候没有数据
              this.no_data = false;
              this.seacherno_data = true;
            } else {
              this.seacherno_data = false;
              this.no_data = true;
            }
          }
          // console.log(response);
          this.isstateTabshow = true;
        })
        .catch(error => {
          this.loading = false;
          console.log(error); //loading层关闭
        });
    },
    seachclick(a) {
      if (a == 0) {
        this.seachValue = "";
      }
      this.page.pageIndex = 1;
      if (this.isclickshow) {
        this.getList("seach"); //搜索请求列表
      }
    },
    // 驳回
    rejectFun(num, id) {
      this.showReasonDialog = true;
      this.appid = id;

      if (num == 1) {
        this.rejection = true;

        //getRejectreason
        httpServer(apiSetting.getRejectreason, {
          appId: this.appid
        })
          .then(response => {
            // console.log("驳回理由");
            this.rejection_reason = response;
            // console.log(response);
          })
          .catch(error => {
            console.log(error); //loading层关闭
          });
      } else {
        this.rejection = false;
      }
    },
    appRejec() {
      if (this.rejection == false) {
        // 驳回弹窗的确认按钮
        this.$refs["reasonForm"].validate(valid => {
          //验证合格后执行
          if (valid) {
            //点击驳回按钮
            httpServer(apiSetting.appRejec, {
              id: this.appid,
              reject_reason: this.reasonForm.reason
            })
              .then(response => {
                this.showReasonDialog = false;
                this.page.pageIndex = 1; //驳回成功后重置页码
                this.getAppTypeList();
                // this.getList();
              })
              .catch(error => {
                console.log(error); //loading层关闭
              });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      } else {
        this.showReasonDialog = false;
      }
    },
    // 通过
    passFun(id, appCode) {
      this.appid = id;
      // 代表紧急下线，紧急下线的时候弹窗文案稍有不同
      if (appCode == 55) {
        this.$confirm("审核通过后，活动将紧急下线", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
          // type: 'warning'
        })
          .then(() => {
            console.log("确定审核通过");
            httpServer(apiSetting.appVerified, {
              id: this.appid
            })
              .then(response => {
                this.getAppTypeList();
                console.log("通过成功");
              })
              .catch(error => {
                console.log(error); //loading层关闭
              });
          })
          .catch(() => {
            console.log("取消");
          });
      } else {
        this.$confirm(
          "审核通过后，活动将会在预设时间准时上线确定审核通过？",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消"
            // type: 'warning'
          }
        )
          .then(() => {
            console.log("确定审核通过");
            httpServer(apiSetting.appVerified, {
              id: this.appid
            })
              .then(response => {
                this.getAppTypeList();
                console.log("通过成功");
              })
              .catch(error => {
                console.log(error); //loading层关闭
              });
          })
          .catch(() => {
            console.log("取消");
          });
      }
    }
  },
  destroyed() {
    //离开页面钩子，清除定时器
    clearInterval(this.timerk2);
  }
};
</script>
<style>
.list-item {
  display: inline-block;
  margin-right: 10px;
}
.list-enter-active,
.list-leave-active {
  transition: all 0.35s;
}
.list-enter, .list-leave-to
/* .list-leave-active for below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}

.item {
  padding: 0px;
}
.item .el-tooltip__popper[x-placement^="top"] .popper__arrow {
  /* bottom:0px;
    border-width: 0px; */
  display: none;
  border-top-color: transparent;
}
.item.el-tooltip__popper .popper__arrow {
  display: none;
  border-top-color: transparent;
  border-width: 0px;
}
#activeAudit .el-pagination__sizes .el-input .el-input__inner {
  width: 108px;
}
#activeAudit .el-icon-loading {
  margin-right: -9px;
}
</style>
<style scoped lang="less">
#activeAudit {
  .el-paginationshow {
    visibility: visible;
  }
  .el-paginationhide {
    visibility: hidden;
    // display: none;
  }
  .radioTextred {
    color: #f56c6c;
    font-size: 12px;
  }
  .resourceListFooter {
    .el-button--primary {
      margin-left: 0px;
    }
  }
  .no_dataNum {
    text-align: center;
    font-size: 14px;
    margin-top: 15px;
    font-weight: 700;
  }
  .activeAllot_content {
    .all_active {
      width: 878px;
      height: 170px;
      background-color: #ffffff;
      border-radius: 8px;
      border: solid 1px rgba(206, 206, 206, 0.46);
      padding: 20px 0px 20px 20px;
      margin-bottom: 20px;
      .all_active_title {
        margin-bottom: 25px;
        overflow: hidden;
        i,
        span,
        div {
          float: left;
        }
        i {
          display: block;
          width: 4px;
          height: 14px;
          background-color: #5a0ae0;
          margin-top: 2px;
          margin-right: 5px;
        }
        .change_tab {
          margin-left: 20px;
          width: 98px;
          position: relative;
          height: 22px;
          div {
            width: 50px;
            position: absolute;
            height: 20px;
            line-height: 20px;
            background: #e4e4e4;
            border: 1px solid #d2d2d2;
            border-radius: 4px;
            font-size: 12px;
            text-align: center;
            cursor: pointer;
          }
          .change_tab_mouth {
            left: 0px;
            top: 0px;
          }
          .change_tab_year {
            right: 0px;
            top: 0px;
          }
          .activeTab {
            color: #fff;
            background-image: linear-gradient(42deg, #4900e0 0%, #8d2de2 100%);
            border: 1px #4900e0 solid;
            z-index: 2;
          }
        }
      }
      ul {
        overflow: hidden;
        li {
          float: left;
          width: 234px;
          height: 70px;
          border-radius: 6px;
          margin-right: 18px;
          padding: 25px 20px;
          color: #ffffff;
          p {
            span {
              font-size: 12px;
              padding-left: 5px;
            }
          }
          h1 {
            font-size: 32px;
            text-align: center;
            margin-top: 10px;
          }
        }
        .active_item {
          background: url(../../../assets/images/images/item4.png);
          background-size: 100% 100%;
        }
        .weit_active_item {
          background: url(../../../assets/images/images/item1.png);
          background-size: 100% 100%;
        }
        .activeAlloted_item {
          background: url(../../../assets/images/images/item3.png);
          background-size: 100% 100%;
        }
      }
    }
    .activeAllot_box {
      width: 898px;
      min-height: 350px;
      background-color: #ffffff;
      border-radius: 8px;
      border: solid 1px rgba(206, 206, 206, 0.46);
      padding: 20px 0px;
      .title_seacch_box {
        overflow: hidden;
        padding: 0px 20px;
        .activeAllot_box_title {
          float: left;
          width: 300px;
          height: 32px;
        }
        .activeAllot_box_search {
          float: right;
        }
      }
      .active_type_tab {
        border-bottom: 1px #eaeaea solid;
        padding-left: 20px;
        overflow: hidden;
        margin-top: 10px;
        li {
          cursor: pointer;
          float: left;
          height: 50px;
          line-height: 50px;
          font-size: 12px;
          color: #aaaeb3;
          padding: 0px 16px;
          margin-right: 30px;
          div {
            position: relative;
            span {
              display: block;
              position: absolute;
              right: -30px;
              top: 0;
              width: 30px;
              height: 16px;
              font-size: 10px;
              color: #fff;
              text-align: center;
              line-height: 16px;
              border-radius: 8px;
              background-color: #e83531;
            }
          }
        }
        .typeActive {
          font-size: 14px;
          color: #393c40;
          border-bottom: 3px #4900e0 solid;
          span {
            background: #e83531;
          }
        }
      }
      .state_tab {
        font-size: 12px;
        overflow: hidden;
        padding: 25px 20px 0px 20px;
        p,
        ul {
          float: left;
        }
        ul {
          //   overflow: hidden;
          li {
            cursor: pointer;
            float: left;
            padding-left: 25px;
            color: #aaaeb3;
            position: relative;
            // text-decoration-line:underline;
            // text-decoration-color: #4900e0;
            // i {
            //   display: inline-block;
            //   width: 1px;
            //   height: 10px;
            //   background: #c0c0c0;
            //   margin-left: 25px;
            // }
            em {
              display: inline-block;
              width: 1px;
              height: 10px;
              background: #c0c0c0;
              margin-left: 25px;
            }
            span {
              display: inline-block;
              position: relative;
              i.num_tip {
                top: -16px;
                right: -19px;
              }
            }
          }
          .stateActive {
            color: #393c40;
            span {
              padding-bottom: 4px;
              border-bottom: 1px #4900e0 solid;
            }
          }
        }
      }
      .activeAllot_list {
        min-height: 500px;
        position: relative;
        ul {
          padding-top: 20px;
          overflow: hidden;
          li {
            width: 420px;
            height: 220px;
            margin-left: 19px;
            margin-bottom: 20px;
            position: relative;
            float: left;
            cursor: pointer;
            box-shadow: 0px 2px 15px 0px rgba(210, 210, 210, 0.45);
            .activeAllot_state {
              position: relative;
              height: 69px;
              border-bottom: 1px #d7d7d7 solid;
              padding: 0px 15px;
              .activeAllot_state_img {
                position: absolute;
                top: 0px;
                right: 0px;
                width: 54px;
                height: 54px;
              }
              .brand_title {
                padding-top: 15px;
                span {
                  font-size: 10px;
                  padding: 2px 10px;
                  background-color: #ebebeb;
                  border-radius: 6px;
                  margin-right: 6px;
                }
              }
              p {
                font-size: 12px;
                padding-top: 10px;
                .active_name {
                  float: left;
                  width: 260px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }
                .operation_name {
                  float: right;
                  padding-right: 10px;
                }
              }
            }
            .activeAllot_msg {
              padding: 10px;
              font-size: 12px;
              overflow: hidden;
              .activeAllot_msg_left {
                float: left;
                width: 250px;
                .onlyOne {
                  display: block;
                  width: 100%;
                  text-align: center;
                }
                .time_year {
                  font-size: 12px;
                  color: #acb0b5;
                  overflow: hidden;
                  text-align: center;
                  .start_year {
                    float: left;
                  }
                  .end_tear {
                    float: right;
                  }
                }
                .time_line {
                  width: 100%;
                  height: 5px;
                  background-color: #d7d7d7;
                  border-radius: 3px;
                  margin-top: 5px;
                  div {
                    width: 6px;
                    height: 5px;
                    background-color: #5ac1ff;
                    border-radius: 3px;
                  }
                  span {
                    display: block;
                    width: 5px;
                    height: 5px;
                    background-color: #5ac1ff;
                    border-radius: 50%;
                  }
                }
                .time_day {
                  font-size: 12px;
                  overflow: hidden;
                  margin-top: 7px;
                  .start_day {
                    float: left;
                  }
                  .end_day {
                    float: right;
                  }
                }
                .allot_resource {
                  margin-top: 10px;
                  font-size: 12px;
                  overflow: hidden;
                  .resource_num {
                    float: left;
                    overflow: hidden;
                    div {
                      float: left;
                      padding-left: 15px;
                    }
                    .authorization {
                      background: url(../../../assets/images/images/resourse.png)
                        no-repeat left center;
                      background-size: 12px 12px;
                    }
                    span {
                      float: left;
                      color: #ffb735;
                      padding-left: 15px;
                    }
                    span:hover {
                      color: #393c40;
                    }
                  }
                  .allot_name {
                    float: right;
                  }
                }
              }
              .activeAllot_msg_right {
                float: right;
                margin-right: 15px;
                img {
                  display: block;
                  width: 90px;
                  height: 90px;
                  margin-left: 22px;
                }
                p {
                  color: #ffb735;
                  font-size: 12px;
                  margin-top: 10px;
                }
                p:hover {
                  color: #393c40;
                }
              }
              .turn_down {
                margin-top: 15px;
                overflow: hidden;
                .turn_down_stady,
                .turn_down_btn {
                  float: left;
                }
                .turn_down_stady {
                  margin-top: 8px;
                  margin-right: 8px;
                  i {
                    display: inline-block;
                    width: 10px;
                    height: 10px;
                    border-radius: 100%;
                    margin-right: 2px;
                  }
                  // span {
                  //     display: block;
                  //     // width: 50px;
                  //     float: right;
                  // }
                  .wait {
                    background-color: #ffb833;
                  }
                  .over {
                    background-color: #01c58a;
                  }
                  .reject {
                    background-color: #f96344;
                  }
                }
                .delayedApply {
                  float: right;
                  color: #4a00e0;
                  margin-top: 10px;
                  font-weight: bold;
                }
                .turn_down_btn {
                  .el-button {
                    width: 70px;
                    height: 30px;
                    padding: 0px;
                    text-align: center;
                    line-height: 30px;
                    background-image: linear-gradient(
                      161deg,
                      #f64d34 0%,
                      #fb7451 100%
                    );
                    border-radius: 5px;
                    border: none;
                    font-size: 12px;
                  }
                  .pass {
                    background-image: linear-gradient(
                      138deg,
                      #00c387 0%,
                      #0dceab 100%
                    );
                    margin-left: 0px;
                  }
                }
                .lookReason {
                  color: #ffb735;
                  font-size: 12px;
                  float: right;
                  margin-top: 10px;
                  i {
                    margin-right: 5px;
                  }
                }
              }
            }
          }
          li:hover {
            webkit-box-shadow: 0 11px 21px #bfb2b2;
            box-shadow: 0 11px 21px #bfb2b2;
            transition: all 0.5s;
          }
        }
      }
    }
  }
  .no_img {
    display: inline-block;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    p {
      text-align: center;
      color: #aaaeb3;
    }
  }
  .resourceDialog {
    .resourceList {
      .resourceList_title {
        border-bottom: 1px #ecedef solid;
        margin-bottom: 10px;
        padding: 10px 20px 5px 20px;
        font-weight: bold;
        i {
          display: block;
          width: 4px;
          height: 14px;
          background-color: #5a0ae0;
          float: left;
          margin-top: 2px;
          margin-right: 5px;
        }
      }
      ul {
        overflow: hidden;
        padding: 0px 20px;
        li {
          float: left;
          width: 175px;
          padding-right: 5px;
          margin-bottom: 15px;
          overflow: hidden;
          line-height: 30px;
          .resouce_num,
          .resouce_name {
            float: left;
          }
          .resouce_num {
            text-align: center;
            display: block;
            width: 30px;
          }
          .resouce_name {
            overflow: hidden;
            .resouce_img_f {
              width: 30px;
              height: 30px;
              float: left;
              margin-right: 5px;
              img {
                display: block;
                max-width: 100%;
                max-height: 100%;
                position: relative;
                top: 50%;
                left: 50%;
                -webkit-transform: translateX(-50%) translateY(-50%);
                transform: translateX(-50%) translateY(-50%);
              }
            }
            span {
              display: block;
              line-height: 30px;
              color: #393c40;
              width: 100px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            img,
            span {
              float: left;
            }
          }
        }
      }
    }
  }
  .el-icon-view {
    margin-right: 5px;
  }
}
</style>
<style lang="less">
.resourceDialog {
  .el-dialog {
    .el-dialog__header {
      border: none;
    }
    .el-dialog__body {
      padding: 20px 0px 0px 0px;
      overflow-y: auto;
      max-height: 285px;
    }
  }
}
.reasonText {
  .el-textarea__inner {
    height: 180px;
    resize: none;
  }
}
.el-button--default {
  margin-right: 20px;
}
</style>

     
     