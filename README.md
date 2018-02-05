# gz-paging
自制自用分页,在项目进行时并没有找到好用的分页插件，一拍大腿决定手写一个分页插件。也许更新会很慢（因为要过年），而且现在优先完成公司项目和我的另一个弹窗插件，所以还会根据项目修改插件代码。总之，我还是会慢慢更新的，而且正要搭建自己的个人博客和完成自己毕设，或许会改写成一个vue组件
# 版本
#### 1.0.0 项目成立并上传基本代码
# 使用方法
## 1.属性
#### `url`   数据请求地址
#### `data`  请求时发送的数据信息
#### `el`    列表class/id
#### `num`   一页显示多少条信息（默认为10条）
#### `pager` 分页节点的class/id
#### `tp`    所使用的模版名
```javascript
      var paging = setPage({
        url: 'http://localhost/api/pageTest.php',
        data: {
            aid: 1
        },
        el: '#tb',
        num: 10,
        tp: 'tp',
        pager: '.gz-paging'
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
```javascript
  paging.reload()
```
