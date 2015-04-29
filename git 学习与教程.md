<!-- title: [backup] Git 学习/教程-->
<!-- author: <David Jones qowera@qq.com>-->
<!-- date: 2015-04-26 14:26:23-->
<!-- category: 多人开发-->
<!-- tag: git,学习-->

# [backup] Git 学习/教程

Git 与 SVN 区别什么的，这里没有详细说，接受新事物很重要，有什么区别你用过就会知道，如果你有选择恐惧症，请 google/bing 一下大神们是如何解释的。

建议安装 `source tree`，边用命令行边观察 `source tree` 版本，分支等的变化情况，这样能更形象了解 git 的运作方式。

操作系统：OSX
Git 服务器：Ubuntu in vritualbox

### 安装 git

无论是客户端还是服务器，都是直接安装 git 就可以了，搭建 `Git` 服务器再 `Git 服务器搭建` 一篇上有说明。

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

在 `source tree` 上我们可以很清晰看见一条开发时间轴，我们可以建立新的分支进行开发，最后合并到主分支上。

```
git branch dev

git branch
  dev
* master
```

通过 `git branch branch_name` 我们可以创建一个新的分支，而 `git branch` 可以查看所有的分支。而当前 HEAD 还是指向 `master`。

如果我们要切换到 `master` 分支下，我们可以通过以下命令实现

```
git checkout master

git branch
  dev
* master
```

我们也可以简单地直接创建并跳转到新的分支，我们可以这样做：

```
git checkout -b dev
Switched to a new branch 'dev'

git branch
* dev
  master
```

通过 `git checkout -b` 我们可以创建一个新的分支，同时切换到新的 `dev` 分支上，而 HEAD 指向的新分支 `dev`。

`dev` 分支已经开发完毕了，我们要合并到主干分支上

```
git merge dev
Already up-to-date.
```

这样，`dev` 上的分支就会合并到 `master` 分支上；注意，这里是把某一分支合并到当前分支上；因此当前我们操作的分支是 `master`。

现在我不想要 `dev` 分支了，我们可以这样把它删掉

```
git branch -d dev
Deleted branch dev (was b13c68f).

git branch
* master
```

现在值剩下主分支了。

### 解决冲突

合并代码绝对不会这么容易，我们来谈谈如何解决冲突吧。首先我们先来制造冲突：
```
git checkout -b featureA
git branch featureB

echo 'fuck boss.' >>  version.txt
git add version.txt
git commit -m 'add a verion file'

git checkout featureB
echo 'fuck Q.' >> version.txt
git add version.txt
git commit -m 'add a confilt file.'

git merge featureA
Auto-merging version.txt
CONFLICT (add/add): Merge conflict in version.txt
Automatic merge failed; fix conflicts and then commit the result.

git status
On branch featureB
You have unmerged paths.
  (fix conflicts and run "git commit")

Unmerged paths:
  (use "git add <file>..." to mark resolution)

  both added:      version.txt

no changes added to commit (use "git add" and/or "git commit -a")
```

发现有冲突了，我们来看一下冲突的内容

```
cat version.txt
<<<<<<< HEAD
fuck Q.
=======
Fuck boss.
>>>>>>> featureA
```

我们修改一下文件

```
echo 'Fuck boss.' >> version.txt
git add version.txt
git commit -m 'conflict fixed'
[featureB 33665f2] conflict fixed
```

然后我们可以通过 `git log` 产看分支历史

```
git log --graph --pretty=oneline --abbrev-commit
*   33665f2 conflict fixed
|\
| * 3209975 add version file.
* | 827c276 nima shuoge maoxiana.
|/
* b13c68f delete file.
....
```

最后工作完成了，我们可以合并到 `master` 分支并删除一下 `fetureA`, `fetureB` 分支

```
git checkout master
git merge featureB
git branch -d featureA featureB
```

工作完成。


### 分支管理策略

合并分支时，Git 默认会使用 `Fast forward` 模式，这种情况下，在删除分之后，会丢失分支信息。
如果要强制使用 `Fast forward`，Git 就会在 `merge` 时生成一个新的 `commit`，这样我们就能在分支历史上看到分支信息。

首先我们先要创建一个 `dev` 分支

