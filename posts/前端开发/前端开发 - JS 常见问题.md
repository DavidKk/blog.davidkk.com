<!-- title: 前端开发 - JS常见问题 -->
<!-- author: <David Jones qowera@qq.com> -->
<!-- date: 2017-02-08 15:26:55 -->
<!-- category: 前端 -->
<!-- tag: 基础知识 -->

# JS常见问题

## for in 及原型链查询索引顺序

所有的方法都会用相同的方法读取原型链中的值

- 首先根据数组索引进行查找
- 然后根据初始值进行查找, 先进先出
  - 这里面的排序是根据ANSI码进行排序
- 查找所有标点符号, 先进先出

参考资料
- [http://stackoverflow.com/questions/5467129/sort-javascript-object-by-key/31102605#31102605](http://stackoverflow.com/questions/5467129/sort-javascript-object-by-key/31102605#31102605)
