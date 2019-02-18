$(function () {
    document.body.className = localStorage.getItem('config-skin');
    $("[data-toggle='tooltip']").tooltip();

})
$.reload = function () {
    location.reload();
    return false;
}
$.loading = function (bool, text) {
    var $loadingpage = top.$("#loadingPage");
    var $loadingtext = $loadingpage.find('.loading-content');
    if (bool) {
        $loadingpage.show();
    } else {
        if ($loadingtext.attr('istableloading') == undefined) {
            $loadingpage.hide();
        }
    }
    if (!!text) {
        $loadingtext.html(text);
    } else {
        $loadingtext.html("数据加载中，请稍后…");
    }
    $loadingtext.css("left", (top.$('body').width() - $loadingtext.width()) / 2 - 50);
    $loadingtext.css("top", (top.$('body').height() - $loadingtext.height()) / 2);
}
/**
 * 
 * @param {any} name 从地址栏中要获取的参数
 * @returns {String} 值
 */
$.request = function (name) {
    var search = location.search.slice(1);
    var arr = search.split("&");
    for (var i = 0; i < arr.length; i++) {
        var ar = arr[i].split("=");
        if (ar[0] == name) {
            if (unescape(ar[1]) == 'undefined') {
                return "";
            } else {
                return unescape(ar[1]);
            }
        }
    }
    return "";
}
$.currentWindow = function () {
    var iframeId = top.$(".NFine_iframe:visible").attr("id");
    return top.frames[iframeId];
}
$.browser = function () {
    var userAgent = navigator.userAgent;
    var isOpera = userAgent.indexOf("Opera") > -1;
    if (isOpera) {
        return "Opera"
    };
    if (userAgent.indexOf("Firefox") > -1) {
        return "FF";
    }
    if (userAgent.indexOf("Chrome") > -1) {
        if (window.navigator.webkitPersistentStorage.toString().indexOf('DeprecatedStorageQuota') > -1) {
            return "Chrome";
        } else {
            return "360";
        }
    }
    if (userAgent.indexOf("Safari") > -1) {
        return "Safari";
    }
    if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
        return "IE";
    };
}
$.download = function (url, data, method) {
    if (url && data) {
        data = typeof data == 'string' ? data : jQuery.param(data);
        var inputs = '';
        $.each(data.split('&'), function () {
            var pair = this.split('=');
            inputs += '<input type="hidden" name="' + pair[0] + '" value="' + pair[1] + '" />';
        });
        $('<form action="' + url + '" method="' + (method || 'post') + '">' + inputs + '</form>').appendTo('body').submit().remove();
    };
};
$.modalOpen = function (options) {
    var defaults = {
        id: null,
        title: '系统窗口',
        width: "100px",
        height: "100px",
        url: '',
        shade: 0.3,
        btn: ['确认', '关闭'],
        btnclass: ['btn btn-primary', 'btn btn-danger'],
        callBack: null
    };
    options = $.extend(defaults, options);
    var _width = top.$(window).width() > parseInt(options.width.replace('px', '')) ? options.width : top.$(window).width() + 'px';
    var _height = top.$(window).height() > parseInt(options.height.replace('px', '')) ? options.height : top.$(window).height() + 'px';
    top.layer.open({
        id: options.id,
        type: 2,
        shade: options.shade,
        title: options.title,
        fix: false,
        area: [_width, _height],
        content: options.url,
        btn: options.btn,
        btnclass: options.btnclass,
        yes: function () {
            options.callBack(options.id)
        }, cancel: function () {
            return true;
        }
    });
}
$.modalConfirm = function (content, callBack) {
    top.layer.confirm(content, {
        icon: "fa-exclamation-circle",
        title: "系统提示",
        btn: ['确认', '取消'],
        btnclass: ['btn btn-primary', 'btn btn-danger'],
    }, function () {
        callBack(true);
    }, function () {
        callBack(false)
    });
}
$.modalAlert = function (content, type) {
    var icon = "";
    if (type == 'success') {
        icon = "fa-check-circle";
    }
    if (type == 'error') {
        icon = "fa-times-circle";
    }
    if (type == 'warning') {
        icon = "fa-exclamation-circle";
    }
    top.layer.alert(content, {
        icon: icon,
        title: "系统提示",
        btn: ['确认'],
        btnclass: ['btn btn-primary'],
    });
}
$.modalMsg = function (content, type) {
    if (type != undefined) {
        var icon = "";
        if (type == 'success') {
            icon = "fa-check-circle";
        }
        if (type == 'error') {
            icon = "fa-times-circle";
        }
        if (type == 'warning') {
            icon = "fa-exclamation-circle";
        }
        top.layer.msg(content, { icon: icon, time: 4000, shift: 5 });
        top.$(".layui-layer-msg").find('i.' + icon).parents('.layui-layer-msg').addClass('layui-layer-msg-' + type);
    } else {
        top.layer.msg(content);
    }
}
$.modalClose = function () {
    var index = top.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
    var $IsdialogClose = top.$("#layui-layer" + index).find('.layui-layer-btn').find("#IsdialogClose");
    var IsClose = $IsdialogClose.is(":checked");
    if ($IsdialogClose.length == 0) {
        IsClose = true;
    }
    if (IsClose) {
        top.layer.close(index);
    } else {
        location.reload();
    }
}
/**
 * $.abc=function(){}，和 $.extend({abc:function(){}})效果一样
 * 都是添加静态方法
 * @param {any} options 选项
 */