```
git checkout -b dev
Switched to a new branch 'dev'
echo 'git merge' >> log.txt
git add log.txt
git commit -m 'add log file.'
[dev cd80af4] add log file.
 1 file changed, 1 insertion(+)
 create mode 100644 log.txt
```

切换到 `master` 分支

```
git checkout master
Switched to branch 'master'
```

然后开始合并 `dev` 分支

```
git merge --no-ff -m 'merge with --no-ff' dev
Merge made by the 'recursive' strategy.
 log.txt | 1 +
 1 file changed, 1 insertion(+)
 create mode 100644 log.txt

git log --graph --pretty=oneline --abbrev-commit
*   1dd2236 merge with --no-ff
|\
| * cd80af4 add log file.
|/
*   33665f2 conflict fixed
...
```

通过上图我们可以看出，当我们不适用 `Fast forward` 时，`master` 的位置在 `1dd2236` 上，而 `dev` 的位置在 `cd80af4` 上，而 `HEAD` 指向 `master`。

在实际开发中，我们会创建很多分支，而最主要的我们一般定义它为 `master` 分支（也称主分支），该分支应该是最稳定的。
而我们开发一般定义一个 `dev` 分支，而我们开发中的每一个都有自己的一个自己的分支 `david`，`guoshan`等，当我们开发完毕，我们就往 `dev` 分支上合并。
最后合并的时候我们最好使用 `--no-ff` 模式进行合并，这样就能完美显示合并前的那个分支了。

### Bug 分支

开发过程中，我们经常会遇到这样那样的BUG。因此我们通常会建立BUG分支进行BUG修复工作。
然而这些BUG分支，我们通常会使用 `issue-number` 等命名，表示BUG分支。

下面我们定义该BUG分支为 `issue-100`

```
git checkout -b issue-100
Switched to a new branch 'issue-100'

echo 'bugs fixed.' >> log.txt
git checkout dev
M log.txt
Switched to branch 'dev'

git merge issue-100
Already up-to-date.

git merge --no-ff -m 'fixed bugs.' issue-100
Merge made by the 'recursive' strategy.
 log.txt | 1 +
 1 file changed, 1 insertion(+)
 create mode 100644 log.txt

git branch -d issue-100
Deleted branch issue-100 (was cd80af4).
```

通过这些步骤，我们成功修复了BUG。

然后最屌的情况是，我们还在开发 `dev` 分支，突然来了个必须修改的紧急BUG，此时我们的 `dev` 分支还在开发中，
而项目必须立马修改这个BUG，此时我们可以通过 `git stash` 把工作区存储起来。

```
echo 'i am developing.' >> log.txt
git stash
Saved working directory and index state WIP on dev: 7f41b6d fixed bugs.
HEAD is now at 7f41b6d fixed bugs.

git status
On branch dev
nothing to commit, working directory clean
```

我们通过 `git status` 查看工作区，可以很清晰看到工作区没有任何修改。

```
git checkout master
Switched to branch 'master'

git checkout -b issue-101
Switched to a new branch 'issue-101'

echo 'fixed bugs again.' >> log.txt
git add log.txt
git commit -m 'fixed bugs again.'
[issue-101 7fca144] fixed bugs again.
 1 file changed, 1 insertion(+)

git checkout master
git merge --no-ff -m 'merge fixed bugs again.' issue-101
Merge made by the 'recursive' strategy.
 log.txt | 1 +
 1 file changed, 1 insertion(+)

git branch -d issue-101
Deleted branch issue-101 (was 7fca144).
```

修改完毕，现在我们可以进入 `dev` 中继续进行开发了，我们可以通过 `git stash list` 获取之前临时保存的版本号，`git stash apply` 来恢复

```
git checkout dev
Switched to branch 'dev'

git stash list
stash@{0}: WIP on dev: 7f41b6d fixed bugs.

git stash apply
On branch dev
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

  modified:   log.txt

no changes added to commit (use "git add" and/or "git commit -a")
git stash drop
Dropped refs/stash@{0} (2cac2dc8a542b517d9def938be7eb15269cbfc84)

# or

git stash pop
On branch dev
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

  modified:   log.txt

no changes added to commit (use "git add" and/or "git commit -a")
Dropped refs/stash@{0} (69c0226c47f63c011bd786db2b0fe2f65b7a816e)
```

`git stash apply` 是恢复临时存储用的，`git stash drop` 是删除临时存储用的，我们也可以直接使用 `git stash pop` 进行恢复并删除。

