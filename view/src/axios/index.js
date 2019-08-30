import axios from 'axios'
import store from '../store'
import { Message } from 'iview';
import i18n from '../language'
import router from '../router'

axios.interceptors.request.use(
  config => {
    config.headers.common['Authorization'] = 'Bearer '+ store.state.users.token;
    return config
  }
)

axios.interceptors.response.use(
  data => {
    switch (data.data.code) {
      case 101:
        Message.error(i18n.t('noToken'))
        setTimeout( ()=> {
          router.replace({
            path: '/login'
          })
        }, 1000)
        break;
      case 102:
        Message.error(i18n.t('invalidToken'))
        setTimeout( ()=> {
          router.replace({
            path: '/login'
          })
        }, 1000)
        break;
      case 103:
        Message.error(i18n.t('tokenNotUsed'))
        setTimeout( ()=> {
          router.replace({
            path: '/login'
          })
        }, 1000)
        break;
    }
    return data;
  },
  // 对相应进行统一处理
  error => {
    if (error.response.status) {
      switch (error.response.status) {
        // 401: 未登录
        // 未登录则跳转登录页面，并携带当前页面的路径
        // 在登录成功后返回当前页面，这一步需要在登录页操作。
        case 401:
          router.replace({
            path: '/login',
          });
          break;
        // 403 token过期
        // 登录过期对用户进行提示
        // 清除本地token和清空vuex中token对象
        // 跳转登录页面
        case 403:
          Toast({
            message: '登录过期，请重新登录',
            duration: 1000,
            forbidClick: true
          });
          // 清除token
          localStorage.removeItem('phoneBook');
          // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
          setTimeout(() => {
            router.replace({
              path: '/login'
            });
          }, 1000);
          break;
        // 404请求不存在
        case 404:
          Message.error(i18n.t('404'))
          setTimeout( ()=> {
            router.replace({
              path: '/404'
            })
          }, 1000)
          break;
        // 其他错误，直接抛出错误提示
        default:
          Message.error(i18n.t('500'))
          router.replace({
            path: '/login'
          });
      }
      return Promise.reject(error.response);
    }
  }
)

export default axios
