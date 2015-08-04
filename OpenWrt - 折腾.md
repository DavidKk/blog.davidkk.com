<!-- title: [backup] OpenWrt 折腾篇-->
<!-- author: <David Jones qowera@qq.com>-->
<!-- date: 2015-04-11 12:57:14-->
<!-- category: OpenWrt-->
<!-- tag: OpenWrt,路由器-->

# [backup] OpenWrt 折腾篇

本文说明个人 OpenWrt 折腾经历，一般都是智能路由需要完成的任务，以下分几个篇章进行记录折腾过程。

<!-- 自动挂载扩容篇 - 硬盘/移动设备 START -->
## 自动挂载扩容篇 - 硬盘/移动设备

此篇已经在 OpenWrt 安装到 virtualbox 中有说明。

### 挂载

如果有安装 WebUI，则可以通过 `系统 -> 挂载点` 添加一个移动设备。否则可以通过以下方式挂载:

```
# 安装支持软件
$ opkg update
$ opkg install block-mount  kmod-usb-storage  kmod-fs-ext4  # 安装usb支持

# 查看硬盘状态
$ blkid
/dev/sda1: TYPE="ext2"
/dev/sda2: UUID="90f1212b-f256-4fff-9d2b-05af7de0859e" TYPE="ext4"
/dev/sdb: UUID="f2d177f1-ab1a-477f-a99c-366c7c1a822c" TYPE="ext4"

# 格式化硬盘
$ opkg update
$ opkg install e2fsprogs    # 格式化工具

$ mkfs.ext4 /dev/sdb        # ext4 格式
# mkfs.ext3 /dev/sdb        # ext3 格式
# mkfs.ext2 /dev/sdb        # ext2 格式

# 挂载硬盘
$ mkdir -p /mnt/sdb
$ mount /dev/sdb /mnt/sdb

# 查看挂载硬盘的信息
$ df -m
Filesystem  1M-blocks Used Available Use% Mounted on
rootfs             47   26        19  58% /
/dev/root          47   26        19  58% /
tmpfs             124    1       124   0% /tmp
tmpfs               1    0         1   0% /dev
/dev/sdb          497   23       449   5% /mnt/sdb

# 此处 `/dev/sdb` 就是刚才挂载的硬盘
```

### 配置 `fstab` 挂载配置

```
$ vim /etc/config/fstab

config mount
        option device '/dev/sdb'
        option target '/mnt/sdb'
        option fstype 'ext4'
        option enabled '1'

# 设置开机自动挂载
$ /etc/init.d/fstab enable
```
<!-- 自动挂载扩容篇 - 硬盘/移动设备 END -->


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



<!-- 共享文档篇 - Samba START-->
## 共享文档篇 - Samba

### 安装 samba

若安装 `luci-app-samba` 以下一系列操作都可以通过 WebUI 进行配置。

```
$ opkg update
$ opkg install samba36-server     # 一般已经安装
$ opkg install luci-app-samba     # WebUI
```

#### 配置共享文档

```
# 创建需要共享的文档
$ mkdir /share
$ chmod a+w /share
$ chown nobody:nobody /share

# 修改配置模板，一般不用修改
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

# 修改配置
$ vi /etc/config/samba

config samba
        option name           'OpenWrt'
        option workgroup      'WORKGROUP'
        option description    'OpenWrt'
        option homes          '0'

config sambashare
        option name           'share'       # 网络显示的共享目录名字
        option read_only      'no'          # 只读
        option users          'share'       # share 用户需要自行创建，下面会介绍
        option create_mask    '0777'        # 读写权限
        option dir_mask       '0777'        # 读写权限
        option path           '/share'      # 共享目录，记得设置目录为可写
        option guest_ok       'no'          # 匿名用户

# 重启
$ /etc/init.d/samba restart
$ /etc/init.d/samba enable

# 设置密码
$ smbpasswd root
New SMB password:
Retype SMB password:
```

现在你可以在网上邻居找到该设备

### 新建用户

我们想在 Samba 添加一个用户，我们首先要创建一个系统用户；
又因为 OpenWrt 没有 `useradd` 我们可以安装 `shadow-groupadd`, `shadow-useradd`

```
$ opkg update
$ opkg install shadow-groupadd shadow-useradd

# 现在我们可以使用 `useradd` 命令了

# 创建用户
$ useradd share
```

若不适用这些插件进行新增用户或安装了仍然不可使用，我们可以通过以下方式来新增用户

