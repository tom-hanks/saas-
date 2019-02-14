import { httpServer, apiSetting } from "../../assets/js/http.js";
exports.install = function (Vue, options) {
    /*此处封装公共函数，方法
     *调用示例：
     *组件内调用 this.setCookie
     *路由或者拦截器里调用 Vue.prototype.setCookie
     * */
    /*写cookie,如setCookie('token','1111111')*/
    Vue.prototype.setCookie = function (name, value, days) {
        var exp = new Date();
        exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
    }
    /*读cookie*/
    Vue.prototype.getCookie = function (name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
            return unescape(arr[2]);
        else
            return null;
    }
    /*删除cookie*/
    Vue.prototype.delCookie = function (name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = Vue.prototype.getCookie(name);
        if (cval != null)
            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
    }
    /*例：this.$getsessionStorage('personal')*/
    Vue.prototype.$getsessionStorage = function (name) { //"personal"
        return JSON.parse(sessionStorage.getItem(name))
    }
        /*例：this.$setsessionStorage('personal',respons)*/
        ;
    Vue.prototype.$setsessionStorage = function (name, obj) { //"personal"
        sessionStorage.setItem(name, JSON.stringify(obj));
    }
    /****
     * #监听 sessionStorage里的值 不是特殊场景别用（记得移除监听）
     * 调用方式： this.$wacthResetSetItem("personalSuccess", true);
     * 
     * 监听位置的写法：
     *      window.addEventListener("setItem", () => {
     *       if (this.$getsessionStorage("personalSuccess")) {
     *           this.getUser();
     *       }
     *   });
     * 
     * 千万记住:调用后记得移除监听
     *  */
    Vue.prototype.$wacthResetSetItem = function (key, newVal) {
        if (key) {
            // 创建一个StorageEvent事件
            var newStorageEvent = document.createEvent('StorageEvent');
            const storage = {
                setItem: function (k, val) {
                    sessionStorage.setItem(k, val);

                    // 初始化创建的事件
                    newStorageEvent.initStorageEvent('setItem', false, false, k, null, val, null, null);

                    // 派发对象
                    window.dispatchEvent(newStorageEvent)
                }
            }
            return storage.setItem(key, newVal);
        }
    }
    /*删除数组中的重复项*/
    Vue.prototype.hasRepeat = function (ary) {
        var result = ary.sort();
        for (var i = 0; i < result.length - 1; i++) {
            if (result[i] == result[i + 1]) {
                result.splice(i, 1);
                i--;
            }
        }
        return result;
    },
        // 判断两个数组是否相等   this.$arrayEqual(arr1, arr2)  true/false
        Vue.prototype.$arrayEqual = function (arr1, arr2) {
            if (arr1 === arr2) return true;
            if (arr1.length != arr2.length) return false;
            for (var i = 0; i < arr1.length; ++i) {
                if (arr1[i] !== arr2[i]) return false;
            }
            return true;
        }
    Vue.prototype.$scrollToTop = () => { // 平滑滚动到页面顶部。
        // 使用document.documentElement.scrollTop或document.body.scrollTop从顶部获取距离。
        // 从顶部的距离的一小部分滚动。使用window.requestAnimationFrame()对滚动进行动画处理。
        const scrollToTop = () => {
            const c = document.documentElement.scrollTop || document.body.scrollTop;
            if (c > 0) {
                window.requestAnimationFrame(scrollToTop);
                window.scrollTo(0, c - c / 5);
            }
        };
        scrollToTop()
    }
    // 全局获取消息的接口，传对应页面的page_key，不穿或者传空默认为全局的东西（如左侧导航栏）
    Vue.prototype.$getMid_notify = function (page_key) {
        return new Promise((resolve, reject) => {
            httpServer(apiSetting.getMid_notify, {
                page_key: page_key
            })
                .then(response => {
                    this.$store.commit("notification", response);//抛给vuex 通知全局
                    console.log('g更新消息通知')
                    resolve(response);
                })
                .catch(error => {
                    console.log(error); //loading层关闭
                });
        });
    }
    /**
     * item：代表着后台消息队列给前台返回什么 删除的时候就传什么回去（针对当前符合条件的数据）
     * page_key：删除成功后拉取数据，要传当前页面的名字过去
     */

    Vue.prototype.$deleteMid_notify = function (item, page_key) {
        httpServer(apiSetting.postMid_notify, {
            // id: id //功能主键id
            page_code: item.page_code, //页面Code ,
            region_code: item.region_code, // 区域Code ,
            code: item.code, //code ,
            user_id: item.user_id, // (integer, optional): 用户Id ,
            public_id: item.public_id, // (integer, optional),
            app_id: item.app_id, // (integer, optional): 项目Id ,
            num: item.num, // (integer, optional): 通知数量 ,
            event_id: item.event_id, // (integer, optional): 通知事件配置Id ,
            tree_id: item.tree_id, // (integer, optional): 通知树Id ,
            father_id: item.father_id, // (integer, optional): 父级Id ,
            id: item.id, // (integer, optional): ,
            status: item.status, // (integer, optional): 状态 ,
            create_date_time: item.create_date_time, // (string, optional): 创建时间 ,
            update_date_time: item.update_date_time // (string, optional): 更新时间
        })
            .then(response => {
                console.log("删除消息");
                console.log(response);
                this.$getMid_notify(page_key);
                //   this.getNotification(); //通过或者驳回弹窗就开始刷新消息通知
            })
            .catch(error => {
                console.log(error); //loading层关闭
            });
    }
    // 过滤敏感词的方法，在element ui里面的表单验证里面validator里验证
    Vue.prototype.$forbiddenStr = function (str) {
        //定义敏感字符
        let forbiddenArray = [
            '敏感词',
            '共産黨',
            '法輪功',
            '梅毒',
            '吗啡',
            '李登辉',
            '李洪志',
            '器官',
            '基督',
            '激情',
            '法院',
            '黑客',
            '黑幕',
            '黑社会',
            '捍卫',
            '海洛因',
            '国家机密',
            '国民党',
            '国务院',
            '国家恐怖主义',
            '共铲党',
            '睾',
            '腐败',
            '中华人民共和国',
            '分裂',
            '非典',
            '方舟子',
            '反政府',
            '反社会',
            '反华',
            '反共',
            '法十轮十功',
            '法西斯',
            '发论公',
            '发论功',
            '发轮功',
            '发piao',
            '独裁',
            '东突',
            '釣魚島',
            '钓鱼岛',
            '颠覆中华人民共和国政',
            '邓笑贫',
            '党中央',
            'K粉',
            '成人',
            '陈希同',
            '陈水扁',
            '冰毒',
            '按摩',
            'FLGONG',
            'falun1',
            'Falg',
            'falu',
            'falun',
            'falundafa',
            'falungong',
            'fa轮',
            '1989天安门',
            'A片',
            'DA法',
            'dafa',
            'CCTV',
            'AV',
            '18禁',
            '新茶',
            '震荡',
            '大法',
            '真空',
            '稞',
            'T台',
            '夜职',
            '男女',
            '公关',
            '裸',
            '陪聊',
            '美女',
            '直播',
            '美女主播',
            '有人发布了约唱',
            '年度工作报告',
            '24小时行情直播间',
            '高潮',
            '马会',
            '领事馆',
            '青天白日旗',
            '露点',
            '零八宪章',
            '集会',
            '金菊峰',
            '金正恩',
            '酥胸',
            '酥穴',
            '邵琪伟',
            '邵明立',
            '邵家健',
            '邱学强',
            '邪教',
            '邓小平',
            '透视',
            '透码',
            '选举',
            '迷魂药',
            '迷药',
            '达赖喇嘛',
            '达赖',
            '达兰萨拉',
            '赵洪祝',
            '请愿',
            '警察',
            '藏独',
            '薄瓜瓜',
            '薄熙来',
            '薄一波',
            '萨达姆',
            '萨拉托加',
            '苏共',
            '艾滋',
            '艹',
            '色诱',
            '色欲',
            '色情',
            '自焚',
            '脱衣让哥摸乳房',
            '脱衣舞',
            '胸很大',
            '胸大',
            '胡锦涛',
            '胡温',
            '肉穴',
            '肉洞',
            '肉棒',
            '肉棍',
            '肉体',
            '联总',
            '群奸',
            '群体灭绝',
            '群交',
            '群P',
            '美官员现场剖析',
            '罢课',
            '缥）',
            '绿卡',
            '绳虐',
            '统战',
            '红火柴',
            '管制刀具',
            '童子军特训营',
            '窃听王',
            '窃听器材',
            '窃听器',
            '窃听',
            '突厥斯坦',
            '移民',
            '秦银河',
            '秦永敏',
            '秦光荣',
            '私募',
            '神通加持法',
            '社保基金会',
            '社会主义',
            '示威',
            '瞟】',
            '真善忍',
            '省市换班第五代冒起',
            '皮革奶粉',
            '瘸腿帮',
            '疆独',
            '男女员工',
            '男女公关',
            '电狗',
            '申维辰',
            '生鸦片',
            '生者和死者',
            '生殖器',
            '生当作人杰之昨日重现',
            '班禅',
            '猥亵',
            '特码',
            '燃烧辅助工具',
            '熙溪地',
            '热站政论网',
            '热比娅',
            '炸药',
            '满清',
            '游行',
            '温家宝',
            '清楚邪恶',
            '清债',
            '淫妹妹',
            '涉日',
            '海峡茶都',
            '法轮',
            '法輪',
            '沈彤',
            '江泽民',
            '民新加坡',
            '民主',
            '毛泽东',
            '毛岸英',
            '毒胶囊',
            '正恩',
            '桑拿',
            '核污染',
            '枪模',
            '枪支',
            '枪声',
            '权威主义国家的合法性理论',
            '杀手',
            '杀人',
            '曾庆红',
            '日死你',
            '日本狗',
            '日本军舰',
            '日内瓦金融',
            '日元贷款',
            '日你',
            '日他',
            '政变',
            '搞基',
            '援交',
            '推翻',
            '拥护台独',
            '抵押',
            '抵制',
            '抢粮记',
            '抗议',
            '打倒',
            '成人片',
            '情色',
            '情缘点歌平台',
            '情欲',
            '情感陪护',
            '情妇',
            '情场的最佳帮手',
            '情场',
            '性感',
            '性别不限',
            '性交',
            '性事',
            '当局',
            '弹药',
            '异性',
            '开苞',
            '开房',
            '屠杀',
            '展穴',
            '屁股',
            '少数民族',
            '少儿误入',
            '小穴',
            '射精',
            '审计署',
            '器官',
            '黑客',
            '黑社会',
            '海洛因',
            '冰毒',
            '按摩',
            '采取进一步催收措施',
            '通知您的通讯录及手机详单'
        ];

        let re = '';

        for (let i = 0; i < forbiddenArray.length; i++) {
            if (i == forbiddenArray.length - 1)
                re += forbiddenArray[i];
            else
                re += forbiddenArray[i] + "|";
        }
        //定义正则表示式对象
        //利用RegExp可以动态生成正则表示式
        let pattern = new RegExp(re, "g");
        if (pattern.test(str)) {
            return false;
        } else {
            return true;
        }
    }

};
