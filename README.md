# 博客

存放博客中的markdown文档以及相关的静态文件作为备份,以防服务器出现问题,资料丢失。

## 1.总览

共有三个工程blog、blog-client、blog-server。各自作用如下

- blog
存放文档及静态文件,作为备份。
- blog-client 
博客前端工程,用于呈现markdown及对markdown的维护。
- blog-server
博客后端工程,用于为blog-client提供接口。

    1. 获取文章列表,及文章相关信息
    2. 获取特定文章内容
    3. 编辑某一文章,及其相关信息
    4. 创建某一文章,及其相关信息
    5. 权限校验
    6. 与blog的git仓库进行同步

## 2. 流程

#### (1)浏览一览流程

1. blog-client发送请求到blog-server
2. blog-server查看blog所在git库,返回所有文件信息
3. blog-client对返回数据进行呈现

#### (2)查看文章流程

1. blog-client发送查询特定文章请求到blog-server
2. blog-server通过文章id找到文章对应路径,读取文章,并返回字符串
3. blog-client将返回markdown字符串转为html进行展示

#### (3)编辑文章流程

1. blog-client发送编辑特定文章请求到blog-server
2. blog-server通过文章id找到文章对应路径,读取文章,并返回字符串
3. blog-client将返回markdown放入codemirror中作为初始值
4. blog-client通过codemirror对字符串进行编辑,并通过react-markdown对其进行预览
5. blog-client发送post请求,将当前文章内容及相关信息发送到blog-server
6. blog-server对当前请求进行权限验证
7. blog-server把字符串写入文件中,并push blog工程使其与github中的远程仓库同步

#### (4)创建文章流程

1. blog-client通过codemirror对字符串进行编辑,并通过react-markdown对其进行预览
2. blog-client发送post请求,将当前文章内容及相关信息发送到blog-server
3. blog-server对当前请求进行权限验证
4. blog-server把字符串写入创建的文件中,并push blog工程使其与github中的远程仓库同步

#### (5)同步文章流程

1. 通过各种方式直接修改或添加blog仓库中的文档
2. 通过travis ci登录服务器主动拉取blog仓库中的文档

## 3. feature

1. blog-client与blog-server能够通过websocket通信
2. 能够使用graphql进行查询数据
3. 文件中存放的文档描述信息能够放入数据库中,并及时同步。