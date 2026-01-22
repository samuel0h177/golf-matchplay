import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { registerSW } from 'virtual:pwa-register'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import { useEventStore } from './stores/eventStore'
import { saveEventState } from './utils/storage'
import './style.css'

registerSW({ immediate: true })

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(vuetify)
app.use(router)

const eventStore = useEventStore(pinia)
eventStore.$subscribe((_, state) => {
  saveEventState(state)
})
app.mount('#app')
