<!-- title: [回顾]编写 weinre webpack 插件 -->
<!-- author: <David Jones qowera@qq.com> -->
<!-- date: 2016-07-08 15:04:12 -->
<!-- category: 项目回顾 -->
<!-- tag: webpack, nodejs, develop -->

# 编写 weinre webpack 插件

### 项目

Github: https://github.com/DavidKk/weinre-webpack
NPM: https://www.npmjs.com/package/weinre-webpack

### 起因

webpack 插件中很容易就可以注入代码到HTML里面,
因此想借 weinre 简单实现 weinre 服务开启与 script tag
注入.

### 编写

```
class Weinre {
  apply (compiler) {
    // 绑定watch时执行的事件
    compiler.plugin('watch-run', this.start.bind(this));

    // 完成时执行的事件
    compiler.plugin('compilation', this.applyCompilation.bind(this));
  }
}
```

通过接口方法 apply 可以实行, 服务开启与代码注入, 然后通过 swpan 开启一个 weinre 的
子进程就OK了.

至于代码注入发面也简单

```
class Weinre {
  applyCompilation (compilation) {
    // https://webpack.github.io/docs/plugins.html#the-maintemplate-instance
    compilation.mainTemplate.plugin('startup', this.scriptTag.bind(this));
  }

  scriptTag(source) {
    return `
      !(function () {
        if ('undefined' === typeof window) {
          return;
        }

        // 代码注入
      })();
    ` + source;
  }
}
```

这里注意的是必须判断 window 是否存在, 否则必然会报 window is not defined 错误.
相关细节可以直接参考 https://github.com/DavidKk/weinre-webpack/blob/master/lib/index.js 文件

### 优化

因为用户永远不知道某个端口是否被占用, 因此我在项目中自动查找空闲的端口, 当然也可以自定义相应的.

### 调用

```
npm i weinre-webpack --save-dev
```

```
import Weinre from 'weinre-webpack';

export default {
  ...
  plugins: [
    new Weinre({}),
  ],
  ...
}
```

### 感想

原本打算可以识别多端分离的ID的, 根据系统浏览器与UID的形式自动生成一个ID, 但是因为 weinre 不能自动捕捉所有连接ID, 因此在不知情的情况下难以知道当前ID是什么.

### 最后

browsersync 或 微信开发者工具 也拥有 weinre 的相应工具包. 也可以去使用
