/**
 * 用法如：主线：this.$customState.app_status_code_200
 *         支线：this.$customState.audit_status_code_100
 */

let customState = {
    //------------------- 主线start
    app_status_code_200: 200, // 待分配
    app_status_code_300: 300, // 已分配/待配置
    app_status_code_400: 400, //配置中
    app_status_code_500: 500, //配置完成
    app_status_code_600: 600, //待上线 已通过
    app_status_code_700: 700, //已上线
    app_status_code_800: 800, //紧急下线
    app_status_code_900: 900, //已下线
    //------------------- 主线end


    //------------------- 业务状态start
    app_status_code_11000: 11000, //代表待分配后续所有状态>200
    app_status_code_12000: 12000, //待配置和配置中的状态
    app_status_code_13000: 13000, //所有下线（已下线和紧急下线的状态）
    app_status_code_14000: 14000, //所有待审核
    app_status_code_15000: 15000, //所有已通过
    app_status_code_16000: 16000, //所有已驳回
    //------------------- 业务状态end


    //------------------- 支线start
    audit_status_code_100: 100, //未(待)提交审核
    audit_status_code_200: 200, //已提交审核，配置完成待审核（待审核）
    audit_status_code_300: 300, //审核驳回（已驳回）
    audit_status_code_400: 400, //审核通过（已通过）
    audit_status_code_500: 500, //紧急下线待审核
    audit_status_code_600: 600, //审核驳回（紧急下线已驳回）
    audit_status_code_700: 700, //审核通过（紧急下线已通过）
    audit_status_code_800: 800, //延期待审核
    audit_status_code_900: 900, //审核驳回（延期已驳回）
    audit_status_code_1000: 1000, //审核通过（延期已通过）
    audit_status_code_1100: 1100, //添加人员名单待审核
    audit_status_code_1200: 1200, //审核驳回（添加名单已驳回）
    audit_status_code_1300: 1300, //审核通过（添加名单已通过）
    //------------------- 支线end
}
export default customState