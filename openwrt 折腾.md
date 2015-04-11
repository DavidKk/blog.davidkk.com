<!-- title: [backup] openwrt 折腾篇 -->
<!-- author: <David Jones qowera@qq.com> -->
<!-- update: 2015-04-11 12:57:14 -->

# [backup] OpenWrt 折腾篇

本文说明个人 OpenWrt 折腾经历，一般都是智能路由需要完成的任务，以下分几个篇章进行记录折腾过程。

<!-- 自动挂载扩容篇 START -->

## 自动挂载硬盘/USB设备

此篇已经在 OpenWrt 安装到 virtualbox 中有说明。

### 安装支持软件
```
opkg update
opkg install block-mount  kmod-usb-storage  kmod-fs-ext4  # 安装usb支持
```

### 查看硬盘状态
```
blkid
/dev/sda1: TYPE="ext2"
/dev/sda2: UUID="90f1212b-f256-4fff-9d2b-05af7de0859e" TYPE="ext4"
/dev/sdb: UUID="f2d177f1-ab1a-477f-a99c-366c7c1a822c" TYPE="ext4"
```

### 格式化硬盘
```
opkg update
opkg install e2fsprogs    # 格式化工具

mkfs.ext4 /dev/sdb        # ext4 格式
# mkfs.ext3 /dev/sdb      # ext3 格式
# mkfs.ext2 /dev/sdb      # ext2 格式
```

### 挂载硬盘
```
mkdir -p /mnt/sdb
mount /dev/sdb /mnt/sdb
```

#### 查看挂载硬盘的信息
```
df -m
Filesystem  1M-blocks Used Available Use% Mounted on
rootfs             47   26        19  58% /
/dev/root          47   26        19  58% /
tmpfs             124    1       124   0% /tmp
tmpfs               1    0         1   0% /dev
/dev/sdb          497   23       449   5% /mnt/sdb

# /dev/sdb 就是刚才挂载的硬盘
```

### 设置开机自动挂载
```
/etc/init.d/fstab enable
```

<!-- 自动挂载扩容篇 END -->


<!-- 在USB或硬盘中安装应用篇 START -->

## 在扩展硬盘或USB设备中安装应用

### 新建安装目录

```
# 给安装路径标记一个ID/NAME
mkdir /mnt/sdb/packages/
echo dest sdb /mnt/sdb/packages/ >> /etc/opkg.conf

# 安装应用
opkg --dest sdb install python # --dest sdb 是关键
```

### 编辑环境变量

```
...
# 添加 lib 路径
export LD_LIBRARY_PATH="/mnt/sdb/usr/lib:/mnt/sdb/lib"

# 扩展 bin/sbin 路径
export PATH=/bin:/sbin:/usr/bin:/usr/sbin:/mnt/sdb/packages/usr/bin:/mnt/sdb/packages/usr/sbin
...

# 保存&退出

# 重启
reboot
```

<!-- 在USB或硬盘中安装应用篇 END -->


<!-- OpenWrt 共享文档篇 START -->

## OpenWrt 文件共享

### 安装 samba

```
opkg update
opkg install samba36-server     # 一般已经安装
opkg install luci-app-samba
```

### 创建需要共享的文档
```
mkdir /share
chmod a+w /share
chown nobody:nobody /share
```

### 修改配置模板

也可以通过 webUI 进行修改

```
vi /etc/samba/smb.conf.template
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
vi /etc/config/samba

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
/etc/init.d/samba restart
/etc/init.d/samba enable
```

### 设置密码

```
smbpasswd root
New SMB password:
Retype SMB password:
```

### 现在你可以在网上邻居找到该设备

### 新建用户

因为 openwrt 没有 useradd
我们可以安装 `shadow-groupadd`, `shadow-useradd`

```
opkg update
opkg install shadow-groupadd shadow-useradd
```

现在我们可以使用 `useradd` 命令了

```
# 创建用户
useradd davidjones

# 添加 smbp 用户
smbpasswd -a davidjones
New SMB password:
Retype SMB password:

# 然后重启一下
/etc/init.d/samba restart
```

### 其他 samba 功能，详细请看
- [samba 官方docs](https://www.samba.org/samba/docs/)

<!-- OpenWrt 共享文档篇 END -->


<!-- OpenWrt 安装 goagent 篇 START -->

## 安装 goagent

### 安装 `python`, `python-crypto`, `pyopenssl`, `python-openssl`

```
opkg update
opkg --dest extdisk install python python-crypto pyopenssl python-openssl
```
python-mini

### 安装 gevent

因为新版 goagent 需要在 gevent 中运行，应该是3.0+，否则资源消耗巨大，
但是 openwrt 没有，需要配置一个 gevent 环境。幸运的话，可以通过网上查找编译好的 gevent 文件，
例如搜索如下文件(此处为 x86 的机器)：

- gevent_1.0.1-1_x86.ipk
- python-greenlet_0.4.5-1_x86.ipk

若果没有则首先下载并安装 SDK
```
cd ~
wget http://downloads.openwrt.org/whiterussian/newest/OpenWrt-SDK-Linux-i686-1.tar.bz
bzcat OpenWrt-SDK-Linux-i686-1.tar.bz2 | tar -xvf -
cd ~/OpenWrt-SDK-Linux-i686-1
```

### 下载 goagent

- [goagent in github](https://github.com/goagent/goagent)

### 配置 goagent

最好放到共享文档中使用编辑器修改，否则会出现很多 ^M

```
vim goagent/local/proxy.ini

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

此处 warning 可以不了他

<!-- OpenWrt 安装 goagent 篇 END -->


<!-- 自动更新可用 HOST 篇 START -->

## 自动获取并更新可用 host

安装 goagent，但是 DNS 服务器上的IP 被封了，连接不了 gae 还是一样被墙，因此我们可以直接定期更新我们路由器上的 host 文件，达到 gae 可访问。


<!-- 自动更新可用 HOST 篇 END -->
