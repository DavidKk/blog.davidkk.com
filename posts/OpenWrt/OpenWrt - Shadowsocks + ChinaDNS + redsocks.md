<!-- title: OpenWrt - Shadowsocks + ChinaDNS + redsocks -->
<!-- author: <David Jones qowera@qq.com> -->
<!-- date: 2015-04-11 12:57:14 -->
<!-- category: OpenWrt -->
<!-- tag: OpenWrt,路由器,Shadowsocks,ChinaDNS,redsocks -->

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
