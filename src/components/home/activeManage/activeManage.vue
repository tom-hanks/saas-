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
          <div v-show="isShowEacharts" id="eacharts"></div>
          <div v-show="!isShowEacharts" class="noDataMsg">
            <img src="../../../assets/images/images/nodata.png" alt>
            <p>暂无活动</p>
          </div>
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
          <ul class="clearfix">
            <li
              :class="{typeActive:activeTypeIndex == Tindex}"
              v-for="(type,Tindex) in activeType"
              :key="Tindex"
              @click="isclickshow?typeTab(Tindex,type.id,type.type_ename):''"
            >
              <div v-if="countNum">{{type.type_name}}</div>

              <i
                v-for="(item_state_arry,index_increaseName) in notification"
                :key="index_increaseName+'f'"
                class="num_tip"
                v-if="item_state_arry.page_code == 'activeManage'&&item_state_arry.region_code=='stateTable'&&item_state_arry.public_id == type.id"
              >{{item_state_arry.num<10000?item_state_arry.num:'...'}}</i>
            </li>
          </ul>
        </div>
        <!-- 包一下 -->
        <div class="main">
          <div class="state_tab">
            <p>状态：</p>
            <ul class="clearfix">
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
                    v-if="item_state_arry.page_code == 'activeManage'&&item_state_arry.region_code=='stateChildTable'&&item_state_arry.code == state.code"
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
                  <div>
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
                        <div :class="{onLineTime: isStauy==2}">
                          <p class="time_year" v-if="item.start_year==item.end_year">
                            <span class="start_year onlyOne">{{item.start_year}}年</span>
                          </p>
                          <p class="time_year" v-if="item.start_year!=item.end_year">
                            <span class="start_year">{{item.start_year}}年</span>
                            <span class="end_tear">{{item.end_year}}年</span>
                          </p>
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
                        </div>
                        <el-tooltip
                          :popper-class="(item.audit_status_code==800 || item.audit_status_code==1100 || item.audit_status_code == 500)?'':'item'"
                          effect="dark"
                          placement="top"
                        >
                          <div
                            slot="content"
                            v-if="(item.audit_status_code==500)"
                          >项目{{item.audit_status_name}}，暂不可操作</div>
                          <div slot="content" v-if="(item.audit_status_code==1100)">名单审核中，暂不可操作</div>
                          <div slot="content" v-if="(item.audit_status_code==800)">项目延期审核中，暂不可操作</div>

                          <div
                            v-if="isStauy==2"
                            :class="item.audit_status_code==800 || item.audit_status_code==1100 || item.audit_status_code == 500?'postponeBtnDisabled':'postponeBtn'"
                            @click.self="item.audit_status_code==800 || item.audit_status_code==1100 || item.audit_status_code == 500?'':postponeFun(item.id,item.template_id)"
                          >延期
                            <!-- item_state_arry.code !='0'自己设置成空状态既不是delayTrue也不是delayFlase，代表点击过了，可以继续点击 -->
                            <span
                              v-for="(item_state_arry,index_delay) in notification"
                              v-if="(item.audit_status_code!=800 || item.audit_status_code!=1100 || item.audit_status_code != 500) && (item.id == item_state_arry.public_id) &&(item_state_arry.code == 'delayTrue'||item_state_arry.code == 'delayFalse')&&(item_state_arry.code !='0')"
                              class="tickMark"
                              :key="index_delay+'s'"
                              :class="{'tickMark_green':item.id == item_state_arry.public_id&&item_state_arry.code == 'delayTrue','el-icon-circle-check':item.id == item_state_arry.public_id&&item_state_arry.code == 'delayTrue','tickMark_red':item.id == item_state_arry.public_id&&item_state_arry.code == 'delayFalse','el-icon-warning':item.id == item_state_arry.public_id&&item_state_arry.code == 'delayFalse'}"
                              @click="item.id == item_state_arry.public_id&&(item_state_arry.code == 'delayTrue'||item_state_arry.code == 'delayFalse')&&item_state_arry.code == 'delayTrue'?tip_state('1',item,item_state_arry,index_delay):tip_state('2',item,item_state_arry,index_delay)"
                            ></span>
                          </div>
                        </el-tooltip>

                        <div class="allot_resource">
                          <div class="resource_num">
                            <div class="authorization">授权资源数：{{item.app_material_infos.length}}</div>
                            <div>使用资源数：{{item.use_material_infos .length}}</div>
                            <span
                              v-if="item.app_material_infos.length>0 || item.use_material_infos.length>0"
                              @click="lookResouce(index)"
                            >
                              <i class="el-icon-view"></i>
                              查看
                            </span>
                          </div>
                        </div>
                        <div class="turn_down">
                          <div :class="isStauy==2?'stateLong':'turn_down_stady'">
                            <i
                              :class="{wait:isStauy==0,pass:isStauy==1,over:isStauy==2,reject:isStauy==3 || isStauy==5,downLine:isStauy==4}"
                            ></i>
                            状态：
                            <span
                              v-if="isStauy==0"
                              class="waitText"
                            >{{item.audit_status_name}}</span>
                            <span v-if="isStauy==1" class="passText">{{item.audit_status_name}}</span>
                            <span v-if="isStauy==2" class="overText">{{item.app_status_name}}</span>
                            <span
                              v-if="isStauy==3 || isStauy==5"
                              class="rejectText"
                            >{{item.audit_status_name}}</span>
                            <span v-if="isStauy==4" class="downLineText">{{item.app_status_name}}</span>
                          </div>
                          <div class="turn_down_btn" v-if="isStauy==5">
                            <el-button type="primary" class="pass" @click="passFun(item.id)">前往修改</el-button>
                          </div>
                          <el-tooltip
                            :popper-class="item.audit_status_code == 500 || item.audit_status_code==1100 || item.audit_status_code==800?'':'item'"
                            effect="dark"
                            placement="top"
                          >
                            <div
                              slot="content"
                              v-if="(item.audit_status_code==500)"
                            >项目{{item.audit_status_name}}，暂不可操作</div>
                            <div slot="content" v-if="(item.audit_status_code==1100)">名单审核中，暂不可操作</div>
                            <div slot="content" v-if="(item.audit_status_code==800)">项目延期审核中，暂不可操作</div>
                            <div
                              class="emergency_offline"
                              :class="item.audit_status_code == 500 || item.audit_status_code==1100 || item.audit_status_code==800?'downLineBtnHuise':'downLineBtn'"
                              v-if="isStauy==2"
                              @click.self="item.audit_status_code == 500 || item.audit_status_code==1100 || item.audit_status_code==800?'':clickswitch(item.id)"
                            >
                              紧急下线
                              <span
                                v-for="(item_state_arry,index_urgentOffline) in notification"
                                v-if="(item.audit_status_code != 500 || item.audit_status_code!=1100 || item.audit_status_code!=800)&&(item.id == item_state_arry.public_id&&item_state_arry.code == 'urgentOfflineTrue'||item_state_arry.code == 'urgentOfflineFalse') && (item_state_arry.code !='0')"
                                class="tickMark"
                                :key="index_urgentOffline+'s'"
                                :class="{'tickMark_green':item.id == item_state_arry.public_id&&item_state_arry.code == 'urgentOfflineTrue','el-icon-circle-check':item.id == item_state_arry.public_id&&item_state_arry.code == 'urgentOfflineTrue','tickMark_red':item.id == item_state_arry.public_id&&item_state_arry.code == 'urgentOfflineFalse','el-icon-warning':item.id == item_state_arry.public_id&&item_state_arry.code == 'urgentOfflineFalse'}"
                                @click="item.id == item_state_arry.public_id&&(item_state_arry.code == 'urgentOfflineTrue'||item_state_arry.code == 'urgentOfflineFalse')&&item_state_arry.code == 'urgentOfflineTrue'?tip_state('1',item,item_state_arry,index_urgentOffline):tip_state('2',item,item_state_arry,index_urgentOffline)"
                              ></span>
                            </div>
                          </el-tooltip>
                          <!-- 没有提交过名单 显示-->
                          <div
                            class="downLineBtn addNameList"
                            v-if="isStauy==2 && item.audit_status_code != 1100 && item.audit_status_code!=800 && item.audit_status_code != 500"
                            @click.self="addNameList(item.id,item.template_id)"
                          >
                            添加名单
                            <span
                              class="tickMark"
                              v-if="isStauy==2 && item.audit_status_code != 1100 && item.audit_status_code!=800 && item.audit_status_code != 500 && item.id == item_state_arry.public_id&&(item_state_arry.code == 'increaseNameTrue'||item_state_arry.code == 'increaseNameFalse') && (item_state_arry.code !='0')"
                              v-for="(item_state_arry,index_increaseName) in notification"
                              :key="index_increaseName+'s'"
                              :class="{'tickMark_green':item.id == item_state_arry.public_id&&item_state_arry.code == 'increaseNameTrue','el-icon-circle-check':item.id == item_state_arry.public_id&&item_state_arry.code == 'increaseNameTrue','tickMark_red':item.id == item_state_arry.public_id&&item_state_arry.code == 'increaseNameFalse','el-icon-warning':item.id == item_state_arry.public_id&&item_state_arry.code == 'increaseNameFalse'}"
                              @click="item.id == item_state_arry.public_id&&(item_state_arry.code == 'increaseNameTrue'||item_state_arry.code == 'increaseNameFalse')&&item_state_arry.code == 'increaseNameTrue'?tip_state('1',item,item_state_arry,index_increaseName):tip_state('2',item,item_state_arry,index_increaseName)"
                            ></span>
                          </div>
                          <!-- 提交过名单 显示-->
                          <el-tooltip
                            :popper-class="isStauy==2 && (item.audit_status_code == 1100 || item.audit_status_code==800 || item.audit_status_code == 500) && inquire.statue !=14000?'':'item'"
                            effect="dark"
                            placement="top"
                          >
                            <div
                              slot="content"
                              v-if="(isStauy==2 && item.audit_status_code == 1100)"
                            >名单审核中，暂不可操作</div>
                            <div
                              slot="content"
                              v-if="(isStauy==2 && item.audit_status_code == 800)"
                            >项目延期审核中，暂不可操作</div>
                            <div
                              slot="content"
                              v-if="(isStauy==2 && item.audit_status_code == 500)"
                            >项目{{item.audit_status_name}}，暂不可操作</div>
                            <div
                              class="downLineBtn addNameList addNameListHuise"
                              v-if="isStauy==2 && (item.audit_status_code == 1100 || item.audit_status_code==800 || item.audit_status_code == 500) && inquire.statue !=14000"
                            >添加名单</div>
                          </el-tooltip>
                          <div
                            class="lookReason"
                            v-if="isStauy==3"
                            @click="rejectFun(1,item.id,item.template_id,item.audit_status_code)"
                          >
                            <el-button type="primary" class="edit_btn">查看并修改</el-button>
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
          <p v-if="rejection">{{rejection_reason}}</p>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer resourceListFooter">
        <el-button @click="showReasonDialog = false">取 消</el-button>
        <el-button
          type="primary"
          v-if="lookAudit_status_code != 1200 && lookAudit_status_code != 900 && lookAudit_status_code != 600"
          @click="appRejec"
        >前往修改</el-button>
      </div>
    </el-dialog>
    <!-- 活动延期申请  弹框  -->
    <el-dialog title="活动延期申请" :visible.sync="showPostponeDialog">
      <el-form :model="postponeForm" :rules="rules" ref="postponeForm">
        <el-form-item prop="postponeTime" label="活动延期至">
          <el-date-picker
            v-model="postponeForm.postponeTime"
            type="datetime"
            :default-value="postponeForm.postponeTime"
            placeholder="选择日期时间"
            @change="setDateTime"
            format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions0"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="12:00:00"
          ></el-date-picker>
          <p class="postponeTimeNotice">
            <span class="red_star">*</span>
            当前活动下线时间为{{offline_time}}
          </p>
        </el-form-item>
        <el-form-item prop="postponeReason" label="申请理由">
          <el-input
            class="postponeReasonText"
            type="textarea"
            v-model="postponeForm.postponeReason"
            placeholder="请输入申请理由"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer resourceListFooter">
        <el-button @click="showPostponeDialog = false">取 消</el-button>
        <el-button type="primary" :loading="!stop_clicks" @click="stop_clicks?sendCheck():''">发送审核</el-button>
      </div>
    </el-dialog>
    <!-- 延时 系统通知 -->
    <el-dialog title="系统通知" :visible.sync="systemNoticeDialog" class="systemNotice">
      <!-- <div>审核通过通知：邮件信息带过来</div> -->
      <div>
        <p>审核驳回通知：邮件信息带过来</p>
        <p>驳回理由：无</p>
      </div>
      <div slot="footer" class="dialog-footer resourceListFooter">
        <el-button @click="systemNoticeDialog = false">取 消</el-button>
        <el-button type="primary" @click="systemNoticeFun">确定</el-button>
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
import { setTimeout } from "timers";
const saasDialog = () =>
  import(/* webpackChunkName:"dialog" */ "../../dialog/dialog");
