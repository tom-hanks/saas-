//组件内部调用方法this.$regexp.phone("17601245315")
let regexp = {
    phone: function (phone) {
        if (!(/^1(3|4|5|7|8)\d{9}$/.test(phone))) {
            return false;
        } else {
            return true;
        }
    }
}
export default regexp;