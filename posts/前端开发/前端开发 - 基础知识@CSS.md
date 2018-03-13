<!-- title: 前端开发 - 基础知识@CSS -->
<!-- author: <David Jones qowera@qq.com> -->
<!-- date: 2018-03-09 15:18:13 -->
<!-- category: 前端 -->
<!-- tag: 基础知识 -->

## CSS

### 盒模型

盒模型有两种诠释, 一种是 IE 盒模型, 而另一种是 W3C 标准盒模型.

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃             margin             ┃
┃  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━┓  ┃
┃  ┃          border          ┃  ┃
┃  ┃  ┏━━━━━━━━━━━━━━━━━━━━┓  ┃  ┃
┃  ┃  ┃       padding      ┃  ┃  ┃
┃  ┃  ┃  ┏━━━━━━━━━━━━━━┓  ┃  ┃  ┃
┃  ┃  ┃  ┃              ┃  ┃  ┃  ┃
┃  ┃  ┃  ┃    content   ┃  ┃  ┃  ┃
┃  ┃  ┃  ┃              ┃  ┃  ┃  ┃
┃  ┃  ┃  ┗━━━━━━━━━━━━━━┛  ┃  ┃  ┃
┃  ┃  ┃                    ┃  ┃  ┃
┃  ┃  ┗━━━━━━━━━━━━━━━━━━━━┛  ┃  ┃
┃  ┃                          ┃  ┃
┃  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛  ┃
┃                                ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

IE盒模型：

- 主要有 IE5, IE6(Q), IE7(Q)
- width = content + padding left/right + border left/right
- box width = width + margin left/right

W3C盒模型：

- 主要由 IE6(S), IE7(S), W3C标准浏览器
- width = content 宽度
- box width = width + padding left/right + border left/right + margin left/right

