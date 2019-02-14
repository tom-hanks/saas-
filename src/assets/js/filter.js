// 所有页面过滤器可以统一放在这里，标明过滤器的功能
const vFilter = {
    // 截取当前数据到小数点后2位 
    numFilter2(value) {
        let realVal = Number(value).toFixed(2)
        return realVal
    },
    // 预览页面短信文案的过滤  {{item.notices | msgText }}
    msgText(val) {
        if (val) {
            let item = JSON.parse(val);
            return (
                item.sms_sign +
                item.sms_title +
                item.sms_code +
                item.sms_name +
                item.sms_key +
                item.sms_url +
                item.sms_content
            );
        }
    },
    // 预览页面邮箱    解析字符串式的json
    EmaliList(val) {
        if (val) {
            return JSON.parse(val).join();
        }
    },
    // 预警通知  字符串拼接
    arryListStr: function ([val, warningNum]) {
        if (val) {
            return val.replace("{0}", warningNum + " ");
        }
    }
}
export default vFilter