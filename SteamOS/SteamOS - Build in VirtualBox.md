<!-- title: SteamOS - 在 Virtualbox 安装 SteamOS -->
<!-- author: <David Jones qowera@qq.com> -->
<!-- date: 2016-03-10 00:31:23 -->
<!-- category: SteamOS -->
<!-- tag: SteamOS,virtualbox -->

首先要准备的当然是安装包，可以到官网下载[SteamOS](http://store.steampowered.com/steamos/buildyourown)


## 创建 ISO

### Linux 用户可以使用 xorriso

```
$ sudo apt-get install xorriso
$ cd /vgrant/SteamOSInstaller
$ xorriso -as mkisofs -r -checksum_algorithm_iso md5,sha1 -V 'Steam OS' \
$ -o /vgrant/SteamOSInstaller.iso -J -joliet-long -cache-inodes -no-emul-boot \
$ -boot-load-size 4 -boot-info-table -eltorito-alt-boot --efi-boot boot/grub/efi.img \
$ -append_partition 2 0x01 /vgrant/SteamOSInstaller/boot/grub/efi.img \
$ -partition_offset 16 /vgrant/SteamOSInstaller
```


### windows 用户

[Free-ISO-Creator](http://www.softsea.com/download/Free-ISO-Creator.html)
也可以是其他 iso创建 软件，操作自己摸索，傻瓜式生成不截图了


## 打开 virtualbox

- 创建并选择读取ISO
- 选择 Linux 中的 Debian (64bit)
- 选择系统
- 内存分配大小设置成 1G以上
- 开启 扩展特性 中的 启用EFI(只针对某些操作系统)
- 选择显示
- 开启 扩展特性 中的 启动3D加速

## 启动并安装

直接选择第一个 `Automated Install`

## 安装增强

安装完后会有两个选择，不要直接进入系统，选择带 `recovery mode` 的选项，之前可能会遇到不同的选项。不懂建议查下词典

进入命令行后

删除这些包

```
$ apt-get purge ".*nvidia.*"
```

重新配置

```
$ dpkg-reconfigure xserver-xorg
```

使用 virtualbox 菜单栏中的 `Device` 下的 `Insert Guest Additions CD Image...` 选项

挂载 CD-ROM

```
$ mount /dev/cdrom /media/cdrom
```

安装

```
$ sh /media/cdrom/VBoxLinuxAdditions.run
```

重启

```
$ reboot
```

重启后可以选择正常进入系统并进行更新


## 启动 Steam 应用

完成

参考文献
- [http://news.softpedia.com/news/How-to-Install-SteamOS-in-VirtualBox-409363.shtml](http://news.softpedia.com/news/How-to-Install-SteamOS-in-VirtualBox-409363.shtml)
- [https://steamcommunity.com/groups/steamuniverse/discussions/1/648814395813782335/](https://steamcommunity.com/groups/steamuniverse/discussions/1/648814395813782335/)
- [https://steamcommunity.com/sharedfiles/filedetails/?l=spanish&id=204085700](https://steamcommunity.com/sharedfiles/filedetails/?l=spanish&id=204085700)