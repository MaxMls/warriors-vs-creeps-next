import {createApp} from 'vue'
import {createRouter, createWebHistory} from 'vue-router'
import routes from 'virtual:generated-pages'
import App from './App.vue'
import 'virtual:svg-icons-register';
import {createI18n} from "vue-i18n";
import {detectLanguage, loadLocaleMessages} from "./i18n";

const router = createRouter({
	history: createWebHistory(),
	routes,
})


const i18n = createI18n({
	locale:
		localStorage.getItem('lang') ||
		// Detect user's browser language
		detectLanguage() ||
		process.env.VUE_APP_I18N_LOCALE,
	fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
	// Load selected lang's .json file
	messages: loadLocaleMessages()
})

const app = createApp(App)

app.use(router)

app.mount('#app')