若我们要指定恢复到某一个临时存储

```
git stash list
stash@{0}: WIP on dev: 7f41b6d fixed bugs.

git stash apply stash@{0}
On branch dev
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

  modified:   log.txt

no changes added to commit (use "git add" and/or "git commit -a")
```

### feature 分支

在开发过程中，我们通常会为项目添加新的需求/功能，所以我们一般会建立一些 `feature` 分支来进行功能开发。

```
git checkout -b feature-login
Switched to a new branch 'feature-login'

echo 'add login feature.' >> log.txt
git add log.txt

git commit -m 'add login feature.'
[feature-login 021b979] add login feature.
 1 file changed, 1 insertion(+)

git checkout dev
Switched to branch 'dev'

git merge --no-ff -m 'merge login feature.' feature-login
Merge made by the 'recursive' strategy.
 log.txt | 1 +
 1 file changed, 1 insertion(+)

git branch -d  feature-login
Deleted branch feature-login (was 021b979).
```

### 多人协作

当克隆远程仓库时，Git 会自动把本地 `master` 分支与远程 `master` 关联起来，并且给予远程仓库名称 `origin`。

#### 查看远程仓库

```
git remote
origin

git remote -v
origin  git@vagrant:/srv/sample.git (fetch)
origin  git@vagrant:/srv/sample.git (push)
```

当我们并没有 `push` 权限的时候，我们将看不见有 `push` 地址。

#### 推送远程同步

我们可以把本地提交到远程，推送时要指定本地分支。

```
git push origin master
git push origin dev
```

一般情况下，`master` 又称主分支 与 `dev` 又称开发分支都必须推送到远程同步。
而 `bug` 分支，我们可以在本地进行BUG修复，然后合并到 `master` 上再进行推送，而不需要把该分支推送到远程同步。
`feature` 分支，这个功能点是否推送远程同步这个要具体分析。

#### 克隆项目并拉去分支

```
git clone git@vagrant:/srv/sample.git ./sample2
Cloning into './sample2'...
remote: Counting objects: 12, done.
remote: Compressing objects: 100% (6/6), done.
remote: Total 12 (delta 1), reused 0 (delta 0)
Receiving objects: 100% (12/12), 1014 bytes | 0 bytes/s, done.
Resolving deltas: 100% (1/1), done.
Checking connectivity... done.

git branch
* master

git checkout -b dev origin/dev
Branch dev set up to track remote branch dev from origin.
Switched to a new branch 'dev'

git branch
* dev
  master
```

当克隆仓库时，我们发现只有 `master` 分支，所以我们必须执行 `git checkout -b dev origin` 将远程 `dev` 分支拉取下来。
当我们再次查看分支就能发现我们已经下载并切换到 `dev` 分支上了。
这里我们新建一个新的本地仓库吧。

```
echo 'hello' > a.txt
git add a.txt

git commit -m 'no message.'
[dev 92d7e7d] no message.
 1 file changed, 1 insertion(+)
 create mode 100644 a.txt

git push origin dev
Delta compression using up to 4 threads.
Compressing objects: 100% (2/2), done.
Writing objects: 100% (3/3), 264 bytes | 0 bytes/s, done.
Total 3 (delta 1), reused 0 (delta 0)
To git@vagrant:/srv/sample.git
   99e74f0..92d7e7d  dev -> dev
```

这是正常的情况下，如果小伙伴们也提交了修改，那么我们应该先试图 `git pull` 拉去小伙伴们的修改
此处我们把上面那部分看作是小伙伴们的提交，现在回到我们本身的仓库中。

```
echo 'world' > b.txt
git add b.txt

git commit -m 'no message.'
[dev 9cdd3c8] no message.
 1 file changed, 1 insertion(+)
 create mode 100644 b.txt

git push origin dev
To git@vagrant:/srv/sample.git
 ! [rejected]        dev -> dev (fetch first)
error: failed to push some refs to 'git@vagrant:/srv/sample.git'
hint: Updates were rejected because the remote contains work that you do
hint: not have locally. This is usually caused by another repository pushing
hint: to the same ref. You may want to first integrate the remote changes
hint: (e.g., 'git pull ...') before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.

git pull
Merge branch 'dev' of vagrant:/srv/sample into dev

# Please enter a commit message to explain why this merge is necessary,
# especially if it merges an updated upstream into a topic branch.
#
# Lines starting with '#' will be ignored, and an empty message aborts
# the commit.

# 退出

git push origin dev
Counting objects: 8, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (4/4), done.
Writing objects: 100% (5/5), 494 bytes | 0 bytes/s, done.
Total 5 (delta 2), reused 0 (delta 0)
To git@vagrant:/srv/sample.git
   92d7e7d..1c574b2  dev -> dev
```

