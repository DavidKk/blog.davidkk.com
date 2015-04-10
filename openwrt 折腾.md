# [backup] OpenWrt 折腾篇

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

# 然后重启一下
/etc/init.d/samba restart
```

### 新建用户

因为 openwrt 没有 useradd
我们可以安装 `shadow-groupadd`, `shadow-useradd`

```
opkg update
opkg install shadow-groupadd shadow-useradd
```

现在我们可以使用 useradd

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

### 现在你可以在网上邻居找到该设备

### 其他 samba 功能，详细请看
- [samba 官方docs](https://www.samba.org/samba/docs/)



## 安装 goagent

### 安装 python，pyopenssl，python-openssl

```
opkg update
opkg install python pyopenssl python-openssl
```