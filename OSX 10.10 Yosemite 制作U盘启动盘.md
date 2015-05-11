<!-- title: [backup]OSX 10.10 Yosemite 制作U盘安装盘-->
<!-- author: <David Jones qowera@qq.com>-->
<!-- date: 2015-04-11 12:57:14-->
<!-- category: 系统-->
<!-- tag: OSX,Yosemite,U盘-->

# [backup]OSX 10.10 Yosemite 制作U盘安装盘

### 下载 Yosemite 系统

自己找下载地址，我也找不到较官方的下载地址。

### 安装

双击 Install OSX Yosemite.dmg 挂载。

将 Install OSX Yosemite.app 拖拽到 Applications 中。

右键 Install OSX Yosemite.app 显示包内容，进入 Contents/SharedSupport/。

双击挂载 InstallESD.dmg，可以看到隐藏文件 BaseSystem.dmg 文件。

设置隐藏文件可见。

```
$ defaults write com.apple.finder AppleShowAllFiles -bool YES
$ killall Finder
```

恢复

```
$ defaults write com.apple.finder AppleShowAllFiles -bool NO
$ killall Finder
```

双击挂载 BaseSystem.dmg 文件。

打开磁盘工具，选择 BaseSystem.dmg 下的 OS X Base System，
选择恢复，将U盘拖拽到目的磁盘，源磁盘为自身（将自身磁盘拖拽过来）。
选择恢复-输入密码-抹掉磁盘-执行恢复。

完成后，进入U盘 System/Installation/

将原安装文件夹 OS X Install ESD 内所有文件都复制到 System/Installation 中。

将 OS X Install ESD中 BaseSystem.dmg 和 Basesystem.chunklist 复制到U盘根目录。

搞掂。

重启电脑，dong~ 一声之时按住 alt/option 键，会看见一个 OS X Base System 的图标，
点击进入即可与 command + r 进入的相同界面，但是这里可以直接安装无需再下载系统，傻瓜版一键搞掂。

最后，最好还是使用 time machine 来备份系统...

完。