当小伙伴们提交远程同步，我们落后于最新版本，因此我们必须先 `git pull` 试图将版本换成小伙伴们提交同步的那个最新版本，然后再提交远程同步。
但是一般来说都不会如你所愿，因为版本落后太多或各种原因而造成冲突，这时候 `git pull` 将会不能完成操作。

我们可以先切换到 `sample2` 那个项目
```
echo 'make a confilt.' >> c.txt
git add c.txt
git commit -m 'no message.' c.txt
[dev 8b36ede] no message.
 1 file changed, 1 insertion(+)
 create mode 100644 c.txt

git push origin dev
Counting objects: 5, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (2/2), done.
Writing objects: 100% (3/3), 274 bytes | 0 bytes/s, done.
Total 3 (delta 1), reused 0 (delta 0)
To git@vagrant:/srv/sample.git
   1c574b2..8b36ede  dev -> dev
```

然后我们再次切换到最早那个 `sample` 项目

```
echo 'i can make a big confilt.' >> c.txt
git add c.txt
git commit -m 'no message.' c.txt
[dev 333c9ee] no message.
 1 file changed, 1 insertion(+)
 create mode 100644 c.txt

git push origin dev
To git@vagrant:/srv/sample.git
 ! [rejected]        dev -> dev (fetch first)
error: failed to push some refs to 'git@vagrant:/srv/sample.git'
hint: Updates were rejected because the remote contains work that you do
hint: not have locally. This is usually caused by another repository pushing
hint: to the same ref. You may want to first integrate the remote changes
hint: (e.g., 'git pull ...') before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.

git pull
There is no tracking information for the current branch.
Please specify which branch you want to merge with.
See git-pull(1) for details

    git pull <remote> <branch>

If you wish to set tracking information for this branch you can do so with:

    git branch --set-upstream-to=origin/<branch> dev
```

我们可以发现因为冲突导致，`git pull` 根本无法执行，因此我们要先解除冲突。

```
git pull origin dev
From vagrant:/srv/sample
 * branch            dev        -> FETCH_HEAD
Auto-merging c.txt
CONFLICT (add/add): Merge conflict in c.txt
Automatic merge failed; fix conflicts and then commit the result.

cat c.txt
<<<<<<< HEAD
i can make a big confilt.
=======
make a confilt
>>>>>>> 8b36ede90b6ed9d486a5dfb9a1d9e6ae6329b3a6
```

很明显，`c.txt` 文件造成的冲突，那么我们先指定一个远程分支作为对比 `origin dev` 分支就是我们想对比的分支。
现在我们把冲突解决下

```
echo 'i must resolve confilt.' > c.txt
git add c.txt
git commit -m 'resolve confilt.' c.txt
[dev e460b6d] resolve confilt.

git push origin dev
Counting objects: 10, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (4/4), done.
Writing objects: 100% (6/6), 569 bytes | 0 bytes/s, done.
Total 6 (delta 2), reused 0 (delta 0)
To git@vagrant:/srv/sample.git
   8b36ede..e460b6d  dev -> dev
```

我们终于可以提交远程同步了。

总结一下，多人协助的情况下
- 首先，可以试图用git push origin branch-name推送自己的修改；
- 如果推送失败，则因为远程分支比你的本地更新，需要先用git pull试图合并；
- 如果合并有冲突，则解决冲突，并在本地提交；
- 没有冲突或者解决掉冲突后，再用git push origin branch-name推送就能成功！

如果 `git pull` 提示“no tracking information”，则说明本地分支和远程分支的链接关系没有创建，用命令 `git branch --set-upstream branch-name origin/branch-name`。

### 标签管理

当我们完成一个版本的开发工作，那么我们可以发布版本了，通常情况下先为一个版本打一个标签，这就是版本号标签了。

