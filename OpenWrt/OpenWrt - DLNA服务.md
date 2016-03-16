<!-- title: OpenWrt - DLNA 服务 -->
<!-- author: <David Jones qowera@qq.com> -->
<!-- date: 2016-03-01 23:48:05 -->
<!-- category: OpenWrt -->
<!-- tag: OpenWrt,路由器,DLNA -->

超级简单，可以直接利用 `minidlna` 就可以实现


### 安装 minidlna

```
$ opkg update
$ opkg install minidlna
$ opkg install luci-app-minidlna            # 可选
$ opkg install luci-i18n-minidlna-zh-cn     # 可选
```

### 配置

可以进入服务 -> miniDLNA 选项进行配置


```
$ vi /etc/config/minidlna

config minidlna 'config'
  option enabled '1'                          # 是否开启
  option port '8200'                          # 端口
  option interface 'br-lan'
  option friendly_name 'OpenWrt DLNA Server'  # 服务名称
  option db_dir '/var/run/minidlna'
  option log_dir '/var/log'
  option inotify '1'
  option notify_interval '900'
  option serial '12345678'
  option model_number '1'
  option root_container '.'
  list media_dir '/mnt'                       # 媒体目录，建议挂载一个硬盘
  option album_art_names 'Cover.jpg/cover.jpg/AlbumArtSmall.jpg/albumartsmall.jpg/AlbumArt.jpg/albumart.

若想分开存储则可以这样：
  list media_dir 'A,/mnt/sda1/music'
  list media_dir 'P,/mnt/sda1/picture'
  list media_dir 'V,/mnt/sda1/video'

# 设置自启动
$ /etc/init.d/minidlna enable
$ /etc/init.d/minidlna start
```

完成可以查看 `http://192.168.1.1:8200/` 来查看DLNA服务运行状况

参考文章

- [https://wiki.openwrt.org/doc/uci/minidlna](https://wiki.openwrt.org/doc/uci/minidlna)