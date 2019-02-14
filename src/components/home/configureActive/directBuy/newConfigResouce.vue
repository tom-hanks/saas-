<template>
  <div id="newConfigResouce">
    <div class="newConfigResouce_content" v-loading="showResouceListLoading">
      <div class="newConfigResouce_title">
        <p class="page_title">
          <span></span>资源配置
        </p>
        <div class="btn_list">
          <span v-if="isShowResouceList" @click="lookNameList()">
            <i class="el-icon-view"></i>查看名单
          </span>
          <span class="import_nameList" v-if="isShowResouceList">
            <el-upload
              class="upload-demo"
              ref="upload"
              drag
              :action="UploadUrl()"
              :headers="headers"
              :data="uploadParam"
              :on-change="upChange"
              :on-success="uploadSuccess"
              :on-error="uploaderror"
              :before-upload="beforeAvatarUpload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :showFileList="false"
            >重新导入名单</el-upload>
          </span>
          <span class="download">
            <a :href="getDownload" target="view_window">模板下载</a>
          </span>
        </div>
      </div>
      <div class="addNameList" v-if="!isShowResouceList">
        <el-upload
          class="upload-demo"
          ref="upload"
          drag
          :action="UploadUrl()"
          :headers="headers"
          :data="uploadParam"
          :on-change="upChange"
          :on-success="uploadSuccess"
          :on-error="uploaderror"
          :before-upload="beforeAvatarUpload"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :showFileList="false"
        >
          <touch-ripple :speed="1" :opacity="0.3" color="#cccccc" transition="ease">
            <div class="addNameList_content">
              <h1>点击添加名单</h1>
              <div></div>
              <p>或者把名单拖拽至这儿</p>
            </div>
          </touch-ripple>
        </el-upload>
      </div>
      <div class="resouceList" v-if="isShowResouceList">
        <div class="resouce_card" v-for="(item,index) in resouceList" :key="index">
          <div
            class="resouce_info"
            :style="{backgroundImage: 'url(' + item.icon + ')', backgroundSize:'100% 100%'}"
          >
            <div class="resouce_info_content">
              <div class="resouce_title">
                <span
                  class="resouce_index"
                  :class="[{'firstIndex': index % 3 == 0},{'secondIndex':index%3 == 1},{'thiredIndex':index%3 == 2,}]"
                >{{index+1}}</span>
                <span class="name" :title="item.material_name">{{item.material_name}}</span>
                <div class="nameList_view" @click="lookNameList(item)">
                  <i class="el-icon-view"></i>查看名单
                </div>
              </div>
              <div class="amount">
                <dl class="procurement">
                  <dt>{{item.grant_type ==3?"采购金额":"采购数量"}}</dt>
                  <dd>{{item.allocation_count }}</dd>
                </dl>
                <dl class="procurement">
                  <dt>发放人数</dt>
                  <dd>{{item.user_count }}</dd>
                </dl>
                <dl>
                  <dt>{{item.grant_type ==3?"发放金额":"发放数量"}}</dt>
                  <dd>{{item.amount }}</dd>
                </dl>
              </div>
            </div>
          </div>
          <!-- 直接充值 -->
          <div class="resouce_config" v-if="item.grant_type ==3 && item.type_ename =='zichong'">
            <div class="resouce_config_item">
              <div class="resouce_config_name">发放形式</div>
              <div class="resouce_config_value">
                <el-select
                  v-model="sentType[index]"
                  class="selectType onlyOnesentType"
                  @change="selectSentType(val,item.id)"
                >
                  <el-option label="直接充值" value="3"></el-option>
                </el-select>
              </div>
            </div>
            <div class="resouce_config_item">
              <div class="resouce_config_name">发放时间</div>
              <div class="resouce_config_value">
                <el-date-picker
                  class="sent_time"
                  :picker-options="pickerOptions0"
                  v-model="onLineTime == sendTime[index]?sendTime[index]='':sendTime[index]"
                  type="datetime"
                  placeholder="活动上线即时发送"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  @change="selectSendTime($event,item.id)"
                ></el-date-picker>
              </div>
            </div>
          </div>
          <!-- 平台码 原始码-->
          <div class="resouce_config" v-if="item.grant_type ==1 || item.grant_type ==2">
            <div class="resouce_config_item">
              <div class="resouce_config_name">发放形式</div>
              <div class="resouce_config_value">
                <el-select
                  v-model="sentType[index]"
                  class="selectType onlyOnesentType"
                  @change="selectSentType($event,item.id,item.notices)"
                >
                  <el-option label="平台码" value="1"></el-option>
                  <el-option label="原始码" value="2" v-if="item.type_ename !='zichong'"></el-option>
                </el-select>
              </div>
            </div>
            <div class="resouce_config_item">
              <div class="resouce_config_name">短信文案</div>
              <div
                class="resouce_config_operation"
                @click="editNoteText(index,item)"
                v-if="item.notices=='' || item.notices==null"
              >
                <i class="el-icon-edit"></i>
              </div>
              <div
                class="resouce_config_value"
                v-if="item.notices !='' && item.notices!=null"
                @click="editNoteText(index,item)"
              >短信文案</div>
            </div>
            <div class="resouce_config_item">
              <div class="resouce_config_name">发放时间</div>
              <div class="resouce_config_value">
                <el-date-picker
                  class="sent_time"
                  :picker-options="pickerOptions0"
                  v-model="onLineTime == sendTime[index]?sendTime[index]='':sendTime[index]"
                  type="datetime"
                  placeholder="活动上线即时发送"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  @change="selectSendTime($event,item.id)"
                ></el-date-picker>
              </div>
            </div>
            <div class="resouce_config_item">
              <div class="resouce_config_name">预警通知</div>
              <div
                class="resouce_config_value"
                @click="setWarnNotice(index,item)"
              >{{item.is_preset?"已配置":"默认预设"}}</div>
            </div>
            <div class="resouce_config_item effTime" v-if="sentType[index]==1">
              <div class="resouce_config_name">有效时长</div>
              <div
                class="resouce_config_value"
                v-if="effectiveTimeIndex != index"
                @click="editEffecTime(index)"
              >{{item.valid_duration}}天</div>
              <div
                class="resouce_config_time"
                v-else-if="effectiveTimeIndexSecond != index"
                @mouseleave="setEffectiveTime(index,item.valid_duration,item.id)"
              >
                <el-input-number v-model="item.valid_duration" @change="ectiveTimeChange" :min="1"></el-input-number>天
              </div>
            </div>
          </div>
          <div
            class="residue_num"
            :class="{residueMoney:item.grant_type ==3}"
          >{{item.grant_type ==3?"剩余金额":"剩余数量"}}&nbsp;&nbsp;{{item.surplus_count}}</div>
        </div>
      </div>
    </div>
    <!-- 上一步   下一步 -->
    <div class="step-btn">
      <button class="last-step" @click="prevStep">上一步</button>
      <button class="next-btn" v-if="isShowResouceList" @click="nextStep">下一步</button>
    </div>
    <!-- 短信文案编辑 弹框 -->
    <el-dialog class="editNoteDialog" title="短信文案编辑" :visible.sync="showNoteDialog">
      <el-form :model="noteForm" :rules="noteRules" ref="noteFormNoteRules" @submit.native.prevent>
        <div class="official">
          <p>
            <span>*</span>文案预览
          </p>
          <div class="official_look">
            【{{noteForm.msgTable}}】
            {{noteForm.textOne}}
            <span
              v-if="noteForm.sendType ==30"
            >
              {code}
              {{noteForm.textFour}}
              <i v-if="isShowKey">{key}</i>
            </span>
            <span v-if="noteForm.sendType !=30">{{ noteForm.sendType== 20?'':'{code}'}}</span>
            {{noteForm.sendType !=30?noteForm.textThree:noteForm.textThree}}
            {{noteForm.sendType ==30?'':"{链接}"}}
            {{noteForm.textTwo}}
          </div>
        </div>
        <div class="noteDialogContent">
          <div class="noteTemplate">
            <el-form-item prop="templateVal" label="复制模板">
              <el-select
                v-model="noteForm.templateVal"
                placeholder="请选择"
                @change="selectNoteTemplate"
              >
                <el-option
                  :label="temItem"
                  :value="temItem"
                  v-for="(temItem,Tindex) in noteForm.templateList"
                  :key="Tindex"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="label_msg">【
            <el-form-item prop="msgTable">
              <el-input
                type="text"
                v-model="noteForm.msgTable"
                auto-complete="off"
                maxlength="50"
                placeholder="请输入短信标签"
              ></el-input>
            </el-form-item>】
          </div>
          <el-form-item prop="textOne">
            <el-input
              type="textarea"
              v-model="noteForm.textOne"
              auto-complete="off"
              maxlength
              placeholder="示例：【雀巢】感谢您参与九月雀巢起活动，恭喜您获得xxxxx一份"
            ></el-input>
          </el-form-item>
          <!-- 原始码 不用去平台兑换 -->
          <div class="reouce_code" v-if="noteForm.sendType ==30">
            <span>{code}</span>
            <el-form-item prop="textFour" class="originalCodeText">
              <el-input
                type="text"
                v-model="noteForm.textFour"
                auto-complete="off"
                maxlength
                placeholder="请输入"
              ></el-input>
            </el-form-item>
            <span class="noCheckCode" :class="{'originalCode':isShowKey}" @click="checkedCode(2)">
              <i v-if="isShowKey"></i>
              {key}
            </span>
          </div>
          <!-- 平台码 需要去某某平台兑换 -->
          <div
            class="reouce_code"
            :class="{goPlant:noteForm.sendType!=10}"
            v-if="noteForm.sendType !=30"
          >
            <span class="code" v-if="noteForm.sendType==10">{code}</span>
            <el-form-item prop="textThree">
              <el-input
                type="text"
                v-model="noteForm.textThree"
                auto-complete="off"
                maxlength
                placeholder="上某某"
              ></el-input>
            </el-form-item>
            <span>{链接}</span>
          </div>
          <el-form-item prop="textTwo">
            <el-input
              type="textarea"
              v-model="noteForm.textTwo"
              auto-complete="off"
              maxlength
              placeholder="激活兑奖码即可使用。有效期至2019年5月7号，逾期作废。疑问咨询：400-145-8596（工作日10:00-18:00）"
            ></el-input>
          </el-form-item>
        </div>
        <div v-if="noteForm.sendType !=30">
          <el-form-item prop="sendType" class="sendType">
            <el-radio-group v-model="noteForm.sendType">
              <el-radio :label="10">
                正常发放
                <span class="normal_star">*</span> 兑换码在短信中显示，19位数，不可复制
              </el-radio>
              <el-radio :label="20">
                简化发放
                <span class="normal_star">*</span> 短信不包含兑换码，兑换码在H5页面自动显示，用户只需填写手机号
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeNoteForm()">取 消</el-button>
        <el-button type="primary" @click="NoteForm()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 预警通知的弹框 -->
    <el-dialog class="ediAwardDialog warn_dialog" title="预警通知" :visible.sync="showWarndDialog">
      <el-form :model="awardFormalert" :rules="awardRules" ref="warningForm" @submit.native.prevent>
        <div class="set_warnNum">设置预警数量
          <template>
            <el-input-number v-model="awardFormalert.warnNum" @change="handleChange" :min="1"></el-input-number>
          </template>
          <span class="red_star">*</span>默认预警数量=导入名单发放数量+1
        </div>
        <el-form-item prop="radio2">
          <el-radio-group v-model="awardFormalert.radio2" @change="radio2change">
            <el-radio
              v-for="(itemarryList,indexarryList) in awardFormalert.arryList"
              :key="indexarryList"
              :label="itemarryList.dic_ename"
            >
              {{[itemarryList.dic_cname,awardFormalert.warnNum] | arryListStr}}
              <span
                class="defaultBtn"
                v-if="itemarryList.dic_ename == 'emailRemindSelfAndLeader'"
              >默认</span>
            </el-radio>
            <el-radio :label="5" class="customRadio">自定义邮箱
              <el-input
                :disabled="awardFormalert.disabled"
                v-model="awardFormalert.input"
                @keyup.enter.native="addwaremails()"
                type="text"
                placeholder="自定义提醒：请填写要发送的邮箱"
              ></el-input>
              <p class="eorrtip" v-if="awardFormalert.istextTip">{{awardFormalert.textTip}}</p>
              <el-button
                class="addbutton addEmli"
                :disabled="awardFormalert.disabled"
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
          {{awardFormalert.waremails.length>0?'已添加邮箱':'上面输入框可自定义添加邮箱'}}
        </p>
        <div class="emile_list">
          <ul>
            <li
              v-for="(itememail,indexemail) in awardFormalert.waremails"
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
        <el-button @click="cancelearly()">取 消</el-button>
        <el-button type="primary" @click="awardFormalertquery()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 查看名单  弹框 -->
    <el-dialog class="ediAwardDialog showNameListDialog" title="派发名单" :visible.sync="showNameList">
      <div class="batch_box">
        <div class="batchListTitle longTitle" :title="resouceName">
          <span></span>
          {{resouceName}}
        </div>
        <div class="batchListTitle" v-if="isTotleNameList">核计总发放人数：{{totalCount}}</div>
        <div class="reImportBtn" v-if="!isTotleNameList">
          <el-upload
            class="upload-demo"
            ref="upload"
            drag
            :action="singleUploadUrl()"
            :headers="headers"
            :data="singleUploadParam"
            :on-change="upChange"
            :on-success="singleUploadSuccess"
            :on-error="singleUploaderror"
            :before-upload="singleBeforeAvatarUpload"
            :on-preview="singleHandlePreview"
            :on-remove="singleHandleRemove"
            :showFileList="false"
          >重新导入该资源名单</el-upload>
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
              <th>资源名称</th>
              <th>姓名</th>
              <th>手机号</th>
              <th>发放数量</th>
              <th>发放金额</th>
              <th>备注</th>
            </tr>
            <tr
              v-if="NameList_table_list.length!=0"
              v-for="(itemNum,indexNum) in NameList_table_list"
              :key="indexNum"
            >
              <td style="width:50px">{{indexNum+1}}</td>
              <td>
                <div
                  class="nameList_materialName"
                  :title="itemNum.material_name"
                >{{itemNum.material_name}}</div>
              </td>
              <td>{{itemNum.name}}</td>
              <td>{{itemNum.mobile}}</td>
              <td>{{itemNum.material_ename=="comprehensive"?"无":itemNum.user_count}}</td>
              <td>{{itemNum.material_ename=="comprehensive"?itemNum.user_count:"无"}}</td>
              <td>
                <div class="remark" :title="itemNum.remark">{{itemNum.remark}}</div>
              </td>
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
  </div>
