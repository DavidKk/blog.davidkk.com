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

CommonJS是服务器端模块的规范，Node.js采用了这个规范。
根据CommonJS规范，一个单独的文件就是一个模块。加载模块使用require方法，该方法读取一个文件并执行，最后返回文件内部的exports对象。

```
# a.js
var say = function() {
  console.log('Hi')
}

export.message = 'Hello'

export.post = function() {
  console.log(export.message)
}

# b.js
var a = require('./a')
console.log(a)
{
  message: "Hello",
  post: [Function]
}
```

### 以Node.js为例

Node.js的模块分为两类，一类为原生（核心）模块，一类为文件模块。原生模块在Node.js源代码编译的时候编译进了二进制执行文件，加载 的速度最快。另一类文件模块是动态加载的，加载速度比原生模块慢。但是Node.js对原生模块和文件模块都进行了缓存，于是在第二次require时， 是不会有重复开销的。其中原生模块都被定义在lib这个目录下面，文件模块则不定性。

由于通过命令行加载启动的文件几乎都为文件模块。我们从Node.js如何加载文件模块开始谈起。加载文件模块的工作，主要由原生模块module来实现和完成，该原生模块在启动时已经被加载，进程直接调用到runMain静态方法。

```
// bootstrap main module.
Module.runMain = function () {
  // Load the main module--the command line argument.
  Module._load(process.argv[1], null, true)
}
```

_load静态方法在分析文件名之后执行

```
var module = new Module(id, parent)
```

并根据文件路径缓存当前模块对象，该模块实例对象则根据文件名加载。

```
module.load(filename)
```

实际上在文件模块中，又分为3类模块。这三类文件模块以后缀来区分，Node.js会根据后缀名来决定加载方法。

- .js: 通过fs模块同步读取js文件并编译执行。
- .node: 通过C/C++进行编写的Addon。通过dlopen方法进行加载。
- .json: 读取文件，调用JSON.parse解析加载。

这里我们将详细描述js后缀的编译过程。Node.js在编译js文件的过程中实际完成的步骤有对js文件内容进行头尾包装。以app.js为例，包装之后的app.js将会变成以下形式：

```
(function (exports, require, module, __filename, __dirname) {
  var circle = require('./circle.js')
  console.log('The area of a circle of radius 4 is ' + circle.area(4))
})
```

这段代码会通过vm原生模块的runInThisContext方法执行（类似eval，只是具有明确上下文，不污染全局），返回为一个具体的 function对象。最后传入module对象的exports，require方法，module，文件名，目录名作为实参并执行。

这就是为什么`require()`并没有定义在app.js 文件中，但是这个方法却存在的原因。从Node.js的API文档中可以看到还有__filename、__dirname、module、 exports几个没有定义但是却存在的变量。其中__filename和__dirname在查找文件路径的过程中分析得到后传入的。module变量 是这个模块对象自身，exports是在module的构造函数中初始化的一个空对象（{}，而不是null）。

#### `require()` 文件查找策略

由于Node.js中存在4类模块（原生模块和3种文件模块），尽管require方法极其简单，但是内部的加载却是十分复杂的，其加载优先级也各自不同。

