<template>
  <div id="phoneNum">
    <div>
      <!-- 左侧手机预览 -->
      <div class="phoneImg">
        <h3>玛氏冲击波</h3>
        <div class="block-phone-img">
          <div class="phone-header">
            <p>{{actName}}</p>
          </div>
          <!--手机号＋上传 -->
          <div class="phone-box">
            <div v-if="isKefuOpen" class="kefu"></div>
            <div class="banner phone-banner">banner</div>
            <div class="two-xiaopiao">
              <img src="../../../../assets/images/images/demo.png" alt="上传小票">
              <img src="../../../../assets/images/images/upxiaopiao.png" alt="上传小票">
            </div>
            <div class="textarea phone-textarea">{{upExplain}}</div>
            <input class="write-phone-nmb" type="text" placeholder="请输入手机号">
            <button
              class="go-active-btn conform-btn"
              :class="[{sumberBtn:isSummer},{NewYearBtn:isNewYear}]"
            >确定</button>
            <button
              class="active-rules"
              :class="[{sumberRuls:isSummer},{NewYearRuls:isNewYear}]"
            >活动细则</button>
          </div>
        </div>
        <div class="tab-btn">
          <button class="pre-btn"></button>
          <span>1/4</span>
          <button class="next-btn"></button>
        </div>
      </div>
      <!-- 右侧信息配置 -->
      <div class="home-msg">
        <!-- 手机号+上传 -->
        <div class="home-configuration">
          <el-form
            :model="phoneNumForm"
            :rules="phoneNumRules"
            ref="phoneNumForm"
            class="indexHomeForm"
          >
            <el-form-item>
              <p class="img-title">
                背景图上传
                <span>
                  （
                  <i>*</i>点击上传图片，图片尺寸为750*1206）
                </span>
              </p>
              <el-upload
                class="avatar-uploader"
                :action="uploadUrl"
                :show-file-list="false"
                :on-success="handleSuccess"
                :data="uploadParam"
              >
                <img v-if="iconUrl" :src="iconUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="上传说明：" prop="upExplain">
              <el-switch
                v-model="phoneNumForm.upExplainValue"
                active-color="#13ce66"
                inactive-color="#AAAAAA"
              ></el-switch>
              <el-input
                v-if="phoneNumForm.upExplainValue"
                v-model="phoneNumForm.upExplain"
                maxlength="100"
                type="textarea"
                placeholder="请填写活动文案，不能超过100词"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <p class="img-title">
                小票示意图上传
                <span>（点击上传图片）</span>
              </p>
              <el-upload
                class="avatar-uploader"
                :action="receiptUploadUrl"
                :show-file-list="false"
                :on-success="receiptHandleSuccess"
                :data="receiptUploadParam"
              >
                <img v-if="receiptIconUrl" :src="receiptIconUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="参与规则设置：">
              <el-switch
                v-model="phoneNumForm.openRulesValue"
                active-color="#13ce66"
                inactive-color="#AAAAAA"
              ></el-switch>
            </el-form-item>
          </el-form>
          <div class="two-set-btn" v-if="!phoneNumForm.openRulesValue">
            <button class="pre-set-btn">配置上一项</button>
            <button class="next-set-btn">配置下一项</button>
          </div>
        </div>
      </div>
      <div class="clear"></div>
      <!-- 参与规则设置 -->
      <div class="participate-rules" v-if="phoneNumForm.openRulesValue">
        <p class="participate-rules-title">
          <i></i> 参与规则设置
        </p>
        <div class="participate-rules-set">
          <span>参与条件：</span>
          <label>每个</label>
          <select name id>
            <option value>手机号</option>
            <option value>手机号</option>
            <option value>手机号</option>
          </select>
          <select name id>
            <option value>每天</option>
            <option value>每月</option>
            <option value>每年</option>
          </select>
          <label>参与次数超过</label>
          <select name id>
            <option value>1次</option>
            <option value>2次</option>
            <option value>不限次数</option>
          </select>
          <label>禁止参与，</label>
          <label>提示文案</label>
          <button class="add-reminder-text">+提示文案</button>
          <label>推送渠道：当前页面</label>
          <span class="add-btn">添加</span>
        </div>
        <div class="has-rules">
          <p class="has-rules-title">
            <span>*</span>已设规则
          </p>
          <ul>
            <li>
              1.每个手机号每天参与活动次数超过2次 ，禁止参与，当前页面提示：每个手机号每日仅限两次，谢谢参与
              <button class="delete"></button>
            </li>
            <li>
              1.每个手机号每天参与活动次数超过2次 ，禁止参与，当前页面提示：每个手机号每日仅限两次，谢谢参与
              <button class="delete"></button>
            </li>
          </ul>
          <div class="two-set-btn">
            <button class="pre-set-btn">配置上一项</button>
            <button class="next-set-btn">配置下一项</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "phoneNum",
  components: {},
  props: {},
  data() {
    return {
      tabList: ["首页", "手机号＋上传", "抽奖", "其他设置"],
      // 活动名称
      actName: "活动名称",
      // 选择风格
      isSummer: false,
      isNewYear: false,
      // 上传背景图
      uploadUrl: "http://www.baidu.com/",
      uploadParam: {},
      iconUrl: "",

      // 上传小票示意图
      receiptUploadUrl: "",
      receiptUploadParam: {},
      receiptIconUrl: "",
      // 手机号+上传 表单
      phoneNumForm: {
        // 上传说明
        upExplain: "",
        // 上传说明 开关
        upExplainValue: true,
        // 参与规则设置  开关
        openRulesValue: true
      },
      // 手机号+上传 表单  验证
      phoneNumRules: {},

      isKefuOpen: true,
      // 上传说明
      upExplain: "",
      // 参与规则开关
      isOpenRules: false,
      value1: "",
      value2: ""
    };
  },
  mounted() {},
  methods: {
    //背景图 上传成功
    handleSuccess: function() {},
    //小票示意图 上传成功
    receiptHandleSuccess: function() {},
    openRulse: function() {}
  }
};
</script>
<style scoped>
@import "../../../../assets/css/setPage.css"; /*引入公共样式*/
</style>
