<template>
  <div id="activeAllot">
    <p class="content-title">
      <span>设置</span>
      <i class="el-icon-arrow-right content-title-jiantou"></i>
      <span class="content-last-title">活动分配</span>
    </p>
    <div class="activeAllot_content">
      <div class="all_active">
        <p class="all_active_title">活动总览</p>
        <ul>
          <li class="active_item">
            <p>
              活动项目
              <span>(个)</span>
            </p>
            <h1>{{topArry.whole_count}}</h1>
          </li>
          <li class="weit_active_item">
            <p>
              待分配活动
              <span>(个)</span>
            </p>
            <h1>{{topArry.wait_count}}</h1>
          </li>
          <li class="activeAlloted_item">
            <p>
              已分配活动
              <span>(个)</span>
            </p>
            <h1>{{topArry.already_count}}</h1>
          </li>
        </ul>
      </div>
      <div class="activeAllot_box">
        <div class="title_seacch_box">
          <p class="activeAllot_box_title">活动分配</p>
          <div class="activeAllot_box_search">
            <i class="el-icon-search"></i>
            <i class="el-icon-close" v-if="seachclick_close" @click="seachclick(0)"></i>
            <input
              type="text"
              @keyup.13="seachValue?seachclick():''"
              placeholder="请输入项目编号或活动名称"
              v-model="seachValue"
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
                  v-if="item_state_arry.page_code == 'activeAllot'&&item_state_arry.region_code=='stateTable'&&item_state_arry.public_id == type.id"
                >{{item_state_arry.num<10000?item_state_arry.num:'...'}}</span>
              </div>
            </li>
          </ul>
        </div>
        <!-- 包一下 -->
        <div class="main" v-loading="mainloading">
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
                    v-if="item_state_arry.page_code == 'activeAllot'&&item_state_arry.region_code=='stateChildTable'&&item_state_arry.code == state.code"
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
                      v-if="item.type_ename == 'directpurchase'"
                      class="activeAllot_state_img"
                      src="../../../assets/images/images/zhicai.png"
                      alt="直采"
                    >
                    <div class="brand_title">
                      <span v-if="item.app_brand_name">{{item.app_brand_name}}</span>
                      {{item.app_num}}
                    </div>
                    <p
                      :title="item.app_external_name"
                      class="externalName"
                    >{{item.app_external_name}}</p>
                  </div>
                  <div class="activeAllot_msg">
                    <p v-if="item.start_year != item.end_year" class="time_year">
                      <span class="start_year">{{item.start_year}}</span>
                      <span class="end_tear">{{item.end_year}}</span>
                    </p>
                    <p
                      class="time_year"
                      v-if="item.start_year == item.end_year"
                    >{{item.start_year}}年</p>
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
                    <div class="allot_resource" v-if="item">
                      <div class="resource_num">
                        <div>授权资源数:{{item.app_material_infos.length}}</div>
                        <span v-if="item.app_material_infos.length>0" @click="lookResouce(index)">
                          <i class="el-icon-view"></i>查看
                        </span>
                      </div>
                      <div
                        v-if="activeAllot==1"
                        v-for="(itemChild,indexChild) in item.app_user_list"
                        :key="indexChild"
                      >
                        <el-tooltip effect="dark" placement="top">
                          <div
                            slot="content"
                          >{{itemChild.department_name}}-{{itemChild.position_name}}</div>
                          <div
                            class="allot_name"
                            v-if="itemChild.user_type == 2"
                          >已分配:{{itemChild.real_name}}</div>
                        </el-tooltip>
                      </div>
                    </div>

                    <div class="activeAllot_btn">
                      <el-tooltip
                        :popper-class="(item.app_status_code !=300 && item.app_status_code !=200)?'':'item'"
                        effect="dark"
                        placement="top"
                      >
                        <!-- v-if="(item.app_status_code==90 &&inquire.statue == 300)"下面的判断 -->
                        <div
                          slot="content"
                          v-if="(item.app_status_code !=300 && item.app_status_code !=200 )"
                        >项目{{item.app_status_name}}，不允许重新分配</div>
                        <el-button
                          :class="(item.app_status_code == 300 || item.app_status_code == 200)?'lansespan':'huisespan'"
                          @click="(item.app_status_code == 300||item.app_status_code == 200)?allotFun(item.id):''"
                        >{{btnText}}</el-button>
                      </el-tooltip>
                      <div v-if="activeAllot==1" class="active_status">
                        <span :class="item.app_status_code==300?'':'yellowspan'"></span>
                        状态:{{item.app_status_name}}
                      </div>
                      <div v-if="activeAllot==1" class="active_priority">
                        <span :class="item.exigence!=0?'redspan':''"></span>
                        优先级:{{item.exigence==0?'正常':'紧急'}}
                      </div>
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
    <!-- 选择分配人员 的弹框 -->
    <el-dialog :title="dialogTitle" :visible.sync="showDialog">
      <div class="activeAllot_box_search">
        <i class="el-icon-search"></i>
        <i class="el-icon-close" v-if="seachNameclick_close" @click="seach_dabog"></i>
        <input
          type="text"
          @keyup.13="seachName?seachNameclick():''"
          placeholder="按成员名字搜索"
          v-model="seachName"
          @input="seachNamechange()"
        >
        <span class="seach" @click="seachName?seachNameclick():''">搜索</span>
      </div>
      <div class="dalog_main" v-if="seachListpen" v-loading="dalogloading">
        <div class="dialog_tab_list">
          <ul>
            <li
              :class="{'departActive':Dindex == departIndex}"
              v-for="(depart,Dindex) in departList.department_info_model_list"
              :key="Dindex"
              @click="choseDepart(Dindex)"
            >{{depart.organization_name}}</li>
          </ul>
        </div>
        <div class="dialog_person">
          <span
            class
            v-for="(depart2,Dindex2) in departList.department_info_model_list"
            :key="Dindex2"
            v-if="Dindex2 == departIndex"
          >
            <el-radio-group v-model="radio1">
              <span
                class
                v-for="(itemName,indexName) in  depart2.department_position_sum_list"
                :key="indexName"
              >
                <el-radio
                  @change="changeclick"
                  v-for="(itemName1,indexName1) in  itemName.department_position_list"
                  :key="indexName1"
                  :label="itemName1.user_id"
                >{{itemName1.position_name+'-'+itemName1.user_name}}</el-radio>
              </span>
            </el-radio-group>
            <!-- 没有数据的时候显示 -->
            <div class="no_dataNum" v-if="depart2.department_position_sum_list.length==0">此部门下暂无成员</div>
          </span>
        </div>
      </div>

      <!-- 下面是搜索的列表展示 -->
      <div class="seachList" v-if="!seachListpen">
        <div class="dialog_tab_list">
          <ul>
            <li
              v-for="(depart,Dindex) in departListseach.department_info_model_list"
              :key="Dindex"
              @click="choseDepart(Dindex)"
            >{{depart.organization_name}}</li>
          </ul>
        </div>
        <div class="dialog_person">
          <span
            class
            v-for="(depart2,Dindex2) in departListseach.department_info_model_list"
            :key="Dindex2"
          >
            <el-radio-group v-model="radio1">
              <span
                class
                v-for="(itemName,indexName) in  depart2.department_position_sum_list"
                :key="indexName"
              >
                <el-radio
                  @change="changeclick"
                  v-for="(itemName1,indexName1) in  itemName.department_position_list"
                  :key="indexName1"
                  :label="itemName1.user_id"
                >{{depart2.organization_name+'-'+itemName1.position_name+'-'+itemName1.user_name}}</el-radio>
              </span>
            </el-radio-group>
          </span>
          <!-- 没有数据的时候显示 -->
          <div v-if="seachList_nodata" class="no_dataNum">没有搜索到符合条件的内容</div>
        </div>
      </div>

      <p v-if="radio1==0" class="fl radioTextred">{{radioText}}</p>
      <div class="priority_box">
        <span>请选择优先级</span>
        <el-radio-group v-model="radio2">
          <el-radio :label="0">正常</el-radio>
          <el-radio :label="1">紧急</el-radio>
        </el-radio-group>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDialogQuxiao">取 消</el-button>
        <el-button
          class="subbutton"
          type="primary"
          :loading="loginContent.onColse"
          @click="submitAllot"
        >{{loginContent.content}}</el-button>
      </div>
    </el-dialog>
    <!-- 查看资源的弹框 -->
    <el-dialog title="授权资源" :visible.sync="showResouceDialog" v-if="itemList.length>0">
      <div class="resourceList">
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
      <div slot="footer" class="dialog-footer resourceListFooter">
        <!-- <el-button @click="showResouceDialog = false">取 消</el-button> -->
        <el-button type="primary" @click="showResouceDialog = false">确 定</el-button>
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
    <saas-dialog :html="html" v-if="showSaasDialog"></saas-dialog>
  </div>
