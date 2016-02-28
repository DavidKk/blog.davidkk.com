<!-- title: OpenWrt - pdnsd + dnsmasq -->
<!-- author: <David Jones qowera@qq.com> -->
<!-- date: 2015-04-11 12:57:14 -->
<!-- category: OpenWrt -->
<!-- tag: OpenWrt,路由器,dns,pdnsd,dnsmasq -->

# OpenWrt - pdnsd + dnsmasq

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
