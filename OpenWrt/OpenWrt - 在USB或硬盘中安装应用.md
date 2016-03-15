<!-- title: OpenWrt - 在扩展硬盘或USB设备中安装应用 -->
<!-- author: <David Jones qowera@qq.com> -->
<!-- date: 2015-04-11 12:57:14 -->
<!-- category: OpenWrt -->
<!-- tag: OpenWrt,路由器,usb -->

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
