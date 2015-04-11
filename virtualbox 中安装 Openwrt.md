<!-- title: [backup]在 virtualbox 中安装 OpenWrt -->
<!-- author: <David Jones qowera@qq.com> -->
<!-- update: 2015-04-11 12:57:14 -->

# [backup]在 virtualbox 中安装 OpenWrt

本人是新手，所以在 virtualbox 折腾一下，否则砖头够建房了。

## 下载
- [virtualbox](https://www.virtualbox.org/)
- [openwrt x86 镜像](https://downloads.openwrt.org/)

建议直接下载 vdi 虚拟硬盘文件
否则可以通过 virtualbox 命令行方式转换成VM的虚拟磁盘文件
```
VBoxManage convertfromraw –format VMDK openwrt-x86.img openwrt-x86.vmdk
```

## 安装

- 解压虚拟硬盘文件
- 启动 virtualbox
- 创建一个 linux 2.6(32)
- 虚拟硬盘选择 使用已有的虚拟硬盘文件
- 并选择当前虚拟硬盘文件
- 设置 -》 网络
- 选择网卡1，设置成桥接网卡
- 开启网卡2，设置成桥接网卡 (必须开启两张网卡)
- 启动

## 重置密码
进入系统第一件事就是设置 root 密码

```
root@Openwrt:/# passwd
Changing password for root
New password:
Retype password:
Password for root changed by root
```

## 配置网络
虽然已经启动系统了，但是现在系统还不能连接网络

默认情况下，OpenWrt的分配它的第一个NIC是192.168.1.1/24的静态IP地址。
如果该IP地址和当前LAN不在同一子网，或者该IP地址已经被其他设备占中。
下面的命令配置第一个NIC设置成动态获取IP地址(DHCP)

```
uci delete network.lan.ipaddr
uri delete network.lan.netmask
uri delete network.lan.ip6assign
uri set network.lan.proto=dhcp
uri commit
ifdown lan
ifup lan
```

此外，由于我们已经配置了第二个网卡，因此可以配置第二网卡为WAN。
```
uci set network.wan=interface
uci set network.wan.ifname=eth1
uri set network.wan.proto=dhcp
uci commit
ifup wan
```

也可以直接进入配置文件
```
# 编辑配置
vim /etc/config/network

config  interface looppack
        option ifname   lo
        option proto    static
        option ipaddr   127.0.0.1
        option netmsak  255.0.0.0

config  interface lan
        option ifname   eth0
        option type     bridge
        option proto    dhcp

config  interface wan
        option ifname   eth1
        option proto    dhcp

# 修改完重启一下
/etc/init.d/network restart
```

## 安装webUI
```
opkg install luci-ssl
```

## 只允许 https 访问
最后你还可以设置一下，该操作非必然

打开配置文件
```
vim /etc/config/uhttpd
```

注释HTTP监听
```
# list listen_http 0.0.0.0:80
# list listen_http [::]:80

list listen_https 0.0.0.0:443
list listen_https [::]:80
```
保存并推出

## 重启
```
/etc/init.d/uhttpd reload
```

## 连接

最后你可以通过 webUI进入路由控制界面
```
https://192.168.1.109
#进入页面会出现证书不信任，你只要强制进入就可以了。
```

你也可以通过 iTeam2 或 ssh 工具进入链接到路由器
```
$ ssh root@192.168.1.109
The authenticity of host '192.168.1.109 (192.168.1.109)' can't be established.
RSA key fingerprint is ...
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added '192.168.1.109' (RSA) to the list of known hosts.
root@192.168.1.109's password:
# 开始时设置的密码
```

## 使用 virtualbox 挂载虚拟硬盘

- 设置
- 存储
- 选择 SATA
- 添加虚拟硬盘
- 创建新的虚拟硬盘

### 启动虚拟机

因为硬盘还没有格式化所以系统识别不了硬盘，因此我们将其格式化一下

```
# 查看一下硬盘状态
blkid
/dev/sda1: TYPE="ext2"
/dev/sda2: UUID="90f1212b-f256-4fff-9d2b-05af7de0859e" TYPE="ext4"
/dev/sdb: UUID="f2d177f1-ab1a-477f-a99c-366c7c1a822c" TYPE="ext4"

# 下载格式化工具
opkg update
opkg install e2fsprogs

# 格式化硬盘
mkfs.ext4 /dev/sdb        # ext4 格式
# mkfs.ext3 /dev/sdb      # ext3 格式
# mkfs.ext2 /dev/sdb      # ext2 格式


# 挂载硬盘
mkdir -p /mnt/sdb
mount /dev/sdb /mnt/sdb

# 编辑 fstab
vim /etc/config/fstab 

# 添加以下
config mount
        option device '/dev/sdb'
        option target '/mnt/sdb'
        option fstype 'ext4'
        option enabled '1'

# 查看挂载硬盘的信息
df -m
Filesystem           1M-blocks      Used Available Use% Mounted on
rootfs                      47        26        19  58% /
/dev/root                   47        26        19  58% /
tmpfs                      124         1       124   0% /tmp
tmpfs                        1         0         1   0% /dev
/dev/sdb                   497        23       449   5% /mnt/sdb

# /dev/sdb 就是刚才挂载的硬盘

# 设置开启机动
/etc/init.d/fstab enable
```

## 最后
现在你可以开始折腾了，有需要的请跳转到折腾篇。

## 其他

### 安装主题
```
#安装中文
opkg install luci-i18n-chinese

#安装主题
opkg install luci-theme-bootstrap
```

然后到 webUI 上设置，依次选择系统 -》语言/主题 (System -> Lanuage and Style)

### 安装其他
可以通过查找各种插件
```
opkg serach "*bootstrap"
```