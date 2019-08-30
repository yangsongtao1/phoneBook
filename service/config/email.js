module.exports =  {
    redis: {
        get host() {
            return '127.0.0.1'
        },
        get port(){
            return 6379
        }
    },
    //使用什么 smtp服务 这里使用 qq邮箱提供的smtp服务（使用的QQ邮箱需要设置开始）
    smtp: {
        get host() {
            return 'smtp.qq.com'
        },
        //使用发送邮箱的账号
        get user(){
            return '524366384@qq.com'
        },
        //邮箱生成的授权码
        get pass() {
            return 'hqraxckxmysrbjei'
        },
        //返回随机验证码
        get code() {
            return ()=>{
                return Math.random().toString(16).slice(2,6).toUpperCase()
            }
        },
        //配置验证码过期时间
        get expire() {
            return ()=> {
                return new Date().getTime() + 60*1000
            }
        }
    }
}
