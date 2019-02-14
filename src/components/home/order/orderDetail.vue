<template>
  <div id="orderDetail">
    <p class="content-title">
      <span>订单管理</span>
      <i class="el-icon-arrow-right content-title-jiantou"></i>
      <span class="content-last-title">我的订单</span>
    </p>
    <div class="returnBtn" @click="backUp">
      <i></i> 返回
    </div>
    <div class="active_header">
      <div class="active_header_title">
        <i></i>基础数据
      </div>
      <div class="active_header_msg">
        <div id="indexLaga">
          <img v-if="biWeixincode" class="active_header_img" :src="appDetaildata.qrcode" alt>
          <img
            v-if="!biWeixincode"
            class="active_header_img"
            src="../../../assets/images/images/noSet.png"
            alt
          >
        </div>

        <p
          class="active_header_msg_title"
        >{{appDetaildata.app_num}}&nbsp;&nbsp;—&nbsp;&nbsp;{{appDetaildata.app_name}}</p>
        <p>
          <span>
            授权资源：{{appDetaildata.grant_material}}个
            <i
              @click="lookResouceDialog"
              class="el-icon-view"
            >查看</i>
          </span>
          <span>活动类型：{{appDetaildata.type_name}}</span>
        </p>
        <p v-if="biWeixincode">
          活动预览：
          <span class="active_header_span">
            <a :href="appDetaildata.domainurl" target="view_window">{{appDetaildata.domainurl}}</a>
          </span>
        </p>
        <p v-if="!biWeixincode">活动预览：本活动中不包含平台码，无H5页面</p>
        <p>项目周期：{{appDetaildata.onlinetime}}至{{appDetaildata.offlinetime}}</p>
      </div>
    </div>
    <div class="active_header order_data">
      <div class="active_header_title">
        <i></i>订单数据
      </div>
      <div class="exportbtn" @click="exportCost">
        <i class="exportIcon"></i>订单数据导出
      </div>
      <ul>
        <li
          :class="[{'all_orders': index==0},{'sucess_orders':index == 1},{'fail_orders':index== 2,}]"
          v-for="(orderState,index) in orderStateList"
          :key="index"
        >
          <span>
            {{orderState.title}}
            <i>(个)</i>
          </span>
          <p v-if="index == 0">{{statiSticsNum.total_number}}</p>
          <p v-if="index == 1">{{statiSticsNum.successful_number}}</p>
          <p v-if="index == 2">{{statiSticsNum.failed_number}}</p>
        </li>
      </ul>
    </div>
    <div class="preview_content data_detail" v-loading="loading">
      <div class="active_header_title">
        <i></i>详细数据
      </div>
      <div class="activeAllot_box_search">
        <i class="el-icon-search"></i>
        <i class="el-icon-close" v-if="seachclick_close" @click="seachclick(0)"></i>
        <input
          @keyup.13="seachValue?seachclick():''"
          v-model="seachValue"
          type="text"
          placeholder="请输入订单编号或手机号"
          @input="seachValue==''?seachclick_close=false:seachclick_close=true"
        >
        <span class="seach" @click="seachValue?seachclick():''">搜索</span>
      </div>
      <div class="filterItem">
        <el-select v-model="sendType" placeholder="请选择发放类型" @change="selectSendType">
          <el-option label="---发放类型---" value="0"></el-option>
          <el-option label="平台码" value="1"></el-option>
          <el-option label="原始码" value="2"></el-option>
          <el-option label="直接充值" value="3"></el-option>
        </el-select>
        <el-select v-model="resouceType" placeholder="请选择资源名称" @change="selectResouceType">
          <el-option label="---资源名称---" value="0"></el-option>
          <el-option
            v-for="(material,mIndex) in materialNameList"
            :key="mIndex"
            :label="material.material_name"
            :value="material.id"
            v-if="material.grant_type  == sendType || sendType==0"
          ></el-option>
        </el-select>
        <el-select v-model="selectState" placeholder="请选择状态" @change="selectSendState">
          <el-option label="---状态---" value="100"></el-option>
          <el-option label="待发放" value="0"></el-option>
          <el-option label="发放成功" value="1"></el-option>
          <el-option label="发放失败" value="-1"></el-option>
          <el-option label="兑换成功" value="11"></el-option>
          <el-option label="兑换失败" value="3"></el-option>
          <el-option label="充值成功" value="2"></el-option>
          <el-option label="充值失败" value="4"></el-option>
          <el-option label="充值中" value="5"></el-option>
        </el-select>
      </div>
      <div class="table">
        <ul>
          <li class="table_title">
            <span class="orderNumber">订单编号</span>
            <span class="sendType_table">发放类型</span>
            <span class="sendType_table">资源类型</span>
            <span class="reasouceName">资源名称</span>
            <span class="send_Time">发放时间</span>
            <span class="open_id">发放号码/openid</span>
            <span class="order_state">状态</span>
            <span class="order_operation">操作</span>
          </li>
          <li class="table_item" v-for="(item,index) in itemList" :key="index">
            <!-- 非直接充值的订单展示 -->
            <div class="table_item_top" v-if="item.grant_type != 3">
              <div class="orderNumber">{{item.id}}</div>
              <div class="sendType_table">
                <el-tooltip
                  v-if="item.grant_type == 1"
                  class="item"
                  effect="dark"
                  :content="item.redeem_code?item.redeem_code:'暂无'"
                  placement="top"
                >
                  <span>平台码</span>
                </el-tooltip>
                <el-tooltip
                  v-if="item.grant_type == 2"
                  class="item"
                  effect="dark"
                  :content="item.original_code?item.original_code:'暂无'"
                  placement="top"
                >
                  <span>原始码</span>
                </el-tooltip>
                <span v-if="item.grant_type==3">直接充值</span>
              </div>
              <div class="sendType_table">{{item.material_type_name}}</div>
              <div class="reasouceName">{{item.material_name}}</div>
              <div class="send_Time sendTime">
                <p>
                  {{item.release_time | noticdata}}
                  <br>
                  {{item.release_time | noticTime}}
                </p>
              </div>
              <div class="open_id">{{item.resms_mobile?item.resms_mobile:item.recharge_number}}</div>
              <div class="order_state">
                <span v-if="item.order_status==0 && item.is_send_message == -1">
                  <i class="faile_icon"></i>发放失败
                </span>
                <span v-if="item.order_status==0 && item.is_send_message == 1">
                  <i class="fafang_icon"></i>发放成功
                </span>
                <span v-if="item.order_status==0 && item.is_send_message == 0">
                  <i class="stay_out_icon"></i>待发放
                </span>
                <span v-if="item.order_status == 1">
                  <i class="success_icon"></i>兑换成功
                </span>
                <span v-if="item.order_status == 2">
                  <i class="success_icon"></i>充值成功
                </span>
                <span v-if="item.order_status == 3">
                  <i class="faile_icon"></i>兑换失败
                </span>
                <span v-if="item.order_status == 4">
                  <i class="faile_icon"></i>充值失败
                </span>
              </div>
              <div class="order_operation">
                <p class="operationBtn">
                  <el-tooltip
                    v-if="item.order_status == 0 && item.grant_type!=3"
                    class="item"
                    effect="dark"
                    content="重新发送"
                    placement="top"
                  >
                    <span
                      @click="resendFun(item.recharge_number,item.id,item.app_id,item.grant_type)"
                      class="resendIcon"
                    ></span>
                  </el-tooltip>
                  <!-- 不能点击重新发送的按钮 -->
                  <span class="noresendIcon" v-if="item.order_status != 0"></span>
                  <el-tooltip class="item" effect="dark" content="详细信息" placement="top">
                    <span @click="resendDetailFun(item)" class="el-icon-view resendDetail"></span>
                  </el-tooltip>
                </p>
              </div>
            </div>
            <!-- 直接充值的订单展示的 -->
            <el-collapse
              accordion
              v-model="activeName"
              v-if="item.grant_type==3"
              @change="getChildrenOrder(item.id)"
            >
              <el-collapse-item :name="index">
                <template slot="title">
                  <div class="table_item_top">
                    <div class="orderNumber">{{item.id}}</div>
                    <div class="sendType_table">
                      <el-tooltip
                        v-if="item.grant_type == 1"
                        class="item"
                        effect="dark"
                        :content="item.redeem_code?item.redeem_code:'暂无'"
                        placement="top"
                      >
                        <span>平台码</span>
                      </el-tooltip>
                      <el-tooltip
                        v-if="item.grant_type == 2"
                        class="item"
                        effect="dark"
                        :content="item.original_code?item.original_code:'暂无'"
                        placement="top"
                      >
                        <span>原始码</span>
                      </el-tooltip>
                      <span v-if="item.grant_type==3">直接充值</span>
                    </div>
                    <div class="sendType_table">{{item.material_type_name}}</div>
                    <div class="reasouceName">{{item.material_name}}</div>
                    <div class="send_Time sendTime">
                      <p>
                        {{item.release_time | noticdata}}
                        <br>
                        {{item.release_time | noticTime}}
                      </p>
                    </div>
                    <div
                      class="open_id"
                    >{{item.resms_mobile?item.resms_mobile:item.recharge_number}}</div>
                    <div class="order_state">
                      <span v-if="item.order_status==0 && item.is_send_message == -1">
                        <i class="faile_icon"></i>发放失败
                      </span>
                      <span v-if="item.order_status==0 && item.is_send_message == 1">
                        <i class="fafang_icon"></i>发放成功
                      </span>
                      <span v-if="item.order_status==0 && item.is_send_message == 0">
                        <i class="stay_out_icon"></i>待发放
                      </span>
                      <span v-if="item.order_status == 1">
                        <i class="success_icon"></i>兑换成功
                      </span>
                      <span v-if="item.order_status == 2">
                        <i class="success_icon"></i>充值成功
                      </span>
                      <span v-if="item.order_status == 3">
                        <i class="faile_icon"></i>兑换失败
                      </span>
                      <span v-if="item.order_status == 4">
                        <i class="faile_icon"></i>充值失败
                      </span>
                      <span v-if="item.order_status == 5">
                        <i class="stay_out_icon"></i>充值中
                      </span>
                    </div>
                    <div class="order_operation">
                      <p class="operationBtn">
                        <el-tooltip
                          v-if="item.order_status == 0 && item.grant_type!=3"
                          class="item"
                          effect="dark"
                          content="重新发送"
                          placement="top"
                        >
                          <span
                            @click="resendFun(item.recharge_number,item.id,item.app_id,item.grant_type)"
                            class="resendIcon"
                          ></span>
                        </el-tooltip>
                        <span
                          class="el-icon-arrow-down"
                          :class="{Btnrotate: ShowChildListIndex==index && ShowChildListIndex !=''}"
                        ></span>
                        <!-- 不能点击重新发送的按钮 -->
                        <el-tooltip class="item" effect="dark" content="详细信息" placement="top">
                          <span
                            @click.stop="resendDetailFun(item)"
                            class="el-icon-view resendDetail"
                          ></span>
                        </el-tooltip>
                      </p>
                    </div>
                  </div>
                </template>
                <!--直接充值的子订单  -->
                <div class="Direct_top_up" v-loading="childOrderLoading">
                  <ul>
                    <li v-for="(childrenList,childIndex) in childrenOrderList" :key="childIndex">
                      <div class="orderNumber childOrderNumber">{{childrenList.id}}</div>
                      <div class="reasouceName">{{childrenList.material_name}}</div>
                      <div class="order_state">
                        <span v-if="childrenList.order_status==4">
                          <i class="faile_icon"></i>充值失败
                        </span>
                        <span v-if="childrenList.order_status==2">
                          <i class="success_icon"></i>充值成功
                        </span>
                        <span v-if="childrenList.order_status==0">
                          <i class="stay_out_icon"></i>待发放
                        </span>
                        <span v-if="childrenList.order_status==5">
                          <i class="stay_out_icon"></i>充值中
                        </span>
                      </div>
                      <div class="order_operation">
                        <p class="operationBtn">
                          <el-tooltip
                            class="item"
                            effect="dark"
                            content="重新发送"
                            placement="top"
                            v-if="childrenList.order_status==4"
                          >
                            <span
                              @click="resendFun(childrenList.recharge_number,childrenList.id,childrenList.app_id,childrenList.grant_type,childrenList.main_order_id)"
                              class="resendIcon"
                            ></span>
                          </el-tooltip>

                          <!-- 不能点击重新发送的按钮 -->
                          <span
                            v-if="childrenList.order_status==2 || childrenList.order_status == 0"
                            class="noresendIcon"
                          ></span>
                          <span class="resendDetail childOrderResendDetail"></span>
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </el-collapse-item>
            </el-collapse>
          </li>
        </ul>
        <p class="nodata_tip" v-if="nodata_tip">暂无数据</p>
      </div>
    </div>
    <!-- 重新发送弹框 -->
    <el-dialog class="resendDialog" title="重新发送" :visible.sync="resendDialog" :lock-scroll="false">
      <div>
        <p class="originalPhone">
          <i></i>
          初始手机号：{{recharge_number}}
        </p>
        <div class="radioBox">
          <el-form :model="resendForm" :rules="resendRules" ref="resendForm" @submit.native.prevent>
            <el-radio-group v-model="resendForm.resendRadio" @change="changeradio">
              <el-radio
                class="firstRadio"
                :label="0"
              >{{grantType==3?"是否充值至":"是否发送至"}}：{{recharge_number}}</el-radio>
              <el-radio :label="1">
                <el-form-item class="resendPhone" prop="phone">
                  {{grantType==3?"充值至新手机号":"发送至新手机号"}}：
                  <el-input
                    type="text"
                    :disabled="radioDisabled"
                    v-model="resendForm.phone"
                    auto-complete="off"
                    maxlength="11"
                    placeholder="请输入手机号"
                  ></el-input>
                </el-form-item>
              </el-radio>
            </el-radio-group>
          </el-form>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resendDialog = false">取 消</el-button>
        <el-button
          type="primary"
          :loading="loadingOnce"
          @click="!loadingOnce?submitResendForm():''"
        >确 定</el-button>
      </div>
    </el-dialog>
    <!-- 重新发送  提示-->
    <el-dialog
      class="resendDialog"
      title="重新发送"
      :visible.sync="resendReminderDialog"
      :lock-scroll="false"
    >
      <div>
        <p class="originalPhone">
          <i></i>初始手机号：17327648983
        </p>
        <p class="resendReminderText">该openid已成功发送，24小时后用户未领取，可重新发送</p>
        <!-- <p class="resendReminderText">该openid已成功发送，已超过24小时用户未领取，是否重新发送</p> -->
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resendReminderDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitResendReminderForm()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 详细信息弹框 -->
    <el-dialog
      class="resendDialog"
      title="详细信息"
      :visible.sync="resendDatailDialog"
      :lock-scroll="false"
    >
      <div>
        <p class="originalPhone">
          <i></i>
          初始手机号：{{recharge_number}}
        </p>
        <div class="radioBox" v-loading="resendDatailLoading">
          <p class="originalPhone">
            <i></i>发送记录
          </p>
          <ul class="resendDatailList">
            <li v-for="(item,index) in resendDatailList" :key="index">
              <span>{{index+1}}</span>
              {{item.create_date_time}}&nbsp;&nbsp;号码&nbsp;&nbsp;{{item.mobile}}&nbsp;&nbsp;{{item.material_name}}&nbsp;&nbsp;
              <i
                class="sendSuccess"
                v-if="item.is_send==1"
              >发放成功</i>
              <i v-if="item.is_send==-1" class="sendFail">发放失败</i>
              <i v-if="item.is_send==5" class="theTopUp">充值中</i>
            </li>
            <p class="noresendDatailTip" v-if="noresendDatailTip">暂无数据</p>
          </ul>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button @click="resendDatailDialog = false">取 消</el-button> -->
        <el-button type="primary" @click="resendDatailDialog = false;resendDatailList=[]">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 查看资源的弹框 -->
    <el-dialog title="授权资源" :visible.sync="showResouceDialog" class="resourceDialog">
      <div class="resourceList">
        <p class="resourceList_title">
          <i></i>授权资源
        </p>
        <ul>
          <li :title="item.material_name" v-for="(item,index) in Hairresources" :key="index">
            <span class="resouce_num">{{index+1}}</span>
            <div class="resouce_name">
              <div class="resouce_img_f">
                <img :src="item.icon" alt="资源图片">
              </div>
              <span>{{item.material_name}}</span>
            </div>
          </li>
          <p v-if="Hairresources.length<=0" style="text-align:center">暂无使用资源</p>
        </ul>
      </div>
      <div class="resourceList">
        <p class="resourceList_title">
          <i></i>使用资源
        </p>
        <ul>
          <li :title="item.material_name" v-for="(item,index) in isSued" :key="index">
            <span class="resouce_num">{{index+1}}</span>
            <div class="resouce_name">
              <div class="resouce_img_f">
                <img :src="item.icon" alt="资源图片">
              </div>
              <span>{{item.material_name}}</span>
            </div>
          </li>
          <p v-if="isSued.length<=0" style="text-align:center">暂无使用资源</p>
        </ul>
      </div>
      <div slot="footer" class="dialog-footer resourceListFooter">
        <el-button type="primary" @click="showResouceDialog = false">确 定</el-button>
      </div>
    </el-dialog>
    <download-popup
      :childModel="childArry"
      @childByValue="childByValue"
      @childByfatherSuccess="childByfatherSuccess"
    ></download-popup>
    <saas-dialog :html="html" v-if="showSaasDialog"></saas-dialog>
    <!-- itemListloading判断是为了阻止分页点击过快做成的bug,注意下面还有样式 -->
    <el-pagination
      :key="Math.random()"
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
const downloadPopup = () =>
  import(/* webpackChunkName:"downloadPopup" */ "../../dialog/downloadPopup");

