<!-- title: 前端开发 - 基础知识@Javascript -->
<!-- author: <David Jones qowera@qq.com> -->
<!-- date: 2018-03-09 15:18:13 -->
<!-- category: 前端 -->
<!-- tag: 基础知识 -->

## Javascript

### 作用域

作用域就是一个区域, 包含了其中变量, 常量, 函数等等定义信息和赋值信息, 以及这个区域内代码书写的结构信息
作用域 (scope, 或译作有效范围) 是名字 (name) 与实体 (entity) 的绑定 (binding) 保持有效的那部分计算机程序
若出现同名变量, 作用域中的变量会比全局变量的优先级高. 而且改变作用域下的变量, 全局变量不会受到任何影响.
Javascript 并没有块状作用域, 因此在相同作用域下不同的块状中定义变量, 他们均是该作用域变量, 作用域下都能引用.

#### Scope Chain - 作用域链

作用域链就是包含了函數被創建的作用域中對象的集合. 它決定了哪些數據能被函數訪問.
这个原理和原型链很类似, 如果这个变量在自己的作用域中没有, 那么它会寻找父级的, 直到最顶层.

#### Hoisting - 声明提升

当定义一个变量时, 定义的声明会在程序运行时优先执行定义(非赋值)

```
console.log(a)    // undefined, 并不会
var a = 1         // 声明被提升, 这里只执行赋值
console.log(a)    // 1
```

但他并不适用于 `let`

#### Window Scope

基于浏览器的 Javascript 定义一个全局变量可以通过给 Window 对象添加属性.
同时, 没有经过 `var` 定义的变量均被定义为全局变量 (此情况是没有标志 `use strict` 的情况下)
当函数内部调用一个从未被定义的值, 它会指向 Window, 若通过 'use strict' 标志了该作用域, 则会报错

#### 静态作用域 与 动态作用域

静态作用域 (Static/Lexical Scope) 又叫做词法作用域, 采用词法作用域的变量叫词法变量. 词法变量有一个在编译时静态确定的作用域. 词法变量的作用域可以是一个函数或一段代码, 该变量在这段代码区域内可见 (visibility); 在这段区域以外该变量不可见(或无法访问). 词法作用域里, 取变量的值时, 会检查函数定义时的文本环境, 捕捉函数定义时对该变量的绑定.

动态作用域 (Dynamic Scope) 的变量叫做动态变量. 只要程序正在执行定义了动态变量的代码段, 那么在这段时间内, 该变量一直存在；代码段执行结束, 该变量便消失. 动态作用域里, 取变量的值时, 会由内向外逐层检查函数的调用链, 并打印第一次遇到的那个绑定的值.

下面闭包章节将有具体例子详细说明

参考文章

