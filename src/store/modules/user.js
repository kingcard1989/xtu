// src/store/modules/user.js
const state = {
  userInfo: {
    stuId: '',
    userHead: '', // 确保初始化 userHead
  },
};

const mutations = {
  SET_USER_INFO(state, userInfo) {
    state.userInfo = userInfo; // 更新用户信息
  },
};

const actions = {
  login({ commit }, userInfo) {
    // 这里可以添加实际的登录逻辑
    commit('SET_USER_INFO', userInfo); // 提交用户信息
  },
};

const getters = {
  userInfo: (state) => state.userInfo, // 获取用户信息
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};