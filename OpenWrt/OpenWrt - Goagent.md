<!-- title: OpenWrt - Goagent -->
<!-- author: <David Jones qowera@qq.com> -->
<!-- date: 2015-04-11 12:57:14 -->
<!-- category: OpenWrt -->
<!-- tag: OpenWrt,路由器,Goagent -->

# OpenWrt - Goagent

具体 goagent 攻略请自行 google/bing，这里只说明具体 OpenWrt 中安装需注意事项。

### 安装 `python`, `python-crypto`, `pyopenssl`, `python-openssl`

```
$ opkg update
$ opkg --dest extdisk install python python-crypto pyopenssl python-openssl
```

### 安装 gevent

因为新版 goagent 需要在 gevent 中运行，应该是3.0+，否则资源消耗巨大。

```
$ opkg update
$ opkg install gevent python-greenlet
```

若在较低版本的 OpenWrt 中并没有这些插件。幸运的话，可以通过网上查找编译好的 gevent 文件，
例如搜索如下文件(此处为 x86 的机器)：

- gevent_1.0.1-1_x86.ipk
- python-greenlet_0.4.5-1_x86.ipk

若果没有则首先下载并安装 SDK

- [官方WIKI](http://wiki.OpenWrt.org/doc/howto/obtain.firmware.sdk)

此处编译方式略...

### 下载 goagent

- [goagent in github](https://github.com/goagent/goagent)

### 配置 goagent

最好放到共享文档中使用编辑器修改，否则会出现很多 ^M

```
$ vim goagent/local/proxy.ini

[listen]
ip = 0.0.0.0
port = 8087
...

[gae]
appid = app1|app2       # 你自己的 appid，没有？自己google，bing一下
...
```

### PAC文件利用，现在的版本其实可以忽略(还是贴上以前的攻略)

利用PAC文件可以实现自动代理。
打开 SwitchyOmega > 设置 > goagent pac > 导出PAC，将导出 goagent.pac 文件上传到路由器 /www 目录中。根据这个文件浏览器就能确定哪些网址需要使用代理，哪些直接连接就可以了。
打开 proxxy.ini 修改，一般新版已经修改好了

```
$ vi /goagent/local/proxxy.ini

[pac]
ip = 0.0.0.0
port = 8086
```

将 goagent.pac 放入 proxy.ini 相同目录中，此时 pac 访问地址为
http://192.168.1.1:8086/goagent.pac

### 运行 goagent

```
python goagent/local/proxy.py
------------------------------------------------------
GoAgent Version    : 3.2.3 (python/2.7.3 gevent/1.0.1 pyopenssl/0.10)
Listen Address     : 0.0.0.0:8087
GAE Mode           : https (TLSv1)
GAE APPID          : appid1|appid2
Pac Server         : http://192.168.1.105:8086/proxy.pac
Pac File           : file:///mnt/sdb/goagent/local/proxy.pac
------------------------------------------------------
WARNING - [Apr 10 10:25:02] please install *libnss3-tools* package to import GoAgent root ca
```

此处 warning 可以不了他，因为 OpenWrt 并木有一套完整的证书系统。
若浏览器出现 https/ssl 隐私问题，请自行导入 `goagent/local/CA.cert` 证书，所有选项均信任，证书对于安全的重要性请自行 google/bing。
