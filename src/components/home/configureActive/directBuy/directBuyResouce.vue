<template>
  <div id="directBuyResouce" v-loading="loadingFlag">
    <div class="resouce_header">
      <p class="resouce_title">资源配置</p>
      <div class="no_data" v-if="no_data">后台暂未分配资源</div>
      <div class="resouvce_tab">
        <ul>
          <li
            :class="{resouvceTabActive:tabActive ==tab.material_type_ename }"
            v-for="(tab,Tindex) in tabList"
            :key="Tindex"
            @click="tabActiveFun(tab.material_type_ename,tab.material_type_id)"
          >{{tab.material_type_name}}</li>
        </ul>
      </div>
      <!-- 红包类表单 -->
      <div class="resouce_form" v-if="false" key="1" v-loading="hongbaoLoading">
        <el-form :model="redPackageForm" ref="redPackageForm" :rules="rules1" label-width="90px">
          <el-form-item class="select_resouce" label="选择资源" prop="selectResouce">
            <el-select
              v-model="redPackageForm.selectResouce"
              placeholder="请选择资源"
              @change="changeRed"
            >
              <el-option
                v-for="(itemRed,indxRed) in redPackageForm.resouceItem"
                :key="indxRed"
                :label="itemRed.material_name"
                :value="itemRed.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="预设总额度">
            <div class="totle_money totleMoneyML">
              {{redPackageForm.allocation_count?redPackageForm.allocation_count+'元':'暂无'}}
              <span
                @click="adjustFun('1')"
                :title="adjustFormAlert.reason"
              >调整</span>
              <p>
                <i class="red_star">*</i>
                后台预设总额度：{{redPackageForm.allocation_count}}元
              </p>
            </div>
          </el-form-item>
          <el-form-item label="预警额度">
            <div class="totle_money limit">
              {{redPackageForm.warning_count?redPackageForm.warning_count+'元':'暂无'}}
              <span
                @click="adjustFun('2')"
              >调整</span>
              <p>
                <i class="red_star">*</i>
                后台预警额度：{{redPackageForm.warning_count}}元
              </p>
            </div>
          </el-form-item>
          <el-form-item label="所剩额度">
            <div class="totle_money">{{redPackageForm.balance}}</div>
          </el-form-item>
          <el-form-item label="红包设置" prop="setRedPackage1111">
            <div
              class="write_text red_package"
              :class="{noEmpty:redPackageFormAlert.redPackageFormAlertstring}"
              @click="setRedPackagefun"
            >{{redPackageFormAlert.redPackageFormAlertstring?this.redPackageFormAlert.redPackageFormAlertstring:'+红包设置'}}</div>
            <p class="rederro" v-if="redPackageFormAlert.iserror">请填写红包设置</p>
          </el-form-item>
          <el-form-item label="预警通知" prop="redwareNoticeNext111111">
            <div
              class="write_text"
              :title="redPackageForm.wareNotice"
              :class="{noEmpty:redPackageForm.wareNotice != ''}"
              @click="redWarnDialog"
            >{{redPackageForm.wareNotice == ''?'+选择通知':redPackageForm.wareNotice}}</div>
            <p class="rederro" v-if="redPackageFormAlert.redwareNoticeiseorr">请填写预警通知</p>
          </el-form-item>
          <div class="sing_red_package">
            <el-form-item class="money_input" label="单个红包金额" prop="singRedPackage">
              <el-input v-model="redPackageForm.singRedPackage" maxlength="7" placeholder="请填写金额"></el-input>
              <span class="yuan">元</span>
            </el-form-item>
            <el-form-item class="money_input" label="总额度" prop="totleMoney">
              <el-input v-model="redPackageForm.totleMoney" maxlength="7" placeholder="请填写金额"></el-input>
              <span class="yuan">元</span>
              <p class="preinstall_money">
                <span>*</span>不得大于所剩额度
              </p>
            </el-form-item>
            <el-form-item class="money_input yujingPrice" label="预警金额" prop="warnMoney">
              <el-input v-model.number="redPackageForm.warnMoney" maxlength="7" placeholder="请填写金额"></el-input>
              <span class="yuan">元</span>
              <p class="preinstall_money">
                <span>*</span>不得大于总额度
              </p>
            </el-form-item>
            <el-form-item class="red_yujin" label="预警通知" prop="wareNotice111111">
              <!-- 这里的通知的参数用的是卡密的 -->
              <div
                class="write_text red_package"
                :class="{noEmpty:resouceFormResources.wareNotice != ''}"
                @click="warnDialogTwo"
              >{{resouceFormResources.wareNotice == ''?'+选择通知':resouceFormResources.wareNotice}}</div>
              <p class="rederro" v-if="no_errow">请填写预警通知</p>
            </el-form-item>
            <el-button
              class="fr addbutton addPartment"
              title="增加"
              :loading="redaddloading"
              @click="redaddloading == false?submitEnvelopes():''"
              icon="el-icon-addPlus"
            >增加</el-button>
          </div>
        </el-form>
      </div>
      <!-- 卡密类表单 -->
      <div class="resouce_card" v-if="isKami || isZichong" key="2">
        <el-form
          :model="resouceFormResources"
          :rules="rules2"
          ref="resouceFormResources"
          label-width="80px"
        >
          <el-form-item class="select_resouce" label="选择资源" prop="resouceFormResourcestext">
            <el-select
              v-model="resouceFormResources.resouceFormResourcestext"
              placeholder="请选择资源"
              @change="changeResources"
            >
              <el-option
                v-for="(itemResources,indexResources) in resouceFormResources.resouceItem"
                :key="indexResources"
                :label="itemResources.material_name"
                :value="itemResources.id"
              ></el-option>
            </el-select>
            <p class="select_resouce_notice">
              <span class="red_star">*</span>
              {{materialName=="综合资源"?"总金额":"总数量"}}：{{resouceFormResources.tipAllocation_count}}
            </p>
          </el-form-item>
          <el-form-item class="select_resouce resouceGrant" label="发放形式" prop="grant">
            <el-select
              v-model="resouceFormResources.grant"
              style="height:32px"
              :disabled="zichongDisabled"
              placeholder="平台码发放"
              @change="changeDistribution"
            >
              <el-option label="平台码发放" value="1"></el-option>
              <el-option label="原始码发放" value="2"></el-option>
              <el-option v-if="tabActive== 'zichong'" label="直接充值" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发放时间" prop="grantTime" class="grantTime">
            <el-date-picker
              v-model="resouceFormResources.grantTime"
              type="datetime"
              placeholder="选择日期时间"
              @change="setDateTime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              default-time="12:00:00"
            ></el-date-picker>
            <p class="grantTimeError" v-show="isGrantTimeError">请选择发放时间</p>
          </el-form-item>
          <el-form-item label="名单导入" class="guideName">
            <div class="download">
              <el-tooltip
                effect="dark"
                :hide-after="2000"
                content="建议使用Office 2007及以上版本打开"
                placement="top"
              >
                <a :href="getDownload" target="view_window">模版下载</a>
              </el-tooltip>
            </div>
            <div class="upBtn">
              <el-tooltip
                effect="dark"
                :hide-after="2000"
                content="可将Excel文件拖拽到虚框内导入"
                placement="top"
              >
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
                  <el-button
                    slot="trigger"
                    size="small"
                    :loading="loadingloader"
                    type="primary"
                  >导入名单</el-button>
                </el-upload>
              </el-tooltip>
            </div>
            <p class="upBtn_notice">
              <span class="red_star">*</span>
              剩余数量：{{resouceFormResources.surplusCount}}
            </p>
          </el-form-item>
          <div class="lookNmList" @click="personNameFun">
            <i class="el-icon-view"></i>查看
          </div>
          <el-form-item label="导入名单数量:" prop="personNameNum" class="personNameNum">
            <div class="num">{{resouceFormResources.personNameNum}}</div>
          </el-form-item>
          <div style="height:40px;width:318px;float:left;margin-bottom:22px;">
            <el-form-item label="发放数量:" class="issueNum">
              <div class="num">{{resouceFormResources.issueNum}}</div>
            </el-form-item>
            <el-form-item label="发放金额:" class="issueNum">
              <div class="num">{{resouceFormResources.issueAmount}}</div>
            </el-form-item>
          </div>
          <div v-if="!isShowDirect">
            <el-form-item class="select_resouce" label="资源数量" prop="resouceNum">
              <el-input
                type="text"
                v-model="resouceFormResources.resouceNum"
                :disabled="true"
                placeholder="输入数量"
                maxlength="7"
              ></el-input>
              <div class="tipResouceNum">
                <p v-if="resouceFormResources.tipAllocation_count">
                  <i class="red_star">*</i>
                  后台的资源数量{{resouceFormResources.tipAllocation_count}}
                </p>
              </div>
            </el-form-item>
            <el-form-item class="select_resouce warning_num" label="预警数量" prop="warningNum">
              <el-input
                type="text"
                v-model="resouceFormResources.warningNum"
                placeholder="输入数量"
                maxlength="7"
              ></el-input>
            </el-form-item>
            <el-form-item class="select_resouce warn" label="预警通知">
              <div
                class="write_text"
                :class="{noEmpty:resouceFormResources.wareNotice != ''}"
                :title="resouceFormResources.wareNotice"
                @click="warnDialog"
              >{{!resouceFormResources.wareNotice == ''?resouceFormResources.wareNotice:'+选择通知'}}</div>
              <p v-if="no_errow" class="rederro">请选择预警通知</p>
            </el-form-item>
            <el-form-item class="select_resouce" label="短信文案">
              <div
                class="write_text"
                :class="{noEmpty:resouceFormResources.note}"
                :title="resouceFormResources.note"
                @click="noteDialog"
              >{{!resouceFormResources.note?'+编辑文案':resouceFormResources.note}}</div>
              <p v-if="no_messge" class="rederro">请填写短信文案</p>
            </el-form-item>
            <el-form-item
              v-if="resouceFormResources.grant == 1"
              class="select_resouce"
              label="奖品说明"
            >
              <div
                class="write_text"
                :class="{noEmpty:resouceFormResources.award != ''}"
                :title="resouceFormResources.award"
                @click="awardDialog"
              >{{resouceFormResources.award == ''?'+编辑文案':resouceFormResources.award}}</div>
              <p v-if="no_prize" class="rederro">请填写奖品说明</p>
            </el-form-item>
            <el-form-item
              v-if="resouceFormResources.grant == 1"
              class="xiao_time"
              label="有效时长"
              prop="time"
            >
              <template>
                <el-input-number
                  v-model="resouceFormResources.num1"
                  @change="handleChange"
                  :min="1"
                  label="天"
                ></el-input-number>
                <span>天</span>
              </template>
            </el-form-item>
          </div>
          <el-button
            class="fr addbutton addPartment"
            title="增加"
            :loading="addloading"
            @click="addloading == false?submitResouceForm():''"
            icon="el-icon-addPlus"
          >增加</el-button>
        </el-form>
      </div>
    </div>
    <!-- 已配置规则列表 -->
    <div class="resouce_table">
      <p class="resouce_title">已配置规则</p>
      <!-- <table class="resouce_table_list" border="0" cellspacing="0" cellpadding="0">
        <thead>
          <tr class="resouce_table_title">
            <th width="8%">序号</th>
            <th>资源类型</th>
            <th>资源名称</th>
            <th>icon</th>
            <th class="set_num">数量配置(个/张/元）</th>
            <th width="8%">发放形式</th>
            <th>短信文案</th>
            <th>奖品说明文案</th>
            <th width="8%">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="resouce_table_item"
            v-for="(itemallote,indexallot) in getallotlist"
            :key="indexallot"
          >
            <td
              width="8%"
            >{{(indexallot+1).toString().length == 1?'0'+(indexallot+1):(indexallot+1)}}</td>
            <td>{{itemallote.type_name}}</td>
            <td width="140px" :title="itemallote.app_material_name">
              <p>{{itemallote.app_material_name}}</p>
            </td>
            <td>
              <img :src="itemallote.icon" alt>
            </td>
            <td>
              {{itemallote.amount}}
              <br>
              <span v-if="itemallote.type_ename == 'hongbao'" class="star">
                <i>*</i>预设金额
              </span>
            </td>
            <td width="10%" title="平台码发放">
              <div v-if="itemallote.grant_type == 2">原始码发放</div>
              <div v-if="itemallote.grant_type == 1">平台码发放
                <br>
                有效时长{{itemallote.valid_duration}}天
              </div>
              <p v-if="!itemallote.valid_duration">— —</p>
            </td>
            <td width="110px" :title="itemallote.notices  | noticesBuil">
              <p>{{itemallote.notices | noticesBuil}}</p>
              <p v-if="!itemallote.notices">— —</p>
            </td>
            <td
              width="110px"
              :title="itemallote.prize_title + itemallote.prize_explain == '0'?'原始码没有奖品说明哦':'标题：'+itemallote.prize_title + '内容：'+itemallote.prize_explain | noticNext"
            >
              <p>{{itemallote.prize_title + itemallote.prize_explain == '0'?'— —':itemallote.prize_title + itemallote.prize_explain}}</p>
            </td>
            <td width="8%">
              <i class="el-icon-delete" @click="deleteFun(itemallote.id)" title="删除"></i>
            </td>
          </tr>
        </tbody>
      </table>-->
      <!-- Spring6 已配置规则列表-->
      <table class="resouce_table_list" border="0" cellspacing="0" cellpadding="0">
        <thead>
          <tr class="resouce_table_title">
            <th width="5%">序号</th>
            <th width="10%">资源类型</th>
            <th width="10%">资源名称</th>
            <th>icon</th>
            <th width="15%" class="set_num">数量配置(个/张)</th>
            <th width="10%">充值金额</th>
            <th width="16%">发放形式/时间</th>
            <th>短信文案</th>
            <th>奖品说明文案</th>
            <th width="5%">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="resouce_table_item"
            v-for="(itemallote,indexallot) in getallotlist"
            :key="indexallot"
          >
            <td>{{(indexallot+1).toString().length == 1?'0'+(indexallot+1):(indexallot+1)}}</td>
            <td>{{itemallote.type_name}}</td>
            <td :title="itemallote.app_material_name">
              <p>{{itemallote.app_material_name}}</p>
            </td>
            <td>
              <img :src="itemallote.icon" alt>
            </td>
            <td>
              {{itemallote.grant_type == 3?"无":itemallote.amount}}
              <br>
              <span v-if="itemallote.type_ename == 'hongbao'" class="star">
                <i>*</i>预设金额
              </span>
            </td>
            <td>{{itemallote.grant_type == 3?itemallote.amount:"无"}}</td>
            <td>
              <div v-if="itemallote.grant_type == 2">原始码发放</div>
              <div v-if="itemallote.grant_type == 1">平台码
                <br>
                有效时长{{itemallote.valid_duration}}天
                <br>
                {{itemallote.release_time}}
              </div>
              <div v-if="itemallote.grant_type == 3">直接充值
                <br>
                {{itemallote.release_time}}
              </div>
              <!-- <p v-if="!itemallote.valid_duration">— —</p> -->
            </td>
            <td :title="itemallote.notices  | noticesBuil">
              <p>{{itemallote.notices | noticesBuil}}</p>
              <p v-if="!itemallote.notices">无</p>
            </td>
            <td
              v-if="itemallote.grant_type != 3"
              :title="itemallote.prize_title + itemallote.prize_explain == '0'?'原始码没有奖品说明哦':'标题：'+itemallote.prize_title + '内容：'+itemallote.prize_explain | noticNext"
            >
              <p>{{itemallote.prize_title + itemallote.prize_explain == '0'?'无需填写':itemallote.prize_title + itemallote.prize_explain}}</p>
            </td>
            <td v-if="itemallote.grant_type == 3" title="无">
              <p>无</p>
            </td>
            <td>
              <i class="el-icon-delete" @click="deleteFun(itemallote.id)" title="删除"></i>
            </td>
          </tr>
        </tbody>
      </table>
      <p class="nodata_tip" v-if="nodata_tip">暂无数据</p>
    </div>
    <!-- 上一步   下一步 -->
    <div class="step-btn">
      <button class="last-step" @click="prev">上一步</button>
      <button class="next-btn" @click="arrayListon?setPage():preview()">下一步</button>
    </div>
    <!-- 短信文案编辑 弹框 -->
    <el-dialog class="editNoteDialog" title="短信文案编辑" :visible.sync="showNoteDialog">
      <el-form :model="noteForm" :rules="rules3" ref="noteFormrules3" @submit.native.prevent>
        <div v-if="resouceFormResources.grant == 1">
          <el-form-item prop="sendType" label="发放形式：" class="sendType">
            <el-radio-group v-model="noteForm.sendType">
              <el-radio :label="1">
                正常发放
                <span class="normal_star">*</span> 兑换码在短信中显示，19位数，不可复制
              </el-radio>
              <el-radio :label="2">
                简化发放
                <span class="normal_star">*</span> 短信不包含兑换码，兑换码在H5页面自动显示，用户只需填写手机号
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="noteDialogContent">
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
          <div class="reouce_code" v-if="resouceFormResources.grant == 2">
            <span class="noCheckCode" :class="{'originalCode':isShowCode}" @click="checkedCode(1)">
              <i v-if="isShowCode"></i>
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
          <!-- 平台码 需要去某某平台兑换 -->
          <div class="reouce_code" v-if="resouceFormResources.grant == 1">
            <span v-if="noteForm.sendType==1">{code}</span>
            <el-form-item prop="textThree">
              <el-input
                type="text"
                v-model="noteForm.textThree"
                auto-complete="off"
                maxlength
                placeholder="上某某"
              ></el-input>
            </el-form-item>
            <span>{{linkCode}}</span>
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
      <div class="official">
        <p>
          <span>*</span>文案预览
        </p>
        <div class="official_look">
          【{{noteForm.msgTable}}】
          {{noteForm.textOne}}
          <span
            v-if="resouceFormResources.grant ==2"
          >
            <i v-if="isShowCode">{code}</i>
            {{noteForm.textFour}}
            <i v-if="isShowKey">{key}</i>
          </span>
          <span v-if="resouceFormResources.grant==1">{{ noteForm.sendType== 2?'':'{code}'}}</span>
          {{resouceFormResources.grant == 1?noteForm.textThree:noteForm.textThree}}
          {{resouceFormResources.grant == 2?'':linkCode}}
          {{noteForm.textTwo}}
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showNoteDialog = false">取 消</el-button>
        <el-button type="primary" @click="NoteForm()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 奖品说明编辑 弹框 -->
    <el-dialog class="ediAwardDialog" title="奖品说明编辑" :visible.sync="showAwardDialog">
      <el-form
        :model="awardForm"
        :rules="rules4"
        ref="awardForm"
        @submit.native.prevent
        label-width="80px"
      >
        <el-form-item prop="title" label="中奖标题">
          <el-input
            type="text"
            v-model="awardForm.title"
            auto-complete="off"
            maxlength="12"
            placeholder="示例：恭喜您获得爱奇艺月卡"
          ></el-input>
        </el-form-item>
        <el-form-item prop="explain" label="奖品说明">
          <el-input
            type="textarea"
            v-model="awardForm.explain"
            auto-complete="off"
            maxlength="500"
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
    <!-- 预警通知的弹框 -->
    <el-dialog class="ediAwardDialog warn_dialog" title="预警通知" :visible.sync="showWarndDialog">
      <el-form :model="awardFormalert" :rules="rules5" ref="warningForm" @submit.native.prevent>
        <el-form-item prop="radio2">
          <el-radio-group v-model="awardFormalert.radio2" @change="radio2change">
            <el-radio
              v-if="tabActive != 'hongbao'"
              v-for="(itemarryList,indexarryList) in awardFormalert.arryList"
              :key="indexarryList"
              :label="itemarryList.dic_ename"
            >{{[itemarryList.dic_cname,resouceFormResources.warningNum,tabActive] | arryListStr}}</el-radio>

            <el-radio
              v-if="tabActive == 'hongbao'"
              v-for="(itemarryList,indexarryList) in awardFormalert.arryList"
              :key="indexarryList"
              :label="itemarryList.dic_ename"
            >{{[itemarryList.dic_cname,redPackageForm.warnMoney] | arryListStr}}</el-radio>
            <!-- <el-radio :label="2">达到1000元预警额度邮件提醒自己和上级</el-radio>
                        <el-radio :label="3">达到1000元预警额度短信提醒自己</el-radio>
            <el-radio :label="4">达到1000元预警额度短信提醒自己和上级</el-radio>-->
            <el-radio :label="5" class="customRadio">
              <el-input
                :disabled="awardFormalert.disabled"
                v-model="awardFormalert.input"
                @keyup.enter.native="addwaremails()"
                type="text"
                placeholder="自定义提醒：请填写要发送的邮箱且点击回车"
              ></el-input>
              <p class="eorrtip" v-if="awardFormalert.istextTip">{{awardFormalert.textTip}}</p>
              <el-button
                class="fr addbutton addEmli"
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
          {{resouceFormResources.waremails.length>0?'已添加邮箱':'上面输入框可自定义添加邮箱'}}
        </p>
        <div class="emile_list">
          <ul>
            <!-- <li title="yuanhui@esmartwave.comyuanhui@esmartwave.com">yuanhui@esmartwave.comyuanhui@esmartwave.com
                            <i class="el-icon-close"></i>
            </li>-->
            <li
              v-for="(itememail,indexemail) in resouceFormResources.waremails"
              :key="indexemail"
              :title="itememail"
            >
              {{itememail}}
              <i class="el-icon-close" @click="deleteemails(indexemail)"></i>
            </li>
            <!-- <li title="yuanhui@esmartwave.com">yuanhui@esmartwave.com
                            <i class="el-icon-close"></i>
            </li>-->
          </ul>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelearly()">取 消</el-button>
        <el-button type="primary" @click="awardFormalertquery()">确 定</el-button>
      </div>
    </el-dialog>

    <!--红包预警通知的弹框 -->
    <el-dialog class="ediAwardDialog warn_dialog" title="预警通知" :visible.sync="redshowWarndDialog">
      <el-form
        :model="redawardFormalert"
        :rules="rulesRed1"
        ref="redwarningForm"
        @submit.native.prevent
      >
        <el-form-item prop="radio2">
          <el-radio-group v-model="redawardFormalert.radio2" @change="redRadio2change">
            <el-radio
              v-for="(itemarryList,indexarryList) in redawardFormalert.arryList"
              :key="indexarryList"
              :label="itemarryList.dic_ename"
            >{{[itemarryList.dic_cname,redPackageForm.warning_count] | arryListStr}}</el-radio>
            <!-- <el-radio :label="2">达到1000元预警额度邮件提醒自己和上级</el-radio>
                        <el-radio :label="3">达到1000元预警额度短信提醒自己</el-radio>
            <el-radio :label="4">达到1000元预警额度短信提醒自己和上级</el-radio>-->
            <el-radio :label="5">
              <el-input
                :disabled="redawardFormalert.disabled"
                v-model="redawardFormalert.input"
                @keyup.enter.native="redAddwaremails()"
                type="text"
                placeholder="自定义提醒：请填写要发送的邮箱且点击回车"
              ></el-input>
              <p class="eorrtip" v-if="redawardFormalert.istextTip">{{redawardFormalert.textTip}}</p>
              <el-button class="fr addbutton addEmli" title="增加" @click="redAddwaremails">增加</el-button>
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div class="add_emile">
        <p>
          <i>*</i>
          {{redPackageForm.waremails.length>0?'已添加邮箱':'上面输入框可自定义添加邮箱'}}
        </p>
        <div class="emile_list">
          <ul>
            <!-- <li title="yuanhui@esmartwave.comyuanhui@esmartwave.com">yuanhui@esmartwave.comyuanhui@esmartwave.com
                            <i class="el-icon-close"></i>
            </li>-->
            <li
              v-for="(itememail,indexemail) in redPackageForm.waremails"
              :key="indexemail"
              :title="itememail"
            >
              {{itememail}}
              <i class="el-icon-close" @click="redeleteemails(indexemail)"></i>
            </li>
            <!-- <li title="yuanhui@esmartwave.com">yuanhui@esmartwave.com
                            <i class="el-icon-close"></i>
            </li>-->
          </ul>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="redshowWarndDialog = false">取 消</el-button>
        <el-button type="primary" @click="redAwardFormalertquery()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 调整金额  弹框 -->
    <el-dialog class="AdjustDialog" title="调整金额" :visible.sync="showAdjustDialog">
      <el-form
        :model="adjustFormAlert"
        :rules="rules6"
        ref="adjustFormAlert"
        @submit.native.prevent
        label-width="135px"
      >
        <div class="AdjustText clearfix">
          <!-- <p>后台所设总金额为{{total?redPackageForm.allocation_count:redPackageForm.warning_count }}元</p> -->
          <p>{{this.total?'当前预设总额度为'+redPackageForm.allocation_count:'后台所设预警总金额度为'+redPackageForm.allocation_count }}元</p>

          <el-form-item
            class="Adjust_totle_price fl"
            :label="this.total?'调整额度至':'调整预警额度至'"
            prop="adjustMoney"
          >
            <el-input v-model="adjustFormAlert.adjustMoney" placeholder="请填写金额"></el-input>
            <span class="yuan">元</span>
            <p class="preinstall_money" v-if="!this.total">
              <span>*</span>不得大于预设总额度
            </p>
          </el-form-item>
        </div>
        <el-form-item class="adjust_reason" prop="reason" :label="this.total?'调整额度理由':'调整预设额度理由'">
          <el-input
            type="textarea"
            v-model="adjustFormAlert.reason"
            auto-complete="off"
            maxlength="400"
            placeholder="请填写调整额度理由"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAdjustDialog = false">取 消</el-button>
        <el-button type="primary" @click="adjustFormSubmit()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 红包设置  弹框 -->
    <el-dialog
      class="ediAwardDialog redPackageDialog"
      title="红包设置"
      :visible.sync="showRedPackageDialog"
    >
      <el-form
        :model="redPackageFormAlert"
        :rules="rules7 "
        ref="redPackageFormAlert"
        @submit.native.prevent
        label-width="80px"
      >
        <el-form-item prop="activeName" label="活动名称">
          <el-input
            type="text"
            v-model="redPackageFormAlert.activeName"
            auto-complete="off"
            placeholder="请输入活动名称"
          ></el-input>
        </el-form-item>
        <el-form-item prop="commercialName" label="商户名称">
          <el-input
            type="text"
            v-model="redPackageFormAlert.commercialName"
            auto-complete="off"
            placeholder="请输入商户名称"
          ></el-input>
        </el-form-item>
        <el-form-item prop="congratulation" label="红包祝福">
          <el-input
            type="textarea"
            v-model="redPackageFormAlert.congratulation"
            auto-complete="off"
            placeholder="请输入红包祝福"
          ></el-input>
        </el-form-item>
        <el-form-item class="redRemark" prop="remark" label="备注">
          <el-input
            type="textarea"
            v-model="redPackageFormAlert.remark"
            auto-complete="off"
            placeholder="请输入备注"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showRedPackageDialog = false">取 消</el-button>
        <el-button type="primary" @click="redPackageFormSubmit()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 查看名单  弹框 -->
    <el-dialog class="ediAwardDialog showNameListDialog" title="派发名单" :visible.sync="showNameList">
      <div class="batchListTitle">
        <span></span>
        {{materialName}}
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
              发放资源数量：{{materialName=="综合资源"?"无":batchDataTop.material_count}}
            </span>
            <span class="batch_msg_price">
              <i></i>
              充值金额：{{materialName=="综合资源"?batchDataTop.material_count:"无"}}
            </span>
          </div>
        </div>
        <p class="batch_msg_time">
          <i></i>
          发放时间：{{resouceFormResources.grantTime}}
        </p>
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
              <td>{{materialName=="综合资源"?"无":itemNum.user_count}}</td>
              <td>{{materialName=="综合资源"?itemNum.user_count:"无"}}</td>
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
    <saas-dialog :html="html" v-if="showSaasDialog"></saas-dialog>
  </div>
</template>
<script>
import { httpServer, apiSetting } from "../../../../assets/js/http.js";
import page from "../../../../assets/js/page.js";
import { throws } from "assert";

const saasDialog = () =>
  import(/* webpackChunkName:"dialog" */ "../../../dialog/dialog");
export default {
  name: "directBuyResouce",
  props: {
    stepModel: null
  },
  components: {
    saasDialog
  },
  data() {
    return {
      // 短信文案  选择code
      isShowCode: true,
      // 短信文案  选择key
      isShowKey: true,
      originalCodeText: "",
      platformCodeText: "",
      isShowDirect: false, //是否是直接充值
      tabList: ["红包类", "直冲类", "卡密类"],
      tabActive: "",
      isHongbao: false, // 是否是红包配置的标识
      isKami: false,
      isZichong: false,
      mid_direct_batch_id: "", //上传成功返回的id，增加资源的时候带过去
      material_type_id: 0, //选中的tabid
      appid: "1041939124325584896",
      template_id: "",
      seachValue: "", //主页的搜索响应式
      seachclick_close: false, //主页的搜索按钮叉号
      itemListloading: true, //如果列表正在请求中分页就不能触发，不然会有bug
      page: page,
      hongbaoLoading: true, //红包的上部分遮罩
      no_data: false, //没有资源配置的时候暂无数据的时候显示
      material_id: "", //资源id
      zichongDisabled: false, //直充不允许选择发放类型
      material_idArray: [], //已配置列表的资源id的数组
      isGrantTimeError: false,
      // fileList:{},
      redPackageForm: {
        // 红包类
        selectResouce: "", //被选中的资源id
        resouceItem: [], //资源渲染
        warningPrice: "", // 预警额度
        totleWarningPrice: "", // 预设总额度
        // residue: "", //所剩额度
        balance: "", //余额
        setRedPackage: "", //红包设置
        warnNotice: "", //预警通知
        singRedPackage: "", //单个红包金额
        totleMoney: "", // //总额度
        warnMoney: "", //预警金额
        wareNotice: "", //预警通知 我是默认值
        waremails: [],
        wareNoticeNext: "", //预警通知
        allocation_count: "", //预警总额度
        allocation_count_id: "", //预警总额度id
        warning_count: "" //预警额度
      },
      resouceFormResources: {
        //卡密类
        resouceFormResourcestext: "", //被选中的资源id
        resouceItem: [], //资源渲染
        money: "", //预设金额
        resouceNum: "", //资源数量
        grant: "1", // 发放形式 平台grant=1，原始grant=2   直接发放grant=3
        warningNum: "", // 预警数量
        wareNotice: "", //预警通知
        waremails: [],
        note: "", //短信文案
        award: "", //奖品说明
        time: "",
        num1: 1, // 有效时长的值
        tipAllocation_count: "", //卡密的后台带过来的数据
        surplusCount: "", //剩余数量
        personNameNum: 0, //导入名单数量
        grantTime: "", //发放时间
        issueNum: "0", //发放数量
        issueAmount: "无" //发放金额
      },
      rules1: {
        selectResouce: [
          {
            required: true,
            message: "请选择资源",
            trigger: "change"
          }
        ],
        residue: [
          {
            required: true,
            message: "请选择资源",
            trigger: "change"
          }
        ],
        setRedPackage: [
          {
            required: true,
            message: "请填写红包设置",
            trigger: "change"
          }
        ],
        singRedPackage: [
          {
            required: true,
            message: "请输入单个红包金额",
            trigger: "change"
          },
          {
            pattern: /^[0-9]*$/,
            message: "请输入纯数字的预警金额"
          },
          {
            validator: (rule, value, callback) => {
              if (this.redPackageForm.totleMoney == "") {
                if (value > parseFloat(this.redPackageForm.balance)) {
                  callback(new Error("*不得大于所剩额度"));
                } else {
                  callback();
                }
              }

              if (parseFloat(this.redPackageForm.totleMoney)) {
                if (value > parseFloat(this.redPackageForm.totleMoney)) {
                  callback(new Error("*不得总额度"));
                } else {
                  callback();
                }
              }
            },
            trigger: "change"
          }
        ],
        totleMoney: [
          {
            required: true,
            message: "请输入总额度",
            trigger: "change"
          },
          {
            pattern: /^[0-9]*$/,
            message: "请输入纯数字的预警金额"
          },
          {
            validator: (rule, value, callback) => {
              if (value > parseFloat(this.redPackageForm.balance)) {
                callback(new Error("*不得大于所剩额度"));
              } else {
                callback();
              }
            },
            trigger: "change"
          }
        ],
        warnMoney: [
          {
            required: true,
            message: "请输入预警金额",
            trigger: "change"
          },
          {
            pattern: /^[0-9]*$/,
            message: "请输入纯数字的预警金额"
          },
          {
            validator: (rule, value, callback) => {
              if (value > parseFloat(this.redPackageForm.totleMoney)) {
                callback(new Error("*不得大于总额度"));
              } else {
                callback();
              }
            },
            trigger: "change"
          }
        ],
        wareNoticeNext: [
          {
            required: true,
            message: "请填写预警通知",
            trigger: "change"
          }
        ],
        wareNotice: [
          {
            required: true,
            message: "请填写预警通知222",
            trigger: "change"
          }
        ],
        redwareNoticeNext: [
          {
            required: true,
            message: "请填写预警通知",
            trigger: "change"
          }
        ],
        setRedPackage1111: [],
        redwareNoticeNext111111: [],
        wareNotice111111: []
      }, // 资源配置表单验证
      rules2: {
        resouceFormResourcestext: [
          {
            required: true,
            message: "请选择资源",
            trigger: "change"
          }
        ],
        grantTime: [
          {
            required: true,
            message: "请选择发放时间",
            trigger: "change"
          }
        ],
        resouceNum: [
          {
            required: true,
            message: "请输入资源数量",
            trigger: "change"
          },
          {
            pattern: /^[0-9]*$/,
            message: "请输入纯数字"
          },
          {
            validator: (rule, value, callback) => {
              if (
                value >
                parseFloat(this.resouceFormResources.tipAllocation_count)
              ) {
                callback(new Error("不能大于后台的资源数量"));
              } else {
                callback();
              }
            },
            trigger: "change"
          }
        ],
        warningNum: [
          {
            required: true,
            message: "请输入预警数量",
            trigger: "change"
          },
          {
            pattern: /^[0-9]*$/,
            message: "请输入纯数字的预警数量"
          },
          {
            validator: (rule, value, callback) => {
              if (value > parseFloat(this.resouceFormResources.resouceNum)) {
                callback(new Error("*不得大于资源数量"));
              } else if (value <= 0) {
                callback(new Error("*数量不得小于1"));
              } else {
                callback();
              }
            },
            trigger: "change"
          }
        ],
        grant: [],
        time: [],
        wareNotice: [
          {
            required: true,
            message: "请选择预警通知",
            trigger: "change"
          }
        ],
        note: [
          {
            required: true,
            message: "请输入短信文案",
            trigger: "change"
          }
        ],
        award: [
          {
            required: true,
            message: "请输入奖品信息",
            trigger: "change"
          }
        ]
      },
      rules3: {
        textOne: [
          {
            required: true,
            message: "请输入文案",
            trigger: "change"
          }
          // {
          //   pattern: /^[《》【】π%％_\{\}\"\.@\-\s\[\]\r\\n\/,，:：！？“”、；。（\\）/a-zA-Z0-9\u4e00-\u9fa5]{0,}$/,
          //   message: "文案中包含非法字符"
          // },
        ],
        textTwo: [
          {
            required: true,
            message: "请输入文案",
            trigger: "change"
          }
          // {
          //   pattern: /^[《》【】π%％_\{\}\"\.@\-\s\[\]\r\\n\/,，:：！？“”、；。（\\）/a-zA-Z0-9\u4e00-\u9fa5]{0,}$/,
          //   message: "文案中包含非法字符"
          // },
        ],
        textThree: [
          {
            required: true,
            message: "请输入文案",
            trigger: "change"
          }
          // {
          //   pattern: /^[《》【】π%％_\{\}\"\.@\-\s\[\]\r\\n\/,，:：！？“”、；。（\\）/a-zA-Z0-9\u4e00-\u9fa5]{0,}$/,
          //   message: "文案中包含非法字符"
          // },
        ],
        textFour: [
          // {
          //   required: true,
          //   message: "请输入文案",
          //   trigger: "change"
          // },
          // {
          //   pattern: /^[《》【】π%％_\{\}\"\.@\-\s\[\]\r\\n\/,，:：！？“”、；。（\\）/a-zA-Z0-9\u4e00-\u9fa5]{0,}$/,
          //   message: "文案中包含非法字符"
          // },
        ],
        msgTable: [
          {
            required: true,
            message: "请输入短信标签",
            trigger: "change"
          }
          //  {
          //   validator: (rule, value, callback) => {
          //     if (value > parseFloat(this.resouceFormResources.resouceNum)) {
          //       callback(new Error("*不得大于资源数量"));
          //     } else if (value <= 0) {
          //       callback(new Error("*数量不得小于1"));
          //     } else {
          //       callback();
          //     }
          //   },
          //   trigger: "change"
          // }
          //  {
          //   pattern: /^[《》【】π%％_\{\}\"\.@\-\s\[\]\r\\n\/,，:：！？“”、；。（\\）/a-zA-Z0-9\u4e00-\u9fa5]{0,}$/,
          //   message: "文案中包含非法字符"
          // },
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
      rules5: {
        radio2: [
          {
            required: true,
            message: "请选择或填写预警通知的邮箱",
            trigger: "change"
          }
        ],
        mail: [
          {
            required: true,
            message: "*请输入邮箱地址",
            trigger: "change"
          },
          {
            type: "email",
            message: "*请输入正确的邮箱地址",
            trigger: ["blur"]
          }
        ]
      },
      rulesRed1: {
        radio2: [
          {
            required: true,
            message: "请选择或填写预警通知的邮箱",
            trigger: "change"
          }
        ],
        mail: [
          {
            required: true,
            message: "*请输入邮箱地址",
            trigger: "change"
          },
          {
            type: "email",
            message: "*请输入正确的邮箱地址",
            trigger: ["blur"]
          }
        ]
      },
      //  短信文案编辑 弹框
      showNoteDialog: false, //  短信文案编辑 弹框是否显示
      noteForm: {
        // 短信文案编辑表单 数据
        textOne: "",
        textTwo: "",
        textThree: "",
        textFour: "",
        msgTable: "",
        sendType: 1
      },
      isYanshima: true, // 是原始码还是平台码的短信
      linkCode: "兑奖平台{链接}", //
      //  奖品说明编辑 弹框
      showAwardDialog: false,
      awardForm: {
        // 奖品文案编辑表单 数据
        title: "",
        explain: ""
      },
      awardFormalert: {
        radio2: "", // 单选按钮   选中的值
        disabled: true, //如果选择自定义才可以输入，
        input: "", //预警通知弹窗的input追加邮箱的相应绑定
        textTip: "",
        arryList: [],
        istextTip: false
      },
      redawardFormalert: {
        radio2: "", // 单选按钮   选中的值
        disabled: true, //如果选择自定义才可以输入，
        input: "", //预警通知弹窗的input追加邮箱的相应绑定
        textTip: "",
        arryList: [],
        istextTip: false
      },
      configResouce: {
        step: 2, //返回上一步是2，下一步是3
        isshow: true,
        shownum: 1
      },
      // 预警通知  弹框
      showWarndDialog: false,
      redshowWarndDialog: false, //红包的预警通知
      // 调整额度 弹框
      showAdjustDialog: false,
      adjustFormAlert: {
        //公共
        adjustMoney: "",
        reason: "" // 理由
      },
      adjustFormAlerttotal: {
        //预设总额度
        adjustMoney: "",
        reason: "" // 理由
      },
      adjustFormAlertbale: {
        //预警额度
        adjustMoney: "",
        reason: "" // 理由
      },
      rules6: {
        adjustMoney: [
          {
            required: true,
            message: "请调整预警额",
            trigger: "change"
          },
          {
            pattern: /^[0-9]*$/,
            message: "请输入纯数字的预警额"
          },
          {
            validator: (rule, value, callback) => {
              if (!this.total) {
                if (value > parseFloat(this.redPackageForm.allocation_count)) {
                  callback(new Error("*不得大于预设总额度"));
                } else {
                  callback();
                }
              } else {
                callback();
              }
            },
            trigger: "change"
          }
        ],
        reason: [
          {
            required: true,
            message: "请填写调整的额度理由",
            trigger: "change"
          }
        ]
      },
      // 红包设置  弹框
      showRedPackageDialog: false,
      redPackageFormAlert: {
        redPackageFormAlertstring: "",
        iserror: false,
        redwareNoticeiseorr: false, //总的预警通知的错误提示
        redyujinerro: false, //单个红包预警
        activeName: "", //活动名称
        commercialName: "", // 商户名称
        congratulation: "", // 红包祝福
        remark: "" // 备注
      },

      rules7: {
        activeName: [
          {
            required: true,
            message: "请输入活动名称",
            trigger: "change"
          }
        ],
        commercialName: [
          {
            required: true,
            message: "请输入商户名称",
            trigger: "change"
          }
        ],
        congratulation: [
          {
            required: true,
            message: "请输入红包祝福",
            trigger: "change"
          }
        ],
        remark: [
          {
            required: true,
            message: "请输入备注",
            trigger: "change"
          }
        ]
      },
      loadingFlag: true,
      getallotlist: "",
      html: "",
      showSaasDialog: false,
      nodata_tip: false, //已配置规则没有数据的时候显示
      total: false, //判断点击调整的时候，是预设总额度，还是预警额度
      arrayList: [],
      arrayListon: true, //ture包含该平台码，false不包含平台码
      no_errow: false, //卡密类的预警通知验证
      no_messge: false, //卡密类短信文案的验证
      no_prize: false, //卡密类奖品说明的验证
      addloading: false, //卡密类增加按钮loading
      redaddloading: false, //红包类的
      uploadParam: {
        app_id: "", //项目id
        template_id: "", //中台模板id
        material_id: "", //资源id
        material_type_id: "", //资源类型id
        grant_type: "1"
        // validityday: "",
      },
      getDownload: apiSetting.getDownload.url, //Excel模板下载
      loadingloader: false, //上传按钮loading开关
      // 查看名单列表
      NameList_table_list: {}, //查看名单li
      showNameList: false,
      batchList: {},
      batchDataTop: {
        user_count: "",
        material_count: "",
        release_time: ""
      },
      audit_status: "",
      batchDataSelcet: 0,
      batchDataSelcetId: "", //批次号
      loadingNameList: false,
      materialName: "", //选择的资源名称
      materialCount: "0" //发放数量
    };
  },
  filters: {
    //过滤器
    noticesBuil(val) {
      if (val) {
        return (
          JSON.parse(val).title +
          JSON.parse(val).shorturl +
          JSON.parse(val).content
        );
      }
    },
    arryListStr: function([val, warningNum, tabActive]) {
      if (val) {
        if (tabActive == "kami" || tabActive == "zichong") {
          return val
            .replace("{0}", warningNum + "   ")
            .replace("预警额度", "预警数量");
        } else {
          return val.replace("{0}", warningNum + "   ");
        }
      }
    },
    noticNext(val) {
      if (val) {
        var reg = new RegExp("<br/>", "g");
        let str = val.replace(reg, "\n");
        return str;
      }
    }
  },

  mounted() {
    window.scrollTo(0, 0);
    // alert(this.stepModel.type_ename);
    console.log("父组建的参数");

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
    apiSetting.getDirectUserList.page = this.page; //api接口分页赋值
    apiSetting.getDirectUserList.dataList = this.dataList; //api分页数据赋值
    // console.log(this.stepModel);
    // if (this.stepModel.appid == 0) {
    //     console.log(this.stepModel);
    //     return false;
    // }
    this.template_id = this.$getsessionStorage("template_id"); //上一层传过来的模板赋值
    this.uploadParam.template_id = this.$getsessionStorage("template_id");
    this.uploadParam.app_id = this.$getsessionStorage("appid");

    console.log("templae");
    console.log(this.template_id);
    this.appid = this.$getsessionStorage("appid");
    this.getTypelist();
    this.getMaterialallotlist();
  },
  computed: {
    headers() {
      return {
        Authorization: "Bearer " + this.getCookie("Authorization")
      };
    }
  },
  methods: {
    // 短信文案 选择code或者key
    checkedCode(num) {
      if (num == 1) {
        this.isShowCode = !this.isShowCode;
        if (!this.isShowKey) {
          this.isShowKey = true;
        }
      } else if (num == 2) {
        this.isShowKey = !this.isShowKey;
        if (!this.isShowCode) {
          this.isShowCode = true;
        }
      }
    },
    handlePreview() {
      console.log("kkkkkkk");
    },
    handleRemove() {
      console.log("hhhhh");
    },
    beforeupload() {
      console.log("ssss");
    },
    beforeAvatarUpload(file) {
      console.log("klklkl");
      if (this.resouceFormResources.resouceFormResourcestext == "") {
        this.$message({
          message: "必须先选择资源",
          duration: 1000
        });
        return false;
      } else {
        this.loadingloader = true;
      }
      /**
       * todo:csw：不要删除前端验证上传文件的格式是否是Excel
       *  */
      //   --------start---------
      //   const isText = file.type === "application/vnd.ms-excel";
      //   const isTextComputer =
      //     file.type ===
      //     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      //   // 在上传之前的钩子里 判断上传的格式是否正确
      //   if (isTextComputer || isText) {
      //     // 这里判断 是Excel文档
      //   } else {
      //     this.$message({
      //       message: "只能上传Excel格式文档",
      //       duration: 1000
      //     });
      //     this.loadingloader = false;
      //     return false;
      //   }
      //   --------end---------
    },
    //上传成功的回调
    uploadSuccess(response, file, fileList) {
      this.resouceFormResources.personNameNum = response.user_count; //上传成功的数量
      this.mid_direct_batch_id = response.id; //成功后的id增加资源的时候带过去
      this.materialCount = response.material_count;
      this.resouceFormResources.surplusCount = response.surplus_count; //剩余数量
      if (this.materialName == "综合资源") {
        this.resouceFormResources.issueNum = "无";
        this.resouceFormResources.issueAmount = response.material_count;
      } else {
        this.resouceFormResources.issueNum = response.material_count;
        this.resouceFormResources.issueAmount = "无";
      }
      this.html = "<p>名单导入成功</p>";
      this.showSaasDialog = true;
      let _this = this;
      let timer = setTimeout(function() {
        _this.showSaasDialog = false;
      }, 500);
      this.loadingloader = false;
      console.log("上传成功的回调");
    },
    // 上传失败的回调
    uploaderror(err, file, fileList) {
      this.$message({
        message: JSON.parse(err.message).message,
        duration: 4000
      });
      this.loadingloader = false;
    },
    upChange(file) {
      console.log("ggggggg");
      console.log(file);
    },
    // 查看 导入的名单
    personNameFun() {
      if (this.resouceFormResources.personNameNum <= 0) {
        this.$message({
          message: "必须先导入名单",
          duration: 1000
        });
        return false;
      } else if (this.resouceFormResources.grantTime == "") {
        this.$message({
          message: "请选择发放时间",
          duration: 1000
        });
        return false;
      } else {
        // 查看名单
        this.batchDataSelcet = 0;
        this.page.pageIndex = 1;
        this.showNameList = true; //先弹出弹框再获取列表，以防获取名单列表出错，弹框也不出来
        this.getDirectBatchList();
      }
    },
    // 获取名单批次列表
    getDirectBatchList() {
      httpServer(apiSetting.getDirectBatchList, {
        app_id: this.$getsessionStorage("appid"),
        template_id: this.$getsessionStorage("template_id"),
        material_id: this.uploadParam.material_id,
        mid_material_allot_id: 0,
        start: "10", //相当于true
        batch_enums: "10", //入口判断：10添加名单处调用，20活动预览处的调用
        id: "0" //批次id 0即为查全部
      })
        .then(response => {
          document.querySelectorAll(".el-dialog__body")[0].scrollTop = 0;
          this.batchList = response;
          console.log(this.batchList);
          this.batchDataSelcetId = response[0].id;
          this.batchDataTop.user_count = response[0].user_count;
          this.batchDataTop.material_count = response[0].material_count;
          this.batchDataTop.release_time = response[0].release_time;
          this.audit_status = response[0].audit_status;
          this.getDirectUserList();
          // this.showNameList = true;
        })
        .catch(error => {});
    },
    //获取名单列表
    getDirectUserList(materialId) {
      this.loadingNameList = true;
      httpServer(apiSetting.getDirectUserList, {
        app_id: this.$getsessionStorage("appid"),
        material_id: this.uploadParam.material_id,
        mid_direct_batch_id: this.batchDataSelcetId, //批次号
        keywords: this.seachValue, //搜索条件 名称/手机号
        PageIndex: this.page.pageIndex,
        PageSize: this.page.pageSize,
        Conditions: ""
      })
        .then(response => {
          console.log(response);
          this.NameList_table_list = response.collection;
          this.loadingNameList = false;
        })
        .catch(error => {});
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
    seachclick(a) {
      if (a == 0) {
        this.seachValue = "";
      }
      this.page.pageIndex = 1;
      this.personNameFun("seach"); //搜索请求列表
    },
    UploadUrl() {
      // apiSetting.postUpload.url
      return apiSetting.postUpload.url;
    },
    setDateTime() {
      // 时间选择器回调
      console.log(this.resouceFormResources.grantTime);
    },
    preview() {
      this.$alert("<p>活动资源中不包含平台码，所以无需进行平台设置", "提示", {
        dangerouslyUseHTMLString: true,
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          this.$router.push({
            name: "preview",
            query: { tabName: "configResouce" }
          });
        })
        .catch(() => {
          console.log("不重新分配了");
        });
    },
    // 红包设置  按钮
    setRedPackagefun() {
      this.showRedPackageDialog = true;
    },
    // 红包确认  按钮
    redPackageFormSubmit() {
      this.$refs.redPackageFormAlert.validate(valid => {
        if (valid) {
          //活动名称  //商户名称  //红包祝福  //备注
          this.redPackageFormAlert.redPackageFormAlertstring =
            this.redPackageFormAlert.activeName +
            this.redPackageFormAlert.commercialName +
            this.redPackageFormAlert.congratulation +
            this.redPackageFormAlert.remark;

          // 红包设置
          httpServer(apiSetting.addMidMaterialRedPacket, {
            app_material_id: this.redPackageForm.allocation_count_id, //后台资源ID
            activity_name: this.redPackageFormAlert.activeName, //活动名称
            blessing: this.redPackageFormAlert.congratulation, //祝福语
            shop_name: this.redPackageFormAlert.commercialName, //商家名称
            details: this.redPackageFormAlert.remark //详细内容
          })
            .then(response => {
              console.log("红包设置");
              // 判断短信是不是为空
              this.showRedPackageDialog = false;
              this.redPackageFormAlert.iserror = false;

              // console.log(response);
            })
            .catch(error => {
              console.log(error.status); //loading层关闭
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 调整额度  按钮
    adjustFun(index) {
      //'1'代表点击总额度，'2'代表不是总额度
      this.showAdjustDialog = true;
      this.$nextTick(function() {
        this.$refs["adjustFormAlert"].resetFields(); //重置红包表单验证
      });

      if (index == "1") {
        this.total = true;
      } else if (index == "2") {
        this.total = false;
      }
    },
    adjustFormSubmit() {
      // 总的
      // httpServer(apiSetting.putMaterial, {
      //     app_material_id: this.redPackageForm.allocation_count_id,
      //     allow_count: this.adjustFormAlert.adjustMoney
      // })
      //     .then(response => {
      //         console.log("修改后台的预警总额");
      //     })
      //     .catch(error => {
      //         console.log(error.status); //loading层关闭
      //     });
      this.$refs.adjustFormAlert.validate(valid => {
        if (valid) {
          // 判断短信是不是为空
          this.showAdjustDialog = false;
          if (this.total) {
            //把公共模板给，预设总额度
            this.adjustFormAlerttotal.adjustMoney = this.adjustFormAlert.adjustMoney;
            this.adjustFormAlerttotal.reason = this.adjustFormAlert.reason;

            // 总的
            httpServer(apiSetting.putMaterial, {
              app_material_id: this.redPackageForm.allocation_count_id,
              allow_count: this.adjustFormAlert.adjustMoney,
              reason: this.adjustFormAlert.reason //修改原因
            })
              .then(response => {
                console.log("修改后台的预警总额");
                this.getlistByTypeid(this.material_type_id);
              })
              .catch(error => {
                console.log(error.status); //loading层关闭
              });
          } else {
            //把公共模板给，预警额度
            this.adjustFormAlertbale.adjustMoney = this.adjustFormAlert.adjustMoney;
            this.adjustFormAlertbale.reason = this.adjustFormAlert.reason;

            // 预警额度  putTrigger_amount
            httpServer(apiSetting.putTrigger_amount, {
              app_material_id: this.redPackageForm.allocation_count_id,
              trigger_amount: this.adjustFormAlert.adjustMoney, //预警值
              reason: this.adjustFormAlert.reason //修改原因
            })
              .then(response => {
                // console.log("预警额度");
                this.getlistByTypeid(this.material_type_id);
              })
              .catch(error => {
                console.log(error.status); //loading层关闭
              });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 短信文案 按钮
    noteDialog() {
      this.showNoteDialog = true;
    },
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
      if (this.noteForm.sendType == 1) {
        this.platformCodeText =
          "{code}" + this.noteForm.textThree + "兑奖平台{链接}";
      } else {
        this.platformCodeText = this.noteForm.textThree + "兑奖平台{链接}";
      }
      this.$refs.noteFormrules3.validate(valid => {
        if (valid) {
          // 判断短信是不是为空  noteFormrules3
          if (this.resouceFormResources.grant == 1) {
            //平台码的短信预览
            this.resouceFormResources.note =
              "【" +
              this.noteForm.msgTable +
              "】" +
              this.noteForm.textOne +
              this.platformCodeText +
              this.noteForm.textTwo;
          } else {
            //原始码  的短信预览
            this.resouceFormResources.note =
              "【" +
              this.noteForm.msgTable +
              "】" +
              this.noteForm.textOne +
              this.originalCodeText +
              this.noteForm.textTwo;
          }
          this.showNoteDialog = false;
          if (this.resouceFormResources.note) {
            this.no_messge = false;
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 奖品说明 按钮
    awardDialog() {
      this.showAwardDialog = true;
    },
    // 奖品文案 确认按钮
    submitAwardForm() {
      console.log("奖品文案");
      this.$refs.awardForm.validate(valid => {
        //验证合格后执行
        if (valid) {
          this.showAwardDialog = false;
          this.resouceFormResources.award =
            this.awardForm.title + this.awardForm.explain; //替换掉奖品文案框里的内容
          // this.awardForm.explain = this.awardForm.explain.replace(
          //     /\r\n/g,
          //     "<br/>"
          // ); //IE9、FF、chrome
          // this.awardForm.explain = this.awardForm.explain.replace(
          //     /\n/g,
          //     "<br/>"
          // ); //IE7-8
          // this.awardForm.explain = this.awardForm.explain.replace(
          //     /\s/g,
          //     " "
          // ); //空格处理
          if (this.resouceFormResources.award) {
            this.no_prize = false;
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
      // this.VerificationresouceFormResources();
    },
    // 获取余额
    getMoney_balance() {
      httpServer(apiSetting.getMoney_balance, {
        app_materialId: this.redPackageForm.allocation_count_id
      })
        .then(response => {
          console.log("余额");
          this.redPackageForm.balance = response;
          // console.log(response);
        })
        .catch(error => {
          console.log(error.status); //loading层关闭
        });
    },
    // 预警通知  按钮
    warnDialog() {
      if (this.$refs["warningForm"]) {
        this.$refs["warningForm"].resetFields(); //重置预警弹窗的参数
      }
      if (this.resouceFormResources.warningNum) {
        this.showWarndDialog = true;
        this.getworningNoticeList();
      } else {
        this.$message({
          message: "请先填写预警数量",
          duration: 1000
        });
      }
    },
    warnDialogTwo() {
      if (this.redPackageForm.warnMoney) {
        this.showWarndDialog = true;
        this.getworningNoticeList();
      } else {
        this.$message({
          message: "请先填写预警金额",
          duration: 1000
        });
      }
    },
    // 预警通知的弹窗 确认按钮
    awardFormalertquery() {
      // 如果是选择自定义 并且没有回车进去的，报错
      if (this.awardFormalert.radio2 == 5) {
        if (this.resouceFormResources.waremails.length <= 0) {
          this.awardFormalert.istextTip = true;
          this.awardFormalert.textTip =
            "请在上面输入框里输入正确邮箱，且点击回车";
          return false;
        }
        if (this.resouceFormResources.waremails.length > 0) {
          this.resouceFormResources.wareNotice = this.resouceFormResources.waremails[0];
        }
      } else {
        // this.resouceFormResources.wareNotice = this.awardFormalert.radio2;
      }
      // if (this.tabActive != "hongbao") {
      this.$refs.warningForm.validate(valid => {
        //验证合格后执行
        if (valid) {
          this.showWarndDialog = false;
          if (this.resouceFormResources.wareNotice) {
            this.no_errow = false;
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
      // this.VerificationresouceFormResources();
      // } else {
      // }
    },
    addwaremails() {
      //预警通知回车追加
      this.ischeckemail(this.awardFormalert.input);
    },
    redAddwaremails() {
      this.redischeckemail(this.redawardFormalert.input);
    },
    // 获取邮箱列表
    getworningNoticeList() {
      httpServer(apiSetting.getworningNoticeList)
        .then(response => {
          console.log("获取邮箱1");
          // console.log(response);

          this.awardFormalert.arryList = response;
          if (this.tabActive == "hongbao") {
            this.redawardFormalert.arryList = response;
          }
        })
        .catch(error => {
          console.log(error.status); //loading层关闭
        });
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
          this.resouceFormResources.waremails.push(this.awardFormalert.input);
          this.awardFormalert.input = "";
          this.awardFormalert.istextTip = false;
        }
      }
    },
    redischeckemail(textTip) {
      if (textTip != "") {
        var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
        var isok = reg.test(textTip);
        if (!isok) {
          this.redawardFormalert.istextTip = true;
          this.redawardFormalert.textTip = "邮箱格式不正确，请重新输入！";
          return false;
        } else {
          this.redPackageForm.waremails.push(this.redawardFormalert.input);
          this.redawardFormalert.input = "";
          this.redawardFormalert.istextTip = false;
        }
      }
    },
    // 红包预警通知的弹窗
    redWarnDialog() {
      this.redshowWarndDialog = true;
      // this.getworningNoticeList();
    },
    redAwardFormalertquery() {
      // 如果是选择自定义 并且没有回车进去的，报错
      if (this.redawardFormalert.radio2 == 5) {
        if (this.redPackageForm.waremails.length <= 0) {
          this.redawardFormalert.istextTip = true;
          this.redawardFormalert.textTip =
            "请在上面输入框里输入正确邮箱，且点击回车";
          return false;
        }
        if (this.redPackageForm.waremails.length > 0) {
          this.redPackageForm.wareNotice = this.redPackageForm.waremails[0];
        }
      } else {
        // this.resouceFormResources.wareNotice = this.awardFormalert.radio2;
      }
      this.$refs.redwarningForm.validate(valid => {
        //验证合格后执行
        if (valid) {
          // 修改后台资源预警
          httpServer(apiSetting.putWarning, {
            app_material_id: this.redPackageForm.allocation_count_id,
            trigger_amount: this.redPackageForm.warning_count, //预警值预警额度 页面上有
            send_text: "", //可以不传
            send_key:
              this.redPackageForm.waremails.length <= 0
                ? this.redawardFormalert.radio2
                : "", //选择字符串id
            emails:
              this.redPackageForm.waremails.length > 0
                ? JSON.stringify(this.redPackageForm.waremails)
                : ""
          })
            .then(response => {
              console.log("修改后台的预警总额");
              this.redPackageFormAlert.redwareNoticeiseorr = false;
            })
            .catch(error => {
              console.log(error.status); //loading层关闭
            });
          this.redshowWarndDialog = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
      // this.VerificationresouceFormResources();
    },
    deleteemails(index) {
      // if (this.tabActive == "hongbao") {
      //     this.redPackageForm.waremails.splice(index, 1);
      // } else {
      this.resouceFormResources.waremails.splice(index, 1);
      // }
    },
    redeleteemails(index) {
      this.redPackageForm.waremails.splice(index, 1);
    },
    redRadio2change(value) {
      this.redawardFormalert.istextTip = false;
      this.redawardFormalert.input = "";
      console.log("我是选择");
      this.redawardFormalert.radio2 = value;
      // console.log(this.redawardFormalert.radio2);
      if (this.redawardFormalert.radio2 == 5) {
        this.redawardFormalert.disabled = false;
        if (this.redPackageForm.waremails.length > 0) {
          this.redPackageForm.wareNotice = this.redPackageForm.waremails[0];
        }
      } else {
        this.redawardFormalert.disabled = true;
        this.redPackageForm.waremails = [];
        // 以下是单选项传item里的所有东西，而不仅仅是value

        this.$nextTick(function() {
          let obj = {};
          obj = this.redawardFormalert.arryList.find(item => {
            //这里的userList就是上面遍历的数据源
            return item.dic_ename === value; //筛选出匹配数据
          });
          this.redPackageForm.wareNotice = obj.dic_cname.replace(
            "{0}",
            this.redPackageForm.warning_count
          );
        });
      }
    },
    radio2change(value) {
      this.awardFormalert.istextTip = false;
      this.awardFormalert.input = "";
      console.log("我是选择");
      console.log(value);
      this.awardFormalert.radio2 = value;
      // console.log(this.awardFormalert.radio2);
      if (this.awardFormalert.radio2 == 5) {
        this.awardFormalert.disabled = false;
        // console.log(this.redPackageForm);
        if (this.resouceFormResources.waremails.length > 0) {
          this.resouceFormResources.wareNotice = this.resouceFormResources.waremails[0];
        }
      } else {
        this.awardFormalert.disabled = true;
        // 以下是单选项传item里的所有东西，而不仅仅是value
        console.log("skkkkk");
        console.log(this.awardFormalert.arryList);

        this.$nextTick(function() {
          let obj = {};
          obj = this.awardFormalert.arryList.find(item => {
            //这里的userList就是上面遍历的数据源
            return item.dic_ename === value; //筛选出匹配数据
          });
          this.resouceFormResources.wareNotice = obj.dic_cname.replace(
            "{0}",
            this.resouceFormResources.warningNum
          );
        });
      }
    },
    // 红包的资源
    changeRed(value) {
      let objRed = {};
      objRed = this.redPackageForm.resouceItem.find(item => {
        //这里的userList就是上面遍历的数据源
        return item.id === value; //筛选出匹配数据
      });
      console.log("红包的资源选择");
      // console.log(objRed);
      this.redPackageForm.allocation_count_id = objRed.id;
      this.redPackageForm.allocation_count = objRed.allocation_count;
      this.redPackageForm.warning_count = objRed.warning_count;
      if (objRed.emails) {
        if (objRed.emails.length > 0) {
          this.redPackageForm.warnNotice = objRed.emails[0];
        }
      }
      // 红包选中资源判断后台带过来的预警通知是否有值
      if (objRed.send_type_key) {
        this.redPackageForm.wareNotice = this.redawardFormalert.radio2;
      }
    },
    // 红包的添加按钮
    submitEnvelopes() {
      // console.log("红包报保存");
      // console.log(this.adjustFormAlerttotal);
      // console.log(this.adjustFormAlertbale);
      if (!this.redPackageFormAlert.redPackageFormAlertstring) {
        //判断红包设置是否为空
        this.redPackageFormAlert.iserror = true;
        // return false;
      } else {
        this.redPackageFormAlert.iserror = false;
      }
      if (!this.redPackageForm.wareNotice) {
        //判断总的预警是否为空
        this.redPackageFormAlert.redwareNoticeiseorr = true;
        // return false;
      }
      if (!this.resouceFormResources.wareNotice) {
        this.no_errow = true;
      } else {
        this.no_errow = false;
      }
      if (!this.awardFormalert.radio2) {
        this.redPackageFormAlert.redyujinerro = true;
      } else {
        if (this.awardFormalert.radio2 != 5) {
          this.redPackageFormAlert.redyujinerro = false;
        } else {
          //等于5的时候
          if (this.resouceFormResources.waremails.length > 0) {
            this.redPackageFormAlert.redyujinerro = false;
          } else {
            this.redPackageFormAlert.redyujinerro = true;
          }
        }
      }
      // if (
      //     !this.redPackageFormAlert.redPackageFormAlertstring ||
      //     !this.redPackageForm.wareNotice ||
      //     !this.awardFormalert.radio2
      // ) {
      //     return false;
      // }
      this.$refs.redPackageForm.validate(valid => {
        //验证合格后执行
        if (
          valid &&
          this.redPackageFormAlert.redPackageFormAlertstring &&
          this.redPackageForm.wareNotice &&
          this.awardFormalert.radio2
        ) {
          this.redaddloading = true;
          this.redKamiAxios();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 卡密的添加按钮
    submitResouceForm() {
      /* 之前是不允许添加相同的资源，现在改成允许添加多个*/

      // if (this.material_idArray.indexOf(this.material_id) != -1) {
      //     this.$message({
      //         message: "此资源已经配置过，不可再配置",
      //         duration: 1000
      //     });
      //     return false;
      // }

      // 如果选择的是  直接充值类   所需要的验证
      if (this.resouceFormResources.grant == "3") {
        if (this.resouceFormResources.personNameNum <= 0) {
          this.$message({
            message: "必须先导入名单",
            duration: 1000
          });
          return false;
        }
        if (this.resouceFormResources.grantTime == "") {
          this.isGrantTimeError = true;
        } else {
          this.isGrantTimeError = false;
          this.directAxios();
          console.log("成功急急急急急急");
        }
      } else {
        console.log("失败手动阀沙发党");
        if (!this.resouceFormResources.wareNotice) {
          this.no_errow = true;
        } else {
          this.no_errow = false;
        }
        if (!this.resouceFormResources.note) {
          this.no_messge = true;
        } else {
          this.no_messge = false;
        }
        if (
          !this.resouceFormResources.award &&
          this.resouceFormResources.grant == 1
        ) {
          this.no_prize = true;
        } else {
          this.no_prize = false;
        }
        if (this.resouceFormResources.personNameNum <= 0) {
          this.$message({
            message: "必须先导入名单",
            duration: 1000
          });
          return false;
        }
        this.$refs.resouceFormResources.validate(valid => {
          //验证合格后执行
          if (valid) {
            // alert("ssss");
            // this.awardFormalert.radio2 = "";
            if (!this.no_errow && !this.no_messge && !this.no_prize) {
              this.addloading = true;

              this.awardForm.explain = this.awardForm.explain.replace(
                /\r\n/g,
                "<br/>"
              ); //IE9、FF、chrome
              this.awardForm.explain = this.awardForm.explain.replace(
                /\n/g,
                "<br/>"
              ); //IE7-8
              this.awardForm.explain = this.awardForm.explain.replace(
                /\s/g,
                " "
              ); //空格处理

              this.kamiAxios();
            }
            console.log("直接充值1111111111");
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      }
    },
    redKamiAxios() {
      // alert(this.redPackageForm.totleMoney);
      httpServer(apiSetting.postmidmaterialallot, {
        app_id: this.appid,
        template_id: this.template_id,
        app_material_id: this.redPackageForm.allocation_count_id, //红包选择资源的id
        amount: this.redPackageForm.totleMoney, //红包的总额或者资源数量
        emails:
          this.awardFormalert.radio2 == 5
            ? JSON.stringify(this.resouceFormResources.waremails)
            : "", //预警通知的自定义邮箱  等于5的时候说明是自定义
        send_type_key:
          this.awardFormalert.radio2 != 5 ? this.awardFormalert.radio2 : "", //预警通知选中的dic_ename   非5的时候说明是自己选择
        trigger_amount: this.redPackageForm.warnMoney, //预警金额
        money: this.redPackageForm.singRedPackage //红包金额
      })
        .then(response => {
          console.log("提交的返回");
          console.log(response);
          this.resouceFormResources.wareNotice = "";
          this.awardFormalert.radio2 = "";
          this.redaddloading = false;

          //红包添加成功重新获取最新数据展示
          this.$refs["redPackageForm"].resetFields();
          this.getlistByTypeid();
          this.getMoney_balance();

          this.getMaterialallotlist();
        })
        .catch(error => {
          this.loginContent.onColse = false;
          console.log(error); //loading层关闭
        });
    },
    //保存直冲类的资源
    kamiAxios() {
      httpServer(apiSetting.postmidmaterialallot, {
        send_message_type: this.noteForm.sendType, // 短信发放形式  1正常发放  2简化发放
        app_id: this.appid,
        mid_direct_batch_id: this.mid_direct_batch_id, //名单导入成功需要带过去的id
        template_id: this.template_id,
        material_type_id: this.uploadParam.material_type_id,
        app_material_id: this.resouceFormResources.resouceFormResourcestext, //后台配置的资源  选择资源的id
        material_id: this.uploadParam.material_id, // 中台选择的资源
        amount: this.materialCount, //发放数量
        grant_type: this.resouceFormResources.grant, //选择发放方式 1或者2
        notice_type: 1, //1代表是短信
        send_rate: 0, //预警如果设置为短信 设置短信频次
        valid_duration: this.resouceFormResources.num1, //有效时长
        emails:
          this.awardFormalert.radio2 == 5
            ? JSON.stringify(this.resouceFormResources.waremails)
            : "", //预警通知的自定义邮箱  等于5的时候说明是自定义
        send_type_key:
          this.awardFormalert.radio2 != 5 ? this.awardFormalert.radio2 : "", //预警通知选中的dic_ename   非5的时候说明是自己选择
        trigger_amount: this.resouceFormResources.warningNum, //预警金额
        release_time: this.resouceFormResources.grantTime, //发放时间

        notices: JSON.stringify({
          title: "【" + this.noteForm.msgTable + "】" + this.noteForm.textOne,
          shorturl:
            this.resouceFormResources.grant == 2
              ? this.originalCodeText
              : this.platformCodeText,
          content: this.noteForm.textTwo
        }), //短信拼接的文案
        prize_title:
          this.resouceFormResources.grant == 2 ? "" : this.awardForm.title, //奖品信息的 title  如果是原始码的情况下传空
        prize_explain:
          this.resouceFormResources.grant == 2 ? "" : this.awardForm.explain //奖品的主体信息 explain   如果是原始码的情况下传空
      })
        .then(response => {
          if (this.$refs["noteFormrules3"]) {
            this.$refs["noteFormrules3"].resetFields(); //短信文案弹框参数重置
          }
          if (this.$refs["awardForm"]) {
            this.$refs["awardForm"].resetFields(); //重置弹窗的参数
          }
          this.awardFormalert.radio2 = "";
          // ----------------------------------------------------
          // 预警通知
          this.resouceFormResources.wareNotice = "";
          this.resouceFormResources.waremails = [];
          //短信
          this.resouceFormResources.note = "";
          this.noteForm.textOne = "";
          this.noteForm.textThree = "";
          this.noteForm.textTwo = "";
          //奖品说明
          this.resouceFormResources.award = "";
          this.awardForm.title = "";
          this.awardForm.explain = "";
          //有效时长
          this.resouceFormResources.num1 = 1;
          // 总数量
          this.resouceFormResources.tipAllocation_count = "";
          // 剩余数量
          this.resouceFormResources.surplusCount = "";
          // 发放数量
          this.materialCount = "0";
          this.resouceFormResources.issueNum = "0";
          this.resouceFormResources.issueAmount = "无";
          // ----------------------------------------------------
          this.addloading = false;

          this.resetResouceFormResources(); //重置表单
          this.getMaterialallotlist();
        })
        .catch(error => {
          console.log(error); //loading层关闭
          this.addloading = false;
          this.$message({
            message: error.data.message,
            duration: 2000
          });
        });
    },
    //保存直接充值的资源
    directAxios() {
      httpServer(apiSetting.postmidmaterialallot, {
        send_message_type: 1, // 短信发放形式  1正常发放  2简化发放
        app_id: this.appid,
        mid_direct_batch_id: this.mid_direct_batch_id, //名单导入成功需要带过去的id
        template_id: this.template_id,
        material_type_id: this.uploadParam.material_type_id,
        app_material_id: this.resouceFormResources.resouceFormResourcestext, //后台配置的资源  选择资源的id
        material_id: this.uploadParam.material_id, // 中台选择的资源
        amount: this.materialCount, //发放数量
        grant_type: this.resouceFormResources.grant, //选择发放方式 1或者2,3
        notice_type: 1, //1代表是短信
        send_rate: 0, //预警如果设置为短信 设置短信频次
        valid_duration: 1, //有效时长
        emails: "", //直接充值  没有预警通邮箱 所以传空值
        send_type_key: "", //直接充值  没有预警通邮箱 所以传空值
        trigger_amount: 0, //预警金额
        release_time: this.resouceFormResources.grantTime, //发放时间

        notices: "", //短信拼接的文案
        prize_title: "", //奖品信息的 title  如果是直接充值 的情况下传空
        prize_explain: "" //奖品的主体信息 explain   如果是直接充值 的情况下传空
      })
        .then(response => {
          if (this.$refs["noteFormrules3"]) {
            this.$refs["noteFormrules3"].resetFields(); //短信文案弹框参数重置
          }
          if (this.$refs["awardForm"]) {
            this.$refs["awardForm"].resetFields(); //重置弹窗的参数
          }
          this.awardFormalert.radio2 = "";
          // ----------------------------------------------------
          // 预警通知
          this.resouceFormResources.wareNotice = "";
          this.resouceFormResources.waremails = [];
          //短信
          this.resouceFormResources.note = "";
          this.noteForm.textOne = "";
          this.noteForm.textThree = "";
          this.noteForm.textTwo = "";
          //奖品说明
          this.resouceFormResources.award = "";
          this.awardForm.title = "";
          this.awardForm.explain = "";
          //有效时长
          this.resouceFormResources.num1 = 1;
          // 总数量
          this.resouceFormResources.tipAllocation_count = "";
          // 剩余数量
          this.resouceFormResources.surplusCount = "";
          // 发放数量
          this.materialCount = "0";
          this.resouceFormResources.issueNum = "0";
          this.resouceFormResources.issueAmount = "无";
          this.addloading = false;
          this.resetResouceFormResources();
          this.getMaterialallotlist();
        })
        .catch(error => {
          console.log(error); //loading层关闭
          this.addloading = false;
          this.$message({
            message: error.data.message,
            duration: 2000
          });
        });
    },
    // 红包 卡密 直冲tab切换
    tabActiveFun(tabname, tabid) {
      this.isShowDirect = false;
      this.zichongDisabled = false;
      if (this.$refs["noteFormrules3"]) {
        this.$refs["noteFormrules3"].resetFields(); //短信文案弹框参数重置
      }
      if (this.$refs["awardForm"]) {
        this.$refs["awardForm"].resetFields(); //重置弹窗的参数
      }
      this.tabActive = tabname;
      this.material_type_id = tabid;
      this.uploadParam.grant_type = "1";
      this.resouceFormResources.resouceItem = [];
      this.resouceFormResources.resouceFormResourcestext = "";
      this.resouceFormResources.wareNotice = "";
      this.resouceFormResources.note = "";
      this.resouceFormResources.waremails = [];
      this.resouceFormResources.tipAllocation_count = "";
      // 卡密类的重置
      this.resouceFormResources.resouceNum = "";
      this.resouceFormResources.warningNum = "";
      this.resouceFormResources.award = "";
      // 导入名单查看的各项重置
      this.seachValue = ""; //名单搜索框清空
      this.NameList_table_list = []; //名单列表清空
      this.page.pageIndex = 1;
      // 导入名单查看的各项重置

      // 红包表单验证重置
      this.redPackageFormAlert.iserror = false;
      this.redPackageFormAlert.redwareNoticeiseorr = false;
      this.redPackageFormAlert.redyujinerro = false;
      this.awardFormalert.radio2 = ""; //重置通知单选框，因为卡密和红包的这里共用
      this.awardFormalert.disabled = true;
      this.awardFormalert.istextTip = false;
      this.redawardFormalert.istextTip = false;
      if (this.tabActive == "hongbao") {
        // this.isHongbao = true;
        // this.isZichong = false;
        // this.isKami = false;
        // this.getworningNoticeList();
        // this.$nextTick(function() {
        //     this.$refs["redPackageForm"].resetFields(); //重置红包表单验证
        //     this.redPackageForm.allocation_count = "";
        //     this.redPackageForm.warning_count = "";
        // });
      } else if (this.tabActive == "kami") {
        this.isHongbao = false;
        this.isZichong = false;
        this.isKami = true;
        this.$nextTick(function() {
          this.$refs["resouceFormResources"].resetFields(); //重置表单验证
          this.resouceFormResources.grant = "1";
        });
      } else if (this.tabActive == "zichong") {
        this.isHongbao = false;
        this.isKami = false;
        this.isZichong = true;
        this.$nextTick(function() {
          this.$refs["resouceFormResources"].resetFields(); //重置表单验证
          this.zichongDisabled = true;
          this.resouceFormResources.grant = "1";
        });
      }
      this.getlistByTypeid(this.material_type_id);
    },
    // 预警通知取消按钮
    cancelearly() {
      this.showWarndDialog = false;
      this.awardFormalert.radio2 = "";
      this.resouceFormResources.wareNotice = "";
    },
    // 删除已配置规则
    deleteFun(id) {
      this.$confirm("是否确定删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
        // type: 'warning'
      })
        .then(() => {
          this.deleteMidmaterialallot(id);
          console.log("删除成功");
        })
        .catch(() => {
          console.log("我不想删了");
        });
    },
    handleChange(value) {
      //增加有效时间的操作
      console.log(value);
    },
    // 选择红包的资源
    changeForm(value) {
      console.log(value);
    },
    // 选择kami资源
    changeResources(value) {
      console.log(
        "选择的资源",
        this.resouceFormResources.resouceFormResourcestext
      );
      // 以下是单选项传item里的所有东西，而不仅仅是value
      let obj = {};
      obj = this.resouceFormResources.resouceItem.find(item => {
        //这里的userList就是上面遍历的数据源
        return item.id === value; //筛选出匹配数据
      });
      console.log(obj);
      this.uploadParam.material_id = obj.material_id;
      this.uploadParam.material_type_id = obj.material_type_id;
      // this.uploadParam.grant_type = this.resouceFormResources.grant;
      // this.uploadParam.validityday = this.resouceFormResources.num1; //有效时长
      this.material_id = obj.material_id;
      this.materialName = obj.material_name;
      this.resouceFormResources.tipAllocation_count = obj.allocation_count; //总数量

      this.resouceFormResources.resouceNum = obj.allocation_count;

      // this.resouceFormResources.wareNotice = obj.dic_cname.replace(
      //     "{0}",
      //     this.resouceFormResources.warningNum
      // );
      if (this.tabActive == "zichong") {
        if (obj.material_name == "综合资源") {
          this.resouceFormResources.grant = "3";
          this.resouceFormResources.issueNum = "无";
          this.resouceFormResources.issueAmount = this.materialCount;
          this.uploadParam.grant_type = "3";
          this.isShowDirect = true;
        } else {
          this.resouceFormResources.grant = "1";
          this.uploadParam.grant_type = "1";
          this.resouceFormResources.issueNum = this.materialCount;
          this.resouceFormResources.issueAmount = "无";
          this.isShowDirect = false;
        }
      }
    },
    // 选择发放形式
    changeDistribution(value) {
      this.noteForm.textOne = "";
      this.noteForm.textTwo = "";
      this.noteForm.textThree = "";
      this.noteForm.msgTable = "";
      this.resouceFormResources.note = "";
      this.uploadParam.grant_type = this.resouceFormResources.grant;
      if (this.resouceFormResources.grant == 2) {
        this.noteForm.sendType = 1;
      } else if (this.resouceFormResources.grant == 3) {
        this.isShowDirect = true;
      } else {
        this.isShowDirect = false;
      }
      // console.log(value);
    },
    // 获取表格列表的按钮
    getMaterialallotlist() {
      httpServer(apiSetting.getMaterialallotlist, {
        tempId: this.template_id
      })
        .then(response => {
          console.log("表格");
          this.arrayList = [];
          this.loadingFlag = false;
          this.nodata_tip = false;
          this.getallotlist = response;
          if (response.length <= 0) {
            this.nodata_tip = true;
          } else {
            this.nodata_tip = false;
            // console.log(response);
            response.forEach((value, index, array) => {
              this.arrayList.push(value.grant_type);
              this.material_idArray.push(value.material_id);
              if (index == array.length - 1) {
                if (this.arrayList.indexOf(1) == -1) {
                  // 不包含平台码
                  this.arrayListon = false;
                } else {
                  // 包含平台码
                  this.arrayListon = true;
                }
              }
            });
          }
        })
        .catch(error => {
          if (error.status) {
            console.log("====列表暂无数据====");
            this.loadingFlag = false;
            this.getallotlist = [];
            this.nodata_tip = true;
          }
          console.log(error.status); //loading层关闭
        });
    },
    getTypelist() {
      // alert(this.appid);
      httpServer(apiSetting.getTypelist, {
        appId: this.appid
      })
        .then(response => {
          console.log("资源配置导航table选项");
          // console.log(response);
          this.tabList = response;
          // alert(response.length);
          if (response.length <= 0) {
            //暂无数据
            this.no_data = true;
          } else {
            this.no_data = false;
          }
          if (response[0]) {
            // 默认第一个
            this.tabActive = response[0].material_type_ename;
            this.material_type_id = response[0].material_type_id;
            this.getworningNoticeList();

            this.getlistByTypeid(this.material_type_id);
            if (this.tabActive == "hongbao") {
              this.isHongbao = true;
              this.isKami = false;
            } else if (this.tabActive == "kami") {
              this.isHongbao = false;
              this.isKami = true;
            } else if (this.tabActive == "zichong") {
              this.isHongbao = false;
              this.isKami = true;
              this.zichongDisabled = true;
            }
          }
        })
        .catch(error => {
          if (error.status == 404) {
            this.no_data = true;
          }
          // this.loginContent.onColse = false;
          console.log(error); //loading层关闭
        });
    },
    //删除
    deleteMidmaterialallot(id) {
      httpServer(apiSetting.deleteMidmaterialallot, {
        allotId: id
      })
        .then(response => {
          console.log("delet删除");
          this.material_idArray = [];
          // console.log(response);
          this.getMaterialallotlist();
          if (this.tabActive == "hongbao") {
            this.getMoney_balance();
          }
        })
        .catch(error => {
          console.log(error); //loading层关闭
        });
    },
    getlistByTypeid() {
      //资源列表
      httpServer(apiSetting.getlistByTypeid, {
        appId: this.appid,
        typeId: this.material_type_id
      })
        .then(response => {
          console.log("选择资源typeid获取");
          console.log(response);
          if (this.tabActive == "kami" || this.tabActive == "zichong") {
            this.resouceFormResources.resouceItem = response; //卡密资源
          } else if (this.tabActive == "hongbao") {
            this.redPackageForm.selectResouce = response[0].id;
            this.redPackageFormAlert.redPackageFormAlertstring =
              response[0].activity_name +
              response[0].shop_name +
              response[0].blessing +
              response[0].details;

            this.redPackageForm.resouceItem = response; //红包资源
            if (response.length > 0) {
              this.redPackageForm.allocation_count_id = response[0].id;
              this.redPackageForm.allocation_count =
                response[0].allocation_count;
              this.redPackageForm.warning_count = response[0].warning_count;

              this.redPackageFormAlert.activeName = response[0].activity_name;
              this.redPackageFormAlert.commercialName = response[0].shop_name;
              this.redPackageFormAlert.congratulation = response[0].blessing;
              this.redPackageFormAlert.remark = response[0].details;
              if (response[0].emails) {
                if (response[0].emails.length > 0) {
                  this.redPackageForm.warnNotice = response[0].emails[0];
                }
              } else {
                this.redawardFormalert.radio2 = response[0].send_type_key;
                let $eimt = this;
                this.redawardFormalert.arryList.forEach(function(
                  value,
                  index,
                  array
                ) {
                  console.log("遍历");
                  // console.log(value.dic_ename);
                  if (value.dic_ename == response[0].send_type_key) {
                    $eimt.redPackageForm.wareNotice = value.dic_cname.replace(
                      "{0}",
                      $eimt.redPackageForm.warning_count + "   "
                    );
                  }
                });
              }
              if (this.tabActive == "hongbao") {
                this.getMoney_balance(); //获取余额默认值
              }
              this.hongbaoLoading = false;
            } else {
              // alert("没有数据不能操作，记得限制");
            }
          }
        })
        .catch(error => {
          console.log(error); //loading层关闭
        });
    },
    VerificationresouceFormResources() {
      if (this.tabActive == "hongbao") {
        this.$refs.redPackageForm.validate(valid => {
          //验证合格后执行
          if (valid) {
            // alert("ssss");
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      } else {
        this.$refs.resouceFormResources.validate(valid => {
          //验证合格后执行
          if (valid) {
            // alert("ssss");
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      }
    },
    resetResouceFormResources() {
      if (this.$refs["resouceFormResources"]) {
        this.$refs["resouceFormResources"].resetFields(); //重置表单验证
      }
      this.resouceFormResources.grant = "1";
    },
    // 上一步
    prev() {
      this.$router.push({ name: "exchange" });
      this.configResouce.isshow = true;
      this.configResouce.shownum = 1;
      this.configResouce.step = 2;
      this.$emit("changeStep", this.configResouce);
    },
    // 下一步
    setPage() {
      if (this.nodata_tip) {
        this.$message({
          message: "请先配置资源，在进行下一步",
          duration: 1500
        });
        return false;
      } else {
        this.$router.push({ name: "configPlatform" });
        // this.configResouce.isshow = true;
        this.configResouce.shownum = 3;
        this.configResouce.step = 4; //步骤第四部
        this.$emit("changeStep", this.configResouce);
      }
    }
  }
};
</script>
<style lang="less" scoped>
#directBuyResouce {
  .rederro {
    color: #f56c6c;
    font-size: 12px;
    line-height: 15px;
    margin-top: 3px;
  }
  .resouce_title {
    line-height: 50px;
    margin-left: 20px;
    font-weight: bold;
  }
  .resouce_header {
    width: 900px;
    // height: 230px;
    background-color: #ffffff;
    border-radius: 8px;
    border: solid 1px rgba(206, 206, 206, 0.46);
    .no_data {
      height: 120px;
      line-height: 120px;
      text-align: center;
      font-size: 14px;
      color: #aaaeb3;
    }
    .resouvce_tab {
      border-bottom: 1px #eaeaea solid;
      padding: 0 20px;
      ul {
        overflow: hidden;
        li {
          float: left;
          height: 30px;
          margin-right: 40px;
          color: #aaaeb3;
          font-size: 12px;
          padding: 0px 5px;
          cursor: pointer;
        }
        .resouvceTabActive {
          font-size: 14px;
          color: #393c40;
          border-bottom: 3px #4900e0 solid;
        }
      }
    }
    .resouce_form {
      padding: 20px 20px 0px 0px;
      overflow: hidden;
      .el-form {
        .red_yujin {
          /deep/.el-form-item__label:before {
            content: "*";
            color: #f56c6c;
            margin-right: 4px;
          }
        }
        .el-form-item {
          float: left;
          position: relative;
          margin-bottom: 20px;
          .el-form-item__content {
            .el-select {
              width: 150px;
              margin-right: 70px;
            }
          }
          .preinstall_money {
            color: #9a9ea4;
            font-size: 10px;
            line-height: 20px;

            span {
              color: #ef444b;
            }
          }
          .yuan {
            display: block;
            position: absolute;
            right: 0px;
            top: 5px;
            width: 36px;
            line-height: 30px;
            height: 32px;
            text-align: center;
            border-top-right-radius: 6px;
            border-bottom-right-radius: 6px;
            background-color: #e6e6e6;
          }
          .totle_money {
            width: 150px;
            margin-right: 70px;
            position: relative;
            span {
              color: #3592ff;
              cursor: pointer;
              padding-left: 10px;
            }
            p {
              position: absolute;
              font-size: 10px;
              line-height: 15px;
              left: -85px;
              top: 30px;
              color: #9a9ea4;
            }
          }
          .totleMoneyML {
            margin-right: 60px;
          }
          .limit {
            margin-right: 0px;
            p {
              left: -70px;
            }
          }
          .write_text {
            width: 118px;
            padding: 0px 10px;
            height: 30px;
            border-radius: 4px;
            text-align: center;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            line-height: 30px;
            border: dashed 1px #aaaeb3;
            color: #aaaeb3;
            cursor: pointer;
            font-size: 12px;
            margin-top: 5px;
          }
          .red_package {
            margin-right: 70px;
          }
          .noEmpty {
            color: #5205e1;
          }
        }
      }
      .sing_red_package {
        display: inline-block;
        padding-top: 10px;
        margin: 0 20px;
        border-top: 1px solid #ecedef;
      }
    }
    .resouce_card {
      min-height: 190px;
      padding: 20px 20px 0px 20px;
      overflow: hidden;
      /deep/ .el-upload-dragger {
        width: 143px;
        height: 44px;
      }
      .el-form-item {
        float: left;

        .write_text {
          width: 148px;
          padding: 0px 10px;
          height: 30px;
          border-radius: 4px;
          text-align: center;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          line-height: 30px;
          border: dashed 1px #aaaeb3;
          color: #aaaeb3;
          cursor: pointer;
          font-size: 12px;
          margin-top: 5px;
        }
        .noEmpty {
          color: #5205e1;
        }
      }
      .select_resouce {
        width: 250px;
        margin-right: 55px;
        .tipResouceNum {
          position: absolute;
          height: 18px;
          line-height: 18px;
          color: #9a9ea4;
          font-size: 10px;
        }
        .select_resouce_notice {
          line-height: 20px;
          font-size: 12px;
          position: absolute;
        }
      }
      .grantTime {
        .grantTimeError {
          color: #f56c6c;
          line-height: 15px;
          font-size: 12px;
        }
      }
      // .select_resouce {
      //   /deep/.el-form-item__label:before {
      //     content: "*";
      //     color: #f56c6c;
      //     margin-right: 4px;
      //   }
      // }

      // .warning_num {
      //     margin-bottom: 40px;
      // }
      .warn {
        margin-right: 0px;
      }
      // .xiao_time {
      //     margin-right: 89px;
      // }
      .addbutton {
        margin-bottom: 20px;
      }
      .guideName {
        // overflow: hidden;
        clear: both;
        position: relative;
        .download {
          float: left;
          a {
            outline: none;
            display: block;
            font-size: 12px;
            line-height: 20px;
            margin-top: 9px;
            padding-left: 20px;
            background: url(../../../../assets/images/images/down.png) no-repeat
              left center;
            background-size: 16px 16px;
          }
        }
        .upBtn {
          float: left;
          margin-left: 25px;
          height: 40px;
        }
        .upBtn_notice {
          line-height: 20px;
          font-size: 12px;
          position: absolute;
          top: 40px;
          left: 100px;
          margin-bottom: 10px;
        }
      }
      .lookNmList {
        float: left;
        margin-left: 20px;
        color: #ffb735;
        cursor: pointer;
        font-size: 12px;
        margin-top: 12px;
      }
    }
  }
  .addEmli {
    width: 70px;
    position: absolute;
    right: -130px;
    top: -5px;
  }
  .resouce_table {
    width: 900px;
    min-height: 330px;
    margin: 20px 0px;
    background-color: #ffffff;
    border-radius: 8px;
    border: solid 1px rgba(206, 206, 206, 0.46);
    .resouce_table_list {
      width: 100%;
      .resouce_table_title {
        height: 40px;
        background-color: #f5f5f5;
        th {
          font-size: 12px;
          font-weight: normal;
          color: #aaaeb3;
          font-weight: bold;
        }
        .set_num {
          // padding-left: 10px;
        }
      }
      .resouce_table_item {
        height: 70px;

        td {
          text-align: center;
          font-size: 12px;
          border-bottom: 1px #ecedef solid;

          p {
            text-align: center;
            width: 100px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            padding: 0px 5px;
          }
          img {
            display: inline-block;
            width: 40px;
            height: 40px;
          }
          .el-icon-delete {
            color: red;
            cursor: pointer;
            display: inline-block;
            width: 40px;
            height: 40px;
            line-height: 40px;
            font-size: 16px;
            transition: all 0.25s ease;
          }
          .el-icon-delete:hover {
            transform: scale(1.5);
          }
          .star {
            i {
              color: red;
              margin-right: 3px;
            }
            color: #898989;
            font-size: 10px;
          }
        }
      }
    }
  }
  .noteDialogContent {
    width: 540px;
    background-color: #f5f5f5;
    border-radius: 6px;
    border: solid 1px #c9c9c9;
    padding: 20px 10px;
    .el-form-item {
      margin-bottom: 5px;
    }
    .reouce_code {
      overflow: hidden;
      margin-top: 20px;
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
        margin: 0px 20px 20px 20px;
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
    margin-top: 10px;
    padding: 10px;
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
  .ediAwardDialog {
    .el-input,
    .el-textarea {
      width: 480px;
    }
  }
  .warn_dialog {
    .el-input {
      width: 305px;
    }
    .add_emile {
      width: 540px;
      background-color: #f5f5f5;
      border-radius: 6px;
      border: solid 1px #ebebeb;
      padding: 10px;
      margin-bottom: 20px;
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
  }
  .AdjustDialog {
    .el-form {
      .AdjustText {
        // overflow: hidden;
        p {
          float: left;
          margin-top: 10px;
        }
        .Adjust_totle_price {
          width: 290px;
          // float: left;
          .yuan {
            display: block;
            position: absolute;
            right: 0px;
            top: 5px;
            width: 36px;
            line-height: 30px;
            height: 32px;
            text-align: center;
            border-top-right-radius: 6px;
            border-bottom-right-radius: 6px;
            background-color: #e6e6e6;
          }
          .preinstall_money {
            color: #9a9ea4;
            font-size: 10px;
            line-height: 20px;
            margin-top: 0px;
            span {
              color: #ef444b;
            }
          }
        }
      }
    }
  }
  .nodata_tip {
    width: 100%;
    height: 228px;
    line-height: 228px;
    font-size: 14px;
    text-align: center;
    color: #aaaeb3;
  }
  .eorrtip {
    color: #f56c6c;
    font-size: 12px;
    margin-top: 5px;
    margin-left: 30px;
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
#directBuyResouce .el-dialog {
  overflow: hidden;
}
#directBuyResouce
  .resouce_header
  .resouce_form
  .el-form
  .red_yujin
  .el-form-item__label:before {
  content: "*";
  color: #f56c6c;
  margin-right: 4px;
}
#directBuyResouce .resouceGrant .el-input__inner {
  height: 32px !important;
}
#directBuyResouce .adjust_reason .el-form-item__content {
  margin-left: 0px !important;
}
#directBuyResouce .adjust_reason .el-textarea__inner {
  height: 75px;
}
#directBuyResouce .adjust_reason .el-form-item__label {
  text-align: left;
}
#directBuyResouce .Adjust_totle_price {
  margin-bottom: 0px;
}
#directBuyResouce .Adjust_totle_price .el-input__inner {
  background: #fff;
  box-shadow: inset 0px 2px 2px 0px rgba(215, 215, 215, 0.2);
  border-radius: 6px;
  border: solid 1px #d7d7d7;
  padding-right: 40px;
}
#directBuyResouce .money_input {
  margin-right: 20px;
}
#directBuyResouce .money_input .el-input__inner {
  padding-right: 45px;
}
#directBuyResouce .money_input .el-form-item__content {
  width: 140px;
}
#directBuyResouce .sing_red_package .el-form-item__label {
  width: 110px !important;
}
#directBuyResouce .sing_red_package .el-form-item__content {
  margin-left: 110px !important;
}
#directBuyResouce .sing_red_package .yujingPrice {
  margin-right: 0px;
  margin-left: 33px;
}
#directBuyResouce .sing_red_package .addbutton {
  margin-right: 10px;
}
#directBuyResouce .el-input__inner {
  padding-left: 0px;
  font-size: 12px;
}
#directBuyResouce .reouce_code .el-input__inner {
  background: #fff;
  border: solid 1px #d7d7d7;
}
#directBuyResouce .label_msg .el-input {
  width: 230px;
}
#directBuyResouce .label_msg .el-input .el-input__inner {
  background: #fff;
  border: solid 1px #d7d7d7;
}
#directBuyResouce .editNoteDialog .el-dialog__body {
  max-height: 350px;
  overflow-x: auto;
}
#directBuyResouce .editNoteDialog .el-dialog {
  max-height: 480px;
}
#directBuyResouce .editNoteDialog .sendType {
  margin-bottom: 0px;
}
#directBuyResouce .editNoteDialog .sendType .el-form-item__label {
  line-height: normal;
}
#directBuyResouce .editNoteDialog .sendType .el-form-item__content {
  width: 460px;
  float: left;
}
#directBuyResouce .editNoteDialog .sendType .el-radio__label {
  font-size: 12px;
}
#directBuyResouce .editNoteDialog .sendType .el-radio {
  margin-bottom: 10px;
}
#directBuyResouce .editNoteDialog .sendType .el-radio + .el-radio {
  margin-left: 0px;
}
#directBuyResouce .editNoteDialog .sendType .normal_star {
  margin-left: 10px;
  color: red;
}
#directBuyResouce .ediAwardDialog .el-input__inner {
  background-color: #ffffff;
  box-shadow: inset 0px 2px 2px 0px rgba(215, 215, 215, 0.2);
  border-radius: 6px;
  border: solid 1px #d7d7d7;
  font-size: 12px;
}
#directBuyResouce .ediAwardDialog .el-textarea__inner {
  height: 120px;
  font-size: 12px;
  resize: none;
}
#directBuyResouce .redPackageDialog .el-textarea__inner {
  height: 60px;
}
#directBuyResouce .redPackageDialog .el-form-item {
  margin-bottom: 18px;
}
#directBuyResouce .redPackageDialog .redRemark {
  margin-bottom: 15px;
}
#directBuyResouce .warn_dialog .el-radio {
  display: block;
  margin-left: 0px;
  margin-bottom: 20px;
}
#directBuyResouce .warn_dialog .el-dialog__body {
  height: 265px;
  overflow-y: auto;
}
#directBuyResouce .warn_dialog .customRadio {
  margin-bottom: 0px;
}
#directBuyResouce .warn_dialog .el-form-item__error {
  margin-left: 25px;
}
#directBuyResouce .el-input-number {
  width: 150px;
}
#directBuyResouce .el-input-number .el-input-number__decrease,
#directBuyResouce .el-input-number .el-input-number__increase {
  width: 30px;
  height: 32px;
  border: 0px;
  margin-top: 3px;
  background: #d7d7d7;
  color: #393c40;
  line-height: 32px;
}
#directBuyResouce .el-input-number .el-input__inner {
  padding: 0px 40px;
  text-indent: 0px;
}
#directBuyResouce .xiao_time .el-input-number {
  width: 120px;
}
#directBuyResouce .el-button.is-disabled {
  background-image: linear-gradient(41deg, #ffa200 0%, #ffcf00 100%);
  opacity: 0.5;
  color: #fff;
}
#directBuyResouce .noteDialogContent .el-textarea__inner {
  font-size: 12px;
}
#directBuyResouce .upBtn .el-button {
  width: 110px;
  height: 32px;
  background-image: linear-gradient(42deg, #00b4ff 0%, #23d7ff 100%);
  border-radius: 6px;
  border: none;
}
#directBuyResouce .upBtn .el-button span {
  background: url(../../../../assets/images/images/upIcon.png) no-repeat left
    center;
  background-size: 16px 16px;
  padding-left: 20px;
  height: 100%;
  line-height: 32px;
  display: inline-block;
}
#directBuyResouce .personNameNum {
  margin-right: 10px;
}
#directBuyResouce .personNameNum .el-form-item__label {
  width: 110px !important;
  font-size: 12px;
}
#directBuyResouce .personNameNum .el-form-item__content {
  width: 80px;
}
#configRdirectBuyResouceesouce .issueNum .el-form-item__content {
  width: 75px;
}
#directBuyResouce .grantTime .el-date-editor {
  width: 160px;
}
#directBuyResouce .grantTime .el-input__inner {
  padding-left: 20px;
}
#directBuyResouce .showNameListDialog .el-dialog {
  max-height: 470px;
}
#directBuyResouce .showNameListDialog .el-dialog__header {
  border-bottom: 0px;
}
#directBuyResouce .showNameListDialog .el-dialog__body {
  position: relative;
  padding-left: 0px;
  padding-right: 0px;
  padding-bottom: 20px;
  height: 400px;
  overflow-y: scroll;
}
</style>


    