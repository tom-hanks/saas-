<template>
  <div id="defaultPlantform" v-loading="loading">
    <div class="default_plantform">
      <!-- 左侧手机 -->
      <div class="default_phone">
        <p class="plantform_name">兑换平台</p>
        <div class="phone_bg">
          <div class="phone_header"></div>
          <!-- 首页 -->
          <div class="phone_body_box" v-if="isFirstPage">
            <div class="phone_body">
              <input type="text" placeholder="输入兑奖码">
              <input class="cell_phone_number" type="text" placeholder="输入手机号">
              <button>确定</button>
            </div>
          </div>
          <!-- 兑奖页面 -->
          <div class="phone_body_box" v-if="!isFirstPage">
            <div class="phone_body defaultBg">
              <div class="defaule_log">
                <img src="../../../../assets/images/images/defaultLogo.png" alt="LOGO">
              </div>
              <div class="awardTitleBg">
                <div class="awardTitle">{{awardForm.title}}</div>
              </div>
              <input v-if="isShowPhone" class="exchange_phone" type="text" placeholder="输入手机号">
              <button v-if="isShowPhone">确定</button>
              <div class="phoneExplainBg">
                <div class="phone_explain" v-html="noticNext(awardForm.explain)"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 右侧页面配置 -->
      <div class="default_page">
        <div class="default_page_tab">
          <ul>
            <li
              :class="{tabActive:tabIndex == Tindex}"
              v-for="(tab,Tindex) in pageTab"
              :key="Tindex"
              @click="changeTab(Tindex)"
            >
              <span class="setOver">{{tab}}</span>
            </li>
          </ul>
        </div>
        <!-- 首页 -->
        <div class="default_page_content" v-if="isFirstPage">
          <p
            v-for="(item,index) in elementList"
            :key="index"
            v-if="item.element_ename=='exchange_default_award_type'"
          >{{item.elementname}}：{{item.elementvalue}}</p>
          <div class="two-set-btn defaultPageNextBtn">
            <button class="next-set-btn" @click="next">配置下一项</button>
          </div>
        </div>
        <!-- 兑奖页面 -->
        <div class="default_page_content" v-if="!isFirstPage">
          <ul>
            <li v-for="(item,index) in prizeDescList_fir" :key="index">
              <div class="interface_name">{{index+1}}.{{item.material_name}}：</div>
              <div
                class="no_exchang_plant no_exchang_text"
                v-if="item.grant_type==2"
              >该奖品原始码发放，无需上兑换平台</div>
              <div
                class="no_exchang_plant no_exchang_text"
                v-if="item.grant_type !=2 && item.grant_type !=1"
              >该奖品微信发放，无需上兑换平台</div>
              <div class="no_exchang_plant" v-if="item.grant_type==1">
                <div class="editOfficial" @click="editOfficialFun(item)">
                  <i class="el-icon-edit"></i>文案修改
                </div>
                <div class="preview" v-if="item.prize_title&&item.prize_explain">
                  <i class="el-icon-view"></i>预览
                </div>
              </div>
              <div v-if="item.grant_type==1 && item.type_ename !='zichong'" class="switch_father">
                <span>中奖短信通知</span>
                <!-- {{item.is_notices}}这个是打印用的 为了看开关的值是什么 -->
                <el-switch
                  v-model="item.is_notices"
                  @change="switch_click(index)"
                  active-color="#13ce66"
                  inactive-color="#b2b2b2"
                ></el-switch>
                <span class="edit_duanx" v-if="item.is_notices" @click="edit_duanx_clik(item)">
                  <i class="el-icon-edit"></i>编辑短信
                </span>
              </div>
            </li>
          </ul>
          <div class="two-set-btn defaultPageNextBtn">
            <button class="pre-set-btn" @click="prev">配置上一项</button>
          </div>
        </div>
      </div>
    </div>
    <!-- 文案修改 弹框 -->
    <el-dialog
      class="ediAwardDialog"
      title="奖品说明编辑"
      :rules="rules3"
      :visible.sync="showAwardDialog"
    >
      <el-form :model="awardForm" :rules="rules3" ref="awardForm_fir" @submit.native.prevent>
        <el-form-item prop="title" class="award_title" label="中奖标题">
          <el-input
            type="text"
            @keyup.enter.native="submitAwardForm(awardForm)"
            v-model="awardForm.title"
            auto-complete="off"
            maxlength="30"
            placeholder="示例：恭喜您获得爱奇艺月卡"
          ></el-input>
        </el-form-item>
        <el-form-item prop="explain" label="奖品说明">
          <el-input
            type="textarea"
            v-model="awardForm.explain"
            auto-complete="off"
            maxlength="2000"
            placeholder="示例：1)携程APP：消费者登录携程手机客户端，选择“我的”-“我的包”-“礼卡”-“领用/查询”-“领用”-“礼品卡券号”-“礼品卡密码”进行兑换。使用时，选择“我的”- “我的钱包”-“礼品卡”-“任我行”进行使用；
