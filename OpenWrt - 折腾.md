<!-- title: [backup] openwrt 折腾篇-->
<!-- author: <David Jones qowera@qq.com>-->
<!-- date: 2015-04-11 12:57:14-->
<!-- category: openwrt-->
<!-- tag: openwrt,路由器-->

# [backup] OpenWrt 折腾篇

本文说明个人 OpenWrt 折腾经历，一般都是智能路由需要完成的任务，以下分几个篇章进行记录折腾过程。

<!-- 自动挂载扩容篇 START-->

## 自动挂载硬盘/USB设备

此篇已经在 OpenWrt 安装到 virtualbox 中有说明。

#### 安装支持软件
```
$ opkg update
$ opkg install block-mount  kmod-usb-storage  kmod-fs-ext4  # 安装usb支持
```

#### 查看硬盘状态
```
$ blkid
/dev/sda1: TYPE="ext2"
/dev/sda2: UUID="90f1212b-f256-4fff-9d2b-05af7de0859e" TYPE="ext4"
/dev/sdb: UUID="f2d177f1-ab1a-477f-a99c-366c7c1a822c" TYPE="ext4"
```

#### 格式化硬盘
```
$ opkg update
$ opkg install e2fsprogs    # 格式化工具

$ mkfs.ext4 /dev/sdb        # ext4 格式
# mkfs.ext3 /dev/sdb        # ext3 格式
# mkfs.ext2 /dev/sdb        # ext2 格式
```

#### 挂载硬盘
```
$ mkdir -p /mnt/sdb
$ mount /dev/sdb /mnt/sdb
```

查看挂载硬盘的信息

```
$ df -m
Filesystem  1M-blocks Used Available Use% Mounted on
rootfs             47   26        19  58% /
/dev/root          47   26        19  58% /
tmpfs             124    1       124   0% /tmp
tmpfs               1    0         1   0% /dev
/dev/sdb          497   23       449   5% /mnt/sdb

# /dev/sdb 就是刚才挂载的硬盘
```

### 配置 `fstab` 挂载配置

```
$ vim /etc/config/fstab

config mount
        option device '/dev/sdb'
        option target '/mnt/sdb'
        option fstype 'ext4'
        option enabled '1'
```

### 设置开机自动挂载
```
$ /etc/init.d/fstab enable
```

<!-- 自动挂载扩容篇 END-->


<!-- 在USB或硬盘中安装应用篇 START-->

## 在扩展硬盘或USB设备中安装应用

### 新建安装目录

```
# 给安装路径标记一个ID/NAME
$ mkdir /mnt/sdb/packages/
$ echo dest sdb /mnt/sdb/packages/ >> /etc/opkg.conf

# 安装应用
$ opkg --dest sdb install python # --dest sdb 是关键
```

### 编辑环境变量

```
$ vim /etc/profile

...
# 添加 lib 路径
$ export LD_LIBRARY_PATH="/mnt/sdb/packages/usr/lib:/mnt/sdb/packages/lib"

# 扩展 bin/sbin 路径
$ export PATH=/bin:/sbin:/usr/bin:/usr/sbin:/mnt/sdb/packages/usr/bin:/mnt/sdb/packages/usr/sbin
...

# 保存&退出

# 重启
$ reboot
```

<!-- 在USB或硬盘中安装应用篇 END-->



<!-- OpenWrt 共享文档篇 START-->

## OpenWrt 文件共享

### 安装 samba

```
$ opkg update
$ opkg install samba36-server     # 一般已经安装
$ opkg install luci-app-samba
```

### 创建需要共享的文档
```
$ mkdir /share
$ chmod a+w /share
$ chown nobody:nobody /share
```

### 修改配置模板

也可以通过 webUI 进行修改

