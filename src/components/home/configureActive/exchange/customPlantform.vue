<template>
  <div id="customPlantform" v-loading="loading">
    <div class="default_plantform">
      <!-- 左侧手机 -->
      <div class="default_phone">
        <p class="plantform_name">{{externalName}}</p>
        <div class="phone_bg">
          <div class="phone_header"></div>
          <!-- 首页 -->
          <div class="phone_body_box" v-if="isFirstPage">
            <div
              class="phone_body"
              :style="{backgroundImage: 'url(' + BgUrl + ')', backgroundSize:'215px 100%'}"
            >
              <div class="plant_logo">
                <img v-if="LogoUrl" :src="LogoUrl" alt="平台logo">
              </div>
              <div class="swiper_box">
                <swiper
                  v-if="bannerValue"
                  class="swiper-container framework_list_ul"
                  :options="swiperOption"
                  ref="mySwiper"
                >
                  <swiper-slide v-for="(item,index) in bannerList" :key="index">
                    <img :src="item.banner_url" alt>
                  </swiper-slide>
                  <!-- <swiper-slide><img src="../../../../assets/images/images/banner2.png" alt="banner"></swiper-slide>
                  <swiper-slide><img src="../../../../assets/images/images/banner2.png" alt="banner"></swiper-slide>-->
                  <div class="swiper-pagination" slot="pagination"></div>
                </swiper>
              </div>
              <input class="custom_input" type="text" placeholder="输入兑奖码">
              <input class="cell_phone_number" type="text" placeholder="输入手机号">
              <button
                v-for="(btnItem,Bindex) in customBtnList"
                :key="Bindex"
                v-if="upBtnIndex == Bindex"
              >
                <img :src="upUrlossApi+btnItem" alt>
              </button>
              <button
                v-if="upBtnIndex != 0 &&upBtnIndex != 1 && upBtnIndex != 2 && upBtnIndex != 3 && upBtnIndex != 4 && upBtnIndex != 5 "
              >
                <img :src="BtnUrl" alt>
              </button>
            </div>
          </div>
          <!-- 兑奖页面 -->
          <div class="phone_body_box" v-if="!isFirstPage">
            <div
              class="phone_body"
              :style="{backgroundImage: 'url(' + BgUrl + ')', backgroundSize:'215px 100%'}"
            >
              <div class="plant_logo">
                <img v-if="LogoUrl" :src="LogoUrl" alt="平台logo">
              </div>
              <div class="customDialog">
                <div v-show="dialogStyleIndex==0" class="awardTitleBg">
                  <div class="awardTitle">{{customForm.title}}</div>
                </div>
                <div v-show="dialogStyleIndex==1" class="customDialog_second">
                  <div class="awardTitle">{{customForm.title}}</div>
                </div>
                <div v-show="dialogStyleIndex==2" class="customDialog_threed">
                  <div class="awardTitle">{{customForm.title}}</div>
                </div>
                <div v-show="dialogStyleIndex==3" class="customDialog_four">
                  <div class="awardTitle">{{customForm.title}}</div>
                </div>
                <div v-show="dialogStyleIndex==4" class="customDialog_five">
                  <div class="awardTitle">{{customForm.title}}</div>
                </div>
                <div v-show="dialogStyleIndex==5" class="customDialog_six">
                  <div class="awardTitle">{{customForm.title}}</div>
                </div>
              </div>
              <input v-if="isShowPhone" class="exchange_phone" type="text" placeholder="输入手机号">
              <div v-if="isShowPhone">
                <button
                  v-for="(btnItem,Bindex) in customBtnList"
                  :key="Bindex"
                  v-if="upBtnIndex == Bindex"
                >
                  <img :src="upUrlossApi+btnItem" alt>
                </button>
                <button
                  v-if="upBtnIndex != 0 &&upBtnIndex != 1 && upBtnIndex != 2 && upBtnIndex != 3 && upBtnIndex != 4 && upBtnIndex != 5 "
                >
                  <img :src="BtnUrl" alt>
                </button>
              </div>
              <!-- <button v-if="isShowPhone">确定</button> -->
              <div class="phoneExplainBg">
                <div class="phone_explain" v-html="noticNext(customForm.explain)"></div>
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
          <el-form :model="indexPageForm" :rules="rules" ref="indexPageForm" class="demo-ruleForm">
            <el-form-item
              v-for="(item,index) in elementList"
              :key="index"
              v-if="item.element_ename=='exchange_custom_logo'"
            >
              <p class="upload_title">
                LOGO上传
                <span>
                  （
                  <i>*</i>点击上传logo，图片尺寸为160*100像素）
                </span>
              </p>
              <el-upload
                class="avatar-uploader"
                :action="uploadUrl"
                :show-file-list="false"
                :on-success="handleLogoSuccess"
                :data="uploadParam"
              >
                <img v-if="LogoUrl" :src="LogoUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item
              v-for="(item,index) in elementList"
              :key="index"
              v-if="item.element_ename=='exchange_custom_backimg'"
            >
              <p class="upload_title">
                背景图上传
                <span>
                  （
                  <i>*</i>点击上传图片，图片尺寸为750×1624像素）
                </span>
              </p>
              <el-upload
                class="avatar-uploader"
                :action="uploadUrl"
                :show-file-list="false"
                :on-success="handleBgSuccess"
                :on-remove="handleBgRemove"
                :before-remove="beforeBgRemove"
                :data="uploadParam"
              >
                <img v-if="BgUrl" :src="BgUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <div class="delect_BgImg" v-if="BgUrl!=defaultBgImg" v-on:click.self="delectBgImg">×</div>
            </el-form-item>
            <el-form-item
              v-for="(item,index) in elementList"
              :key="index"
              v-if="item.element_ename=='exchange_custom_award_type'"
            >
              <p>{{item.elementname}}：{{item.elementvalue}}</p>
            </el-form-item>
            <el-form-item
              v-for="(item,index) in elementList"
              :key="index"
              v-if="item.element_ename=='exchange_custom_button'"
            >
              <p class="upBtn_title">{{item.elementname}}</p>
              <ul class="upBtn_list">
                <li
                  :class="{selectedUpBtn:index==upBtnIndex}"
                  @click="selectUpBtn(index)"
                  v-for="(btnItem, index) in upBtnList"
                  :key="index"
                >{{btnItem}}</li>
              </ul>
              <div class="customBtn">
                <el-upload
                  class="upCustomBtn"
                  :action="uploadUrl"
                  :show-file-list="false"
                  :on-success="handleBtnSuccess"
                  :data="uploadParam"
                >
                  <img v-if="BtnUrl" :src="BtnUrl" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon">自定义上传</i>
                </el-upload>
                <p class="upBtnNotice">
                  <span class="red_star">*</span>按钮尺寸480*88像素
                </p>
              </div>
            </el-form-item>
            <div class="upload_banner">
              <el-switch
                v-model="bannerValue"
                :inactive-text="item.elementname+'：'"
                active-color="#13ce66"
                inactive-color="#AAAAAA"
                v-if="item.element_ename=='exchange_custom_banner_enabled'"
                v-for="(item,index) in elementList"
                :key="index"
                @change="setEnabled"
              ></el-switch>
              <el-form-item
                class="openBanner positionBanner"
                :label="item.elementname+'：'"
                prop="BannerPosition"
                v-if="item.element_ename=='exchange_custom_banner_count' && bannerValue"
                v-for="(item,index) in elementList"
                :key="index"
              >
                <el-select v-model="indexPageForm.BannerPosition" @change="setBannerCount">
                  <el-option
                    :label="t.label"
                    :value="t.value"
                    v-for="(t,i) in bannerCountList"
                    :key="i"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                class="openBanner"
                :label="item.elementname+'：'"
                prop="BannerChangeTime"
                v-if="item.element_ename=='exchange_custom_banner_time' && bannerValue"
                v-for="(item,index) in elementList"
                :key="index"
              >
                <el-select v-model="indexPageForm.BannerChangeTime" @change="setBannerTime">
                  <el-option
                    :label="t.label"
                    :value="t.value"
                    v-for="(t,i) in bannerTimeList"
                    :key="i"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
            <p class="banner_size" v-if="bannerValue">
              <span class="red_star">*</span>Banner尺寸为750*380像素
            </p>
            <div class="bannerList" v-if="bannerValue">
              <ul>
                <li
                  v-for="(item,index) in bannerList"
                  :key="index"
                  @click="uploadBannerSuccess(index)"
                >
                  <div class="banner_num fl">0{{index+1}}</div>
                  <el-form-item class="banner_item fl" label="Banner上传">
                    <el-upload
                      class="avatar-uploader"
                      :action="uploadUrl"
                      :show-file-list="false"
                      :on-success="handleBannerSuccess"
                      :data="uploadParam"
                    >
                      <img v-if="item.banner_url" :src="item.banner_url" class="avatar">
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                  </el-form-item>
                  <el-form-item class="banner_link_item fl" label="Banner链接" prop="bannerLink">
                    <el-input
                      :value="LinkReplace(item.link)"
                      placeholder="www.baidu.com"
                      @blur="blurBannerLink"
                    ></el-input>
                  </el-form-item>
                  <!-- <div class="banner_view fl" @click="previewFunBanner(index)">
                  <i class="el-icon-view"></i>预览</div>-->
                </li>
              </ul>
            </div>
          </el-form>
          <div class="two-set-btn">
            <button class="next-set-btn" @click="next">配置下一项</button>
          </div>
        </div>
        <!-- 兑奖页面 -->
        <div class="default_page_content" v-if="!isFirstPage">
          <div
            class="dialogStyle"
            v-for="(item,index) in elementList"
            :key="index"
            v-if="item.element_ename=='exchange_window_class'"
          >
            <p>{{item.elementname}}</p>
            <ul class="upBtn_list">
              <li
                :class="{selectedUpBtn:Dindex==dialogStyleIndex}"
                @click="selectDialogStyle(Dindex)"
                v-for="(diaItem, Dindex) in dialogStyle"
                :key="Dindex"
              >{{diaItem}}</li>
            </ul>
          </div>

          <ul>
            <li class="clearfix" v-for="(item,index) in prizeDescList" :key="index">
              <div class="interface_name">{{index+1}}.{{item.material_name}}：</div>
              <div
                class="no_exchang_plant no_exchang_text"
                v-if="item.grant_type==2"
              >该奖品原始码发放，无需上兑换平台</div>
              <div
                class="no_exchang_plant no_exchang_text"
                v-if="item.grant_type !=2 && item.grant_type !=1 && item.grant_type !=3"
              >该奖品微信发放，无需上兑换平台</div>
              <!-- Spring6直接充值的兑奖说明  需要做判断的 根据 item.grant_type-->
              <div
                class="no_exchang_plant no_exchang_text"
                v-if="item.grant_type == 3"
              >该奖品直接发放，无需上兑奖平台</div>
              <div class="no_exchang_plant" v-if="item.grant_type==1">
                <div class="editOfficial" @click="editOfficialFun(item)">
                  <i class="el-icon-edit"></i>文案修改
                </div>
                <div
                  class="preview"
                  v-if="item.prize_title&&item.prize_explain"
                  @click="previewFun(item)"
                >
                  <i class="el-icon-view"></i>预览
                </div>
              </div>
              <div v-if="item.grant_type==1 && item.type_ename !='zichong'" class="switch_father">
                <span>中奖短信通知</span>
                <!-- {{item.is_notices}}这个是打印用的 为了看开关的值是什么 -->
                <el-switch
                  :width="41"
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
    <!-- 短信文案编辑 弹框 two-->
    <el-dialog class="editNoteDialog" title="短信文案编辑" :visible.sync="showNoteDialog">
      <div class="official">
        <p>
          <span>*</span>文案预览
        </p>
        <div class="official_look">
          【{{noteForm.msgTable}}】
          {{noteForm.textOne}}
          <span>
            <i v-if="isShowCode">{code}</i>
            {{noteForm.textFour}}
            <i v-if="isShowKey">{key}</i>
          </span>
          <!-- <span v-if="resouceFormResources.grant==1">{{ noteForm.sendType== 2?'':'{code}'}}</span> -->
          {{resouceFormResources.grant == 1?noteForm.textThree:noteForm.textThree}}
          <!-- {{resouceFormResources.grant == 2?'':linkCode}} -->
          {{noteForm.textTwo}}
        </div>
      </div>
      <el-form :model="noteForm" :rules="rules3" ref="noteFormrules3" @submit.native.prevent>
        <div v-if="resouceFormResources.grant == 1"></div>
        <div class="noteDialogContent">
          <div class="clearfix">
            <div class="fl copy_blog">
              <el-form-item class="select_resouce resouceGrant" label="复制模板" prop="grant">
                <el-select
                  v-model="resouceFormResources.templateNum"
                  style="height:32px"
                  placeholder="默认模板"
                  @change="select_change"
                >
                  <el-option
                    v-for="(itemnotices,indexnotices) in noticesArry"
                    :key="indexnotices"
                    :label="itemnotices.material_name"
                    :value="itemnotices.material_name"
                  ></el-option>
                  <!-- <el-option label="资源xx的模板" value="1"></el-option> -->
                </el-select>
              </el-form-item>
            </div>
            <div class="label_msg fl">【
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
          <!-- 原始码 不用去平台兑换 v-if="resouceFormResources.grant == 2"-->
          <div class="reouce_code">
            <span :class="{'originalCode':false}">
              <i v-if="false"></i>
              {code}
            </span>
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
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="showNoteDialog = false">取 消</el-button>
        <el-button type="primary" @click="NoteForm()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 文案修改 弹框 two  end-->
    <el-dialog class="ediAwardDialog" title="奖品说明编辑" :visible.sync="showCustomDialog">
      <el-form :model="customForm" :rules="rules4" ref="customForms" @submit.native.prevent>
        <el-form-item class="award_title" prop="title" label="中奖标题">
          <el-input
            type="text"
            @keyup.enter.native="submitCustomForm(customForm)"
            v-model="customForm.title"
            auto-complete="off"
            maxlength="12"
            placeholder="示例：恭喜您获得爱奇艺月卡"
          ></el-input>
        </el-form-item>
        <el-form-item prop="explain" label="奖品说明">
          <el-input
            type="textarea"
            v-model="customForm.explain"
            auto-complete="off"
            maxlength="2000"
            placeholder="示例：1)携程APP：消费者登录携程手机客户端，选择“我的”-“我的包”-“礼卡”-“领用/查询”-“领用”-“礼品卡券号”-“礼品卡密码”进行兑换。使用时，选择“我的”- “我的钱包”-“礼品卡”-“任我行”进行使用；
