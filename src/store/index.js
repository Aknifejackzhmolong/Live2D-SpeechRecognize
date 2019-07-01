import Vue from 'vue'
import Vuex from 'vuex'
import util from '../utils/helper'

Vue.use(Vuex)

const state = {
  logs: [], // 错误日志
  user: '', // 用户信息{headimgurl,nickname}
  language: 'en',
  // bnOption: { sflag: false, lflag: false, allMaterial: {} },
  records: [{
    type: 1,
    time: util.formatDate.format(new Date(),'yyyy-MM-dd hh:mm:ss'),
    name: '游客',
    content: '你好！'
  }, {
    type: 2,
    time: util.formatDate.format(new Date(),'yyyy-MM-dd hh:mm:ss'),
    name: '客户MM',
    content: '你好！'
    // content: '这里是<a target="_blank" href="https://github.com/taylorchen709/vue-chat">源码</a>'
  }]
}
const getters = {
}
const mutations = {

}

const actions = {
}
export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
