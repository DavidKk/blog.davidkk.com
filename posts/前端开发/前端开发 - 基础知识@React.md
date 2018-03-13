<!-- title: 前端开发 - 基础知识@React -->
<!-- author: <David Jones qowera@qq.com> -->
<!-- date: 2018-03-09 15:18:13 -->
<!-- category: 前端 -->
<!-- tag: 框架 -->

## React

- ReactComponent: 组件
  - ReactEmptyComponent (空组件): return null/false
  - ReactCompositeComponent (复合组件): 类组件/方法组件
  - ReactDOMComponent (DOM 组件): div 等
  - ReactTextComponent (文本组件): 文本组件, 字符串/数字
  - 通过 render 函数 createElement 来创建 ReactElement
- ReactElement: 一个普通的数据对象
  - 拥有 props.children 属性, 标记子 element, 通过此容易实现一些递归的需求
  - 当 props.children.type 标记为自定义组件时, 会递归执行 Component->render->createElement 过程, 并最终获得 element 对象为止
- Instance: Component 实例化后的 this
  - 实例化 Component 之后, Instance 拥有 props, stats 和对应的DOM节点与子组件的引用, 实例化通过 React 自身执行创建/销毁
- ReactHostComponent: 该模块通过 `ReactHostComponentInjection`, `.injectGenericComponentClass(ReactDOMComponent)` 与 `.injectTextComponentClass(ReactTextComponent)` 注入到模块中并通过 `createInternalComponent` 和 `createInstanceForText` 来对 `ReactDOMComponent` 与 `ReactTextComponent` 进行属性加成 (Markup); 例如这两种组件都会增加了对应 DOM 节点的 node 属性.
- PureComponent: 纯正的组件
  - 继承该组件的组件在 shouldComponentUpdate 的阶段会通过 shadowEqual 来判断新旧 props 和 state 的 key 值是否相同, 对应属性的引用是否一致 '===', 若相同则不做更新处理, 若不同则更新
  - 这里主要 onChange={this.udpate.bind(this)} 会导致 props.onChange 引用改变, 导致 render, 所以建议使用 onChange={this.update} 或在 constructor 中使用 bind
  - 总之注意一下引用
- Virtual DOM:
  - 减少重排/重绘次数, 把双缓冲的技术实现到DOM上面
  - 将DOM抽象化, 同时自动化地管理DOM碎片, 开发者在无感知的情况下已经实现优化的过程
  - 并不比手动优化处理DOM节点快, 利用最小的性能代价来更新DOM, 增加了代码可维护性
- 生命周期 (React Lifecycle):
  - Hook 包括: `componenWillReceiveProps`, `componentWillMount`, `shouldComponentUpdate`, `componentWillUpdate`, `componentDidMount`. `componentDidUpdate`, `componentWillUnmount`
  - 初始化时 `getDefaultProps`, `getInitialState`, `componentWillMount`, `render`, `componentDidMount`
  - state 更新时调用 `shouldComponentUpdate`, `componentWillUpdate`, `render`, `componentDidUpdate`
  - props 改变时调用 `componentWillReceiveProps`, `shouldComponentUpdate`, `componentWillUpdate`, `render`, `componentDidUpdate`
  - 只有 `CompositeComponent` 才存在生命周期
  - 父组件与子组件的生命周期 Hook 表现像回调函数一样, parent-will, children-will, children-did, parent-did
- key 属性: 唯一标识, 识别节点身份标识
  - key 最大优势在于数组/集合的更新, 根据 key 值快速辨别元素是否相同
    - key 值相同, 则更新元素
    - key 值不同, 则销毁元素然后创建一个新元素
  - 当没有定义 key 值时, 首先会报错提示, 然后会判断成所有元素都相同并进行更新元素
  - 普通元素不需要 key 值是因为 React 根据元素的位置进行更新前后的对比
- diff 算法: `tree diff` -> `component diff` -> `element diff`
  - tree diff: 只对树结构同层节点进行对比
    - 若出现跨层转移节点, 则会通过创建节点与所有拥有的子节点, 再通过删除直接加到位置中
    - 主要利用 children 获取所有子节点并对这些子节点进行对比
    - 稳定的树结构可以有助于性能的体现, 可通过隐藏等方式代替节点跳级情况
  - component diff: 在 `tree diff` 的需要对比的两个组件的过程叫做 `component diff`
    - 不是同一类就替换此组件及所有其子节点
    - 如果不是同一类就需要更新, 通过删除旧组件再创建一个新组件插入到被删除组件的位置
    - 如果类型相同, 暂时不更新, 往下进行 `element diff`
    - 若为同一类, 也有可能其 Virtual DOM 没有发生改变, 这是组件提供了 `shouldComponentUpdate` 方法让用户自行判断是否需要更新自身, 或使用 `extends PureComponent` 的方式表示该组件不接受根节点的更新, 即不执行 `render` 方法
  - element diff: 在类型相同的组件对比中, 需要再对内部元素进行对比的过程叫做 `element diff`
    - INSERT_MARKUP (插入): 新的 `component` 类型不在老集合里, 需要对新节点执行插入操作
    - MOVE_EXISTING (移动): 老的集合包含新的 `component` 类型, 就需要做移动操作, 可以复用以前的 DOM 节点
    - REMOVE_NODE (删除): 老的 component 不在新集合里的, 需要执行删除操作 或者 老的 component 类型在新集合里也有, 但对应的 element 不同则不能直接复用和更新, 需要执行删除操作
  - 通过 key 标记需要更新的 Virtual DOM
- 一致性比较 (reconciliation): Fiber (纤维)
  - Docs: https://github.com/facebook/react/tree/master/packages/react-reconciler
  - 拥有权重
    - 权重低的任务会被高权重的任务进入而打断
  - 分为两个阶段: 以 render 函数为两个阶段的分割
    - reconciliation phase (调和/挂载阶段): 执行 diff 寻找哪些节点是需要被更新的
      - 所处生命周期: componentWillMount, componentWillReceiveProps, shouldComponentUpdate, componentWillUpdate
      - 导致部分生命周期中的函数可能并重复执行
    - commit phase (提交/更新阶段): 不会被任何任务打断直到完毕
      - 所处生命周期: componentDidMount, componentDidUpdate, componentWillUnmount
      - 因此异步请求接口等都应该在 componentDidMount 时进行
- 组件间的通信方式:
  - 自上而下 (官方推荐)
  - 穿透多个子节点可以使用 context 方式
  - 兄弟节点之间的传递则可以通过父节点作为中转站
  - 时下最流行的方式是通过 redux 等状态管理工具
- 高阶组件 (Higher Order Component): 类似与高阶函数, 一种开发模式, 工厂模式, 创建一个函数并传入组件类并返回该组件
  - Props Proxy (属性代理): 通过返回一个新建的组件并将该组件的属性赋值给传入组件类的属性中, 并返回该传入组件
  - Inheritance Inversion (继承反转): 通过创建一个新组件并继承传入组件, 达到不影响原组件的情况下可以扩展组件
    - 获取原始 state 与继承原组件的所有方法
    - 渲染劫持
- 新特性:
  - 16.4 componentWillMount componentWillUpdate componentWillReceiveProps 将会废除, static getDerivedStateFromProps 将被引进

参考资料
- [https://blog.kisnows.com/2017/09/20/how-react-render-component-to-dom/](https://blog.kisnows.com/2017/09/20/how-react-render-component-to-dom/)