```
$ vi /etc/samba/smb.conf.template
[global]
  netbios name = |NAME|
  display charset = |CHARSET|
  interfaces = |INTERFACES|                   # 内网IP
  server string = |DESCRIPTION|
  unix charset = |CHARSET|
  workgroup = |WORKGROUP|
  browseable = yes
  deadtime = 30
  domain master = yes
  encrypt passwords = true
  enable core files = no
  guest account = nobody                      # 匿名用户
  guest ok = yes                              # 匿名用户
  # invalid users = root                      # 屏蔽
  local master = yes
  load printers = no
  map to guest = Bad User
  max protocol = SMB2
  min receivefile size = 16384
  null passwords = yes                        # 无需密码       
  obey pam restrictions = yes
  os level = 20
  passdb backend = smbpasswd
  preferred master = yes
  printable = no
  security = user
  smb encrypt = disabled
  smb passwd file = /etc/samba/smbpasswd
  socket options = TCP_NODELAY IPTOS_LOWDELAY
  syslog = 2
  use sendfile = yes
  writeable = yes                             # 可写
```

### 修改配置

也可以通过 webUI 进行修改

```
$ vi /etc/config/samba

config samba
        option name           'OpenWrt'
        option workgroup      'WORKGROUP'
        option description    'OpenWrt'
        option homes          '0'

config sambashare
        option name           'share'       # 网络显示的共享目录名字
        option read_only      'no'          # 只读
        option users          'daemon'      # 用户，openwrt 默认用户 root,daemon,network,nobody,diantokam
        option create_mask    '0777'        # 读写权限
        option dir_mask       '0777'        # 读写权限
        option path           '/share'      # 共享目录，记得设置目录为可写
        option guest_ok       'yes'         # 匿名用户

config sambashare
        option name           'hidden$'
        option users          'daemon'
        option read_only      'no'
        option create_mask    '0777'
        option dir_mask       '0777'
        option path           '/old'
        option guest_ok       'yes'
```

#### 重启

```
$ /etc/init.d/samba restart
$ /etc/init.d/samba enable
```

### 设置密码

```
$ smbpasswd root
New SMB password:
Retype SMB password:
```

### 现在你可以在网上邻居找到该设备

### 新建用户

因为 openwrt 没有 useradd
我们可以安装 `shadow-groupadd`, `shadow-useradd`

```
$ opkg update
$ opkg install shadow-groupadd shadow-useradd
```

现在我们可以使用 `useradd` 命令了

```
# 创建用户
$ useradd davidjones

# 添加 smbp 用户
$ smbpasswd -a davidjones
New SMB password:
Retype SMB password:

# 然后重启一下
$ /etc/init.d/samba restart
```

