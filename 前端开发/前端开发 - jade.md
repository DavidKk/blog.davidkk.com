<!-- title: [backup] Jade 学习笔记 -->
<!-- author: <David Jones qowera@qq.com> -->
<!-- date: 2015-05-29 10:10:59 -->
<!-- update: 2015-05-29 10:11:04 -->
<!-- category: Jade -->
<!-- tag: 模板引擎,Jade -->

[http://jade-lang.com/](http://jade-lang.com/)

Jade官方的表述是：Jade 是一款 HTML 的模板引擎

- 编译成 HTML
- 支持动态编码
- 支持可重用性

## 特殊特性备忘

### 属性

#### 属性转码

不转码可以使用 `!=` 来代替 `=`

```
a(escaped="<code>")
a(unescaped!="<code>")

# output

<div escaped="&lt;code&gt;"></div>
<div unescaped="<code>"></div>
```

#### 属性中的布尔值

```
input(type='checkbox', checked)
input(type='checkbox', checked=true)
input(type='checkbox', checked=false)
input(type='checkbox', checked=true.toString())

# output

<input type="checkbox" checked="checked"/>
<input type="checkbox" checked="checked"/>
<input type="checkbox"/>
<input type="checkbox" checked="true"/>
```

#### 属性中的 `style`

```
a(style={color: 'red', background: 'green'})

# output

<a style="color:red;background:green"></a>
```

#### 属性中的 `class`

```
- var classes = ['foo', 'bar', 'baz']
a.foo.bar.baz
a(class=classes)
//- 这里将会合并 `class` 并且不会去重
a.bing(class=classes class=['bing'])

# output

<a class="foo bar baz"></a><a class="foo bar baz"></a><a class="bing foo bar baz bing"></a>
```

```
- var currentUrl = '/about'
a(class={active: currentUrl === '/'} href='/') Home
a(class={active: currentUrl === '/about'} href='/about') About

# output

<a href="/">Home</a><a href="/about" class="active">About</a>
```

#### `&attributes`

```
#foo(data-bar="foo")&attributes({'data-foo': 'bar'})

# output

<div id="foo" data-bar="foo" data-foo="bar"></div>
```

### 注释

```
<!--[if IE 8]>
<html lang="en" class="lt-ie9">
<![endif]-->
<!--[if gt IE 8]><!-->
<html lang="en">
<!--<![endif]-->

# output

<!--[if IE 8]>
<html lang="en" class="lt-ie9">
<![endif]-->
<!--[if gt IE 8]><!-->
<html lang="en">
<!--<![endif]-->
```

### 条件

```
unless user.isAnonymous
  p You're logged in as #{user.name}

# equal

if !user.isAnonymous
  p You're logged in as #{user.name}
```

### doctype

```
doctype html
<!DOCTYPE html>

doctype xml
<?xml version="1.0" encoding="utf-8" ?>

doctype transitional
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

doctype strict
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

doctype frameset
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">

doctype 1.1
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">

doctype basic
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML Basic 1.1//EN" "http://www.w3.org/TR/xhtml-basic/xhtml-basic11.dtd">

doctype mobile
<!DOCTYPE html PUBLIC "-//WAPFORUM//DTD XHTML Mobile 1.2//EN" "http://www.openmobilealliance.org/tech/DTD/xhtml-mobile12.dtd">

doctype html PUBLIC "-//W3C//DTD XHTML Basic 1.1//EN"
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML Basic 1.1//EN">
```

### extends 与 includes

```
```