2)携程PC端：消费者需登录携程官网，选择“我的携程”-“携程钱包”-“礼品卡”-“领用礼品卡”-输入“礼品卡券号”和“礼品卡券密”-“立领即用”。
2.有效期：至2021年7月2日。"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAwardDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitAwardForm()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 短信文案编辑 弹框 two-->
    <el-dialog class="editNoteDialog" title="短信文案编辑" :visible.sync="showNoteDialog_fir">
      <div class="official">
        <p>
          <span>*</span>文案预览
        </p>
        <div class="official_look">
          【{{noteForm_fir.msgTable}}】
          {{noteForm_fir.textOne}}
          <span>
            <i v-if="isShowCode_fir">{code}</i>
            {{noteForm_fir.textFour}}
            <i v-if="isShowKey_fir">{key}</i>
          </span>
          {{resouceFormResources_fir.grant == 1?noteForm_fir.textThree:noteForm_fir.textThree}}
          {{noteForm_fir.textTwo}}
        </div>
      </div>
      <el-form :model="noteForm_fir" :rules="rules_fir" ref="noteFormrules3" @submit.native.prevent>
        <div v-if="resouceFormResources_fir.grant == 1"></div>
        <div class="noteDialogContent">
          <div class="clearfix">
            <div class="fl copy_blog">
              <el-form-item class="select_resouce resouceGrant" label="复制模板" prop="grant">
                <el-select
                  v-model="resouceFormResources_fir.templateNum"
                  @change="select_change"
                  style="height:32px"
                  placeholder="默认模板"
                >
                  <el-option
                    v-for="(itemnotices,indexnotices) in noticesArry_fir"
                    :key="indexnotices"
                    :label="itemnotices.material_name"
                    :value="itemnotices.material_name"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="label_msg fl">【
              <el-form-item prop="msgTable">
                <el-input
                  type="text"
                  v-model="noteForm_fir.msgTable"
                  auto-complete="off"
                  maxlength="50"
                  placeholder="请输入短信标签"
                ></el-input>
              </el-form-item>】
            </div>
          </div>
          <el-form-item prop="textOne">
            <el-input
              type="textarea"
              v-model="noteForm_fir.textOne"
              auto-complete="off"
              maxlength
              placeholder="示例：【雀巢】感谢您参与九月雀巢起活动，恭喜您获得xxxxx一份"
            ></el-input>
          </el-form-item>
          <div class="reouce_code">
            <span :class="{'originalCode':false}">
              <i v-if="false"></i>
              {code}
            </span>
            <el-form-item prop="textFour" class="originalCodeText">
              <el-input
                type="text"
                v-model="noteForm_fir.textFour"
                auto-complete="off"
                maxlength
                placeholder="请输入"
              ></el-input>
            </el-form-item>
            <span
              class="noCheckCode"
              :class="{'originalCode':isShowKey_fir}"
              @click="checkedCode(2)"
            >
              <i v-if="isShowKey_fir"></i>
              {key}
            </span>
          </div>
          <el-form-item prop="textTwo">
            <el-input
              type="textarea"
              v-model="noteForm_fir.textTwo"
              auto-complete="off"
              maxlength
              placeholder="激活兑奖码即可使用。有效期至2019年5月7号，逾期作废。疑问咨询：400-145-8596（工作日10:00-18:00）"
            ></el-input>
          </el-form-item>
        </div>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="showNoteDialog_fir = false">取 消</el-button>
        <el-button type="primary" @click="NoteForm()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 文案修改 弹框 two  end-->
    <!-- 上一步   下一步 -->
    <!-- <div class="step-btn">
            <button class="last-step" @click="prevPage">上一步</button>
            <el-button class="next-btn" @click="nextPage()">下一步</el-button>
    </div>-->
  </div>
</template>

