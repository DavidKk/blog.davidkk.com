<!-- title: 前端开发 - 基础知识@Cookie -->
<!-- author: <David Jones qowera@qq.com> -->
<!-- date: 2018-03-09 15:18:13 -->
<!-- category: 前端 -->
<!-- tag: 基础知识 -->

# Cookie

Cookie 是用来保存用户信息, 并伴随生命周期存储在本地的一些数据.
HTTP 的请求都会伴随着 Cookie 的发送, 但当服务器设置跨域头的时候, 若不设置 `add_header Access-Control-Allow-Credentials 'true' always;` 和 `xhr.withCredentials = true` 的时候并会不自动发送

## Cookie 属性

- domain 域名, 指定域名或范匹配到的域名才进行 cookie 发送, 且不能被不匹配的域名的读取
- path 路径, 同上但首先要匹配域名再匹配路径才能进行 cookie 发送或操作等
- value 值, 与 name 对应, 格式如 [name]=value;[n]=v;
- name 名字, 同上
- expires 过期时间, 时间单位为秒
- secure 安全, 当该值存在, cookie 只能在 HTTPS 下才能发送和操作

## Cookie 自动删除

- 会话 cookie (Session cookie) 在会话结束时 (浏览器关闭) 会被删除
- 持久化 cookie (Persistent cookie) 在到达失效日期时会被删除
- 如果浏览器中的 cookie 数量达到限制，那么 cookie 会被删除以为新建的 cookie 创建空间 (一般为4K)
