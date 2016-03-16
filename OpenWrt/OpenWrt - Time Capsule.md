<!-- title: OpenWrt - Time Capsule -->
<!-- author: <David Jones qowera@qq.com> -->
<!-- date: 2016-02-28 15:58:37 -->
<!-- category: openwrt -->
<!-- tag: openwrt,路由器,Time Capsule,Netatalk,Avahi -->

创建伪 Time Capsule 服务器，能给 Mac OSX Time Machine 做备份使用。

## 前期工程

先为搭建 Time Capsule 营造基础设施。

### 首先创建服务用户及用户组 `timemachine:davidjones`

```
opkg update
opkg install shadow-useradd shadow-groupadd
groupadd timemachine
useradd -M -G timemachine davidjones    # 连接需要用到的用户名建议跟你的 Mac 用户一样
passwd 123                              # 连接需要用到
```

### 创建备份的文件夹

```
$ mkdir /mnt/TimeMachine
$ chown -R davidjones:timemachine /mnt/TimeMachine
```

TimeMachine 文件夹最好为加载的外置存储设备的文件夹，否则可能不够存储空间。详细可以参考 OpenWrt 扩容硬盘及移动设备篇。

### 简单扩容演示

```
$ mount /dev/sdb /mnt/TimeMachine

# 设置自动挂载
$ vi /etc/config/fstab

config mount
  option target   /mnt/TimeMachine
  option device   /dev/sdb            # /dev/sdb 为要挂在的设备
  option fstype   hfsplus
  option options  force,rw,sync
  option enabled  1
  option enabled_fsck 0

$ /etc/init.d/fstab start
$ chown -R davidjones:timemachine /mnt/TimeMachine
```

### 安装 Netatalk

Netatalk 是一个免费开源的 AppleTalk 通信协议的实现，Linux 或者 BSD 系统通过它可以充当 Mac 的文件服务器 (AppleShare File Server, 网络协议是 AFP)、AppleTalk 路由、打印服务器等。

```
$ opkg install netatalk
$ vi /etc/netatalk/afpd.conf

"TimeMachine" -uampath /usr/lib/uams -uamlist uams_dhx2.so -nodebug -nouservol -icon -nosavepassword -mimicmodel RackMac

$ vi /etc/netatalk/AppleVolumes.default

/mnt/TimeMachine TimeMachine volsizelimit:150000 allow:@timemachine rwlist:@timemachine cnidscheme:dbd options:searchdb,usedots,invisibledots,tm

$ /etc/init.d/afpd stop
$ /etc/init.d/afpd start
$ /etc/init.d/afpd enable
```

### 安装 Avahi

Avahi 是 Zeroconf 协议实现，包含了一整套多播DNS(multicastDNS)/DNS-SD网络服务的实现。它使用的发布授权是LGPL。Avahi 允许程序在不需要进行手动网络配置的情况 下，在一个本地网络中发布和获知各种服务和主机。

```
$ opkg install avahi-daemon

$ vi /etc/avahi/avahi-daemon.conf

host-name=TimeMachine
enable-dbus=no
allow-interfaces=br-lan

vi /etc/avahi/services/afpd.service

<?xml version="1.0" standalone="no"?>
<!DOCTYPE service-group SYSTEM "avahi-service.dtd">
<service-group>
<name replace-wildcards="yes">Time Capsule</name>
  <service>
    <type>_afpovertcp._tcp</type>
    <port>548</port>
  </service>
  <service>
    <type>_device-info._tcp</type>
    <port>0</port>
    <txt-record>model=TimeCapsule</txt-record>
  </service>
  <service>
    <type>_adisk._tcp</type>
    <port>9</port>
    <txt-record>sys=waMA=XX:XX:XX:XX:XX:XX,adVF=0x100</txt-record>
    <txt-record>dk1=adVF=0x83,adVN=TimeMachine</txt-record>
  </service>
</service-group>

# XX:XX:XX:XX:XX:XX 为本设备的 mac 地址

$ /etc/init.d/avahi-daemon stop
$ /etc/init.d/avahi-daemon start
$ /etc/init.d/avahi-daemon enable
```

### 通过 OpenWrt 恢复

如果你的 Mac Down 了，或者需要通过 TimeMachine 重装，则可以通过修改启动项进入重装界面，与DVD硬盘恢复相同操作，不懂可以上网查找相关资料。
通过打开终端输入以下命令：

```
# 在 Mac 下
mkdir /Volumes/TimeMachine
mount -t afp "afp://192.168.1.1/TimeMachine" /Volumes/TimeMachine

# 192.168.1.1 是 OpenWrt IP
```

参考文章

- [https://wiki.openwrt.org/doc/howto/timemachine](https://wiki.openwrt.org/doc/howto/timemachine)