<!-- title: OpenWrt - 离线下载之 Aria2 -->
<!-- author: <David Jones qowera@qq.com> -->
<!-- date: 2015-04-11 12:57:14 -->
<!-- category: OpenWrt -->
<!-- tag: OpenWrt,路由器,Aria2 -->

## 离线下载之 Aria2

- Aria2 支持的下载种类更多，包括磁力链接（MagnetLink）和一些类似PT的源源
- 界面更加先进 aria2webgui
- 感觉 Aria2 设置比传输更加简单（貌似不需要端口映射之类的设置）
- 最重要的是: Aria2 下载速度更快

#### 安装 aria2

```
$ opkg update
$ opkg install aria2
```

#### 安装 aria2 webUI

- [webui-aria2](https://github.com/ziahamza/webui-aria2)

将它放到 `/www` 下

```
$ mv /mnt/sdb/webui-aria2 /www/aria2
# 也可以通过快捷方式的方式
$ ln -s /mnt/sdb/webui-aria2 /www/aria2
```

现在你可以访问 `192.168.1.x/aria2` 管理 aria2 下载了，但是进入时很多报错提示。

#### 启动并测试

```
$ aria2c --enable-rpc --rpc-listen-all
2015-04-19 06:07:53.828164 NOTICE - IPv4 RPC: listening to port 6800

2015-04-19 06:07:53.829446 NOTICE - IPv6 RPC: listening to port 6800

# 此时表示已经成功启动了
```

进入 `192.168.1.x/aria2` 看看是否报错都没有了？
若还是提示链接失败，可能是 HTTPS 模式证书问题导致连接不上，此时可以开启 HTTP 模式，上文有提到。

#### 其他

aria2 的速度比较慢，你也可以通过`迅雷离线 + Aria2 + YAAW`打造最快的下载方式，不过这里这里要购买迅雷会员才能完成，此处就略过了。

- [迅雷离线助手](https://github.com/ohsc/ThunderLixianAssistant)
- [ThunderLixianExporter](https://github.com/binux/ThunderLixianExporter)
- [YAAW](https://github.com/binux/yaaw)
