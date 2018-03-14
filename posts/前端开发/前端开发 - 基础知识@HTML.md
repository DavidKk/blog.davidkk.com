<!-- title: 前端开发 - 基础知识@HTML -->
<!-- author: <David Jones qowera@qq.com> -->
<!-- date: 2018-03-09 15:18:13 -->
<!-- category: 前端 -->
<!-- tag: 基础知识 -->

## HTML

### 标记语言 SGML, HTML, XML, XHTML

- SGML (Standard Generalized Markup Language, 标准通用标记语言) 是现时常用的超文本格式的最高层次标准, 是可以定义标记语言的元语言, 甚至可以定义不必采用< >的常规方式. HTML 是被用 SGML 描述的标记语言
- HTML (HyperText Markup Language, 超文本标记语言), 是为 "网页创建和其它可在网页浏览器中看到的信息" 设计的一种标记语言, 适合 Web, 可是标记较少, 不支持其他领域的标记语言
- XML (eXtensible Markup Language, 可扩展标记语言), 根据网上的理解, 使用来在网络传输中表示数据的结构的, 及我们可以通过 XML, 可以得到数据的真实结构, 与 HTML 对比理解, HTML 主要用于在网络上控制数据信息的布局, XML 则用于记录数据本身的结构, 包括保存数据. 前者侧重与表现, 后者侧重于记录
- XHTML (eXtensible HyperText Markup Language, 可扩展超文本标记语言), 从继承关系上讲, HTML 是一种基于标准通用标记语言（SGML）的应用, 是一种非常灵活的置标语言, 而 XHTML 则基于可扩展标记语言（XML, XML 是 SGML的一个子集

```
 ┏━━━━┓
 ┃SGML╋━━━┓
 ┗━╋━━┛   ┃
   ┃      ┃
 ┏━╋━┓  ┏━╋━━┓
 ┃XML┃  ┃HTML┃
 ┗━╋━┛  ┗━━━━┛
   ┃
   ┃
┏━━╋━━┓
┃XHTML┃
┗━━━━━┛
```

因此利用 SGML 创建了 HTML 参照和必须共同遵守的 DTD (document type definition, 文本类型定义), 你会经常在 HTML 页面的头部发现 `DOCTYPE` 属性, 用来定义用于解析目标 DTD

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
```

#### DOCTYPE

DOCTYPE 能告诉浏览器使用哪种 html 或者 xhtml 规范来解析文档, 其中引入的 dtd 文件包含了标记, attributes, properties, 约束规则, 浏览器根据此规范来解析 html 文档
另外 DOCTYPE 还会对浏览器的渲染模式产生影响, 不同的渲染模式会影响浏览器对 CSS, Javascript 脚本的解析方式

- Transitional: 一种要求很不严格的 DTD, 允许在页面中使用 HTML 4.01 的标识
- Strict: 一种要求严格的 DTD, 不允许使用任何表现层标识和属性
- Frameset: 一种专门针对框架页面所使用的 DTD, 当页面中含有框架元素时候, 就要采用这种 DTD

#### 设置怪异模式

- 无 doctype 声明, 定义旧的HTML版本 (HTML4以下, 例如 3.2)
- 加 XML 声明, 可在 ie6 下触发
- 在 XML 声明和 XHTML 的 DOCTYPE 之间加入 HTML 注释, 可在 ie7 下触发
- `<!-- keep IE7 in quirks mode -->` 放在 `<!DOCTYPE` 前面

### SVG
SVG（Scalable Vector Graphics 可缩放矢量图形）表示可缩放矢量图形. 他是基于文本的图形语言, 使用文本, 线条, 点等来进行图像绘制

## HTML5

HTML5 是最新的 HTML 标准, 他的主要目标是提供所有内容而不需要任何的像 flash, silverlight 等的额外插件, 这些内容来自动画, 视频, 富 GUI 等；HTML5 是万维网联盟（W3C）和网络超文本应用技术工作组（WHATWG）之间合作输出的.

### HTML5 与 HTML4 的区别

#### 文档范围

HTML5 没有使用 SGML 或者 XHTML, 他是一个全新的东西, 因此你不需要参考 DTD, 对于 HTML5, 你仅需放置下面的文档类型代码告诉浏览器识别这是 HTML5 文档, 若不指明 `<!DOCTYPE html>` (不区分大小写), 则浏览器不会认为该文档为 HTML 文档, 会导致 HTML5 的标签不能正常工作.

#### 向后兼容

HTML5 定义了 HTML5 语法, 日前已广泛兼容于网络上 HTML4 和 XHTML1 的文档, 但不兼容大部分 HTML4 中的深奥 SGML 特性, 大部分 UA 都不支持它们, 比如处理指令(processing instructions) 和 标签简写(shorthand markup).

##### 语法

HTML5 语法中同时定义了解析规则——包括异常的处理方式. 这种解析规则能够广泛支持 HTML4 领域的实现, UA 可以使用这些规则来解析媒体类型为 text/html 的资源.

下面是一个能够说明HTML语法的示例文档：

```html
<!doctype html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Example document</title>
  </head>
  <body>
    <p>Example paragraph</p>
  </body>
