
jQuery.extend({
    //克隆JSON
    cloneJSON: function (str) {
        if (str)
            return JSON.parse(JSON.stringify(str));
    },
    //获取去参网址 
    getUrl: function () {
        return window.location.protocol + "//" + window.location.host + window.location.pathname;
    },
    //获取url参数
    getParam: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(decodeURI(r[2])); return null;
    },
    //获取字符串长度，汉字占3个字符
    checkStringLength: function (str) {
        var length = 0;
        if (str)
            for (var i = 0; i < str.length; i++) {
                if (str.charCodeAt(i) > 255)
                    length += 3;
                else
                    length++;
            }
        return length;
    },
    //验证网址
    validUrl: function (str) {
        var Expression = '^((https|http|ftp|rtsp|mms)?://)?'
            + '(([0-9a-z_!~*().&=+$%-]+: )?[0-9a-z_!~*().&=+$%-]+@)?' //ftp的user@
            + '(([0-9]{1,3}.){3}[0-9]{1,3}|'// IP形式的URL- 199.194.52.184
            + '([0-9a-z_!~*()-]+.)*'// 域名- www.
            + '[a-z]{2,6})'//域名的扩展名
            + '(:[0-9]{1,4})?'// 端口- :80
            + '((/?)|(/[0-9a-z_!~*().;?:@&=+$,%#-]+)+/?)$';
        var objExp = new RegExp(Expression);
        return objExp.test(str);
    },
    //验证是否含有特殊字符
    validSpecialChar: function (str, withChinese) {
        var regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im,
            regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;

        if (regEn.test(str)) {
            return false;
        }
        if (withChinese && regCn.test(str)) {
            return false;
        }
        return true;
    },
    //将\n替换为<br>
    replaceToBr: function (content) {
        if (!content)
            return content;
        return content.replace(/\n/g, '<br />')
    },
    //分页api请求
    pagerApi: function (options) {
        var defaults = {
            route: "/",
            url: "",
            page: 1,
            pageSize: 15,
            searchEl: '',
            beforeSend: true,
            success: false
        };
        var opts = $.extend(defaults, options);
        //Api 参数
        var apiParams = {
            pageIndex: opts.page,
            pageSize: opts.pageSize
        };
        if (options.data)
            $.extend(apiParams, options.data);
        //加载参数
        if (opts.searchEl !== '' && $(opts.searchEl).length > 0) {
            var $el = $(opts.searchEl);
            $el.find('input').each(function (index, item) {
                var name = $(item).attr('name');
                var val = $.trim($(item).val());
                if (val != '') {
                    apiParams[name] = val;//encodeURIComponent($(item).val());
                }
            });
            $el.find('select').each(function (index, item) {
                var name = $(item).attr('name');
                var val = $.trim($(item).val());
                var type = $(item).attr('data-type');
                if (val != '') {
                    if (type == "bool")
                        apiParams[name] = val == "1" ? true : false;
                    else
                        apiParams[name] = encodeURIComponent(val);
                }
            });
        }
        if ($.isFunction(opts.beforeSend)) {
            opts.beforeSend();
        }
        ////仿跨站点攻击
        //var requestVerificationToken = $(":hidden[name='__RequestVerificationToken']").val();
        //$.extend(apiParams, { "__RequestVerificationToken": requestVerificationToken });
        $.ajax({
            url: $.getFullPath(opts.route, opts.url),
            data: apiParams,
            cache: false,
            dataType: "json",
            type: "GET",
            beforeSend: function () {
                $.loading();
            },
            success: function (result) {
                if (result && result.is_success === false) {
                    var msg = '操作失败';
                    if (result.text)
                        msg += '，' + result.text;
                    $.warn(msg);
                } else {
                    if (typeof opts.success == "function") {
                        if (result.is_success)
                            opts.success(result.result_data.data);
                        else
                            opts.success(result);
                    }
                }
            },
            complete: function () {
                $.closeLoading();
            }
        });
    },
    //异步请求api数据
    api: function (options) {
        var defaults = {
            route: "/",
            url: "",
            data: {},
            type: "GET",
            async: true,
            cache: false,
            dataType: "json",
            loadingText: "正在加载中",
            beforeSend: false,
            success: false,
            complete: false,
        };
        var opts = $.extend(defaults, options);
        if (typeof opts.beforeSend == "function") {
            var beforeSendResult = opts.beforeSend();
            if (typeof beforeSend != "undefined" && !beforeSendResult) {
                return false;
            }
        }
        ////仿跨站点攻击
        //var requestVerificationToken = $(":hidden[name='__RequestVerificationToken']").val();
        //$.extend(apiParams, { "__RequestVerificationToken": requestVerificationToken });
        //console.log(JSON.stringify(opts.data));
        $.ajax({
            url: $.getFullPath(opts.route, opts.url),
            data: opts.data,
            cache: opts.cache,
            dataType: opts.dataType,
            async: opts.async,
            type: opts.type,
            beforeSend: function () {
                $.loading(opts.loadingText);
            },
            success: function (res) {
                if (res && res.is_success === false) {
                    var msg = '操作失败';
                    if (res.text)
                        msg += '，' + res.text;
                    $.warn(msg);
                } else {
                    if (typeof opts.success == "function") {
                        if (res.is_success)
                            opts.success(res.result_data);
                        else
                            opts.success(res);
                    }
                }
            },
            complete: function () {
                $.closeLoading();
                if (typeof opts.complete == "function") {
                    opts.complete();
                }
            }
        });
    },
    //获取完整页面路径
    getFullPath: function (route, url) {
        if (!url) return;
        if (url.indexOf('/') === 0) return url;
        if (route)
            url = route + url;
        if (virtual && url.indexOf(virtual) !== 0)
            url = virtual + url;
        return url;
    },
    //刷新子页面
    reloadPage: function () {
        var url = $('#container').data('url');
        $.gotoPage(url);
    },
    //跳转子页面
    gotoPage: function (route, url) {
        $.loading();
        if (!url) {
            url = route;
            route = null;
        }
        url = $.getFullPath(route, url);
        $('#container').data('url', url).load(url, function (response, status, xhr) {
            $.closeLoading();
            if (status === 'error') {
                $.warn('页面加载失败(' + xhr.status + ')');
            }
            try {
                var result = JSON.parse(response);
                if (result.errCode === 401)
                    location.href = $.getFullPath(RouteHead, 'Account/Login');
            } catch (e) { }
        });
    },
    //显示列表中的图片
    showImg: function (src) {
        //src = $.imgHost + src;
        return "<img src='" + src + "' width='50px' height='50px' />";
    },
    //显示手机号码
    //参数：
    //  mobile：要拨打的手机号码
    //  telephone：渠道座机
    showMobile: function (mobile, telephone) {
        if (mobile)
            return '<a class="green" href="javascript:callMobile(' + mobile + ',' + telephone + ')" data-rel="tooltip" data-original-title="打电话"><i data-operate="mobile" class="icon-headphones bigger-130"></i>' + mobile + '</a>';
        else
            return '无';
    },
    //显示布尔的值
    showBool: function (bool) {
        if (bool) {
            return "<i class=\"fa fa-check green\"></i>";
        }
        return "<i class=\"fa fa-times red\"></i>";;
    },
    showDate: function (date) {
        if (!date)
            return "";
        if (date == "0001-01-01 00:00:00" || date == "1900-01-01 00:00:00") {
            return "";
        }
        date = date.toString();
        if (date.indexOf(" ") >= 0)
            return date.substr(0, date.indexOf(" "));
        return date;
    },
    showCheckDate: function (date) {
        if (!date)
            return "";
        if (date == "0001-01-01 00:00:00" || date == "1900-01-01 00:00:00") {
            return "";
        }
        date = date.toString();
        if (date.indexOf(" ") >= 0) {
            var a = date.substr(0, date.indexOf(" "));
            var b = date.substr(date.indexOf(" "), date.length - date.indexOf(" "));
            var c = b.split(':');
            return a + " " + c[0] + ":" + c[1];
        }
        return date;
    },
    showDateHMS: function (date) {
        if (!date)
            return "";
        if (date == "0001-01-01 00:00:00" || date == "1900-01-01 00:00:00") {
            return "";
        }
        date = date.toString().replace("T", " ");
        return date;
    },
    //转化成Date对象，为EleUI日期控件使用
    DateParse(str) {
        return new Date(Date.parse(str.replace(/-/g, "/")));
    },
    showUrl: function (url, text) {
        return "<a href='" + encodeURI(url) + "'>" + text + "</a>";
    },
    showUrls: function (url, text) {
        return "<a href='" + url + "'>" + text + "</a>";
    },
    showUrlss: function (url, text) {
        return "<a href='" + url + "' target='blank'>" + text + "</a>";
    },
    //alert
    alert: function (msg, callback) {
        vm.$message({
            type: 'success',
            message: msg,
            showClose: true
        });
    },
    //warn $.warn('错误信息');
    warn: function (msg) {
        vm.$message({
            type: 'warning',
            message: msg,
            showClose: true
        });
    },
    //error
    error: function (msg) {
        vm.$message({
            type: 'error',
            message: msg,
            showClose: true
        });
    },
    //confirm 确认 $.confirm("是否删除",function(){vm.query();})
    confirm: function (msg, callbackYes, callbackNo) {
        vm.$confirm(msg, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
        }).then(() => {
            if (callbackYes)
                callbackYes();
        }).catch(() => {
            if (callbackNo)
                callbackNo();
        });
    },
    //打开窗体
    //open: function (options) {
    //    var defaults =
    //    {
    //        title: "系统提示",
    //        url: "",
    //        data: {},
    //        width: 450,
    //        height: 200,
    //        callback: false,
    //        cancel: false,
    //        yes: false
    //    };
    //    var opts = $.extend(defaults, options);
    //    var params = $.param(opts.data);
    //    if ($.trim(params) != "") params = "?" + params + "&pageStatus=" + opts.pageStatus;
    //    var dlgIndex = top.$.layer({
    //        type: 2,
    //        shadeClose: false,
    //        fix: false,
    //        title: opts.title,
    //        maxmin: true,
    //        iframe: { src: opts.url + params },
    //        area: [opts.width + 'px', opts.height + 'px'],
    //        //yes: function (index) {
    //        //    alert(123);
    //        //    if (typeof opts.yes == "function") {
    //        //        layer.close(index);
    //        //        opts.yes();
    //        //    }
    //        //},
    //        //cancel: function (index) {
    //        //    if (typeof opts.cancel == "function") {
    //        //        opts.cancel();
    //        //    }
    //        //},
    //        end: function () {
    //            if (typeof opts.callback == "function")
    //                opts.callback();
    //        }
    //    });
    //    top.arrDlg.push(dlgIndex);
    //    return dlgIndex;
    //},
    ////打开当前层
    //openDiv: function (selecter, area) {
    //    var dlgIndex = $.layer({
    //        type: 1,
    //        shade: [0.5, '#000', true],
    //        area: area,
    //        title: false,
    //        border: [0],
    //        page: { dom: selecter }
    //    });
    //    return dlgIndex;
    //},
    //关闭窗体
    //length：一次关闭几个窗口，默认为1
    closeDlg: function (length) {

    },
    //关闭全部窗体
    closeAllDlg: function () {

    },
    //正在加载
    loading: function (msg) {
        vm.loadInstance = vm.$loading({ fullscreen: true, text: msg });
    },
    //关闭正在加载层
    closeLoading: function () {
        vm.loadInstance.close();
    },
    showWaiting: function (msg) {

    },
    closeWaiting: function () {

    },
    //根据路径获取文件名
    getFileName: function (path) {
        if (path) {
            return path.substr(path.lastIndexOf("/") + 1);
        }
        else {
            return "";
        }
    },
    //根据路径获取文件类型
    getFileType: function (path) {
        if (path) {
            return path.substr(path.lastIndexOf(".") + 1);
        }
        else {
            return "";
        }
    },
    // 左右移动动画
    // rightAnimate:function(el,length){
    //     el.animate({left:length+"px"})
    // }
});
