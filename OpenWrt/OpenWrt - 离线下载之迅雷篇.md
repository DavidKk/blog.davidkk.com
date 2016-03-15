<!-- title: OpenWrt - 离线下载之迅雷 Xware -->
<!-- author: <David Jones qowera@qq.com> -->
<!-- date: 2015-04-11 12:57:14 -->
<!-- category: OpenWrt -->
<!-- tag: OpenWrt,路由器,迅雷,Xware -->

迅雷远程下载固件，正式更名为迅雷固件，代号为 Xware

### 安装 Xware

若安装 Xware luci 可以忽略这里，直接跳到下面 "安装 Xware luci"

```
$ opkg install luci-app-xunlei
```

设置可以通过 webUI 服务 -> 迅雷远程下载

选择启用，修改挂载点，修改安装目录，选择合适的固件程序版本，保存&应用

#### 离线下载

通过 [http://yuancheng.xunlei.com/](http://yuancheng.xunlei.com/) 管理下载


#### 不使用 WebUI
若不同过 Xware luci，则可以进入 `http://luyou.xunlei.com/` 找到自己的固件并下载 (现在都不知道在哪里找到了...现在都不知道在哪里找到了...)

```
$ cp /mnt/sdb/share/xunlei /etc/xunlei
$ ./portal

initing...
try stopping xunlei service first...
killall: ETMDaemon: no process killed
killall: EmbedThunderManager: no process killed
killall: vod_httpserver: no process killed
setting xunlei runtime env...
port: 9000 is usable.

YOUR CONTROL PORT IS: 9000

starting xunlei service...
etm path: /etc/xunlei
execv: /etc/xunlei/lib/ETMDaemon.

getting xunlei service info...
Connecting to 127.0.0.1:9000 (127.0.0.1:9000)

THE ACTIVE CODE IS: xxxxx # 这里会返回一串激活码

go to http://yuancheng.xunlei.com, bind your device with the active code.
finished.
```

进入 [http://yuancheng.xunlei.com](http://yuancheng.xunlei.com)

输入上面激活码，点击确认就成功绑定

#### 开机启动 Xware

```
$ ln -s /etc/init.d/xunlei /etc/xunlei/portal
$ /etc/init.d/xunlei enable
```