<!-- title: 前端开发 - 基础知识@Webpack -->
<!-- author: <David Jones qowera@qq.com> -->
<!-- date: 2018-03-09 15:18:13 -->
<!-- category: 前端 -->
<!-- tag: 基础知识 -->

# Webpack

- compiler 主要包括 Compiler 与 Watching, 调用 Webpack 方法会返回一个 Compiler 对象, 而执行 run 方法才是真正开始执行编译
  - Compiler 主要存放输入输出相关配置信息与编译器 Parser
  - Watching 监听文件变化
- compilation
  - 负责组织整个编译过程, 包含每个环节所对应的方法
  - 也保存了对 `compiler` 的引用, 而且存放 `modules`, `chunks`, `assets` 以及用于生成生成 js 的 template

## 打包流程

- compile 开发编译
- make 从入口点分析模块及其依赖的模块, 创建这些模块对象
- build-module 构建模块
- after-compile 完成构建
- seal 封装结果
- emit 把各个 chunk 输出到结果文件
- after 完成输出