#### 创建标签
```
git checkout master
Switched to branch 'master'

git tag v1.0
```
这样我们就成功为 `master` 打上 `1.0` 的标签了。我们可以通过 `git tag` 查看仓库的标签列表。

```
git tag
v1.0
``` 

如果我们想要为某个版本打上标签，因为已经忘记了打标签，我们可以这样做
```
git log --pretty=oneline
e460b6dc48dcf16fc9b4a66406d2bcee3310787d resolve confilt.
333c9eecec436e19cb6eedb06882cb896160a181 no message.

git tag beta 333c9eecec436e19cb6eedb06882cb896160a181

git tab
beta
v1.0
```

现在我们可以看到有两个标签，一个是 `beta` 版本，另外一个是 `v1.0` 版本。

标签可能还没具有具体意义，我们可以为标签添加备注。

```
git tag -a v1.0 -m 'version 1.0' e460b6dc48dcf16fc9b4a66406d2bcee3310787d

git show v1.0
tag v1.0
Tagger: David Jones <qowera@qq.com>
Date:   Wed Apr 29 00:55:54 2015 +0800

version 1.0

commit e460b6dc48dcf16fc9b4a66406d2bcee3310787d
Merge: 333c9ee 8b36ede
Author: David Jones <qowera@qq.com>
Date:   Wed Apr 29 00:39:15 2015 +0800

    resolve confilt.

diff --cc c.txt
index 41fbc6f,ce452a7..6693e78
--- a/c.txt
+++ b/c.txt
@@@ -1,1 -1,1 +1,1 @@@
- i can make a big confilt.
 -make a confilt
++i must resolve confilt.
```

通过 `git show tagname` 就可以查看到详细的 `tag` 信息了。

然而我们还可以对标签进行私钥签名，我们先来删除标签

```
git tag -d v1.0
Deleted tag 'v1.0' (was e9c2a35)
```

然后我们再来创建一个私钥签名的 `tag`，通过 `git tag -s`来创建

```
git tag -s v1.0 -m "signed version 1.0 released" 
error: cannot run gpg: No such file or directory
error: could not run gpg.
error: unable to sign the tag
```

报错了，因为我们并没有安装gpg（GnuPG）或没有找到gpg密钥对。

```
$ git show v1.0
tag v1.0
Tagger: David Jones <qowera@qq.com>
Date:   Wed Apr 29 00:55:54 2015 +0800

signed version 0.2 released
-----BEGIN PGP SIGNATURE-----
Version: GnuPG v1.4.12 (Darwin)

iQEcBAABAgAGBQJSGpMhAAoJEPUxHyDAhBpT4QQIAKeHfR3bo...
-----END PGP SIGNATURE-----

commit e460b6dc48dcf16fc9b4a66406d2bcee3310787d
Merge: 333c9ee 8b36ede
Author: David Jones <qowera@qq.com>
Date:   Wed Apr 29 00:39:15 2015 +0800

    resolve confilt.

diff --cc c.txt
index 41fbc6f,ce452a7..6693e78
--- a/c.txt
+++ b/c.txt
@@@ -1,1 -1,1 +1,1 @@@
- i can make a big confilt.
 -make a confilt
++i must resolve confilt.
```

#### 操作标签

删除标签

```
git tag -d v1.0
Deleted tag 'v1.0' (was e9c2a35)
```

因为我们现在创建的标签只会保存在本地，因此我们把标签推送到远程同步。

```
git push origin v.10
Counting objects: 14, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (6/6), done.
Writing objects: 100% (8/8), 867 bytes | 0 bytes/s, done.
Total 8 (delta 3), reused 0 (delta 0)
To git@vagrant:/srv/sample.git
 * [new tag]         v1.0 -> v1.0
```

这样远程服务器就会同步到该标签了，若我们的版本比较多，我们可以一次性把标签同步到远程

```
git push origin --tags
Total 0 (delta 0), reused 0 (delta 0)
To git@vagrant:/srv/sample.git
 * [new tag]         beta -> beta
```

那么我们要删除远程的标签应该如何做呢？

```
git tag -d v1.0
Deleted tag 'v1.0' (was 929b74a)

git push origin :refs/tags/v1.0
To git@vagrant:/srv/sample.git
 - [deleted]         v1.0
```

这样我们就可以将远程仓库中的标签删除掉。
