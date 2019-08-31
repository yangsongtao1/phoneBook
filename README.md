PC端通讯录(vue+vuex+iview+koa2)

本项目分为前台和后台 前台在 view 目录下 后台在 service目录下 sql目录存放数据sql文件

本项目涉及邮箱验证,所以也需要按章redis数据库

使用前需要将前端目录下/config/index.js 中 proxyTable对象的target属性 改为后台启动的地址和端口


本项目目前实现功能: 1、(国际化)中英文切换 2、用户注册、修改密码、修改邮件功能 3、添加分组、删除分组 4、添加联系人