![文件查找策略](http://www.infoq.com/resource/articles/nodejs-module-mechanism/zh/resources/image1.jpg)

#### 从文件模块缓存中加载

尽管原生模块与文件模块的优先级不同，但是都不会优先于从文件模块的缓存中加载已经存在的模块。

#### 从原生模块加载

原生模块的优先级仅次于文件模块缓存的优先级。require方法在解析文件名之后，优先检查模块是否在原生模块列表中。以http模块为例，尽管在目录下存在一个http/http.js/http.node/http.json文件，require(“http”)都不会从这些文件中加载，而是 从原生模块中加载。

原生模块也有一个缓存区，同样也是优先从缓存区加载。如果缓存区没有被加载过，则调用原生模块的加载方式进行加载和执行。

#### 从文件加载

当文件模块缓存中不存在，而且不是原生模块的时候，Node.js会解析require方法传入的参数，并从文件系统中加载实际的文件，加载过程中的包装和编译细节在前一节中已经介绍过，这里我们将详细描述查找文件模块的过程，其中，也有一些细节值得知晓。

require 方法接受以下几种参数的传递：

- http、fs、path等，原生模块。
- ./mod或../mod，相对路径的文件模块。
- /pathtomodule/mod，绝对路径的文件模块。
- mod，非原生模块的文件模块。

在进入路径查找之前有必要描述一下module path这个Node.js中的概念。对于每一个被加载的文件模块，创建这个模块对象的时候，这个模块便会有一个paths属性，其值根据当前文件的路径 计算得到。我们创建modulepath.js这样一个文件，其内容为：

```
console.log(module.paths)
```

我们将其放到任意一个目录中执行node modulepath.js命令，将得到以下的输出结果。

```
[ '/home/jackson/research/node_modules',
'/home/jackson/node_modules',
'/home/node_modules',
'/node_modules' ]

# windows

[ 'c:\\nodejs\\node_modules', 'c:\\node_modules' ]
```

可以看出module path的生成规则为：从当前文件目录开始查找node_modules目录；然后依次进入父目录，查找父目录下的node_modules目录；依次迭代，直到根目录下的node_modules目录。

除此之外还有一个全局module path，是当前node执行文件的相对目录（http://www.cnblogs.com/lib/node）。如果在环境变量中设置了HOME目录和NODE_PATH目录的话，整个 路径还包含NODE_PATH和HOME目录下的.node_libraries与.node_modules。其最终值大致如下：

```
[NODE_PATH，HOME/.node_modules，HOME/.node_libraries，execPath/http://www.cnblogs.com/lib/node]
```

下图是笔者从源代码中整理出来的整个文件查找流程：

![文件查找流程](http://www.infoq.com/resource/articles/nodejs-module-mechanism/zh/resources/image2.jpg)

简而言之，如果require绝对路径的文件，查找时不会去遍历每一个node_modules目录，其速度最快。其余流程如下：

- 从module path数组中取出第一个目录作为查找基准。
- 直接从目录中查找该文件，如果存在，则结束查找。如果不存在，则进行下一条查找。
- 尝试添加.js、.json、.node后缀后查找，如果存在文件，则结束查找。如果不存在，则进行下一条。
- 尝试将require的参数作为一个包来进行查找，读取目录下的package.json文件，取得main参数指定的文件。
- 尝试查找该文件，如果存在，则结束查找。如果不存在，则进行第3条查找。
- 如果继续失败，则取出module path数组中的下一个目录作为基准查找，循环第1至5个步骤。
- 如果继续失败，循环第1至6个步骤，直到module path中的最后一个值。
- 如果仍然失败，则抛出异常。

整个查找过程十分类似原型链的查找和作用域的查找。所幸Node.js对路径查找实现了缓存机制，否则由于每次判断路径都是同步阻塞式进行，会导致严重的性能消耗。

#### 包结构

前面提到，JavaScript缺少包结构。CommonJS致力于改变这种现状，于是定义了[包的结构规范](http://wiki.commonjs.org/wiki/Packages/1.0)。而NPM的出现则是为了在CommonJS规范的基础上，实现解决包的安装卸载，依赖管理，版本管理等问题。require的查找机制明了之后，我们来看一下包的细节。

一个符合CommonJS规范的包应该是如下这种结构：

- 一个package.json文件应该存在于包顶级目录下
- 二进制文件应该包含在bin目录下
- JavaScript代码应该包含在lib目录下
- 文档应该在doc目录下
- 单元测试应该在test目录下

由上文的require的查找过程可以知道，Node.js在没有找到目标文件时，会将当前目录当作一个包来尝试加载，所以在 package.json文件中最重要的一个字段就是main。而实际上，这一处是Node.js的扩展，标准定义中并不包含此字段，对于 require，只需要main属性即可。但是在除此之外包需要接受安装、卸载、依赖管理，版本管理等流程，所以CommonJS为 package.json文件定义了如下一些必须的字段：

- name: 包名，需要在NPM上是唯一的。不能带有空格
- description: 包简介，通常会显示在一些列表中
- version: 版本号，一个[语义化的版本号](http://semver.org/)，通常为x.y.z；该版本号十分重要，常常用于一些版本控制的场合
- keywords: 关键字数组，用于NPM中的分类搜索
- maintainers: 包维护者的数组，数组元素是一个包含name、email、web三个属性的JSON对象
- contributors: 包贡献者的数组，第一个就是包的作者本人；在开源社区，如果提交的patch被merge进master分支的话，就应当加上这个贡献patch的人。格式包含name和email
- bugs: 一个可以提交bug的URL地址，可以是邮件地址(mailto:mailxx@domain)，也可以是网页地址(http://url)
- licenses: 包所使用的许可证
- repositories: 托管源代码的地址数组
- dependencies: 当前包需要的依赖，这个属性十分重要，NPM会通过这个属性，帮你自动加载依赖的包

除了前面提到的几个必选字段外，我们还发现了一些额外的字段，如bin、scripts、engines、devDependencies、 author。这里可以重点提及一下scripts字段。包管理器（NPM）在对包进行安装或者卸载的时候需要进行一些编译或者清除的工 作，scripts字段的对象指明了在进行操作时运行哪个文件，或者执行哪条命令

```
"scripts": {
  "install": "install.js",
  "uninstall": "uninstall.js",
  "build": "build.js",
  "doc": "make-doc.js",
  "test": "test.js"
}
```

## 腳本加載器 - 模块化的基石

模塊化JavaScript必然少不了腳本的加載（以引入多個模塊和資源），因此一個兼容的腳本加載器是必需的。

傳統的加載JavaScript方法是透過`<script>`標籤，它的問題是瀏覽器會依序載入頁面中的腳本，這是出於腳本之間可能彼此依賴的考慮——這也是`<script>`標籤造成頁面阻塞的原因，但若兩個檔案之間並不存在依賴關係，仍舊依序載入會浪費時間和性能，這種情況下就希望它們並行地加載和執行。

所以脚本加载器可以以異步方式加載腳本和其他資源，允許這些外部檔案需要在文檔加載過程中的不同時期加入。


## AMD - 異步模塊定義

AMD（异步模块定义，Asynchronous Module Definition）格式总体的目标是为现在的开发者提供一个可用的模块化 JavaScript 的解决方案。它提供一種簡易的API，允許開發者來編寫JavaScript模塊，以爲與AMD相符的加載器加載。

#### 從模塊說起

首先你必須對下面這兩個重要的概念有一定的瞭解：一個用以進行模塊定義的define方法，以及一個用以加載依賴項的require方法。define根據如下的方法簽名來定義具名或匿名的模塊：

```
define(
  module_id      // 可選
  [dependencies]      // 可選
  definition function // 用以初始化模塊或對象的函式
);
```

## CMD

## UMD

## ECMAScript

参考文章

[CommonJS规范](http://javascript.ruanyifeng.com/nodejs/commonjs.html)
[Node.js模块的实现](http://www.cnblogs.com/kudosharry/articles/2684850.html)