</html>
```

另外一个可以被用于 HTML 的语法是 XML.  XML 语法可兼容于 XHTML 文档或实现. 使用 XML 语法的文档需要配套 XML 文档的媒体类型如 application/xhtml+xml 或 application/xml 来使用, 同时元素需要遵循 XML 规则, 被放到 http://www.w3.org/1999/xhtml 命名空间中：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <title>Example document</title>
  </head>
  <body>
    <p>Example paragraph</p>
  </body>
</html>
```

##### 符号编码

HTML标准中要求开发声明编码方式, 有这些方式可以做到：

- 传输层, 可以用 HTTP 头部的 Content-Type
- 在文档头部放置对应使用的编码的 BOM
- 使用有 charset 的 meta 元素 `<meta charset="UTF-8">` 代替 `<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">` (仍可继续使用)

XML 语法中, 开发需要按照 XML 标准来设置编码.

##### MathML 和 SVG

HTML 语法允许文档内嵌 MathML 和 SVG 元素.

- math 和 svg 的开始标签将会导致 HTML 解析器转为特殊的插入模式, 以将元素和属性放入合适的命名空间, 并转化大小写, 并支持 XML 中的空元素语法
- HTML中 的 math/svg 的相关元素及其属性依然是区分大小写的
- 可以省略namespace（svg 的 namespace 可以省略 xmlns="http://www.w3.org/2000/svg"）
- 在这个特殊的插入模式里, 可以使用CDATA语法
- 一些 MathML 和 SVG 元素可能导致解析器转回 HTML 解析模式, 比如 mtext 和 foreignObject, 在这些元素内部你可以使用HTML元素或者新的 math/svg 元素.

```html
<!doctype html>
<title>SVG in text/html</title>
<p>
 A green circle:
 <svg><circle r="50" cx="50" cy="50" fill="green"/></svg>
</p>
```

### DOM 与 BOM

- DOM (Document Object Model): DOM (文档对象模型) 是 HTML 和 XML 的应用程序接口 (API)
- BOM (Browser Object Model): BOM (浏览器对象模型) 是 浏览器应用接口 (API); 其核心是 window, 而 window 对象又具有双重角色，它既是通过js访问浏览器窗口的一个接口，又是一个 Global（全局）对象

#### DOM 发展

- DOM0: JavaScript在早期版本中提供了查询和操作Web文档的内容API
- DOM1: DOM1级主要定义了HTML和XML文档的底层结构, 统一了标准化, W3C标准
- DOM2: 在DOM1的基础上DOM2引入了更多的交互能力，也支持了更高级的XML特性
- DOM3: 进一步扩展了DOM，引入了以统一方式加载和保存文档的方法，它在DOM Load And Save这个模块中定义；同时新增了验证文档的方法，是在 DOM Validation这个模块中定义的

#### DOM0 与 DOM2 的事件处理

- DOM0: 通过设置 `onclick=function () {}` 等绑定事件成为DOM0级事件; 删除可以通过 `onclick=null` 形式删除
- DOM2: 通过 `addEventListener` 与 `removeEventListener` 方式去添加或删除事件, 其中我们可以设置 `冒泡` 或 `捕抓` 事件

### HTML 标签

#### 结构元素

- header - 页面头部
- nav - 主导航
- section - 独立章节
- article - 独立文章
- footer - 页面底部

#### 块级元素
- HTML4  (不包含HTML5废除的)
  - div
  - form - 表单
  - fieldset - form 控制组
  - ol - 排序列表
  - ul - 无需列表
  - h1,...,h6 - 各种标题
  - p - 段落
  - blockquote - 引用
  - pre - 格式化文本
  - table, thead, tbody, tfoot, tr, td, th - 表格
  - noscript - 可选脚本内容
