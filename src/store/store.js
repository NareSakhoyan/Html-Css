import Vue from "vue"
import Vuex from "vuex"
import api from '../utils/api'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        isLoading: false,
        dataUrl: '', // e. g. /css/values
        dataArrName: '', // e. g. cssValues
        tagNames: [],
        cssAttributes: [],
        cssValues: [],
        css: [],
        htmlAttributes: [],
        attributeName: [],
        attributeValue: [],
    },
    mutations: {
        setDataUrl(state, payload) {
          state.dataUrl = payload
        },

        setDataArrName(state, payload) {
            state.dataArrName = payload
        },

        async getDataFromApi(state) {
            state.isLoading = true
            let response = await api.get(state.dataUrl)
            state[state.dataArrName] = response.data
            // console.log('Response from store: ', state.dataArrName, response.data)
            state.isLoading = false
        }
    },
    actions: {
        setDataUrl(store, payload) {
            store.commit('setDataUrl',payload)
        },

        setDataArrName(store, payload) {
            store.commit('setDataArrName', payload)
        },

        getDataFromApi() {
            store.commit('getDataFromApi')
        },
    },
    getters: {
        getCode(arrName, attr) {
            console.log((arrName.find(i => i.value == attr))[`id_${arrName}`])
            return (arrName.find(i => i.value == attr))[`id_${arrName}`]
        }
    },
})

export default store