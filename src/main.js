import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import Vant from 'vant'
import 'vant/lib/index.css'

const app = createApp(App)
app.use(Vant)
app.use(createPinia())
app.use(router)
app.mount('#app')
