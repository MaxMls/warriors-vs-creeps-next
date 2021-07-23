import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import pages from "vite-plugin-pages";

// https://vitejs.dev/config/
export default defineConfig({
	optimizeDeps: { include: ['firebase/app', 'firebase/database'] },
	plugins: [
		vue({}),
		pages({nuxtStyle: true})
	],
	build: {
		sourcemap: true
	},
})