- [作用域](https://zh.wikipedia.org/wiki/%E4%BD%9C%E7%94%A8%E5%9F%9F#.E9.9D.99.E6.80.81.E4.BD.9C.E7.94.A8.E5.9F.9F.E4.B8.8E.E5.8A.A8.E6.80.81.E4.BD.9C.E7.94.A8.E5.9F.9F)


### Closure - 闭包

#### 闭包的定义

闭包 (Closure) 是词法闭包 (Lexical Closure) 的简称, 是引用了自由变量的函数, 也可以说闭包是由函数和与其相关的引用环境组合而成的实体.

#### 闭包的特征

- 函数
- 可以引用外部自由变量
- 作用域

#### 闭包的应用

- 读取函数内部变量
- 让变量常驻内存

#### 闭包拓展

首先我们了解一下函数编程的一些基本定义, 函数式语言中, 函数即是数据, 则我们可以把函数作为参数传递, 也可以返回一个函数, 然而在 ECMAScript 中也一样.
这些接受函数式参数的函数称为高阶函数 (HOF - high-order function)；
而带函数返回值的函数称为带函数值的函数 (functions with functional value)；
把自己作为参数的函数称为自应用函数 (self-applicative function)；
把自己作为返回值的函数称为自复制函数 (self-replicative function)

```Javascript
# 高阶函数
function q (funcVar) {
  funcVar()
}

# 带函数值的函数
function q () {
  return function() {}
}

# 自应用函数
(function() {

})()

# 自复制函数
function q() {
  return q
}
```

#### Funarg Problem - 泛函参数问题

Funarg Problem 的一个子问题是 upward funarg problem (自下而上), 当一个函数作为另一个函数的返回值时, 并且使用了自由变量[free variable]的时候会发生. 即便它的父级上下文环境已经结束了, 它可以引用父级的变量. 这个内部函数在创建时就会将父级的作用域链保存在自己的作用域[[Scope]]中. 当函数运行时, 上下文环境的作用域量是由活跃变量[activation object]和它[[Scope]]属性组合而成.

```
Scope chain = Activation object + [[Scope]]
```

请再次注意这个很重要的点 – 在函数创建期间[creation moment], 函数会将父级的作用域链保存起来, 因为随后调用这个函数的时候使用的已经保存的作用域链来搜寻变量.

```Javascript
function foo() {
  var x = 10
  return function() {
    console.log(x)
  }
}

var x = 20
foo()()  // 10, but not 20
```

这种形式的作用域称为静态作用域. 理论上来说, 也会有动态作用域[dynamic scope], 也就是上述的x被解释为20, 而不是10. 但是EMCAScript不使用动态作用域.

“funarg problem”的另一个类型就是自上而下[”downward funarg problem”].在这种情况下, 父级的上下会存在, 但是在判断一个变量值的时候会有多义性. 也就是, 这个变量究竟应该使用哪个作用域. 是在函数创建时的作用域呢, 还是在执行时的作用域呢？为了避免这种多义性, 可以采用闭包, 也就是使用静态作用域.

```Javascript
var x = 10

function foo() {
  console.log(x)
}

(function(funarg) {
  var x = 20

  // there is no ambiguity,
  // because we use global "x",
  // which was statically saved in
  // [[Scope]] of the "foo" function,
  // but not the "x" of the caller's scope,
  // which activates the "funArg"

  funarg() // 10, but not 20
})(foo)
```

从上述的情况, 我们似乎可以断定, 在语言中, 使用静态作用域是闭包的一个强制性要求. 不过, 在某些语言中, 会提供动态和静态作用域的结合, 可以允许开发员选择哪一种作用域. 但是在ECMAScript中, 只采用了静态作用域. 所以ECMAScript完全支持使用[[Scope]]的属性. 我们可以给闭包得出如下定义

```
A closure is a combination of a code block (in ECMAScript this is a function) and statically/lexically saved all parent scopes.Thus, via these saved scopes a function may easily refer free variables.
```

闭包是一系列代码块(在ECMAScript中是函数), 并且静态保存所有父级的作用域. 通过这些保存的作用域来搜寻到函数中的自由变量.

几个函数可能含有相同的父级作用域(这是一个很普遍的情况, 例如有好几个内部或者全局的函数). 在这种情况下, 在[[Scope]]中存在的变量是会共享的. 一个闭包中变量的变化, 也会影响另一个闭包的.

参考文章

- [深入理解JavaScript系列(16)：闭包(Closures)](http://www.cnblogs.com/tomxu/archive/2012/01/31/2330252.html)
- [执行上下文其三：闭包 Closures](http://www.nowamagic.net/librarys/veda/detail/1646)


### 原型与继承

#### 原型模型

JavaScript 不包含传统的类继承模型, 而是使用 prototypal 原型模型. 在基于类的面向对象方式中, 对象(object)依靠类(class)来产生. 而在基于原型的面向对象方式中, 对象(object)则是依靠构造器(constructor)利用原型(prototype)构造出来的. 在 JavaScript 中, "一切都是对象, 函数是第一类", `Function` 和 `Object` 都是函数的实例.

#### new 与 Object.create

`new` 的实现过程

- 创建一个以这个函数为原型的空对象
- 将函数的 `prototype` 赋值给对象的 `__proto__` 属性
- 将对象作为函数的 `this` 传进去
  - 如果 `return` 中含有`函数`或`对象`且`有效`的情况下将返回该值, 否则返回创建的对象

```Javascript
let instance = {}
instance.__props__ = InputFunc.prototype
let result = InputFunc.call(instance, ...arguments)
return typeof result === 'function' && typeof result === 'object' && result ? instance : result
```

`Object.create` 的实现过程

- 创建一个新的空函数
- 将传入对象作为该函数 `prototype` 属性
- 通过 `new` 创建一个新对象并返回

```Javascript
let NewFuc = function () {}
NewFuc.prototype = object
return new NewFuc()
```

#### 生成对象方式

```Javascript
var obj = {
  name: 'david'
}

var Foo = function(name) {
  this.name = name
}

Foo.prototype.do = function() {}
var personA = new Foo('David')

// ECMAScript 5 引入, 相当于
Object.create = function(parent) {
  function Foo() {}
  Foo.prototype = parent;
  return new Foo();
}

var personB = Object.create({
  gender: 'male'
})

console.log(personB.gender) // male
```

#### prototype chain - 原型链

JavaScript 可以采用构造器(constructor) 生成一个新的对象, 每个构造器都拥有一个 prototype 属性, 而每个通过此构造器生成的对象都有一个指向该构造器原型 (prototype) 的内部私有的链接 (proto), 而这个 prototype 因为是个对象, 它也拥有自己的原型, 这么一级一级直到原型为null, 这就构成了原型链.

在 Javascript 中有一个隐藏的属性 `__proto__` (proto 是一个不应在你代码中出现的非正规的用法, 这里仅仅用它来解释JavaScript原型继承的工作原理. )

```
var Foo = function() {}
Foo.prototype.say = 'hello'

var a = new Foo()
console.log(a.__proto__ === Foo.prototype) // true
console.log(a.__proto__.construct === Foo) // true
console.log(a.__proto__) // Foo { say: 'hello' } --> Foo.prototype
console.log(a.__proto__.__proto__) // Object {} --> Object.prototype
console.log(a.__proto__.__proto__) // null --> Object.__proto__
```

更复杂一点的原型链继承结构

```
function Animal(name) {
  this.name = name
}

Animal.prototype = {
  eat: function() {
    console.log('something to eat..')
  }
}

function Mammal() {
  this.name = 'mammal'
}

Mammal.prototype = new Animal('animal')
Mammal.prototype.constructor = Mammal

function Horse() {
  this.name = 'horse'
}

Horse.prototype = new Mammal()
Horse.prototype.constructor = Horse

Horse.prototype.eat = function() {
  console.log('eat glass')
}

var horseA = new Horse()
console.log(horseA.__proto__ === Horse.prototype) // true
console.log(Horse.prototype.__proto__ === Mammal.prototype) // true
console.log(Mammal.prototype.__proto__ === Animal.prototype) // true
```

在 ECMAScript 中, 每个由构造器创建的对象拥有一个指向构造器 prototype 属性值的隐式引用(implicit reference), 这个引用称之为原型(prototype). 进一步, 每个原型可以拥有指向自己原型的 隐式引用(即该原型的原型), 如此下去, 这就是所谓的原型链(prototype chain)

当前的原型继承(如 Object.create 以及 proto)还是存在以下缺点

- 标准性差：proto 不是一个标准用法, 甚至是一个不赞成使用的用法. 同时原生态的 Object.create 和道爷写的原版也不尽相同.
- 优化性差：不论是原生的还是自定义的 Object.create , 其性能都远没有 new 的优化程度高, 前者要比后者慢高达10倍.

##### 属性查找

当查找一个对象的属性时, JavaScript 会向上遍历原型链, 直到找到给定名称的属性为止, 到查找到达原型链的顶部 - 也就是 Object.prototype - 但是仍然没有找到指定的属性, 就会返回 undefined

##### hasOwnProperty

hasOwnProperty是Object.prototype的一个方法, 它可是个好东西, 他能判断一个对象是否包含自定义属性而不是原型链上的属性, 因为hasOwnProperty 是 JavaScript 中唯一一个处理属性但是不查找原型链的函数.

```
Object.prototype.bar = 1

var foo = {
  goo: undefined
}

cnosole.log(foo.bar) // 1
'bar' in foo // true

foo.hasOwnProperty('bar') // false
foo.hasOwnProperty('goo') // true
```

##### 继承

在 Javascript 中并没有类的概念, 所以只能通过原型链实现继承.
ES6 通过 `寄生组合继承` 的方式去实现继承, 它通过创建一个对象 (Object.create(superClass.prototype)) 的方式得到一个原型对象, 这个对象的构造函数必须等于该子类的构造函数, 否则实例就无法找到该类了. 然后通过赋值给子类原型链的方式就可以实现继承; 最后还要确保构造函数调用时必须执行父类的构造函数且不能在构造函数之前修改或定义任何新属性, 否则会影响父类构造函数的执行结果

参考文章

- [深入理解javascript原型继承](http://www.jianshu.com/p/d2742610ec30)
- [深入理解JavaScript系列(5)：强大的原型和原型链](http://www.cnblogs.com/TomXu/archive/2012/01/05/2305453.html)

### Javascript 数据类型

- 基本数据类型: `undefined`, `null`, `boolean`, `number`, `string`, `symbol`
- 引用数据类型: `object`, `array`, `function`

两种类型的值存放的位置不同

- 引用数据类型存储在堆 (heap) 中的对象, 占据空间大, 大小不固定, 如果存储在栈中, 将会影响程序运行的性能
- 引用数据类型在栈中存储了指针, 该指针指向堆中该实体的起始地址
- 当解释器寻找引用值时, 会首先检索其在栈中的地址, 取得地址后从堆中获得实体

## Javascript 内置对象

- 数据封装类对象: `Object`, `Array`, `Boolean`, `Number`, `String`
- 其他对象: `Function`, `Math`, `Date`, `RegExp`, `Error`
- ES6新增对象: `Symbol`, `Map`, `Set`, `Promises`, `Proxy`, `Reflect`

### Proxy 代理

```Javascript
let pQ = new Proxy({ q: 1 }, {
  get (target, name) {
    return name
  }
})

console.log(pQ.q === 'q') // true
```

### Reflect

将一些关键的方法抽离出来赋值给此变量, 用单一的全局变量去存储这些方法,

```Javascript
Reflect.apply
Reflect.construct
Reflect.defineProperty
Reflect.deleteProperty
Reflect.enumerate // 废弃的
Reflect.get
Reflect.getOwnPropertyDescriptor
Reflect.getPrototypeOf
Reflect.has
Reflect.isExtensible
Reflect.ownKeys
Reflect.preventExtensions
Reflect.set
Reflect.setPrototypeOf
```

### Ajax

Ajax 的全称是 Asynchronous JavaScript and XML, 其中, Asynchronous 是异步的意思, 它有别于传统 web 开发中采用的同步的方式.

#### 理解同步异步

同步和异步关注的是消息通信机制 (synchronous communication/ asynchronous communication)
- 同步, 就是在发出一个请求时, 在没有得到结果之前, 该请求就不返回
- 异步, 请求在发出之后, 这个请求就直接返回了, 所以没有返回结果; 必须通过`状态`和`通知`来让请求者处理回调

#### 理解阻塞与非阻塞

阻塞和非阻塞关注的是程序在等待调用结果(消息, 返回值)时的状态
- 阻塞调用是指调用结果返回之前, 当前线程会被挂起, 调用线程只有在得到结果之后才会返回
- 非阻塞调用指在不能立刻得到结果之前, 该调用不会阻塞当前线程

#### Ajax 原理

Ajax 的原理简单来说通过 XmlHttpRequest 对象来向服务器发异步请求, 从服务器获得数据. 也就是 Javascript 可以及时向服务器提出请求和处理响应, 且不阻塞用户

首先了解一下 XMLHttpRequest 对象的属性

- onreadystatechange - 每次状态改变所触发事件的事件处理程序
- responseText - 从服务器进程返回数据的字符串形式
- responseXML - 从服务器进程返回的DOM兼容的文档数据对象
- status - 从服务器返回的数字代码, 比如常见的 404(未找到) 和 200(已就绪)
- statusText - 伴随状态码的字符串信息
- readyState - 对象状态值
  - 0 (未初始化) 对象已建立, 但是尚未初始化(尚未调用open方法)
  - 1 (初始化) 对象已建立, 尚未调用 send 方法
  - 2 (发送数据) send 方法已调用, 但是当前的状态及 http 头未知
  - 3 (数据传送中) 已接收部分数据, 因为响应及 http 头不全, 这时通过 responseBody 和 responseText 获取部分数据会出现错误
  - 4 (完成) 数据接收完毕, 此时可以通过通过 responseXml 和 responseText 获取完整的回应数据

```
var xmlhttp
if (window.XmlHttpRequest) {
  xmlhttp = new XmlHttpRequest()
}

// IE 浏览器创建 XmlHttpRequest 对象
if (window.ActiveXObject) {
  try {
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP")
  }
  catch(e) {
    try {
      xmlhttp = new ActiveXObject("msxml2.XMLHTTP")
    }
    catch (err) {}
  }
}

xmlhttp.open('POST', url, false)
xmlhttp.onreadystatechange = function() {
  if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
    console.log(xmlhttp.responseText)
  }
}

xmlhttp.send(null)
```

参考文章:

- [深入理解Ajax原理](http://blog.csdn.net/lfsf802/article/details/7233640)
- [逐渐深入地理解Ajax](http://www.cnblogs.com/tugenhua0707/p/4524877.html)
- [Ajax工作原理](http://www.cnblogs.com/mingmingruyuedlut/archive/2011/10/18/2216553.html)

### Cross Domain - 跨域

#### AJAX 跨域请求问题

##### 服务器设置头

```Conf
# Nginx Conf
add_header Access-Control-Allow-Origin www.xxx.com always;
add_header Access-Control-Allow-Credentials 'true' always;
add_header Access-Control-Allow-Methods 'GET,POST,PUT,DELETE,OPTIONS' always;
add_header Access-Control-Allow-Headers 'token,Authorization,DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,X-File-Name' always;
```

`Access-Control-Allow-Origin` 并不包括请求发送 Cookie, 若要支持 Cookie 则首先 `Access-Control-Allow-Origin` 不能设置成 `*`, 而且 `Access-Control-Allow-Credentials` 需要设置成 `true`. 而客户端浏览器在提交数据时必须通过设置 `withCredentials = true` 来让此次 Ajax 发送 Cookie

```Javascript
let xhr = new XMLHttpRequest()
xhr.open('GET', 'http://api.xxx.com', true)
xhr.withCredentials = true                  // 开启, 自动发送 cookie
xhr.send(null)
```

##### jsonp

jsonp 原理就是利用 javascript 脚本引用可以跨域. 首先客户端会注册一个 callback, 然后把 callback 传递给服务器. 服务器生成 JSON 数据并且通过 javascript 语法方式生成一个 function, function 的名字就是 jsonp 传递上来的名字. 最后将 json 数据直接以入参的方式, 放置到 function 中, 这样就生成了一段 js 语法的文档, 返回给客户端. 客户端浏览器, 解析 script 标签, 并执行返回的 javascript 文档, 此时数据作为参数, 传入到了客户端预先定义好的 callback 函数里.(动态执行回调函数)

```
var sc = document.createElement(script)
sc.src = 'http://example2.com/getinfo.php?callback=jsonpcallback'
document.getElementsByTagName('head')[0].appendChild(sc)
```

##### 设置 document.domain

浏览器都有一个同源策略, 其限制之一就是第一种方法中我们说的不能通过 ajax 的方法去请求不同源中的文档. 它的第二个限制是浏览器中不同域的框架之间是不能进行 js 的交互操作的. 但是我们却可以在相同的主域下将不同的子域设置成一样的 domain.

```
# a.example.com
document.domain = 'example.com'

# b.b.example.com
document.doamin = 'example.com'
```

这样就可以操作子页面的 Javascript 脚本了, 这些我们都可以通过创建 iframe 来实现. 最后通过调用这个 iframe 的 AJAX 请求相应的数据并返回给主页面达到跨域的效果

##### 通过 window.name

window 对象有个 name 属性, 该属性有个特征：即在一个窗口(window)的生命周期内, 窗口载入的所有的页面都是共享一个 window.name 的, 每个页面对window.name都有读写的权限, window.name 是持久存在一个窗口载入过的所有页面中的, 并不会因新页面的载入而进行重置

因此当我们通过跳转页面而达到传输数据的效果

```
# a.html
window.name = 'something...'
setTimeout(function() {
  location.href = 'b.html'
})

# b.html
console.log(window.name) // something...
```

- window.name 的值只能是字符串的形式, 这个字符串的大小最大能允许2M左右甚至更大的一个容量, 具体取决于不同的浏览器
- 若两页处于不同的域中, 该方式也适用
- 若要使用在 iframe 下, 必须确保 iframe 必须可以跨域, 就是 window 必须可以控制 iframe.contentWindow

##### HTML5 window.postMessage

`window.postMessage(message, targetOrigin)` 方法是html5新引进的特性, 可以使用它来向其它的 window 对象发送消息, 无论这个 window 对象是属于同源或不同源, 目前 IE8+, FireFox, Chrome, Opera 等浏览器都已经支持 `window.postMessage` 方法.

调用 postMessage 方法的 window 对象是指要接收消息的那一个 window 对象, 该方法的第一个参数 message 为要发送的消息, 类型只能为字符串；第二个参数 targetOrigin 用来限定接收消息的那个 window 对象所在的域, 如果不想限定域, 可以使用通配符"*".

需要接收消息的 window 对象, 可是通过监听自身的 message 事件来获取传过来的消息, 消息内容储存在该事件对象的 data 属性中.

```
# a.html
window.postMessage('message...', '*')

# b.html
window.onmessage = function(evt) {
  evt = evt || event
  console.log(evt.message) // message...
}
```

我们可以通过嵌套 iframe 指向目标域, 并监听 `onmessage` 去接受需要请求的数据并换转化成请求, 然后通过请求返回的数据通过 `postMessage` 传回给页面来实现跨域请求

##### FLASH 跨域请求

使用 flash 插件设置 `crossdoamin.xml`, 该文件放在根目录下

```
<!-- crossdoamin.xml -->
<?xml version="1.0"?>
<cross-domain-policy>
  <allow-access-from domain="*.example.com" />
</cross-domain-policy>
```

##### 服务器代理

设置一个同域的域名, 该页面会发出跨域请求, 并返回信息. 这样就可以通过服务器作为中转进行跨域请求了

#### Iframe 跨域

- 当页面的域与 iframe 页面的域不相同时, window 不能并不能控制 iframe 若获取 `iframe.contentWindow` 则会报错
- 如果主域相同, 二级域名不同, 则可以通过两个页面同时将 `document.domain` 设置成主域名就可以实现相互访问

##### HTML5 部分元素可以设置成必须跨域才能使用外部资源

- `<script>`, `<img>`, `<audio>`, `<video>` 等可以设置 `crossOrigin = 'anonymous'` 或者任意不等于 `use-credentials` 的值就可以访问跨域资源

## Set 与 Map

Set 唯一没有重复值, 可以通过 `Array.from(new Set([]))` 达到快速去重
Map 本质上是键值对的集合, 但是 Hash 的范围不限于字符串, 各种类型的值(包括对象)都可以当作键

## WeakMap

- WeakMap 结构与 Map 结构基本类似, 唯一的区别是它只接受对象作为键名 (null 除外), 不接受其他类型的值作为键名, 而且键名所指向的对象, 不计入垃圾回收机制.
- WeakMap 最大的好处是可以避免内存泄漏. 一个仅被 WeakMap 作为 key 而引用的对象, 会被垃圾回收器回收掉.
- WeakMap 拥有和 Map 类似的 set(key, value), get(key), has(key), delete(key) 和 clear() 方法, 没有任何与迭代有关的属性和方法.

## setTimeout

- 因为 Javascript 是单线程, 所以 setTimeout 如果不写时间他会在下一个可执行时间内执行
- 刷新频率受屏幕分辨率和屏幕尺寸的影响，因此不同设备的屏幕刷新频率可能会不同，而 setTimeout只能设置一个固定的时间间隔，这个时间不一定和屏幕的刷新时间相同

## requestAnimationFrame

与setTimeout相比, `requestAnimationFrame` 最大的优势是由系统来决定回调函数的执行时机

- 经过浏览器优化，动画更流畅
- 资源消耗小, 省电, 对移动端更好
- 当窗口处于非激活状态下, 他会暂停并节省资源

## 捕获与冒泡

DOM 事件流 (event flow) 存在三个阶段: `事件捕获阶段`, `处于目标阶段`, `事件冒泡阶段`
DOM 标准事件流的触发的先后顺序为: `先捕获再冒泡`

- 事件捕获: 从根节点开始由外到内进行事件传播
  - window -> document -> documentElement -> body -> ...
- 事件冒泡: 事件冒泡顺序是由内到外进行事件传播，直到根节点

### 阻止事件

- `preventDefault` - 阻止节点默认事件
- `stopPropagation` - 阻止冒泡
- `stopImmeidatePropagation` - 阻止冒泡并阻止该节点上的其他该类型事件触发