- HTML5
  - aside - 用于表示侧栏、贴士、摘要等
  - figure - 用来包裹图片, 并配合 `figcaption` 标签给图片一个说明
  - [dialog](http://www.w3school.com.cn/tags/index.asp) - 用来表示人与人之间的交流互动, 默认设置了绝对定位居中
  - address - 是用来定义与HTML页面或页面一部分有关的作者、相关人员或组织的联系信息，通常位于页面底部或相关部分内

#### 行内元素
- HTML4 (不包含HTML5废除的)
  - a - 锚点
  - span - 常用内联容器，定义文本内区块
  - label - 表格标签
  - input - 输入框
  - select - 项目选择
  - textarea - 多行文本输入框
  - img - 图片
  - i - 斜体
  - em - 强调
  - b - 粗体
  - strong - 粗体强调
  - small - 小字体文本
  - br - 换行
  - sub - 下标
  - sup - 上标
  - u - 下划线
  - abbr - 缩写
  - acronym - 首字
  - code - 计算机代码
  - var - 定义变量
  - dfn - 定义字段
- HTML5
  - mark - 定义有记号的文本
  - [time](http://www.w3school.com.cn/tags/tag_time.asp) - 时间格式, 会在标签内给它一个datetime的属性, 属性值为电脑可识别的时间格式 - `<time datetime="2008-02-14">情人节</time>`
  - [meter](http://www.w3school.com.cn/tags/tag_meter.asp) - 标签定义度量衡, 它拥有6个属性value, min, max, low, high, optimum, 分别表示当前、最小、最大、低区、高区、最佳
  - [progress](http://www.w3school.com.cn/tags/tag_progress.asp) - 用来表示进度条, value, max, 按照 value/max 来确定进度, IE9 或以下不支持

#### 多媒体元素

- canvas - 定义图形
- [video](http://www.w3school.com.cn/tags/tag_video.asp) - HTML5 视频标签 - `<video src="movie.ogg" controls="controls"></video>`
- [audio](http://www.w3school.com.cn/tags/tag_audio.asp) - HTML 5 音频标签 - `<audio src="a.wav"></audio>`
- [source](http://www.w3school.com.cn/tags/tag_source.asp) - 定义媒介源, 当媒体有多个的时候, 浏览器会自动选择自身支持的那个媒介源
- [track](http://www.w3school.com.cn/tags/tag_track.asp) - 定义用在媒体播放器中的文本轨道, IE9,FF,Safari 不支持
- [embed](http://www.w3school.com.cn/tags/tag_embed.asp) - 定义嵌入的内容 - `<embed src="a.swf"/>`
- [details](http://www.w3school.com.cn/tags/tag_details.asp) - 用于描述文档或某个部分的细节, 配合 `summary` 使用

#### 表单元素

- datalist - 定义下拉列表
- [keygen](http://www.w3school.com.cn/tags/tag_keygen.asp) - 标签规定用于表单的密钥对生成器字段, IE不支持
- [output](http://www.w3school.com.cn/tags/tag_output.asp) - 执行计算显示结果, IE 不支持
- datagrid - 可选数据的树形列表
- input type
  - color 颜色 #ffffff
  - date 日期 1999-01-01
  - datetime-local 本地日期 1999-01-01T00:00
  - month 月份 1999-01
  - email 邮件
  - number 数字

#### 其他元素

- wbr - 定义一段 work brak 文本, 不受任何样式影响
- menu - 菜单列表 (暂无支持)
- command - 行为按钮 (暂无支持)

#### 补充

- [datalist 不受任何样式影响](http://stackoverflow.com/questions/13693482/is-there-a-way-to-apply-a-css-style-on-html5-datalist-options)

#### 语义化标签

- b 与 strong, b 无强调, 只是普通加粗. strong 着重内容并加粗
- i 与 em, i 无强调, 只是普通斜体. em 着重内容并斜体

#### <script> 元素的属性 async 与 defer

- async: 异步与后续文档并行加载并在加载完立即执行
- defer: 异步与后续文档并行加载但不会被立即执行, 当所有元素都被解析后才被执行, 但先于 DOMContentLoaded 事件


#### HTML5 废弃的元素

下面的元素被废弃的原因是用CSS处理可以更好地替代他们：

- basefont
- big
- center
- font
- strike
- tt

下面的元素被废弃的原因是他们的使用破坏了可使用性和可访问性：

- frame
- frameset
- noframes

下面的元素被废弃的原因是不经常使用他们, 也会引起混乱, 而且其它元素也可以很好地实现他们的功能：

- acronym - 被废弃是因为它经常使页面错乱, 可以使用abbr代替
- applet - 被废弃是因为可以使用object代替
- isindex - 被废弃是因为使用表单控件代替
- dir - 被废弃是因为使用ul代替

最后, noscript 元素只能在 HTML 里使用, 而不能在XML里使用.

#### 废弃的属性

HTML5的规范里有对这些属性的代替方案, [点击访问](http://www.whatwg.org/specs/web-apps/current-work/multipage/obsolete.html#non-conforming-features).

- link, a - rev, charset
- a - shape, coords
- img, iframe - longdesc
- link - target
- area - nohref
- head - profile
- html - version
- img - name
- meta - scheme
- object - archive, classid, codebase, codetype, declare, standby
- param - valuetype, type
- td, th - axis, abbr
- td - scope
- table - summary

另外,  在HTML5里, 以下元素的视觉属性也将被废弃, 因为这些功能可用CSS来实现：

- caption, iframe, img, input, object, legend, table, hr, div, h1, h2, h3, h4, h5, h6, p, col, colgroup, tbody, td, tfoot, th, thead, tr - align
- body - alink, link, text, vlink
- body - background
- table, tr, td, th, body - bgcolor
- object - border
- table - cellpadding, cellspacing
- col, colgroup, tbody, td, tfoot, th, thead, tr - char, charoff
- br - clear
- dl, menu, ol, ul - compact
- table - frame
- iframe - frameborder
- td, th - height
- img, object - hspace, vspace
- iframe - marginheight, marginwidth
- hr - noshade
- td, th - nowrap
- table - rules
- iframe - scrolling
- hr - size
- li, ol, ul - type
- col, colgroup, tbody, td, tfoot, th, thead, tr - valign
- hr, table, td, th, col, colgroup, pre - width

[废弃的元素（Element）](http://www.cnblogs.com/TomXu/archive/2011/12/17/2269168.html)


#### HTML5 新增 API

- 媒体标签 video 和 audio 的播放流程控制、同步多个媒体标签、字幕等接口
- 表单限制验证接口 - `setCustomValidity()`
- 引入应用缓存机制, 允许 Web App 离线的 API
- 允许 Web App 注册为对应协议或媒体类型的处理应用的 APP 的 API - `registerProtocolHandler()`, `registerContentHandler()`
- 引入 contenteditable 属性, 允许编辑任意元素的接口
- 暴露会话历史、允许使用脚本无刷新更新页面 URL - `History`
- base64 转换 API - `atob()`, `btoa()`
- 处理搜索服务提供方的接口 - `AddSearchProvider()`, `IsSearchProviderInstalled()`
- 打印文档的接口 - `print()`
- External 接口

### Web Worker

当在 HTML 页面中执行脚本时, 页面的状态是不可响应的, 直到脚本已完成. web worker 是运行在后台的 JavaScript, 独立于其他脚本, 不会影响页面的性能
但是 Web worker 线程不能 `修改 HTML 元素`, 全局变量和 Window.Location 一类的窗口属性. 你可以自由使用 Javascript 数据类型, XMLHttpRequest 调用等

主页面, 我们可以通过 `postMessage(sData)` 给内部发送消息, 通过 `onmessage` `onerror` 等事件来捕获 Worker 内部返回的信息
Worker 没有加载好脚本之前, 所有的 `postMessage()` 都会在 Worker 加载并执行完毕后被触发回调
当我们想停掉 Worker 时, 我们可以使用 `terminate()`

Worker 线程, 我们也是通过 `postMessage()` 来给外部发送消息
若想关闭 Worker 行为, 我们则使用 `close()` 方法
`importScripts()` Worker 线程动态加载外部脚本, 该方法会冻结 Worker 线程, 直到动态加载脚本加载完毕或执行完毕(浏览器差异)
  - `importScripts()` 支持同时加载多个脚本
  - 同时加载多个脚本在各个浏览器中均为并行加载 (前提是 HTTP 连接数够用)
  - 但执行顺序是严格按照参数顺序进行的, 无论哪个先加载完 (FF 有差异)
  - 通过 `importScripts()` 加载的脚本的作用域是指向 GlobalScope 就是说若在某函数中通过 `importScript()` 加载脚本, 在脚本并不会查找该函数作用域中的值, 而是会去查找全局作用域的值

参考资料

- [https://stackoverflow.com/questions/16310091/importscripts-web-workers](https://stackoverflow.com/questions/16310091/importscripts-web-workers)


#### Web Worker 在各浏览器中的差异

##### 异常
Opera 中, 一旦发生一个语法错误或运行时错误, 有时候会多抛出一个 Internal error 并且 lineno 总是 0
Opera 中, 一般的语法错误或执行期异常(如调用未定义变量, throw new Error(s)除外) 总是无法给出准确的错误信息且 lineno 总是
Chrome、Safari中,  `onerror` 并不捕获加载失败的404异常

##### 关于 worker 引入文件的缓存问题
Opera中, 一但脚本被缓存起来那么即使右键-重新载入, 也会直接去读 cache

##### 调用 `close()` 方法后的差异

Opera中, 一但在 Worker 线程中调用 `close()` 方法, 那么就代表着一切都结束了. 如果在 `close()` 后你仍然试图使用 Worker 中的某些属性、事件、或方法则会抛出一个 Internal error, 但其他浏览器则不会
Opera中, 调用 `close()` 后, 出现的 `postMessage()` 给主页面传递信息, 不会再触发主页面的 `onmessage` 回调, 其他浏览器则可以
FF中, 调用 `close()` 后 Worker 虽然不再响应页面的 `postMessage()`, 但是在 `close()` 调用之前, 页面 `postMessage()` 给 Worker 线程的信息仍然会在 Worker 线程结束后被触发回调, 其他浏览器则不会
chrome中, 调用close()后 self 对象被赋值为 null 但你仍然可以和其他浏览器一样直接调用 WorkerGlobalScope 对象的方法. 所以, 应避免使用 self.postMessage, self.onmessage = function(){}, self.close() 而采用直接调用的方式 (如 onmessage=function(){}; )

##### 关于 `terminate()`

Opera 中, 主页面调用 `terminate()` 后再调用 `postMessage()` 会抛出异常, 其他浏览器则不会.
Opera 中, `terminate()` 执行之后, Worker 线程向外部传递数据或抛出异常均会被捕获, 其他浏览器均不会.

##### 关于 `importScripts()`

FF中, `importScripts()` 加载脚本时, 虽然同样会冻结当前 Worker 线程, 但执行期是在 Worker 线程结束后, 而其他浏览器的加载、执行都会冻结 Worker 线程.
FF中, `importScripts()` 方法加载多个脚本时, 执行顺序是不确定的, 遵循先到先执行原则
FF、Safari、Chrome 中, `importScripts()`加载脚本失败时, 会抛出异常且可被主页面的 `onerror` 捕获, Opera 则不会
FF 中, `importScripts()` 加载多个脚本时, 虽然都是并行加载, 但执行却要等待文件都加载完毕后才开始执行, 期间任何一个文件加载失败都将导致直接退出当前执行环境并且 Worker 线程代码也不回执行, 其他浏览器则不会
Safari、Chrome, 使用 `importScripts()` 加载多个脚本时, 任何一个脚本加载失败, 都将导致退出当前执行环境, 但先加载好的外部脚本可以正常执行
Opera 会无视加载失败错误, 继续执行后面的代码

##### 关于 Worker 内创建 Worker 的差异

Safari、chrome 不允许 Worker 内部再次创建一个 Worker, 即 Safari、Chrome 中的 WorkerGlobal 并没有 Worker 成员
FF、opera 允许 Worker 内部再次创建一个 Worker

参考资料

- [HTML5 Web Worker](http://www.cnblogs.com/_franky/archive/2010/11/23/1885773.html)


### Server-Sent Events (SSE) - 单向消息传递

Server-Sent 事件指的是网页自动获取来自服务器的更新. 以前也可能做到这一点, 前提是网页不得不询问是否有可用的更新. 通过服务器发送事件, 更新能够自动到达.

通过 `new EventSource()` 创建的事件并对其进行监听 `onmessage`

```Javascript
let es = new EventSource('/xx.php')
es.onmessage = function () {...}
```

参考资料
- [HTML 5 服务器发送事件](http://www.w3school.com.cn/html5/html_5_serversentevents.asp)


### Websocket

WebSocket 是 HTML5 开始提供的一种在单个 TCP 连接上进行[全双工](https://zh.wikipedia.org/wiki/%E9%9B%99%E5%B7%A5)通讯的协议, 使服务端和客户端可以相互推送数据. 在 WebSocket API 中, 浏览器和服务器只需要做一个握手的动作, 然后, 浏览器和服务器之间就形成了一条快速通道. 两者之间就直接可以数据互相传送. 这里需要注意一点, 这和 TCP 的三次握手又是不一样的. TCP 的三次握手是为了保证连接可靠, 当 TCP 三次握手成功的时候, websocket 的握手阶段才真正开始. TCP 三次握手传送的是 TCP 报文, 而websocket的握手传送的是 HTTP 报文, 这个是不太一样的地方.

握手开始的时候, 我们需要现发送一个HTTP 1.1的请求头部：

```
GET /chat HTTP/1.1
Host: server.example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Origin: http://example.com
Sec-WebSocket-Protocol: chat, superchat
Sec-WebSocket-Version: 13
```

服务端返回的成功握手请求头部如下

```
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
Sec-WebSocket-Protocol: chat
```

一旦连接成功后, 就可以在全双工的模式下在客户端和服务端之间来回传送WebSocket消息. 这就意味着, 在同一时间、任何方向, 都可以双向发送基于文本的消息. 每个消息已0×00字节开头, 以0xff结尾（这样就可以解决TCP协议中的黏包问题, 在TCP协议中, 会存在两个缓冲区来存放发送的数据或者接收的数据, 如果没有明显的分隔符, 服务端无法正确识别命令）, 中间数据的编码是 UTF-8.

#### websocket 的使用

```Javascript
let ws
if ('WebSocket' in window) {
  ws = new WebSocket('ws://example.com:9998/websocket')

  // 成功建立连接触发事件
  ws.onopen = function() {
    ws.send('something to send...')
  }

  // 收到信息触发事件
  ws.onmessage = function(evt) {
    let msg = evt.data
    console.log('i received a message: ' + msg)
  }

  // 连接关闭触发事件
  ws.onclose = function() {
    console.log('Connecting is closed...')
  }
}
else {
  console.log('Your browser is not supported WebSocket. ⊙﹏⊙b')
}
```

#### 使用 websocket 主要考虑因素

- 请求数：WebSocket可以一直保持连接, 通过Socket通道传输数据, 节省掉了建立连接需要耗费的时间.
- 服务器并发数：服务端要同时维持大量连接处于打开状态, 就需要能以低性能开销接收高并发数据的架构. 此类架构通常是围绕线程或所谓的非阻塞 IO 而设计的. 这就与传统服务器围绕 HTTP 请求/响应循环的设计不同. 这个时候, 我们就会想到nodejs, 使用事件机制和异步IO对请求进行处理, 提高了服务器的并发能力, 并且减少了线程切换带来的开销.

#### 扩展 HTTP 实时性 Web

- HTTP 轮询 (Polling): 个是最容易实现的而且对浏览器服务器没有特别要求, 就是通过不断的向服务器发ajax请求. 但这种方法会很浪费带宽和资源, 所以不太可取.
- JSONP 轮询: 跟 http 轮询类似, 只不过是 JSONP 是可跨域的.
- 捎带轮询 (Piggyback Polling): 所谓的 Piggyback 指的是如果后台有什么内容需要推送到前台（即调用页面的js方法）, 是要等到那个页面进行下一次 ajax 请求的时候, 将需要推送的内容附加在该次请求之后, 传回到页面.
- Comet (长连接, 服务器推): Comet 是一个 Web 应用模型, 就是客户端的请求被发送到服务器端后保持一个很长的存活期, 直到超时或是有服务器端事件发生. 这样服务器就可以在无需显式请求的情况下向客户端发送数据, 但这种长时间保持请求打开的功能需要服务器的支持.
  - 流 (streaming): 流的实现也有两种方法
    - Forever Iframe: 就是通过隐藏的 iframe 的 src 指向返回服务器端事件的 servlet 路径, 每次在事件到达时, servlet 写入并刷新一个新的 script 标签, 该标签内部带有 JavaScript 代码, iframe 的内容被附加上这一 script 标签, 标签中的内容就会得到执行. 这种方式实现简单, 支持 iframe 的浏览器都可以, 但是连接和数据都是通过 html 标签, 不能追踪连接状态以及可靠的错误处理.
    - AJAX multipart XHR: 是在 XHR 对象上使用某些浏览器（比如 Firefox）支持的 multi-part 标志, Ajax 请求被发送给服务器端并保持打开状态, 每次有事件到来时, 一个多部分的响应就会通过这同一连接来写入. 并非所有浏览器支持
  - 长轮询 (long-polling): 应该是指服务器端的技术可以保持连接保持打开状态, 有事件发生, 则响应给客户端, 关闭连接, 然后再打开一个新的连接. 也是有2种实现方式: script 标签 和 XMLHttpRequest 长轮询.
    - script 标签: 跟 iframe 类似, 也是返回 script 脚本执行, 可跨域, 与 iframe 有同样的缺点, 错误处理缺失, 以及连接的不可知不可干涉.
    - XMLHttpRequest 长轮询: 我的理解就是发送普通的 ajax 请求, 由服务器端挂起请求, 直到某个事件返回响应客户端, 客户端继续打开新的请求. 这也算是实现 Comet 的最佳实现了, 可以对超时等错误进行追踪, 对浏览器几乎没有要求, 只是服务器端需要挂起连接的功能.
- FlashSockets: 利用嵌入网页的 flash 程序中的 socket 跟服务器通信, javascript 在通过f lash 提供的接口获取到 XML. 从而实现服务器推. 但flashsockets需要安装flash插件, 并需要843端口.
- WebSocket: 是 HTML5 开始提供的一种浏览器与服务器间进行全双工通讯的网络技术.

参考资料

- [深入了解HTTP和Socket在实时性Web上的实践](http://ju.outofmemory.cn/entry/23106)
- [关于web通信技术](http://www.tony77.com/archives/431.html)


### Web Storage - Web 存储

#### LocalStorage (本地存储) 与 SessionStorage (会话存储)

LocalStorage 是 HTML5 标准中新加入的技术, 它并不是什么划时代的新东西. 早在 IE 6 时代, 就有一个叫 userData 的东西用于本地存储, 而当时考虑到浏览器兼容性, 更通用的方案是使用 Flash. 而如今, localStorage 被大多数浏览器所支持, 如果你的网站需要支持 IE6+, 那以 userData 作为你的 polyfill 的方案是种不错的选择.
SessionStorage 与 LocalStorage 的接口类似, 但保存数据的生命周期与 LocalStorage 不同. 做过后端开发的同学应该知道 Session 这个词的意思, 直译过来是“会话”. 而 SessionStorage 是一个前端的概念, 它只是可以将一部分数据在当前会话中保存下来, 刷新页面数据依旧存在. 但当页面关闭后, SessionStorage 中的数据就会被清空.

#### Web Storage 与 Cookie

Web Storage 的概念和 Cookie 相似, 区别是它是为了更大容量存储设计的. Cookie 的大小是受限的, 并且每次你请求一个新的页面的时候Cookie都会被发送过去, 这样无形中浪费了带宽, 另外cookie还需要指定作用域, 不可以跨域调用.
除此之外, Web Storage 拥有 setItem, getItem, removeItem, clear 等方法, 不像 Cookie 需要前端开发者自己封装 setCookie, getCookie
Cookie 确实非常小, 它的大小限制为4KB左右. Cookie 的作用是与服务器进行交互, 作为HTTP规范的一部分而存在, 而 Web Storage 仅仅是为了在本地存储数据而生
Cookie 可以设置失效时间；LocalStorage 除非被清除, 否则永久保存；SessionStorage 仅在当前会话下有效, 关闭页面或浏览器后被清除, 在多个 Tab 浏览器中,  Tab 关闭后重新打开, 该会话也会存在
Cookie 的缺陷
- Cookie 的大小被限制在4KB
- Cookie 是随HTTP事务一起发送的, 因此会浪费一部分发送 Cookie 时所使用的带宽
- Cookie 操作繁琐复杂

##### Cookie 设置

Cookie 通过 `key=value;` 这样的形式表示的；若 value 出现等号, 我们可以使用 `escape()`；若要添加过期时间, 我们可以添加一个 `expire=date.toGMTString();`(date 为未来时间)；这时我们也可以通过设置过期时间为过去时间就可以删除该 cookie 了. 当我们要指定可访问 cookie 的路径, 我们可以通过设置 `path=/` 来设置.

```Javascript
function addCookie(name, value, expire) {
  var cookieString = name + '=' + escape(value)

  if(expireHours > 0) {
    var date = new Date()
    date.setTime(date.getTime + expire)
    cookieString = cookieString + ';expire=' + date.toGMTString()
  }

  document.cookie=cookieString
}

function getCookie(name) {
  var strCookie = document.cookie
      arrCookie = strCookie.split(';')

  for (var i = 0, l = arrCookie.length; i < l; i ++) {
    var arr = arrCookie[i].split('=')
    if (name == arr[0]) {
      return unescape(arr[1])
    }
  }

  return ''
}
```

#### WebSQL

Web SQL Database (目前只谷歌浏览器支持)：我把它理解成一个 HTML 5 环境下可以用 Javascript 执行 CRUD 的 Web 数据库. WebSql 并不是 HTML5 规范的一部分, 这个规范是基于 SQLite.

** CRUD 是指在做计算处理时的增加(Create)、查询(Retrieve)（重新得到数据）、更新(Update)和删除(Delete)几个单词的首字母简写. 主要被用在描述软件系统中数据库或者持久层的基本操作功能.

对于简单的数据, 使用 sessionStorage 和 localStorage 能够很好地完成存取, 但是对于处理复杂的关系型数据, 它就力不从心了. 这也是 HTML 5 的 "Web SQL Database" API 接口的应用所在.

##### 使用

```Javascript
var db = openDatabase('stu', 1.0, '', 1024 * 1024, function() {})

if (db) {
  console.log('Create db success.')
}
else {
  console.log('Create db fail.')
}
```

openDatabase 参数分别是

- 数据库名称
- 版本号 1.0 (only)
- 对数据库的描述
- 设置数据的大小
- 回调函数(可省略)

##### 创建数据表

```Javascript
dataBase.transaction(function(tx) {
  tx.executeSql('create table if not exists stu (id REAL UNIQUE, name TEXT)', [], function() {
    console.log('创建stu表成功')
  },
  function() {
    console.log('创建stu表失败:' + error.message)
  })
})
```

executeSql 函数有四个参数, 其意义分别是：
- 表示查询的字符串, 使用的SQL语言是 SQLite 3.6.19.
- 插入到查询中问号所在处的字符串数据.
- 成功时执行的回调函数. 返回两个参数：tx和执行的结果.
- 一个失败时执行的回调函数. 返回两个参数：tx和失败的错误信息.

##### 添加数据

```Javascript
dataBase.transaction(function (tx) {
  tx.executeSql("insert  into  stu (id, name) values(?, ?)", [id, '徐明祥'], function () {
    console.log('success')
  },
  function (tx, error) {
    console.log('error: ' + error.message)
  })
})
```

##### 查询数据

```Javascript
dataBase.transaction(function (tx) {
  tx.executeSql('select * from stu', [], function (tx, result) {
    // do something...
  },
  function (tx, error) {
    console.log('error: ' + error.message)
  });
});

```

##### 更新数据

```Javascript
dataBase.transaction(function (tx) {
  tx.executeSql('update stu set name = ? where id= ?', [name, id], function (tx, result) {
    // do something...
  },
  function (tx, error) {
    console.log('error: ' + error.message)
  })
})
```

##### 删除数据

```Javascript
dataBase.transaction(function (tx) {
  tx.executeSql('delete from stu where id= ?', [id], function (tx, result) {
    // do something...
  },
  function (tx, error) {
    console.log('error: ' + error.message)
  })
})
```
##### 删除数据表

```Javascript
dataBase.transaction(function (tx) {
  tx.executeSql('drop table stu')
})
```

参考文章

- [THE PAST, PRESENT & FUTURE OF LOCAL STORAGE FOR WEB APPLICATIONS](http://diveintohtml5.info/storage.html)
- [what is the difference between localStorage, sessionStorage, session and cookie?](http://stackoverflow.com/questions/19867599/what-is-the-difference-between-localstorage-sessionstorage-session-and-cookie)
- [HTML5开发学习（3）:本地存储之Web Sql Database（附源码）](http://www.cnblogs.com/xumingxiang/archive/2012/03/25/2416418.html)


### Application Cache - 应用缓存

HTML5引入了应用程序缓存技术, 意味着web应用可进行缓存, 并在没有网络的情况下使用, 通过创建cache manifest文件, 可以轻松的创建离线应用.

Application Cache带来的三个优势是：

- 离线浏览
- 提升页面载入速度
- 降低服务器压力

#### 使用

Application Cache的使用要做两方面的工作：

- 服务器端需要维护一个 `manifest.appcache` 清单
- 浏览器上只需要一个简单的设置即可

```HTML
<html manifest="mainfest.appcache">
```

manifest 文件可分为三个部分：

- CACHE MANIFEST - 在此标题下列出的文件将在首次下载后进行缓存
- NETWORK - 在此标题下列出的文件需要与服务器的连接, 且不会被缓存
- FALLBACK - 在此标题下列出的文件规定当页面无法访问时的回退页面（比如 404 页面）

```
# MIME-type: text/cache-manifest (必须设置)
CACHE MANIFEST

# 需要缓存的列表
CACHE:
style.css
imageA.jpg
scriptA.js
http://localhost/applicationcache/scriptB.js

# 不需要缓存的
NETWORK:
imageB.jpg

FALLBACK:
# 访问缓存失败后, 备用访问的资源, 第一个是访问源, 第二个是替换文件*.html /offline.html
imageA.jpg/imageError.jpg
```

#### 缓存大小限制

Application Cache 的尺寸限制统一在 5M, 即是当一个文件超过 5M 或累计大小超过5M处于超过5M或以后文件将不会缓存, 例如 A.css 4,000k, B.css 2,000k, C.css 100k, 则会导致 B.css 的缓存失效.

#### 更新缓存

- 用户清空浏览器缓存
- manifest 文件被修改
- 由程序来更新应用缓存

```Javascript
window.applicationCache.addEventListener('updateready', function() {
  applicationCache.swapCache()
  window.location.reload()
})
```

#### 其他问题

由更新机制来说, 首次更新 manifest 时, 因为页面加载已经开始甚至已经完成, 缓存更新尚未完成, 浏览器仍然会使用过期的资源；浏览器是当 Application Cache 有更新时, 该次不会使用新资源, 第二次才会使用. 这个时候 update 事件中执行 window.reload 事件.

参考文章

- [神奇的HTML5离线存储（应用程序缓存）](http://www.cnblogs.com/xjchenhao/p/4032224.html)
- [HTML5应用程序缓存Application Cache](http://www.cnblogs.com/yexiaochai/p/4271834.html)


#### 网页性能优化

- 减少 DOM 节点
- 减少 HTTP 请求
- 使用 CDN
- 合并图片使用精灵图
- GZIP 压缩传输
- 使用 HTTP2.0
- 减少 CDN - 域名少一点, 浏览器会缓存
- 减少 DOM 节点的操作
- 图片延迟加载
- 图片无损压缩
- 避免重定向
- 尽量避免使用 iframe
