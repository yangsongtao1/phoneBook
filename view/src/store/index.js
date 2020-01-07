import Vue from 'vue'
import Vuex from 'vuex'
import VueXAlong from 'vuex-along'

Vue.use(Vuex)

import users from './modules/user'
import phoneEcharts from './modules/phoneEcharts'

export default new Vuex.Store({
  modules:{
    users,
    phoneEcharts
  },
  plugins: [VueXAlong({
    name: 'phoneBook',
    local: { list: [], isFilter: true },
    session: false
  })]
})
