import './assets/scss/all.scss'
import 'bootstrap/dist/js/bootstrap.bundle'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'

import { Field, Form, ErrorMessage, defineRule, configure } from 'vee-validate'
import AllRules from '@vee-validate/rules/dist/vee-validate-rules'
import { localize, setLocale } from '@vee-validate/i18n'
import zh from '@vee-validate/i18n/dist/locale/zh_TW.json'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// loading
app.component('VLoading', Loading)

// vee-validate
app.component('VField', Field)
app.component('VForm', Form)
app.component('ErrorMessage', ErrorMessage)
Object.keys(AllRules).forEach((rule) => {
  defineRule(rule, AllRules[rule])
})
configure({
  generateMessage: localize({ zh_TW: zh })
})
setLocale('zh_TW')

app.mount('#app')
