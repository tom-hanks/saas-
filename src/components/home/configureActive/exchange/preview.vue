<template>
  <div id="preview" v-loading="loading">
    <div class="active_modificate" v-if="application_isshow">
      <p class="preview_title">
        <span></span>活动修改申请
      </p>
      <div class="modificate_title">
        <i></i>活动修改申请
      </div>
      <!-- {2018-09-23 19:00:00运营一部专员王小明将活动下线时间延期至2018-10-28 19:00:00} -->
      <p
        class="modificate_detail"
      >详细信息：{{!application_center.detailed?'暂无':application_center.detailed}}</p>
      <p
        class="modificate_detail"
      >申请理由：{{!application_center.rejectreason?'暂无':application_center.rejectreason}}</p>
    </div>
    <div class="preview_content">
      <p class="preview_title">
        <span></span> 活动预览
      </p>
      <div class="preview_box">
        <div class="preview_header">
          <p
            class="preview_title active_name"
          >{{appDetaildata.app_num}}&nbsp;&nbsp;—&nbsp;&nbsp;{{appDetaildata.app_name}}</p>
          <p class="preview_active_item">
            <span>活动名称：{{appDetaildata.app_external_name}}</span>
            <span>活动类型：{{appDetaildata.type_name}}</span>
          </p>
          <p class="preview_active_item">
            <span>项目负责人：{{appDetaildata.owner}}</span>
            <span>运营/配置负责人：{{appDetaildata.operation}}</span>
          </p>
          <p class="preview_active_item">
            项目周期：{{appDetaildata.onlinetime}}至{{appDetaildata.offlinetime}}
            <span
              class="ToAudit"
              v-if="appDetaildata.audit_status_code==800"
            >
              <i></i>待审核
            </span>
          </p>
          <p class="preview_active_item link" v-if="isWeixinCode">
            活动预览：
            <span>
              <a :href="appDetaildata.domainurl" target="view_window">{{appDetaildata.domainurl}}</a>
            </span>
          </p>
          <p class="resouce">
            授权资源：
            <span @click="packUpFun">
              {{isPackUp}}
              <i class="el-icon-arrow-up" :class="{arrowDown:!isOpen}"></i>
            </span>
          </p>
          <div id="indexLaga" class="weixin_code">
            <ul v-show="isWeixinCode">
              <li>
                <img :src="appDetaildata.qrcode" alt="二维码">
              </li>
            </ul>
            <p v-show="isWeixinCode">扫码预览</p>
            <!-- Spring6无H5页面时的图片 -->
            <ul v-show="!isWeixinCode">
              <li>
                <img src="../../../../assets/images/images/noSet.png" alt="二维码">
              </li>
            </ul>
          </div>
        </div>
        <el-collapse-transition v-if="appDetaildata.type_name =='兑换平台'">
          <div class="preview_active_list" v-show="isOpen">
            <div class="active_card" v-for="(item,index) in cardList" :key="index">
              <div class="pingtai_code" v-if="item.grant_type == 1">
                <p class="pingtai_code_title">
                  <i
                    class="list_num"
                    :class="[{'numFirst': index % 5 == 0},{'numSecond':index%5 == 1},{'numThree':index%5 == 2,},{'numFore':index%5 == 3},{'numFive':index%5 == 4}]"
                  >{{index+1}}</i>
                  {{item.material_name}}
                </p>
                <p class="pingtai_code_count">
                  <span>
                    当前预设数量：
                    <b>{{item.amount}}</b>
                  </span>
                  <span>
                    预警量：
                    <b>{{item.trigger_amount}}</b>
                  </span>
                  <span>
                    发放形式：
                    <b class="blueText">平台码</b>
                  </span>
                  <span>
                    是否有兑换平台：
                    <b>是</b>
                  </span>
                </p>
                <p>预警通知：{{item.send_text}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{item.emails | EmaliList}}</p>
                <div class="msg_text">
                  <label>短信文案：</label>
                  <div>{{item.notices | msgText }}</div>
                </div>
                <p>中奖标题：{{item.prize_title}}</p>
                <div class="msg_text">
                  <label>奖品说明：</label>
                  <div v-html="item.prize_explain"></div>
                </div>
              </div>
              <div class="pingtai_code" v-if="item.grant_type == 2">
                <p class="pingtai_code_title">
                  <i
                    class="list_num"
                    :class="[{'numFirst': index % 5 == 0},{'numSecond':index%5 == 1},{'numThree':index%5 == 2,},{'numFore':index%5 == 3},{'numFive':index%5 == 4}]"
                  >{{index+1}}</i>
                  {{item.material_name}}
                </p>
                <p class="pingtai_code_count">
                  <span>
                    当前预设数量：
                    <b>{{item.amount}}</b>
                  </span>
                  <span>
                    预警量：
                    <b>{{item.trigger_amount}}</b>
                  </span>
                  <span>
                    发放形式：
                    <b>原始码</b>
                  </span>
                  <span>
                    是否有兑换平台：
                    <b>否</b>
                  </span>
                </p>
                <p>预警通知：{{item.send_text}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{item.emails | EmaliList}}</p>
                <div class="msg_text">
                  <label>短信文案：</label>
                  <div>{{item.notices | msgText }}</div>
                </div>
              </div>
              <div class="pingtai_code redPage_code" v-if="item.grant_type==0">
                <p class="pingtai_code_title">
                  <i
                    class="list_num"
                    :class="[{'numFirst': index % 5 == 0},{'numSecond':index%5 == 1},{'numThree':index%5 == 2,},{'numFore':index%5 == 3},{'numFive':index%5 == 4}]"
                  >{{index+1}}</i>
                  {{item.material_name}}
                </p>
                <p>
                  <span>
                    当前预设总金额：
                    <b>{{item.allocation_count}}</b>元
                  </span>
                  <span>
                    当前预警金额：
                    <b>{{item.warning_count}}</b>元
                  </span>
                </p>
                <p>
                  <span>活动名称：{{item.activity_name}}</span>
                  <span>商户名称：{{item.shop_name}}</span>
                </p>
                <p>
                  <span>红包祝福：{{item.blessing}}</span>
                  <span>备注 ：{{item.details}}</span>
                </p>
                <p>预警通知： {{[item.send_text,item.warning_count] | arryListStr}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{item.emails | EmaliList}}</p>
                <ul class="redPackage_item">
                  <li v-for="(redpackage,redIndex) in item.redpacket_list" :key="redIndex">
                    <p>
                      <span>
                        <i>{{redIndex+1}}</i>
                        微信{{redpackage.money}}元红包
                      </span>
                      <span>
                        预设总金额：
                        <b>{{redpackage.amount}}</b>元
                      </span>
                      <span>
                        预警金额：
                        <b>{{redpackage.trigger_amount}}</b>元
                      </span>
                    </p>
                    <p>预警通知：{{redpackage.send_text}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{redpackage.emails | EmaliList}}</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </el-collapse-transition>
        <el-collapse-transition v-if="appDetaildata.type_name =='直采'">
          <div class="preview_active_list" v-show="isOpen">
            <div class="active_card" v-for="(item,index) in cardList" :key="index">
              <div class="pingtai_code">
                <p class="pingtai_code_title">
                  <i
                    class="list_num"
                    :class="[{'numFirst': index % 5 == 0},{'numSecond':index%5 == 1},{'numThree':index%5 == 2,},{'numFore':index%5 == 3},{'numFive':index%5 == 4}]"
                  >{{index+1}}</i>
                  {{item.material_name}}
                  <span
                    class="ToAudit"
                    v-if="item.audit_status==10 && appDetaildata.audit_status_code==1100"
                  >
                    <i></i>待审核
                  </span>
                </p>
                <!-- Spring6  平台码,原始码 的预览样式 -->
                <div v-if="item.grant_type == 1 || item.grant_type == 2">
                  <p class="pingtai_code_count">
                    <span>
                      资源数量：
                      <b>{{item.allocation_count}}</b>
                    </span>
                    <span>
                      导入名单：
                      <b>{{item.import_list}}</b>
                      <i class="el-icon-view" @click="lookNameList(item)">查看</i>
                    </span>
                    <span>
                      发放数量：
                      <b>{{item.amount}}</b>
                    </span>
                    <span v-if="item.grant_type == 1">
                      发放形式：
                      <b class="blueText">平台码</b>
                    </span>
                    <span v-if="item.grant_type == 2">
                      发放形式：
                      <b class="blueText">原始码</b>
                    </span>
                    <span class="residueAmount">
                      剩余数量：
                      <b>{{item.surplus_count}}</b>
                    </span>
                    <span></span>
                    <span class="residueAmount">
                      预警数量：
                      <b>{{item.trigger_amount}}</b>
                    </span>
                  </p>
                  <p class="valid_time">
                    <span v-if="item.grant_type == 1">有效时长：{{item.valid_duration}}天</span>
                    <span>发放时间：{{item.release_time}}</span>
                  </p>
                  <p>预警通知：{{item.send_text}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{item.emails | EmaliList}}</p>
                  <div class="msg_text">
                    <label>短信文案：</label>
                    <div>{{item.notices | msgText }}</div>
                  </div>
                  <p v-if="item.grant_type == 1">中奖标题：{{item.prize_title}}</p>
                  <div v-if="item.grant_type == 1" class="msg_text">
                    <label>奖品说明：</label>
                    <div v-html="item.prize_explain"></div>
                  </div>
                </div>
                <!--Spring6 直接充值 活动预览卡片 -->
                <div v-if="item.grant_type == 3">
                  <p class="pingtai_code_count">
                    <span>
                      总金额：
                      <b>{{item.allocation_count}}</b>
                    </span>
                    <span>
                      导入名单：
                      <b>{{item.import_list}}</b>
                      <i class="el-icon-view" @click="lookNameList(item)">查看</i>
                    </span>
                    <span>
                      发放金额：
                      <b>{{item.amount}}</b>
                    </span>
                    <span>
                      发放形式：
                      <b class="blueText">直接充值</b>
                    </span>
                    <span class="residueAmount">
                      剩余金额：
                      <b>{{item.surplus_count}}</b>
                    </span>
                  </p>
                  <p class="valid_time">
                    <span>发放时间：{{item.release_time}}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </el-collapse-transition>
      </div>
    </div>
    <!-- 上一步   下一步 -->
    <div class="step-btn">
      <el-button class="last-step" v-if="isShowback" @click="back()">返回</el-button>
      <el-button class="last-step rejectBtn" v-if="isShowPass" @click="rejectFun()">驳回</el-button>
      <el-button
        class="last-step passBtn"
        :loading="!stop_clicks"
        v-if="isShowPass"
        @click="stop_clicks?passFun():''"
      >通过</el-button>
      <!-- 审核中  驳回   紧急下线  已下线活动 -->
      <el-button
        :class="!isSetPage?'next-btn':'last-step'"
        v-if="isShowbackxiu"
        @click="prev()"
      >前往修改</el-button>
      <el-button class="last-step" v-if="isup" @click="upShang()">上一步</el-button>
      <el-button class="next-btn" v-if="isSetPage" @click="setPage()">发送审核</el-button>
    </div>
    <!-- 填写驳回理由  弹框  -->
    <el-dialog :title="title" :visible.sync="showReasonDialog">
      <el-form :model="reasonForm" :rules="rules" ref="reasonForm">
        <el-form-item prop="reason">
          <el-input
            class="reasonText"
            type="textarea"
            v-model="reasonForm.reason"
            maxlength="250"
            placeholder="请填写驳回理由"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer resourceListFooter">
        <el-button @click="showReasonDialog = false">取 消</el-button>
        <el-button type="primary" @click="appRejec">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 查看名单  弹框 -->
    <el-dialog
      class="ediAwardDialog showNameListDialog"
      title="派发名单"
      :lockScroll="false"
      :visible.sync="showNameList"
    >
      <ul class="batchList">
        <li
          :class="batchDataSelcet == bathIndex?'checkedBatch':''"
          v-for="(batchItem,bathIndex) in batchList"
          :key="bathIndex"
          @click="changebatchData(bathIndex,batchItem.id)"
        >
          {{batchItem.name}}
          <span class="color_red" v-if="batchItem.audit_status ==5">:待提交审核</span>
          <span class="color_red" v-if="batchItem.audit_status ==10">:待审核</span>
          <span class="color_red" v-if="batchItem.audit_status ==30">:已驳回</span>
        </li>
      </ul>
      <div class="batch_box">
        <div class="batch_msg clearfix">
          <div>
            <span class="batch_msg_people">
              <i></i>
              发放人员数量：{{batchDataTop.user_count}}
            </span>
            <span class="batch_msg_resouce">
              <i></i>
              发放资源数量：{{materialType ==3?"无":batchDataTop.material_count}}
            </span>
            <span class="batch_msg_price">
              <i></i>
              充值金额：{{materialType ==3?batchDataTop.material_count:"无"}}
            </span>
          </div>
          <p class="batch_msg_time fl" v-if="batchDataSelcet">
            <i></i>
            发放时间：{{batchDataTop.release_time}}
          </p>
          <div class="exportbtn fl" v-if="batchDataSelcet && downBoolean" @click="downExportUsers">
            <i class="exportIcon"></i>名单导出
          </div>
          <el-button
            class="exportbtnTwo fl"
            type="primary"
            v-if="batchDataSelcet && !downBoolean"
            :loading="true"
          >
            <i class="exportIcon"></i>名单导出
          </el-button>
        </div>
        <div class="activeAllot_box_search clearfix">
          <i class="el-icon-search"></i>
          <i class="el-icon-close" v-if="seachclick_close" @click="seachclick(0)"></i>
          <input
            @keyup.13="seachValue?seachclick():''"
            v-model="seachValue"
            type="text"
            placeholder="请输入姓名或手机号"
            @input="seachValue==''?seachclick_close=false:seachclick_close=true"
          >
          <span class="seach" @click="seachclick()">搜索</span>
        </div>
        <div class="NameList_table_box">
          <table
            class="NameList_table"
            cellspacing="0"
            cellpadding="0"
            border="0px"
            v-loading="loadingNameList"
          >
            <tr>
              <th>序号</th>
              <th>姓名</th>
              <th>手机号</th>
              <th>发放数量</th>
              <th>发放金额</th>
            </tr>
            <tr v-for="(itemNum,indexNum) in NameList_table_list" :key="indexNum">
              <td>{{itemNum.serial_no }}</td>
              <td>{{itemNum.name}}</td>
              <td>{{itemNum.mobile }}</td>
              <!-- <td>{{itemNum.user_count}}</td> -->
              <td>{{materialType ==3?"无":itemNum.user_count}}</td>
              <td>{{materialType ==3?itemNum.user_count:"无"}}</td>
            </tr>
          </table>
          <p v-if="NameList_table_list.length==0" class="noDataList">暂无数据</p>
        </div>
        <el-pagination
          :style="NameList_table_list.length!=0&&itemListloading==true?'visibility:visible':'visibility:hidden'"
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
    </el-dialog>
    <!-- Spring6的查看名单  弹框 -->
    <!-- <el-dialog class="ediAwardDialog showNameListDialog" title="派发名单" :visible.sync="showNameList">
      <div class="batchListTitle">
        <span></span>
        {{materialType}}
      </div>
      <div class="batch_box">
        <div class="batch_msg">
          <div>
            <span class="batch_msg_people">
              <i></i>
              发放人员数量：{{batchDataTop.user_count}}
            </span>
            <span class="batch_msg_resouce">
              <i></i>
              发放资源数量：{{materialType ==3?"无":batchDataTop.material_count}}
            </span>
            <span class="batch_msg_price">
              <i></i>
              充值金额：{{materialType ==3?batchDataTop.material_count:"无"}}
            </span>
          </div>
          <p class="batch_msg_time fl">
            <i></i>
            发放时间：{{releaseTime}}
          </p>
          <div class="exportbtn fl" v-if="downBoolean" @click="downExportUsers">
            <i class="exportIcon"></i>名单导出
          </div>
          <el-button class="exportbtnTwo fl" type="primary" v-if="!downBoolean" :loading="true">
            <i class="exportIcon"></i>名单导出
          </el-button>
        </div>
        <div class="activeAllot_box_search">
          <i class="el-icon-search"></i>
          <i class="el-icon-close" v-if="seachclick_close" @click="seachclick(0)"></i>
          <input
            @keyup.13="seachValue?seachclick():''"
            v-model="seachValue"
            type="text"
            placeholder="请输入姓名或手机号"
            @input="seachValue==''?seachclick_close=false:seachclick_close=true"
          >
          <span class="seach" @click="seachclick()">搜索</span>
        </div>
        <div class="NameList_table_box">
          <table
            class="NameList_table"
            cellspacing="0"
            cellpadding="0"
            border="0px"
            v-loading="loadingNameList"
          >
            <tr>
              <th>序号</th>
              <th>姓名</th>
              <th>手机号</th>
              <th>发放数量</th>
              <th>发放金额</th>
            </tr>
            <tr
              v-if="NameList_table_list.length!=0"
              v-for="(itemNum,indexNum) in NameList_table_list"
              :key="indexNum"
            >
              <td>{{itemNum.serial_no }}</td>
              <td>{{itemNum.name}}</td>
              <td>{{itemNum.mobile }}</td>
              <td>{{materialType ==3?"无":itemNum.user_count}}</td>
              <td>{{materialType ==3?itemNum.user_count:"无"}}</td>
            </tr>
          </table>
          <p v-if="NameList_table_list.length==0" class="noDataList">暂无数据</p>
        </div>
        <el-pagination
          :style="NameList_table_list.length!=0&&itemListloading==true?'visibility:visible':'visibility:hidden'"
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
    </el-dialog>-->
    <saas-dialog :html="html" v-if="showSaasDialog"></saas-dialog>

    <!-- <div class="step-btn fl" v-if="isShowback"> -->
    <!-- 已通过  已上线 -->
    <!-- <el-button class="last-step" @click="back()">返回</el-button> -->
    <!-- </div> -->
  </div>
