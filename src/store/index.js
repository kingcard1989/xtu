// src/store/index.js
import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import enumItem from './modules/enumItem'
import user from './modules/user'
import dialog from './modules/dialog'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    namespaced: true,
    user,
    enumItem,
    dialog
  },
  getters
})