```
$ vi /etc/passwd

# 添加一行
share:*:501:501:share:/home/share:/bin/false

# 修改密码，密码可以不添加
$ passwd share
passwd: no record of share in /etc/shadow, using /etc/passwd
Changing password for share
New password:
Bad password: too weak
Retype password:
Password for share changed by root

# 添加组
$ vi /etc/group

# 添加一行
share:x:501:

# 创建用户文件夹
$ mkdir /usr/share
$ chown -R share:share /usr/share
```

现在我们可以添加一个 SMB 用户了

```
# 添加 SMB 用户，这里的密码是共享文件访问密码而非该用户的密码
$ smbpasswd -a share
New SMB password:
Retype SMB password:

# 然后重启一下
$ /etc/init.d/samba restart
```

参考文章
- [How to create user without useradd command in OpenWrt](http://vladimir-ivanov.net/create-user-without-useradd-command-OpenWrt/)

### 其他 samba 功能，详细请看
- [samba 官方docs](https://www.samba.org/samba/docs/)

<!-- 共享文档篇 - Samba END-->


<!-- 防止 DNS 污染篇 - pdnsd + dnsmasq START -->
# 防止 DNS 污染篇 - pdnsd + dnsmasq

使用 pdnsd 与 dnsmasq 能解决 DNS 污染与创建本地 DNS 缓存强劲加速解析速度，
一般知名 DNS 服务器提供商，百度垃圾竟然玩劫持，这里严重吐槽，一下列出几个，国内没测试过有没劫持：

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

pdnsd 是一款高效灵活的 DNS proxy 服务器，它既可以充当一个 DNS forwarding 的角色，也可作为一个 DNS cache 服务器，更可以作为一款简单的本地解释 DNS 服务器。

建议将此服务不要安装到 USB 或其他硬盘上，否则配置起来很麻烦。

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
  server_port = 1153;       # 使用 1153 作为 DNS 端口，默认是53，因为 53 端口已经被 dnsmasq占用了
  server_ip = 0.0.0.0;      # 监听所有
  status_ctl = on;          # 方便在 pdnsd 运行时通过 pdnsd-ctl 进行管理
  query_method = tcp_only;  # 最重要的配置，只使用 TCP 查询上级 DNS, `tcp_only`, `udp_only`, `tcp_udp`
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
  uptest = none;            # 不去检测 DNS 是否无效。
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

# 重启
$ /etc/init.d/pdnsd start
$ /etc/init.d/pdnsd enable

# 验证正常运行，这里可以在 PC 或路由中运行，但路由中 `dig` 不存在，需要安装插件
# 此处IP应改成路由的IP地址，一般为 `192.168.1.1`，端口为刚才改的 1153
$ dig @192.168.1.1 -p 1153 www.google.com

; <<>> DiG 9.8.3-P1 <<>> @192.168.1.1 -p 1153 www.google.com
; (1 server found)
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 60638
;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 0

;; QUESTION SECTION:
;www.google.com.      IN  A

;; ANSWER SECTION:
www.google.com.   900 IN  A 216.58.221.68

;; Query time: 1757 msec
;; SERVER: 192.168.1.1#1153(192.168.1.1)
;; WHEN: Sun Jul  5 11:15:54 2015
;; MSG SIZE  rcvd: 48
```

### 安装 dnsmasq

一般情况下，OpenWrt 已经安装 dnsmasq, 若未安装请直接安装。

```
$ opkg update
$ opkg install dnsmasq
```

### 创建需要的 DNS 与 HOSTS 配置文件

```
# 创建 dnsmasq 专用配置路径，该路径下所有文件均为有效的配置文件
$ mkdir /var/dnsmasq.d
$ vi /var/dnsmasq.d/google.conf

# Google
server=/.google.com/127.0.0.1#1153
server=/.gstatic.com/127.0.0.1#1153
server=/.googleusercontent.com/127.0.0.1#1153
server=/.googlevideo.com/127.0.0.1#1153
server=/.appspot.com/127.0.0.1#1153
server=/.googlecode.com/127.0.0.1#1153
server=/.googleapis.com/127.0.0.1#1153
server=/.gmail.com/127.0.0.1#1153
server=/.google-analytics.com/127.0.0.1#1153
server=/.youtube.com/127.0.0.1#1153
server=/.blogspot.com/127.0.0.1#1153
server=/.blogger.com/127.0.0.1#1153

# 创建 dnsmasq 专用 HOSTS 文件
$ mkdir /var/dnsmasq.hosts
$ ln -s /etc/hosts /var/dnsmasq.hosts/origin.hosts

# 编辑 dnsmasq 配置文件
$ vim /etc/dnsmasq.conf

conf-dir=/var/dnsmasq.d                 # 导入所有文件作为 `resolv-file` 的配置
expand-hosts                            # 改为指定 HOSTS 目录
addn-hosts=/var/dnsmasq.hosts           # 指定 HOSTS，默认是系统文件 /etc/hosts

# 重启 dnsmasq 服务
$ /etc/init.d/dnsmasq restart
```

### 检查 dnsmasq 服务

```
# 查看 53 端口，若出现 `:53` 即表示启动成功，否则查看以下系统 log 看看那里出错了
$ netstat -tunlp|grep 53

tcp   0   0   0.0.0.0:53  0.0.0.0:*   LISTEN      6406/dnsmasq
tcp   0   0   :::53       :::*        LISTEN      6406/dnsmasq
udp   0   0   0.0.0.0:53  0.0.0.0:*               6406/dnsmasq
udp   0   0   :::53       :::*                    6406/dnsmasq

# 检测 DNS 速度 (PC 或 路由器均可检测)
$ dig @192.168.1.1 -p 1153 google.com | grep "Query time"
;; Query time: 385 msec
$ dig @192.168.1.1 -p 1153 google.com | grep "Query time"
;; Query time: 0 msec

# 此时已经缓存了
```

<!-- 防止 DNS 污染篇 - pdnsd + dnsmasq START -->


<!-- 擒墙篇 - Shadowsocks + ChinaDNS + redsocks START -->
## 擒墙篇 - Shadowsocks + ChinaDNS + redsocks

### ChinaDNS

防止 DNS 污染服务器已经好了，下面我们让 China DNS

#### 安装

```
$ opkg update
$ opkg install ChinaDNS
$ opkg install luci-app-chinadns # WebUI
```

#### 配置

安装了 `luci-app-chinadns` 可以直接进入 WebUI 里面进行配置

```
$ vi /etc/config/chinadns

config chinadns 'config'
        option dns '114.114.114.114,127.0.0.1:1153'
        option port '1053'
        option enabled '1'
        option apnt_en '1'

# 127.0.0.1:1153 这里是刚才上面 pdnsd 的端口，这样就能通过他解决 DNS 污染问题了

# 启动
$ /etc/init.d/chinadns start
$ /etc/init.d/chinadns enable
```

#### DHCP 配置

现在要使 DNS 解析通过 ChinaDNS，我们需要修改以下 DHCP 服务器，同样若安装 WebUI，可以通过 `网络 -> DHCP/DNS` 进行配置

- `基本设置`里面将 `DNS 转发` 改成 `127.0.0.1#1053` ，这里的 1053 是 ChinaDNS 监听的端口。
- `HOSTS和解析文件`里面将 `忽略解析文件` 打上√

```
$ vi /etc/config/dhcp

config dnsmasq
        option domainneeded '1'
        option boguspriv '1'
        option localise_queries '1'
        option rebind_protection '1'
        option rebind_localhost '1'
        option local '/lan/'
        option domain 'lan'
        option expandhosts '1'
        option authoritative '1'
        option readethers '1'
        option leasefile '/tmp/dhcp.leases'
        option noresolv '1'                 # 忽略解析文件
        list server '127.0.0.1#1053'        # DNS 转发

# 重启
$ /etc/init.d/dnsmasq restart
```

### Shadowsocks

#### Shadowsocks Server in VPS

```
# 安装
$ sudo apt-get install python-pip
$ pip install shadowsocks

# 启动
$ sudo ssserver -p 443 -k password -m rc4-md5

# 后台运行
$ sudo ssserver -p 443 -k password -m rc4-md5 --user nobody -d start

# 停止
$ sudo ssserver -d stop
```

#### Shadowsocks Client in OpenWrt

[依赖包](http://sourceforge.net/projects/OpenWrt-dist/files/shadowsocks-libev/)

##### 安装

```
$ opkg install shadowsocks-libev-spec
$ opkg install luci-app-shadowsocks     # WebUI
```

##### 配置

```
$ vi /etc/config/shadowsocks

config shadowsocks 'config'
        option whitelist_enabled '0'
        option blacklist_enabled '0'
        option redir_enabled '0'
        option remote_server 'x.x.x.x'    # 服务器IP
        option remote_port '443'          # 服务器端口
        option password 'xxx'             # 密码
        option cipher 'rc4-md5'           # 加密方式
        option local_port '11180'         # 本地端口
        option enabled '1'

# 运行
$ /etc/init.d/shadowsocks start
$ /etc/init.d/shadowsocks enable
```

### redsocks2

#### 安装

```
$ opkg update
$ opkg install redsocks2
$ opkg install luci-app-redsocks2   # WebUI
```

#### 配置

可以用过 WebUI 进行配置

```
$ vi /etc/config/redsocks2

config redsocks2_base
  option loglevel 'info'
  option enabled '1'

config redsocks2_redirect
  option local_ip '0.0.0.0'             # 本地IP，监听所有
  option local_port '11111'             # 本地端口
  option autoproxy '1'                  # 启用自动代理
  option timeout '4'                    # 自动代理超时
  option ip '127.0.0.1'                 # 本地IP
  option port '11180'                   # 这个端口为刚才 Shadowsocks 监听本地端口
  option proxy_type 'socks5'            # 选择一下 `代理服务器类型`: socks5

config redsocks2_autoproxy
  option no_quick_check_seconds '300'
  option quick_connect_timeout '2'

config redsocks2_ipcache
  option cache_size '4'
  option cache_file '/tmp/redsocks2_ipcache.txt'
  option stale_time '7200'
  option autosave_interval '3600'
  option port_check '0'

config redsocks2_iptables               # iptables重定向设置
  option blacklist_enabled '0'          # 启用排除IP
  option whitelist_enabled '1'          # 启用白名单
  option ipset_whitelist '/etc/chinadns_chnroute.txt' # 白名单路径，这个为 ChinaDNS
  option dest_port '11111'              # 目标端口，指向上面的本地端口

$ /etc/init.d/redsocks2 start
$ /etc/init.d/redsocks2 enable
```

都好了，现在尝试下载百度输入IP，看下有木有经过代理，若没通过本地，则再请求一下 `facebook.com`，看看能不能打开，
若能则OK了。这里保证 HOSTS 表不能指定相应能访问的 IP 地址，或直接拿台手机进行访问。

<!-- 擒墙篇 - Shadowsocks + ChinaDNS + redsocks END -->


<!-- 屌丝擒墙篇 - Goagent in OpenWrt START-->
## 屌丝擒墙篇 - Goagent in OpenWrt

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

<!-- 屌丝擒墙篇 - Goagent in OpenWrt END -->


<!-- 离线下载之迅雷篇 - Xware START -->
## 离线下载之迅雷篇 - Xware

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
<!-- 离线下载之迅雷篇 - Xware END -->


<!-- 离线下载之 Aria2 START -->
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

<!-- 离线下载之 Aria2 END -->


<!-- 离线下载之百度网盘 - Syncy START -->
## 离线下载之百度网盘 - Syncy

[官方网站](http://www.syncy.cn/index.php/tag/openwrt/)

### 安装方法十分简单

```
$ opkg install SyncY-Python-luci_2.5.2-1_all.ipk
```

然后根据 WebUI 进行编辑配置就可以完成

<!-- 离线下载之百度网盘 - Syncy END -->


<!-- IPv4 to IPv6 START -->
## IPv4 to IPv6

IPv4 将在不久将来淘汰掉了，IPv6 才是王道，只有部分城市与教育网拥有IPv6的地址。
我们通过 IPv6 隧道 来解决我们不拥有 IPv6 IP 的问题。

### 配置

首先允许来自外部的 ping 测试。

```
iptables -A INPUT -p icmp --icmp-type echo-request -j ACCEPT
iptables -A OUTPUT -p icmp --icmp-type echo-reply -j ACCEPT

iptables -D INPUT -p icmp --icmp-type echo-request -j ACCEPT
iptables -D OUTPUT -p icmp --icmp-type echo-reply -j ACCEPT



iptables -nL INPUT | awk '{print NR-2 " " $0}' |sed -ne '/icmp/{/DROP/p}'

# 66.220.2.74 为 tunnelbroker.net 中描述的服务器 IP，若配置这个可能会出现以下这个报错：
# IP is not ICMP pingable. Please make sure ICMP is not blocked. If you are blocking ICMP, please allow 66.220.2.74 through your firewall.

# 删除规则
# iptables -D INPUT -p icmp --icmp-type echo-request -j ACCEPT
# iptables -D OUTPUT -p icmp --icmp-type echo-reply -j ACCEPT
```

现在我们可以进行 [https://tunnelbroker.net](https://tunnelbroker.net) 注册个账号并 `Create Regular Tunnel`。



<!-- IPv4 to IPv6 END -->


<!-- 疑难杂症篇 START -->

## 疑难杂症篇

进入 LUCI 的时候出现以下错误

```
bad argument #1 to 'pairs' (table expected, got nil)
stack traceback:
  [C]: in function 'pairs'
  ?: in function 'createtree'
  ?: in function 'dispatch'
  ?: in function <\?:194>

$ rm -r /tmp/luci-indexcache
```

<!-- 疑难杂症篇 END -->


<!-- 工具篇 START -->
## 工具篇

- dig         `opkg install bind-dig`
- svn         `opkg install subversion-client`  # 建议安装到硬盘
- python      `opkg isntall python`             # 建议安装到硬盘

<!-- 工具篇 END -->
