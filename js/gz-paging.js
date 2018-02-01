/**
 * 封装ajax请求
 * 
 * @param {object} o 
 * @param {string} o.url       地址
 * @param {string} o.type      上传方式类型
 * @param {object} o.data      上传的数据
 * @param {boolean} o.upfile   是否上传图片
 * @param {function} o.success 成功后的回调函数
 */
function setAjax(o) {
    var t = 'get'
    if (o.type) {
        t = o.type
    }

    var option = {
        url: o.url,
        data: o.data,
        type: t,
        dataType:'json',
        success: function (d) {
            o.success(d)
        },
        error: function () {
            $.gzMaskLayer({
                word: 'Hey 哥们，是哪里出错了 :(',
            }).error()
            console.log('HEY GUYS,AJAX ERROR :(    URL IS ' + o.url)
        }
    }
    if (o.hasOwnProperty('upfile')) {
        option.contentType = false
        option.processData = false
        option.type = 'post'
    }
    $.ajax(option)
}


/**
 * 分页
 * 
 * @param {any} d 传入的数据 
 * @param {number} num 在一页中显示的数量（默认为10） 
 * @param {object} data 在发送请求的时候同时传入的数据
 * @param {string} url 获取列表信息的地址
 * @param {string} total 获取列表总数的地址
 * @function reload 当前页数的列表重新获取
 * @function changeId 表格内数据重新更换,参数为新表格变更的新设置
 */

function setPage(o) {
    var _page = 1,//当前页
        _shownum = 10, // 一页显示的数量
        _totalnum, // 总条目数
        _maxpage, // 页面总数
        _data, // 数据
        _pageElement = o.pager, // 分页所在节点
        _dataUrl = o.url,
        _totalUrl = o.total
            
    if (o.hasOwnProperty("num")) {
        _shownum = o.num 
    }

    

    first()
    // 初始化显示
    function first() {
        getTotal()
        getData()
    }

    // 获取总数
    function getTotal() { 
    	var option = {
                url: _totalUrl,
                success: function (d) { 
                    _totalnum = d
                    _maxpage = Math.ceil(_totalnum / _shownum)
                    $(_pageElement).find('.gz-total span').html(_maxpage)
                    pager()
                }
        }
        option.data = {}
            for (var key in o.data) {
                if (o.data.hasOwnProperty(key)) {
                option.data[key] = o.data[key]
            }
        }
        setAjax(option)
    }

    // 打印数据
    function printTemplate(r) {
        var res = template(o.tp, {
            'list': r,
            'start': (_page-1)*_shownum
        })
        $(o.el).html(res)
        return r
    }

    // 获取数据
    function getData() {
    	var option = {
                url: _dataUrl,
                type:'post',
                success: function (d) {
                    printTemplate(d)
                }
            },
            data = {
                row: _shownum,
                page: _page
            }
        for (var key in o.data) {
            if (o.data.hasOwnProperty(key)) {
                data[key] = o.data[key]
            }
        }
    	option.data = data
        setAjax(option)
    }

    // 下一页
    function next() {
        if (_page + 1 > _maxpage) {
            return false
        }
        _page = (_page + 1) > _maxpage ? _maxpage : _page + 1
        getData(o)
    }

    // 上一页
    function prev() {
        if (_page - 1 < 1) {
            return false
        }
        _page = (_page - 1) < 1 ? 1 : _page - 1
        getData(o)
    }

    // 事件添加
    function pager() { 
        setPager()
        $(_pageElement).find('.prev').click(function(){
            prev()
            setPager()
        })

        $(_pageElement).find('.next').click(function(){
            next()
            setPager()
        })
    }

    // 设置数字显示
    function setPager() { 
        var _pageTotal = 5,
            el = $(_pageElement).find('.gz-pagenum')
        if (_maxpage <= _pageTotal) {
            el.html("")
            for (var i = 1; i <= _maxpage; i++) {
                el.append("<p data-page='" + i + "'>"+i+"</p>")
            }
        } else {
            if (_page > 2 && _pageTotal + _page -2 <= _maxpage +1) {
                el.html("")
                for (var i = _page-2; i < _pageTotal+_page-2; i++) {
                    el.append("<p data-page='" + i + "'>"+i+"</p>")
                }
            } else if(_page <= 2) {
                el.html("")
                for (var i = 1; i <= _pageTotal; i++) {
                    el.append("<p data-page='" + i + "'>"+i+"</p>")
                }
            } else if (_maxpage - _page <= 2) {
                el.html("")
                for (var i = _maxpage-_pageTotal+1; i <= _maxpage; i++) {
                    el.append("<p data-page='" + i + "'>"+i+"</p>")
                }
            }
        }

        el.find('p').removeAttr('class').click(function () { 
            _page = Number($(this).attr('data-page'))
            setPager()
            getData(o)
        }).siblings('p[data-page=' + _page + ']').addClass('active')
    }

    return {
        // 更改数据重新刷新
        changeId: function (oinfo) { 
            if (!o.hasOwnProperty("data")) {
                o.data = {}
            }
            for (var key in oinfo) {
                if (oinfo.hasOwnProperty(key)) {
                    if (key == "url") {
                        o.url = oinfo.url
                    } else if (key == "total") {
                        o.total = oinfo.total
                    } else {
                        o.data[key] = oinfo[key];
                    }
                }
            }
            setPage(o)
        },
        // 当前页数表格刷新
        reload: function (number) {
            if (number != null) {
                _page = number
            }
        	getData(o)
        }
    }
}

if (window.hasOwnProperty("template")) {
    template.defaults.imports.getTime = function(d){ 
        return moment(d).format('L')
    }
}