export default {
  name: "activeManage",
  props: {},
  components: {
    saasDialog
  },
  data() {
    return {
      stateArry: [], //状态的数组
      stateArry_csw: [
        {
          id: "1077553335143370752",
          page_code: "activeManage", //page_key
          region_code: "appList", //region_key
          code: "urgentOffline", //之前json里面的type过来的(驳回，通过)
          user_id: 123,
          num: 1, //之前json里面的value过来的
          public_id: "1077110880908480512", //之前json里面的appid过来的
          father_id: 12313213123
        },
        {
          id: "1082513511717933056",
          page_code: "activeManage",
          region_code: "appList",
          code: "delay",
          user_id: 123,
          num: 2,
          public_id: "1078132398786482176",
          father_id: 12313213123
        },
        {
          id: "12313213123",
          page_code: "navLeft",
          region_code: "appList",
          code: "adsfasfd",
          user_id: 123,
          num: 1,
          public_id: "1029253832108019712", //导航的id
          father_id: 12313213123
        },
        {
          id: "12313213123",
          page_code: "navLeft",
          region_code: "appList",
          code: "adsfasfd",
          user_id: 123,
          num: 1,
          public_id: "1042249899518857216", //子导航的id
          father_id: 12313213123
        }
      ], //静态数据模拟

      list_state_arry: [], //符合条件的数据
      postponeForm: {
        postponeTime: "",
        postponeReason: ""
      },
      stop_clicks: true, //发送审核按钮的控制
      pickerOptions0: {},
      increaseNameShow: null, //添加名单的提示标签控制显示隐藏
      // 系统通知弹框
      systemNoticeDialog: false,
      //申请活动延时 弹框
      showPostponeDialog: false,
      lookAudit_status_code: "", //驳回 - 点击查看修改的时候 - 如果是延时 或者   名单导入的时候 弹窗就没有前往修改的按钮
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
      isStauy: 0, //  0审核中 1已通过   2已上线    3已驳回   4紧急下线  5已下线
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
      isShowEacharts: true,
      switchValue: true,
      switchindex: 0,
      appid: 0,
      template_id: 0,
      offline_time: "",
      pickerOptions: ""
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
    this.pickerOptions = this.postponeForm.postponeTime;
    if (this.$route.params.tabName == "preview") {
      this.activeTypeIndex = this.$route.params.activeTypeIndex;
      this.inquire.id = this.$route.params.changeid;
      this.activeStateIndex = this.$route.params.activeStateIndex;
      this.inquire.statue = this.$route.params.statue;
      this.isStauy = this.$route.params.isStauy;
    }
    // 必须大于指定日期
    let that = this;
    this.pickerOptions0 = {
      disabledDate(time) {
        var nowTime = that.postponeForm.postponeTime;
        var thisTime = nowTime;
        thisTime = thisTime.replace(/-/g, "/");
        var timeding = new Date(thisTime);
        timeding = timeding.getTime();
        return time.getTime() <= timeding - 8.64e7;
      }
    };
  },
  mounted() {
    // setTimeout(() => {
    //   this.$store.commit("notification", this.stateArry_csw);
    // }, 3000);

    this.drawPie();
    this.getCoundBycode();
    // 此处为了记录当前选中的table 所以要区分是第一次进来 （可优化）
    if (this.$route.params.tabName == "preview") {
      this.getAppTypeList();
    } else {
      this.getAppTypeList(0);
    }
    this.page.pageIndex = 1;
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
    apiSetting.getAppList.page = this.page; //api接口分页赋值
    apiSetting.getAppList.dataList = this.dataList; //api分页数据赋值
  },
  methods: {
    // 系统通知  确认按钮
    systemNoticeFun() {},
    //延时按钮
    postponeFun(app_id, template_id) {
      this.postponeForm.postponeReason = "";
      this.appid = app_id;
      this.template_id = template_id;
      httpServer(apiSetting.appDetailTop, {
        appId: app_id,
        template_id: template_id
      })
        .then(response => {
          this.offline_time = response.offlinetime;
          this.postponeForm.postponeTime = response.offlinetime;
          this.loading = false;
          this.showPostponeDialog = true;
        })
        .catch(error => {
          this.loading = false;
        });
    },
    // 查询消息通知-获取通知
    // getNotification() {
    //   this.$getMid_notify("activeManage").then(response => {
    //     // this.stateArry = response;
    //     console.log("跑出来", response);
    //   });
    // },
    tip_state(number, object, item_state_arry, index) {
      if (number == "2") {
        httpServer(apiSetting.getRejectreason, {
          appId: object.id
        })
          .then(response => {
            // 2代表着是驳回的话
            // this.showReasonDialog = true;
            console.log("传入对象", object);
            this.$deleteMid_notify(item_state_arry, "activeManage"); //删除消息
            this.$alert(`<p>${response}</p>`, "驳回理由", {
              dangerouslyUseHTMLString: true,
              showCancelButton: false,
              showConfirmButton: true,
              confirmButtonClass: "activeManagebut_guanbi",
              confirmButtonText: "关闭",
              cancelButtonText: "取消"
            })
              .then(() => {
                // this.stateArry[index].code = 0;
              })
              .catch(() => {
                // this.stateArry[index].code = 0;
              });
          })
          .catch(error => {
            console.log(error); //loading层关闭
          });
      } else {
        this.$deleteMid_notify(item_state_arry, "activeManage"); //删除消息
        // 这里代表着是通过的话
        this.$alert("<p>恭喜你！申请已通过</p>", "提示", {
          dangerouslyUseHTMLString: true,
          showCancelButton: false,
          showConfirmButton: true,
          confirmButtonClass: "activeManagebut_guanbi",
          confirmButtonText: "关闭",
          cancelButtonText: "取消"
        })
          .then(() => {
            // this.stateArry[index].code = 0; //改变当前索引下的value的值 让当前的隐藏
          })
          .catch(() => {
            // this.stateArry[index].code = 0;
          });
      }
    },
    //延时弹框
    setDateTime() {},
    //延期发送审核
    sendCheck() {
      this.stop_clicks = false; //点击发送禁止重复快速点击
      var delay = {
        delay_date: this.postponeForm.postponeTime,
        rejectreason: this.postponeForm.postponeReason
      };
      httpServer(apiSetting.delayApply, {
        id: this.appid,
        delay_apply_info: delay
      })
        .then(response => {
          // console.log("紧急下线");
          this.stop_clicks = true; //点击发送禁止重复快速点击

          console.log(response);
          this.showPostponeDialog = false;
          this.isStauy = 2;
          this.getList();
          this.getCoundBycode();
        })
        .catch(error => {
          console.log(error); //loading层关闭
          this.stop_clicks = true; //点击发送禁止重复快速点击
        });
    },
    // 添加名单按钮
    addNameList(id, template_id) {
      this.$router.push({
        name: "addNameList",
        query: {
          tabName: "activeManage",
          activeTypeIndex: this.activeTypeIndex, //选中的人
          changeid: this.inquire.id,
          activeStateIndex: this.activeStateIndex,
          statue: this.inquire.statue,
          isStauy: this.isStauy
        }
      });
      this.$setsessionStorage("template_id", template_id);
      this.$setsessionStorage("appid", id);
      // this.$router.push({ path: "/addNameList" });
    },
    typeTab(index, id, type_ename) {
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
    //删除消息通知
    // deleteMid_notify(item) {
    //   httpServer(apiSetting.postMid_notify, {
    //     // id: id //功能主键id
    //     page_code: item.page_code, //页面Code ,
    //     region_code: item.region_code, // 区域Code ,
    //     code: item.code, //code ,
    //     user_id: item.user_id, // (integer, optional): 用户Id ,
    //     public_id: item.public_id, // (integer, optional),
    //     app_id: item.app_id, // (integer, optional): 项目Id ,
    //     num: item.num, // (integer, optional): 通知数量 ,
    //     event_id: item.event_id, // (integer, optional): 通知事件配置Id ,
    //     tree_id: item.tree_id, // (integer, optional): 通知树Id ,
    //     father_id: item.father_id, // (integer, optional): 父级Id ,
    //     id: item.id, // (integer, optional): ,
    //     status: item.status, // (integer, optional): 状态 ,
    //     create_date_time: item.create_date_time, // (string, optional): 创建时间 ,
    //     update_date_time: item.update_date_time // (string, optional): 更新时间
    //   })
    //     .then(response => {
    //       console.log("删除消息");
    //       console.log(response);
    //       this.getNotification(); //通过或者驳回弹窗就开始刷新消息通知
    //     })
    //     .catch(error => {
    //       console.log(error); //loading层关闭
    //     });
    // },
    //  切换审核状态   符合条件的进行消息删除
    stateTab(index, item) {
      //   console.log("我是当前的item", item.code);
      this.notification.forEach(element => {
        if (
          element.page_code == "activeManage" &&
          element.region_code == "stateChildTable" &&
          element.code == item.code
        ) {
          this.$deleteMid_notify(element, "activeManage");
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
          tabName: "activeManage",
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
          //   console.log("我是活动管理统计");
          //   console.log(response);
          this.topmain.downline_count = response.downline_count;
          this.topmain.online_count = response.online_count;
          this.topmain.reject_count = response.reject_count;
          this.topmain.urgentdownline_count = response.urgentdownline_count;
          this.topmain.verified_count = response.verified_count;
          this.topmain.wait_count = response.wait_count;
          if (
            response.urgentdownline_count == 0 &&
            response.downline_count == 0 &&
            response.online_count == 0 &&
            response.verified_count == 0 &&
            response.wait_count == 0 &&
            response.reject_count == 0
          ) {
            this.isShowEacharts = false;
          } else {
            this.drawPie(
              response.urgentdownline_count,
              response.downline_count,
              response.online_count,
              response.verified_count,
              response.wait_count,
              response.reject_count
            );
            this.isShowEacharts = true;
          }

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
        statusCode: this.$customState.app_status_code_14000 //默认50因为导航角标永远代表待审核的数量
      })
        .then(response => {
          this.$nextTick(function() {
            this.countNum = true;
          });
          if (num == 0) {
            //num等于0的话代表着第一次进来需要把数据第一个id传过去
            this.inquire.id = response[0].id; //默认type取第一个
            this.type_enameName = response[0].type_ename;
            console.log("一进来就获取消息队列", this.notification);
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
      httpServer(apiSetting.getAppList, {
        Name: this.seachValue,
        ProductClass: this.inquire.id,
        PageIndex: this.page.pageIndex,
        AppStatusCode: this.inquire.statue,
        PageSize: this.page.pageSize
      })
        .then(response => {
          this.isclickshow = true;
          this.loading = false; //loading层关闭
          this.$getMid_notify("activeManage");
          this.list_state_arry = [];
          for (var i = 0; i < this.notification.length; i++) {
            if (i < apiSetting.getAppList.dataList.length) {
              console.log(i);
              this.list_state_arry.push(this.notification[i]);
            } else {
              break;
            }
          }
          console.log(this.list_state_arry);
          console.log("分配列表");
          console.log(apiSetting.getAppList.dataList.length);
          this.dataList = apiSetting.getAppList.dataList;
          this.itemListloading = true;
          let item = apiSetting.getAppList.dataList;
          console.log("大萨达所");
          console.log(this.dataList);
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
    rejectFun(num, id, template_id, audit_status_code) {
      this.lookAudit_status_code = audit_status_code;
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

      this.showReasonDialog = false;
      this.$setsessionStorage("template_id", this.template_id);
      this.$setsessionStorage("appid", this.appid);
      if (this.$route.params.tabName == "preview") {
        this.$setsessionStorage("chooseName", "directpurchase");
      } else {
        this.$setsessionStorage("chooseName", this.type_enameName);
      }
      this.$router.push({ path: "/activehome/exchange" });
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
        series: [
          {
            name: "",
            type: "pie",
            radius: "55%",
            center: ["50%", "40%"],
            data: [
              {
                value: urgentdownline == 0 ? "" : urgentdownline,
                name: "紧急下线" + urgentdownline,
                itemStyle: { color: "#8200ff" }
              },
              {
                value: downline == 0 ? "" : downline,
                name: "已下线活动" + downline,
                itemStyle: { color: "#b2b6b8" }
              },
              {
                value: online == 0 ? "" : online,
                name: "已上线活动" + online,
                itemStyle: { color: "#0ae2a0" }
              },
              {
                value: verified == 0 ? "" : verified,
                name: "已通过活动" + verified,
                itemStyle: { color: "#46BBFF" }
              },
              {
                value: wait == 0 ? "" : wait,
                name: "审核中活动" + wait,
                itemStyle: { color: "#ffba00" }
              },
              {
                value: reject == 0 ? "" : reject,
                name: "驳回活动" + reject,
                itemStyle: { color: "#f96748" }
              }
            ]
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
  border: 0;
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
#activeManage span,
#activeManage div {
  border: none;
  outline: 0 none !important;
}
#activeManage span.tickMark.tickMark_red.el-icon-warning::before {
  position: absolute;
  right: 0;
  background: #ffffff;
  border-radius: 50%;
}
#activeManage span.tickMark.tickMark_green.el-icon-circle-check:before {
  position: absolute;
  right: 0;
  background: #ffffff;
  border-radius: 50%;
}
#activeManage .resourceDialog .el-dialog .el-dialog__header {
  border: none;
}
#activeManage .resourceDialog .el-dialog .el-dialog__body {
  padding: 20px 0px;
}
#activeManage .systemNotice .el-dialog__body {
  min-height: 80px;
}
#activeManage .reasonText .el-textarea__inner {
  height: 180px;
  resize: none;
}
#activeManage .el-button--default {
  margin-right: 20px;
}

#activeManage .el-switch__label.is-active {
  color: #393c40;
}
#activeManage .el-switch__label * {
  font-size: 12px;
}
#activeManage .postponeReasonText {
  width: 470px;
}
#activeManage .postponeReasonText .el-textarea__inner {
  resize: none;
  height: 65px;
}
.activeManagebut_guanbi {
  background: linear-gradient(42deg, #4900e0 0%, #8d2de2 100%) !important;
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
        .noDataMsg {
          text-align: center;
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
        // overflow: hidden;
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
          position: relative;
          i.num_tip {
            top: 0;
            right: 0;
          }
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
                right: -21px;
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
                  width: 280px;
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
              .tickMark {
                display: inline-block;
                width: 74px;
                height: 54px;
                font-size: 18px;
                border-radius: 17px;
                position: absolute;
                top: -8px;
                right: -2px;
              }
              .tickMark_green {
                color: #1ac593;
                border: 0;
                // background: #ffffff;
              }
              .tickMark_red {
                color: #ec5650;
                // background: #ffffff;
              }
              .activeAllot_msg_left {
                float: left;
                width: 260px;
                position: relative;
                .onLineTime {
                  width: 180px;
                }
                .postponeBtn {
                  width: 54px;
                  height: 30px;
                  background-image: linear-gradient(
                    42deg,
                    #00b4ff 0%,
                    #cbd8db 100%
                  );
                  border: 0;
                  border-radius: 15px;
                  text-align: center;
                  line-height: 30px;
                  color: #fff;
                  right: 0px;
                  top: 10px;
                  position: absolute;
                  cursor: pointer;
                }
                .postponeBtnDisabled {
                  width: 54px;
                  height: 30px;
                  background-image: linear-gradient(
                    161deg,
                    #ccc0bd 0%,
                    #d2c8c6 100%
                  );
                  border-radius: 15px;
                  text-align: center;
                  line-height: 30px;
                  color: #fff;
                  right: 0px;
                  top: 10px;
                  position: absolute;
                  cursor: pointer;
                }
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
                    span:hover .el-icon-view {
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
                  .el-icon-view {
                    margin-right: 5px;
                  }
                }
                p:hover {
                  color: #393c40;
                }
              }
              .turn_down {
                // margin-top: 15px;
                // overflow: hidden;
                .stateLong,
                .turn_down_stady,
                .turn_down_btn {
                  float: left;
                  // width: 93px; // overflow: hidden;
                  // text-overflow: ellipsis;
                  // -o-text-overflow: ellipsis;
                  // white-space: nowrap; // text-align: right;
                }
                .stateLong,
                .turn_down_stady {
                  margin-top: 23px;
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
                // .stateLong {
                //     .overText {
                //         display: table-cell;
                //     }
                // }
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
                    margin-left: 12px;
                    margin-top: 18px;
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
                  margin-top: 18px;
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
                .emergency_offline {
                  position: relative;
                }
                .downLineBtn {
                  margin-top: 15px;
                  float: left;
                  width: 70px;
                  height: 30px;
                  background-image: linear-gradient(
                    161deg,
                    #fb7451 0%,
                    #f64d34 100%
                  );
                  box-shadow: -10px 3px 14px 0px rgba(175, 175, 175, 0.2);
                  border-radius: 5px;
                  text-align: center;
                  line-height: 30px;
                  color: #fff;
                  font-size: 12px;
                  cursor: pointer;
                }
                .downLineBtnHuise {
                  margin-top: 15px;
                  float: left;
                  width: 70px;
                  height: 30px;
                  background-image: linear-gradient(
                    161deg,
                    #fb7451 0%,
                    #f64d34 100%
                  );
                  box-shadow: -10px 3px 14px 0px rgba(175, 175, 175, 0.2);
                  border-radius: 5px;
                  text-align: center;
                  line-height: 30px;
                  color: #fff;
                  font-size: 12px;
                  cursor: pointer;
                  background-image: linear-gradient(
                    161deg,
                    #ccc0bd 0%,
                    #d2c8c6 100%
                  );
                }
                .addNameList {
                  background-image: linear-gradient(
                    45deg,
                    #ffa200 0%,
                    #ffcf00 100%
                  );
                  float: right;
                  margin-left: 10px;
                  position: relative;
                }
                .addNameListHuise {
                  background-image: linear-gradient(
                    161deg,
                    #ccc0bd 0%,
                    #d2c8c6 100%
                  );
                }
                .downLineBtnHuise {
                  background-image: linear-gradient(
                    161deg,
                    #ccc0bd 0%,
                    #d2c8c6 100%
                  );
                  // margin-left: 10px;
                  position: relative;
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
  .rejectIcon,
  .passIcon {
    display: block;
    position: absolute;
    right: -5px;
    top: -5px;
    width: 16px;
    height: 16px;
  }
  .passIcon {
    background: url(../../../assets/images/images/editOver.png) no-repeat center;
    background-size: 100% 100%;
  }
  .rejectIcon {
    background: url(../../../assets/images/images/warning.png) no-repeat center;
    background-size: 100% 100%;
  }
  .postponeTimeNotice {
    color: #2b2e31;
    font-size: 12px;
    margin-left: 80px;
    line-height: 20px;
  }
  .systemNotice {
    div {
      p {
        line-height: 30px;
      }
    }
  }
}
</style>


     
     