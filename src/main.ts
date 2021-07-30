import {createApp} from 'vue'
import {createRouter, createWebHistory} from 'vue-router'
import routes from 'virtual:generated-pages'
import App from './App.vue'
import animateScrollTo from "animated-scroll-to";
import 'virtual:svg-icons-register';

const router = createRouter({
	history: createWebHistory(),
	routes,
})


let sumDelta = 0
let startLeft = 0

const app = createApp(App)

const d = app.directive('horizontal-scroll', {
	mounted: (el, binding, vnode, oldVnode) => {
		//	console.log('wheel')
		const wheel = (e) => {
			//if (el.scrollLeft === targetLeft) sumDelta = 0
			if (sumDelta === 0) startLeft = el.scrollLeft
			sumDelta -= e.deltaY
			const maxScrollLeft = el.scrollWidth - el.clientWidth;
			const left = Math.min(maxScrollLeft, Math.max(0, startLeft - sumDelta));
			// targetLeft = left
			// el.scrollTo({left, behavior: "smooth"})
			animateScrollTo([left, null], {
				elementToScroll: el,
			}).then((e) => {
				//if (e !== (el.scrollLeft === left)) console.log(e, el.scrollLeft === left)
				if (e) sumDelta = 0
			})
			if (el.scrollWidth != el.clientWidth)
				e.preventDefault();
		}

		el.addEventListener('wheel', wheel)

		el._onUnbind = () => {
			el.removeEventListener('wheel', wheel)
		}
	},
	beforeUnmount: (el, binding, vnode, oldVnode) => {
		el?.['_onUnbind']?.()
	},
})

app.use(router)

app.mount('#app')
