<!-- title: 前端开发 - 试题@Interesting -->
<!-- author: <David Jones qowera@qq.com> -->
<!-- date: 2015-03-18 23:46:54 -->
<!-- category: 前端 -->
<!-- tag: 试题 -->

# 试题

## 使等式成立并执行打印

```Javascript
if (a == 1 && a == 2 && a == 3) {
  console.log('wtf?')
}
```

### 考点

- 运算符
- 隐式转换中调用的方法
  - toString
  - valueOf

### 答案

```Javascript
var a = { value: 0 }
a.valueOf = () => ++ a.value

if (a == 1 && a == 2 && a == 3) {
  console.log('wtf?')
}
```

```Javascript
var value = 0
function a () {}
a.toString = () => ++ value

if (a == 1 && a == 2 && a == 3) {
  console.log('wtf?')
}
```

```Javascript
/**
 * Symbol.toPrimitive 标记控制数据对比时转换数据后的结果值
 */
var a = {}
a[Symbol.toPrimitive] = (function (value) {
  return function (hint) {
    // hint === 'number'
    return ++ value
  }
})(0)

if (a == 1 && a == 2 && a == 3) {
  console.log('wtf?')
}
```

## 写出打印的答案

```Javascript
function a (a, b, c) {
  console.log(this.length)
  console.log(this.callee.length)
}

function fn (d) {
  arguments[0](10, 20, 30, 40, 50);
}

fn(a, 10, 20, 30)
```

### 考点

- arguments 中 this 的引用
- callees 在 arguments 中是指代什么

### 答案

- this.length === 4: `arguments[0]()` 等同于 `arguments.a()`, this 会指向 `arguments`
- this.callee.length === 1: callees 是 arguments 中指向源执行函数的执行参数数量 `fn(d)` 只定义了一个参数


## 写出打印结果

```Javascript
if (!'a' in window) {
	var a = 10
}

console.log(a)
```

```Javascript
if (!('a' in window)) {
  var a = 10
}

console.log(a)
```

```Javascript
var x = ''
if (function a () {}) {
  x += typeof a
}

console.log(x)
```

### 考点
- 声明提升
- `in` `instanceof` 执行顺序

### 答案

- undefined - 因为 `!'a'` 先执行, 导致 `false in window` 为 `false`
- undefined - 因为声明提升, 所以 `'a' in window` 为 true, 取反得 false
- undefined - 因为 `(function a () {})` 在 `if ()` 中执行, 不会在函数整体声明提升
