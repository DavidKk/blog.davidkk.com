<!-- title: [backup]开发工具 - Sublime Text 3 -->
<!-- author: <David Jones qowera@qq.com> -->
<!-- date: 2015-10-14 00:14:48 -->
<!-- category: 软件 -->
<!-- tag: 开发工具 -->

# 主要介绍部分比较有用的 ST2/3 插件

### 安装 Package Control

```
import urllib.request,os; pf = 'Package Control.sublime-package'; ipp = sublime.installed_packages_path(); urllib.request.install_opener( urllib.request.build_opener( urllib.request.ProxyHandler()) ); open(os.path.join(ipp, pf), 'wb').write(urllib.request.urlopen( 'http://sublime.wbond.net/' + pf.replace(' ','%20')).read());
```

- Emmet - HTML 快速编写插件
- DocBlockr - 速度编写文档注释的插件
- MarkdownEditing - 编写 markdown 文件实用插件
- SlideBarEnhancements - 侧栏强化工具插件
- AutoFileName - 能够自动补全文件地址的插件
- Color Highlighter - 编辑器中显示颜色代码为相应颜色的插件