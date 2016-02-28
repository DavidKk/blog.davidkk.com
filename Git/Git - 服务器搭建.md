<!-- title: [backup] Git 服务器搭建-->
<!-- author: <David Jones qowera@qq.com>-->
<!-- date: 2015-04-25 12:51:19-->
<!-- update: 2015-05-06 10:53:22 -->
<!-- category: 多人开发-->
<!-- tag: git,git服务器搭建-->

# [backup] Git 服务器搭建

服务器: ubuntu in virtualbox
本机: osx

## 安装 Git

```
$ sudo apt-get install git
```

#### 创建 Git 用户

```
$ sudo adduser git
Adding user `git' ...
Adding new group `git' (1001) ...
Adding new user `git' (1001) with group `git' ...
Creating home directory `/home/git' ...
Copying files from `/etc/skel' ...
Enter new UNIX password:
Retype new UNIX password:
passwd: password updated successfully
Changing the user information for git
Enter the new value, or press ENTER for the default
  Full Name []:
  Room Number []:
  Work Phone []:
  Home Phone []:
  Other []:
Is the information correct? [Y/n] y
```

#### 初始化 Git 仓库

```
$ sudo git init --bare /srv/sample.git

# 修改拥有者
$ sudo chown -R git:git /srv/sample.git 
```

#### 禁止 shell 登陆

```
$ sudo vim /etc/passwd

git:x:1001:1001:,,,:/home/git:/bin/bash
# 修改成
git:x:1001:1001:,,,:/home/git:/usr/bin/git-shell
```

Git 用户可以通过 SSH 使用 Git，但无法使用 shell 登陆，因为 Git 用户指定的 git-shell 每次登陆就自动退出。

##### 测试SSH是否能登陆shell
```
$ ssh git@192.168.33.10
git@192.168.33.10's password:
Welcome to Ubuntu 14.10 (GNU/Linux 3.16.0-23-generic x86_64)
 * Documentation:  https://help.ubuntu.com/

  System information as of Sat Apr 25 09:52:02 CST 2015

  System load:  0.01              Processes:           101
  Usage of /:   22.6% of 6.99GB   Users logged in:     1
  Memory usage: 29%               IP address for eth0: 10.0.2.15
  Swap usage:   0%                IP address for eth1: 192.168.33.10

  Graph this data and manage this system at:
    https://landscape.canonical.com/

New release '15.04' available.
Run 'do-release-upgrade' to upgrade to it.

fatal: Interactive git shell is not enabled.
hint: ~/git-shell-commands should exist and have read and execute access.
Connection to 192.168.33.10 closed.
```

#### 创建证书授权登陆
授权有两种方式，Git服务器生成授权的ssh-keygen给予用户（感觉不太好，太麻烦了）

```
# 生成ssh-keygen
$ cd /home/git/.ssh/        # 没有该项目自行建，该项目应该是 git:git 700
$ sudo ssh-keygen           # 创建 ssh key

Generating public/private rsa key pair.
Enter file in which to save the key (/root/.ssh/id_rsa): vagrant
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in vagrant.
Your public key has been saved in vagrant.pub.
The key fingerprint is:
92:5c:0c:3d:c4:07:f3:e0:47:9b:76:97:51:17:f6:5a root@ubuntu
The key's randomart image is:
+--[ RSA 2048]----+
|      .+=..   .++|
|       ++=.o  .oo|
|        +o* . o E|
|     . o o . . o |
|      + S     .  |
|       .         |
|                 |
|                 |
|                 |
+-----------------+
```

生成的 `vagrant`, `vagrant.pub`, 将 `vagrant` 交给用户。

```
# 用户主机
$ cp /tmp/vagrant ~/.ssh/           # 复制ssh key
$ vim ~/.ssh/config                 # 配置 ssh

Host sample
  HostName 192.168.33.10          # 服务器地址
  User git                        # git 用户
  IdentityFile ~/.ssh/vagrant     # ssh key

# 保存&退出
```

现在你可以执行 `git clone`
```
$ git clone git:sample/srv/sample.git
# git:xxx 对应 `config` 文件的 Host
```

可以测试证书是否正常连接
```
$ ssh -o IdentitiesOnly=yes -i ~/.ssh/vagrant git@192.168.33.10.git echo ok
```

#### 提交证书授权登陆
授权有两种方式，用户提交ssh-keygen给予Git服务器授权。可以免除设置用户 ssh config。

```
# 用户
$ vim ~/.ssh/id_rsa # linux

# 追加到服务器
$ sudo vim /home/git/.ssh/authorized_keys # 文件没有自己建

# 自己建 >> 必须归属git用户
$ sudo mkdir /home/git/.ssh
$ sudo chown -R git:git /home/git/.ssh  # 设置一下归属
$ sudo chmod 700 /home/git/.ssh         # 设置一下权限
$ sudo cat /tmp/id_rsa >> /home/git/.ssh/authorized_keys # tmp/id_sra 为电脑上的SSH-key

# 建议直接使用git用户，若前面关闭shell功能此时将无法切换用户
$ su git
...
```

#### 克隆远程仓库

此操作是在电脑上运行，克隆服务器上的Git仓库。

```
# 回到本机
$ git clone git@192.168.33.10:/srv/sample.git
```

## Git Hook 自动化部署代码

#### Hook 列表

```
-----------------------------------------------------------------
|钩子名字           |触发命令           |参数|非0导致取消|备注|
|applypatch-msg    |git am           |1   |Yes||
|pre-applypatch    |git am           |0   |Yes||
|post-applypatch   |git am           |0   |No ||

|pre-commit        |git commit       |0   |Yes||
|prepare-commit-msg|git commit       |1~3 |Yes||
|commit-msg        |git commit       |1   |Yes||
|post-commit       |git commit       |0   |No ||

|pre-rebase        |git rebase       |2   |Yes||

|post-checkout     |git checkout     |3   |No ||

|post-merge        |git merge        |1   |No ||

|pre-receive       |git-receive-pack |0   |Yes|通过标准输入获取信息|
|update            |git-receive-pack |3   |Yes||
|post-receive      |git-receive-pack |0   |No |通过标准输入获取信息|
|post-update       |git-receive-pack |可变|No ||
-----------------------------------------------------------------
注: 最后4个才是远程资源库执行的hook,其他都是本地资源库的hook
```

我们先创建一个 Git 的生产环境

```
$ git clone /srv/sample.git /srv/production.sample.git
Cloning into 'production.sample.git'...
done.
```

现在我们通过 Hook 