import Viewer from "viewerjs";
import "viewerjs/dist/viewer.css";
import { throws } from "assert";

export default {
  name: "orderDetail",
  components: {
    downloadPopup,
    saasDialog
  },
  props: {},
  data() {
    return {
      sendType: "0",
      resouceType: "0",
      selectState: "100",
      mainOrderId: "",
      loading: false,
      childOrderLoading: false,
      seachclick_close: false, //主页的搜索按钮叉号
      seachValue: "",
      Hairresources: [], //第一个资源弹窗里的上半部分
      isSued: [], //发放时间的列表
      appDetaildata: {}, // 接收上半部分信息的数据
      noresendDatailTip: false, //默认不显示
      statiSticsNum: {},
      radioDisabled: true,
      showSaasDialog: false,
      resendDatailLoading: false, //发送记录的loading
      materialNameList: {}, //资源名称列表
      activeName: "",
      isNew: false,
      grantType: 0,
      ShowChildListIndex: "",
      childArry: {
        //导出报表弹框 --通知给子组件的
        showReportDialog: false,
        appId: this.$getsessionStorage("appid"),
        routernName: "orderDetail"
      },
      showResouceDialog: false,
      recharge_number: "", //重新发送的初始手机号码
      // 重新发送的表单
      resendDialog: false,
      loadingOnce: false, //重新发送的loading提示
      page: page,
      itemListloading: true, //如果列表正在请求中分页就不能触发，不然会有bug
      nodata_tip: false, //表格有无数据 的暂无数据提示
      no_data: false,
      resendDatailList: [], //点击查看详情信息数组
      dataList: [],
      childrenOrderList: {},
      itemList: [],
      resendForm: {
        resendRadio: 0,
        phone: ""
      },
      retransmission: {
        id: "",
        app_id: "",
        material_id: "",
        resms_mobile: ""
      },
      // 重新发送的表单 验证
      resendRules: {
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
            trigger: "blur"
          }
        ]
      },
      // 重新发送的表单 提示
      resendReminderDialog: false,
      // 详细信息弹框
      resendDatailDialog: false,
      // 是否展示二维码
      isWeixincode: false,
      biWeixincode: false,
      // 订单状态
      orderStateList: [
        {
          title: "订单总数量",
          num: "123"
        },
        {
          title: "成功订单",
          num: "123"
        },
        {
          title: "失败订单",
          num: "123"
        }
      ],
      orderStateIndex: 0,
      releaseStatus: 0,
      // 导出报表弹框
      showReportDialog: false
    };
  },
  beforeRouteLeave(to, from, next) {
    if (to.name != "myOrder") {
      sessionStorage.removeItem("myOrder");
    }
    next();
  },
  filters: {
    //过滤器
    noticdata(val) {
      if (val) {
        let noticdata = val.slice(0, 10);
        return noticdata;
      }
    },
    noticTime(val) {
      if (val) {
        let noticTime = val.slice(10);
        return noticTime;
      }
    }
  },
  mounted() {
    this.getAppdetailTop();
    this.ordergetApprderInfo();
    this.getMateriaNameList();
    // 此处为图片查看器
    const ViewerDom = document.getElementById("indexLaga");
    const viewer = new Viewer(ViewerDom, {
      // 配置
    });
    let $emit = this;
    this.page.pageIndex = 1;
    $emit.page.pageSize = 30; //修改每页显示数
    $emit.page.pageSizeList = [30, 60, 90]; //修改可以下拉框选择的每页显示数
    this.getList();

    //分页调用的获取列表方法
    $emit.page.query = function() {
      if ($emit.itemListloading) {
        $emit.getList($emit.typeid);
        this.itemList = [];
        $emit.itemListloading = false; //以防分页点击过快的flag节流阀
      }
    };
    apiSetting.ordergetOrderList.page = this.page; //api接口分页赋值
    apiSetting.ordergetOrderList.dataList = this.dataList; //api分页数据赋值
  },
  methods: {
    // //导出报表
    exportCost() {
      this.childArry.showReportDialog = true;
    },
    // 和子组件通信---导出弹窗--子组件传过来的方法和参数
    childByValue(childByValue) {
      console.log("我是子组件传过来的");
      console.log(childByValue);
      this.childArry.showReportDialog = childByValue.childshow;
      // this.html = "<p>名单导入成功</p>";
      // this.showSaasDialog = childByfatherSuccess;
      // let _this = this;
      // let timer = setTimeout(function() {
      //     _this.showSaasDialog = false;
      // }, 2000);
    },
    // 和子组件通信---导出弹窗--子组件传过来的方法和参数
    childByfatherSuccess(childByfatherSuccess) {
      this.childArry.showReportDialog = !childByfatherSuccess;
      this.html = "<p>操作成功</p>";
      this.showSaasDialog = childByfatherSuccess;
      let _this = this;
      let timer = setTimeout(function() {
        _this.showSaasDialog = false;
      }, 2000);
    },
    backUp() {
      // this.$router.back(-1);
      // 订单详情是 我的订单 and 订单总览 共用的  所以返回的时候要区分
      if (this.$route.query.tabName == "orderPandect") {
        this.$router.push({
          name: "orderPandect",
          params: {
            tabName: "orderDetail",
            page: this.$route.query.page,
            ordertypeIndex: this.$route.query.ordertypeIndex,
            activeTypeIndex: this.$route.query.activeTypeIndex,
            inquire: {
              id: this.$route.query.inquire.id,
              statue: this.$route.query.inquire.statue
            }
          }
        });
      } else if (this.$route.query.tabName == "myOrder") {
        this.$router.push({
          name: "myOrder",
          params: {
            tabName: "orderDetail",
            page: this.$route.query.page,
            ordertypeIndex: this.$route.query.ordertypeIndex,
            activeTypeIndex: this.$route.query.activeTypeIndex,
            inquire: {
              id: this.$route.query.inquire.id,
              statue: this.$route.query.inquire.statue
            }
          }
        });
      }
    },
    lookResouceDialog() {
      // alert("sss");
      this.showResouceDialog = true;
    },
    // 获取活动预览的   上半部分信息
    getAppdetailTop() {
      httpServer(apiSetting.appDetailTop, {
        appId: this.$getsessionStorage("appid"),
        template_id: this.$getsessionStorage("template_id")
      })
        .then(response => {
          console.log("是吧是吧");
          console.log(response);
          this.appDetaildata = response;
          this.lookToploading = false;
          // this.app_status_code = response.app_status_code;
          this.getMaterialInfo();
          this.getUseMaterialByAppId();
          // this.loading = false;
        })
        .catch(error => {
          this.loading = false;
        });
    },
    // 订单数据统计【获取订单数量】
    ordergetApprderInfo() {
      httpServer(apiSetting.ordergetApprderInfo, {
        app_id: this.$getsessionStorage("appid")
      })
        .then(response => {
          this.statiSticsNum = response;
        })
        .catch(error => {
          this.loading = false;
        });
    },
    // 筛选条件的资源名称列表【获取中台使用资源】
    getMateriaNameList() {
      httpServer(apiSetting.ordergetMaterialNameList, {
        app_id: this.$getsessionStorage("appid")
      })
        .then(response => {
          console.log(response);
          this.materialNameList = response;
        })
        .catch(error => {
          this.loading = false;
        });
    },
    // 选择发放类型
    selectSendType() {
      this.resouceType = "0";
      this.page.pageIndex = 1;
      this.activeName = "";
      this.getList();
    },
    // 选择资源名称
    selectResouceType() {
      this.page.pageIndex = 1;
      this.activeName = "";
      this.getList();
    },
    // 选择资状态
    selectSendState() {
      this.page.pageIndex = 1;
      this.activeName = "";
      this.getList();
    },
    // 获取主订单列表（主订单）
    getList() {
      this.itemListloading = false;
      this.loading = true;
      // this.isclickshow = false;
      httpServer(apiSetting.ordergetOrderList, {
        app_id: this.$getsessionStorage("appid"),
        grant_type: this.sendType,
        mid_material_allot_id: this.resouceType,
        release_status: this.selectState,
        PageIndex: this.page.pageIndex,
        PageSize: this.page.pageSize,
        Conditions: this.seachValue //搜索条件
      })
        .then(response => {
          this.dataList = apiSetting.ordergetOrderList.dataList;
          this.itemList = apiSetting.ordergetOrderList.dataList;
          this.itemListloading = true;
          this.loading = false;
          if (apiSetting.ordergetOrderList.dataList.length <= 0) {
            this.nodata_tip = true;
            this.no_data = true;
          } else {
            this.nodata_tip = false;
            this.no_data = false;
          }
          console.log(apiSetting.ordergetOrderList.dataList.length);
        })
        .catch(error => {
          this.loading = false;
        });
    },
    // 获取子订单列表（子订单）
    getChildrenOrder(id) {
      this.ShowChildListIndex = this.activeName;
      this.childOrderLoading = true;
      httpServer(apiSetting.ordergetChildrenOrderList, {
        id: id,
        app_id: this.$getsessionStorage("appid")
      })
        .then(response => {
          this.childrenOrderList = response;
          this.childOrderLoading = false;
        })
        .catch(error => {
          this.childOrderLoading = false;
          this.loading = false;
        });
    },
    getMaterialInfo() {
      httpServer(apiSetting.getMaterialInfo, {
        app_id: this.$getsessionStorage("appid")
      })
        .then(response => {
          console.log("资源礼物");
          console.log(response);
          this.Hairresources = response;
        })
        .catch(error => {
          // this.loading = false;
        });
    },
    changeradio(index) {
      console.log(this.resendForm.resendRadio);
      if (index == 1) {
        this.radioDisabled = false;
      } else {
        this.resendForm.resendRadio = ""; //选择0位 传空
      }
    },
    getUseMaterialByAppId() {
      //发放时间的弹窗
      httpServer(apiSetting.getUseMaterialByAppId, {
        app_id: this.$getsessionStorage("appid")
      })
        .then(response => {
          this.isSued = response;
          // 判断 下半部分 资源列表 是否含有平台码
          for (var i in response) {
            // console.log(response[i].grant_type);
            if (response[i].grant_type == 1) {
              this.biWeixincode = true;
              return false;
            } else {
              this.biWeixincode = false;
            }
          }
        })
        .catch(error => {
          // this.loading = false;
        });
    },
    //根据订单编号或者手机号查询订单
    seachclick(a) {
      if (a == 0) {
        this.seachValue = "";
      }
      this.page.pageIndex = 1;
      this.getList("seach"); //搜索请求列表
    },
    submitResendForm() {
      if (this.resendForm.resendRadio == 1) {
        //触发验证
        this.$refs.resendForm.validate(valid => {
          if (valid) {
            this.retransmission.resms_mobile = this.resendForm.phone;
            this.isNew = true;
            this.updatePhoneResendMessage();
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      } else {
        this.retransmission.resms_mobile = ""; //默认发送为空代表发送之前的号码
        this.isNew = false;
        this.updatePhoneResendMessage();
      }
    },
    updatePhoneResendMessage() {
      this.loadingOnce = true;

      httpServer(apiSetting.updatePhoneResendMessage, {
        id: this.retransmission.id,
        app_id: this.retransmission.app_id,
        is_new: this.isNew,
        resms_mobile: this.retransmission.resms_mobile
      })
        .then(response => {
          this.getList();
          this.getChildrenOrder(this.mainOrderId);
          this.resendDialog = false;
          this.loadingOnce = false;
        })
        .catch(error => {
          this.$message({
            message: error.data.message,
            duration: 1000
          });
          this.resendDialog = false;
          this.loadingOnce = false;
        });
    },
    // 重新发送按钮
    resendFun(recharge_number, id, app_id, grant_type, main_order_id) {
      this.recharge_number = recharge_number;
      this.retransmission.id = id;
      this.retransmission.app_id = app_id;
      this.grantType = grant_type;
      this.mainOrderId = main_order_id;
      // 重置数据
      this.resendForm.resendRadio = 0;
      this.radioDisabled = true;
      this.resendForm.phone = "";
      this.loadingOnce = false;
      if (this.$refs["resendForm"] !== undefined) {
        this.$refs["resendForm"].resetFields();
      }
      // 这是手机号重发
      this.resendDialog = true;
      // 这是红包重发
      // this.resendReminderDialog = true;
    },
    // 订单数据  卡片切换筛选功能
    // changOrderData(index) {
    //   this.orderStateIndex = index;
    //   if (index == 0) {
    //     this.releaseStatus = 0;
    //   } else if (index == 1) {
    //     this.releaseStatus = 1;
    //   } else {
    //     this.releaseStatus = -1;
    //   }
    //   this.isclickshow = false;

    //   this.getList();
    //   console.log(index);
    // },
    // 信息详情按钮
    resendDetailFun(item) {
      this.resendDatailLoading = true;
      this.recharge_number = item.recharge_number;
      this.resendDatailList = [];

      httpServer(apiSetting.orderGetsmsInfos, {
        app_id: item.app_id,
        material_id: item.material_id,
        mid_material_allot_id: item.mid_app_material_id,
        direct_contacts_id: item.id,
        grant_type: item.grant_type
      })
        .then(response => {
          this.resendDatailLoading = false;
          if (response.length <= 0) {
            this.noresendDatailTip = true;
          } else {
            this.resendDatailList = response;
            this.noresendDatailTip = false;
          }
        })
        .catch(error => {
          this.resendDatailLoading = false;
          this.loading = false;
        });
      this.resendDatailDialog = true;
    }
  }
};
</script>
<style>
#orderDetail .resendDialog .el-dialog {
  max-height: 420px;
}
#orderDetail .resendDialog .el-dialog .el-dialog__header {
  border-bottom: 0px;
}
#orderDetail .resendDialog .el-dialog .el-dialog__body {
  padding: 0px;
  padding-top: 20px;
  max-height: 300px;
  overflow-x: auto;
}
#orderDetail .resendDialog .el-dialog .el-radio {
  display: block;
}
#orderDetail .resendDialog .el-dialog .el-radio + .el-radio {
  margin-left: 0px;
}
#orderDetail .resendDialog .el-dialog .el-input__inner {
  background: #fff;
  border: solid 1px #d9d9d9;
  text-indent: 0px;
}
#orderDetail .resourceDialog .el-dialog .el-dialog__header {
  border: none;
}
#orderDetail .resourceDialog .el-dialog .el-dialog__body {
  padding: 20px 0px;
}
#orderDetail .filterItem .el-input__icon {
  line-height: 32px;
}
#orderDetail .filterItem .el-select .el-input .el-input__inner {
  font-size: 12px;
  text-indent: 0px;
}
#orderDetail .resendPhone .el-form-item__error {
  left: 111px;
}
#orderDetail .table_item .el-collapse .el-icon-arrow-right {
  display: none;
}
#orderDetail .table_item .el-collapse-item__header {
  height: 70px;
  line-height: 70px;
  border-bottom: 0px;
}
#orderDetail .table_item .el-collapse-item__wrap {
  border-bottom: 0px;
}
#orderDetail .table_item .el-collapse-item__content {
  padding-bottom: 0px;
}
</style>