2)携程PC端：消费者需登录携程官网，选择“我的携程”-“携程钱包”-“礼品卡”-“领用礼品卡”-输入“礼品卡券号”和“礼品卡券密”-“立领即用”。
2.有效期：至2021年7月2日。"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showCustomDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitCustomForm()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { httpServer, apiSetting } from "../../../../assets/js/http.js";
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import { throws } from "assert";
export default {
  name: "customPlantform",
  props: {
    configModel: null //{app_id:"",template_id:""}
  },
  components: {
    swiper,
    swiperSlide
  },
  data() {
    return {
      // 短信文案  选择code
      isShowCode: true,
      // 短信文案  选择key
      isShowKey: true,
      //  短信文案编辑 弹框
      showNoteDialog: false, //  短信文案编辑 弹框是否显示
      switch_pan: "", //滑块
      noteForm: {
        // 短信文案编辑表单 数据
        textOne: "", //sms_title
        textTwo: "", //sms_content
        textThree: "",
        textFour: "", //sms_name
        msgTable: "", //sms_sign
        urlFif: "", //sms_url
        sendType: 1
      },
      noticesArry: [],
      arry_save: [], //存起来编辑的短信
      arry_save_judge: [], //存起来文案编辑
      notices: {}, //获取到的短信模板
      notice_id: "",
      rules3: {
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
      rules4: {
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
      resouceFormResources: {
        //卡密类
        resouceFormResourcestext: "", //被选中的资源id
        templateNum: "默认模板", // 发放形式 平台grant=1，原始grant=2   直接发放grant=3
        note: "", //短信文案
        award: "", //奖品说明
        time: ""
      },
      linkCode: "兑奖平台{链接}", //

      //  首页   兑奖页面tab
      pageTab: [],
      tabIndex: 0,
      isFirstPage: true,
      // 首页配置表单数据
      indexPageForm: {
        BannerPosition: "1", // banner位
        BannerChangeTime: "1", // banner切换频率
        bannerLink: "" //Banner链接
      },
      rules: {}, // 首页配置表单验证
      // 图片轮播参数配置
      swiperOption: {
        autoplay: {
          delay: 1000,
          disableOnInteraction: false
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true
        },
        loop: true,
        observer: true,
        observeParents: true
      },
      // 上传logo图片参数配置
      uploadUrl: "http://oss.esurl.cn/api/images/UploadForSaas",
      upUrlossApi: apiSetting.urlossApi.url,
      customBtnList: [
        "/SAAS/dev-middle/system/201811061636353d1b4e47e6db4118b3ce9d3ccd5ac212.png",
        "/SAAS/dev-middle/system/20181106163722389cbecb4e1446bfb31de014b9f16096.png",
        "/SAAS/dev-middle/system/2018110616373450258fe76b454eb7870f1f93980e626f.png",
        "/SAAS/dev-middle/system/201811231132321aaef55e2bc3421eacf538a4717d0cbe.png",
        "/SAAS/dev-middle/system/201811231133094e48f65e82f44f429245672476e68a1b.png",
        "/SAAS/dev-middle/system/20181123113336f7e8c7934f3143b4b2cb7671a36d7335.png"
      ],
      defaultBgImg:
        "http://esmartsaas.oss-cn-hangzhou.aliyuncs.com/SAAS/middle/system/201809261205186799a584f8af44a4ad51b6fe3456512d.png",
      uploadParam: {
        pnum: "",
        uid: "",
        sign: "",
        ossPath: "",
        timestamp: ""
      },
      LogoUrl: "",
      BgUrl: "",
      // banner 启用开关
      bannerValue: true,
      //上传banner图片的参数配置
      uploaBannerdUrl: "",
      BannerUrl: "",
      // 文案修改
      showCustomDialog: false,

      customForm: {
        allot_id: "",
        id: "",
        title: "",
        explain: ""
      },
      // banner列表
      bannerList: [],
      //兑换资源奖品说明列表
      prizeDescList: [],
      // 页面值
      pageModel: {
        flow_id: "1021584680652247041",
        page_id: "1021586681784045571",
        channel_id: "1023912645364944904",
        channel_name: "兑换默认渠道"
      },
      // 元素列表
      elementList: [],
      // banner数量下拉框集合
      bannerCountList: [{ label: "1个", value: "1" }],
      // banner轮播时间间隔下拉框集合
      bannerTimeList: [{ label: "1秒", value: "1" }],
      // banner上传图片时的索引
      bannerIndex: 0,
      // 是否显示输入手机号   确认按钮
      isShowPhone: false,
      loading: true,
      appid: "",
      template_id: "",
      externalName: "",
      // 自定义   按钮上传
      upBtnList: ["样式1", "样式2", "样式3", "样式4", "样式5", "样式6"],
      // 自定义  弹框
      dialogStyle: ["样式1", "样式2", "样式3", "样式4", "样式5", "样式6"],
      dialogStyleIndex: 0,
      upBtnIndex: 0,
      BtnUrl: ""
    };
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper;
    }
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
    this.getOssConfig();
    this.getActiveName();
  },
  methods: {
    // 短信文案 确认按钮
    NoteForm() {
      // 原始码 shorturl的拼接
      if (this.isShowCode && this.isShowKey) {
        this.originalCodeText = "{code}" + this.noteForm.textFour + "{key}";
      } else if (!this.isShowCode && !this.isShowKey) {
        this.originalCodeText = this.noteForm.textFour;
      } else if (this.isShowCode && !this.isShowKey) {
        this.originalCodeText = "{code}" + this.noteForm.textFour;
      } else if (!this.isShowCode && this.isShowKey) {
        this.originalCodeText = this.noteForm.textFour + "{key}";
      }

      // 平台码  shorturl的拼接
      //   if (this.noteForm.sendType == 1) {
      //     this.platformCodeText =
      //       "{code}" + this.noteForm.textThree + "兑奖平台{链接}";
      //   } else {
      //     this.platformCodeText = this.noteForm.textThree + "兑奖平台{链接}";
      //   }
      this.$refs.noteFormrules3.validate(valid => {
        if (valid) {
          //   // 判断短信是不是为空  noteFormrules3
          //   if (this.resouceFormResources.grant == 1) {
          //     //平台码的短信预览
          //     this.resouceFormResources.note =
          //       "【" +
          //       this.noteForm.msgTable +
          //       "】" +
          //       this.noteForm.textOne +
          //       this.platformCodeText +
          //       this.noteForm.textTwo;
          //   } else {
          //原始码  的短信预览 仅仅做页面显示用
          this.resouceFormResources.note =
            "【" +
            this.noteForm.msgTable +
            "】" +
            this.noteForm.textOne +
            this.originalCodeText +
            this.noteForm.textTwo;
          //   }
          let obj = {};
          obj = this.prizeDescList.find(item => {
            //这里的userList就是上面遍历的数据源
            return item.material_name == this.arry_save.material_name; //筛选出匹配数据
          });
          obj.prize_notices = JSON.stringify({
            sms_sign: "【" + this.noteForm.msgTable + "】",
            sms_title: this.noteForm.textOne,
            sms_code: "{code}",
            sms_key: this.isShowKey == true ? "{key}" : "",
            sms_url: this.noteForm.urlFif,
            sms_name: this.noteForm.textFour,
            sms_content: this.noteForm.textTwo
          });

          this.showNoteDialog = false;

          this.postNoticeUpdate(); //调用短信保存接口
          if (this.resouceFormResources.note) {
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
      this.resouceFormResources.note = JSON.stringify({
        sms_sign: "【" + this.noteForm.msgTable + "】",
        sms_title: this.noteForm.textOne,
        sms_code: "{code}",
        sms_key: this.isShowKey == true ? "{key}" : "",
        sms_url: this.noteForm.urlFif,
        sms_name: this.noteForm.textFour,
        sms_content: this.noteForm.textTwo
      });
      httpServer(apiSetting.postNoticeUpdate, {
        id: this.notice_id, //资源发放通知id,
        is_notices: this.switch_pan == false ? 0 : 1, //滑块（短信）开关true传1，false传0
        prize_notices:
          this.switch_pan == false ? "" : this.resouceFormResources.note //注：是否发中奖短信
      })
        .then(response => {
          this.notice_id = "";
          //   this.getResourceDescList("is_notices"); //像修改中奖弹窗的确定按钮一样，重新刷新资源list
        })
        .catch(error => {
          console.log("111111111111111" + error);
        });
    },
    select_change(value) {
      //select切换的方法
      let obj = {};
      obj = this.noticesArry.find(item => {
        //这里的userList就是上面遍历的数据源
        return item.material_name === value; //筛选出匹配数据
      });
      this.notices = JSON.parse(obj.notices);
      this.noteForm.sendType = obj.configuration_type;
      this.noteForm.msgTable = this.notices.sms_sign.substring(
        this.notices.sms_sign.indexOf("【") + 1,
        this.notices.sms_sign.indexOf("】")
      );
      this.noteForm.urlFif = this.notices.sms_url; //属性：{兑换地址}，此页面用不到传过来什么就拉过去什么
      this.noteForm.textOne = this.notices.sms_title;
      //   this.noteForm.textFour = this.notices.shorturl.substring(
      //     this.notices.shorturl.indexOf("{code}") + 6,
      //     this.notices.shorturl.indexOf("{链接}")
      //   );
      this.noteForm.textFour = this.notices.sms_name;
      if (this.notices.sms_key == "{key}") {
        this.isShowKey = true;
      } else {
        this.isShowKey = false;
      }
      this.noteForm.textTwo = this.notices.sms_content;
    },
    // 短信文案 选择code或者key
    checkedCode(num) {
      if (num == 1) {
        // this.isShowCode = !this.isShowCode;
        // if (!this.isShowKey) {
        //   this.isShowKey = true;
        // }
      } else if (num == 2) {
        this.isShowKey = !this.isShowKey;
        if (!this.isShowCode) {
          this.isShowCode = true;
        }
      }
    },
    switch_click(index) {
      this.switch_pan = ""; //先滑块置空再放值
      this.switch_pan = this.prizeDescList[index].is_notices; //滑块存起来
      //   关闭 立马调用接口
      if (!this.prizeDescList[index].is_notices) {
        this.notice_id = this.prizeDescList[index].mid_material_allot_notice_id;
        this.postNoticeUpdate(); //关闭按钮的时候执行保存
        // alert("关闭 立马调用接口");
      }
    },
    edit_duanx_clik(value) {
      this.notice_id = value.mid_material_allot_notice_id; //dym，让更改的字段更改之前的名字是prize_id；
      //控制短信文案编辑的弹窗
      this.switch_pan = value.is_notices; //如果默认是打开的情况，就要把改造后源数据的当前数据的is
      this.arry_save = value; //选择哪个 存下来
      httpServer(apiSetting.get_source_code_notice_templates, {
        app_id: this.$getsessionStorage("appid")
      })
        .then(response => {
          this.noticesArry = response;
          let obj = {};
          obj = this.noticesArry.find(item => {
            //这里的userList就是上面遍历的数据源
            return item.material_name === value.material_name; //筛选出匹配数据
          });
          //   判断这个资源进去模板匹配  有没有值 有值的话就显示自己填写的  没有的话 就显示默认模板
          if (value.prize_notices) {
            this.notices = JSON.parse(value.prize_notices);
            this.noteForm.sendType = value.configuration_type;
            this.noteForm.msgTable = this.notices.sms_sign.substring(
              this.notices.sms_sign.indexOf("【") + 1,
              this.notices.sms_sign.indexOf("】")
            );
            // this.noteForm.textOne = this.notices.title.substring(
            //   this.notices.title.indexOf("】") + 1
            // );
            this.noteForm.urlFif = this.notices.sms_url; //属性：{兑换地址}，此页面用不到传过来什么就拉过去什么
            this.noteForm.textOne = this.notices.sms_title;
            // 如果有短信的话 截取
            // this.noteForm.textFour = this.notices.shorturl.substring(
            //   this.notices.shorturl.indexOf("{code}") + 6,
            //   this.notices.shorturl.indexOf("{key}")
            // );
            this.noteForm.textFour = this.notices.sms_name;
            if (this.notices.sms_key == "{key}") {
              this.isShowKey = true;
            } else {
              this.isShowKey = false;
            }
            this.noteForm.textTwo = this.notices.sms_content;
            this.resouceFormResources.templateNum = "默认模板"; //给短信模板选中赋值
          } else if (obj) {
            //有短信
            if (obj.notices) {
              this.notices = JSON.parse(obj.notices);
              this.noteForm.sendType = obj.configuration_type;
              this.noteForm.msgTable = this.notices.sms_sign.substring(
                this.notices.sms_sign.indexOf("【") + 1,
                this.notices.sms_sign.indexOf("】")
              );

              //   this.noteForm.textOne = this.notices.title.substring(
              //     this.notices.title.indexOf("】") + 1
              //   );
              this.noteForm.urlFif = this.notices.sms_url; //属性：{兑换地址}，此页面用不到传过来什么就拉过去什么
              this.noteForm.textOne = this.notices.sms_title;
              //   this.noteForm.textFour = this.notices.shorturl.substring(
              //     this.notices.shorturl.indexOf("{code}") + 6,
              //     this.notices.shorturl.indexOf("{链接}")
              //   );
              this.noteForm.textFour = this.notices.sms_name;
              // 传过来的有{key}传过来的话就打开，否则就不打开
              if (this.notices.sms_key == "{key}") {
                this.isShowKey = true;
              } else {
                this.isShowKey = false;
              }
              this.noteForm.textTwo = this.notices.sms_content;
              this.resouceFormResources.templateNum = value.material_name; //给短信模板选中赋值
            }
          } else {
            //没有短信
            if (response.length > 0) {
              this.notices = JSON.parse(response[0].notices);
              this.noteForm.sendType = response[0].configuration_type;
            }

            this.noteForm.msgTable = this.notices.sms_sign.substring(
              this.notices.sms_sign.indexOf("【") + 1,
              this.notices.sms_sign.indexOf("】")
            );
            this.noteForm.urlFif = this.notices.sms_url; //属性：{兑换地址}，此页面用不到传过来什么就拉过去什么
            this.noteForm.textOne = this.notices.sms_title;
            // this.noteForm.textFour = this.notices.shorturl.substring(
            //   this.notices.shorturl.indexOf("{code}") + 6,
            //   this.notices.shorturl.indexOf("{链接}")
            // );
            this.noteForm.textFour = this.notices.sms_name;
            // 传过来的有{key}传过来的话就打开，否则就不打开
            if (this.notices.sms_key == "{key}") {
              this.isShowKey = true;
            } else {
              this.isShowKey = false;
            }
            this.noteForm.textTwo = this.notices.sms_content;
            this.resouceFormResources.templateNum = "默认模板"; //给短信模板选中赋值
          }
          //   默认模板赋值

          //   this.getnoteForm = response; 暂时不用
        })
        .catch(error => {
          console.log("111111111111111" + error);
        });
      this.showNoteDialog = true;
    },
    // 自定义弹框
    selectDialogStyle(diglogIndex) {
      let index = this.elementList.findIndex(
        x => x.element_ename == "exchange_window_class"
      );
      if (index > -1) this.elementList[index].elementvalue = diglogIndex;
      this.dialogStyleIndex = diglogIndex;
    },
    //自定义按钮  上传成功的回掉
    handleBtnSuccess(response, file, fileList) {
      if (response.IsSuccess) {
        this.BtnUrl = response.ResultData.list[0].OriginImgUrl;
        let index = this.elementList.findIndex(
          x => x.element_ename == "exchange_custom_button"
        );
        if (index > -1) this.elementList[index].elementvalue = this.BtnUrl;
        this.upBtnIndex = -1;
      }
    },
    selectUpBtn(BTNindex) {
      this.BtnUrl = "";
      let fakeBtnUrl = "";
      fakeBtnUrl = this.upUrlossApi + this.customBtnList[BTNindex];
      let index = this.elementList.findIndex(
        x => x.element_ename == "exchange_custom_button"
      );
      if (index > -1) this.elementList[index].elementvalue = fakeBtnUrl;
      this.upBtnIndex = BTNindex;
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
    getActiveName() {
      httpServer(apiSetting.getAppinfoById, {
        appId: this.$getsessionStorage("appid")
      })
        .then(response => {
          this.externalName = response.app_external_name;
        })
        .catch(error => {
          console.log("111111111111111" + error);
        });
    },
    // 获得oss图片上传参数
    getOssConfig() {
      // 保存轮播图
      this.loading = true;
      httpServer(apiSetting.getOssConfig, {
        target: "middle_system"
      })
        .then(response => {
          // console.log("所有信息");
          // console.log(response);
          this.uploadParam.pnum = response.pnum;
          this.uploadParam.uid = response.uid;
          this.uploadParam.sign = response.sign;
          this.uploadParam.ossPath = response.oss_path;
          this.uploadParam.timestamp = response.timestamp;
          // console.log("所有信息");
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          console.log(error); //loading层关闭
        });
    },
    // 首页  兑奖页面tab切换
    changeTab(indexTab) {
      this.$emit("getMessage", indexTab); //告诉父元素我选中的是不是中奖页面，如果是中奖页面的话，就不需要每次触发确定都重新拉取数据；
      // this.tabIndex = indexTab;
      if (indexTab == 1) {
        this.next();
      } else {
        this.tabIndex = 0;
        this.isFirstPage = true;
      }
    },
    LinkReplace(val) {
      return val.replace("http://", "");
    },
    // 设置banner个数
    setBannerCount(value) {
      let index = this.elementList.findIndex(
        x => x.element_ename == "exchange_custom_banner_count"
      );
      if (index > -1) this.elementList[index].elementvalue = value;
      //生成banner列表
      let i = 0;
      this.bannerList = [];
      for (i = 0; i < value; i++) {
        let banner = {
          template_id: this.template_id,
          page_id: this.pageModel.page_id,
          banner_url: "",
          link: "",
          orderno: i
        };
        this.bannerList.push(banner);
        this.swiper.update();
      }
    },
    // 设置banner时间间隔
    setBannerTime(value) {
      //设置预览效果的间隔时间
      this.swiperOption.autoplay.delay = value * 1000;

      let index = this.elementList.findIndex(
        x => x.element_ename == "exchange_custom_banner_time"
      );
      if (index > -1) this.elementList[index].elementvalue = value;
      this.swiper.update();
    },
    // 设置banner开关
    setEnabled(value) {
      // this.bannerValue = value;
      let index = this.elementList.findIndex(
        x => x.element_ename == "exchange_custom_banner_enabled"
      );
      if (index > -1) this.elementList[index].elementvalue = value;
      this.swiper.update();
    },
    previewFun(item) {
      if (item.type_ename == "zichong") {
        this.isShowPhone = true;
      } else {
        this.isShowPhone = false;
      }
      //   this.arry_save_judge.prize_title =  item.prize_title;
      //   this.arry_save_judge.explain =  item.explain;
      this.customForm.title = item.prize_title;
      this.customForm.explain = item.prize_explain;
    },
    editOfficialFun(item) {
      this.customForm.id = item.mid_material_allot_prize_explain_id; //dym，让更改的字段更改之前的名字是prize_id；
      this.customForm.allot_id = item.id;
      this.customForm.title = item.prize_title;
      this.customForm.explain = item.prize_explain;
      if (item.prize_explain) {
        var reg = new RegExp("<br/>", "g");
        // str = str.replace(reg, "\n");
        this.customForm.explain = item.prize_explain.replace(reg, "\n");
      }
      this.arry_save_judge = item; //当前文案存起来
      this.showCustomDialog = true;
      //   如果为空的时候重置中奖弹窗
      if (
        this.$refs["customForms"] &&
        !item.prize_title &&
        !item.prize_explain
      ) {
        this.$refs["customForms"].resetFields();
      }
    },
    // 上传Logo
    handleLogoSuccess(response, file, fileList) {
      if (response.IsSuccess) {
        this.LogoUrl = response.ResultData.list[0].OriginImgUrl;
        let index = this.elementList.findIndex(
          x => x.element_ename == "exchange_custom_logo"
        );
        if (index > -1) this.elementList[index].elementvalue = this.LogoUrl;
      }
    },
    // 上出背景图
    handleBgSuccess(response, file, fileList) {
      if (response.IsSuccess) {
        this.BgUrl = response.ResultData.list[0].OriginImgUrl;
        let index = this.elementList.findIndex(
          x => x.element_ename == "exchange_custom_backimg"
        );
        if (index > -1) this.elementList[index].elementvalue = this.BgUrl;
      }
    },
    delectBgImg() {
      this.BgUrl = this.defaultBgImg;
      let index = this.elementList.findIndex(
        x => x.element_ename == "exchange_custom_backimg"
      );
      if (index > -1) this.elementList[index].elementvalue = this.BgUrl;
    },
    handleBgRemove(file, fileList) {
      console.log(file, fileList);
    },
    beforeBgRemove(file, fileList) {
      console.log(file, fileList);
    },
    // 上传banner图
    handleBannerSuccess(response, file, fileList) {
      if (response.IsSuccess) {
        this.bannerList[this.bannerIndex].banner_url =
          response.ResultData.list[0].OriginImgUrl;
        this.swiper.update();
      }
    },
    uploadBannerSuccess(index) {
      if (this.bannerIndex != index) this.bannerIndex = index;
    },
    blurBannerLink(e) {
      if (e.target.value.indexOf("http") == 0) {
        this.bannerList[this.bannerIndex].link = e.target.value;
      } else {
        this.bannerList[this.bannerIndex].link = "http://" + e.target.value;
      }
    },
    // 预览
    previewFunBanner(index) {
      this.swiper.slideTo(index + 1, 100, false);
    },
    // 修改奖品说明
    submitCustomForm() {
      this.$refs.customForms.validate(valid => {
        //验证合格后执行
        if (valid) {
          this.customForm.explain = this.customForm.explain.replace(
            /\r\n/g,
            "<br/>"
          ); //IE9、FF、chrome
          this.customForm.explain = this.customForm.explain.replace(
            /\n/g,
            "<br/>"
          ); //IE7-8
          this.customForm.explain = this.customForm.explain.replace(/\s/g, " "); //空格处理
          let obj = {};
          obj = this.prizeDescList.find(item => {
            //这里的userList就是上面遍历的数据源
            return item.material_name == this.arry_save_judge.material_name; //筛选出匹配数据
          });
          obj.prize_title = this.customForm.title;
          obj.prize_explain = this.customForm.explain;
          //   return false;
          this.previewFun(obj); //提交保存的时候 就把存起来的改掉
          // 修改奖品说明
          httpServer(apiSetting.putMidMaterialAllotPrizeExplainEdit, {
            mid_material_allot_id: this.customForm.allot_id,
            prize_title: this.customForm.title,
            prize_explain: this.customForm.explain,
            id: this.customForm.id,
            status: 1
          })
            .then(response => {
              this.customForm.id = "";
              this.customForm.allot_id = "";
              //   this.customForm.title = "";
              //   this.customForm.explain = "";
              this.showCustomDialog = false;
              //   重新拉取列表注释
              //   this.getResourceDescList("modify");
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
    // 获得轮播图列表
    getBannerList() {
      // 根据id获取基本信息
      this.loading = true;
      httpServer(apiSetting.getMidBannerList, {
        templateId: this.template_id,
        pageId: this.pageModel.page_id
      })
        .then(response => {
          if (response && response.length > 0) {
            this.bannerList = response;
            this.swiper.update();
          }
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          console.log(error); //loading层关闭
        });
    },
    prev() {
      this.changeTab(0);
    },
    next() {
      // 验证图片
      //   if (this.LogoUrl == "") {
      //     this.$message({
      //       message: "请上传LOGO图片",
      //       duration: 1000
      //     });
      //     return false;
      //   }
      if (this.BgUrl == "") {
        this.$message({
          message: "请上传背景图片",
          duration: 1000
        });
        return false;
      }
      // 验证banner图
      let idx = this.bannerList.findIndex(x => x.banner_url == "");
      let valid = idx < 0;
      if (!valid && this.bannerValue) {
        this.$message({
          message: "请上传第" + (idx + 1) + "个Banner图",
          duration: 1000
        });
        return false;
      }
      // 初始化下拉框和开启开关
      let index = this.elementList.findIndex(
        x => x.element_ename == "exchange_custom_banner_count"
      );
      if (index > -1) {
        if (this.elementList[index].elementvalue.length > 1)
          this.elementList[index].elementvalue = "1";
      }
      index = this.elementList.findIndex(
        x => x.element_ename == "exchange_custom_banner_time"
      );
      if (index > -1) {
        if (this.elementList[index].elementvalue.length > 1)
          this.elementList[index].elementvalue = "1";
      }
      index = this.elementList.findIndex(
        x => x.element_ename == "exchange_custom_banner_enabled"
      );
      if (index > -1) {
        if (this.elementList[index].elementvalue.length == 0)
          this.elementList[index].elementvalue = "true";
      }
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

      // 保存轮播图banner
      httpServer(apiSetting.postMidBanner, {
        mid_template_banners: this.bannerList,
        template_id: this.template_id
      })
        .then(response => {
          if (!response || response.length != this.bannerList.length) {
            // this.$alert("提交banner图失败", "提示");
            this.$message({
              message: "提交banner图失败",
              duration: 1000
            });
            return false;
          }
          this.tabIndex = 1;
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
              this.getPageElementList(this.configModel.mid_pages[1].id)
                .then(response => {
                  return this.getPageElementList(
                    this.configModel.mid_pages[0].id
                  );
                })
                .then(data => {
                  this.loading = false;
                  // return this.orderGetStatusCount();
                  //后面可以用传过来的数据做些其他操作
                  //......
                });
              if (response == 0) {
                // this.$alert("保存配置信息失败", "提示");
                this.$message({
                  message: "保存配置信息失败",
                  duration: 1000
                });
                return false;
              } else {
                return true;
                // // 跳转活动预览
                // this.$router.push({
                //     name: "preview",
                //     params: {
                //         appId: this.appid,
                //         templateId: this.configModel
                //             .exchange_stepModel.template_id
                //     }
                // });
              }
            })
            .catch(error => {
              this.loading = false;
              return false;
              console.log(error); //loading层关闭
            });
        })
        .catch(error => {
          console.log(error);
          return false;
        });
      this.isFirstPage = false;
      this.getResourceDescList();
    },
    // 获取资源文案列表
    getResourceDescList(parameter) {
      // 获取资源文案列表  关闭滑块的时候 无感知（开关短信开关的时候不显示loding）
      if (parameter != "is_notices") {
        this.loading = true;
      }
      this.prizeDescList = []; //置空数组 避免重复点击的时候 数据不正确
      httpServer(apiSetting.getMidMaterialAllotNoticePrizes, {
        template_id: this.template_id
      })
        .then(response => {
          this.prizeDescList = response;
          for (var i = 0; i <= this.prizeDescList.length - 1; i++) {
            this.prizeDescList[i].is_notices == 1
              ? (this.prizeDescList[i].is_notices = true)
              : (this.prizeDescList[i].is_notices = false);
          }
          for (var i = 0; i <= this.prizeDescList.length - 1; i++) {
            // alert(this.prizeDescList[i].prize_title);
            if (this.prizeDescList[i].grant_type == 1) {
              if (
                this.prizeDescList[i].prize_title != null &&
                this.prizeDescList[i].prize_explain != null
              ) {
                this.customForm.title = this.prizeDescList[i].prize_title;
                this.customForm.explain = this.prizeDescList[i].prize_explain;
                if (this.prizeDescList[i].type_ename == "zichong") {
                  this.isShowPhone = true;
                } else {
                  this.isShowPhone = false;
                }
                break;
              }
            }
          }
          if (parameter == "modify") {
            //这个隐藏laoding只可以在修改按钮调用的时候隐藏，不然切换tab掉接口会刷新两次
            this.loading = false;
          }
        })
        .catch(error => {
          this.loading = false;
          console.log(error); //loading层关闭
        });
    },
    // 获得默自定义版首页的页面元素
    getAppElementList() {
      // 获得自定义模版首页的页面元素
      this.loading = true;
      this.configModel.mid_pages.forEach((x, index) => {
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
            //格式化banner数量集合和banner时间间隔集合
            if (this.elementList.length > 0) {
              let countList = this.elementList.find(
                x => x.element_ename == "exchange_custom_banner_count"
              );
              if (countList)
                this.bannerCountList = JSON.parse(countList.elementvalue);
              let timeList = this.elementList.find(
                x => x.element_ename == "exchange_custom_banner_time"
              );
              if (countList)
                this.bannerTimeList = JSON.parse(timeList.elementvalue);
              if (index == this.configModel.mid_pages.length - 1) {
                this.setBannerCount(1);
                this.getBannerList();
              }
            }
            this.loading = false;
          })
          .catch(error => {
            this.loading = false;
            console.log(error); //loading层关闭
          });
      });
    },
    // 获取页面元素值
    getPageElementList(pageid) {
      return new Promise((resolve, reject) => {
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
                if (
                  pgEleList[idx].elementvalue &&
                  pgEleList[idx].elementvalue != ""
                )
                  x.elementvalue = pgEleList[idx].elementvalue;
                x["pgeleid"] = pgEleList[idx].id;
              }
              // 自定义按钮
              switch (x.element_ename) {
                case "exchange_custom_logo":
                  this.LogoUrl = x.elementvalue;
                  break;
                case "exchange_custom_button":
                  if (
                    x.elementvalue ==
                    this.upUrlossApi + this.customBtnList[0]
                  ) {
                    this.upBtnIndex = 0;
                    this.BtnUrl = "";
                  } else if (
                    x.elementvalue ==
                    this.upUrlossApi + this.customBtnList[1]
                  ) {
                    this.upBtnIndex = 1;
                    this.BtnUrl = "";
                  } else if (
                    x.elementvalue ==
                    this.upUrlossApi + this.customBtnList[2]
                  ) {
                    this.upBtnIndex = 2;
                    this.BtnUrl = "";
                  } else if (
                    x.elementvalue ==
                    this.upUrlossApi + this.customBtnList[3]
                  ) {
                    this.upBtnIndex = 3;
                    this.BtnUrl = "";
                  } else if (
                    x.elementvalue ==
                    this.upUrlossApi + this.customBtnList[4]
                  ) {
                    this.upBtnIndex = 4;
                    this.BtnUrl = "";
                  } else if (
                    x.elementvalue ==
                    this.upUrlossApi + this.customBtnList[5]
                  ) {
                    this.upBtnIndex = 5;
                    this.BtnUrl = "";
                  } else if (x.elementvalue != "") {
                    this.BtnUrl = x.elementvalue;
                    this.upBtnIndex = -1;
                  }
                  break;
                case "exchange_window_class":
                  this.dialogStyleIndex = x.elementvalue;
                  break;
                case "exchange_custom_backimg":
                  this.BgUrl = x.elementvalue;
                  break;
                case "exchange_custom_banner_enabled":
                  if (x.elementvalue == "false") {
                    this.bannerValue = false;
                  } else {
                    this.bannerValue = true;
                  }

                  break;
                case "exchange_custom_banner_count":
                  if (x.elementvalue.length == 1)
                    this.indexPageForm.BannerPosition = x.elementvalue;
                  else this.indexPageForm.BannerPosition = 1 + "个";
                  break;
                case "exchange_custom_banner_time":
                  if (x.elementvalue.length == 1)
                    this.indexPageForm.BannerChangeTime = x.elementvalue;
                  else this.indexPageForm.BannerChangeTime = 1 + "秒";
                  break;
              }
            });
            resolve("我是第二次");
          })
          .catch(error => {
            this.loading = false;
            console.log(error); //loading层关闭
          });
      });
    }
  }
};
</script>
<style>
#customPlantform .editNoteDialog .el-dialog__body {
  max-height: 358px;
  padding-top: 11px;
  overflow-x: auto;
}
#customPlantform .el-form-item__content {
  position: relative;
}
#customPlantform .editNoteDialog .el-dialog {
  max-height: 490px;
}
#customPlantform .editNoteDialog .sendType {
  margin-bottom: 0px;
}
#customPlantform .editNoteDialog .sendType .el-form-item__label {
  line-height: normal;
}
#customPlantform .editNoteDialog .sendType .el-form-item__content {
  width: 460px;
  float: left;
}
#customPlantform .editNoteDialog .sendType .el-radio__label {
  font-size: 12px;
}
#customPlantform .editNoteDialog .sendType .el-radio {
  margin-bottom: 10px;
}
#customPlantform .editNoteDialog .sendType .el-radio + .el-radio {
  margin-left: 0px;
}
#customPlantform .editNoteDialog .sendType .normal_star {
  margin-left: 10px;
  color: red;
}
#customPlantform .avatar-uploader .el-upload {
  width: 100%;
  height: 100%;
}
#customPlantform .el-switch__label.is-active {
  color: #393c40;
}
#customPlantform .openBanner .el-form-item__label {
  padding: 0px;
}
#customPlantform .openBanner .el-select {
  float: left;
  width: 90px;
}
#customPlantform .openBanner .el-form-item__content {
  float: left;
}
#customPlantform .openBanner .el-input__inner {
  text-indent: 0px;
  background: #fff;
  border-radius: 4px;
  border: solid 1px #d9d9d9;
}
#customPlantform .bannerList .banner_item .el-form-item__content {
  float: left;
}
#customPlantform .bannerList .banner_link_item {
  margin-top: 10px;
  margin-right: 10px;
}
#customPlantform .bannerList .banner_link_item .el-form-item__content {
  float: left;
}
#customPlantform .noteDialogContent .el-textarea__inner {
  font-size: 12px;
}
#customPlantform
  .bannerList
  .banner_link_item
  .el-form-item__content
  .el-input {
  width: 148px;
  font-size: 12px;
}
#customPlantform
  .bannerList
  .banner_link_item
  .el-form-item__content
  .el-input
  .el-input__inner {
  background: #f6f6f6;
  border-radius: 4px;
  border: solid 1px #d9d9d9;
  text-indent: 0px;
}
#customPlantform .bannerList .el-form-item__label {
  font-size: 12px;
  padding-right: 3px;
}
#customPlantform .award_title .el-input__inner {
  text-indent: 0px;
}
#customPlantform .swiper-pagination-bullet {
  background: #fff;
}
#customPlantform .customBtn .el-upload {
  width: 160px;
  height: 30px;
  border-radius: 4px;
  border: dashed 1px #aaaeb3;
  line-height: 30px;
}
#customPlantform .customBtn .el-upload img {
  display: block;
  width: 100%;
  height: 100%;
}
#customPlantform .customBtn .el-icon-plus {
  font-size: 12px;
  color: #aaaeb3;
}
#customPlantform .ediAwardDialog .el-input__inner {
  background-color: #ffffff;
  box-shadow: inset 0px 2px 2px 0px rgba(215, 215, 215, 0.2);
  border-radius: 6px;
  border: solid 1px #d7d7d7;
  font-size: 12px;
}
#customPlantform .ediAwardDialog .el-textarea__inner {
  height: 120px;
  font-size: 12px;
  resize: none;
}
#customPlantform .label_msg .el-input {
  width: 230px;
}
#customPlantform .reouce_code .el-input__inner {
  background: #fff;
  border: solid 1px #d7d7d7;
  text-indent: 0;
  font-size: 12px;
}
#customPlantform .label_msg .el-input .el-input__inner {
  background: #fff;
  border: solid 1px #d7d7d7;
  font-size: 12px;
  text-indent: 0;
}
#customPlantform .noteDialogContent .el-form-item__error {
  padding-top: 2px;
}
#customPlantform .ediAwardDialog .el-form-item__error {
  left: 78px;
}
#configPlatform .copy_blog .select_resouce .el-form-item__content {
  margin-left: 69px !important;
  width: 180px;
}
#configPlatform .copy_blog .el-input--suffix .el-input__inner {
  background: #ffffff;
}
#configPlatform .editNoteDialog .el-dialog__footer {
  padding: 30px 20px 30px 20px;
}
</style>

