let state = {
  data: []
}
let getters = {
  data: state => {
    return state.data
  }
}
let mutations = {
  dataAdd (state, data) {
    state.data.push(data)
  }
}
let actions = {
  dataAddFun (context, data) {
    context.commit('dataAdd', data)
  }
}
export default {
  state,
  getters,
  actions,
  mutations
}
