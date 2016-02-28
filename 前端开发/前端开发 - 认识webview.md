<!-- title: 前端开发 - 认识 webview -->
<!-- author: <David Jones qowera@qq.com> -->
<!-- date: 2015-06-12 22:00:43 -->
<!-- category: 前端 -->
<!-- tag: 基础知识 -->

# 前端开发 - 认识 webview

## 发展

`WebView` 是Android系统内置的供第三方APP调用的浏览器组件。简单来说就是内置渲染引擎的一个封装。在 Android 4.4 之前，`WebView` 的后端是经过修改的 `WebKit`，其源码位于Android源码的 `external/webkit` 下。从 Android 4.4 开始，这个 `WebKit` 后端被换成谷歌的 `Chromium`，此时 `WebView` 的实现从 `frameworks/base` 中解耦出来，迁移到 `frameworks/webview`，但仍然被编译成 `framework` 的一部分。`frameworks/base` 中只保留与SDK相关的接口。Android 5.0，`Chromium` 升级到了37，同时原来作为 framework 的一部分被引入的 `Chromium` 包又被修改，变成了编译为一个独立的 apk，包名为 `com.andorid.webview`，在开机时由 framework 根据包名自动载入。

[Ten Things You Need to Know About WebView](http://blogs.msdn.com/b/wsdevsol/archive/2012/10/18/nine-things-you-need-to-know-about-webview.aspx)
[Google 出手尝试解决 Android WebView 的碎片化](https://typeblog.net/tech/2015/04/06/google-released-seperate-webview.html)