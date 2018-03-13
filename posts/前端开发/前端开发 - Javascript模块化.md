<!-- title: 前端开发 - Javascript模块化 -->
<!-- author: <David Jones qowera@qq.com> -->
<!-- date: 2015-06-08 16:47:22 -->
<!-- category: 前端 -->
<!-- tag: 基础知识 -->

Javascript 不是一种模块化编程语言，它不支持类`(class)`，更没有模块`(module)`。(正在制定中的 ECMAScript 标准第六版，将正式支持类和模块，但还需要很长时间才能投入实用。)
Javascript 只有本身的基础原生对象和类型，更多的对象和API都取决于宿主的提供，所以，我们可以看到JavaScript 缺少这些功能：

- JavaScript 没有模块系统，没有原生的支持密闭作用域或依赖管理。
- JavaScript 没有标准库，除了一些核心库外，没有文件系统的API，没有IO流API等。
- JavaScript 没有标准接口，没有如Web Server或者数据库的统一接口。
- JavaScript 没有包管理系统，不能自动加载和安装依赖。

因此 Javascript 代码越来越庞大的情况下，模块化已经成为迫切的需求了。

## 模块化

当我们称一个应用程序是模块化的的时候，我们通常是指它由一组高度解耦的、存放在不同模块中的独特功能构成。你可能已经知道，`松散耦合`通过尽可能地去除依赖性来让可维护性更加简单易得。当这一点被有效实现的时候，系统中某一部分的变化将如何影响其它部分就会变得显而易见。

然而，与一些更传统的编程语言不同的是，JavaScript 的当前版本`(ECMA-262)`并没有为开发者们提供以一种简洁、有条理地的方式来引入模块的方法。规范的一大问题，就是未曾在这方面投入足够多的考量。直到近年来，人们对更为有序组织的 JavaScript 应用的需求变得越来越显著，这一情况才有所改观。

作为代替，当前的开发者们只能被迫降级使用`模块模式`或是`对象字面量模式`的各种变体。通过很多这样的方法，各模块的脚本被串在一起注入到 DOM 中，其命名空间是由单一的全局对象来描述的。你的整个体系架构在这种模式下，仍然有可能发生命名冲突。想要简洁地管理依赖关系，不通过一些手工处理或借助第三方库往往是不可能的。

尽管这些问题的原生解决方案在`ES Harmony`中才会被引入，但好消息是，编写模块化的 JavaScript 目前已经变得极为简单，甚至今天就可以开始动手。

## CommonJS

CommonJS 是服务器端模块的规范，Node.js 采用了这个规范, 通过 `require` 进行模块加载

### 文件查找策略

加载优先级

- 原生模块
- 文件模块 (node_modules 等)
  - .js: 通过 fs 模块同步读取 js 文件并编译执行
  - .node: 通过 C/C++ 进行编写的 Addon, 通过 dlopen 方法进行加载
  - .json: 读取文件, 调用 JSON.parse 解析加载

所有加载的模块都会被缓存 (cache) 起来, 当第二次 `require` 的时候就不会重复开销;
Node.js 在编译 js 文件的过程中实际完成的步骤有对 js 文件内容进行头尾包装

```Javascript
(function (exports, require, module, __filename, __dirname) {
  var circle = require('./circle.js')
  console.log('The area of a circle of radius 4 is ' + circle.area(4))
})
```

这段代码会通过 vm 原生模块的 `runInThisContext` 方法执行 (类似eval, 只是具有明确上下文, 不污染全局), 返回为一个具体的 function 对象. 最后传入 `module` 对象的 `exports`, `require`, `__filename` (文件名), `__dirname` (目录名) 作为实参并执行; 这就是为什么 `require()` 并没有定义在 app.js 文件中, 但是这个方法却存在的原因.
`exports` 是在 `module` 的构造函数中初始化的一个空对象 {}, 而不是 null

## AMD (异步模块定义) - Asynchronous Module Definition

为了模块化 Javascript 代码而建立, 是一种具有异步特性的模块化解决方案
通过预先定义好依赖, 经过异步加载依赖后执行回调函数
AMD 属于前置依赖, 当执行文件时就立即知道依赖模块并进行加载

## CMD (通用模块定义) - Common Module Definition

也是为了模块化 Javascript 代码而建立, 更偏向与 CommonJS 的规范, 也是具有异步特性的模块化解决方案
CMD 属于就近依赖, 加载模块时需要将模块编译成字符串从而找出需要依赖的模块, 这里会消耗部分性能
