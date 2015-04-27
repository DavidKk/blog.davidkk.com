<!-- title: [backup] Git 折腾 -->
<!-- author: <David Jones qowera@qq.com> -->
<!-- update: 2015-04-26 14:26:23 -->

# [backup] Git 折腾

建议安装 `source tree`，边用命令行边观察 `source tree` 版本的变化，更形象了解 git 的运作方式.

操作系统：OSX
GIT服务器：Ubuntu in vritualbox

### 安装 git

```
sudo apt-get install git
```

### 创建版本库

```
mkdir sample
cd sample

git init
Initialized empty Git repository in ~/sample/.git/

# 添加 remote
git remote add origin git@vagrant:/srv/sample.git
```

首先这里再明确一下，所有的版本控制系统，其实只能跟踪文本文件的改动，比如TXT文件，网页，所有的程序代码等等，Git也不例外。版本控制系统可以告诉你每次的改动，比如在第5行加了一个单词“Linux”，在第8行删了一个单词“Windows”。而图片、视频这些二进制文件，虽然也能由版本控制系统管理，但没法跟踪文件的变化，只能把二进制文件每次改动串起来，也就是只知道图片从100KB改成了120KB，但到底改了啥，版本控制系统不知道，也没法知道。
不幸的是，Microsoft的Word格式是二进制格式，因此，版本控制系统是没法跟踪Word文件的改动的，前面我们举的例子只是为了演示，如果要真正使用版本控制系统，就要以纯文本方式编写文件。
因为文本是有编码的，比如中文有常用的GBK编码，日文有Shift_JIS编码，如果没有历史遗留问题，强烈建议使用标准的UTF-8编码，所有语言使用同一种编码，既没有冲突，又被所有平台所支持。

### 提交版本
```
echo 'Hello world' >> README.md
git add README.md
git commit -m "First commit."
[master (root-commit) fdddd23] First commit.
 1 file changed, 1 insertion(+)
 create mode 100644 README.md

git push origin master
```

### 仓库状态
```
echo 'First modify.' >> README.md

git status
On branch master
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

  modified:   README.md

no changes added to commit (use "git add" and/or "git commit -a")
```

### 文件对比
```
git diff README.md
diff --git a/README.md b/README.md
index e1923af..802992c 100644
--- a/README.md
+++ b/README.md
@@ -1 +1 @@
Hello world
+First modify.
```

####提交修改的文件
```
git commit -m 'modify README.md' README.md
[master fd71ac3] modify README.md
 1 file changed, 1 insertion(+), 1 deletion(-)

git push origin master
Counting objects: 5, done.
Writing objects: 100% (3/3), 261 bytes | 0 bytes/s, done.
Total 3 (delta 0), reused 0 (delta 0)
To git@vagrant:/srv/sample.git
   5faf1b6..fd71ac3  master -> master
```

### 查看记录

```
git log
commit fd71ac30589bfad51dc119c65a0987efec7cddca
Author: David Jones <qowera@qq.com>
Date:   Sun Apr 26 20:25:50 2015 +0800

    modify README.md

commit 5faf1b60d8a597dadd0a26fd851e52c2513252c1
Author: David Jones <qowera@qq.com>
Date:   Sun Apr 26 18:06:54 2015 +0800

    first commit

# 一行显示
git log --pretty=oneline
fd71ac30589bfad51dc119c65a0987efec7cddca modify README.md
5faf1b60d8a597dadd0a26fd851e52c2513252c1 first commit

# 显示上一次详细记录
git show
commit fd71ac30589bfad51dc119c65a0987efec7cddca
Author: David Jones <qowera@qq.com>
Date:   Sun Apr 26 20:25:50 2015 +0800

    modify README.md

diff --git a/README.md b/README.md
index e1923af..802992c 100644
--- a/README.md
+++ b/README.md
@@ -1 +1 @@
-Hello world!!!
+Hello world
```

### 查看命令历史
```
git reflog
fd71ac3 HEAD@{4}: commit: modify README.md
5faf1b6 HEAD@{5}: commit (initial): first commit
```

### 回滚
```
git reset --hard HEAD^
HEAD is now at 5faf1b6 first commit
```

现在看下版本记录

```
git log --pretty=oneline
5faf1b60d8a597dadd0a26fd851e52c2513252c1 first commit
```

现在已经回到上一个版本了，而 `modify README.md` 那个版本已经看不到了

### 回滚的回滚

