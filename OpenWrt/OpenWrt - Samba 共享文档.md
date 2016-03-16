<!-- title: OpenWrt - Samba -->
<!-- author: <David Jones qowera@qq.com> -->
<!-- date: 2015-04-11 12:57:14 -->
<!-- category: OpenWrt -->
<!-- tag: OpenWrt,路由器 -->

### 安装 samba

若安装 `luci-app-samba` 以下一系列操作都可以通过 WebUI 进行配置。

```
$ opkg update
$ opkg install samba36-server     # 一般已经安装
$ opkg install luci-app-samba     # WebUI
```

#### 配置共享文档

```
# 创建需要共享的文档
$ mkdir /share
$ chmod a+w /share
$ chown nobody:nobody /share

# 修改配置模板，一般不用修改
$ vi /etc/samba/smb.conf.template

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

# 修改配置
$ vi /etc/config/samba

config samba
        option name           'OpenWrt'
        option workgroup      'WORKGROUP'
        option description    'OpenWrt'
        option homes          '0'

config sambashare
        option name           'share'       # 网络显示的共享目录名字
        option read_only      'no'          # 只读
        option users          'share'       # share 用户需要自行创建，下面会介绍
        option create_mask    '0777'        # 读写权限
        option dir_mask       '0777'        # 读写权限
        option path           '/share'      # 共享目录，记得设置目录为可写
        option guest_ok       'no'          # 匿名用户

# 重启
$ /etc/init.d/samba restart
$ /etc/init.d/samba enable

# 设置密码
$ smbpasswd root
New SMB password:
Retype SMB password:
```

现在你可以在网上邻居找到该设备

### 新建用户

我们想在 Samba 添加一个用户，我们首先要创建一个系统用户；
又因为 OpenWrt 没有 `useradd` 我们可以安装 `shadow-groupadd`, `shadow-useradd`

```
$ opkg update
$ opkg install shadow-groupadd shadow-useradd

# 现在我们可以使用 `useradd` 命令了

# 创建用户
$ useradd share
```

若不适用这些插件进行新增用户或安装了仍然不可使用，我们可以通过以下方式来新增用户

```
$ vi /etc/passwd

# 添加一行
share:*:501:501:share:/home/share:/bin/false

# 修改密码，密码可以不添加
$ passwd share
passwd: no record of share in /etc/shadow, using /etc/passwd
Changing password for share
New password:
Bad password: too weak
Retype password:
Password for share changed by root

# 添加组
$ vi /etc/group

# 添加一行
share:x:501:

# 创建用户文件夹
$ mkdir /usr/share
$ chown -R share:share /usr/share
```

现在我们可以添加一个 SMB 用户了

```
# 添加 SMB 用户，这里的密码是共享文件访问密码而非该用户的密码
$ smbpasswd -a share
New SMB password:
Retype SMB password:

# 然后重启一下
$ /etc/init.d/samba restart
```

参考文章

- [How to create user without useradd command in OpenWrt](http://vladimir-ivanov.net/create-user-without-useradd-command-OpenWrt/)

### 其他 samba 功能，详细请看

- [samba 官方docs](https://www.samba.org/samba/docs/)