</template>
<script>
import { httpServer, apiSetting } from "../../../../assets/js/http.js";
import page from "../../../../assets/js/page.js";
import { touchRipple } from "vue-touch-ripple";
// import styles
import "vue-touch-ripple/dist/vue-touch-ripple.css";
import { throws } from "assert";
export default {
  name: "newConfigResouce",
  components: {
    touchRipple //水波纹
  },
  props: {},
  data() {
    return {
      isShowResouceList: false, //  判断是否显示资源配置列表页
      getDownload: apiSetting.getDownload.url, //Excel模板下载
      //上传名单参数
      uploadParam: {
        app_id: "" //项目id
      },
      // 单个资源导入名单
      singleUploadParam: {
        app_id: "", //项目id
        mid_material_allot_id: "", //中台资源分配id
        material_id: "", //资源id
        template_id: "", //中台模板id
        grant_type: "" //发放形式【0.无状态 1.平台发放 2.原始码发放 3.直接充值】
      },
      showResouceListLoading: false,
      resouceList: [],
      showNoteDialog: false,
      showWarndDialog: false,
      showNameList: false,
      loadingNameList: false,
      isTotleNameList: true,
      seachValue: "", //主页的搜索响应式
      seachclick_close: false, //主页的搜索按钮叉号
      itemListloading: true, //如果列表正在请求中分页就不能触发，不然会有bug
      onLineTime: "", // 上线时间
      effectiveTimeIndex: -1,
      effectiveTimeIndexSecond: -1,
      // 短信文案
      notices: {},
      noteForm: {
        textOne: "",
        textTwo: "",
        textThree: "",
        textFour: "",
        smsCode: "",
        smsKey: "",
        smsUrl: "",
        msgTable: "", //短信标签
        sendType: "", //发放形式   0.全部 10.平台码的正常发放 20.平台码的简化发放 30.原始码 ,
        templateVal: "",
        templateList: [] //模本名称列表
      },
      page: page,
      noticeId: "", // 短信id
      templateId: "", //模本id
      materialId: "", // 资源id
      materialName: "", //资源名称
      midAllotId: "", //中台分配资源id
      grantType: "", //发放形式
      midBatchId: "", //批次id
      templateIndex: 0,
      templateSentType: "",
      originalCodeText: "",
      platformCodeText: "",
      // 预警通知
      awardFormalert: {
        radio2: "", // 单选按钮   选中的值
        disabled: true, //如果选择自定义才可以输入，
        input: "", //预警通知弹窗的input追加邮箱的相应绑定
        textTip: "",
        arryList: [],
        istextTip: false,
        warnNum: 0,
        send_text: "",
        waremails: [] //自定义邮箱列表
      },
      warningId: "", // 预警通知的id
      effectiveTime: 1, // 有效时长
      isShowKey: true,
      noteRules: {
        textOne: [
          {
            required: true,
            message: "请输入文案",
            trigger: "change"
          },
          {
            validator: (rule, value, callback) => {
              if (!this.$forbiddenStr(value)) {
                callback(new Error("禁止输入敏感词"));
              } else {
                callback();
              }
            },
            trigger: "change"
          }
        ],
        textTwo: [
          {
            required: true,
            message: "请输入文案",
            trigger: "change"
          },
          {
            validator: (rule, value, callback) => {
              if (!this.$forbiddenStr(value)) {
                callback(new Error("禁止输入敏感词"));
              } else {
                callback();
              }
            },
            trigger: "change"
          }
        ],
        textThree: [
          {
            required: false,
            message: "请输入文案",
            trigger: "change"
          },
          {
            validator: (rule, value, callback) => {
              if (!this.$forbiddenStr(value)) {
                callback(new Error("禁止输入敏感词"));
              } else {
                callback();
              }
            },
            trigger: "change"
          }
        ],
        textFour: [],
        msgTable: [
          {
            required: true,
            message: "请输入短信标签",
            trigger: "change"
          },
          {
            validator: (rule, value, callback) => {
              if (!this.$forbiddenStr(value)) {
                callback(new Error("禁止输入敏感词"));
              } else {
                callback();
              }
            },
            trigger: "change"
          }
        ]
      },
      awardRules: {},
      sendTime: [], //发放时间
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        }
      },
      sentType: [], //发放形式   1平台码  2原始码  3直接充值
      NameList_table_list: [], // 名单列表
      totalCount: "", //核计总发放人数
      configResouce: {
        step: 2, //返回上一步是2，下一步是3
        isshow: true,
        shownum: 1
      },
      isChecked: true, //下一步验证通过
      arrayList: [],
      isSureSentType: 1,
      resouceName: ""
    };
  },
  mounted() {
    this.uploadParam.app_id = this.$getsessionStorage("appid");
    this.onLineTime = this.$getsessionStorage("onLineTime");
    this.getAllotResouceList();
    let $emit = this;
    $emit.page.pageSize = 30; //修改每页显示数
    $emit.page.pageSizeList = [30, 60, 90]; //修改可以下拉框选择的每页显示数
    //分页调用的获取列表方法
    $emit.page.query = function() {
      if ($emit.itemListloading) {
        $emit.getDirectBatchList($emit.typeid);
        this.NameList_table_list = [];
        $emit.itemListloading = true; //以防分页点击过快的flag节流阀
      }
    };
    apiSetting.getDirectUsers.page = this.page; //api接口分页赋值
    apiSetting.getDirectUsers.dataList = this.dataList; //api分页数据赋值
  },
  computed: {
    headers() {
      return {
        Authorization: "Bearer " + this.getCookie("Authorization")
      };
    }
  },
  methods: {
    //获取已配置资源列表
    getAllotResouceList() {
      this.showResouceListLoading = true;
      httpServer(apiSetting.getAllotResouceList, {
        appId: this.$getsessionStorage("appid")
      })
        .then(response => {
          this.sentType = [];
          this.showResouceListLoading = false;
          if (response.length > 0) {
            this.resouceList = response;
            response.forEach((value, index, array) => {
              this.sentType.push(value.grant_type + "");
              this.sendTime.push(value.release_time);
            });
            this.isShowResouceList = true;
          } else {
            this.isShowResouceList = false;
          }
        })
        .catch(error => {
          this.showResouceListLoading = false;
          this.$message({
            message: JSON.parse(err.message).message,
            duration: 2000
          });
        });
    },
    UploadUrl() {
      return apiSetting.newPostUpload.url;
    },
    //单个上传名单
    singleUploadUrl() {
      return apiSetting.upMaterialAllotUsers.url;
    },
    //单个 上传名单成功的回调
    singleUploadSuccess(response, file, fileList) {
      this.page.pageIndex = 1;
      this.loadingNameList = false;
      this.getDirectBatchList();
      this.getAllotResouceList();
    },
    //单个 上传名单失败的回调
    singleUploaderror(err, file, fileList) {
      this.loadingNameList = false;
      this.$message({
        message: JSON.parse(err.message).message,
        duration: 2000
      });
    },
    singleBeforeAvatarUpload() {
      this.loadingNameList = true;
    },
    singleHandlePreview() {},
    singleHandleRemove() {},
    //上传名单前  做的校验
    beforeAvatarUpload() {
      this.showResouceListLoading = true;
    },
    //上传名单成功的回调
    uploadSuccess(response, file, fileList) {
      this.sentType = [];
      this.isShowResouceList = true;
      this.showResouceListLoading = false;
      this.resouceList = response;
      response.forEach((value, index, array) => {
        this.sentType.push(value.grant_type + "");
      });
    },
    //上传名单失败的回调
    uploaderror(err, file, fileList) {
      this.showResouceListLoading = false;
      this.$message({
        message: JSON.parse(err.message).message,
        duration: 2000
      });
    },

    upChange() {},
    handleRemove() {},
    handlePreview() {},
    //配置公共修改方法
    allotCommonEdit(midMaterialId, requestType, newValue, notices) {
      httpServer(apiSetting.allotCommonEdit, {
        mid_material_allot_id: midMaterialId, //中台资源分配id ,
        request_type: requestType, // 修改类型 发放形式 = 1，有效时长 = 2，发放时间 = 3 ,
        new_value: newValue //新的值
      })
        .then(response => {
          if (requestType == 1) {
            if (notices != null && notices != "") {
              this.$message({
                message: "请修改相应的短信文案",
                duration: 2000
              });
            }
          }
          this.getAllotResouceList();
        })
        .catch(error => {
          console.log("保存失败", error);
        });
    },
    //选择发放形式
    selectSentType(val, id, notices) {
      this.allotCommonEdit(id, 1, val, notices);
    },
    //选择发放时间
    selectSendTime(val, id) {
      if (!val) {
        this.allotCommonEdit(id, 3, this.onLineTime);
      } else {
        this.allotCommonEdit(id, 3, val);
      }
    },
    // 短信文案 选择code或者key
    checkedCode() {
      this.isShowKey = !this.isShowKey;
    },
    //选择短信模板
    selectNoteTemplate(value) {
      let obj = {};
      obj = this.noteArry.find(item => {
        return item.material_name == value; //筛选出匹配数据
      });
      this.notices = JSON.parse(obj.notices);
      this.$nextTick(function() {
        this.dealWithNotices(this.notices);
      });
    },
    // 编辑短信文案按钮
    editNoteText(index, itemObj) {
      this.showNoteDialog = true;
      this.noteForm.templateList = [];
      this.noticeId = itemObj.mid_material_allot_notice_id;
      this.materialId = itemObj.material_id;
      this.materialName = itemObj.material_name;
      this.midAllotId = itemObj.id;
      this.grantType = itemObj.grant_type;
      this.templateId = itemObj.template_id;
      httpServer(apiSetting.getNoticeTemplates, {
        app_id: this.$getsessionStorage("appid")
      })
        .then(response => {
          this.noteArry = response;
          response.forEach((value, index, array) => {
            this.noteForm.templateList.push(value.material_name);
          });
          if (itemObj.notices) {
            let noticeObj = {};
            noticeObj = this.noteArry.find(item => {
              return item.material_name == itemObj.material_name; //筛选出匹配数据
            });

            this.noteForm.templateVal = noticeObj.material_name;
            if (itemObj.grant_type == 1) {
              if (itemObj.send_message_type == 1) {
                this.noteForm.sendType = 10;
              } else {
                this.noteForm.sendType = 20;
              }
            } else {
              this.noteForm.sendType = 30;
            }
            this.notices = JSON.parse(itemObj.notices);
            this.dealWithNotices(this.notices);
          } else {
            this.noteForm.templateVal = response[0].material_name;
            this.notices = JSON.parse(response[0].notices);
            if (response[0].configuration_type == 0) {
              this.noteForm.sendType = 10;
            } else if (response[0].configuration_type == 1) {
              if (this.grantType == 2) {
                this.noteForm.sendType = 30;
              } else {
                this.noteForm.sendType = 10;
              }
            } else {
              this.noteForm.sendType = response[0].configuration_type;
            }
            if (this.grantType == 2) {
              this.noteForm.sendType = 30;
              this.templateSentType = 2;
            }
            this.$nextTick(function() {
              this.dealWithNotices(this.notices);
            });
          }
        })
        .catch(error => {
          console.log("失败", error);
        });
    },
    //处理短信文案
    dealWithNotices(notice) {
      this.noteForm.msgTable = notice.sms_sign.substring(
        notice.sms_sign.indexOf("【") + 1,
        notice.sms_sign.indexOf("】")
      );
      this.noteForm.textOne = notice.sms_title;
      this.noteForm.textThree = notice.sms_name;
      this.noteForm.textFour = notice.sms_name;
      this.noteForm.textTwo = notice.sms_content;
    },
    // 短信文案 确认按钮
    NoteForm() {
      this.$refs.noteFormNoteRules.validate(valid => {
        if (valid) {
          if (this.noteForm.sendType == 10) {
            this.noteForm.smsCode = "{code}";
            this.noteForm.smsUrl = "{链接}";
            this.noteForm.smsKey = "";
          } else if (this.noteForm.sendType == 20) {
            this.noteForm.smsCode = "";
            this.noteForm.smsKey = "";
            this.noteForm.smsUrl = "{链接}";
          } else {
            this.noteForm.smsUrl = "";
            this.noteForm.smsCode = "{code}";
            if (this.isShowKey) {
              this.noteForm.smsKey = "{key}";
            } else {
              this.noteForm.smsCode = "{code}";
              this.noteForm.smsKey = "";
            }
          }
          httpServer(apiSetting.noticeEdit, {
            id: this.noticeId,
            app_id: this.$getsessionStorage("appid"),
            template_id: this.templateId,
            material_id: this.materialId,
            material_name: this.materialName,
            mid_material_allot_id: this.midAllotId,
            notice_type: 1, //资源发放消息通知类型 1短信 2微信 目前可不传，后台会默认为短信 ,
            send_message_type: this.noteForm.sendType, //短信发放形式 10.平台码的正常发放 20.平台码的简化发放 30.原始码 必传 ,
            notices: JSON.stringify({
              sms_sign: "【" + this.noteForm.msgTable + "】",
              sms_title: this.noteForm.textOne,
              sms_code: this.noteForm.smsCode,
              sms_name:
                this.noteForm.sendType == 30
                  ? this.noteForm.textFour
                  : this.noteForm.textThree,
              sms_key: this.noteForm.smsKey,
              sms_url: this.noteForm.smsUrl,
              sms_content: this.noteForm.textTwo
            })
          })
            .then(response => {
              this.getAllotResouceList();
            })
            .catch(error => {
              console.log("失败", error);
            });
          this.noteForm.sentType = [];
          this.showNoteDialog = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    closeNoteForm() {
      this.noteForm.sentType = [];
      this.showNoteDialog = false;
    },
    // 设置预警通知
    setWarnNotice(index, item) {
      this.showWarndDialog = true;
      this.awardFormalert.istextTip = false;
      this.awardFormalert.waremails = [];
      this.getworningNoticeList();
      this.awardFormalert.warnNum = item.trigger_amount;
      this.warningId = item.warning_id;
      if (!item.send_type_key) {
        this.awardFormalert.radio2 = 5;
        this.awardFormalert.disabled = false;
        this.awardFormalert.waremails = JSON.parse(item.emails);
      } else {
        this.awardFormalert.radio2 = item.send_type_key;
        this.getworningNoticeList().then(response => {
          this.awardFormalert.arryList.forEach((value, index, array) => {
            if (array[index].dic_ename == item.send_type_key) {
              this.awardFormalert.send_text = array[index].dic_cname;
            }
          });
        });
      }
    },
    // 获取邮箱列表
    getworningNoticeList() {
      return new Promise((resolve, reject) => {
        httpServer(apiSetting.getworningNoticeList)
          .then(response => {
            this.awardFormalert.arryList = response;
            resolve("成功过后");
          })
          .catch(error => {
            console.log(error.status);
          });
      });
    },
    // 预警通知选择发预警的对象
    radio2change() {
      this.awardFormalert.istextTip = false;
      if (this.awardFormalert.radio2 == 5) {
        this.awardFormalert.disabled = false;
        this.awardFormalert.send_text = "";
      } else {
        this.awardFormalert.arryList.forEach((value, index, array) => {
          if (array[index].dic_ename == this.awardFormalert.radio2) {
            this.awardFormalert.send_text = array[index].dic_cname;
          }
        });
        this.awardFormalert.disabled = true;
      }
    },
    //预警通知回车追加
    addwaremails() {
      this.ischeckemail(this.awardFormalert.input);
    },
    //检测邮箱
    ischeckemail(textTip) {
      if (textTip != "") {
        var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
        var isok = reg.test(textTip);
        if (!isok) {
          this.awardFormalert.istextTip = true;
          this.awardFormalert.textTip = "邮箱格式不正确，请重新输入！";
          return false;
        } else {
          this.awardFormalert.waremails.push(this.awardFormalert.input);
          this.awardFormalert.input = "";
          this.awardFormalert.istextTip = false;
        }
      } else {
        this.awardFormalert.istextTip = false;
      }
    },
    //删除已添加的邮箱
    deleteemails(index) {
      this.awardFormalert.waremails.splice(index, 1);
    },
    // 预警通知取消按钮
    cancelearly() {
      this.showWarndDialog = false;
    },
    // 预警通知的弹窗 确认按钮
    awardFormalertquery() {
      if (
        this.awardFormalert.radio2 == 5 &&
        this.awardFormalert.waremails.length == 0
      ) {
        this.awardFormalert.textTip = "请添加正确的邮箱";
        this.awardFormalert.istextTip = true;
      } else {
        this.awardFormalert.istextTip = false;
        httpServer(apiSetting.warningEdit, {
          warning_id: this.warningId,
          trigger_amount: this.awardFormalert.warnNum,
          emails:
            this.awardFormalert.radio2 == 5
              ? JSON.stringify(this.awardFormalert.waremails)
              : "",
          send_type_key:
            this.awardFormalert.radio2 == 5 ? "" : this.awardFormalert.radio2,
          send_text: this.awardFormalert.send_text
        })
          .then(response => {
            this.showWarndDialog = false;
            this.awardFormalert.waremails = [];
            this.getAllotResouceList();
          })
          .catch(error => {});
      }
    },
    //设置预警数量
    handleChange(value) {},
    //编辑有效时长
    editEffecTime(index) {
      this.effectiveTimeIndex = index;
      this.effectiveTimeIndexSecond = -1;
    },
    //设置有效时长
    setEffectiveTime(index, val, id) {
      this.effectiveTime = val;
      this.effectiveTimeIndexSecond = index;
      this.effectiveTimeIndex = -1;
      this.allotCommonEdit(id, 2, this.effectiveTime);
    },
    ectiveTimeChange(value) {
      this.effectiveTime = value;
    },
    //查看名单  搜索
    seachclick(a) {
      if (a == 0) {
        this.seachValue = "";
      }
      this.page.pageIndex = 1;
      this.getDirectBatchList();
    },
    //查看名单列表
    lookNameList(item) {
      this.loadingNameList = true;
      if (!item) {
        this.isTotleNameList = true;
        this.midBatchId = 0;
        this.materialId = 0;
        this.midAllotId = 0;
        this.resouceName = "全部名单";
      } else {
        this.resouceName = item.material_name;
        this.isTotleNameList = false;
        this.midBatchId = item.mid_direct_batch_id;
        this.materialId = item.material_id;
        this.midAllotId = item.id;
        this.singleUploadParam.app_id = this.$getsessionStorage("appid");
        this.singleUploadParam.mid_material_allot_id = item.id;
        this.singleUploadParam.material_id = item.material_id;
        this.singleUploadParam.template_id = item.template_id;
        this.singleUploadParam.grant_type = item.grant_type;
      }
      this.page.pageIndex = 1;
      this.showNameList = true;
      this.getDirectBatchList();
    },
    getDirectBatchList() {
      httpServer(apiSetting.getDirectUsers, {
        app_id: this.$getsessionStorage("appid"),
        mid_direct_batch_id: this.midBatchId,
        material_id: this.materialId,
        mid_material_allot_id: this.midAllotId,
        keywords: this.seachValue,
        page_index: this.page.pageIndex,
        page_size: this.page.pageSize,
        Conditions: ""
      })
        .then(response => {
          document.querySelectorAll(".el-dialog__body")[0].scrollTop = 0;
          this.loadingNameList = false;
          this.NameList_table_list = response.collection;
          this.totalCount = response.total_count;
        })
        .catch(error => {
          this.loadingNameList = false;
          console.log("错误结果", error);
        });
    },
    //上一步
    prevStep() {
      this.$router.push({ name: "exchange" });
      this.configResouce.isshow = true;
      this.configResouce.shownum = 1;
      this.configResouce.step = 2;
      this.$emit("changeStep", this.configResouce);
    },
    //下一步
    nextStep() {
      this.isChecked = true;
      for (var i = 0; i < this.resouceList.length; i++) {
        if (
          !this.resouceList[i].notices &&
          this.resouceList[i].grant_type != 3
        ) {
          this.$message({
            message:
              this.resouceList[i].material_name + "     的短信文案未配置",
            duration: 1000
          });
          this.isChecked = false;
          break;
        }
      }
      if (this.isChecked) {
        this.resouceList.forEach((value, index, array) => {
          this.arrayList.push(value.grant_type);
        });
        if (this.arrayList.indexOf(1) == -1) {
          // 不包含平台码
          this.$alert(
            "<p>该活动资源配置中不含有平台码发放形式的奖品</br>所以无需进行平台配置</p>",
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
              this.$router.push({
                name: "preview",
                query: { tabName: "configResouce" }
              });
            })
            .catch(() => {
              console.log("不重新分配了");
            });
        } else {
          // 包含平台码
          this.$router.push({ name: "configPlatform" });
          this.configResouce.shownum = 3;
          this.configResouce.step = 4; //步骤第四部
          this.$emit("changeStep", this.configResouce);
        }
      }
    }
  }
};
</script>

<style scoped lang="less">
#newConfigResouce {
  .newConfigResouce_content {
    width: 898px;
    min-height: 518px;
    background-color: #ffffff;
    border-radius: 8px;
    border: solid 1px rgba(206, 206, 206, 0.46);
    .newConfigResouce_title {
      height: 28px;
      border-bottom: 1px #e0e0e0 solid;
      padding: 12px 20px 0px 20px;
      .page_title {
        float: left;

        font-weight: bold;
        span {
          display: block;
          float: left;
          width: 4px;
          height: 14px;
          background-color: #5a0ae0;
          margin-top: 3px;
          margin-right: 5px;
        }
      }
      .btn_list {
        float: right;
        overflow: hidden;
        span {
          cursor: pointer;
          display: block;
          float: left;
          margin-left: 45px;
          font-size: 12px;
          .el-icon-view {
            color: #ffa200;
            margin-right: 5px;
            font-size: 14px;
          }
        }
        .import_nameList {
          background: url(../../../../assets/images/images/importIcon.png)
            no-repeat left;
          background-size: 16px 16px;
          padding-left: 20px;
        }
        .download {
          background: url(../../../../assets/images/images/down.png) no-repeat
            left;
          background-size: 16px 16px;
          padding-left: 20px;
          a {
            text-decoration: none;
            color: #393c40;
          }
        }
      }
    }
    .addNameList {
      width: 100%;
      min-height: 475px;
      .addNameList_content {
        width: 200px;
        margin: 0 auto;
        h1 {
          width: 200px;
          padding-top: 125px;
          font-size: 24px;
          color: #c3c3c3;
          text-align: center;
        }
        div {
          margin-top: 10px;
          margin-bottom: 90px;
          width: 200px;
          height: 135px;
          background: url(../../../../assets/images/images/clickIcon.png)
            no-repeat center;
          background-size: 84px 130px;
        }
        p {
          width: 200px;
          font-size: 18px;
          color: #c3c3c3;
          text-align: center;
        }
      }
    }
    .resouceList {
      overflow: hidden;
      padding-bottom: 20px;
      .resouce_card {
        position: relative;
        width: 272px;
        height: 400px;
        box-shadow: 0px 2px 15px 0px rgba(210, 210, 210, 0.74);
        border-radius: 4px;
        float: left;
        margin-top: 20px;
        margin-left: 20px;
        .resouce_info {
          background: #393c40;
          border-radius: 4px;
          color: #fff;
          .resouce_info_content {
            border-radius: 4px;
            height: 130px;
            padding: 10px 15px;
            background: rgba(0, 0, 0, 0.6);
            .resouce_title {
              overflow: hidden;
              span {
                width: 140px;
                display: block;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                float: left;
              }
              .resouce_index {
                width: 20px;
                height: 20px;
                line-height: 20px;
                text-align: center;
                margin-right: 5px;
                border-radius: 50%;
              }
              .firstIndex {
                background-color: #b68dff;
              }
              .secondIndex {
                background-color: #46d2b3;
              }
              .thiredIndex {
                background-color: #06baff;
              }
              div {
                float: right;
              }
              .nameList_view {
                cursor: pointer;
                font-size: 12px;
                .el-icon-view {
                  margin-right: 5px;
                }
              }
            }
            .amount {
              overflow: hidden;
              margin-top: 70px;
              dl {
                float: left;
                width: 70px;
                dt {
                  font-size: 12px;
                }
                dd {
                  margin-top: 5px;
                  font-size: 16px;
                }
              }
              .procurement {
                margin-right: 15px;
              }
            }
          }
        }
        .resouce_config {
          padding: 0px 15px;
          .resouce_config_item {
            position: relative;
            height: 20px;
            margin-top: 15px;
            .resouce_config_name {
              float: left;
            }
            .resouce_config_operation {
              float: right;
              .el-icon-plus,
              .el-icon-edit {
                cursor: pointer;
                font-weight: bold;
              }
              .selectType {
                width: 120px;
              }
            }
            .resouce_config_value {
              cursor: pointer;
              color: #a6a6a7;
              float: right;
              background: url(../../../../assets/images/images/editOver.png)
                no-repeat right center;
              background-size: 18px 18px;
              padding-right: 23px;
              .el-date-editor.el-input,
              .el-date-editor.el-input__inner {
                width: 135px;
              }
              .onlyOnesentType {
                width: 120px;
              }
            }
            .resouce_config_time {
              position: absolute;
              right: 0px;
              height: 24px;
              .el-input-number {
                line-height: 24px;
                width: 110px;
              }
            }
          }
          .effTime {
            margin-top: 0px;
            padding: 15px 0px;
          }
        }
        .residue_num {
          position: absolute;
          bottom: 0px;
          height: 40px;
          line-height: 40px;
          border-bottom-right-radius: 4px;
          border-bottom-left-radius: 4px;
          background-color: #d4eaff;
          width: 100%;
          text-align: center;
        }
        .residueMoney {
          background-color: #fff1d4;
        }
      }
    }
  }
  .editNoteDialog {
    .noteDialogContent {
      width: 540px;
      background-color: #f5f5f5;
      border-radius: 6px;
      border: solid 1px #c9c9c9;
      padding: 10px 10px;
      .el-form-item {
        margin-bottom: 5px;
      }
      .noteTemplate {
        float: left;
        overflow: hidden;
        margin-right: 10px;
      }
      .reouce_code {
        overflow: hidden;
        margin-top: 20px;
        span {
          float: left;
          margin-top: 10px;
          margin-bottom: 15px;
        }
        .code {
          margin-right: 15px;
        }
        .el-form-item {
          width: 430px;
          float: left;
          margin: 0px 15px 20px 0px;
        }
        .noCheckCode {
          cursor: pointer;
          width: 60px;
          height: 28px;
          background-color: #c3c3c3;
          border-radius: 4px;
          color: #fff;
          line-height: 28px;
          margin-top: 6px;
          text-align: center;
          position: relative;
          i {
            display: block;
            position: absolute;
            width: 14px;
            height: 14px;
            background: url("../../../../assets/images/images/dui.png") center
              no-repeat;
            background-size: 100% 100%;
            right: -5px;
            top: -5px;
          }
        }
        .originalCode {
          background-color: #4a00e0;
        }
        .originalCodeText {
          width: 370px;
          margin: 0px 20px 20px 20px;
        }
      }
      .goPlant {
        .el-form-item {
          width: 480px;
        }
      }
      .label_msg {
        margin-bottom: 20px;
        .el-form-item {
          display: inline-block;
        }
      }
    }
    .official {
      width: 540px;
      background-color: #f5f5f5;
      box-shadow: inset 0px 2px 2px 0px rgba(215, 215, 215, 0.2);
      border-radius: 6px;
      padding: 10px;
      margin-bottom: 10px;
      font-size: 12px;
      p {
        line-height: 20px;
        color: #9ca0a6;
        span {
          color: #ef444b;
        }
      }
      span {
        i {
          font-style: normal;
        }
      }
    }
  }
  .warn_dialog {
    .el-dialog .el-dialog__header {
      border-bottom: 0px;
    }
    .el-form-item {
      padding-left: 20px;
    }
    .el-input {
      width: 305px;
    }
    .set_warnNum {
      padding-bottom: 10px;
      border-bottom: 1px #ecedef solid;
      margin-bottom: 20px;
      padding-left: 20px;
    }
    .defaultBtn {
      background-color: #d7d7d7;
      border-radius: 4px;
      padding: 2px 5px;
      font-size: 12px;
      margin-left: 5px;
    }
    .add_emile {
      width: 540px;
      background-color: #f5f5f5;
      border-radius: 6px;
      border: solid 1px #ebebeb;
      padding: 10px;
      margin-bottom: 20px;
      margin-left: 20px;
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
    .eorrtip {
      color: #f56c6c;
      font-size: 12px;
      margin-top: 5px;
      margin-left: 100px;
      position: absolute;
    }
  }
  .addEmli {
    margin-left: 20px;
    position: absolute;
    right: -100px;
    top: 0px;
    margin-right: 0px;
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
      float: left;
      padding-left: 20px;
      margin-top: 5px;
      font-weight: bold;
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
    .longTitle {
      width: 170px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .reImportBtn {
      position: absolute;
      right: 240px;
      top: 25px;
      background: url(../../../../assets/images/images/importIcon.png) no-repeat
        left center;
      background-size: 16px 16px;
      padding-left: 20px;
    }
    .batch_box {
      overflow: hidden;
      min-height: 330px;

      .batch_msg {
        float: left;
        margin-bottom: 10px;
        div {
          margin-bottom: 10px;
          span {
            display: inline-block;
            width: 140px;
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
        margin-top: 5px;
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
    }
    .activeAllot_box_search {
      float: right;
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
          .nameList_materialName {
            text-align: center;
            max-width: 155px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }
          .remark {
            text-align: center;
            max-width: 100px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
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
<style>
#newConfigResouce .addNameList .upload-demo .el-upload--text {
  width: 100%;
  min-height: 475px;
  position: relative;
}
#newConfigResouce .import_nameList .upload-demo {
  height: 16px;
}
#newConfigResouce .import_nameList .el-upload-dragger {
  width: 80px;
  height: 16px;
  border: 0px;
  font-size: 12px;
}
#newConfigResouce .addNameList .upload-demo .el-upload-dragger {
  border: 0px;
}
#newConfigResouce .reImportBtn .upload-demo {
  height: 16px;
}
#newConfigResouce .reImportBtn .el-upload-dragger {
  width: 120px;
  height: 16px;
  border: 0px;
  font-size: 12px;
}
#newConfigResouce .v-touch-ripple {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: inline-block;
  /* height: 491px; */
}
#newConfigResouce
  .addNameList
  .upload-demo
  .el-upload--text
  .el-upload-dragger {
  width: 100%;
  min-height: 480px;
  border-bottom-width: thin;
  position: absolute;
  top: 0px;
}
#newConfigResouce .resouce_config_value .sent_time .el-input__inner {
  padding-left: 0px;
  padding-right: 0px;
  height: 20px;
  background-color: #fff;
  line-height: 20px;
  text-indent: 0px;
  text-align: right;
}
#newConfigResouce .resouce_config_value .sent_time .el-input__prefix {
  display: none;
}
#newConfigResouce .resouce_config_value .sent_time .el-input__icon {
  line-height: 20px;
}
#newConfigResouce
  .resouce_config_operation
  .selectType
  .el-input--suffix
  .el-input__inner {
  height: 20px;
  background: #fff;
  line-height: 20px;
  padding: 0px;
  text-align: right;
}
#newConfigResouce .resouce_config_operation .selectType .el-input__suffix {
  display: none;
}
#newConfigResouce
  .resouce_config_operation
  .selectType
  .el-input
  .el-input__inner::-webkit-input-placeholder {
  color: #3c3f42;
  font-size: 20px;
  font-weight: bold;
}
#newConfigResouce .editNoteDialog .el-dialog__body {
  max-height: 350px;
  overflow-x: auto;
}
#newConfigResouce .editNoteDialog .el-dialog {
  max-height: 480px;
}
#newConfigResouce .editNoteDialog .sendType {
  margin-top: 10px;
  margin-bottom: 10px;
}
#newConfigResouce .editNoteDialog .sendType .el-form-item__label {
  line-height: normal;
}
#newConfigResouce .editNoteDialog .sendType .el-form-item__content {
  width: 460px;
  float: left;
}
#newConfigResouce .editNoteDialog .sendType .el-radio__label {
  font-size: 12px;
}
#newConfigResouce .editNoteDialog .sendType .el-radio {
  margin-bottom: 10px;
}
#newConfigResouce .editNoteDialog .sendType .el-radio + .el-radio {
  margin-left: 0px;
}
#newConfigResouce .editNoteDialog .sendType .normal_star {
  margin-left: 10px;
  color: red;
}
#newConfigResouce .editNoteDialog .noteTemplate .el-input__inner {
  width: 178px;
  background: #fff;
  border: solid 1px #d7d7d7;
  text-indent: 0px;
}
#newConfigResouce .editNoteDialog .label_msg .el-input__inner {
  width: 250px;
  background: #fff;
  border: solid 1px #d7d7d7;
  text-indent: 0px;
}
#newConfigResouce .editNoteDialog .noteTemplate .el-form-item__content {
  float: left;
}
#newConfigResouce .editNoteDialog .reouce_code .el-input__inner {
  background: #fff;
  border: solid 1px #d7d7d7;
  text-indent: 0px;
}
#newConfigResouce .editNoteDialog .reouce_code .goPlant {
  width: 490px;
}
#newConfigResouce .warn_dialog .el-dialog .el-dialog__header {
  border-bottom: 0px;
}
#newConfigResouce .warn_dialog .el-dialog .el-dialog__body {
  padding: 20px 0px 0px 0px;
}
#newConfigResouce .warn_dialog .el-radio {
  display: block;
  margin-left: 0px;
  margin-bottom: 20px;
}
#newConfigResouce .warn_dialog .el-dialog__body {
  height: 265px;
  overflow-y: auto;
}
#newConfigResouce .warn_dialog .customRadio {
  margin-bottom: 0px;
}
#newConfigResouce .warn_dialog .el-form-item__error {
  margin-left: 25px;
}
#newConfigResouce .el-button.is-disabled {
  background-image: linear-gradient(41deg, #ffa200 0%, #ffcf00 100%);
  opacity: 0.5;
  color: #fff;
}
#newConfigResouce .warn_dialog .customRadio .el-input__inner {
  background: #fff;
  border: solid 1px #d7d7d7;
  text-indent: 0px;
}
#newConfigResouce .el-input-number .el-input-number__decrease,
#newConfigResouce .el-input-number .el-input-number__increase {
  width: 30px;
  height: 32px;
  border: 0px;
  margin-top: 3px;
  background: #d7d7d7;
  color: #393c40;
  line-height: 32px;
}
#newConfigResouce .el-input-number .el-input__inner {
  background: #fff;
  border-top: solid 1px #d7d7d7;
  border-bottom: solid 1px #d7d7d7;
  text-indent: 0px;
}
#newConfigResouce .showNameListDialog .el-dialog {
  max-height: 470px;
  overflow: hidden;
}
#newConfigResouce .showNameListDialog .el-dialog__header {
  border-bottom: 0px;
}
#newConfigResouce .showNameListDialog .el-dialog__body {
  position: relative;
  padding-left: 0px;
  padding-right: 0px;
  padding-bottom: 20px;
  height: 400px;
  overflow-y: scroll;
}
#newConfigResouce
  .resouce_config_time
  .el-input-number
  .el-input-number__decrease {
  width: 24px;
  height: 24px;
  line-height: 24px;
  margin-top: 0px;
}
#newConfigResouce
  .resouce_config_time
  .el-input-number
  .el-input-number__increase {
  width: 24px;
  height: 24px;
  line-height: 24px;
  margin-top: 0px;
}
#newConfigResouce .resouce_config_time .el-input-number .el-input__inner {
  padding: 0px 30px;
  height: 24px;
}
#newConfigResouce .onlyOnesentType .el-input--suffix .el-input__inner {
  padding: 0px;
  background: #fff;
  text-indent: 0px;
  text-align: right;
  height: 20px;
  line-height: 20px;
}
#newConfigResouce .onlyOnesentType .el-input--suffix .el-input__suffix {
  display: none;
}
</style>