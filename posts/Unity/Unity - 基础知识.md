## MonoBehaviour

`MonoBehaviour` 是所有 unity 脚本的基类

### 生命周期

- Awake - 当脚本实例被载入的时候就被调用
- OnEnable - 当对象可用或激活状态下被调用
- Start - 在第一次调用 Update 前被调用
  - 在此过程中, 可以使用 `StartCoroutine` 来进行一些携程触发
  - 该组件在 `Awake` 中 `enabled = true` 时, 则 `Start` 不会被执行
  - 如果该组件被重新 `enabled`, 如果 `Start` 已经被调用过则不会被再次调用, `Start` 只执行一次
- FixedUpdate - 在 `MonoBehaviour` 被调用后, `FixedUpdate` 会在每一个固定帧被调用; 也可以看成单位时间间隔被调用, 与帧并没有任何关系
- Update - 在 `MonoBehaviour` 被调用后, 每一帧都会调用 `Update` 方法
- LateUpdate - 在 `MonoBehaviour` 被调用后, 每一帧都会调用 `LateUpdate` 方法, 但是 `LateUpdate` 会在所有 `Update` 执行后再执行
- OnWillRenderObject - 在渲染时执行, 如果对象可见, 每个相机都会调用该函数; 可通过其改变渲染效果s
- OnDisable - 当对象不可用或非激活状态下被调用
- OnDestroy - 当对象被销毁的时候别调用

![生命周期](https://images0.cnblogs.com/blog/447331/201405/301509390564083.png)

#### Update, FixedUpdate, LateUpdate

`update` 跟平台帧数有关, `update` 是在渲染每一帧之前被调用, 则表示不同的机器配置导致不同的帧数会影响 `update` 的频率, 例如 60帧, 30帧 下执行的频率不同;
`FixedUpdate` 是在固定单位时间间隔被调用, 不受帧数影响. `FixedUpdate` 更多用于处理物理逻辑, 像 `Rigidbody` (刚体);
`LateUpdate` 也是在每一帧渲染之前被调用, 但是 `LateUpdate` 是在所有 `update` 函数运行之后才执行, 可以利用 `LateUpdate` 来设置摄像机跟随, 防止抖动;

* `FixedUpdate` 的时间可以修改项目配置 `Fixedtimestep` 进行修改
