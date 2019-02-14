<template>
  <div id="activeManage">
    <p class="content-title">
      <span>我的活动</span>
      <i class="el-icon-arrow-right content-title-jiantou"></i>
      <span class="content-last-title">活动管理</span>
    </p>
    <div class="activeAllot_content">
      <div class="active_pandect">
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
                审核中活动
                <span>(个)</span>
              </p>
              <h1>{{topmain.wait_count}}</h1>
            </li>
            <li class="pass_active_item">
              <p>
                已通过活动
                <span>(个)</span>
              </p>
              <h1>{{topmain.verified_count}}</h1>
            </li>
            <li class="activeAlloted_item">
              <p>
                已上线活动
                <span>(个)</span>
              </p>
              <h1>{{topmain.online_count}}</h1>
            </li>
            <li class="active_item">
              <p>
                驳回活动
                <span>(个)</span>
              </p>
              <h1>{{topmain.reject_count}}</h1>
            </li>
            <li class="urgenc_item">
              <p>
                紧急下线
                <span>(个)</span>
              </p>
              <h1>{{topmain.urgentdownline_count}}</h1>
            </li>
            <li class="downLine_item">
              <p>
                已下线活动
                <span>(个)</span>
              </p>
              <h1>{{topmain.downline_count}}</h1>
            </li>
          </ul>
        </div>
        <div class="eacharts_active" v-loading="canvasloading">
          <div class="all_active_title">
            <i></i>
            <span>活动总览</span>
          </div>
          <div id="eacharts"></div>
        </div>
      </div>

      <div class="activeAllot_box" v-loading="loading">
        <div class="title_seacch_box">
          <p class="activeAllot_box_title">活动管理</p>
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
              @click="isclickshow?typeTab(Tindex,type.id,type.type_ename):''"
            >
              <div v-if="countNum">
                {{type.type_name}}
                <span
                  v-for="(item_state_arry,index_increaseName) in notification"
                  :key="index_increaseName+'f'"
                  v-if="item_state_arry.page_code == 'organActiveManage'&&item_state_arry.region_code=='stateTable'&&item_state_arry.public_id == type.id"
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
                  {{state.name}}
                  <i
                    v-for="(item_state_arry,index_increaseName) in notification"
                    :key="index_increaseName+'s'"
                    v-if="item_state_arry.page_code == 'organActiveManage'&&item_state_arry.region_code=='stateChildTable'&&item_state_arry.code == state.code"
                    class="num_tip"
                  >{{item_state_arry.num<10000?item_state_arry.num:'...'}}</i>
                </span>
                <em></em>
                <i></i>
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
                      class="activeAllot_state_img"
                      v-if="item.type_ename == 'directpurchase'"
                      src="../../../assets/images/images/zhicai.png"
                      alt="直采"
                    >
                    <div class="brand_title">
                      <span>{{item.app_brand_name}}</span>
                      {{item.app_num}}
                    </div>
                    <p>
                      <span class="active_name">{{item.app_name}}</span>
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
                          <div class="authorization">授权资源数：{{item.app_material_infos.length}}</div>
                          <div>使用资源数：{{item.use_material_infos .length}}</div>
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
                          <i
                            :class="{wait:isStauy==0,pass:isStauy==1,over:isStauy==2,reject:isStauy==3 || isStauy==5,downLine:isStauy==4}"
                          ></i>
                          状态：
                          <span
                            :class="{waitText:isStauy==0,passText:isStauy==1,overText:isStauy==2,rejectText:isStauy==3 || isStauy==5,downLineText:isStauy==4}"
                          >{{isStauy==4 || isStauy==5 || isStauy==0 || isStauy==3?item.audit_status_name:item.app_status_name}}</span>
                        </div>
                        <!-- <div class="turn_down_btn" v-if="isStauy==5">
                                                    <el-button type="primary" class="pass" @click="passFun(item.id)">前往修改</el-button>
                        </div>-->
                        <!-- <div class="lookReason" v-if="isStauy==2" @click="clickswitch(item.id)">
                                                    <el-switch :value="item.app_status_code != 100?false:true" active-color="#13ce66" inactive-color="#AAAAAA" inactive-text="紧急下线:"></el-switch>
                        </div>-->
                        <!-- <div class="lookReason" v-if="isStauy==3" @click="rejectFun(1,item.id,item.template_id)">
                                                    <el-button type="primary" class="edit_btn">查看并修改</el-button>
                        </div>-->
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
        </ul>
      </div>
      <div slot="footer" class="dialog-footer resourceListFooter">
        <!-- <el-button @click="showResouceDialog = false">取 消</el-button> -->
        <el-button type="primary" @click="showResouceDialog = false">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 填写驳回理由  弹框  -->
    <el-dialog title="驳回理由" :visible.sync="showReasonDialog">
      <el-form :model="reasonForm" :rules="rules" ref="reasonForm">
        <el-form-item prop="reason">
          <!-- <el-input class="reasonText" type="textarea" v-model="reasonForm.reason" placeholder="请填写驳回理由"></el-input> -->
          <p v-if="rejection">{{rejection_reason}}</p>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer resourceListFooter">
        <el-button @click="showReasonDialog = false">取 消</el-button>
        <!-- <el-button type="primary" @click="appRejec">前往修改</el-button> -->
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
  name: "organActiveManage",
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
      type_enameName: "",
      activeTypeIndex: 0,
      itemListloading: true, //如果列表正在请求中分页就不能触发，不然会有bug
      isclickshow: false,
      // 活动状态
      activeState: [
        { name: "审核中", code: "stateAudit" },
        { name: "已通过", code: "statePassed" },
        { name: "已上线", code: "stateOnline" },
        { name: "已驳回", code: "stateRejected" },
        { name: "已下线", code: "stateOffline" },
        { name: "紧急下线", code: "stateEmergencyOffline" }
      ],
      topmain: {
        downline_count: 0, //下线
        online_count: 0, //上线
        reject_count: 0, //驳回
        urgentdownline_count: 0, //紧急下线
        verified_count: 0, //已通过
        wait_count: 0 //审核中(待审核)
      },
      canvasloading: true, //canvas的loading
      activeStateIndex: 0,
      isstateTabshow: true,
      //查看资源  弹框
      showResouceDialog: false,
      lookindex: 0,
      isStauy: 0, //  0审核中    1已上线    2已驳回   3紧急下线  4已下线
      // 驳回理由   弹框
      showReasonDialog: false,
      seachclick_close: false, //主页的搜索按钮叉号
      countNum: false,
      rejection: false,
      rejection_reason: "", //驳回理由
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
      rules: {},
      option: {}, //  饼状图参数
      switchValue: true,
      switchindex: 0,
      appid: 0,
      template_id: 0
    };
  },
  computed: {
    notification: function() {
      //每个页面得消息通知数据监听更新
      return this.$store.state.Heade.notific;
    }
  },
  created() {
    console.log("我是审核页面的参数");
    if (this.$route.query.tabName == "preview") {
      this.activeTypeIndex = this.$route.query.activeTypeIndex;
      this.inquire.id = this.$route.query.changeid;
      this.activeStateIndex = this.$route.query.activeStateIndex;
      this.inquire.statue = this.$route.query.statue;
      this.isStauy = this.$route.query.isStauy;
    }

    // console.log(this.$route.query.activeTypeIndex);
    // console.log(this.$route.query.changeid);inquire.id
    // console.log(this.$route.query.activeStateIndex);
    // console.log(this.$route.query.statue);
    // console.log(this.$route.query.isStauy);
  },
  mounted() {
    this.drawPie();
    this.getCoundBycode();
    if (this.$route.query.tabName == "preview") {
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
    apiSetting.getRganizationAppList.page = this.page; //api接口分页赋值
    apiSetting.getRganizationAppList.dataList = this.dataList; //api分页数据赋值
  },
  methods: {
    typeTab(index, id, type_ename) {
      // alert(type_ename);
      // alert('第一层导航'+index);
      this.activeTypeIndex = index;
      this.itemList = [];
      this.isclickshow = false;
      this.isStauy = 0;
      this.lookindex = 0;
      this.seachValue = "";
      if (this.inquire.id != id) {
        this.page.pageIndex = 1;
        this.type_enameName = type_ename;
        this.inquire.id = id; //第一层tab的id
        this.activeStateIndex = 0; //重置默认值
        this.inquire.statue = this.$customState.app_status_code_14000;
      }
      console.log(id);
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
      this.notification.forEach(element => {
        if (
          element.page_code == "organActiveManage" &&
          element.region_code == "stateChildTable" &&
          element.code == item.code
        ) {
          this.$deleteMid_notify(element, "organActiveManage");
        }
      });
      this.activeStateIndex = index;
      clearInterval(this.timerk2);
      this.isstateTabshow = false;
      this.lookindex = 0;
      this.itemList = [];
      this.isclickshow = false;
      this.seachValue = "";
      this.page.pageIndex = 1;
      switch (index) {
        case 0:
          this.inquire.statue = this.$customState.app_status_code_14000; //0审核中
          this.isStauy = 0;
          break;
        case 1:
          this.inquire.statue = this.$customState.app_status_code_15000; //1已通过 为了消息通知，改回
          this.isStauy = 1;
          break;
        case 2:
          this.inquire.statue = this.$customState.app_status_code_700; //2已上线
          this.isStauy = 2;
          break;
        case 3:
          this.inquire.statue = this.$customState.app_status_code_16000; //3已驳回
          this.isStauy = 3;
          break;
        case 4:
          this.inquire.statue = this.$customState.app_status_code_900; //4已下线
          this.isStauy = 4;
          break;
        case 5:
          this.inquire.statue = this.$customState.app_status_code_800; //5紧急下线
          this.isStauy = 5;
          break;
      }
      this.getList();
    },
    clickswitch(id) {
      this.$alert(
        "<p>发送至上级审核，审核通过后，活动紧急下线，</br>所有页面将会提示：活动正在维护中，请稍后再试</p>",
        "提示",
        {
          dangerouslyUseHTMLString: true,
          showCancelButton: true,
          showConfirmButton: true,
          confirmButtonText: "发送审核",
          cancelButtonText: "取消"
        }
      )
        .then(() => {
          httpServer(apiSetting.appDownline, {
            id: id
          })
            .then(response => {
              console.log("紧急下线");
              console.log(response);
              this.getList();
              this.getCoundBycode();
            })
            .catch(error => {
              console.log(error); //loading层关闭
            });
          console.log(id);
        })
        .catch(() => {
          console.log("不重新分配了");
        });
    },
    // 查看资源
    lookResouce(index) {
      this.showResouceDialog = true;
      this.lookindex = index;
      console.log("索引");
      console.log(index);
    },
    lookrouter(id, template_id) {
      this.$router.push({
        name: "preview",
        query: {
          tabName: "organActiveManage",
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
      httpServer(apiSetting.countByStatus, {
        dt: this.tab_date
      })
        .then(response => {
          console.log("我是活动管理统计");
          console.log(response);
          this.topmain.downline_count = response.downline_count;
          this.topmain.online_count = response.online_count;
          this.topmain.reject_count = response.reject_count;
          this.topmain.urgentdownline_count = response.urgentdownline_count;
          this.topmain.verified_count = response.verified_count;
          this.topmain.wait_count = response.wait_count;
          this.drawPie(
            response.urgentdownline_count,
            response.downline_count,
            response.online_count,
            response.verified_count,
            response.wait_count,
            response.reject_count
          );
          // urgentdownline,downline,online,verified,wait,reject
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
      httpServer(apiSetting.getAppTypeCount_list, {
        statusCode: this.$customState.app_status_code_14000 //默认400因为导航角标永远代表待审核的数量
      })
        .then(response => {
          this.$nextTick(function() {
            this.countNum = true;
          });
          if (num == 0) {
            //num等于0的话代表着第一次进来需要把数据第一个id传过去
            this.inquire.id = response[0].id; //默认type取第一个
            this.type_enameName = response[0].type_ename;
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
      httpServer(apiSetting.getRganizationAppList, {
        Name: this.seachValue,
        ProductClass: this.inquire.id,
        PageIndex: this.page.pageIndex,
        AppStatusCode: this.inquire.statue,
        PageSize: this.page.pageSize
      })
        .then(response => {
          this.isclickshow = true;
          this.loading = false; //loading层关闭

          console.log("分配列表");
          this.dataList = apiSetting.getRganizationAppList.dataList;
          this.itemListloading = true;
          let item = apiSetting.getRganizationAppList.dataList;
          console.log("大萨达所");
          console.log(this.dataList);
          this.$getMid_notify("organActiveManage");
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
    //  查看资源
    lookOverResouce() {
      this.showResouceDialog = true;
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
    rejectFun(num, id, template_id) {
      this.showReasonDialog = true;
      this.appid = id;
      this.template_id = template_id;
      if (num == 1) {
        this.rejection = true;
        httpServer(apiSetting.getRejectreason, {
          appId: this.appid
        })
          .then(response => {
            console.log("驳回理由");
            this.rejection_reason = response;
            console.log(response);
          })
          .catch(error => {
            console.log(error); //loading层关闭
          });
      } else {
        this.rejection = false;
      }
    },
    appRejec() {
      //驳回理由  弹框
      console.log(this.type_enameName);
      this.showReasonDialog = false;
      this.$setsessionStorage("template_id", this.template_id);
      this.$setsessionStorage("appid", this.appid);
      this.$setsessionStorage("chooseName", this.type_enameName);
      this.$router.push({ path: "/activehome/exchange" });
      // this.$router.push({
      //     name: "preview",
      //     query: { tabName: "activeManage" }
      // });
    },
    // 前往修改
    passFun(id) {
      this.$setsessionStorage("appid", id);
      this.$setsessionStorage("chooseName", "directpurchase");
      this.$router.push({ path: "/activehome/exchange" });
    },
    //  饼状图
    drawPie(urgentdownline, downline, online, verified, wait, reject) {
      var myChart = this.$echarts.init(document.getElementById("eacharts"));
      this.option = {
        tooltip: {
          trigger: "item",
          formatter: "{b} ({d}%)"
        },
        // legend: {
        //     orient: 'horizontal',
        //     left: 'center',
        //     // data: ['紧急下线','已下线活动','已上线活动','已通过活动','审核中活动','驳回活动']
        // },
        series: [
          {
            name: "",
            type: "pie",
            radius: "55%",
            center: ["50%", "40%"],
            data: [
              {
                value: urgentdownline,
                name: "紧急下线" + urgentdownline,
                itemStyle: { color: "#8200ff" }
              },
              {
                value: downline,
                name: "已下线活动" + downline,
                itemStyle: { color: "#b2b6b8" }
              },
              {
                value: online,
                name: "已上线活动" + online,
                itemStyle: { color: "#0ae2a0" }
              },
              {
                value: verified,
                name: "已通过活动" + verified,
                itemStyle: { color: "#46BBFF" }
              },
              {
                value: wait,
                name: "审核中活动" + wait,
                itemStyle: { color: "#ffba00" }
              },
              {
                value: reject,
                name: "驳回活动" + reject,
                itemStyle: { color: "#f96748" }
              }
            ]
            // itemStyle: {
            //     emphasis: {
            //         shadowBlur: 10,
            //         shadowOffsetX: 0,
            //         shadowColor: 'rgba(0, 0, 0, 0.5)'
            //     }
            // }
          }
        ]
      };
      myChart.setOption(this.option);
      this.canvasloading = false;
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
#activeManage .el-pagination__sizes .el-input .el-input__inner {
  width: 108px;
}
#activeManage .el-icon-loading {
  margin-right: -9px;
}
</style>
<style scoped lang="less">
#activeManage {
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
    .active_pandect {
      overflow: hidden;
      margin-bottom: 20px;
      .all_active {
        float: left;
        width: 398px;
        height: 370px;
        background-color: #ffffff;
        border-radius: 8px;
        border: solid 1px rgba(206, 206, 206, 0.46);
        padding: 20px 0px 0px 20px;
        margin-right: 20px;
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
              background-image: linear-gradient(
                42deg,
                #4900e0 0%,
                #8d2de2 100%
              );
              border: 1px #4900e0 solid;
              z-index: 2;
            }
          }
        }
        ul {
          overflow: hidden;
          li {
            float: left;
            width: 150px;
            height: 68px;
            border-radius: 6px;
            margin-right: 18px;
            padding: 10px 15px;
            color: #ffffff;
            margin-bottom: 20px;
            p {
              span {
                font-size: 12px;
                padding-left: 5px;
              }
            }
            h1 {
              font-size: 24px;
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
          .pass_active_item {
            background: url(../../../assets/images/images/pass.png);
            background-size: 100% 100%;
          }
          .activeAlloted_item {
            background: url(../../../assets/images/images/item3.png);
            background-size: 100% 100%;
          }
          .urgenc_item {
            background: url(../../../assets/images/images/item5.png);
            background-size: 100% 100%;
          }
          .downLine_item {
            background: url(../../../assets/images/images/item6.png);
            background-size: 100% 100%;
          }
        }
      }
      .eacharts_active {
        float: left;
        width: 458px;
        height: 350px;
        background-color: #ffffff;
        border-radius: 8px;
        border: solid 1px rgba(206, 206, 206, 0.46);
        padding: 20px 0px;
        .all_active_title {
          margin-bottom: 25px;
          overflow: hidden;
          margin-left: 20px;
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
        }
        #eacharts {
          width: 100%;
          height: 100%;
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
          font-weight: bold;
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
            // text-decoration-line:underline;
            // text-decoration-color: #4900e0;
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
                  .el-icon-view {
                    margin-right: 5px;
                  }
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
                  margin-right: 10px;
                  i {
                    display: inline-block;
                    width: 10px;
                    height: 10px;
                    border-radius: 100%;
                    margin-right: 2px;
                  }
                  .wait {
                    background-color: #ffb833;
                  }
                  .waitText {
                    color: #ffb833;
                  }
                  .pass {
                    background-color: #46bbff;
                  }
                  .passText {
                    color: #46bbff;
                  }
                  .over {
                    background-color: #01c58a;
                  }
                  .overText {
                    color: #01c58a;
                  }
                  .reject {
                    background-color: #f96344;
                  }
                  .rejectText {
                    color: #f96344;
                  }
                  .urgency {
                    background-color: #7a00ff;
                  }
                  .urgencyText {
                    color: #7a00ff;
                  }
                  .downLine {
                    background-color: #b2b6b7;
                  }
                  .downLineText {
                    color: #b2b6b7;
                  }
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
                    width: 80px;
                    height: 30px;
                    padding: 0px;
                    text-align: center;
                    margin-left: 35px;
                    line-height: 30px;
                    background-image: linear-gradient(
                      42deg,
                      #4900e0 0%,
                      #8d2de2 100%
                    );
                  }
                }
                .lookReason {
                  // color: #ffb735;
                  // font-size: 12px;
                  float: right;
                  margin-top: 5px;
                  margin-right: 30px;
                  .edit_btn {
                    width: 80px;
                    height: 30px;
                    padding: 0px;
                    text-align: center;
                    line-height: 30px;
                    background-image: linear-gradient(
                      42deg,
                      #4900e0 0%,
                      #8d2de2 100%
                    );
                    border-radius: 5px;
                    border: none;
                    font-size: 12px;
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
}
</style>
<style lang="less">
#activeManage {
  .resourceDialog {
    .el-dialog {
      .el-dialog__header {
        border: none;
      }
      .el-dialog__body {
        padding: 20px 0px;
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
  .el-switch__label.is-active {
    color: #393c40;
  }
  .el-switch__label * {
    font-size: 12px;
  }
}
</style>

     
     