</template>
<script>
import { httpServer, apiSetting } from "../../../assets/js/http.js";
import page from "../../../assets/js/page.js";
const saasDialog = () =>
  import(/* webpackChunkName:"dialog" */ "../../dialog/dialog");
export default {
  name: "activeAllot",
  props: {},
  components: {
    saasDialog
  },
  data() {
    return {
      //  活动类型
      activeType: [],
      activeTypeIndex: 0,
      itemListloading: true, //如果列表正在请求中分页就不能触发，不然会有bug
      // 活动状态
      activeState: [
        { name: "待分配", code: "ectDistribution" },
        { name: "已分配", code: "alreadyDistribution" }
      ],
      dataTypeList: [],
      itemList: [],
      activeStateIndex: 0,
      activeAllot: 0, // 0：待分配   1：已分配     根据这个标识判断显示那些元素
      btnText: "分配",
      dialogTitle: "请选择分配人员",
      showDialog: false,
      departList: ["运营一部", "运营二部", "运营三部", "运营四部"],
      departListseach: [],
      seachList_nodata: false,
      departIndex: 0, // 标识哪个部门被选中    如果点了搜索，此值=—1
      lookindex: 0,
      radio1: 0, //用户id
      radio2: 0, //0是默认正常，1是紧急
      appid: 0,
      showResouceDialog: false,
      seachclick_close: false, //主页的搜索按钮叉号
      seachNameclick_close: false, //弹窗的搜索叉号
      seachListpen: true, //搜索返回数据的列表块
      submitAllotName: "", //修改成功过后返回的名字
      resouceList: [
        "优酷黄金会员",
        "微信红包微信红包微信红包",
        "iPad mini",
        "小米手环",
        "腾讯视频会员年卡"
      ],
      loginContent: {
        onColse: false, //false
        content: "提交"
      },
      inquire: {
        id: "",
        statue: this.$customState.app_status_code_200 //待分配
      },
      topArry: {
        //顶部统计
        whole_count: 0,
        already_count: 0,
        wait_count: 0
      },
      radioText: "",
      page: page,
      seachValue: "", //主页的搜索响应式
      seachName: "",
      no_data: false, //没有数据的时候控制无数据提示
      seacherno_data: false,
      isclickshow: false, //点击切换的节流阀，避免点击过快
      isstateTabshow: true, //点击切换未分配或者已分配的节流阀，避免点击过快
      countNum: false,
      timerk2: null, //缓动的定时器
      mainloading: true, //控制列表的loading
      dalogloading: true, //分配弹窗请求数据的时候loading
      html: "",
      showSaasDialog: false
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
  },
  mounted() {
    this.getCoundBycode();
    this.getAppTypeList(0); //首页进来传0，标识取第一个id
    // ===============分页配置
    let $emit = this;
    $emit.page.pageSize = 24; //修改每页显示数
    $emit.page.pageSizeList = [24, 48, 72]; //修改可以下拉框选择的每页显示数
    //分页调用的获取列表方法
    $emit.page.query = function() {
      if ($emit.itemListloading) {
        clearInterval(this.timerk2);
        this.itemList = [];
        $emit.itemListloading = false; //以防分页点击过快的flag节流阀
        $emit.getAllotlist();
      }
    };
    apiSetting.getAllotlist.page = this.page; //api接口分页赋值
    apiSetting.getAllotlist.dataList = this.dataList; //api分页数据赋值
    // =============分页配置
  },
  methods: {
    //  切换活动类型
    typeTab(index, id) {
      // clearInterval(this.timerk2);
      //   this.isstateTabshow=false;
      this.mainloading = true;
      this.itemList = [];
      this.isclickshow = false;
      //此处重置 切换活动状态的30选项
      this.activeAllot = 0;
      this.btnText = "分配";
      this.dialogTitle = "请选择分配人员";
      this.inquire.statue = this.$customState.app_status_code_200;
      this.seachValue = "";
      this.lookindex = 0;
      console.log(index);
      if (this.inquire.id != id) {
        this.page.pageIndex = 1;
        this.inquire.id = id; //第一层tab的id
        this.activeStateIndex = 0; //重置默认值
        this.inquire.statue = this.$customState.app_status_code_200;
      }
      this.activeTypeIndex = index;

      this.getAllotlist();
    },
    //  切换活动状态
    stateTab(index, item) {
      this.notification.forEach(element => {
        if (
          element.page_code == "activeAllot" &&
          element.region_code == "stateChildTable" &&
          element.code == item.code
        ) {
          this.$deleteMid_notify(element, "activeAllot");
        }
      });
      clearInterval(this.timerk2);

      this.itemList = [];
      this.isclickshow = false;
      this.seachValue = "";
      this.isstateTabshow = false;
      this.lookindex = 0;
      this.page.pageIndex = 1;

      console.log("切换活动状态" + index);
      // if(this.isstateTabshow){
      this.activeStateIndex = index;
      if (index == 0) {
        // 待分配  传值30
        this.activeAllot = 0;
        this.btnText = "分配";
        this.dialogTitle = "请选择分配人员";
        this.inquire.statue = this.$customState.app_status_code_200;
        this.getAllotlist(); //请求列表
      } else {
        // 已分配   传值300
        this.activeAllot = 1;
        this.inquire.statue = this.$customState.app_status_code_11000;
        this.btnText = "重新分配";
        this.dialogTitle = "请重新选择分配人员";
        this.getAllotlist(); //请求列表
      }
      // }
    },
    seachNameclick() {
      //点击搜索
      httpServer(apiSetting.organization, {
        userRealName: this.seachName
      })
        .then(response => {
          let $eimt = this;
          let indexnum = 0;
          //为了判断搜索的时候返回是否为空
          response.department_info_model_list.forEach(function(
            value,
            index,
            array
          ) {
            indexnum += value.department_position_sum_list.length;
          });
          if (indexnum == 0) {
            $eimt.seachList_nodata = true;
          } else {
            $eimt.seachList_nodata = false;
            this.radio1 = 0;
          }
          this.departListseach = response;
          this.seachListpen = false;
        })
        .catch(error => {
          this.loading = false;
          console.log(error); //loading层关闭
        });
    },
    seachNamechange() {
      if (this.seachName == "") {
        this.seachListpen = true;
        this.seachNameclick_close = false;
        console.log(this.radio1);
      } else {
        this.seachNameclick_close = true;
      }
    },
    seachclickchange() {
      if (this.seachValue == "") {
        this.seachclick_close = false;
        this.getAllotlist();
      } else {
        this.seachclick_close = true;
      }
    },
    seach_dabog() {
      //分配搜索框的清空事件
      this.seachListpen = true;
      this.seachName = "";
    },
    // 分配按钮  重新分配
    allotFun(appid) {
      this.departIndex = 0; //选中状态 重置
      this.seachName = ""; //重置弹窗搜索框输入的内容
      this.seachListpen = true;
      if (appid) {
        this.appid = appid; //把appid传入弹窗
      }
      if (this.activeAllot == 0) {
        // 0：待分配   1：已分配
        this.dialogTitle = "请选择分配人员";
        this.showDialog = true;
        this.radio1 = 0; //点击待分配的时候重置选中状态
        this.radio2 = 0;
        httpServer(apiSetting.organization)
          .then(response => {
            console.log("我是弹窗1");
            console.log(response);
            this.departList = response;
            this.dalogloading = false;
          })
          .catch(error => {
            this.loading = false;
            console.log(error); //loading层关闭
          });
      } else {
        this.dialogTitle = "请选择分配人员(重新分配)";
        httpServer(apiSetting.getByPerationer, {
          appId: this.appid
        })
          .then(response => {
            console.log("我是弹窗的选中状态");
            console.log(response);
            this.radio1 = response.user_id;
            this.radio2 = response.exigence;
            this.user_id = response.app_id;
            console.log(this.radio2);
          })
          .catch(error => {
            console.log(error); //loading层关闭
          });

        this.$alert(
          "<p>重新分配会清空此项目当前的配置信</br>请确认是否重新分配</p>",
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
            httpServer(apiSetting.organization)
              .then(response => {
                console.log("我是弹窗1");
                console.log(response);
                this.departList = response;
                this.dalogloading = false;
              })
              .catch(error => {
                this.loading = false;
                console.log(error); //loading层关闭
              });
            this.showDialog = true;
          })
          .catch(() => {
            console.log("不重新分配了");
          });
      }
    },
    submitAllot() {
      console.log(this.radio2);
      if (this.radio1 == 0) {
        this.radioText = "*请选择分配成员才能提交";
        return false;
      }
      this.loginContent.onColse = true;
      this.loginContent.content = "提交中";
      httpServer(apiSetting.putDistribution, {
        user_id: this.radio1,
        app_id: this.appid,
        exigence: this.radio2
      })
        .then(response => {
          console.log("我是弹窗put提交数据");
          this.submitAllotName = response;
          console.log(response);
          this.loginContent.onColse = false;
          this.loginContent.content = "提交";
          this.showDialog = false;
          // 提交成功重新获取数据
          this.getAppTypeList();
          this.getCoundBycode();
          // 分配成功  提示
          this.html =
            "<p>活动分配成功<br/>已发送至 " +
            this.submitAllotName +
            " 等待配置</p>";
          this.showSaasDialog = true;
          let _this = this;
          let timer = setTimeout(function() {
            _this.showSaasDialog = false;
            clearTimeout(_this.timer);
          }, 2000);

          // this.$alert(
          //     "<p>活动分配成功<br/>已发送至 " +
          //         this.submitAllotName +
          //         " 等待配置</p>",
          //     "",
          //     {
          //         showConfirmButton: false,
          //         showCancelButton: false,
          //         dangerouslyUseHTMLString: true,
          //         customClass: "hintDialog",
          //         closeOnClickModal: true
          //     }
          // ).catch(() => {
          //     console.log("不重新分配了");
          // });
        })
        .catch(error => {
          console.log(error); //loading层关闭
        });
    },
    // 分配人员   部门切换
    choseDepart(index) {
      this.departIndex = index;
    },
    // 查看资源
    lookResouce(index) {
      this.showResouceDialog = true;
      this.lookindex = index;
      console.log("索引");
      console.log(index);
    },
    //  获取table选项
    getAppTypeList(num) {
      httpServer(apiSetting.getAppTypeCount_list, {
        statusCode: this.$customState.app_status_code_200 //默认30因为导航角标永远代表着未分配的数量
      })
        .then(response => {
          this.$nextTick(function() {
            this.countNum = true;
          });
          // console.log('table')
          if (num == 0) {
            //num等于0的话代表着第一次进来需要把数据第一个id传过去
            this.inquire.id = response[0].id; //默认type取第一个
          }
          this.activeType = response;
          this.getAllotlist();
          console.log("table");
          // console.log(response)
        })
        .catch(error => {
          this.loading = false;
          console.log(error); //loading层关闭
        });
    },
    showDialogQuxiao() {
      //点击取消弹窗重置
      this.showDialog = false;
      this.seachListpen = true;
      this.seachName = "";
      this.seachNameclick_close = false;
      this.radioText = "";
    },
    //  获取列表请求
    getAllotlist(flagName) {
      //传值是为了区分是搜索还是正常渲染，因为搜索的时候暂无数据的提示和图片不一样
      clearInterval(this.timerk2);
      this.isclickshow = false;
      let timer2 = null; //声明定时器
      this.itemList = [];
      this.itemListloading = false;
      httpServer(apiSetting.getAllotlist, {
        Name: this.seachValue,
        ProductClass: this.inquire.id,
        AppStatusCode: this.inquire.statue,
        PageIndex: this.page.pageIndex,
        PageSize: this.page.pageSize
      })
        .then(response => {
          this.isclickshow = true;
          this.mainloading = false;
          console.log("分配列表");
          console.log(response);
          this.dataTypeList = response.collection;
          this.itemListloading = true;

          console.log("分配列表");

          let item = response.collection; //你的接口数据
          let index = 0;
          if (item.length > 0) {
            //但数据大于0的时候可以执行渲染
            this.no_data = false;
            this.seacherno_data = false;
            // clearInterval(timer);
            this.timerk2 = setInterval(() => {
              if (index == item.length - 1) {
                //接口数据已经全部放入渲染列表中，清除定时器
                clearInterval(this.timerk2);
              }
              this.itemList.push(item[index]); //将你的接口数据push到你需要渲染的列表里
              index++;
            }, 120);
            this.$getMid_notify("activeAllot");
          } else {
            this.$getMid_notify("activeAllot");
            this.isclickshow = true;
            if (flagName) {
              //表示搜索的时候没有数据
              this.no_data = false;
              this.seacherno_data = true;
            } else {
              this.seacherno_data = false;
              this.no_data = true;
            }
            console.log("没有数据");
          }
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
        this.getAllotlist("seach"); //搜索请求列表
      }
    },
    getCoundBycode() {
      httpServer(apiSetting.getCoundBycode)
        .then(response => {
          console.log("我是头部列表");
          console.log(response);
          this.topArry.whole_count = response.whole_count;
          this.topArry.wait_count = response.wait_count;
          this.topArry.already_count = response.already_count;
        })
        .catch(error => {
          this.loading = false;
          console.log(error); //loading层关闭
        });
    },
    changeclick(value) {
      console.log("我是改变单选");
      this.radio1 = value;
      console.log(value);
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
#activeAllot .el-pagination__sizes .el-input .el-input__inner {
  width: 108px;
}
#activeAllot .el-icon-loading {
  margin-right: -9px;
}
</style>
<style scoped lang="less">
#activeAllot {
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
          background: url(../../../assets/images/images/item2.png);
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
            width: 275px;
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
                padding-top: 10px;
              }
              .externalName {
                width: 230px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
            .activeAllot_msg {
              padding: 10px;
              font-size: 12px;
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
                    background: url(../../../assets/images/images/resourse.png)
                      no-repeat left center;
                    background-size: 12px 12px;
                  }
                  span {
                    float: left;
                    color: #ffb735;
                    padding-left: 5px;
                    .el-icon-view {
                      margin-right: 5px;
                    }
                  }
                }
                .allot_name {
                  float: right;
                }
              }
              .activeAllot_btn {
                text-align: center;
                position: relative;
                margin-top: 15px;
                button {
                  font-size: 12px;
                  cursor: pointer;
                  width: 80px;
                  height: 30px;
                  border-radius: 5px;
                  color: #ffffff;
                  padding: 0;
                  margin-right: 0px;
                }
                button.lansespan {
                  background-image: linear-gradient(
                    42deg,
                    #4900e0 0%,
                    #8d2de2 100%
                  );
                }
                button.lansespan:hover {
                  font-size: 13px;
                  background-image: linear-gradient(
                    42deg,
                    #5805ff 0%,
                    #9526f5 100%
                  );
                }
                button.huisespan {
                  background-color: #c2c2c2;
                }
                .active_status,
                .active_priority {
                  font-size: 10px;
                  position: absolute;
                  top: 8px;
                  span {
                    display: inline-block;
                    width: 8px;
                    height: 8px;
                    background-color: #5ff333;
                    border-radius: 50%;
                    margin-right: 5px;
                  }
                  .redspan {
                    background-color: #e83531;
                  }
                  .yellowspan {
                    background-color: #ffb833;
                  }
                }
                .active_status {
                  left: 0px;
                  width: 84px;
                  white-space: normal;
                }
                .active_priority {
                  right: 0px;
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
  .dialog_tab_list {
    ul {
      overflow: hidden;
      li {
        float: left;
        width: 70px;
        height: 32px;
        background-color: #f5efff;
        line-height: 32px;
        color: #000;
        font-size: 12px;
        text-align: center;
        margin-right: 10px;
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
        margin-top: 20px;
        cursor: pointer;
      }
      .departActive {
        background: #996aec;
        color: #fff;
      }
    }
  }
  .dialog_person {
    height: 110px;
    overflow-y: auto;
    background-color: #f5f5f5;
    border: solid 1px #996aec;
    padding: 20px 20px 0px 20px;
    .el-radio-group {
      // margin-left: -55px;
      .el-radio {
        overflow: hidden;
        width: 165px;
        color: #433d3d;
        line-height: 0px;
        margin: 0px;
        margin-bottom: 15px;
      }
    }
  }
  .seachList {
    .el-radio-group {
      // margin-left: -55px;
      .el-radio {
        width: 250px;
        overflow: hidden;
      }
    }
  }
  .priority_box {
    margin-top: 20px;
    span {
      padding-right: 10px;
    }
  }
  .resourceList {
    ul {
      overflow: hidden;
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
}
</style>
     
     