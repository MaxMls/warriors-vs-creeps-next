interface IClickOutsideElement extends HTMLElement {
	clickOutsideDirective: {
		free: () => void
	}
}

export const clickOutsideDirective = {
	mounted: (el: IClickOutsideElement, binding, vnode) => {

		const clickOutsideEvent = (event: Event) => {
			if (!(el == event.target || el.contains(event.target as Node))) {
				console.log(event)
				// vnode.context[binding.expression](event);
				let c = 0
				el.style.opacity = '.2'
				const i = setInterval(() => {
					if (c < 3) {
						el.style.opacity = c % 2 !== 0 ? '.2' : '1'
						c++
					} else {
						el.style.opacity = ''
						clearInterval(i)
					}
				}, 200)
			}
		}

		document.body.addEventListener('click', clickOutsideEvent)

		const free = () => {
			document.body.removeEventListener('click', clickOutsideEvent)
		}

		el.clickOutsideDirective = {free}
	},
	beforeUnmount: (el: IClickOutsideElement, binding, vnode, oldVnode) => {
		el.clickOutsideDirective.free()
	},

}