</template>

<script>
import { httpServer, apiSetting } from "../../../../assets/js/http.js";
import page from "../../../../assets/js/page.js";
const saasDialog = () =>
  import(/* webpackChunkName:"dialog" */ "../../../dialog/dialog");
import Viewer from "viewerjs";
import "viewerjs/dist/viewer.css";
export default {
  name: "preview",
  components: {
    saasDialog
  },
  props: {},
  data() {
    return {
      title: "",
      codeType: 3,
      isOpen: true,
      stop_clicks: true, //发送审核按钮的控制
      isPackUp: "收起",
      appDetaildata: {}, // 接收上半部分信息的数据
      cardList: [], // 接收下班部分信息的数据
      downBoolean: true, //导出名单的loading开关
      mid_material_allot_id: "", //获取批次时候用的id
      isWeixinCode: false,
      appId: "",
      templateId: "",
      loading: true,
      application_isshow: false, //判断是否显示申请理由的展示
      showSaasDialog: false,
      application_center: "", //申请理由字段
      seachValue: "", //主页的搜索响应式
      seachclick_close: false, //主页的搜索按钮叉号
      itemListloading: true, //如果列表正在请求中分页就不能触发，不然会有bug
      page: page,
      app_status_code: 0, //状态 主线
      audit_status_code: 0, //状态  支线
      isShowbutton: true, //返回上一个路由
      isSetPage: false, //控制发送审核按钮
      isShowback: false, //控制返回按钮
      isShowbackxiu: false, //前往修改
      isup: false, //返回上一步
      // no_data: false, //没有资源配置的时候暂无数据的时候显示
      isShowPass: false, // 控制通过、驳回按钮
      showReasonDialog: false, // 填写驳回理由
      materialType: "", //资源类型
      releaseTime: "", //发放时间
      uploadParam: {
        material_id: ""
      },
      reasonForm: {
        reason: ""
      },
      rules: {
        reason: [
          {
            required: true,
            message: "请输入驳回理由",
            trigger: "change"
          }
        ]
      },
      // 名单列表弹框
      showNameList: false,
      NameList_table_list: {},
      batchList: {},
      batchDataTop: {
        user_count: "",
        material_count: "",
        release_time: ""
      },
      audit_status: "",
      batchDataSelcet: 0,
      batchDataSelcetId: "", //批次号
      loadingNameList: false
    };
  },
  mounted() {
    this.getAppdetailTop();
    // 此处为图片查看器
    const ViewerDom = document.getElementById("indexLaga");
    const viewer = new Viewer(ViewerDom, {
      // 配置
    });
    let $emit = this;
    $emit.page.pageSize = 30; //修改每页显示数
    $emit.page.pageSizeList = [30, 60, 90]; //修改可以下拉框选择的每页显示数

    $emit.page.query = function() {
      if ($emit.itemListloading) {
        $emit.getDirectUserList($emit.typeid);
        this.NameList_table_list = [];
        $emit.itemListloading = true; //以防分页点击过快的flag节流阀
      }
    };
    apiSetting.getDirectUserList.page = this.page; //api接口分页赋值
    apiSetting.getDirectUserList.dataList = this.dataList; //api分页数据赋值
  },

  methods: {
    seachclick(a) {
      if (a == 0) {
        this.seachValue = "";
      }
      this.page.pageIndex = 1;
      this.getDirectUserList("seach"); //搜索请求列表
    },
    // 驳回
    rejectFun() {
      this.showReasonDialog = true;
      this.appId = this.$getsessionStorage("appid");
    },
    appRejec() {
      // if (this.rejection == false) {
      // 驳回弹窗的确认按钮
      this.$refs["reasonForm"].validate(valid => {
        //验证合格后执行
        if (valid) {
          //点击驳回按钮
          httpServer(apiSetting.appRejec, {
            id: this.appId,
            reject_reason: this.reasonForm.reason
          })
            .then(response => {
              this.showReasonDialog = false;
              this.$router.push({ path: "/activeAudit" });
            })
            .catch(error => {
              this.$message({
                message: error.data.message,
                duration: 1000
              });
              console.log(error); //loading层关闭
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
      // } else {
      //     this.showReasonDialog = false;
      // }
    },
    // 通过
    passFun() {
      this.appId = this.$getsessionStorage("appid");
      let textCenter = "";
      // alert(this.audit_status_code);
      switch (this.audit_status_code) {
        case this.$customState.audit_status_code_1100:
          // alert("添加人员名单待审核");
          textCenter = "审核通过后，用户名单将在预设时间短信推送!";
          break;
        case this.$customState.audit_status_code_800:
          textCenter = "审核通过后，项目下线时间将延期!";
          // alert("延期待审核");
          break;
        case this.$customState.audit_status_code_500:
          // alert("紧急下线待审核");
          textCenter = "审核通过后，活动将紧急下线!";
          break;
        case this.$customState.audit_status_code_200:
          textCenter = "审核通过后，活动将会在预设时间准时上线!";
          // alert("配置完成待审核");
          break;
      }
      this.$confirm(textCenter, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
        // type: 'warning'
      })
        .then(() => {
          this.stop_clicks = false; //发送审核flag
          console.log("确定审核通过");
          httpServer(apiSetting.appVerified, {
            id: this.appId
          })
            .then(response => {
              this.stop_clicks = true; //发送审核flag
              this.$router.push({ path: "/activeAudit" });
              console.log("通过成功0000000000");
            })
            .catch(error => {
              this.stop_clicks = true; //发送审核flag
              this.$message({
                message: error.data.message,
                duration: 1000
              });
              console.log(error); //loading层关闭
            });
        })
        .catch(() => {
          this.stop_clicks = true; //发送审核flag
          console.log("取消");
        });
      // 代表紧急下线，紧急下线的时候弹窗文案稍有不同
      // if (
      //     this.audit_status_code ==
      //     this.$customState.audit_status_code_500
      // ) {
      //     this.$confirm("审核通过后，活动将紧急下线", "提示", {
      //         confirmButtonText: "确定",
      //         cancelButtonText: "取消"
      //         // type: 'warning'
      //     })
      //         .then(() => {
      //             console.log("确定审核通过");
      //             httpServer(apiSetting.appVerified, {
      //                 id: this.appId
      //             })
      //                 .then(response => {
      //                     this.$router.push({ path: "/activeAudit" });
      //                     console.log("通过成功0000000000000000");
      //                 })
      //                 .catch(error => {
      //                     console.log(error); //loading层关闭
      //                 });
      //         })
      //         .catch(() => {
      //             console.log("取消");
      //         });
      // } else {
      //     this.$confirm(
      //         "审核通过后，活动将会在预设时间准时上线确定审核通过？",
      //         "提示",
      //         {
      //             confirmButtonText: "确定",
      //             cancelButtonText: "取消"
      //             // type: 'warning'
      //         }
      //     )
      //         .then(() => {
      //             console.log("确定审核通过");
      //             httpServer(apiSetting.appVerified, {
      //                 id: this.appId
      //             })
      //                 .then(response => {
      //                     this.$router.push({ path: "/activeAudit" });
      //                     console.log("通过成功0000000000");
      //                 })
      //                 .catch(error => {
      //                     console.log(error); //loading层关闭
      //                 });
      //         })
      //         .catch(() => {
      //             console.log("取消");
      //         });
      // }
    },
    // 查看导入名单
    lookNameList(item) {
      this.releaseTime = item.release_time;
      this.materialType = item.grant_type;
      this.downBoolean = true;
      this.uploadParam.material_id = item.material_id;
      this.page.pageIndex = 1;
      this.batchDataSelcet = 0;
      this.mid_material_allot_id = item.id;
      this.seachValue = "";
      this.getDirectBatchList();
    },
    // 获取名单批次列表
    getDirectBatchList() {
      httpServer(apiSetting.getDirectBatchList, {
        app_id: this.$getsessionStorage("appid"),
        template_id: this.$getsessionStorage("template_id"),
        material_id: this.uploadParam.material_id,
        mid_material_allot_id: this.mid_material_allot_id,
        start: "20", //相当于false
        batch_enums: "20", //入口判断：10添加名单处调用，20活动预览处的调用
        id: "0" //批次id 0即为查全部
      })
        .then(response => {
          this.batchList = response;
          this.batchList.forEach((value, index, array) => {
            console.log("获取名单批次", this.batchList);
            // audit_status{5:待提交审核；10：待审核；30：已驳回}
            if (
              value.audit_status == 5 ||
              value.audit_status == 10 ||
              value.audit_status == 30
            ) {
              this.batchDataSelcet = 1; //添加成功后选全部后面的
              this.batchDataSelcetId = response[1].id;
              this.batchDataTop.user_count = response[1].user_count;
              this.batchDataTop.material_count = response[1].material_count;
              this.batchDataTop.release_time = response[1].release_time;
              this.audit_status = response[1].audit_status;
            }
          });

          // 代表着tab里不包含审核状态的时候默认选择全部
          if (this.batchDataSelcet != 1) {
            this.batchDataSelcetId = response[0].id;
            this.batchDataTop.user_count = response[0].user_count;
            this.batchDataTop.material_count = response[0].material_count;
            this.batchDataTop.release_time = response[0].release_time;
            this.audit_status = response[0].audit_status;
          }

          this.getDirectUserList();
          this.showNameList = true;
          // 请求成功让滚动条置顶
          this.$nextTick(() => {
            document.querySelectorAll(".el-dialog__body")[0].scrollTop = 0;
          });
        })
        .catch(error => {
          this.$message({
            message: error.data.message,
            duration: 1000
          });
        });
    },
    //获取名单列表
    getDirectUserList(materialId) {
      this.loadingNameList = true;

      httpServer(apiSetting.getDirectUserList, {
        app_id: this.$getsessionStorage("appid"),
        material_id: this.uploadParam.material_id,
        mid_direct_batch_id: this.batchDataSelcetId, //批次号
        mid_material_allot_id: this.mid_material_allot_id,
        keywords: this.seachValue, //搜索条件 名称/手机号
        PageIndex: this.page.pageIndex,
        PageSize: this.page.pageSize,
        Conditions: ""
      })
        .then(response => {
          console.log(response);
          this.NameList_table_list = response.collection;
          // 大于两条的时候查看名单才可以出现滚动条，否则滚动条消失
          if (this.NameList_table_list.length > 2) {
            document.querySelectorAll(".el-dialog__body")[0].style.overflowY =
              "scroll";
          } else {
            document.querySelectorAll(".el-dialog__body")[0].style.overflowY =
              "hidden";
          }
          document.querySelectorAll(".el-dialog__body")[0].scrollTop = 0;
          this.loadingNameList = false;
        })
        .catch(error => {
          this.$message({
            message: error.data.message,
            duration: 1000
          });
        });
    },
    // 名单列表切换
    changebatchData(index, id) {
      this.batchDataTop.user_count = this.batchList[index].user_count;
      this.batchDataTop.material_count = this.batchList[index].material_count;
      this.batchDataTop.release_time = this.batchList[index].release_time;
      this.audit_status = this.batchList[index].audit_status;
      this.batchDataSelcet = index;
      this.batchDataSelcetId = id; //批次id
      this.page.pageIndex = 1;
      this.getDirectUserList();
    },
    // 获取活动预览的   上半部分信息
    getAppdetailTop() {
      httpServer(apiSetting.appDetailTop, {
        appId: this.$getsessionStorage("appid"),
        template_id: this.$getsessionStorage("template_id")
      })
        .then(response => {
          this.appDetaildata = response;
          this.app_status_code = response.app_status_code;
          this.audit_status_code = response.audit_status_code;
          this.getAppStateInfo(); //申请理由
          this.getAppdetailUnder();
          // 主线判断
          switch (response.app_status_code) {
            case this.$customState.app_status_code_800: //this.$customState.app_status_code_800
              this.isShowback = true;
              this.isShowbackxiu = true;
              break;
            case this.$customState.app_status_code_900: //this.$customState.app_status_code_900
              this.isShowback = true;
              this.isShowbackxiu = true;
              break;
            case this.$customState.app_status_code_600: //已通过   this.$customState.app_status_code_600
              // this.isShowback = true;
              // this.isShowbutton = false;
              this.isShowbackxiu = false;
              this.isSetPage = false;
              this.isup = false;
              this.isShowback = true;
              break;
            case this.$customState.app_status_code_700: //已上线  this.$customState.app_status_code_700
              // this.isShowback = true;
              // this.isShowbutton = false;
              this.isShowbackxiu = false;
              this.isSetPage = false;
              this.isup = false;
              this.isShowback = true;
              break;
          }
          // 支线判断
          switch (response.audit_status_code) {
            case this.$customState.audit_status_code_200: //this.$customState.audit_status_code_200
              this.isShowback = true;
              this.isShowbackxiu = false;

              break;
            case this.$customState.audit_status_code_300: //this.$customState.audit_status_code_300
              this.isShowback = true;
              this.isShowbackxiu = true;
              break;
          }
          if (this.$route.query.tabName == "organActiveManage") {
            //活动查看页面进来的
            this.isShowbutton = false;
            this.isShowbackxiu = false;
            this.isShowback = true;
            this.isShowPass = false;
          }
          if (this.$route.query.tabName == "activeAudit") {
            this.isShowbutton = false;
            this.isShowbackxiu = false;
            this.isShowback = true;
            if (
              response.audit_status_code ==
                this.$customState.audit_status_code_200 ||
              response.audit_status_code ==
                this.$customState.audit_status_code_500 ||
              response.audit_status_code ==
                this.$customState.audit_status_code_800 ||
              response.audit_status_code ==
                this.$customState.audit_status_code_1100
            ) {
              this.isShowPass = true;
              if (
                response.audit_status_code ==
                this.$customState.audit_status_code_200
              ) {
                this.title = "请填写驳回理由(活动驳回至待配置状态)";
              } else if (
                response.audit_status_code ==
                this.$customState.audit_status_code_800
              ) {
                this.title = "请填写驳回理由(延期驳回)";
              } else if (
                response.audit_status_code ==
                this.$customState.audit_status_code_1100
              ) {
                this.title = "请填写驳回理由(增加导入名单驳回)";
              } else {
                this.title = "请填写驳回理由(活动驳回至上线状态)";
              }
            } else {
              this.isShowPass = false;
            }
          } else {
            this.isShowPass = false;
            this.isShowbutton = true;
          }

          if (
            this.$route.query.tabName == "configPlatform" ||
            this.$route.query.tabName == "configResouce"
          ) {
            this.isSetPage = true;
            this.isup = true;
            this.isShowback = false;
            this.isShowbackxiu = false;
          }
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
        });
    },
    // 获取活动预览的   下半部分信息
    getAppdetailUnder() {
      this.loading = true;
      if (this.appDetaildata.type_name == "兑换平台") {
        httpServer(apiSetting.appDetailUnder, {
          template_id: this.$getsessionStorage("template_id")
        })
          .then(response => {
            this.cardList = response;
            // 判断 下半部分 资源列表 是否含有平台码
            for (var i in response) {
              if (response[i].grant_type == 1) {
                this.isWeixinCode = true;
              }
            }
            this.loading = false;
          })
          .catch(error => {
            this.loading = false;
            // console.log(error)
          });
      } else if (this.appDetaildata.type_name == "直采") {
        httpServer(apiSetting.appDirectDetailUnder, {
          template_id: this.$getsessionStorage("template_id")
          // isfilter: "1" //zy让加
        })
          .then(response => {
            this.cardList = response;
            // 判断 下半部分 资源列表 是否含有平台码
            for (var i in response) {
              if (response[i].grant_type == 1) {
                this.isWeixinCode = true;
              }
            }
            this.loading = false;
          })
          .catch(error => {
            this.loading = false;
          });
      }
    },
    prev() {
      // this.$router.push({
      //     path: "/activehome/exchange",
      //     query: {
      //         appId: this.$getsessionStorage("appid"),
      //         exchange: "exchange",
      //         typename: "兑换平台"
      //     }
      // });
      let appid = this.$getsessionStorage("appid");
      this.$setsessionStorage("appid", appid);
      if (this.appDetaildata.type_name == "兑换平台") {
        this.$setsessionStorage("chooseName", "exchange");
      }
      if (this.appDetaildata.type_name == "直采") {
        this.$setsessionStorage("chooseName", "directpurchase");
      }
      this.$router.push({ path: "/activehome/exchange" });
    },
    setPage() {
      this.$confirm("活动配置成功，是否发给项目负责人审核？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          //发送审核
          httpServer(apiSetting.appWaitVerified, {
            id: this.$getsessionStorage("appid")
          })
            .then(response => {
              this.$router.push({ path: "/activehome" });
              console.log("then.response:" + JSON.stringify(response));
              console.log(response);
              this.loading = false;
            })
            .catch(error => {
              this.$message({
                message: error.data.message,
                duration: 2000
              });
              // this.$message.error(error.data.message);
              this.loading = false;
            });
        })
        .catch(response => {});
    },
    getAppStateInfo() {
      // 申请理由
      httpServer(apiSetting.getAppStateInfo, {
        app_id: this.$getsessionStorage("appid"),
        state_code: this.audit_status_code
      })
        .then(response => {
          this.application_center = response;
          if (response.detailed != null || response.rejectreason != null) {
            this.application_isshow = true;
          }
          console.log("申请理由");
          console.log(response);
        })
        .catch(error => {
          this.$message({
            message: error.data.message,
            duration: 2000
          });
          // this.$message.error(error.data.message);
          this.loading = false;
        });
    },
    back() {
      // this.$router.push({ path: "/activeAudit" });
      console.log("我是预览页面的参数");
      console.log(this.$route.query.tabName);
      if (this.$route.query.tabName == "activeManage") {
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
      } else if (this.$route.query.tabName == "activeAudit") {
        this.$router.push({
          name: "activeAudit",
          params: {
            tabName: "preview",
            activeTypeIndex: this.$route.query.activeTypeIndex, //选中的人
            changeid: this.$route.query.changeid,
            activeStateIndex: this.$route.query.activeStateIndex,
            statue: this.$route.query.statue,
            isStauy: this.$route.query.isStauy
          }
        });
      } else {
        this.$router.back(-1);
      }
    },
    upShang() {
      this.$router.back(-1);
    },
    //导出用户名单到Excel
    downExportUsers() {
      this.downBoolean = false;
      httpServer(apiSetting.downExportUsers, {
        mid_direct_batch_id: this.batchDataSelcetId, //批次id
        app_id: this.$getsessionStorage("appid"),
        material_id: this.uploadParam.material_id,
        mid_material_allot_id: this.mid_material_allot_id
      })
        .then(response => {
          this.downBoolean = true;
          console.log("导出用户名单到Excel");
          window.location.href = apiSetting.downLoadUrl.url + "/" + response;
          // this.html = "<p>操作成功</p>";
          // this.showNameList = false;
          // this.showSaasDialog = true;
          // let _this = this;
          // let timer = setTimeout(function() {
          //     _this.showSaasDialog = false;
          //     _this.showNameList = true;
          // }, 500);
          // console.log(response);
        })
        .catch(error => {
          this.downBoolean = true;
          this.$message({
            message: error.data.message,
            duration: 2000
          });
        });
    },
    // 展开  收起
    packUpFun() {
      this.isOpen = !this.isOpen;
      if (this.isPackUp == "收起") {
        this.isPackUp = "展开";
      } else {
        this.isPackUp = "收起";
      }
    }
  }
};
</script>
<style>
#preview .reasonText .el-textarea__inner {
  height: 180px;
  /* background: red; */
  resize: none;
}
#preview .showNameListDialog .el-dialog {
  max-height: 470px;
  overflow: hidden;
}
#preview .showNameListDialog .el-dialog__header {
  border-bottom: 0px;
}
#preview .showNameListDialog .el-dialog__body {
  position: relative;
  padding-left: 0px;
  padding-right: 0px;
  padding-bottom: 20px;
  min-height: 325px;
}
#preview .batch_msg .exportbtnTwo {
  position: absolute;
  right: 251px;
  top: 24px;
  width: 95px;
  height: 32px;
  border: solid 1px #767c84;
  margin-left: 10px;
  border-radius: 4px;
  color: #393c40;
  font-size: 12px;
  line-height: 32px;
  cursor: pointer;
}
#preview .batch_msg .exportbtnTwo .el-icon-loading {
  position: absolute;
  top: 10px;
  left: 10px;
}
#preview .batch_msg .exportbtnTwo span {
  position: absolute;
  top: 1px;
  left: 15px;
}
#preview .batch_msg .el-button--primary {
  background-color: #fff;
}
</style>

