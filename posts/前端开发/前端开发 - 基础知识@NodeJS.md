<!-- title: 前端开发 - 基础知识@NodeJS -->
<!-- author: <David Jones qowera@qq.com> -->
<!-- date: 2018-03-09 15:18:13 -->
<!-- category: 前端 -->
<!-- tag: 基础知识 -->

# NodeJS

### setImmediate 与 process.nextTick

- process.nextTick 是将异步回调放到当前帧的末尾, io 回调之前, 如果 nextTick 过多, 会导致 io 回调不断延后, 最后 callback 堆积太多
- setImmediate 是将异步回调放到下一帧, 不影响 io 回调, 不会造成 callback 堆积
