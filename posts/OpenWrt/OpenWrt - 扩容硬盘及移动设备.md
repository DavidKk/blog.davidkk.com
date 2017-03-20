<!-- title: OpenWrt - 扩容硬盘及移动设备 -->
<!-- author: <David Jones qowera@qq.com> -->
<!-- date: 2015-04-11 12:57:14 -->
<!-- category: OpenWrt -->
<!-- tag: OpenWrt,路由器 -->

此篇已经在 OpenWrt 安装到 virtualbox 中有说明。

### 挂载

如果有安装 WebUI，则可以通过 `系统 -> 挂载点` 添加一个移动设备。否则可以通过以下方式挂载:

```
# 安装支持软件
$ opkg update
$ opkg install block-mount kmod-usb-storage kmod-fs-ext4  # 安装usb支持

# 查看硬盘状态
$ blkid
/dev/sda1: TYPE="ext2"
/dev/sda2: UUID="90f1212b-f256-4fff-9d2b-05af7de0859e" TYPE="ext4"
/dev/sdb: UUID="f2d177f1-ab1a-477f-a99c-366c7c1a822c" TYPE="ext4"

# 若没有 blkid 命令
$ opkg update
$ opkg install blkid

# 若 blkid 查找不到该硬盘，可能还没格式化
$ opkg install fdisk
$ fdisk -l

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