<style  lang="less" scoped>
#preview {
  .ToAudit {
    margin-left: 5px;
    width: 100px;
    color: #ec5650;
    font-weight: normal;
    line-height: 20px;
    i {
      display: block;
      float: left;
      margin-top: 2px;
      width: 16px;
      height: 16px;
      margin-right: 2px;
      background: url("../../../../assets/images/images/warning.png") no-repeat
        left center;
      background-size: 100% 100%;
    }
  }
  .blueText {
    color: #4a90e2;
    font-size: 14px;
  }
  .active_modificate {
    width: 860px;
    background-color: #ffffff;
    border-radius: 8px;
    padding: 20px;
    border: solid 1px rgba(206, 206, 206, 0.46);
    margin-bottom: 20px;
    .modificate_title {
      line-height: 25px;
      margin-bottom: 10px;
      i {
        display: block;
        float: left;
        width: 24px;
        height: 24px;
        background: url("../../../../assets/images/images/modificate.png")
          no-repeat center;
        background-size: 100% 100%;
        margin-right: 10px;
      }
    }
    .modificate_detail {
      margin-left: 35px;
      margin-bottom: 10px;
    }
  }
  .preview_title {
    font-weight: bold;
    margin-bottom: 20px;
    span {
      display: block;
      float: left;
      width: 4px;
      height: 14px;
      background: #5a0ae0;
      margin-top: 3px;
      margin-right: 5px;
    }
  }
  .preview_content {
    width: 860px;
    background-color: #ffffff;
    border-radius: 8px;
    border: solid 1px rgba(206, 206, 206, 0.46);
    padding: 20px;

    .preview_box {
      width: 820px;
      background-color: #ffffff;
      box-shadow: 0px 0px 15px 0px #dbdbdb;
      padding: 15px 20px;
      .preview_header {
        position: relative;
        .active_name {
          margin-bottom: 15px;
        }
        .preview_active_item {
          margin-bottom: 10px;
          span {
            display: inline-block;
            width: 300px;
          }
        }
        .resouce {
          width: 300px;
          margin-bottom: 20px;
          span {
            color: #5a0ae0;
            cursor: pointer;
          }
          .el-icon-arrow-up {
            color: #5a0ae0;
            transition: transform 0.3s, -webkit-transform 0.3s;
          }
          .arrowDown {
            transform: rotateZ(180deg);
          }
        }
        .link {
          span {
            cursor: pointer;
            vertical-align: top;
            word-break: break-all;
            width: 73%;
            a {
              color: #1959ff;
            }
          }
        }
      }
      .weixin_code {
        position: absolute;
        right: 0px;
        top: 10px;
        width: 93px;
        cursor: pointer;
        img {
          display: block;
          width: 100%;
          height: 93px;
        }
        p {
          width: 100%;
          text-align: center;
        }
      }
    }
    .preview_active_list {
      .active_card {
        // border-top: 1px #d7d7d7 solid;
        padding: 10px;
        margin-bottom: 20px;
        box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);
        .pingtai_code {
          p {
            margin-bottom: 10px;
            padding: 0px 10px;
            span {
              display: inline-block;
              width: 190px;
            }
            .isEdit {
              color: #f55d5d;
            }
          }
          .pingtai_code_title {
            font-weight: bold;
            .list_num {
              display: inline-block;
              width: 20px;
              height: 20px;
              line-height: 20px;
              text-align: center;
              border-radius: 50%;
              font-style: normal;
              font-weight: normal;
              margin-right: 10px;
              color: #fff;
            }
            .numFirst {
              background-color: #b78dff;
            }
            .numSecond {
              background-color: #45d2b2;
            }
            .numThree {
              background-color: #fdb631;
            }
            .numFore {
              background-color: #32bbfd;
            }
            .numFive {
              background-color: #ef7070;
            }
          }
          .pingtai_code_count {
            border-bottom: 1px #dcdcdc solid;
            padding: 15px 10px;
            .el-icon-view {
              color: #ffb735;
              margin-left: 20px;
              cursor: pointer;
            }
            .el-icon-view:hover {
              color: #393c40;
            }
            .residueAmount {
              margin-top: 15px;
            }
          }
          .valid_time {
            span {
              width: 220px;
            }
          }
          .msg_text {
            margin-bottom: 10px;
            overflow: hidden;
            padding: 0px 10px;
            label {
              float: left;
              display: block;
            }
            div {
              width: 700px;
              float: left;
            }
          }
        }
        .redPage_code {
          p {
            span {
              width: 370px;
            }
          }
          .redPackage_item {
            li {
              width: 780px;
              height: 60px;
              border-top: 1px solid #dcdcdc;
              border-radius: 4px;
              padding: 10px 10px 0px 10px;
              margin-bottom: 10px;
              p {
                margin-bottom: 10px;
                span {
                  display: inline-block;
                  width: 250px;
                  i {
                    font-style: normal;
                    margin-right: 10px;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  .rejectBtn {
    background-image: linear-gradient(161deg, #fb7451 0%, #f64d34 100%);
    margin-left: 50px;
  }
  .passBtn {
    background-image: linear-gradient(138deg, #0dceab 0%, #00c387 100%);
    margin-left: 50px;
  }
  .showNameListDialog {
    .batchList {
      border-bottom: 1px solid #ecedef;
      overflow: hidden;
      padding-left: 20px;
      margin-bottom: 30px;
      li {
        float: left;
        height: 32px;
        background-color: #f0f0f0;
        margin-right: 15px;
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
        padding: 0px 15px;
        line-height: 32px;
        font-size: 12px;
        cursor: pointer;
      }
      .checkedBatch {
        background-color: #4a00e0;
        color: #fff;
      }
    }
    .batchListTitle {
      border-bottom: 1px solid #ecedef;
      overflow: hidden;
      padding-left: 20px;
      margin-bottom: 20px;
      padding-bottom: 10px;
      span {
        display: block;
        float: left;
        width: 4px;
        height: 15px;
        background: #4900e0;
        margin-top: 3px;
        margin-right: 10px;
      }
    }
    .batch_box {
      overflow: hidden;
      min-height: 330px;
      padding: 0px 20px;
      position: relative;
      .batch_msg {
        height: 70px;
        float: left;
        margin-bottom: 10px;
        div {
          margin-bottom: 10px;
          span {
            display: inline-block;
            width: 160px;
            margin-right: 10px;
            color: #2b2e31;
            font-size: 12px;
            i {
              margin-top: 2px;
              display: block;
              float: left;
              width: 14px;
              height: 14px;
              margin-right: 2px;
            }
          }
          .batch_msg_people {
            i {
              background: url("../../../../assets/images/images/grantNumIcon.png")
                no-repeat center;
              background-size: 100% 100%;
            }
          }
          .batch_msg_resouce {
            i {
              background: url("../../../../assets/images/images/grantResouceIcon.png")
                no-repeat center;
              background-size: 100% 100%;
            }
          }
          .batch_msg_price {
            i {
              width: 18px;
              height: 18px;
              margin-top: -2px;
              background: url("../../../../assets/images/images/grantPriceIcon.png")
                no-repeat center;
              background-size: 100% 100%;
            }
          }
        }
      }
      .batch_msg_time {
        float: left;
        margin-top: 15px;
        font-size: 12px;
        i {
          margin-top: 2px;
          display: block;
          float: left;
          width: 12px;
          height: 12px;
          margin-right: 2px;
          background: url("../../../../assets/images/images/grantTimeIcon.png")
            no-repeat center;
          background-size: 100% 100%;
        }
      }
      .exportbtn {
        position: absolute;
        right: 250px;
        top: 33px;
        width: 95px;
        height: 32px;
        border-radius: 4px;
        border: solid 1px #aaaeb3;
        margin-left: 10px;
        border-radius: 4px;
        color: #393c40;
        font-size: 12px;
        line-height: 32px;
        cursor: pointer;
        .exportIcon {
          display: block;
          float: left;
          width: 16px;
          height: 16px;
          background: url(../../../../assets/images/images/down.png) no-repeat
            left center;
          background-size: 16px 16px;
          margin-top: 8px;
          margin-left: 11px;
          margin-right: 10px;
        }
      }
    }
    .activeAllot_box_search {
      position: absolute;
      // float: right;
      right: 20px;
      top: 35px;
      margin-bottom: 20px;
      width: 220px;
      // margin-top: 10px;
      input {
        width: 120px;
      }
      .el-icon-close {
        right: 60px;
      }
    }
    .NameList_table_box {
      min-height: 180px;
      .NameList_table {
        width: 100%;
        margin-bottom: 20px;
        // margin-top: 20px;
        tbody {
          min-height: 135px;
          // display: inline-block;
          width: 100%;
        }
        tr {
          th {
            background: #f5f5f5;
            color: #aaaeb3;
            line-height: 40px;
            font-size: 12px;
          }
          td {
            text-align: center;
            font-size: 12px;
            line-height: 40px;
            border-bottom: 1px solid #ecedef;
          }
        }
      }
    }
    .noDataList {
      line-height: 100px;
      text-align: center;
    }
  }
}
</style>


