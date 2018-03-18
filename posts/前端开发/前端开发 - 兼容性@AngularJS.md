<!-- title: 前端开发 - angular@1.5.8 input 事件兼容问题 -->
<!-- author: <David Jones qowera@qq.com> -->
<!-- date: 2016-09-14 13:16:53 -->
<!-- category: 前端 -->
<!-- tag: AngularJS, 兼容性 -->

<!-- # 前言

- 问题机型   : 华为 Che2-TL00M EMUI 3.0 等部分华为, 三星机型
- 微信版本   : 微信 6.3.22 版本
- 框架版本   : angular.js@1.5.8
- 浏览器版本 : Chrome v37.0.0 (微信)

## 问题表现

- 使用该机华为输入法输入中文情况下会出现第二个输入字符覆盖第一个输入字符
- 问题输入法多数为输入的中文时, 每输入一个字符, 输入框就会显示一个英文, 而非全拼后才输入到输入框
- 该问题只有在微信浏览器才会出现

## 原因排查

angular.js@1.5.8 line: 23994 中, $sniffer.hasEvent 判断浏览器支持 input 事件, 但是在实际过程中, input 事件并没有更新 element.value, 导致输入框无法获取真正输入的值第一个值.

```
  Line: 23994
  if ($sniffer.hasEvent('input')) {
    element.on('input', listener);
  }
```

完成输入的一刻(after keyup), element.value 其实已经包含该值, 在 line: 23968 方法末尾中可以看出此时 `ctrl.$setViewValue(value, event)` 的 value 仍然是空字符串, 导致 $viewValue 的值仍然是空字符串. 即 `$viewValue === value === ''`;

```
  Line: 23968
  var listener = function(ev) {
    if (timeout) {
      $browser.defer.cancel(timeout);
      timeout = null;
    }
    if (composing) return;
    var value = element.val(),
        event = ev && ev.type;

    // By default we will trim the value
    // If the attribute ng-trim exists we will avoid trimming
    // If input type is 'password', the value is never trimmed
    if (type !== 'password' && (!attr.ngTrim || attr.ngTrim !== 'false')) {
      value = trim(value);
    }

    // If a control is suffering from bad input (due to native validators), browsers discard its
    // value, so it may be necessary to revalidate (by calling $setViewValue again) even if the
    // control's value is the same empty value twice in a row.
    if (ctrl.$viewValue !== value || (value === '' && ctrl.$$hasNativeValidators)) {
      ctrl.$setViewValue(value, event);
    }
  };
```

当输入第二个值时, 而此时 $viewValue 的已经更新到第一次输入 element.value. 这个过程之后它会拿第一个值的 $viewValue 与 element.value 对比, 一次很容易发现 (line: 24048) 两个值是不同的, 这样 angular 就会重新赋值 `$element.val($viewValue)` 导致第二次的值会覆盖第一次的值, 而之后的情况不会.

因为 input event 不规范导致, 具体原因不明
但在系统默认浏览器下不会出现该问题

因为如果删除 input 事件, keydown 还会导致值未更新情况,
造成第一个值仍然保存, 但是并不能结合第二个值合并输入成中文
因此还需要将 keydown 修改成 keyup 事件

因为 angular 使用 jQLit 的原因 而且 angular@1.5.8
line: 1881 行中外置该对象, 因此我们可以重写该方法, 将
所有安卓在微信端的 input 事件, 都统一转成 keyup 事件 -->