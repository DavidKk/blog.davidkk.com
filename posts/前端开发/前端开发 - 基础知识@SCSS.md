<!-- title: 前端开发 - 基础知识@SCSS -->
<!-- author: <David Jones qowera@qq.com> -->
<!-- date: 2018-03-19 01:08:25 -->
<!-- category: 前端 -->
<!-- tag: 基础知识 -->

# SCSS

SCSS 中 NaN Infinity 与 JS 的 NaN Infinity 类似.
JS 两者都属于 number 类型, 但是 scss 中 不属于 number 类型 (很多都不属于)

```
NaN      : 无意义的数, IEEE754 标准规定的双精度浮点小数类型的特殊值
Infinity : 正无穷大, 超过最大数值也会变成该值
```

```SCSS
@debug '1111111-----------------------';
@debug 1 / 0;              // 1/0
@debug 1 / 0 == NaN;       // false
@debug 1 / 0 == Infinity;  // true

@debug '2222222-----------------------';
$i: 1 / 0;
@debug $i;                 // Infinity
@debug $i == NaN;          // false
@debug $i == Infinity;     // true

@debug '3333333-----------------------';
$j: 1 / 0;
@if $j == NaN {
  @debug '$j == NaN ==> true';
}
@else {
  @debug '$j == NaN ==> false';         // output
}

@if $j == Infinity {
  @debug '$j == Infinity ==> true';     // output
}
@else {
  @debug '$j == Infinity ==> false';
}

@debug '4444444-----------------------';
$k: 1px / 0px;
@if $k == NaN {
  @debug '$k == NaN ==> true';
}
@else {
  @debug '$k == NaN ==> false';         // output
}

@if $k == Infinity {
  @debug '$k == Infinity ==> true';     // output
}
@else {
  @debug '$k == Infinity ==> false';
}

@debug '555555555-----------------------';
$n: 0px / 0px;
@if $n == NaN {
  @debug '$n == NaN ==> true';           // output
}
@else {
  @debug '$n == NaN ==> false';
}

@if $n == Infinity {
  @debug '$n == Infinity ==> true';
}
@else {
  @debug '$n == Infinity ==> false';      // output
}

@debug '666666666-----------------------';
$m: 0 / 0;
@if $m == NaN {
  @debug '$m == NaN ==> true';           // output
}
@else {
  @debug '$m == NaN ==> false';
}

@if $m == Infinity {
  @debug '$m == Infinity ==> true';
}
@else {
  @debug '$m == Infinity ==> false';      // output
}
```


```SCSS
// 因此可以发现, 并且可以发现与单位无任何关系

@debug 0 / 0 == NaN;            // true
@debug 1 / 0 == Infinity;       // true
@debug 0px / 0px == NaN;        // true
@debug 1px / 0px == Infinity;   // true
```

DOCS:
[https://en.wikipedia.org/wiki/NaN](https://en.wikipedia.org/wiki/NaN)
[https://github.com/sass/sass/issues/937](https://github.com/sass/sass/issues/937)
