<!-- title: [backup] 搭建 shadowsocks 服务器 -->
<!-- author: <David Jones qowera@qq.com> -->
<!-- date: 2015-05-17 18:58:20-->
<!-- category: shadowsocks -->
<!-- tag: shadowsocks -->

# 搭建 shadowsocks 服务器

## Server

OS: Ubuntu

### 安装

```
$ sudo apt-get install python-pip
$ pip install shadowsocks
```

### 运行

```
# 启动
$ sudo ssserver -p 443 -k password -m rc4-md5

# 后台运行
$ sudo ssserver -p 443 -k password -m rc4-md5 --user nobody -d start

# 停止
$ sudo ssserver -d stop
```