<style scoped lang="less">
#orderDetail {
  .returnBtn {
    width: 110px;
    height: 36px;
    background-image: linear-gradient(42deg, #4900e0 0%, #8d2de2 100%);
    border-radius: 5px;
    color: #fff;
    text-indent: 15px;
    line-height: 36px;
    margin-bottom: 15px;
    cursor: pointer;
    i {
      display: block;
      float: left;
      width: 20px;
      height: 36px;
      background: url(../../../assets/images/images/return.png) no-repeat center;
      background-size: 20px 15px;
      margin-left: 15px;
    }
  }
  .active_header {
    width: 860px;
    // height: 170px;
    padding: 20px;
    background-color: #ffffff;
    border-radius: 8px;
    border: solid 1px rgba(206, 206, 206, 0.46);
    margin-bottom: 20px;
    .active_header_title {
      margin-bottom: 30px;
      font-weight: bold;
      i {
        display: block;
        float: left;
        width: 4px;
        height: 14px;
        background-color: #5a0ae0;
        margin-top: 2px;
        margin-right: 10px;
      }
    }
    .active_header_msg {
      position: relative;
      .active_header_img {
        cursor: pointer;
        width: 100px;
        height: 100px;
        position: absolute;
        top: -21px;
        right: 30px;
      }
      p {
        margin-bottom: 10px;
        span {
          display: inline-block;
          width: 250px;
          .el-icon-view {
            cursor: pointer;
            margin-left: 20px;
            color: #ffb735;
          }
          .el-icon-view:hover {
            color: #393c40;
          }
        }
        .active_header_span {
          vertical-align: top;
          word-break: break-all;
          width: 73%;
        }
      }
      .active_header_msg_title {
        font-weight: bold;
        margin-bottom: 20px;
      }
    }
  }
  .order_data {
    padding: 0px;
    height: 200px;
    width: 898px;
    position: relative;
    .exportbtn {
      position: absolute;
      right: 20px;
      top: 10px;
      width: 135px;
      height: 36px;
      margin-left: 10px;
      background-image: linear-gradient(42deg, #00b4ff 0%, #23d7ff 100%);
      border-radius: 4px;
      color: #fff;
      line-height: 36px;
      cursor: pointer;
      .exportIcon {
        display: block;
        float: left;
        width: 14px;
        height: 14px;
        background: url(../../../assets/images/images/exportBtn.png) no-repeat;
        background-size: 100% 100%;
        margin-top: 11px;
        margin-left: 15px;
        margin-right: 10px;
      }
    }
    .active_header_title {
      margin-bottom: 0px;
      padding-top: 20px;
      padding-left: 20px;
    }
    ul {
      overflow: hidden;
      li {
        width: 233px;
        height: 75px;
        box-shadow: 0px 2px 20px 0px rgba(219, 219, 219, 0.5);
        border-radius: 6px;
        padding: 20px;
        float: left;
        color: #fff;
        margin: 20px 0px 20px 20px;
        transition: transform 0.5s;
        p {
          font-size: 32px;
          text-align: center;
          margin-top: 10px;
          font-weight: bold;
        }
        span {
          i {
            font-style: normal;
            font-size: 12px;
          }
        }
      }
      .activeTab {
        -webkit-transform: scale(1.05);
        // padding: 25px;
        box-shadow: 0 9px 30px -6px rgba(99, 62, 62, 0.2),
          0 18px 20px -10px rgba(133, 215, 222, 0.36),
          0 18px 20px -10px rgba(88, 67, 88, 0.41),
          0 10px 20px -10px rgba(0, 0, 0, 0.04);
      }
      .all_orders {
        background: url(../../../assets/images/images/order1.png) no-repeat
          center;
        background-size: 100% 100%;
      }
      .sucess_orders {
        background: url(../../../assets/images/images/order3.png) no-repeat
          center;
        background-size: 100% 100%;
      }
      .fail_orders {
        background: url(../../../assets/images/images/order2.png) no-repeat
          center;
        background-size: 100% 100%;
      }
    }
  }
  .data_detail {
    padding: 0px;
    width: 900px;
    min-height: 500px;
    border-radius: 8px;
    background-color: #ffffff;
    border: solid 1px rgba(206, 206, 206, 0.46);
    position: relative;
    .nodata_tip {
      width: 100%;
      height: 325px;
      line-height: 384px;
      font-size: 14px;
      text-align: center;
      color: #aaaeb3;
    }
    .activeAllot_box_search {
      position: absolute;
      right: 20px;
      top: 15px;
    }
    .filterItem {
      position: absolute;
      left: 80px;
      top: 15px;
      .el-select {
        width: 140px;
        margin-left: 20px;
      }
    }
    .active_header_title {
      margin: 20px 0px 20px 20px;
      font-weight: bold;
      i {
        display: block;
        float: left;
        width: 4px;
        height: 14px;
        background-color: #5a0ae0;
        margin-top: 2px;
        margin-right: 10px;
      }
    }
    .preview_title {
      padding-left: 20px;
      padding-top: 20px;
    }
    .table {
      padding-bottom: 20px;
      min-height: 300px;
      table {
        width: 100%;
        tr {
          th {
            background-color: #f5f5f5;
            line-height: 40px;
            color: #aaaeb3;
            font-size: 12px;
          }
          td {
            text-align: center;
            line-height: 50px;
            border-bottom: 1px #ecedef solid;
          }
          .order_time {
            line-height: 22px;
          }
          .operation {
            .operationBtn {
              // display: inline-block;
              margin: 0 auto;
              overflow: hidden;
              padding-top: 20px;
              span {
                display: inline-block;
                width: 20px;
                height: 20px;
                // float: left;
                cursor: pointer;
              }
              .resendIcon {
                background: url(../../../assets/images/images/fly.png) no-repeat
                  center;
                background-size: 20px 20px;
              }
              .noresendIcon {
                background: url(../../../assets/images/images/nofly.png)
                  no-repeat center;
                background-size: 20px 20px;
                cursor: inherit;
              }
              .resendDetail {
                margin-left: 10px;
                background: url(../../../assets/images/images/detailIcon.png)
                  no-repeat center;
                background-size: 20px 20px;
              }
            }
          }
          span {
            overflow: hidden;
            .success_icon {
              display: inline-block;
              width: 10px;
              height: 10px;
              background-color: #00c388;
              border-radius: 50%;
              margin-top: 30px;
              margin-right: 5px;
            }
            .fafang_icon {
              display: inline-block;
              width: 10px;
              height: 10px;
              background-color: #37afff;
              border-radius: 50%;
              margin-top: 30px;
              margin-right: 5px;
            }
            .faile_icon {
              display: inline-block;
              width: 10px;
              height: 10px;
              background-color: #f85a3c;
              border-radius: 50%;
              margin-top: 30px;
              margin-right: 5px;
            }
            .stay_out_icon {
              display: inline-block;
              width: 12px;
              height: 12px;
              background: url(../../../assets/images/images/stayOut.png)
                no-repeat center;
              background-size: 100% 100%;
              margin-top: 30px;
              margin-right: 5px;
            }
          }
        }
      }
      .table_title {
        padding: 0px 20px;
        height: 40px;
        line-height: 40px;
        background-color: #f5f5f5;
        span {
          color: #aaaeb3;
          font-size: 12px;
          display: block;
          float: left;
          text-align: center;
        }
      }
      .table_item,
      .table_title,
      .Direct_top_up {
        .orderNumber {
          width: 148px;
        }
        .sendType_table {
          width: 75px;
        }
        .reasouceName {
          width: 145px;
        }
        .send_Time {
          width: 105px;
        }
        .open_id {
          width: 115px;
        }
        .order_state {
          width: 95px;
          span {
            overflow: hidden;
            .success_icon {
              display: inline-block;
              width: 10px;
              height: 10px;
              background-color: #00c388;
              border-radius: 50%;
              margin-top: 30px;
              margin-right: 5px;
            }
            .fafang_icon {
              display: inline-block;
              width: 10px;
              height: 10px;
              background-color: #37afff;
              border-radius: 50%;
              margin-top: 30px;
              margin-right: 5px;
            }
            .faile_icon {
              display: inline-block;
              width: 10px;
              height: 10px;
              background-color: #f85a3c;
              border-radius: 50%;
              margin-right: 5px;
              margin-top: 0px;
            }
            .success_icon {
              margin-top: 0px;
            }
            .stay_out_icon {
              display: inline-block;
              width: 12px;
              height: 12px;
              background: url(../../../assets/images/images/stayOut.png)
                no-repeat center;
              background-size: 100% 100%;
              margin-top: 0px;
              margin-right: 5px;
            }
          }
        }
        .order_operation {
          width: 100px;
          .operationBtn {
            // display: inline-block;
            margin: 0 auto;
            overflow: hidden;
            padding-top: 5px;
            span {
              display: inline-block;
              width: 20px;
              height: 20px;
              cursor: pointer;
            }
            .resendIcon {
              background: url(../../../assets/images/images/fly.png) no-repeat
                center;
              background-size: 20px 20px;
            }
            .noresendIcon {
              background: url(../../../assets/images/images/nofly.png) no-repeat
                center;
              background-size: 20px 20px;
              cursor: inherit;
            }
            .resendDetail {
              margin-left: 10px;
              font-size: 24px;
              color: #ffb834;
              // background: url(../../../assets/images/images/detailIcon.png)
              //     no-repeat center;
              // background-size: 20px 20px;
            }
            .el-icon-arrow-down {
              font-size: 24px;
              color: #8951e8;
              transition: transform 0.3s, -webkit-transform 0.3s;
            }
            .Btnrotate {
              transform: rotate(180deg);
              -webkit-transform: rotate(180deg);
              -moz-transform: rotate(180deg);
              -o-transform: rotate(180deg);
              -ms-transform: rotate(180deg);
            }
            .childOrderResendDetail {
              cursor: auto;
            }
          }
        }
      }
      .table_item {
        padding: 0px 10px;
        border-bottom: 1px #ecedef solid;
        .table_item_top {
          overflow: hidden;
          // height: 70px;
          padding: 0px 10px;
          div {
            float: left;
            text-align: center;
            line-height: 70px;
            font-size: 12px;
            height: 70px;
          }
          .sendTime {
            line-height: 20px;
            word-break: break-all;
            p {
              margin-top: 15px;
            }
          }
        }
        .Direct_top_up {
          background-color: #f5f5f5;
          margin-bottom: 10px;
          padding: 0px 10px;
          // padding-left: 298px;
          li {
            overflow: hidden;
            line-height: 30px;
            div {
              text-align: center;
              float: left;
              font-size: 12px;
            }
            .order_state {
              margin-left: 220px;
            }
          }
          .childOrderNumber {
            padding-right: 150px;
          }
        }
      }
    }
  }
  .resendDialog {
    .originalPhone {
      border-bottom: 1px #ecedef solid;
      padding-bottom: 10px;
      padding-left: 20px;
      margin-bottom: 10px;
      i {
        display: block;
        float: left;
        width: 4px;
        height: 14px;
        background-color: #5a0ae0;
        margin-top: 3px;
        margin-right: 10px;
      }
    }
    .resendReminderText {
      line-height: 80px;
      text-align: center;
    }
    .radioBox {
      padding: 10px 20px 0px 20px;
      .resendPhone {
        display: inline-block;
      }
      .firstRadio {
        margin-bottom: 20px;
      }
      .originalPhone {
        border: 0px;
        padding-left: 0px;
      }
      .resendDatailList {
        min-height: 30px;
        li {
          margin-bottom: 15px;
          span {
            display: block;
            float: left;
            width: 18px;
            height: 18px;
            background-color: #8da6ff;
            border-radius: 50%;
            color: #fff;
            line-height: 18px;
            text-align: center;
            margin-right: 10px;
          }
          .sendSuccess {
            color: #20b513;
            font-style: normal;
          }
          .sendFail {
            color: #f44b36;
            font-style: normal;
          }
          .theTopUp {
            color: #ffb834;
            font-style: normal;
          }
        }
        .noresendDatailTip {
          text-align: center; // margin-bottom: 40px;
        }
      }
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


