<!-- title: 前端开发 - JSON.parse 坑 -->
<!-- author: <David Jones qowera@qq.com> -->
<!-- date: 2017-05-10 11:55:40 -->
<!-- category: 前端 -->
<!-- tag: 基础知识 -->

# JSON.parse 坑

`JSON.parse` 在 `\t`，`\n`，`\b`，`\r` 等等的情况下都会报错， 而最坑的情况是反斜杠双引号(`\"`)。因为反斜杠双引号(`\"`)在字符串中已经表示为三个双引号 `"""`。 因为双引号不闭合导致 JSON 串错误。

那能跟其他一样通过 `string.replace` 方法将其替换成双反斜杠(实际: `\\"`， 显示: `\"`)么？

答案是不行的， 因为字符串中包含双引号 (`"`)， `replace` 会将所有的双引号(`"`) 都转成双反斜杠加双引号(`\\"`)， 导致 `JSON.parse` 的时候匹配到第一个不合法的反斜杠字符串(`\\"`)而不是反斜杠转义符(`\"`); 所以我们只能将反斜杠字符串(`\\`) 也转化成是反斜杠转义符， 可以简单通过两端添加双引号 `'"' + jsonText + '"'`， 也可以通过 `JSON.stringify` 进行一次转义

还不明白不如看例子：

```
let text = '{"q": "\""}'
JSON.parse(text)

Error:
(unknown) Uncaught SyntaxError: Unexpected string in JSON at position 7
  at JSON.parse (<anonymous>)
  at <anonymous>:1:6

# Replace
let text = '{"q": "\""}'
text = text.replace(/\"/g， '\\\"')    // => '{\"q\":\"\"\"}'
JSON.parse(text)                      // JSON.parse 的时候格式错误 '{\"}'

Error:
(unknown) Uncaught SyntaxError: Unexpected token \ in JSON at position 1
    at JSON.parse (<anonymous>)
    at <anonymous>:1:6

# Double Replace
let text = '{"q": "\""}'
text = text.replace(/\"/g， '\\\"')
JSON.parse(text)                      // N 次的结果都将一样

Error:
(unknown) Uncaught SyntaxError: Unexpected token \ in JSON at position 1
    at JSON.parse (<anonymous>)
    at <anonymous>:1:6

# Solve
let text = '{"q": "\""}'
text = '"' + text.replace(/\"/g， '\\\"') + '"'
JSON.parse(text)

# Easy Solve
let text = '{"q": "\""}'
text = JSON.stringify(text)
JSON.parse(text)
```

参考资料

[http://json.org/](http://json.org/)
