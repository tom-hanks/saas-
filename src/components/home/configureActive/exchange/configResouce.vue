<template>
  <div id="configResouce" v-loading="loadingFlag">
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
      <div class="resouce_form" v-if="isHongbao" key="1" v-loading="hongbaoLoading">
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
            <p class="sing_red_package_title">单个金额红包设置</p>
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
      <!-- 卡密 直冲类表单 -->
      <div class="resouce_card" v-if="isKami" key="2">
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
          </el-form-item>
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
          <el-form-item class="select_resouce warn" label="预警数量" prop="warningNum">
            <el-input
              type="text"
              v-model="resouceFormResources.warningNum"
              placeholder="输入数量"
              maxlength="7"
            ></el-input>
            <!-- <p>
            <i class="red_star">*</i>后台的资源数量</p>-->
          </el-form-item>
          <el-form-item class="select_resouce" label="发放形式" prop="grant">
            <el-select
              v-model="resouceFormResources.grant"
              placeholder="平台码发放"
              @change="changeDistribution"
            >
              <el-option label="平台码发放" value="1"></el-option>
              <el-option label="原始码发放" value="2"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item class="select_resouce" label="预警通知">
            <div
              class="write_text"
              :class="{noEmpty:resouceFormResources.wareNotice != ''}"
              :title="resouceFormResources.wareNotice"
              @click="warnDialog"
            >{{!resouceFormResources.wareNotice == ''?resouceFormResources.wareNotice:'+选择通知'}}</div>
            <p v-if="no_errow" class="rederro">请选择预警通知</p>
          </el-form-item>
          <el-form-item class="select_resouce warn" label="短信文案">
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
          <el-form-item v-if="resouceFormResources.grant == 1" class="select_resouce" label="奖品说明">
            <div
              class="write_text"
              :class="{noEmpty:resouceFormResources.award != ''}"
              :title="resouceFormResources.award"
              @click="awardDialog"
            >{{resouceFormResources.award == ''?'+编辑文案':resouceFormResources.award}}</div>
            <p v-if="no_prize" class="rederro">请填写奖品说明</p>
          </el-form-item>
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
      <table class="resouce_table_list" border="0" cellspacing="0" cellpadding="0">
        <thead>
          <tr class="resouce_table_title">
            <th width="6%">序号</th>
            <th>资源类型</th>
            <th>icon</th>
            <th>资源名称</th>
            <th class="set_num">数量配置(个/张/元）</th>
            <th>发放形式</th>
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
              width="6%"
            >{{(indexallot+1).toString().length == 1?'0'+(indexallot+1):(indexallot+1)}}</td>
            <td>{{itemallote.type_name}}</td>
            <td>
              <img :src="itemallote.icon" alt>
            </td>
            <td
              width="140px"
              :title="itemallote.money?itemallote.app_material_name+itemallote.money+'元':itemallote.app_material_name"
            >
              <p>{{itemallote.money?itemallote.app_material_name+itemallote.money+'元':itemallote.app_material_name}}</p>
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
            <td width="110px" :title="itemallote.notices | noticesBuil">
              <p>{{itemallote.notices | noticesBuil}}</p>
              <p v-if="!itemallote.notices">— —</p>
            </td>
            <td
              width="110px"
              :title="itemallote.prize_title + itemallote.prize_explain == '0'?'原始码没有奖品说明哦':'标题：'+itemallote.prize_title + '内容：'+itemallote.prize_explain"
            >
              <p>{{itemallote.prize_title + itemallote.prize_explain == '0'?'— —':itemallote.prize_title + itemallote.prize_explain}}</p>
            </td>
            <td width="8%">
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
      <div class="noteDialogContent">
        <el-form :model="noteForm" :rules="rules3" ref="noteFormrules3" @submit.native.prevent>
          <div class="label_msg">【
            <el-form-item prop="msgTable">
              <el-input
                type="text"
                v-model="noteForm.msgTable"
                auto-complete="off"
                maxlength="10"
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
            <span>{{baseCode}}</span>
          </div>
          <!-- 平台码 需要去某某平台兑换 -->
          <div class="reouce_code" v-if="resouceFormResources.grant == 1">
            <span>，凭{code}</span>
            <el-form-item prop="textThree">
              <el-input
                type="text"
                v-model="noteForm.textThree"
                auto-complete="off"
                maxlength
                placeholder="上某某"
              ></el-input>
              <!-- <span>兑奖平台【链接】</span> -->
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
        </el-form>
      </div>
      <div class="official">
        <p>
          <span>*</span>文案预览
        </p>
        <div class="official_look">
          【{{noteForm.msgTable}}】
          {{noteForm.textOne}}
          {{resouceFormResources.grant == 1?'，凭{code}':'，凭{code}激活兑奖码即可使用,'}}
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
            maxlength
            placeholder="示例：恭喜您获得爱奇艺月卡"
          ></el-input>
        </el-form-item>
        <el-form-item prop="explain" label="奖品说明">
          <el-input
            type="textarea"
            v-model="awardForm.explain"
            auto-complete="off"
            maxlength
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
              <el-button
                class="fr addbutton addEmli"
                :disabled="redawardFormalert.disabled"
                title="增加"
                @click="redAddwaremails"
              >增加</el-button>
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
        :key="tiform"
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
            <el-input v-model="adjustFormAlert.adjustMoney" maxlength="7" placeholder="请填写金额"></el-input>
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
    <saas-dialog :html="html" v-if="showSaasDialog"></saas-dialog>
  </div>
</template>
<script>
import { httpServer, apiSetting } from "../../../../assets/js/http.js";
const saasDialog = () =>
  import(/* webpackChunkName:"dialog" */ "../../../dialog/dialog");
export default {
  name: "configResouce",
  props: {
    stepModel: null
  },
  components: {
    saasDialog
  },
  data() {
    return {
      tabList: ["红包类", "直冲类", "卡密类"],
      tabActive: 0,
      isHongbao: false, // 是否是红包配置的标识
      isKami: false,
      material_type_id: 0, //选中的tabid
      appid: 0,
      template_id: "",
      hongbaoLoading: true, //红包的上部分遮罩
      no_data: false, //没有资源配置的时候暂无数据的时候显示
      material_id: "", //资源id
      material_idArray: [], //已配置列表的资源id的数组
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
        grant: "1", // 发放形式 平台grant=1，原始grant=2
        warningNum: "", // 预警数量
        wareNotice: "", //预警通知
        waremails: [],
        note: "", //短信文案
        award: "", //奖品说明
        time: "",
        num1: 0, // 有效时长的值
        tipAllocation_count: "" //卡密的后台带过来的数据
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
            pattern: /^[0-9]+([.]{1}[0-9]+){0,1}$/,
            message: "请输入纯数字的预警金额"
          },
          {
            validator: (rule, value, callback) => {
              console.log(Number(value));
              if (Number(value) < 0.3 || Number(value) > 200) {
                callback(new Error("*必须在0.3~200之间"));
              } else {
                callback();
              }
              if (this.redPackageForm.totleMoney == "") {
                if (value > parseFloat(this.redPackageForm.balance)) {
                  callback(new Error("*不得大于所剩额度"));
                } else {
                  callback();
                }
              }

              if (parseFloat(this.redPackageForm.totleMoney)) {
                if (value > parseFloat(this.redPackageForm.totleMoney)) {
                  callback(new Error("*不得大于总额度"));
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
        ],
        textTwo: [
          {
            required: true,
            message: "请输入文案",
            trigger: "change"
          }
        ],
        textThree: [
          {
            required: true,
            message: "请输入文案",
            trigger: "change"
          }
        ],
        msgTable: [
          {
            required: true,
            message: "请输入短信标签",
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
        ],
        explain: [
          {
            required: true,
            message: "请输入奖品说明",
            trigger: "change"
          }
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
        msgTable: ""
      },
      isYanshima: true, // 是原始码还是平台码的短信
      baseCode: "，凭{code}激活兑奖码即可使用，",
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
      tiform: "1" //提额表单的唯一性
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
          return val.replace("{0}", warningNum + "元   ");
        }
      }
    }
  },

  mounted() {
    window.scrollTo(0, 0);
    // alert(this.stepModel.type_ename);
    console.log("父组建的参数");
    // console.log(this.stepModel);
    // if (this.stepModel.appid == 0) {
    //     console.log(this.stepModel);
    //     return false;
    // }
    this.template_id = this.$getsessionStorage("template_id"); //上一层传过来的模板赋值
    console.log("templae");
    console.log(this.template_id);
    this.appid = this.$getsessionStorage("appid");
    this.getTypelist();
    this.getMaterialallotlist();
  },
  methods: {
    preview() {
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
      this.tiform = index; //提额表单公用 区分唯一性

      if (index == "1") {
        this.total = true;
        this.adjustFormAlert.adjustMoney = this.redPackageForm.allocation_count;
      } else if (index == "2") {
        this.total = false;
        this.adjustFormAlert.adjustMoney = this.redPackageForm.warning_count;
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
      console.log("短信");

      this.$refs.noteFormrules3.validate(valid => {
        if (valid) {
          // 判断短信是不是为空  noteFormrules3
          if (this.noteForm.textOne) {
            this.resouceFormResources.note =
              this.noteForm.msgTable +
              this.noteForm.textOne +
              this.noteForm.textThree +
              this.noteForm.textTwo; //替换掉短信文案框里的内容
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
      // this.VerificationresouceFormResources();
      console.log(
        JSON.stringify({
          title: "【" + this.noteForm.msgTable + "】" + this.noteForm.textOne,
          shorturl:
            this.resouceFormResources.grant == 2
              ? "，凭{code}激活兑奖码即可使用，"
              : "，凭{code}" + this.noteForm.textThree,
          content: this.noteForm.textTwo
        })
      );
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
          this.awardForm.explain = this.awardForm.explain.replace(
            /\r\n/g,
            "<br/>"
          ); //IE9、FF、chrome
          this.awardForm.explain = this.awardForm.explain.replace(
            /\n/g,
            "<br/>"
          ); //IE7-8
          this.awardForm.explain = this.awardForm.explain.replace(/\s/g, " "); //空格处理
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
      console.log("谁的选择");
      // console.log(this.awardFormalert.radio2);
      // this.$refs.warningForm.resetFields();
      // if (this.tabActive != "hongbao") {
      if (this.resouceFormResources.warningNum) {
        this.showWarndDialog = true;
        this.getworningNoticeList();
        // this.$nextTick(() => {
        //     this.$refs.warningForm.resetFields();
        //     console.log("谁的选择2");
        //     console.log(this.awardFormalert.radio2);
        // });
      } else {
        this.$message({
          message: "请先填写预警数量",
          duration: 1000
        });
      }
      // }
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
      // this.$refs["warningForm"].resetFields();
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
            this.redPackageForm.warning_count + "元"
          );
          console.log(this.redPackageForm.wareNotice);
        });
      }
    },
    radio2change(value) {
      // this.$refs["warningForm"].resetFields();
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
          if (this.tabActive == "hongbao") {
            this.resouceFormResources.wareNotice = obj.dic_cname.replace(
              "{0}",
              this.redPackageForm.warnMoney + "元"
            );
          } else {
            this.resouceFormResources.wareNotice = obj.dic_cname.replace(
              "{0}",
              this.resouceFormResources.warningNum
            );
          }
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
      if (this.material_idArray.indexOf(this.material_id) != -1) {
        this.$message({
          message: "此资源已经配置过，不可再配置",
          duration: 1000
        });
        return false;
      }
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
      this.$refs.resouceFormResources.validate(valid => {
        //验证合格后执行
        if (valid) {
          // alert("ssss");
          // this.awardFormalert.radio2 = "";
          if (!this.no_errow && !this.no_messge && !this.no_prize) {
            this.addloading = true;
            this.kamiAxios();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
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
          // this.redPackageForm.singRedPackage= '';
          // this.resetResouceFormResources(); //重置表单
          // this.getMaterialallotlist();
        })
        .catch(error => {
          this.loginContent.onColse = false;
          console.log(error); //loading层关闭
        });
    },
    kamiAxios() {
      httpServer(apiSetting.postmidmaterialallot, {
        app_id: this.appid,
        template_id: this.template_id,
        app_material_id: this.resouceFormResources.resouceFormResourcestext, //选择资源的id
        amount: this.resouceFormResources.resouceNum, //红包的总额或者资源数量
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
        notices: JSON.stringify({
          title: "【" + this.noteForm.msgTable + "】" + this.noteForm.textOne,
          shorturl:
            this.resouceFormResources.grant == 2
              ? "，凭{code}激活即可使用，"
              : "，凭{code}" + this.noteForm.textThree + "兑奖平台{链接}",
          content: this.noteForm.textTwo
        }), //短信拼接的文案
        prize_title:
          this.resouceFormResources.grant == 2 ? "" : this.awardForm.title, //奖品信息的 title  如果是原始码的情况下传空
        prize_explain:
          this.resouceFormResources.grant == 2 ? "" : this.awardForm.explain //奖品的主体信息 explain   如果是原始码的情况下传空
      })
        .then(response => {
          console.log("提交的返回");
          // console.log(response);
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
          // ----------------------------------------------------
          this.addloading = false;
          this.$refs["noteFormrules3"].resetFields();
          this.resetResouceFormResources(); //重置表单
          this.getMaterialallotlist();
        })
        .catch(error => {
          this.loginContent.onColse = false;
          console.log(error); //loading层关闭
        });
    },
    // 红包 卡密 直冲tab切换
    tabActiveFun(tabname, tabid) {
      // console.log(tabid);
      this.tabActive = tabname;
      this.material_type_id = tabid;
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
      // this.$nextTick(function() {
      if (this.$refs["noteFormrules3"]) {
        this.$refs["noteFormrules3"].resetFields();
      }
      if (this.$refs["awardForm"]) {
        this.$refs["awardForm"].resetFields(); //重置弹窗的参数
      }
      // });

      // 红包表单验证重置
      this.redPackageFormAlert.iserror = false;
      this.redPackageFormAlert.redwareNoticeiseorr = false;
      this.redPackageFormAlert.redyujinerro = false;
      this.awardFormalert.radio2 = ""; //重置通知单选框，因为卡密和红包的这里共用
      this.awardFormalert.disabled = true;
      this.awardFormalert.istextTip = false;
      this.redawardFormalert.istextTip = false;
      if (this.tabActive == "hongbao") {
        this.isHongbao = true;
        this.isKami = false;
        this.getworningNoticeList();
        this.$nextTick(function() {
          this.$refs["redPackageForm"].resetFields(); //重置红包表单验证
          this.redPackageForm.allocation_count = "";
          this.redPackageForm.warning_count = "";
        });
      } else if (this.tabActive == "kami") {
        this.isHongbao = false;
        this.isKami = true;
        this.$nextTick(function() {
          this.$refs["resouceFormResources"].resetFields(); //重置表单验证
          this.resouceFormResources.grant = "1";
        });
      } else if (this.tabActive == "zichong") {
        this.isHongbao = false;
        this.isKami = true;
        this.$nextTick(function() {
          this.$refs["resouceFormResources"].resetFields(); //重置表单验证
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
      // console.log(value);
      // 以下是单选项传item里的所有东西，而不仅仅是value
      let obj = {};
      obj = this.resouceFormResources.resouceItem.find(item => {
        //这里的userList就是上面遍历的数据源
        return item.id === value; //筛选出匹配数据
      });
      console.log("选择的资源");
      this.material_id = obj.material_id;
      // console.log(obj.allocation_count);
      this.resouceFormResources.tipAllocation_count = obj.allocation_count;
      this.resouceFormResources.resouceNum = obj.allocation_count;
      // this.resouceFormResources.wareNotice = obj.dic_cname.replace(
      //     "{0}",
      //     this.resouceFormResources.warningNum
      // );
    },
    // 选择有效时长
    changeDistribution(value) {
      this.noteForm.textOne = "";
      this.noteForm.textTwo = "";
      this.noteForm.textThree = "";
      //预警通知
      this.resouceFormResources.wareNotice = "";
      this.awardFormalert.radio2 = "";
      this.resouceFormResources.waremails = [];
      //短信通知
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

      // console.log(value);
    },
    // 发放形式
    changedate(value) {
      console.log(value);
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
          }
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
                      $eimt.redPackageForm.warning_count + "元   "
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
      this.$refs["resouceFormResources"].resetFields(); //重置表单验证
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
      this.$router.push({ name: "configPlatform" });
      // this.configResouce.isshow = true;
      this.configResouce.shownum = 3;
      this.configResouce.step = 4; //步骤第四部
      this.$emit("changeStep", this.configResouce);
    }
  }
};
</script>
<style lang="less" scoped>
#configResouce {
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
        .sing_red_package_title {
          color: #aaaeb3;
          font-size: 14px;
          margin-bottom: 10px;
        }
      }
    }
    .resouce_card {
      height: 224px;
      padding: 20px 20px 0px 20px;
      overflow: hidden;
      .el-form-item {
        float: left;

        .write_text {
          width: 120px;
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
        width: 225px;
        margin-right: 80px;
        .tipResouceNum {
          height: 18px;
          line-height: 18px;
          color: #9a9ea4;
          font-size: 10px;
        }
      }
      .select_resouce {
        /deep/.el-form-item__label:before {
          content: "*";
          color: #f56c6c;
          margin-right: 4px;
        }
      }
      .warn {
        margin-right: 0px;
      }
      .xiao_time {
        margin-right: 89px;
      }
      .addbutton {
        margin-bottom: 20px;
      }
    }
  }
  .addbutton {
    margin-top: 5px;
    margin-right: 30px;
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
          padding-left: 10px;
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
            width: 125px;
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
      //


      margin-top: 20px;
      span {
        float: left;
        margin-top: 10px;
        margin-bottom: 15px;
      }
      .el-form-item {
        width: 330px;
        float: left;
        margin: 0 20px;
        margin-bottom: 20px;
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
}
</style>
<style lang="less">
#configResouce {
  .adjust_reason {
    .el-form-item__content {
      margin-left: 0px !important;
    }
    .el-textarea__inner {
      height: 75px;
    }
    .el-form-item__label {
      text-align: left;
    }
  }
  .Adjust_totle_price {
    margin-bottom: 0px;
    .el-input__inner {
      background: #fff;
      box-shadow: inset 0px 2px 2px 0px rgba(215, 215, 215, 0.2);
      border-radius: 6px;
      border: solid 1px #d7d7d7;
      padding-right: 40px;
    }
  }

  .money_input {
    margin-right: 20px;
    .el-input__inner {
      padding-right: 45px;
    }
    .el-form-item__content {
      width: 140px;
    }
  }
  .sing_red_package {
    .el-form-item__label {
      width: 110px !important;
    }
    .el-form-item__content {
      margin-left: 110px !important;
    }
    .yujingPrice {
      margin-right: 0px;
      margin-left: 33px;
    }
    .addbutton {
      margin-right: 10px;
    }
  }
  .el-input__inner {
    padding-left: 0px;
    font-size: 12px;
  }
  .reouce_code {
    .el-input__inner {
      background: #fff;
      border: solid 1px #d7d7d7;
    }
  }
  .label_msg {
    .el-input {
      width: 230px;
      .el-input__inner {
        background: #fff;
        border: solid 1px #d7d7d7;
      }
    }
  }
  .editNoteDialog {
    .el-dialog__body {
      max-height: 350px;
      overflow-x: auto;
    }
    .el-dialog {
      max-height: 480px;
    }
  }
  .ediAwardDialog {
    .el-input__inner {
      background-color: #ffffff;
      box-shadow: inset 0px 2px 2px 0px rgba(215, 215, 215, 0.2);
      border-radius: 6px;
      border: solid 1px #d7d7d7;
      font-size: 12px;
    }
    .el-textarea__inner {
      height: 120px;
      font-size: 12px;
      resize: none;
    }
  }
  .redPackageDialog {
    .el-textarea__inner {
      height: 60px;
    }
    .el-form-item {
      margin-bottom: 18px;
    }
    .redRemark {
      margin-bottom: 15px;
    }
  }
  .warn_dialog {
    .el-radio {
      display: block;
      margin-left: 0px;
      margin-bottom: 20px;
    }
    .el-dialog__body {
      height: 265px;
      overflow-y: auto;
    }
    .customRadio {
      margin-bottom: 0px;
    }
    .el-form-item__error {
      margin-left: 25px;
    }
  }
  .el-input-number {
    width: 150px;
    .el-input-number__decrease,
    .el-input-number__increase {
      width: 30px;
      height: 32px;
      border: 0px;
      margin-top: 3px;
      background: #d7d7d7;
      color: #393c40;
      line-height: 32px;
    }
    .el-input__inner {
      padding: 0px 40px;
      text-indent: 0px;
    }
  }
  .xiao_time {
    .el-input-number {
      width: 120px;
    }
  }
  .el-button.is-disabled {
    background-image: linear-gradient(41deg, #ffa200 0%, #ffcf00 100%);
    opacity: 0.5;
    color: #fff;
  }
  .noteDialogContent {
    .el-textarea__inner {
      font-size: 12px;
    }
  }
}
</style>

    