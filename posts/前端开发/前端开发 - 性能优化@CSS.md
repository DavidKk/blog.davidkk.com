<!-- title: 前端开发 - 性能优化@CSS -->
<!-- author: <David Jones qowera@qq.com> -->
<!-- date: 2018-03-09 15:18:13 -->
<!-- category: 前端 -->
<!-- tag: 性能优化 -->

# CSS 性能优化

- 加载性能 - 从减少文件体积, 减少阻塞加载, 提高并发方面入手的
  - css 中不使用 `@import`, `@import` 非异步加载且会阻塞渲染; 使用普通 `link` 标签代替
  - 样式放到最前面, 避免浏览器出现白屏或者无样式, 提高用户体验
  - 减少不必要代码书写量
    - Color 缩写 `#fff`
    - 浮点数缩写 `.1`
  - 压缩 CSS 代码, 压缩方式会抽取共同公共样式并进行代码压缩
- 选择器性能
  - 减少选择器层级; 例如 `html body img` -> `img`
  - 减少复用选择器; 例如 `ul#id` `ul.class` `.parent.self.child` -> `#id` `.class` `.parent-self-child`
  - 不要`子元素选择器`或`后代选择器`中使用`通配符选择器`; 例如 `#id *` -> `*`
- 渲染性能

参考资料

- [GitHub's CSS Performance](https://speakerdeck.com/jonrohan/githubs-css-performance)
