# gz-paging
自制自用分页,在项目进行时并没有找到好用的分页插件，一拍大腿决定手写一个分页插件。也许更新会很慢（因为要过年），而且现在优先完成公司项目和我的另一个弹窗插件，所以还会根据项目修改插件代码。总之，我还是会慢慢更新的，而且正要搭建自己的个人博客和完成自己毕设，或许会改写成一个vue组件
# 版本
#### 1.0.2 增加文字个数限制
#### 1.0.1 增加服务器分页与前端分页区分，增加数据二次处理，优化内部代码
#### 1.0.0 项目成立并上传基本代码
# 使用方法
## 1.属性
#### `url`   数据请求地址
#### `data`  请求时发送的数据信息
#### `key`   分页显示个数上限
#### `el`    列表class/id
#### `num`   一页显示多少条信息（默认为10条）
#### `pageNumber `  分页显示个数上限
#### `webPaging`   是否采用服务器分页，否则使用前端分页（使用后key无效）
#### `pager` 分页节点的class/id
#### `maxlength` 文字显示上限 
`key` 字段名 `max` 上限 
#### `tp`    所使用的模版名
#### `dataChange` 对打印数据进行二次处理（必须返回修改后的值）
```javascript
      var paging = setPage({
        url: 'http://localhost/api/pageTest.php',
        data: {
            aid: 1
        },
        el: '#tb',
        num: 10,
        webPaging:true,
        tp: 'tp',
        pager: '.gz-paging',
        maxlength:{ 
            key:['content','title'],
            max:8
        },
        dataChange: function (data){
            data.forEach(e => {
                  e.upname += " By Gz"
            })
            return data
        }
    })
```
## 2.方法
#### `changeId` 修改原有数据重新请求
```javascript
  paging.changeId({
    url:'http://localhost/api/getNewList.php',
    aid:2,
    catid:2
  })
```
#### `reload` 重新请求当前页数的数据
#### 参数一为改为第几页刷新
#### 参数二为是否为完全刷新（true会重新生成分页与信息，false为只刷新当前页信息，默认为false）
```javascript
  paging.reload()
  paging.reload(2,true)
```
#### `getInfo` 获取分页相关信息
#### `paging.getInfo().data` 当前页数据(如果为非服务器分页则为全部数据)
#### `paging.getInfo().maxpage` 页面总数
#### `paging.getInfo().total` 数据条目总数
#### `paging.getInfo().page` 当前页码
```javascript
  var _info = paging.getInfo()
  _info.data 
  _info.total
  _info.maxpage 
  _info.page
```