我现在又不爽要换回去

```
git reset --hard fd71ac30589bfad51dc119c65a0987efec7cddca
HEAD is now at fd71ac3 modify README.md
```

现在我们在看一下HEAD

```
git log -pretty=oneline
fd71ac30589bfad51dc119c65a0987efec7cddca modify README.md
5faf1b60d8a597dadd0a26fd851e52c2513252c1 first commit
```

我们又回到 `modify README.md` 版本，因此我们可以通过 `git reset --hard id` 回到某个版本

### Working Director - 工作区
工作区就是指我们看到的 `sample` 这个文件夹，里面包括一切我们添加/修改的内容

### Repository - 版本库
`sample` 里面又一个叫 `.git/` 的目录，这个目录就是版本库，我们可以看下里面又什么东西。

```
ls -al .git/
total 64
drwxr-xr-x  16 david  staff  544  4 26 21:07 .
drwxr-xr-x   4 david  staff  136  4 26 21:06 ..
-rw-r--r--   1 david  staff   17  4 26 20:25 COMMIT_EDITMSG
-rw-r--r--   1 david  staff   94  4 26 21:04 FETCH_HEAD
-rw-r--r--   1 david  staff   23  4 26 18:05 HEAD
-rw-r--r--   1 david  staff   41  4 26 21:06 ORIG_HEAD
drwxr-xr-x   2 david  staff   68  4 26 18:05 branches
-rwxr--r--   1 david  staff  235  4 26 21:04 config
-rw-r--r--   1 david  staff   73  4 26 18:05 description
drwxr-xr-x  11 david  staff  374  4 26 18:05 hooks
-rw-r--r--   1 david  staff  137  4 26 21:06 index
drwxr-xr-x   3 david  staff  102  4 26 18:05 info
drwxr-xr-x   4 david  staff  136  4 26 18:06 logs
drwxr-xr-x   9 david  staff  306  4 26 20:25 objects
drwxr-xr-x   5 david  staff  170  4 26 20:13 refs
-rw-r--r--@  1 david  staff  156  4 26 21:04 sourcetreeconfig
```

#### 查看指针 HEAD
```
cat .git/HEAD
ref: refs/heads/master
```

指针指向的是 `master` 分支，进入 `refs/heads/master`

```
cat .git/refs/heads/master
fd71ac30589bfad51dc119c65a0987efec7cddca
```

里面保存的正是当前 HEAD 所指向的版本号。


#### 暂存区
其中 `index`文件，我们一般将其称为 `stage` - 暂存区，主要暂存信息都保存在里面。

现在我们来做个测试。

```
echo 'MIC' >> LICENSE
echo 'Second modify.' >> README.md

git status
On branch master
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

  modified:   README.md

Untracked files:
  (use "git add <file>..." to include in what will be committed)

  LICENSE

no changes added to commit (use "git add" and/or "git commit -a")
```

我们看到 `README.md` 已经被检测有内容修改了，而 `LICENSE` 文件始终保持 `Untracked` 状态。

```
git add README.md LICENSE
git status
On branch master
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

  new file:   LICENSE
  modified:   README.md
```

现在，我们可以发现修改的文件都被添加到 `changes` 行列了，但是这些文件并没有提交，此时文件都会保存在暂存区中，当执行 `commit` 时，文件才会提交分支上。接下来我们来 `commit` 一下

```
git commit -m 'Second commit.'
[master d14ad61] Second commit.
 2 files changed, 2 insertions(+)
 create mode 100644 LICENSE

git status
On branch master
nothing to commit, working directory clean
```

工作区清空了，所有都被提交到 `master` 分支上

总结一下：工作区 -> 暂存区 -> (HEAD => master) -> origin

最后，我们还是把修改的东西推送一下吧。


### 修改管理

所有操作都是根据上面所说的 `工作区 -> 暂存区 -> master` 的顺序进行管理的。

我们尝试下打乱顺序。

```
echo 'Third modify.' >> README.md
git add README.md

echo 'Fourth modify.'
git commit -m '你会发现 commit 的内容不包括 Fourth modify.'
[master ccc8977] 你会发现 commit 的内容不包括 Fourth modify.
 1 file changed, 3 insertions(+), 1 deletion(-)

git status
On branch master
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

  modified:   README.md

no changes added to commit (use "git add" and/or "git commit -a")
```

通过 `git status`，我们发现 README.md 并没有 commit，因为你的 `Fourth modify.` 还没有 `git add`，而那次 `commit` 只是提交了 `Third modify`。

