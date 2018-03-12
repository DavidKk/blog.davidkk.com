<!-- title: 前端开发 - 基础知识@Vue -->
<!-- author: <David Jones qowera@qq.com> -->
<!-- date: 2018-03-09 15:18:13 -->
<!-- category: 前端 -->
<!-- tag: 框架 -->

## Vue

- 生命周期
  - Hook 包括: `beforeCreate`, `created`, `beforeMount`, `mounted`, `beforeUpdate`, `updated`, `beforeDestroy`, `destroyed`
- Virtual DOM
  - ElementVNode: 普通元素节点
  - TextVNode: 文本节点
  - ComponentVNode: 组件节点
  - EmptyVNode: 空节点
  - CloneVNode: 克隆节点
    - isClone === true
- VUE 三大模块
  - Observer: 为所有数据添加监听器 Dep
  - Dep: data 中每一个数据都持有这个 Dep 对象, 当数据有更新的时候 `Dep.notice()` 方法会被调用, 并通知 `Watcher`
    - Dep 有一个全局引用 `Dep.target`, 当 `Compile` 解析指令时会将当前指令的 `Watcher` 赋值到 `Dep.target`
      - 解析指令的时候会读取变量, 在 `getter` 中, 会调用当前的 `dep.depend()` 方法并将 `Watcher` 绑定到当前的 `dep.subs` 列表中
  - Compile: 对每个元素节点进行扫描与解析, 根据指令模板替换数据, 以及绑定相应的更新函数.
  - Watcher: 作为连接 `Observer` 和 `Compile` 的桥梁, 当 `Compile` 解析指令时会生成一个 `Watcher` 并给它绑定一个 `update` 方法, 并添加到当前正在解析的指令所依赖的对象的 `Dep` 对象上. 在收到 `Dep` 的消息之后, `Watcher` 会通知 `Directive` (指令) 对 DOM 节点进行更新
    - 当 `update` 执行时大部分情况将自身压进队列中, 等待下一次更新.

参考资料
- [https://github.com/berwin/Blog/issues/11](https://github.com/berwin/Blog/issues/11)
- [https://www.jianshu.com/p/b55eb91014d2](https://www.jianshu.com/p/b55eb91014d2)