<script>
import { httpServer, apiSetting } from "../../../../assets/js/http.js";
export default {
  name: "defaultPlantform",
  props: {
    configModel: null
  },
  components: {},
  data() {
    return {
      // 短信文案start
      // 短信文案  选择code
      isShowCode_fir: true,
      // 短信文案  选择key
      isShowKey_fir: true,
      //  短信文案编辑 弹框
      showNoteDialog_fir: false, //  短信文案编辑 弹框是否显示
      switch_pan_fir: "", //滑块开关的值，存放
      noteForm_fir: {
        // 短信文案编辑表单 数据
        textOne: "", //sms_title
        textTwo: "", //sms_content
        textThree: "",
        textFour: "", //sms_name
        msgTable: "", //sms_sign
        urlFif: "", //sms_url
        sendType: 1
      },
      noticesArry_fir: [],
      arry_save_fir: [], //存起来编辑的短信
      arry_save_judge_fir: [], //存起来文案编辑
      notices_fir: {}, //获取到的短信模板
      notice_id_fir: "", //资源发放通知id ,
      rules_fir: {
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
        textFour: [
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
      resouceFormResources_fir: {
        //卡密类
        resouceFormResourcestext: "", //被选中的资源id
        templateNum: "默认模板", // 发放形式 平台grant=1，原始grant=2   直接发放grant=3
        note: "", //短信文案
        award: "", //奖品说明
        time: ""
      },
      linkCode_fir: "兑奖平台{链接}", //
      // 短信文案end
      pageTab: [],
      tabIndex: 0,
      isFirstPage: true,
      //  奖品说明编辑 弹框
      showAwardDialog: false,
      awardForm: {
        allot_id: "",
        id: "",
        title: "",
        explain: ""
      },
      rules3: {
        title: [
          {
            required: true,
            message: "请输入中奖标题",
            trigger: "change"
          }
          // {
          //   pattern: /^[《》【】π%％_\{\}\"\.@\-\s\[\]\r\\n\/,，:：！？“”、；。（\\）/a-zA-Z0-9\u4e00-\u9fa5]{0,}$/,
          //   message: "文案中包含非法字符"
          // },
        ],
        explain: [
          {
            required: true,
            message: "请输入奖品说明",
            trigger: "change"
          }
          // {
          //   pattern: /^[《》【】π%％_\{\}\"\.@\-\s\[\]\r\\n\/,，:：！？“”、；。（\\）/a-zA-Z0-9\u4e00-\u9fa5]{0,}$/,
          //   message: "文案中包含非法字符"
          // },
        ]
      },
      // 兑换资源奖品说明列表
      prizeDescList_fir: [],
      // 页面值
      pageModel: {
        flow_id: "1021584680652247041",
        channel_id: "1023912645364944904",
        channel_name: "兑换默认渠道"
      },
      // 元素列表
      elementList: [],
      // 是否显示输入手机号   确认按钮
      isShowPhone: false,
      loading: true,
      appid: "",
      template_id: ""
    };
  },
  mounted() {
    this.template_id = this.$getsessionStorage("template_id"); //上一层传过来的模板赋值
    this.appid = this.$getsessionStorage("appid");
    this.elementList = [];
    if (this.configModel) {
      this.pageModel.flow_id = this.configModel.id;
      if (this.configModel.mid_pages) {
        this.configModel.mid_pages.forEach(x => {
          this.pageTab.push(x.page_name);
        });
      } else {
        this.pageTab = ["首页", "兑奖页面"];
      }
      this.getAppElementList();
    } else {
      this.pageTab = ["首页", "兑奖页面"];
    }
  },
  filters: {
    // noticNext(val) {
    //     if (val) {
    //         let str;
    //         str = val.replace(/\r\n/g, "<br/>"); //IE9、FF、chrome
    //         str = val.replace(/\n/g, "<br/>"); //IE7-8
    //         str = val.replace(/\s/g, " "); //空格处理
    //         return str;
    //     }
    // }
  },
  methods: {
    // 短信文案 确认按钮
    NoteForm() {
      // 原始码 shorturl的拼接
      if (this.isShowCode_fir && this.isShowKey_fir) {
        this.originalCodeText = "{code}" + this.noteForm_fir.textFour + "{key}";
      } else if (!this.isShowCode_fir && !this.isShowKey_fir) {
        this.originalCodeText = this.noteForm_fir.textFour;
      } else if (this.isShowCode_fir && !this.isShowKey_fir) {
        this.originalCodeText = "{code}" + this.noteForm_fir.textFour;
      } else if (!this.isShowCode_fir && this.isShowKey_fir) {
        this.originalCodeText = this.noteForm_fir.textFour + "{key}";
      }

      this.$refs.noteFormrules3.validate(valid => {
        if (valid) {
          //   // 判断短信是不是为空  noteFormrules3

          //原始码  的短信预览
          this.resouceFormResources_fir.note =
            "【" +
            this.noteForm_fir.msgTable +
            "】" +
            this.noteForm_fir.textOne +
            this.originalCodeText +
            this.noteForm_fir.textTwo;
          //   }
          let obj = {};
          obj = this.prizeDescList_fir.find(item => {
            //这里的userList就是上面遍历的数据源
            return item.material_name == this.arry_save_fir.material_name; //筛选出匹配数据
          });
          obj.prize_notices = JSON.stringify({
            sms_sign: "【" + this.noteForm_fir.msgTable + "】",
            sms_title: this.noteForm_fir.textOne,
            sms_code: "{code}",
            sms_key: this.isShowKey == true ? "{key}" : "",
            sms_url: this.noteForm_fir.urlFif,
            sms_name: this.noteForm_fir.textFour,
            sms_content: this.noteForm_fir.textTwo
          });
          //   return false;
          this.showNoteDialog_fir = false;

          this.postNoticeUpdate(); //调用短信保存接口
          if (this.resouceFormResources_fir.note) {
            this.no_messge = false;
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 平台码配置短信的保存接口
    postNoticeUpdate() {
      // 传过去的短信要用字符串对象
      this.resouceFormResources_fir.note = JSON.stringify({
        sms_sign: "【" + this.noteForm_fir.msgTable + "】",
        sms_title: this.noteForm_fir.textOne,
        sms_code: "{code}",
        sms_key: this.isShowKey_fir == true ? "{key}" : "",
        sms_url: this.noteForm_fir.urlFif,
        sms_name: this.noteForm_fir.textFour,
        sms_content: this.noteForm_fir.textTwo
      });
      httpServer(apiSetting.postNoticeUpdate, {
        id: this.notice_id_fir, //资源发放通知id ,
        is_notices: this.switch_pan_fir == false ? 0 : 1, //滑块（短信）开关true传1，false传0
        prize_notices:
          this.switch_pan_fir == false ? "" : this.resouceFormResources_fir.note //注：是否发中奖短信is_notices=0时，prize_notices可以不传,is_notices=1时，prize_notices必传
      })
        .then(response => {
          this.notice_id_fir = "";
          //   this.getResourceDescList(); //像修改中奖弹窗的确定按钮一样，重新刷新资源list
          //   alert("保存成功");
        })
        .catch(error => {
          console.log("111111111111111" + error);
        });
    },
    select_change(value) {
      let obj = {};
      obj = this.noticesArry_fir.find(item => {
        //这里的userList就是上面遍历的数据源
        return item.material_name === value; //筛选出匹配数据
      });
      this.notices_fir = JSON.parse(obj.notices);
      this.noteForm_fir.sendType = obj.configuration_type;
      this.noteForm_fir.msgTable = this.notices_fir.sms_sign.substring(
        this.notices_fir.sms_sign.indexOf("【") + 1,
        this.notices_fir.sms_sign.indexOf("】")
      );
      this.noteForm_fir.urlFif = this.notices_fir.sms_url; //属性：{兑换地址}，此页面用不到传过来什
      this.noteForm_fir.textOne = this.notices_fir.sms_title;
      //   this.noteForm_fir.textFour = this.notices_fir.shorturl.substring(
      //     this.notices_fir.shorturl.indexOf("{code}") + 6,
      //     this.notices_fir.shorturl.indexOf("{链接}")
      //   );
      this.noteForm_fir.textFour = this.notices_fir.sms_name;
      if (this.notices_fir.sms_key == "{key}") {
        this.isShowKey_fir = true;
      } else {
        this.isShowKey_fir = false;
      }
      this.noteForm_fir.textTwo = this.notices_fir.sms_content;
    },
    // 短信文案 选择code或者key
    checkedCode(num) {
      if (num == 1) {
        // this.isShowCode_fir = !this.isShowCode_fir;
        // if (!this.isShowKey_fir) {
        //   this.isShowKey_fir = true;
        // }
      } else if (num == 2) {
        this.isShowKey_fir = !this.isShowKey_fir;
        if (!this.isShowCode_fir) {
          this.isShowCode_fir = true;
        }
      }
    },
    switch_click(index) {
      this.switch_pan_fir = ""; //先滑块置空再放值
      this.switch_pan_fir = this.prizeDescList_fir[index].is_notices; //滑块存起来
      if (!this.prizeDescList_fir[index].is_notices) {
        this.notice_id_fir = this.prizeDescList_fir[
          index
        ].mid_material_allot_notice_id;
        this.postNoticeUpdate(); //关闭按钮的时候执行保存
      }
    },
    edit_duanx_clik(value) {
      this.notice_id_fir = value.mid_material_allot_notice_id; //dym，让更改的字段更改之前的名字是prize_id；
      this.switch_pan_fir = value.is_notices; //如果默认是打开的情况，就要把改造后源数据的当前数据的is_notices赋值
      this.arry_save_fir = value; //选择哪个 存下来
      //控制短信文案编辑的弹窗
      httpServer(apiSetting.get_source_code_notice_templates, {
        app_id: this.$getsessionStorage("appid")
      })
        .then(response => {
          this.noticesArry_fir = response;
          let obj = {};
          obj = this.noticesArry_fir.find(item => {
            //这里的userList就是上面遍历的数据源
            return item.material_name === value.material_name; //筛选出匹配数据
          });
          //   判断这个资源进去模板匹配  有没有值 有值的话就显示自己填写的  没有的话 就显示默认模板
          if (value.prize_notices) {
            this.notices_fir = JSON.parse(value.prize_notices);
            this.noteForm_fir.sendType = value.configuration_type;
            this.noteForm_fir.msgTable = this.notices_fir.sms_sign.substring(
              this.notices_fir.sms_sign.indexOf("【") + 1,
              this.notices_fir.sms_sign.indexOf("】")
            );
            //   this.noteForm_fir.textOne = this.notices_fir.title.substring(
            //     this.notices_fir.title.indexOf("】") + 1
            //   );
            this.noteForm_fir.urlFif = this.notices_fir.sms_url; //属性：{兑换地址}，此页面用不到传过来什么就拉过去什么
            this.noteForm_fir.textOne = this.notices_fir.sms_title;

            //   this.noteForm_fir.textFour = this.notices_fir.shorturl.substring(
            //     this.notices_fir.shorturl.indexOf("{code}") + 6,
            //     this.notices_fir.shorturl.indexOf("{链接}")
            //   );
            this.noteForm_fir.textFour = this.notices_fir.sms_name;
            // 传过来的有{key}传过来的话就打开，否则就不打开
            if (this.notices_fir.sms_key == "{key}") {
              this.isShowKey_fir = true;
            } else {
              this.isShowKey_fir = false;
            }
            this.noteForm_fir.textTwo = this.notices_fir.sms_content;
            this.resouceFormResources_fir.templateNum = "默认模板"; //给短信模板选中赋值
          } else if (obj) {
            if (obj.notices) {
              //   有短信
              this.notices_fir = JSON.parse(obj.notices);
              this.noteForm_fir.sendType = obj.configuration_type;
              this.noteForm_fir.msgTable = this.notices_fir.sms_sign.substring(
                this.notices_fir.sms_sign.indexOf("【") + 1,
                this.notices_fir.sms_sign.indexOf("】")
              );
              //   this.noteForm_fir.textOne = this.notices_fir.title.substring(
              //     this.notices_fir.title.indexOf("】") + 1
              //   );
              this.noteForm_fir.urlFif = this.notices_fir.sms_url; //属性：{兑换地址}，此页面用不到传过来什么就拉过去什么
              this.noteForm_fir.textOne = this.notices_fir.sms_title;

              //   this.noteForm_fir.textFour = this.notices_fir.shorturl.substring(
              //     this.notices_fir.shorturl.indexOf("{code}") + 6,
              //     this.notices_fir.shorturl.indexOf("{链接}")
              //   );
              this.noteForm_fir.textFour = this.notices_fir.sms_name;
              // 传过来的有{key}传过来的话就打开，否则就不打开
              if (this.notices_fir.sms_key == "{key}") {
                this.isShowKey_fir = true;
              } else {
                this.isShowKey_fir = false;
              }
              this.noteForm_fir.textTwo = this.notices_fir.sms_content;
              this.resouceFormResources_fir.templateNum = value.material_name; //给短信模板选中赋值
            }
          } else {
            //  没有短信
            if (response.length > 0) {
              this.notices_fir = JSON.parse(response[0].notices);
              this.noteForm_fir.sendType = response[0].configuration_type;
            }
            this.noteForm_fir.msgTable = this.notices_fir.sms_sign.substring(
              this.notices_fir.sms_sign.indexOf("【") + 1,
              this.notices_fir.sms_sign.indexOf("】")
            );
            this.noteForm_fir.urlFif = this.notices_fir.sms_url; //属性：{兑换地址}，此页面用不到传过来什么就拉过去什么

            // this.noteForm_fir.textOne = this.notices_fir.title.substring(
            //   this.notices_fir.title.indexOf("】") + 1
            // );
            this.noteForm_fir.textOne = this.notices_fir.sms_title;
            // this.noteForm_fir.textFour = this.notices_fir.shorturl.substring(
            //   this.notices_fir.shorturl.indexOf("{code}") + 6,
            //   this.notices_fir.shorturl.indexOf("{链接}")
            // );
            this.noteForm_fir.textFour = this.notices_fir.sms_name;
            // 传过来的有{key}传过来的话就打开，否则就不打开
            if (this.notices_fir.sms_key == "{key}") {
              this.isShowKey_fir = true;
            } else {
              this.isShowKey_fir = false;
            }
            this.noteForm_fir.textTwo = this.notices_fir.sms_content;
            this.resouceFormResources_fir.templateNum = "默认模板"; //给短信模板选中赋值
          }
          //   this.getnoteForm = response;
        })
        .catch(error => {
          console.log("111111111111111" + error);
        });
      this.showNoteDialog_fir = true;
    },
    noticNext(val) {
      if (val) {
        let str;
        str = val.replace(/\r\n/g, "<br/>"); //IE9、FF、chrome
        str = val.replace(/\n/g, "<br/>"); //IE7-8
        str = val.replace(/\s/g, " "); //空格处理

        return str;
      }
    },
    setPage() {},
    // 首页  兑奖页面tab切换
    changeTab(index) {
      this.$emit("getMessage", index); //告诉父元素我选中的是不是中奖页面，如果是中奖页面的话，就不需要每次触发确定都重新拉取数据；
      this.tabIndex = index;
      if (index == 1) {
        this.isFirstPage = false;
        this.getResourceDescList();
      } else {
        this.isFirstPage = true;
        this.elementList = [];
        this.getAppElementList();
      }
    },
    // 预览
    previewFun(item) {
      if (item.type_ename == "zichong") {
        this.isShowPhone = true;
      } else {
        this.isShowPhone = false;
      }
      this.awardForm.title = item.prize_title;
      this.awardForm.explain = item.prize_explain;
    },
    // 文案编辑
    editOfficialFun(item) {
      this.awardForm.id = item.mid_material_allot_prize_explain_id; //dym，让更改的字段更改之前的名字是prize_id；
      this.awardForm.allot_id = item.id;
      this.awardForm.title = item.prize_title;
      this.awardForm.explain = item.prize_explain;
      if (item.prize_explain) {
        var reg = new RegExp("<br/>", "g");
        // str = str.replace(reg, "\n");
        this.awardForm.explain = item.prize_explain.replace(reg, "\n");
      }
      this.arry_save_judge_fir = item; //当前文案存起来
      this.showAwardDialog = true;
      //   如果为空的时候重置中奖弹窗
      if (
        this.$refs["awardForm_fir"] &&
        !item.prize_title &&
        !item.prize_explain
      ) {
        this.$refs["awardForm_fir"].resetFields();
      }
    },
    // 修改奖品说明
    submitAwardForm() {
      this.$refs.awardForm_fir.validate(valid => {
        //验证合格后执行
        if (valid) {
          this.awardForm.explain = this.awardForm.explain.replace(
            /\r\n/g,
            "<br/>"
          ); //IE9、FF、chrome
          this.awardForm.explain = this.awardForm.explain.replace(
            /\n/g,
            "<br/>"
          ); //IE7-8
          this.awardForm.explain = this.awardForm.explain.replace(/\s/g, " "); //空格处理
          let obj = {};
          obj = this.prizeDescList_fir.find(item => {
            //这里的userList就是上面遍历的数据源
            return item.material_name == this.arry_save_judge_fir.material_name; //筛选出匹配数据
          });
          obj.prize_title = this.awardForm.title;
          obj.prize_explain = this.awardForm.explain;
          //   return false;
          this.previewFun(obj); //提交保存的时候 就把存起来的改掉
          // 修改奖品说明
          httpServer(apiSetting.putMidMaterialAllotPrizeExplainEdit, {
            mid_material_allot_id: this.awardForm.allot_id,
            prize_title: this.awardForm.title,
            prize_explain: this.awardForm.explain,
            id: this.awardForm.id,
            status: 1
          })
            .then(response => {
              // console.log("所有信息");
              // console.log(response);
              this.awardForm.id = "";
              this.awardForm.allot_id = "";
              //   this.awardForm.title = "";
              //   this.awardForm.explain = "";
              this.showAwardDialog = false;
            })
            .catch(error => {
              this.loading = false;
              console.log(error); //loading层关闭
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    next() {
      // 格式化提交的页面元素数据
      let pageEleList = [];
      this.elementList.forEach(x => {
        let element = {
          app_id: this.appid,
          template_id: this.template_id,
          page_id: x.page_id,
          element_id: x.id,
          id: x.pgeleid,
          elementvalue: x.elementvalue,
          status: 1
        };
        pageEleList.push(element);
      });

      // 保存页面元素配置信息
      httpServer(apiSetting.postMidTempate, {
        id: this.template_id,
        app_id: this.appid,
        flow_id: this.pageModel.flow_id,
        channelid: this.pageModel.channel_id,
        channel: this.pageModel.channel_name,
        theme_id: 0,
        channel_type: 0,
        channerid: 0,
        cur_pageno: 0,
        styles_id: 0,
        status: 1,
        mid_page_element_infos: pageEleList
      })
        .then(response => {
          if (response == 0) {
            this.$message({
              message: "保存配置信息失败",
              duration: 1000
            });
            return false;
          } else {
            return true;
          }
        })
        .catch(error => {
          this.loading = false;
          console.log(error); //loading层关闭
        });
      this.changeTab(1);
    },
    prev() {
      this.changeTab(0);
    },
    // 获取资源文案列表
    getResourceDescList() {
      this.loading = true;
      this.prizeDescList_fir = []; //置空数组 避免重复点击的时候 数据不正确
      // 获取资源文案列表
      httpServer(apiSetting.getMidMaterialAllotNoticePrizes, {
        template_id: this.template_id
      })
        .then(response => {
          // console.log("所有信息");
          // console.log(response);
          this.prizeDescList_fir = response;
          //   if (this.prizeDescList_fir.length > 0) {
          for (var i = 0; i <= this.prizeDescList_fir.length - 1; i++) {
            //   三元判断，改造源数据，为了操作滑块开关 start
            console.log("没有问题", this.prizeDescList_fir[i].is_notices);
            this.prizeDescList_fir[i].is_notices == 1
              ? (this.prizeDescList_fir[i].is_notices = true)
              : (this.prizeDescList_fir[i].is_notices = false);
            //   三元判断，改造源数据，为了操作滑块开关 end
          }
          //   }

          for (var i = 0; i <= this.prizeDescList_fir.length - 1; i++) {
            if (this.prizeDescList_fir[i].grant_type == 1) {
              if (
                this.prizeDescList_fir[i].prize_title != null &&
                this.prizeDescList_fir[i].prize_explain != null
              ) {
                this.awardForm.title = this.prizeDescList_fir[i].prize_title;
                this.awardForm.explain = this.prizeDescList_fir[
                  i
                ].prize_explain;
                if (this.prizeDescList_fir[i].type_ename == "zichong") {
                  this.isShowPhone = true;
                } else {
                  this.isShowPhone = false;
                }
                break;
              }
            }
          }

          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          console.log(error); //loading层关闭
        });
    },
    // 获得默认模版首页的页面元素
    getAppElementList() {
      this.loading = true;
      this.configModel.mid_pages.forEach(x => {
        // 获得默认模版首页的页面元素
        httpServer(apiSetting.getAppElementList, {
          pageId: x.id
        })
          .then(response => {
            if (this.elementList.length > 0) {
              response.forEach(t => {
                this.elementList.push(t);
              });
            } else {
              this.elementList = response;
            }
            this.getPageElementList(x.id);

            this.loading = false;
          })
          .catch(error => {
            this.loading = false;
            console.log(error); //loading层关闭
          });
      });
    },
    getPageElementList(pageid) {
      // 获取资源文案列表
      this.loading = true;
      httpServer(apiSetting.getPageElement, {
        templateId: this.template_id,
        pageId: pageid
      })
        .then(response => {
          let pgEleList = response;
          this.elementList.forEach((x, i) => {
            let idx = pgEleList.findIndex(e => e.element_id == x.id);
            if (pgEleList[idx]) {
              x.elementvalue = pgEleList[idx].elementvalue;
              x["pgeleid"] = pgEleList[idx].id;
            }
          });

          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          console.log(error); //loading层关闭
        });
    }
  }
};
</script>
<style>
#defaultPlantform .editNoteDialog .el-dialog__body {
  max-height: 358px;
  padding-top: 11px;
  overflow-x: auto;
}
#defaultPlantform .ediAwardDialog .el-input__inner {
  background-color: #ffffff;
  box-shadow: inset 0px 2px 2px 0px rgba(215, 215, 215, 0.2);
  border-radius: 6px;
  border: solid 1px #d7d7d7;
  font-size: 12px;
}
#defaultPlantform .editNoteDialog .el-dialog {
  max-height: 490px;
}
#defaultPlantform .ediAwardDialog .el-textarea__inner {
  height: 120px;
  font-size: 12px;
}
#defaultPlantform .ediAwardDialog .award_title .el-input__inner {
  text-indent: 0px;
}
#defaultPlantform .swiper-pagination-bullet {
  background: #fff;
  opacity: 1;
}
#defaultPlantform .swiper-pagination-bullet-active {
  background-color: rgba(0, 0, 0, 0.5);
}
#defaultPlantform .label_msg .el-input .el-input__inner {
  background: #fff;
  border: solid 1px #d7d7d7;
  font-size: 12px;
  text-indent: 0;
}
#defaultPlantform .ediAwardDialog .el-form-item__error {
  left: 78px;
}
#defaultPlantform .reouce_code .el-input__inner {
  background: #fff;
  border: solid 1px #d7d7d7;
  text-indent: 0;
  font-size: 12px;
}
#defaultPlantform .editNoteDialog .el-dialog__footer {
  padding: 30px 20px 30px 20px;
}
</style>

<style scoped lang="less">
#defaultPlantform {
  .default_plantform {
    width: 825px;
    min-height: 550px;
    background-color: #f5f5f5;
    border-radius: 8px;
    margin-left: 20px;
    padding: 0px 20px 20px 20px;
    overflow: hidden;
    .default_phone,
    .default_page {
      float: left;
    }
    .default_phone {
      width: 235px;
      margin-right: 20px;
      margin-top: 10px;
      .plantform_name {
        text-align: center;
        margin-bottom: 10px;
        // font-size: 18px;
      }
      .phone_bg {
        height: 420px;
        background: url(../../../../assets/images/images/phone.png) no-repeat
          center;
        background-size: 100% 100%;
        padding: 50px 10px 0px 10px;
        .phone_header {
          width: 215px;
          height: 35px;
          background: url(../../../../assets/images/images/liulanqi.png)
            no-repeat center;
          background-size: 100% 100%;
        }
        .phone_body_box {
          width: 215px;
          height: 336px;
          overflow: hidden;
          .phone_body {
            width: 234px;
            height: 335px;
            background: url(../../../../assets/images/images/plantBg.png)
              no-repeat left top;
            background-size: 215px 100%;
            padding-top: 1px;
            overflow-y: auto;

            .background_img {
              display: block;
              width: 100%;
              height: 100%;
            }
            input {
              display: block;
              width: 125px;
              height: 26px;
              background-color: #fff;
              border-radius: 6px;
              border: solid 1px rgba(255, 255, 255, 0.38);
              text-align: center;
              text-indent: 0px;
              padding: 0px 10px;
              margin-top: 160px;
              margin-left: 35px;
              font-size: 12px;
            }
            .cell_phone_number {
              margin-top: 10px;
            }
            button {
              display: block;
              width: 147px;
              height: 28px;
              background: url(../../../../assets/images/images/button.png)
                no-repeat center;
              background-size: 100% 100%;
              border-radius: 6px;
              margin-top: 20px;
              margin-left: 35px;
              color: #fff;
            }
            .exchange_phone {
              margin-top: 15px;
            }
          }
          .defaultBg {
            background: url(../../../../assets/images/images/defaultBg.png)
              no-repeat left top;
            background-size: cover;
            position: relative;
            .defaule_log {
              position: absolute;
              top: 10px;
              left: 5px;
            }
          }
        }
        .awardTitleBg {
          width: 202px;
          min-height: 90px;
          padding-left: 13px;
          padding-top: 95px;
          background: url(../../../../assets/images/images/textBg.png) no-repeat
            left top;
          background-size: 100% 100%;
          .awardTitle {
            width: 145px;
            min-height: 30px;
            // background-color: #fff;
            border-radius: 6px;
            color: red;
            font-size: 16px;
            padding: 10px 20px;
            text-align: center;
          }
        }
        .phoneExplainBg {
          width: 190px;
          margin-left: 13px;
          min-height: 90px;
          padding-top: 24px;
          background: url(../../../../assets/images/images/title.png) no-repeat
            left top;
          background-size: 100% 25px;
          margin-top: 10px;
          .phone_explain {
            width: 180px;
            min-height: 65px;
            background-color: #ede6f6;
            border-bottom-right-radius: 6px;
            border-bottom-left-radius: 6px;
            font-size: 10px;
            padding: 5px;
            color: #170058;
            word-wrap: break-word;
          }
        }
      }
    }
    .default_page {
      width: 570px;
      min-height: 520px;
      margin-top: 20px;
      background-color: #ffffff;
      box-shadow: 0px 2px 15px 4px rgba(210, 210, 210, 0.3);
      border-radius: 10px;
      .default_page_tab {
        ul {
          overflow: hidden;
          li {
            width: 284px;
            float: left;
            text-align: center;
            border-bottom: 1px #996aec solid;
            border-top: 3px #fff solid;
            height: 45px;
            line-height: 45px;
            .setOver {
              padding-left: 20px;
              background: url(../../../../assets/images/images/checked.png)
                no-repeat left center;
              background-size: 18px 18px;
            }
          }
          .tabActive {
            border-top: 3px #996aec solid;
            border-left: 1px #996aec solid;
            border-right: 1px #996aec solid;
            border-bottom: solid 1px #fff;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
            color: #5608e0;
          }
        }
      }
      .default_page_content {
        position: relative;
        padding: 25px 20px;
        min-height: 500px;
        ul {
          li {
            overflow: hidden;
            margin-bottom: 15px;
            .interface_name,
            .no_exchang_plant {
              //   float: left;
              display: inline-block;
              vertical-align: middle;
            }
            .no_exchang_plant {
              overflow: hidden;
              .preview,
              .editOfficial {
                float: left;
                cursor: pointer;
              }
              .preview {
                color: #f4a13e;
                font-size: 12px;
                margin-left: 16px;
                margin-right: 25px;
                .el-icon-view {
                  margin-right: 5px;
                  font-size: 16px;
                  margin-top: 3px;
                }
              }
              .editOfficial {
                color: #4f07e1;
                font-size: 12px;
                .el-icon-edit {
                  margin-right: 5px;
                  font-size: 14px;
                  margin-top: 5px;
                }
              }
            }
            .switch_father {
              > span {
                margin-right: 10px;
              }
              margin-top: 20px;
              .edit_duanx {
                margin-left: 12px;
                color: #4f07e1;
                cursor: pointer;
              }
            }
            .no_exchang_text {
              //   color: #ccc;
              color: #393c40;
            }
          }
        }
      }
    }
  }
  .ediAwardDialog {
    .el-input,
    .el-textarea {
      width: 480px;
    }
  }
  .noteDialogContent {
    width: 540px;
    background-color: #f5f5f5;
    border-radius: 6px;
    border: solid 1px #c9c9c9;
    padding: 8px 10px;
    padding-bottom: 6px;
    .el-form-item {
      margin-bottom: 14px;
    }
    .reouce_code {
      overflow: hidden;
      margin-top: 8px;
      span {
        float: left;
        margin-top: 10px;
        margin-bottom: 15px;
      }
      .el-form-item {
        width: 330px;
        float: left;
        margin-right: 6px;
        margin-bottom: 20px;
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
        margin: 0px 20px 17px 20px;
      }
    }
    .label_msg {
      margin-bottom: 8px;
      margin-left: 19px;
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
    font-size: 12px;
    margin-bottom: 10px;
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
  .defaultPageNextBtn {
    position: absolute;
    bottom: 0px;
    left: 0px;
    width: 100%;
    text-align: center;
  }
}
</style>