### 其他 samba 功能，详细请看
- [samba 官方docs](https://www.samba.org/samba/docs/)

<!-- OpenWrt 共享文档篇 END-->


<!-- OpenWrt 安装 goagent 篇 START-->

## 安装 goagent

具体 goagent 攻略请自行 google/bing，这里只说明具体 openwrt 中安装需注意事项。

### 安装 `python`, `python-crypto`, `pyopenssl`, `python-openssl`

```
$ opkg update
$ opkg --dest extdisk install python python-crypto pyopenssl python-openssl
```
python-mini

### 安装 gevent

因为新版 goagent 需要在 gevent 中运行，应该是3.0+，否则资源消耗巨大，
但是 openwrt 没有，需要配置一个 gevent 环境。幸运的话，可以通过网上查找编译好的 gevent 文件，
例如搜索如下文件(此处为 x86 的机器)：

- gevent_1.0.1-1_x86.ipk
- python-greenlet_0.4.5-1_x86.ipk

若果没有则首先下载并安装 SDK

- [官方WIKI](http://wiki.openwrt.org/doc/howto/obtain.firmware.sdk)

```
$ cd ~
$ wget http://downloads.openwrt.org/whiterussian/newest/OpenWrt-SDK-Linux-i686-1.tar.bz
$ bzcat OpenWrt-SDK-Linux-i686-1.tar.bz2 | tar -xvf -
$ cd ~/OpenWrt-SDK-Linux-i686-1
```

<!-- 未完待续-->

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
打开 SwitchyOmega > 设置 > goagent pac > 导出PAC，将导出 goagent.pac 文件上传到路由器/www目录中。根据这个文件浏览器就能确定哪些网址需要使用代理，哪些直接连接就可以了。
打开 proxxy.ini 修改，一般新版已经修改好了
```
[pac]
ip = 0.0.0.0
port = 8086
```
将 goagent.pac 放入 proxy.ini 相同目录中，此时pac访问地址为
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

此处 warning 可以不了他，因为 Openwrt 并木有一套完整的证书系统。
若浏览器出现 https/ssl 隐私问题，请自行导入 `goagent/local/CA.cert`  证书，所有选项均信任，证书对于安全的重要性请自行 google/bing。

<!-- OpenWrt 安装 goagent 篇 END-->


<!-- 防止DNS污染篇 START-->

## 使用 pdnsd 与 dnsmasq 解决 DNS 污染与创建本地DNS缓存强劲加速解析速度

一般知名NDS服务器提供商，百度垃圾竟然玩劫持，这里严重吐槽，一下列出几个，国内没测试过有没劫持：

##### 国内：

- OpenerDNS:    42.120.21.30
- 114DNS:       114.114.114.114   114.114.115.115
- oneDNS:       112.124.47.27
- aliDNS:       223.5.5.5         223.6.6.6

##### 国际：

- Google DNS:   8.8.8.8           8.8.4.4
- OpenDNS:      208.67.222.222    208.67.220.220
- V2EX DNS:     199.91.73.222     178.79.131.110

### 安装 pdnsd

pdnsd是一款高效灵活的DNS proxy服务器，它既可以充当一个DNS forwarding的角色，也可作为一个DNS cache服务器，更可以作为一款简单的本地解释DNS服务器。

建议将此服务不要安装到USB或其他硬盘上，否则配置起来很麻烦。

```
$ opkg update
$ opkg install pdnsd
```

开始配置 `pdnsd.conf`

```
$ vim /etc/pdnsd.conf

global {
  # debug = on;             # 调试模式，日志会写入 /var/pdnsd/pdnsd.debug
  perm_cache = 5120;        # 缓存文件大小，单位KB
  cache_dir = "/var/pdnsd"; # 缓存文件位置，保留默认
  run_as = "nobody";        # 运行的用户，使用匿名用户
  server_port = 1053;       # 使用1053作为DNS端口，默认是53，因为53端口已经被dnsmasq占用了
  server_ip = 0.0.0.0;      # 监听所有
  status_ctl = on;          # 方便在 pdnsd 运行时通过 pdnsd-ctl 进行管理
  query_method = tcp_only;  # 最重要的配置，只使用 TCP 查询上级DNS, `tcp_only`, `udp_only`, `tcp_udp`
  min_ttl = 15m;            # 最小TTL时间，自己酌情往上加，默认是15分钟
  max_ttl = 1w;             # 最长TTL时间，默认一周
  timeout = 10;             # 全局超时时间，默认10秒，酌情修改
}

server {
  label = "Foreign";        # 为这组server起一个名字
  ip = 8.8.8.8              # 这里为上级DNS地址，多个地址逗号分隔，可以换行，分号结尾
     , 8.8.4.4              # Google DNS
     , 208.67.222.222       # OpenDNS
     , 208.67.220.220
     , 199.91.73.222        # V2EX DNS
     , 178.79.131.110
  ;
  timeout = 4;              # 超时值
  root_server = on;         # 设置为 `on` 后，就代替系统默认的 dns 了。
  uptest = none;            # 不去检测DNS是否无效。
}

source {
  owner = localhost;
# serve_aliases = on;
  file = "/etc/hosts";
}

rr {
  name = localhost;
  reverse = on;
  a = 127.0.0.1;
  owner = localhost;
  soa = localhost,root.localhost,42,86400,900,86400,86400;
}
```

验证正常运行

```
# 此处IP应改成路由的IP地址，一般为 `192.168.1.1`，端口为刚才改的 1053
$ dig @192.168.1.250 -p 1053 www.google.com
```

### 安装 dnsmasq

一般情况下，openwrt 已经安装 dnsmasq，若未安装请直接安装。

```
$ opkg install dnsmasq
```

### 创建需要的DNS与HOSTS配置文件

```
# 创建 dnsmasq 专用配置路径，该路径下所有文件均为有效的配置文件
$ mkdir /etc/dnsmasq.d
$ cp /etc/resolv.conf /etc/resolv.dnsmasq.conf
$ echo 'nameserver 127.0.0.1' > /etc/dnsmasq.d/resolv.dnsmasq.conf

# 创建 dnsmasq 专用HOSTS文件
$ cp /etc/hosts /etc/dnsmasq.hosts
```

### 编辑 dnsmasq 配置文件

```
$ vim /etc/dnsmasq.conf

# resolv-file=/etc/resolv.dnsmasq.conf  # 配置文件路径
conf-dir=/etc/dnsmasq.d                 # 导入所有文件作为 `resolv-file` 的配置
strict-order                            # 表示严格安装resolv-file，文件中的顺序从上到下进行DNS解析, 直到第一个成功解析
addn-hosts=/etc/dnsmasq.hosts           # 指定HOSTS，默认是系统文件/etc/hosts；
# no-hosts                              # 不调用HOSTS文件
cache-size=32768                        # 缓存文件大小
listen-address=127.0.0.1                # 本机使用，多个情况下可用逗号隔开
```

### 重启 dnsmasq 服务
```
$ /etc/init.d/dnsmasq restart
```

### 检查 dnsmasq 服务

查看 53 端口
```
$ netstat -tunlp|grep 53
tcp   0   0   0.0.0.0:53  0.0.0.0:*   LISTEN  16292/dnsmasq
netstat: /proc/net/tcp6: No such file or directory
udp   0   0   0.0.0.0:53  0.0.0.0:*           16292/dnsmasq
netstat: /proc/net/udp6: No such file or directory
```

检测 DNS 速度
```
$ dig google.com | grep "Query time"
;; Query time: 385 msec
$ dig google.com | grep "Query time"
;; Query time: 0 msec

# 此时已经缓存了
```

<!-- 防止DNS污染篇 END-->




<!-- 自动修改 HOSTS 守护进程 START-->
## 自动修改 HOSTS 守护进程

当你使用 goagent，但并不代表你就能擒墙，因为当 GAE IP 被封时，就无法连接服务器。因此随时随地获取可用HOSTS地址是恨必要的。
这章节就拿获取可用 google hosts 为例子。

<!-- 自动修改 HOSTS 守护进程 END-->


<!-- Shadowsocks START -->
## 安装 Shadowsocks 擒墙

### shadowsocks

安装

```
$ sudo apt-get install python-pip
$ pip install shadowsocks
```

运行

```
# 启动
$ sudo ssserver -p 443 -k password -m rc4-md5

# 后台运行
$ sudo ssserver -p 443 -k password -m rc4-md5 --user nobody -d start

# 停止
$ sudo ssserver -d stop
```

### OpenWrt

[依赖包](http://sourceforge.net/projects/openwrt-dist/files/shadowsocks-libev/)

安装

```
$ opkg install shadowsocks-libev-polarssl_2.2.1-1_x86.ipk
```

配置

```
$ vim /etc/shadowsocks/config.json

{
  "server": "[服务器IP]",
  "server_port": [服务器端口],
  "local_port": [本地端口],
  "password": "[密码]",
  "timeout": [超时时间 (ms)],
  "method": "[加密方式]"
}
```

运行

```
$ ss-redir -c /etc/shadowsocks/config.json
```

<!-- Shadowsocks END -->


<!-- IPv4 to IPv6 START-->
## IPv4 to IPv6

IPv4 将在不久将来淘汰掉了，IPv6 才是王道，只有部分城市与教育网拥有IPv6的地址。
我们通过 IPv6 隧道 来解决我们不拥有 IPv6 IP 的问题。

<!-- IPv4 to IPv6 END-->


<!-- OpenWrt 安装迅雷 START-->
## OpenWrt 迅雷离线下载

迅雷远程下载固件，正式更名为迅雷固件，代号为Xware

### 安装 Xware

若安装 Xware luci 可以忽略这里，直接跳到下面 "安装 Xware luci"
进入 `http://luyou.xunlei.com/` 找到自己的固件并下载

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

### 配置

由于迅雷远程在每一个已经mount并且有读写权限的磁盘都会建立类似ThunderDB的文件夹，很讨厌，可以更改设置，让它排除掉某些磁盘

这里要注意了，存储设备不能少于4G，否则 Xware 不会认你为存储设备，添加任务时会显示 "没有检测到外接存储设备"

```
$ vim cfg/thunder_mounts.cfg
invalid_mounts
{
  /dev/sdb /CacheVolume
  /dev/sdb /DataVolume
  /dev/sdb /shares
  /dev/sdb /nfs/TimeMachineBackup
  /dev/sdb /nfs/Public
  /dev/sdb /nfs/SmartWare
}
```

#### 开机启动 Xware
```
$ ln -s /etc/init.d/xunlei /etc/xunlei/portal
$ /etc/init.d/xunlei enable
```

### 安装 Xware luci

傻瓜版建议直接安装这个算了若你的空间够大，安装 `Xware luci` 就不需要特意下载上面 `Xware`，因为这里内置了

google/bing 搜索 `Xware luci`

若还能使用可以点击以下地址下载
[luci-app-xunlei_0.11-14_all.ipk](http://twin13009.sandai.net/g/forum.php?mod=viewthread&tid=1058&extra=&highlight=luci&page=11)

```
$ opkg install luci-app-xunlei_0.11-14_all.ipk
```

设置可以通过 webUI 服务 -> 迅雷远程下载

选择启用，修改挂载点，修改安装目录，选择合适的固件程序版本，保存&应用

#### 离线下载

通过 [http://yuancheng.xunlei.com/](http://yuancheng.xunlei.com/) 管理下载

<!-- OpenWrt 安装迅雷 END-->


<!-- OpenWrt 安装 aria2 START-->
## OpenWrt 安装 aria2

- Aria2支持的下载种类更多，包括磁力链接（ MagnetLink ）和一些类似PT的源源
- 界面更加先进 aria2webgui
- 感觉Aria2设置比传输更加简单（貌似不需要端口映射之类的设置）
- 最重要的是: Aria2下载速度更快

#### 安装 aria2

```
$ opkg update
$ opkg install aria2
```

#### 安装 aria2 webUI

- [webui-aria2](https://github.com/ziahamza/webui-aria2)

将它放到 `/www` 下
```
$ mv /mnt/sdb/webui-aria2-master /www/aria2
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

aria2 的速度比较慢，你也可以通过 迅雷离线 + Aria2 + YAAW 打造最快的下载方式，不过这里这里要购买迅雷会员才能完成，此处就略过了。

- [迅雷离线助手](https://github.com/ohsc/ThunderLixianAssistant)
- [ThunderLixianExporter](https://github.com/binux/ThunderLixianExporter)
- [YAAW](https://github.com/binux/yaaw)

<!-- OpenWrt 安装 aria2 END-->


<!-- 工具篇 START-->
## OpenWrt 实用工具

- dig         `opkg install bind-dig`
- svn         `opkg install subversion-client`  # 建议安装到硬盘
- python      `opkg isntall python`             # 建议安装到硬盘

<!-- 工具篇 END-->
