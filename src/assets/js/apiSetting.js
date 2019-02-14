let httpApi = function () {
    let vUrl = null;

    if (process.env.NODE_ENV == 'production') { //线上环境
        vUrl = window.location.origin + "/api"; //获取当前地址
    } else {
        vUrl = process.env.API_ROOT + "/api"; //获取当前地址
    }
    // console.log('全局接口')
    // console.log(process.env.NODE_ENV)
    // console.log(window.location.origin)

    // switch (window.location.host.toLowerCase()) {
    // case "saas.yget.me":
    //     vUrl = "http://saas.yget.me/api"
    //     break;
    // case "test-saas.yget.me":
    //     vUrl = "http://test-saas.yget.me/api"
    //     break;
    // }
    return vUrl;
};
const ossApi = "http://esmartsaas.oss-cn-hangzhou.aliyuncs.com";
let serviceModule = {
    // 读取oss公共域名  抛出
    urlossApi: {
        url: ossApi
    },
    getMid_notify: { //提示状态的接口 比如：通过显示勾号，驳回显示叹号
        url: httpApi() + '/mid_notify/get_list', //接口网址
        method: 'get',
        ispage: false
    },
    deleteMid_notify: { //删除提示状态的接口 比如：通过显示勾号，驳回显示叹号 查看完消失
        url: httpApi() + '/mid_notify', //接口网址
        method: 'delete',
        ispage: false
    },
    postMid_notify: { //删除消息或者减少消息（新版）
        url: httpApi() + '/mid_notify/reduce', //接口网址
        method: 'post',
        ispage: false
    },
    getAppTypeList: { //请求首页活动模块的导航tab类型
        url: httpApi() + '/app/get_app_type_list', //接口网址
        method: 'get', //请求方式
        ispage: false, //是否分页
        dataList: {}, //分页数据列表
        page: {} //分页对象，page.js的对象
    },
    getAppList: { //活动模块选项卡
        url: httpApi() + '/app/get_list',
        method: 'get',
        ispage: true,
        dataList: {},
        page: {}
    },
    getRganizationAppList: { //管理人员的活动管理接口
        url: httpApi() + '/app/get_organization_app_list',
        method: 'get',
        ispage: true,
        dataList: {},
        page: {}
    },
    getFlowList: { //获取页面流程
        url: httpApi() + '/mid_flow_rule/get_flow_list',
        method: 'get',
        ispage: true,
        dataList: {},
        page: {}
    },
    postLogin: {
        url: httpApi() + '/account/sign_in', //登陆接口
        method: 'post',
        ispage: false,
    },
    getMenus: {
        url: httpApi() + '/menu', //获取菜单
        method: 'get',
        ispage: false,
    },
    memberList: {
        url: httpApi() + '/user/list', //获取成员列表接口
        method: 'get',
        ispage: true,
        dataList: {},
        page: {}
    },
    organization: {
        url: httpApi() + '/organization', //组织的信息
        method: 'get',
        ispage: false,
    },
    addDepartment: {
        url: httpApi() + '/department', //新增部门
        method: 'post',
        ispage: false,
    },
    editDepartment: {
        url: httpApi() + '/department', //编辑部门
        method: 'put',
        ispage: false,
    },
    deleteDepartment: {
        url: httpApi() + '/department', //删除部门
        method: 'delete',
        ispage: false,
    },
    getUser: {
        url: httpApi() + '/user', //编辑的时候要更具用户的id获取数据
        method: 'get',
        ispage: false,
    },
    editUser: {
        url: httpApi() + '/user/user_edit', //编辑有户信息
        method: 'put',
        ispage: false,
    },
    buttonPower: {
        url: httpApi() + '/menu/button_power', //权限接口
        method: 'get',
        ispage: false,
    },
    departmentUser: {
        url: httpApi() + '/department/by_user_id', //获取用户当前所的部门
        method: 'get',
        ispage: false,
    },
    deletUser: {
        url: httpApi() + '/user', //删除当前用户
        method: 'delete',
        ispage: false,
    },
    organizationAll: {
        url: httpApi() + '/department/by_organization_id', //获取用户当前所的部门
        method: 'get',
        ispage: false,
    },
    positionUser: {
        url: httpApi() + '/position/by_user_id', //获取用户当前岗位
        method: 'get',
        ispage: false,
    },
    positionAll: {
        url: httpApi() + '/position', //获取用户当前所有岗位
        method: 'get',
        ispage: false,
    },
    getorganizationMenu: {
        url: httpApi() + '/menu/by_user_id', //获取用户当前所有岗位
        method: 'get',
        ispage: false,
    },
    putUser: {
        url: httpApi() + '/user', //编辑的时候要更具用户的id获取数据
        method: 'put',
        ispage: false,
    },
    postUser: {
        url: httpApi() + '/user', //编辑的时候要更具用户的id获取数据
        method: 'post',
        ispage: false,
    },
    getThisuser: {
        url: httpApi() + '/user/get_this_user', //获取当前用户的身份信息
        method: 'get',
        ispage: false,
    },
    getAllotlist: {
        url: httpApi() + '/app/get_allot_list', //项目分配table选项
        method: 'get',
        ispage: true,
        dataList: {},
        page: {}
    },
    getAppTypeCount_list: { //项目分配的tab导航获取
        url: httpApi() + '/app/get_app_type_app_count_list',
        method: 'get',
        ispage: false,
    },
    getCoundBycode: {
        url: httpApi() + '/app/cound_by_code', //获取当前用户的身份信息
        method: 'get',
        ispage: false,
    },
    getByPerationer: {
        url: httpApi() + '/app/by_app_operationer', //项目分配点击分配的时候返回选中状态
        method: 'get',
        ispage: false,
    },
    putDistribution: {
        url: httpApi() + '/app/distribution_app_to_user', //项目分配点击分配的时候返回选中状态
        method: 'put',
        ispage: false,
    },
    getDepart_user: {
        url: httpApi() + '/organization/depart_user', //获取三级联动的部门组织，岗位，人员信息
        method: 'get',
        ispage: false,
    },
    getAppinfoById: {
        url: httpApi() + '/app/get_app_info_by_id', //获取兑奖平台项目配置的必要参数
        method: 'get',
        ispage: false,
    },
    putAppset: {
        url: httpApi() + '/app/app_set', //获取兑奖平台项目配置的提交接口
        method: 'put',
        ispage: false,
    },
    getTypelist: {
        url: httpApi() + '/mid_appmaterial/get_type_list', //获取兑奖平台资源配置的type类型接口 红包，直冲类，卡密类
        method: 'get',
        ispage: false,
    },
    getlistByTypeid: {
        url: httpApi() + '/mid_appmaterial/get_list_by_type_id', //兑奖平台资源配置 根据type的id来获取相应的配置
        method: 'get',
        ispage: false,
    },
    deleteMidmaterialallot: {
        url: httpApi() + '/mid_appmaterial/delete_mid_material_allot', //兑奖平台资源配置 根据type的id来获取相应的配置
        method: 'delete',
        ispage: false,
    },
    postmidmaterialallot: {
        url: httpApi() + '/mid_appmaterial/add_mid_material_allot_sec', //兑奖平台资源配置 卡密提交
        method: 'post',
        ispage: false,
    },
    getMaterialallotlist: {
        url: httpApi() + '/mid_appmaterial/get_material_allot_list', //兑奖平台已配置规则表格获取
        method: 'get',
        ispage: false,
    },
    getMidMaterialAllotNoticePrizes: {
        url: httpApi() + '/mid_appmaterial/get_mid_material_allot_notice_prizes	', //兑奖平台已配置规则表格获取
        method: 'get',
        ispage: false,
    },
    getworningNoticeList: {
        url: httpApi() + '/mid_appmaterial/get_warning_notice_list', //资源配置获取邮箱列表
        method: 'get',
        ispage: false,
    },
    getAppTemplate: {
        url: httpApi() + '/mid_template/get_app_template', //兑换项目-获取项目模版信息
        method: 'get',
        ispage: false,
    },
    deleteMidBanner: {
        url: httpApi() + '/mid_template_banner/delete', //兑换项目-平台配置-删除banner
        method: 'delete',
        ispage: false,
    },
    getMidBannerList: {
        url: httpApi() + '/mid_template_banner/get_list', //兑换项目-平台配置-获取banner列表
        method: 'get',
        ispage: false,
    },
    postMidBanner: {
        url: httpApi() + '/mid_template_banner/save', //兑换项目-平台配置-添加banner列表
        method: 'post',
        ispage: false,
    },
    putPrizeUpdate: {
        url: httpApi() + '/mid_appmaterial/prize_update', //兑换项目-平台配置-修改中奖说明
        method: 'put',
        ispage: false,
    },
    putMidMaterialAllotPrizeExplainEdit: {
        url: httpApi() + '/mid_material_allot_prize_explain/mid_material_allot_prize_explain_edit', //兑换项目-平台配置-修改中奖说明
        method: 'post',
        ispage: false,
    },
    postNoticeUpdate: {
        url: httpApi() + '/mid_material_allot_notice/mid_material_allot_notice_update', //第三步配置平台码短信的保存接口
        method: 'post',
        ispage: false,
    },
    putMaterial: {
        url: httpApi() + '/mid_appmaterial/update_app_material_allocation_count', //修改后台配置资源的 授权数量
        method: 'put',
        ispage: false,
    },
    putTrigger_amount: {
        url: httpApi() + '/mid_appmaterial/update_app_material_trigger_amount', //修改后台资源的预警金额
        method: 'put',
        ispage: false,
    },
    putWarning: {
        url: httpApi() + '/mid_appmaterial/update_app_material_warning', //修改后台资源预警
        method: 'put',
        ispage: false,
    },
    getMoney_balance: {
        url: httpApi() + '/mid_appmaterial/get_material_money_balance', //根据后台分配的资源ID得到当前资源红包余额
        method: 'get',
        ispage: false,
    },
    appDetailTop: {
        url: httpApi() + '/app/get_app_details_top', //兑换项目-活动预览  上半部分
        method: 'get',
        ispage: false,
    },
    appWaitVerified: {
        url: httpApi() + '/app/app_wait_verified', //兑换项目-活动预览  发送审核
        method: 'put',
        ispage: false,
    },
    appDetailUnder: {
        url: httpApi() + '/app/get_exchange_app_details_under', //兑换项目-活动预览  下半部分
        method: 'get',
        ispage: false,
    },
    appDirectDetailUnder: {
        url: httpApi() + '/app/get_direct_app_details_under', //直采项目-活动预览  下半部分
        method: 'get',
        ispage: false,
    },
    getAppElementList: {
        url: httpApi() + '/mid_element/get_app_element_list', //获得页面元素列表
        method: 'get',
        ispage: false,
    },
    getOssConfig: {
        url: httpApi() + '/oss_config', //获得上传图片的参数
        method: 'get',
        ispage: false,
    },
    postMidTempate: {
        url: httpApi() + '/mid_template/save', //获得上传图片的参数
        method: 'post',
        ispage: false,
    },
    getPageElement: {
        url: httpApi() + '/mid_page_element/get_page_element', //获得上传图片的参数
        method: 'get',
        ispage: false,
    },
    addMidMaterialRedPacket: {
        url: httpApi() + '/mid_appmaterial/add_mid_material_red_packet', //添加红包祝福语
        method: 'post',
        ispage: false,
    },
    appRejec: {
        url: httpApi() + '/app/app_reject', //活动审核驳回
        method: 'put',
        ispage: false,
    },
    appVerified: {
        url: httpApi() + '/app/app_verified', //活动审核通过
        method: 'put',
        ispage: false,
    },
    getAppTypeVerifiedCountList: {
        url: httpApi() + '/app/get_app_type_verified_count_list', //活动审核导航的权限
        method: 'get',
        ispage: false,
    },
    getVerifiedList: {
        url: httpApi() + '/app/get_verified_list', //活动审核列表的权限
        method: 'get',
        ispage: true,
        dataList: {}, //分页数据列表
        page: {} //分页对象，page.js的对象
    },
    getRejectreason: {
        url: httpApi() + '/app/get_rejectreason', //活动审核查看驳回原因
        method: 'get',
        ispage: false,
    },
    countVerifiedBystatus: {
        url: httpApi() + '/app/count_verified_by_status', //活动审核上半部分统计
        method: 'get',
        ispage: false,
    },
    countByStatus: {
        url: httpApi() + '/app/count_by_status', //活动管理上部分
        method: 'get',
        ispage: false,
    },
    appDownline: {
        url: httpApi() + '/app/app_urgent_downline', //紧急下线接口
        method: 'put',
        ispage: false,
    },
    appAddRosterAudit: {
        url: httpApi() + '/app/app_add_roster_audit', //增加名单 发送审核
        method: 'put',
        ispage: false,
    },
    postUpload: {
        url: httpApi() + '/mid_appmaterial/up_load_material_users', //直采导入名单
        method: 'post',
        ispage: false,
    },
    newPostUpload: {
        url: httpApi() + '/mid_appmaterial/up_load_material_users_list', //新版的   直采导入名单
        method: 'post',
        ispage: false,
    },
    getAllotResouceList: {
        url: httpApi() + '/mid_appmaterial/get_mid_material_allot_list', //新版的 根据项目id获取已配置资源列表
        method: 'get',
        ispage: false,
    },
    getNoticeTemplates: {
        url: httpApi() + '/mid_notice_template/get_notice_templates', //新版的 根据项目id获取已配置资源列表
        method: 'get',
        ispage: false,
    },
    warningEdit: {
        url: httpApi() + '/mid_warning/mid_warning_edit', //新版的   中台资源配置 预警 修改
        method: 'post',
        ispage: false,
    },
    noticeEdit: {
        url: httpApi() + '/mid_material_allot_notice/mid_material_allot_notice_edit', //新版的   中台资源配置 短信文案 修改
        method: 'post',
        ispage: false,
    },
    allotCommonEdit: {
        url: httpApi() + '/mid_appmaterial/mid_material_allot_common_edit', //新版的   中台资源配置公共修改方法
        method: 'post',
        ispage: false,
    },
    getDirectUsers: {
        url: httpApi() + '/mid_direct_user/get_material_direct_users', //新版的 查看名单模板
        method: 'get',
        ispage: true,
        dataList: {},
        page: {}
    },
    upMaterialAllotUsers: {
        url: httpApi() + '/mid_appmaterial/up_load_material_allot_users', //新版的  单条资源重新导入用户名单
        method: 'post',
        ispage: false,
    },
    getDownload: {
        url: process.env.NODE_ENV == 'production' ? window.location.origin + '/Files/Template/charge_contacts.xlsx' : process.env.API_ROOT + '/Files/Template/charge_contacts.xlsx', //下载名单模板
        method: 'get',
        ispage: false,
    },
    downLoadUrl: {
        url: process.env.NODE_ENV == 'production' ? window.location.origin : process.env.API_ROOT, //导出到本地,的域名 此处公用
        method: 'get',
        ispage: false,
    },
    chromeDownloadWin: {
        url: 'http://esmartsaas.oss-cn-hangzhou.aliyuncs.com/SAASFiles/ChromeStandaloneSetup64.exe', //下载chrome win
        method: 'get',
        ispage: false,
    },
    chromeDownloadMac: {
        url: 'http://esmartsaas.oss-cn-hangzhou.aliyuncs.com/SAASFiles/GoogleChrome-70.0.3538.77.dmg', // //下载chrome mac
        method: 'get',
        ispage: false,
    },
    summaryExchangeReport: {
        url: httpApi() + '/report/summary_exchange_report', //数据报表统计的canvas部分
        method: 'get',
        ispage: false,
    },
    reportGetAppTypeList: { //数据报表 列表tab分类
        url: httpApi() + '/report/get_app_type_list',
        method: 'get',
        ispage: false,
        dataList: {},
        page: {}
    },
    reportGetAppList: { //数据报表活动模块选项卡
        url: httpApi() + '/report/get_app_list',
        method: 'get',
        ispage: true,
        dataList: {},
        page: {}
    },
    getMaterialInfo: { //数据报表 授权资源数
        url: httpApi() + '/mid_appmaterial/get_material_info',
        method: 'get',
        ispage: false
    },
    getUseMaterialByAppId: { //数据报表 发放时间  已使用资源
        url: httpApi() + '/mid_appmaterial/get_use_material_by_app_id',
        method: 'get',
        ispage: false
    },
    getUsedirectUser: { //已使用资源 带剩余数量的
        url: httpApi() + '/mid_direct_user/get_use_material_by_app_id',
        method: 'get',
        ispage: false
    },
    reportGetAppSummary: { //数据报表 数据兑换的canvas部分
        url: httpApi() + '/report/get_app_summary',
        method: 'get',
        ispage: false
    },
    reportGetApprderList: { //数据报表表格部分
        url: httpApi() + '/report/get_app_order_list',
        method: 'get',
        ispage: true,
        dataList: {},
        page: {}
    },
    exportDailyReportSum: { //数据报表 邮箱通知部分
        url: httpApi() + '/report/export_daily_report_sum',
        method: 'post',
        ispage: false
    },
    exportDetails: { //订单报表 邮箱通知部分
        url: httpApi() + '/report/export_details',
        method: 'post',
        ispage: false
    },
    orderGetAppTypeList: {
        url: httpApi() + '/order/get_app_type_list', //我的订单的table导航
        method: 'get',
        ispage: false,
    },
    ordergetAppOrder: {
        url: httpApi() + '/order/get_app_orders', //我的订单的 卡片列表
        method: 'get',
        ispage: true,
        dataList: {},
        page: {}
    },
    ordergetApprderInfo: {
        url: httpApi() + '/order/get_order_count', //我的订单的 订单数据 纯数字统计展示、总量，成功，失败
        method: 'get',
        ispage: false
    },
    ordergetMaterialNameList: {
        url: httpApi() + '/order/get_mid_use_material_by_app_id', //我的订单的 筛选条件的资源名称接口【获取中台使用资源接口】
        method: 'get',
        ispage: false
    },
    ordergetOrderList: {
        url: httpApi() + '/order/get_app_order_list', //我的订单的 主订单接口【得到一个项目的订单列表（主订单）】*
        method: 'get',
        ispage: true,
        dataList: {},
        page: {}
    },
    ordergetChildrenOrderList: {
        url: httpApi() + '/order/get_app_son_order_list', //我的订单的 子订单接口【得到一个项目的订单列表（子订单）】*
        method: 'get',
        ispage: false
    },
    getHomeMyAppCount: {
        url: httpApi() + '/app/home_my_app_count', //欢迎页  我的活动
        method: 'get',
        ispage: false
    },
    gethomeStatusAppCount: {
        url: httpApi() + '/app/home_status_app_count', //欢迎页  待分配/待审核活动
        method: 'get',
        ispage: false
    },
    getHomeYearDataCount: {
        url: httpApi() + '/app/home_year_data_count', //欢迎页  待分配/待审核活动
        method: 'get',
        ispage: false
    },
    updatePhoneResendMessage: {
        url: httpApi() + '/order/update_phone_re_send_message', //我的订单的 订单数据重新发送手机号码
        method: 'get',
        ispage: false
    },
    orderGetsmsInfos: {
        url: httpApi() + '/order/get_sms_infos', //我的订单的 订单数据查看记录
        method: 'get',
        ispage: false
    },
    upLoadUsers: {
        url: httpApi() + '/mid_direct_user/up_load_users', //继续导入Excel，增加导入名单
        method: 'post',
        ispage: false
    },
    createDirectBatch: {
        url: httpApi() + '/mid_direct_user/create_direct_batch', //增加整条数据接口
        method: 'post',
        ispage: false
    },
    getDirectBatchList: {
        url: httpApi() + '/mid_direct_user/get_direct_batch_list', //获取批次
        method: 'get',
        ispage: false
    },
    getDirectUserList: {
        url: httpApi() + '/mid_direct_user/get_direct_user_list', //获取批次
        method: 'get',
        ispage: true,
        dataList: {},
        page: {}
    },
    deleteDirectBatch: {
        url: httpApi() + '/mid_direct_user/delete_direct_batch', //删除批次
        method: 'delete',
        ispage: false
    },
    delayApply: {
        url: httpApi() + '/app/app_delay_apply', //延期下线
        method: 'put',
        ispage: false
    },
    getAppStateInfo: {
        url: httpApi() + '/app/get_app_state_info', //申请理由
        method: 'get',
        ispage: false
    },
    downExportUsers: {
        url: httpApi() + '/mid_direct_user/export_users', //导出用户名单到Excel
        method: 'get',
        ispage: false
    },
    getMilestones: {
        url: httpApi() + '/milestone/get_milestones', //导出用户名单到Excel
        method: 'get',
        ispage: true,
        dataList: {},
        page: {}
    },
    get_source_code_notice_templates: {
        url: httpApi() + '/mid_notice_template/get_source_code_notice_templates', //配置第三步 短信文案编辑的模板短信
        method: 'get',
        ispage: false
    },
}
// const ApiSetting = {...serviceModule }

export default serviceModule