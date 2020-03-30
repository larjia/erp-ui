import variables from '@/assets/styles/element-variables.scss'
import defaultSettings from '@/settings'

const { showSettings, tagsView, fixedHeader, sidebarLogo, showCaptcha } = defaultSettings

const state = {
  theme: variables.theme,
  showSettings: showSettings,
  tagsView: tagsView,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo,
  showCaptcha: showCaptcha
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    // if (state.hasOwnProperty(key)) {
    // https://stackoverflow.com/questions/39282873/how-do-i-access-the-object-prototype-method-in-the-following-logic
    if (Object.prototype.hasOwnProperty.call(state, key)) {
      state[key] = value
    }
  }
}

const actions = {
  changeSettings ({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
