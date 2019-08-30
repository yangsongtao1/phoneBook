import Vue from 'vue';
import iView from 'iview';
import VueI18n from 'vue-i18n';
import en from 'iview/dist/locale/en-US';
import zh from 'iview/dist/locale/zh-CN';
import US from './en-US';
import CN from './zh-CN'

Vue.use(VueI18n);
Vue.locale = () => {};

const messages = {
  en: Object.assign(US, en),
  zh: Object.assign(CN, zh)
};

// Create VueI18n instance with options
const i18n = new VueI18n({
  locale: localStorage.getItem("locale") || 'zh',  // set locale
  messages  // set locale messages
});

Vue.use(iView, {
  i18n: (key, value) => i18n.t(key, value)
})

export default i18n
