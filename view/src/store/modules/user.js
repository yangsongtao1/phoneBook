let state = {
  username: '',
  id: '',
  token: '',
}
let getters = {
  username: state => {
    return state.username
  },
  token: state => {
    return state.token
  }
}
let mutations = {
  userNameAdd (state, data) {
    state.username = data
  },
  idAdd (state, data) {
    state.id = data
  },
  tokenAdd (state, data) {
    state.token = data
  }
}
let actions = {
  userNameAddFun (context, data) {
    context.commit('userNameAdd', data)
  },
  idAddFun (context, data) {
    context.commit('idAdd', data)
  },
  tokenAddFun (context, data) {
    context.commit('tokenAdd', data)
  }
}
export default {
  state,
  getters,
  actions,
  mutations
}