$.submitForm = function (options) {
    var defaults = {
        url: "",
        param: [],
        loading: "正在提交数据...",
        success: null,
        close: true
    };
    options = $.extend(defaults, options);
    $.loading(true, options.loading);
    window.setTimeout(function () {
        if ($('[name=__RequestVerificationToken]').length > 0) {
            options.param["__RequestVerificationToken"] = $('[name=__RequestVerificationToken]').val();
        }
        $.ajax({
            url: options.url,
            data: options.param,
            type: "post",
            dataType: "json",
            success: function (data) {
                if (data.state == "success") {
                    options.success(data);
                    $.modalMsg(data.message, data.state);
                    if (options.close == true) {
                        $.modalClose();
                    }
                } else {
                    $.modalAlert(data.message, data.state);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $.loading(false);
                $.modalMsg(errorThrown, "error");
            },
            beforeSend: function () {
                $.loading(true, options.loading);
            },
            complete: function () {
                $.loading(false);
            }
        });
    }, 500);
}
$.deleteForm = function (options) {
    var defaults = {
        prompt: "注：您确定要删除该项数据吗？",
        url: "",
        param: [],
        loading: "正在删除数据...",
        success: null,
        close: true
    };
    var options = $.extend(defaults, options);
    if ($('[name=__RequestVerificationToken]').length > 0) {
        options.param["__RequestVerificationToken"] = $('[name=__RequestVerificationToken]').val();
    }
    $.modalConfirm(options.prompt, function (r) {
        if (r) {
            $.loading(true, options.loading);
            window.setTimeout(function () {
                $.ajax({
                    url: options.url,
                    data: options.param,
                    type: "post",
                    dataType: "json",
                    success: function (data) {
                        if (data.state == "success") {
                            options.success(data);
                            $.modalMsg(data.message, data.state);
                        } else {
                            $.modalAlert(data.message, data.state);
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        $.loading(false);
                        $.modalMsg(errorThrown, "error");
                    },
                    beforeSend: function () {
                        $.loading(true, options.loading);
                    },
                    complete: function () {
                        $.loading(false);
                    }
                });
            }, 500);
        }
    });

}
$.jsonWhere = function (data, action) {
    if (action == null) return;
    var reval = new Array();
    $(data).each(function (i, v) {
        if (action(v)) {
            reval.push(v);
        }
    })
    return reval;
}
$.fn.jqGridRowValue = function () {
    var $grid = $(this);
    var selectedRowIds = $grid.jqGrid("getGridParam", "selarrrow");
    if (selectedRowIds != "") {
        var json = [];
        var len = selectedRowIds.length;
        for (var i = 0; i < len; i++) {
            var rowData = $grid.jqGrid('getRowData', selectedRowIds[i]);
            json.push(rowData);
        }
        return json;
    } else {
        return $grid.jqGrid('getRowData', $grid.jqGrid('getGridParam', 'selrow'));
    }
}
$.fn.formValid = function () {
    return $(this).valid({
        errorPlacement: function (error, element) {
            element.parents('.formValue').addClass('has-error');
            element.parents('.has-error').find('i.error').remove();
            element.parents('.has-error').append('<i class="form-control-feedback fa fa-exclamation-circle error" data-placement="left" data-toggle="tooltip" title="' + error + '"></i>');
            $("[data-toggle='tooltip']").tooltip();
            if (element.parents('.input-group').hasClass('input-group')) {
                element.parents('.has-error').find('i.error').css('right', '33px')
            }
        },
        success: function (element) {
            element.parents('.has-error').find('i.error').remove();
            element.parent().removeClass('has-error');
        }
    });
}
/**
 * 绑定或获取表格中的数据
 * @param {Object} formdate 表格待绑定的数据
 * @returns {Object} 表格中的数据
 */
$.fn.formSerialize = function (formdate) {
    var element = $(this);
    if (formdate) {
        for (var key in formdate) {
            var $id = element.find('#' + key);
            var value = $.trim(formdate[key]).replace(/&nbsp;/g, '');
            var type = $id.attr('type');
            // 使用select2插件后，看到的下拉框是span，真正的下拉框select是隐藏掉了
            if ($id.hasClass("select2-hidden-accessible")) {
                type = "select";
            }
            switch (type) {
                case "checkbox":
                    if (value == "true") {
                        $id.attr("checked", 'checked');
                    } else {
                        $id.removeAttr("checked");
                    }
                    break;
                case "select":
                    $id.val(value).trigger("change");
                    break;
                default:
                    $id.val(value);
                    break;
            }
        }
        return false;
    }
    var postdata = {};
    element.find('input,select,textarea').each(function (r) {
        var $this = $(this);
        var id = $this.attr('id');
        var type = $this.attr('type');
        switch (type) {
            case "checkbox":
                postdata[id] = $this.is(":checked");
                break;
            default:
                var value = $this.val() == "" ? "&nbsp;" : $this.val();
                if (!$.request("keyValue")) {
                    value = value.replace(/&nbsp;/g, '');
                }
                postdata[id] = value;
                break;
        }
    });
    if ($('[name=__RequestVerificationToken]').length > 0) {
        postdata["__RequestVerificationToken"] = $('[name=__RequestVerificationToken]').val();
    }
    return postdata;
};
$.fn.bindSelect = function (options) {
    var defaults = {
        id: "id",
        text: "text",
        search: false,
        url: "",
        param: [],
        change: null
    };
    var options = $.extend(defaults, options);
    var $element = $(this);
    if (options.url != "") {
        $.ajax({
            url: options.url,
            data: options.param,
            dataType: "json",
            async: false,
            success: function (data) {
                $.each(data, function (i) {
                    $element.append($("<option></option>").val(data[i][options.id]).html(data[i][options.text]));
                });
                $element.select2({
                    minimumResultsForSearch: options.search == true ? 0 : -1
                });
                $element.on("change", function (e) {
                    if (options.change != null) {
                        options.change(data[$(this).find("option:selected").index()]);
                    }
                    $("#select2-" + $element.attr('id') + "-container").html($(this).find("option:selected").text().replace(/　　/g, ''));
                });
            }
        });
    } else {
        $element.select2({
            minimumResultsForSearch: -1
        });
    }
}
/**
 * 进入某个模块（菜单）时执行，不包括两个默认的页面
 * 添加对象的方法
 * */
$.fn.authorizeButton = function () {
    // 得到即将进入的模块的id
    var moduleId = top.$(".NFine_iframe:visible").attr("id").substr(6);
    // 得到此模块上的按钮
    var dataJson = top.clients.authorizeButton[moduleId];
    var $element = $(this);
    // 将此页面上所有的按钮都改为未授权状态。
    $element.find('a[authorize=yes]').attr('authorize', 'no');
    // 将在数据库存在对应记录的按钮的状态改为已授权
    if (dataJson !== undefined) {
        $.each(dataJson, function (i) {
            $element.find("#" + dataJson[i].F_EnCode).attr('authorize', 'yes');
        });
    }
    // 按钮中 a 标签的 id 都记录在数据库中，随意改变后，将会在数据库
    // 中找不到此 id ，视为未授权，将被移除。
    $element.find("[authorize=no]").parents('li').prev('.split').remove();
    $element.find("[authorize=no]").parents('li').remove();
    $element.find('[authorize=no]').remove();
}
/**
 * 从数据库创建按钮
 * */
$.fn.createButton = function () {
    // 得到即将进入的模块的id
    var moduleId = top.$(".NFine_iframe:visible").attr("id").substr(6);
    // 得到此模块上的按钮
    var dataJson = top.clients.authorizeButton[moduleId];
    dataJson = dataJson.sort(function (a, b) {
        return parseInt(a.F_SortCode) - parseInt(b.F_SortCode)
    })

    var $element = $(this);
    if (dataJson !== undefined) {
        $.each(dataJson, function (i) {
            var eleLi = $("<li></li>")
            let btnContainer;
            // 按钮 fontawesome 图标
            var eleI = $(`<i class="fa ${dataJson[i].F_Icon}"></i>`)
            var eleA = $(`<a id="${dataJson[i].F_EnCode}" authorize="yes" data-url="${dataJson[i].F_UrlAddress}" onclick="${dataJson[i].F_JsEvent}">${dataJson[i].F_FullName}</a>`);
            // eleA.attr("data-url", dataJson[i].F_UrlAddress);
            eleA.prepend(eleI);
            if (dataJson[i].F_Location === 1) {
                // 如新建按钮，此类按钮忽略分隔符
                btnContainer = $element.find(".btn-group:last");
                eleA.addClass("btn btn-primary dropdown-text")
                btnContainer.append(eleA);


            } else {
                btnContainer = $element.find(".nav")
                eleLi.append(eleA);
                btnContainer.append(eleLi)
                if (dataJson[i].F_Split) {
                    let eleSplit = $(`<li class="split"></li>`);
                    btnContainer.append(eleSplit);
                }
            }
        });
    }



}
/**
 * 
 * @param {any} options 选项
 */
$.fn.dataGrid = function (options) {
    var defaults = {
        datatype: "json",
        autowidth: true,
        // 是否显示行号
        rownumbers: true,
        shrinkToFit: false,
        gridview: true
    };
    options = $.extend(defaults, options);
    var $element = $(this);
    // 行点击事件
    options["onSelectRow"] = function (rowid) {
        // 此条数据在当前页的行号，并非全局行号，和 rowid 相同，可替换
        let rownumbers = $(this).jqGrid("getGridParam", "selrow")
        var length = rownumbers.length;
        // 获取此条数据内容使用 $(this).jqGrid('getRowData', rownumbers);
        // 操作类按钮工具栏
        var $operate = $(".operate");
        if (length > 0) {
            $operate.animate({ "left": 0 }, 200);
        } else {
            $operate.animate({ "left": '-100.1%' }, 200);
        }
        $operate.find('.close').click(function () {
            $operate.animate({ "left": '-100.1%' }, 200);
        })
    };
    $element.jqGrid(options);
};
/**
 * 
 * @param {Array} fields 每个对象为{id,name,type,option:[{value,name}]}的数组
 * @param {JSON} setting 设置
 */
$.fn.makeTable = function (fields, setting) {
    var $tr = $(`<tr></tr>`),
        $table = ``;

    var defaultSetting = {
        areaValign: "top",// textarea中文字对齐方向
        areaPaddingT: 5, // textarea的 padding-top
        areaColspan: 3,
        areaHeight: 60,
        column: 2
    };
    setting = $.extend(defaultSetting, setting);

    /**
     * 检查给定的tr是否满
     * @param {JQLite} tr 行
     * @returns {boolean} 是否满
     */
    function isFull(tr) {
        let children = tr.children(`td`);
        if (children.length === 1 && children.get(0).children[0].tagName.toLowerCase() === `textarea`) {
            return true;
        } else if (children.length < setting.column) {
            return false;
        } else if (children.length > setting.column) {
            throw new Error(`实际元素个数大于column`);
        }

        return true;

    }
    $table = $(`<table class="form"></table>`).append($tr),
        $(this).append($table);

    for (var i = 0; i < fields.length; i++) {
        let optionsHtml = `<option value="">==请选择==</option>`;
        if (fields[i].option) {

            for (var index in fields[i].option) {
                optionsHtml += `<option value="${fields[i].option[index].value}">${fields[i].option[index].name}</option>`;
            }
        }
        fields[i].type = fields[i].type ? fields[i].type : `text`;
        let $th = $(`<th class="formTitle" ${fields[i].type === "textarea" ? `valign="${setting.areaValign}" style="padding-top: ${setting.areaPaddingT}px;"` : ``}>${fields[i].name}</th>`);
        let tagName = fields[i].type === `textarea` ? `textarea` : fields[i].type === `select` ? `select` : `input`;
        let $td = $(`<td class="formValue" ${tagName === `textarea` ? `colspan="${setting.areaColspan}"` : ``}>
                        <${tagName} id="${fields[i].id}" name="${fields[i].id}" class="form-control" ${tagName === `input` ? `type="${fields[i].type}"` : ``} ${tagName === `textarea` ? `style="height: ${setting.areaHeight}px;"` : ``} ${fields[i].placeholder ? `placeholder="${fields[i].placeholder}"` : ``}>${tagName === `select` ? optionsHtml : ""}</${tagName}>
                    </td>`);




        if (isFull($tr) || tagName === `textarea`) {
            $tr = $(`<tr></tr>`);
            $table.append($tr);
        }
        $tr.append($th);
        $tr.append($td);
    }

    //生成 th td 组合

};