<style scoped lang="less">
#customPlantform {
  .default_plantform {
    width: 825px;
    min-height: 550px;
    background-color: #f5f5f5;
    border-radius: 8px;
    margin-left: 20px;
    padding: 0px 20px 20px 20px;
    overflow: hidden;
    position: relative;
    .two-set-btn {
      text-align: center;
    }
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
          background: #c3c3c3;
          overflow: hidden;
          .phone_body {
            width: 234px;
            height: 335px;
            padding-top: 1px;
            overflow-y: auto;
            overflow-x: hidden;
            position: relative;
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

              margin-top: 20px;
              margin-left: 35px;
              color: #fff;
              background: none;
              img {
                display: block;
                width: 100%;
                height: 100%;
              }
            }
            .exchange_phone {
              margin-top: 15px;
            }
            .plant_logo {
              width: 50px;
              height: 30px;
              position: absolute;
              top: 0px;
              left: 0px;
              z-index: 200;
              // background: rgba(0, 0, 0, 0.5);
              img {
                display: block;
                max-width: 100%;
                max-height: 100%;
                position: relative;
                top: 50%;
                left: 50%;
                // transform: translateY(-50%);
                transform: translateX(-50%) translateY(-50%);
              }
            }
            .customDialog {
              min-height: 185px;
              width: 230px;
              .awardTitleBg {
                width: 190px;
                height: 90px;
                padding-left: 20px;
                padding-top: 95px;
                background: url(../../../../assets/images/images/dialog0.png)
                  no-repeat 5px top;
                background-size: 210px 183px;
                .awardTitle {
                  width: 145px;
                  min-height: 30px;
                  // background-color: #fff;
                  border-radius: 6px;
                  color: red;
                  font-size: 16px;
                  padding: 10px 15px;
                  text-align: center;
                }
              }
              .customDialog_second {
                width: 185px;
                min-height: 85px;
                background: url(../../../../assets/images/images/dialog1.png)
                  no-repeat left 25px;
                background-size: 218px 160px;
                padding-top: 100px;
                padding-left: 45px;
                .awardTitle {
                  width: 125px;
                  min-height: 60px;
                  text-align: center;
                  color: #fff;
                }
              }
              .customDialog_threed {
                width: 195px;
                min-height: 60px;
                background: url(../../../../assets/images/images/dialog2.png)
                  no-repeat 10px 13px;
                background-size: 196px 172px;
                padding-top: 125px;
                padding-left: 35px;
                .awardTitle {
                  width: 140px;
                  min-height: 50px;
                  text-align: center;
                  color: #fff;
                }
              }
              .customDialog_four {
                width: 190px;
                min-height: 120px;
                background: url(../../../../assets/images/images/dialog3.png)
                  no-repeat 5px 35px;
                background-size: 208px 152px;
                padding-top: 60px;
                padding-left: 40px;
                .awardTitle {
                  width: 135px;
                  min-height: 30px;
                  text-align: center;
                  color: #2d303a;
                }
              }
              .customDialog_five {
                width: 190px;
                min-height: 70px;
                background: url(../../../../assets/images/images/dialog4.png)
                  no-repeat left 20px;
                background-size: 220px 152px;
                padding-top: 115px;
                padding-left: 40px;
                .awardTitle {
                  width: 140px;
                  min-height: 30px;
                  text-align: center;
                  color: #fff;
                }
              }
              .customDialog_six {
                width: 180px;
                min-height: 70px;
                background: url(../../../../assets/images/images/dialog5.png)
                  no-repeat left 30px;
                background-size: 217px 160px;
                padding-top: 115px;
                padding-left: 50px;
                .awardTitle {
                  width: 120px;
                  min-height: 30px;
                  text-align: center;
                  color: #fff;
                }
              }
            }
            .custom_input {
              margin-top: 60px;
            }
            .swiper_box {
              width: 215px;
              height: 100px;
              .swiper-container {
                width: 100%;
                height: 100%;
                .swiper-slide {
                  img {
                    display: block;
                    width: 100%;
                    height: 100%;
                  }
                }
              }
            }
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
          }
        }
        // .awardTitle {
        //     width: 150px;
        //     min-height: 30px;
        //     background-color: #fff;
        //     border-radius: 6px;
        //     color: red;
        //     margin-top: 90px;
        //     margin-left: 13px;
        //     font-size: 16px;
        //     padding: 10px 20px;
        //     text-align: center;
        // }
        // .phone_explain {
        //     width: 180px;
        //     min-height: 65px;
        //     background-color: #fff;
        //     border-radius: 6px;
        //     font-size: 10px;
        //     padding: 5px;
        //     color: #170058;
        //     margin-top: 10px;
        //     margin-left: 13px;
        // }
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
            cursor: pointer;
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
        min-height: 470px;
        padding: 25px 20px;
        .dialogStyle {
          .upBtn_list {
            margin: 10px 0px;
          }
        }
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
                margin-right: 25px;
                margin-left: 16px;
                .el-icon-view {
                  margin-right: 5px;
                  font-size: 16px;
                  margin-top: 3px;
                }
              }
              .preview:hover {
                color: #393c40;
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
        .upload_title {
          margin-bottom: 10px;
          span {
            color: #aaaeb3;
            i {
              color: #fc2125;
              padding-right: 5px;
            }
          }
        }
        .delect_BgImg {
          width: 20px;
          height: 20px;
          background: rgba(0, 0, 0, 0.4);
          text-align: right;
          line-height: 15px;
          color: #fff;
          font-size: 18px;
          position: absolute;
          top: 50px;
          left: 60px;
          border-bottom-left-radius: 20px;
          cursor: pointer;
        }
        .avatar-uploader {
          position: relative;
          width: 80px;
          height: 80px;
          border-radius: 4px; // text-align: center;
          line-height: 80px;
          border: dashed 1px #aaaeb3;
          font-size: 24px;
          // margin-bottom: 20px;
          .avatar {
            display: block;
            width: 100%;
            height: 100%;
          }
        }
        .upload_banner {
          // margin-top: 20px;
          // padding-bottom: 20px;
          overflow: hidden;
          .el-switch {
            float: left;
            display: block;
            margin-top: 10px;
            height: 22px;
          }
          .openBanner {
            float: left;
          }
          .positionBanner {
            margin: 0px 30px;
          }
        }
        .banner_size {
          width: 100%;
          text-align: right;
          font-size: 12px;
          margin-bottom: 10px;
        }
        .bannerList {
          ul {
            li {
              overflow: hidden;
              height: 60px;
              background-color: #f5f5f5;
              border-radius: 6px;
              margin-bottom: 20px;
              line-height: 60px;
              padding: 0px 10px;
              .banner_num {
                width: 20px;
                padding-right: 10px;
                font-size: 12px;
              }
              .banner_item {
                margin-bottom: 0px;
                margin-top: 10px;
                margin-right: 15px;
                .el-form-item__content {
                  float: left;
                  .avatar-uploader {
                    width: 118px;
                    height: 38px;
                    line-height: 40px;
                    font-size: 16px;
                    color: #aaaeb3;
                  }
                }
              }
              .banner_link_item {
                .el-form-item__content {
                  float: left;
                }
              }
              .banner_view {
                color: #f4a13e;
                cursor: pointer;
              }
            }
          }
        }
        .upBtn_title {
          line-height: 30px;
        }
        .upBtn_list {
          margin-top: 3px;
          // float: left;
          overflow: hidden;
          li {
            float: left;
            margin-bottom: 0px;
            width: 60px;
            height: 32px;
            background-color: #eae0ff;
            border-radius: 6px;
            text-align: center;
            line-height: 32px;
            font-size: 12px;
            color: #4a00e0;
            margin-right: 20px;
            cursor: pointer;
          }
          .selectedUpBtn {
            background-color: #4a00e0;
            color: #fff;
          }
        }
        .customBtn {
          margin-top: 20px;
          overflow: hidden;
          .upBtnNotice {
            float: left;
            line-height: 20px;
            color: #aaaeb3;
            margin-top: 10px;
            margin-left: 10px;
          }
          .upCustomBtn {
            float: left;
          }
        }
      }
    }

    .defaultPageNextBtn {
      position: absolute;
      bottom: 0px;
      width: 100%;
      left: 0px;
      text-align: center;
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
}
</style>
