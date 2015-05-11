<!-- title: [backup]Vagrant && VirtualBox 安装，打包和分享 Base Box-->
<!-- author: <David Jones qowera@qq.com>-->
<!-- date: 2015-04-11 12:57:14-->
<!-- category: vagrant,virtualbox-->
<!-- tag: vagrant,virtualbox,打包box-->

# [backup]Vagrant && VirtualBox 安装，打包和分享 Base Box

## 首先要准备的软件
- [Vagrant](http://www.vagrantup.com) <br>
- [VirtualBox](https://www.virtualbox.org/) <br>
- [VirtualBox Extension Pack](http://download.virtualbox.org/virtualbox/) (一般已经存在，主要用到文档共享，其他功能纯手工复制)
  - 实现客户机和主机间的鼠标平滑移动
  - 与主机实现文件共享
  - 安装虚拟显卡驱动，实现2D和3D视频图形加速，自动调整客户机分辨率
  - 支持无缝模式
  - 通用主机/客户机通信通道（别扭），用于主机与客户机交换数据、监控客户机，也可以启动客户机中的程序
  - 与主机实现时间同步
  - 与主机共享剪贴板的内容，也就是说直接可以在主机、客户机之间复制、粘贴（不支持文件）
  - 自动登录客户机系统 

最后会贴上部分常见错误。

本人当前各软件版本：
- OSX Yosemite 10.10.2
- Vagrant 1.7.2
- Virtualbox 4.3.20 r96996
- ubuntu 14.10

## 以 ubuntu 为例


### 安装ubuntu
[Ubuntu 下载地址](http://www.ubuntu.com/download)
安装过程略，自行安装需要的工具，注意因为 box 是分享给别人使用的，所以尽量安装基础的软件就可以了无聊的东西最好不要安装。

### 更新一下

```
$ sudo apt-get update -y
$ sudo apt-get upgrade -y

# 完成后重启一下
$ sudo reboot
```

### 添加VM用户
- 若安装 ubuntu 时已经设置了这用户，可跳过这一步。
- 由于 vagrant 默认是以 vagrant 来作SSH账号密码，因此最好在 ubuntu 中新增一个名为vagrant 的用户。
- 当然也可以通过后面 vagranfile 配置文件设置相应的

```
$ config.ssh.username = "customer_name"
```

具体参考[这里](http://docs.vagrantup.com/v2/vagrantfile/ssh_settings.html)

#### 添加名为 vagrant 用户
相同地账号与密码最好都设置成 vagrant。

```
$ adduser vagrant

Adding user `vagrant' ...
Adding new group `vagrant' (1001) ...
Adding new user `vagrant' (1001) with group `vagrant' ...
Creating home directory `/home/vagrant' ...
Copying files from `/etc/skel' ...
Enter new UNIX password:
Retype new UNIX password:
passwd: password updated successfully
Changing the user information for vagrant
Enter the new value, or press ENTER for the default
        Full Name []: customer_name
        Room Number []:
        Work Phone []:
        Home Phone []:
        Other []:
Is the information correct? [Y/n]
```

添加用户后，编辑 /etc/group 将vagrant 添加到群组中 

```
$ sudo vim /etc/group

adm:x:4:vagrant
sudo:x:27:vagrant
```

## Virtualbox Guest Additions

之前已经安装了virtualbox增强包，但需要用到 compile kernel 模块，而ubuntu server 一般没有将 compile kernel 所要的控件加入，因此下载一下呗。

```
$ sudo apt-get install dkms
$ sudo apt-get install build-essential
# 安装 linux-headers (kernel 头部文件，一般都有安装)
$ sudo apt-get install linux-headers-$(uname -r) 
```

一般情况下按运行一下以下命令可以直接安装
```
$ sudo /etc/init.d/vboxadd setup # 可执行安装操作
```

若没有挂载，挂载CD-ROM，选择菜单，Devices -> Insert Guest Additions CD image...

```
$ sudo mount /dev/cdrom /mnt/           # 挂载
$ sudo /mnt/VBoxLinuxAdditions-x86.run  # 安装
$ sudo umount /mnt/                     # 卸载CD-ROM
```


## 设置共享
上一步已经安装好增强扩展了，下面就要实现虚拟机与本机目录共享。
先关掉VM
```
$ sudo shutdown -h now
```

#### 简单的配置方式

通过 virtualbox 邮件 vm 选择设置，选择共享文档共享文档列表，设置一个固定分配，默认已经拥有一个 双击编辑，共享文件夹路径与共享文件夹名称，名称设置为 `vagrant`；然后启动VM

```
$ sudo mkdir /vagrant
$ sudo mount -t vboxsf vagrant /vagrant # vagrant 为共享文件夹名称
```

#### 写成配置文件并且解决共享目录读写权限

本机上设置
```
$ sudo chmod o+w /vagrant   # /vagrant 为共享目录
$ sudo chown <user>:<group> # 设置文件所属，非 root
```

设置 Vagrantfile 配置文件

```
# config.wm.synced_folder "host_sync_path", "/vm_path"
$ config.vm.synced_folder "vagrant", "/vagrant", :nfs => true
```

其中 NFS 是解决共享目录读写权限最好得方式


## SSH access
### 安装 openssh
若ubuntu 没有安装 ssh server 则需要安装。

```
$ sudo apt-get install -y openssh-server
```

修改 /etc/ssh/sshd-config
```
$ vim /etc/ssh/sshd-config
```

```
# 开启
Port 22
PubKeyAuthentication yes # 是否允许 Public Key
AuthorizedKeysFile %h/.ssh/authorized_keys
PermitEmptyPasswords no # 这个项目在是否允许以空的密码登入！
# 保存并退出
```

开启/重启一下ssh server

```
$ sudo /etc/init.d/ssh start
# or
$ sudo /etc/init.d/ssh restart
```

### 设置公钥
vagrant 用的 insecure public key(不安全公钥)。

```
$ mkdir -p /home/vagrant/.ssh
$ wget --no-check-certificate https://raw.github.com/mitchellh/vagrant/master/keys/vagrant.pub -O /home/vagrant/.ssh/authorized_keys
# Ensure we have the correct permissions set
$ chmod 0700 /home/vagrant/.ssh 
$ chmod 0600 /home/vagrant/.ssh/authorized_keys
$ chown -R vagrant /home/vagrant/.ssh
```

github 一般被会被墙，若被墙请翻墙或直接复制以下 ssh key

```
$ ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEA6NF8iallvQVp22WDkTkyrtvp9eWW6A8YVr+kz4TjGYe7gHzIw+niNltGEFHzD8+v1I2YJ6oXevct1YeS0o9HZyN1Q9qgCgzUFtdOKLv6IedplqoPkcmF0aYet2PkEDo3MlTBckFXPITAMzF8dJSIFo9D8HfdOV0IAdx4O7PtixWKn5y2hMNG0zQPyUecp4pzC6kivAIhyfHilFR61RGL+GPXQ2MWZWFYbAGjyiYJnAmCP3NOTd0jMZEnDkbUvxhMmBYSdETk1rRgm+R4LOzFUGaHqHDLKLX+FIPKcF96hrucXzcWyLbIbEgE98OHlnVYCzRdK8jlqm8tehUc9c9WhQ== vagrant insecure public key
```

## Remove sudo password
一般使用 vagrant 作为 sudo password，但你可以去除。

```
$ sudo visudo
```

添加找到相应行添加 `NOPASSWD`

```
# Members of the admin group may gain root privileges
%admin ALL=(ALL) NOPASSWD: ALL

# Allow members of group sudo to execute any command
%sudo ALL=(ALL:ALL) NOPASSWD: ALL
```


## Packge Base Box
[vagrant package 命令用法](http://docs.vagrantup.com/v2/cli/package.html)

```
$ vagrant package vm_name --base name --output box_file_name
# Example
# vagrant package lemp.ubuntu --base ubuntu --output lemp.ubuntu.box
```

## Import Box


导入 box
```
$ vagrant box add vm_name box_file_name
# vagrant box add lemp.ubuntu ./lemp.ubuntu
# vagrant box add lemp.ubuntu http://xxx.xxx/xxx.box
```

你还可以下载其他[一些boxes](http://www.vagrantbox.es)。

查看 box list

```
$ vagrant box list
lemp.ubuntu (virtualbox, 0)
```

添加 vagrantfile 配置和运行 box
```
$ cd ~/web\ develop/
$ vagrant init lemp.ubuntu
$ vagrant up
```

具体配置可以参考[这里](http://docs.vagrantup.com/v2/vagrantfile)

ssh 链接
* Windows 用户是不能使用该方法的，请自行使用其他 ssh client 工具
```
$ vagrant ssh
```

大功告成，只要你将BOX 分享给其他人就可以了。

## 其他

### 修改默认 SSH 端口

修改 Vagrantfile

```
$ config.vm.network :forwarded_port, guest: 10022, host: 2255
```

修改 vm ssh server 配置

```
$ sudo vim /etc/ssh/sshd_config

```

再次修改 Vagrantfile

```
# 添加
config.ssh.port = 2255        # host
config.ssh.guest_port = 10022   # vm
```

导出 box

```
$ vagrant package ubuntu --output ubuntu.box
```


## 一般遇到的问题

### 需要启动 GUI

配置 vagrantfile
```
config.vm.provider "virtualbox" do |v|
v.gui = true
end
```

### 没有安装 ssh server
```
$ vagrant up
...
  default: SSH address: 127.0.0.1:2222
  default: SSH username: vagrant
  default: SSH auth method: private key
  default: Warning: Connection timeout. Retrying...
  default: Warning: Remote connection disconnect. Retrying...
```

注意你是否安装了 ssh server

### SSH 无法链接
```
$ vagrant up
...
    default: SSH address: 127.0.0.1:2222
    default: SSH username: vagrant
    default: SSH auth method: private key
    default: Warning: Connection timeout. Retrying...
    default: Warning: Authentication failure. Retrying...
    default: Warning: Authentication failure. Retrying...
```

##### 请确定你的 ssh key 是否正确
[公钥](https://raw.github.com/mitchellh/vagrant/master/keys/vagrant.pub)

#### 确定 vagrant ssh config
```
$ vagrant ssh-config
Host default
  HostName 127.0.0.1
  User vagrant
  Port 2222
  UserKnownHostsFile /dev/null
  StrictHostKeyChecking no
  PasswordAuthentication no
  IdentityFile ~/.vagrant.d/insecure_private_key
  IdentitiesOnly yes
  LogLevel FATAL

# or 导出
$ vagrant ssh-config --host vagrant >> ~/.ssh/config
```

#### 利用 vagrant 私钥连接调试配置是否正确
```
$ ssh -o IdentitiesOnly=yes -i ~/.vagrant.d/insecure_private_key vagrant@127.0.0.1 -p 2222 echo OK
```

#### private_key 非 insecure_private_key(默认且非安全)或不正确

编辑 Vagrantfile
```
config.ssh.insert_key = false
config.ssh.private_key_path = ['~/.vagrant.d/insecure_private_key']
```
保存并重启
```
$ vagrant halt
$ vagrant up --provision
```


#### 确定文件权限，具体看上面步骤
- 0600 /.ssh/authorized_keys
- 0700 /.ssh

#### 确定增强工具是否正确安装

#### 开启GUI，查看 virtualbox 是否正常运行

```
Vagrant.configure(2) do |config|
 ...
 config.vm.provider "virtualbox" do |v|
   v.gui = true
 end
end
```

### 安装virtualbox增强工具

安装增强时出现以下错误提示
```
Installing the Window System drivers ...fail!
(Could not find the X.Org or XFree86 Windows System.)
```
这是正确的，因为系统并没有桌面环境

```
sudo /etc/init.d/vboxadd setup
Removing existing VirtualBox DKMS kernel modules ...done. 
Removing existing VirtualBox non-DKMS kernel modules ...done. 
Building the VirtualBox Guest Additions kernel modules 
The headers for the current running kernel were not found. If the following 
module compilation fails then this could be the reason. 

Building the main Guest Additions module ...done. 
Building the shared folder support module ...done. 
Building the OpenGL support module ...done. 
Doing non-kernel setup of the Guest Additions ...done. 
You should restart your guest to make sure the new modules are actually used 
```

在Building VirtualBox Guest Additions kernel modules的时候，缺少kernal的头文件， 
使用下面的命令安装： 

```
# sudo apt-get install dkms                       # 已经安装可忽略
# sudo apt-get install build-essential            # 已经安装可忽略
$ sudo apt-get install linux-headers-$(uname -r) 
$ sudo /etc/init.d/vboxadd setup
Removing existing VirtualBox DKMS kernel modules ...done. 
Removing existing VirtualBox non-DKMS kernel modules ...done. 
Building the VirtualBox Guest Additions kernel modules ...done. 
Doing non-kernel setup of the Guest Additions ...done. 
You should restart your guest to make sure the new modules are actually used 
```
