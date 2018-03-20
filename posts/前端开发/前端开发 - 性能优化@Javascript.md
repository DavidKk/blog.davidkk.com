<!-- title: 前端开发 - 性能优化@Javascript -->
<!-- author: <David Jones qowera@qq.com> -->
<!-- date: 2018-03-09 15:18:13 -->
<!-- category: 前端 -->
<!-- tag: 性能优化 -->

# Javascript 性能优化

- 使用变量缓存
  - 缓存正则对象, 正则对象创建非常缓慢
  - `Object.keys()`
    - 可以得到自身可枚举的属性, 但得不到原型链上的属性
  - `Object.getOwnPropertyNames()`
    - 可以得到自身所有的属性 (包括不可枚举 enumerable), 但得不到原型链上的属性, Symbols 属性也得不到
- 减少`递归`与`递推`的使用
- 使用全等 `===`, 或者 `switch`
- 删除不必要的属性引用, 使用 `i = undefined` 或者 `i = null`
  - 垃圾回收机制是当引用为 0 时执行回收
  - `delete o.a` 会直接改变对象的结构
- 不使用 `eval`
- 使用字面量代替构造函数
  - 字面量是引擎直接解释执行的, 而如果使用构造函数的话, 需要调用一个内部构造器
  - `var a = new Object()` -> `var a = {}`
  - `var a = new Array()` -> `var a = []`
    - `empty` 的值会通过字典的方式保存起来, 导致访问也变慢
  - 往数组中插入混合类型很容易降低数组使用的效率，尽量保持数组中元素的类型一致

### 遍历优化

遍历速度 (for cache > for) > (for of > forEach) > for in

### 不使用 for in 遍历

- 遍历所有属性, 不仅是 ownProperty 也包括`原型链上`的所有属性
- 忽略可枚举属性 (enumerable 为 false 的属性)
- 必须按特定顺序遍历, 先遍历所有数字键, 然后按照创建属性的顺序遍历剩下的
  - 数字键按小到大遍历

```Javascript
function A () {}
A.prototype.attrA = undefined

let objectA = new A()
objectA.attrB = undefined
Object.defineProperty(objectA, 'attrC', {
  value: undefined,
  enumerable: false
})

for (let i in objectA) {
  console.log(i)
}

// 'attrB', 'attrA'
// it will ignore attrC

let objectB = {
  ',': undefined,
  '.': undefined,
  b: undefined,
  c: undefined,
  a: undefined,
  2: undefined,
  3: undefined,
  1: undefined
}

for (let i in objectB) {
  console.log(i)
}

// 1, 2, 3, ',', '.', 'b', 'c', 'a'
```

```Javascript
let object = {
  ',': undefined,
  '.': undefined,
  b: undefined,
  c: undefined,
  a: undefined,
  2: undefined,
  3: undefined,
  1: undefined
}

let keys = Object.keys(object)
for (let i = keys, i --;) {
  // to do something
}
```

### 使用变量缓存

```Javascript
let array = []
for (let i = 0, l = array.length; i < l; i ++) {
  // doing something
}
```

### 倒序 for, 将 i -- 放到退出判断条件里

```Javascript
let array = []
for (var i = array.length;i --;) {
  // doing something
}
```
