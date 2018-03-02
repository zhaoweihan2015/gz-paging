/**
 * 分页
 * 
 * @param {number}   num        在一页中显示的数量（默认为10） 
 * @param {object}   data       在发送请求的时候同时传入的数据
 * @param {string}   url        获取列表信息的地址
 * @param {string}   key        返回数据中信息列表的键名
 * @param {string}   pageNumber 分页显示个数上限
 * @param {object}   webLength  一行显示文字上限
 * @param {boolean}  webPaging  是否采用服务器分页，否则使用前端分页(使用后key无效)
 * @param {function} dataChange 对打印数据进行二次处理
 * @function reload             当前页数的列表重新获取,参数为所需跳转的页数,不填写为刷新当前页
 * @function changeId           表格内数据重新更换,参数为新表格变更的新设置
 * @function getInfo            返回当前信息
 */

function setPage(o) {
    var _page = 1, //当前页
        _shownum = 10, // 一页显示的数量
        _totalnum, // 总条目数
        _maxpage, // 页面总数
        _data, // 数据
        _pageElement, // 分页所在节点
        _dataUrl = o.url,
        _key = "rows",
        _pageTotal = 5,
        _hasAddEvent = false,
        _setButton = [] // 按钮设置

    if (o.hasOwnProperty("num")) {
        _shownum = o.num
    }

    if (o.hasOwnProperty("key")) {
        _key = key
    }

    if (o.hasOwnProperty('pageNumber')) {
        _pageTotal = o.pageNumber
    }

    if (o.hasOwnProperty('setButton')) {
        for (var k in o.setButton) { 
            if (o.setButton[k]) {
                _setButton.push[k]
            }
        }
    }

    init()
    // 初始化显示
    function init() {
        // 设置分页节点
        setDom()

        // 找到所在节点
        _pageElement = $(".gz-page_box").find('.gz-paging')
        if (o.hasOwnProperty('pager')) {
            _pageElement = $(o.pager + ' .gz-paging')
        }

        // 获取数据
        getData()
    }

    // 分页DOM创建
    function setDom() {
        var _box = $('<div class="gz-paging"></div>'),
            _button = $('<p class="button"></p>'),
            _pagenum = $('<div class="gz-pagenum"></div>'),
            _prev = _button.clone().addClass('prev').text('上一页'),
            _next = _button.clone().addClass('next').text('下一页'),
            _toFirst = _button.clone().addClass('first').text('首页'),
            _toLast = _button.clone().addClass('last').text('尾页'),
            _total = $('<p class="gz-total">总页数:<span></span>页</p>'),
            _btnList = [_prev, _pagenum, _next, _total]
        _box.append(_btnList)
        $('.gz-page_box').append(_box)
    }

    // 打印数据 
    function printTemplate(r) {
        var list = r

        if (o.hasOwnProperty('maxLength')) {
            list.forEach(function (e) { 
                var info = e
                o.maxLength.key.forEach(function (e) { 
                    if (info[e].length > o.maxLength.max) {
                        info[e] = info[e].slice(0, o.maxLength.max - 1) + "..."
                    }
                })
            })   
        }

        //对每次打印的数据进行二次处理
        if (o.hasOwnProperty('dataChange')) {
            list = o.dataChange(r)
        }

        var res = template(o.tp, {
            'list': list,
            'start': (_page - 1) * _shownum
        })
        $(o.el).html(res)
        return r
    }
    // 获取数据
    function getData() {
        var option = {
                url: _dataUrl,
                type: 'post'
            },
            data = {}
        for (var key in o.data) {
            if (o.data.hasOwnProperty(key)) {
                data[key] = o.data[key]
            }
        }
        option.data = data
        if (o.webPaging === null || o.webPaging === undefined) {
            // 使用服务器分页
            option.success = function (d) {
                _totalnum = d.total
                _maxpage = Math.ceil(_totalnum / _shownum)
                $(_pageElement).find('.gz-total span').html(_maxpage)
                if (!_hasAddEvent) {
                    addButtonEvent()
                    _hasAddEvent = true
                }
                _data = d[_key]
                printTemplate(_data)
            }
            option.data.row = _shownum
            option.data.page = _page

            setAjax(option)
        } else if (o.webPaging) {
            // 使用前端分页
            if (!_data) {
                option.success = function (d) {
                    _totalnum = d.length
                    _maxpage = Math.ceil(_totalnum / _shownum)
                    $(_pageElement).find('.gz-total span').html(_maxpage)
                    if (!_hasAddEvent) {
                        addButtonEvent()
                        _hasAddEvent = true
                    }
                    _data = d
                    printTemplate(_data.slice((_page - 1) * _shownum, _page * _shownum))
                }
                setAjax(option)
            } else {
                printTemplate(_data.slice((_page - 1) * _shownum, _page * _shownum))
            }
        }
    }

    // 下一页
    function next() {
        if (_page + 1 > _maxpage) {
            return false
        }
        _page = (_page + 1) > _maxpage ? _maxpage : _page + 1
        return _page
    }

    // 上一页
    function prev() {
        if (_page - 1 < 1) {
            return false
        }
        _page = (_page - 1) < 1 ? 1 : _page - 1
        return _page
    }

    // 事件添加
    function addButtonEvent() {
        setPager()
        _pageElement.click(function (e) {
            var e = e || window.event,
                el = e.target,
                $el = $(e.target),
                _canChange = true
            if ($el.hasClass('button') || 　el.tagName == "P") {
                if ($el.hasClass('next')) {
                    _canChange = next()
                } else if ($el.hasClass('prev')) {
                    _canChange = prev()
                } else if (el.tagName == "P") {
                    if (Number($el.attr('data-page')) != _page) {
                        _page = Number($el.attr('data-page'))
                    } else {
                        return false
                    }
                }
                // 数据变化
                if (_canChange) {
                    setPager()
                    getData()
                }
            } else {
                return false
            }
        })
    }

    // 设置数字显示
    function setPager() {
        var el = _pageElement.find('.gz-pagenum'),
            _middleIndex = Math.floor(_pageTotal / 2),
            i
        el.html("")
        if (_maxpage <= _pageTotal) {
            for (i = 1; i <= _maxpage; i++) {
                el.append("<p data-page='" + i + "'>" + i + "</p>")
            }
        } else {
            var end
            if (_page > _middleIndex && _pageTotal + _page - _middleIndex <= _maxpage + 1) {
                i = _page - _middleIndex
                end = _pageTotal + _page - _middleIndex
            } else if (_page <= _middleIndex) {
                i = 1
                end = _pageTotal + 1
            } else if (_maxpage - _page <= _middleIndex) {
                i = _maxpage - _pageTotal + 1
                end = _maxpage + 1
            }
            for (i; i < end; i++) {
                el.append("<p data-page='" + i + "'>" + i + "</p>")
            }
        }
        if (_page != 1) {
            el.find('p').removeAttr('class').siblings('p[data-page=' + _page + ']').addClass('active')
        } else {
            el.find('p').eq(0).addClass('active')
        }
    }

    // 摧毁现有分页节点
    function destroyPaging() {
        $(".gz-paging").remove()
    }

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
            dataType: 'json',
            success: function (d) {
                o.success(d)
            },
            error: function () {8
                console.warn('HEY GUYS,AJAX ERROR :(    URL IS ' + o.url)
            }
        }
        if (o.hasOwnProperty('upfile')) {
            option.contentType = false
            option.processData = false
            option.type = 'post'
        }
        $.ajax(option)
    }

    return {
        // 更改数据重新刷新
        changeId: function (oinfo) {
            destroyPaging()

            if (!o.hasOwnProperty("data")) {
                o.data = {}
            }

            for (var key in oinfo) {
                if (oinfo.hasOwnProperty(key)) {
                    if (key == "url") {
                        o.url = oinfo.url
                    } else {
                        o.data[key] = oinfo[key]
                    }
                }
            }

            setPage(o)
        },
        // 当前页数表格刷新
        reload: function (number) {
            destroyPaging()
            if (number != null) {
                _page = number
            }
            getData()
        },
        // 获取当前信息
        getInfo: function () {
            return {
                total: _totalnum, // 数据条目总数
                maxpage: _maxpage, // 页面总数
                data: _data, // 当前页数据(如果为非服务器分页则为全部数据)
                page: _page // 当前页码
            }
        }
    }
}

if (window.hasOwnProperty("template")) {
    template.defaults.imports.getTime = function (d) {
        return moment(d).format('L')
    }
}


/**
 *  MADE BY gz
 *  github:www.github.com/zhaoweihan2015
 *  URL:www.welush.com
 * 
 *     00000000
 *    00      00 
 *    00  
 *    00     1111111111
 *    00   00000    11  
 *    00     100   11   
 *    00      00  11  
 *     00000000  11  
 *              11
 *             11
 *            11      1 
 *           1111111111  
 */