通过 `git diff` 更实际看出文件状态

```
git diff README.md
diff --git a/README.md b/README.md
index b78c1db..1241080 100644
--- a/README.md
+++ b/README.md
@@ -2,3 +2,4 @@ Hello world
 First modify.
 Second modify.
 Thrid modify.
+Fourth modify.
```

### 撤销修改

因为有工作区，暂存区，分支，我们可以从多个方向撤销修改内容。

#### 工作区中撤销修改

```
echo 'Fuck boss' >> README.md
git checkout -- README.md

cat README.md
Hello world
First modify.
Second modify.
Thrid modify.
```

当提交到暂存区时，该撤销只能撤销工作区中的修改，当我们保存到暂存区时，我们可以撤销修改到暂存区的修改。

```
echo 'Fifth modify.' >> README.md
git add README.md

echo 'Fuck boss' >> README.md
git checkout -- README.md

cat README.md
Hello world
First modify.
Second modify.
Thrid modify.
Fifth modify.
```

没有 `Fuck boss` 信息了，但保存 'Fifth modify.'。

#### 暂存区中撤销修改

```
echo 'Sixth modify.' >> README.md
git add README.md
git status
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

  modified:   README.md

git reset HEAD README.md

git status
On branch master
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

  modified:   README.md

no changes added to commit (use "git add" and/or "git commit -a")
```

我们可以看到，暂存区的文件又重新回到工作区。

### 删除文件

```
echo 'delete this file.' > version.txt
git add version.txt
git commit -m 'add version.txt'
```

现在我们要将其删除。

```
git rm version.txt
rm 'version.txt'

git status
On branch master
Changes not staged for commit:
  (use "git add/rm <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

  deleted:    version.txt

no changes added to commit (use "git add" and/or "git commit -a")

git commit -m 'delete version file.'
```

如果我们发现删错了文件，而且我们已经提交了文件
```
git reset --hard HEAD^
```

因为 `git reset --head` 不能带 paths 参数，当我们只想恢复删除的某一个文件时，我们可以这样做
```
git log --pretty=oneline
52d6bfe213baab66cd36490719b46eed0ad66cab delete version file.
98d202e34397a729bbe88b521582f43d5437c380 add version.txt

git checkout 98d202e34397a729bbe88b521582f43d5437c380 version.txt

git status
On branch master
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

  new file:   version.txt
```

此时我们可以看到 `version.txt` 已经回到工作区了，不过这里不菲版本回滚，而是将删除的文件重新加入暂存区中。

下面再介绍一下若我们只是删除了文件，并没有 `commit` 上去，我们就可以这样做：

```
git rm version.txt
rm 'version.txt'

git status
On branch master
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

  deleted:    version.txt

git reset -- version.txt
git status
On branch master
Changes not staged for commit:
  (use "git add/rm <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

  deleted:    version.txt

no changes added to commit (use "git add" and/or "git commit -a")

git checkout -- version.txt
git status
On branch master
nothing to commit, working directory clean
```

我们可以看到当删除文件时，我们并没有 `commit`，更改都保存在暂存区；
然后我们 `git reset -- version.txt` 可以看到 delete 操作回到工作区，但是工作区还是什么都没有，因为这个状态表示工作区已经删除了该文件；
最后我们再执行 git checkout -- version.txt，我们可以清楚发现在工作区被删除的文件回来了。 

### 远程仓库

如果已经自行搭建过 git 服务器或者阅读过 `git 服务器搭建`，此处可以略过，此处也略略介绍一下，具体请阅读 `git 服务器搭建`。

#### 创建 ssh key
```
ssh-keygen -t rsa -C "your email@example.com"
```

将 ssh-key(那个叫 id_rsa.pub 的文件) 给予Git服务管理者，让她们去把你的密钥添加到 `authorized_keys` 中，
然后你就可以通过SSH操作Git库

#### 添加远程库
```
git init
git remote add origin git@github.com:/team/sample.git
git add README.md
git commit -m 'First commit.'
git push -u origin master
```

第一次推送一定要加上 `-u` 是因为这样能使本地 `master` 分支内容推送到远程 `master`的同时，可以把本地 `master` 分支和远程 `master` 分支关联起来，之后可以不用添加 `-u`。

#### 克隆仓库

```
git clone git@github.com:/team/sample.git sample
```

### 分支管理

#### 创建与合并分支