因为IE盒模型更为合理, [事例](http://blog.csdn.net/ncode/article/details/7428746), 因此在 CSS3 中引入了 `box-sizing`, 因此我们可以设置使用IE盒模型的渲染模式, IE8也支持.

```
* {
  box-sizing: border-box;
}
```

### 怪异模式 (Quirks mode) 与 标准模式 (Standards Mode)

IE 浏览器从服务端获取网页后会根据文档的 DOCTYPE 定义显示网页, 如果文档正确定义了 DOCTYPE 浏览器则会进入标准模式 (Standards Mode), 否则浏览器会进入怪异模式 (Quirks mode)
在标准模式下, 浏览器会根据 W3C 的规范来渲染页面; 而在怪异模式中, 页面将以 IE5 的渲染方式来渲染页面.

#### 设置标准模式

[最详细](http://www.fantxi.com/blog/archives/browser-mode/)

- 加 DOCTYPE 声明
- 设置 X-UA-Compatible 触发

#### 设置怪异模式

- 无 doctype 声明, 定义旧的HTML版本（HTML4以下, 例如3.2）
- 加 XML 声明, 可在 ie6 下触发
- 在 XML 声明和 XHTML 的 DOCTYPE 之间加入 HTML 注释, 可在ie7下触发
- `<!-- keep IE7 in quirks mode -->` 放在 `<!DOCTYPE` 前面

### Flex 布局

- 主轴 (main axis): 通过这个伸缩盒子特性，可以很好的管理伸缩项目在伸缩盒子中的布局方向。这个方向可以是从左到右，从上到下，从下到上，从右到左。这个主轴的方向可以通过 `flex-direction` 属性来定义值分别为 row，row-reverse，column，column-reverse
- 主轴起点 (main start) 和终点 (main end): 伸缩项目从主轴起点开始布局到终点结束。属性 `justify-content` 就是根据主轴的起点和终点赋予 start，center，end 等值来布局的
- 主轴长度 (main size): 伸缩项目在主轴方向上的宽度或者高度就是项目的主轴长度
- 侧轴 (cross axis): 与主轴垂直的轴是侧轴，所以说，侧轴的方向是由主轴决定的
- 侧轴的起点 (cross start) 和终点 (cross end): 伸缩项目充满伸缩行，并且伸缩行从侧轴起点开始布局容器到侧轴终点结束
- 侧轴长度 (cross size): 伸缩项目在侧轴方向上的宽度或者高度就是项目的侧轴长度

设为 Flex 布局以后，子元素的 float, clear 和 vertical-align 属性将失效

### CSS 选择器

##### 基础的选择器

- `*` 通用元素选择器 `* { margin: 0; padding: 0; }`
- `E` 标签选择器 `p { color: #333; }`
- `.` 类选择器 `.content { color: #333; }`
- `#` ID选择器 `#caption { color: #000; }`

##### 组合选择器

- `E,E` 多元素选择器 `a,p { color: #333; }`
- `E E` 后代元素选择器 `p a { color: #fff; }`
- `E > F` 子元素选择器 `p > a { color: #000; }`
- `E + F` 毗邻元素选择器 `p + p { color: #330; }`

##### 属性选择器

###### CSS 2.1

- `E[attr]` 匹配属性存在 `a[href] { color: #fff; }`
- `E[attr=val]` 匹配属性等于某值 `p[class="error"] { color: red; }`
- `E[attr~=val]` 匹配属性中含有某值, 用空格分开 `p[class~="error"] { color: red; }`
- `E[attr|=val]` 匹配连字号分割, 若为 `class` 只能匹配到只有一个 `class`且拥有 `-` 的元素 p[lang|=en] { color: green; }`

###### CSS 3

- `E[attr^="val"]` 属性attr的值以val开头的元素 `a[class^="btn-"] { color: red; }`
- `E[attr$="val"]` 属性attr的值以val结尾的元素 `a[class$="-red"] { color: red; }`
- `E[attr*="val"]` 属性attr的值包含val的元素 `a[class*="btn"] { color: red; }`

##### 伪类

###### CSS 2.1

- `E:first-child` 匹配父元素的第一个子元素 `p:first-child { color: #fff; }`
- `E:link` 匹配所未被点击的链接元素 `a:link { color: #fff; }`
- `E:visited` 匹配所有已被点击的链接元素 `a:visited { color: red; }`
- `E:active` 匹配鼠标已按下但未被释放的元素 `a:active { color: red; }`
- `E:hover` 匹配鼠标悬停的元素 `a:hover { color: red; }`
- `E:focus` 匹配获得当前焦点元素 `a:focus { color: red; }`
- [`E:in-range`](http://www.w3schools.com/cssref/sel_in-range.asp) 匹配 `type="number"` 并且在有效范围内的input元素 `input:in-range { color: red; }` IE 不支持
- [`E:out-of-range`](http://www.w3schools.com/cssref/sel_out-of-range.asp) 匹配 `type="number"` 并且不在有效范围内的input元素 `input:out-of-range { color: red; }` IE 不支持
- [`E:valid`](http://www.w3schools.com/cssref/sel_valid.asp) 匹配所有有效的input元素 `input:valid {}`
- [`E:invalid`](http://www.w3schools.com/cssref/sel_invalid.asp) 匹配所有无效的input元素 `input:invalid { color:red; }`
- [`E:optional`](http://www.w3schools.com/cssref/sel_optional.asp) 匹配所有没有 `required` 的input元素 `input:optional { color: red; }` IE 9以上才支持
- [`E:read-only`](http://www.w3schools.com/cssref/sel_read-only.asp) 匹配所有拥有 `readonly` 的input元素 `input:read-only {}`, `input:-moz-read-only {}`
- [`E:read-write`](http://www.w3schools.com/cssref/sel_read-write.asp) 匹配所有不拥有 `readonly` 的input元素 `input:read-write {}`, `input:-moz-read-write {}`
- [`E:lang(c)`](http://www.w3schools.com/cssref/sel_lang.asp) 匹配lang属性等于c的元素 `a:lang(sv) { quotes: “\201D” “\201D” “\2019″ “\2019″; }`

###### CSS 3

表现性伪类

- `E:enabled` 匹配表单中激活的元素 `input:enabled { color: #000; }`
- `E:disabled` 匹配表单中禁用的元素 `input:disabled { color: #999; }`
- `E:checked` 匹配表单中被选中的单选框与复选框 `input[type="raido"]:checked { background-color: #fff; }`
- `E::selection` 匹配用户当前选中的元素 `p::selection { color: #555; }`

结构性伪类

- `:root` 匹配文档的根元素, 对于HTML文档, 就是HTML元素, 权重大于 `html{}` `:root { color: #fff; }`
- `E:nth-child(n)` 匹配其父元素的第n个子元素, 第一个编号为1,  `p:nth-child(3) { color: #fff; }`, n由0开始 `p:nth-child(2n) {}`
- `E:nth-last-child(n)` 匹配其父元素的倒数第n个子元素, 第一个编号为1 `p:nth-last-child(3) { color: #fff; }`
- `E:nth-of-type(n)` 与:nth-child()作用类似, 但是仅匹配使用同种标签的元素 `p:nth-of-type(3) { color: #fff; }`
- `E:nth-last-of-type(n)` 与:nth-last-child() 作用类似, 但是仅匹配使用同种标签的元素 `p:nth-last-of-type(n) { color: #fff; }`
- `E:last-child` 匹配父元素的最后一个子元素, 等同于:nth-last-child(1) `p:last-child { color: #fff; }`
- `E:first-of-type` 匹配父元素下使用同种标签的第一个子元素, 等同于:nth-of-type(1) `p:first-of-type { color: #fff; }`
- `E:last-of-type` 匹配父元素下使用同种标签的最后一个子元素, 等同于:nth-last-of-type(1) `p:last-of-type { color: #fff; }`
- `E:only-child` 匹配父元素下仅有的一个子元素, 等同于:first-child:last-child或 :nth-child(1):nth-last-child(1)
- `E:only-of-type` 匹配父元素下使用同种标签的唯一一个子元素, 等同于:first-of-type:last-of-type或 :nth-of-type(1):nth-last-of-type(1)
- `E:empty` 匹配一个不包含任何子元素的元素, 注意, 文本节点也被看作子元素 `a:empty { display:block;width:100px;height:100px;background:#ff0; }`
- `E:not` 匹配不符合当前选择器的任何元素 `:not(p) { #fff; }`
- [`E:target`](http://www.w3schools.com/cssref/css3_pr_target.asp) 匹配文档中特定”id”点击后的效果, 暂时主流浏览器都均不支持

##### 伪元素

- [`E::first-line`](https://developer.mozilla.org/en-US/docs/Web/CSS/::first-line) 匹配E元素的第一行 `p:first-line { color: red; }` 此时设置 `text-transform: uppercase;` 在 `webkit` 中无效.
- `E::first-letter` 匹配E元素的第一个字母 `p:first-letter { color: red; }`
- `E::before` 在E元素前插入生成的内容 `p:before { content: 'Hello'; }`
- `E::after` 在E元素后插入生成的内容 `p:after { content: 'World'; }`

##### 同级元素选择器

- `E ~ F` 匹配任何在E元素之后的同级F元素 `p ~ ul { color: red; }`

### 优先级与权重

一般我们描述CSS的优先级是这样：

!important > 内联 > id(#) > (class(.) > 同级元素选择器 > 伪类|属性) > 标签|伪元素 > 通配符 > 继承

其实括号内的选择器权重其实均相等, 我们先探讨一下如何对比权重值与如何计算出权重的优先级.

#### 权重值的比较

而在普遍的文章描述中, 经常会说到 ID 是100, Class 的权重是 10, 标签是 1;
其实权重结算的结果并非如此, 而是将这些更像如此 ID,Class,E, ID永远比Class优先
当出现这样的情况：

```
html body header nav ul li div p a span em { color: red; }
.num { color: yellow; }
```

此时样式色结果是 yellow, 若按Class 权重为10来看, 则明显应该是 red; 所以我们可以确定此时权重应该是 0,0,11 0,1,0,
当 class 权重一样的时候, 会根据次权重的即 E 权重的数值来比较, 若都一样会通过后者来确定优先级;

##### 权重值的计算

一条样式规则的整体权重值包含四个独立的部分：[A, B, C, D]

- A表示内联选择器, 只有1或者0两个值, 若有我们标记A=1, 否则A=0, 标记的权重为 [1/0,0,0,0]
- B表示ID选择器, 表示规则中的ID数量, 标记的权重为 [0,N,0,0]
- C表示类选择器、属性选择器等, 表示这些选择器的数量, 标记的权重为 [0,0,N,0]
- D表示伪元素选择器及元素选择器, 表示这些选择器的数量, 标记的权重为 [0,0,0,N]

权重值只会看选择器的数量, 而不会因为DOM树中两节点的距离而有所不同, 例如：`html a == body a`.

##### `!important` 规则例外

当 !important 规则被应用在一个样式声明中时, 该样式声明会覆盖CSS中任何其他的声明, 无论它处在声明列表中的哪里. 尽管如此, !important规则还是与优先级毫无关系. 使用 !important 不是一个好习惯, 因为它改变了你样式表本来的级联规则, 从而使其难以调试.

- Never 永远不要在全站范围的 css 上使用 !important
- Only 只在需要覆盖全站或外部 css（例如引用的 ExtJs 或者 YUI ）的特定页面中使用   !important
- Never 永远不要在你的插件中使用 !important
- Always 要优化考虑使用样式规则的优先级来解决问题而不是 !important

##### `:not` 伪类例外

:not 否定伪类在优先级计算中不会被看作是伪类. 事实上, 在计算选择器数量时还是会把其中的选择器当做普通选择器进行计数.

##### 关于 `inherit`

除了直接指定到元素上的样式规则以外, 每个属性值还有一个可能为 inherit(继承) 的值. 表示元素的该样式属性继承自父级元素, 与父级元素的定义一致.
继承而来的属性值, 权重永远低于明确指定到元素的定义.

参考文章

- [优先级](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Specificity)
- [重新认识CSS的权重](http://www.cssforest.org/blog/index.php?id=185)

### BFC 规范

BFC (Block Formatting Context, 块级格式化上下文) 是 W3C CSS 2.1 规范中的一个概念, 它决定了元素如何对其内容进行定位, 以及与其他元素的关系和相互作用.

简单来讲, 我们可以把它理解为, 我们在进行盒模型布局的时候, 如果一个元素符合了成为 BFC 的条件, 该元素成为一个隔离了的独立容器, 元素内部元素会垂直的沿着其父元素的边框排列, 和外部元素互不影响 . 比如浮动元素会触发 BFC, 浮动元素内部的子元素主要受到该浮动元素的影响, 而两个浮动元素之间是互不影响的.

在 CSS3 中, BFC 叫做 Flow Root. 在早期的 ie 中也有类似的概念 haslayout IE6、7 的很多布局产生的 bug（如3px 间隙、绝对定位的继承宽度）都可以通过触发 haslayout 修复, 比较推荐的方法为 zoom:1 与 height:1%, 不会破坏已有的样式, 相信大家对它并不陌生.

#### 产生 BFC 的条件

- 根元素或其它包含它的元素
- 浮动 (元素的 float 不为 none)
- 绝对定位元素 (元素的 position 为 absolute 或 fixed)
- 内联块 inline-blocks (元素的 display: inline-block)
- 表格单元格 (元素的 display: table-cell, HTML表格单元格默认属性)
- 表格标题 (元素的 display: table-caption, HTML表格标题默认属性)
- overflow 的值不为 visible 的元素
- 弹性盒 flex boxes (元素的 display: flex 或 inline-flex)

#### BFC 对于布局的影响

根据 w3c 的规范, 在一个 BFC 中, 盒子(boxes) 从 BFC 的顶端往下, 一个挨着一个垂直放置. 相邻盒子之间的垂直距离取决于它们的 margin 属性, 同一个 BFC 中, 相邻块级盒子之间的垂直 margin 值会折叠. 这句话包含几个限定条件, 边距折叠的分析在以后的文章中再展开, 这次仅注意到边距折叠只发生在同一个 BFC 中.

#### BFC 对浮动的影响

根据 w3c 的规范, 在 BFC 中, 每个盒子的左外边缘(edge)都会触及 BFC 的左边缘, 甚至浮动元素存在的时候也是这样(尽管盒子的行盒 line boxes 会因为浮动元素而被压缩), 除非盒子创建了一个新的 BFC.

#### 合并外边距与BFC

相邻的两个盒子合并外边距折叠的结果：

- 两个相邻的外边距都是正数时, 折叠结果是它们两者之间较大的值.
- 两个相邻的外边距都是负数时, 折叠结果是两者绝对值的较大值.
- 两个外边距一正一负时, 折叠结果是两者的相加的和.

产生折叠的必备条件：margin必须是邻接的, 而根据w3c规范, 两个margin是邻接的必须满足以下条件：
                         1
- 必须是处于常规文档流(非float和绝对定位)的块级盒子,并且处于同一个BFC当中
- 没有线盒, 没有空隙(clearance), 没有padding和border将他们分隔开
- 都属于垂直方向上相邻的外边距, 可以是下面任意一种情况
- 元素的 margin-top 与其第一个常规文档流的子元素的 margin-top
- 元素的 margin-bottom 与其下一个常规文档流的兄弟元素的 margin-top
- height 为 auto 的元素的 margin-bottom 与其最后一个常规文档流的子元素的 margin-bottom
- 高度为0并且最小高度也为0, 不包含常规文档流的子元素, 并且自身没有建立新的 BFC 的元素的 margin-top 和 margin-bottom


建议阅读参考文章结合例子理解
- [深入理解BFC和Margin Collapse](http://www.w3cplus.com/css/understanding-bfc-and-margin-collapse.html)
- [BFC、浮动、清除和hasLayout](http://blog.comiclee.com/2015/02/bfc%E6%B5%AE%E5%8A%A8%E6%B8%85%E9%99%A4%E5%92%8Chaslayout)
- [【深入BFC】 关于CSS中float布局, 清除浮动, 和margin合并的原理解析, 解开你心中的那些困惑！](http://www.cnblogs.com/v10258/p/3530290.html)


### 栅格 - Grid

栅格可以方便排版设计, 通过设定 `最小栅格大小`, `屏幕总宽度`, `栅格的列宽`, `栅格的列数`, `栅格之间的距离 (水槽 Gutter)`, `栅格的安全边距` 来可以建立一套栅格系统
