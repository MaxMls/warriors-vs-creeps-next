import split from 'lodash/split'

interface ITyperDirectiveElement extends HTMLElement {
	typerDirective: {
		free: () => void,
		oldValue: string
	}
}

export const typerDirective = {
	updated: (el: ITyperDirectiveElement, binding) => {
		if (el?.typerDirective?.oldValue !== binding.value) {
			el?.typerDirective?.free()


			let i: any = null
			const free = () => {
				if (i !== null) {
					clearInterval(i)
					i = null
				}
			}
			el.innerHTML = ''
			const str = split(binding.value, '')
			i = setInterval(() => {
				if (str.length) {
					el.innerHTML += str.shift()
				} else {
					free()
				}
			}, 7)

			el.typerDirective = {free, oldValue: binding.value}
		}
	},
	beforeUnmount: (el: ITyperDirectiveElement, binding, vnode, oldVnode) => {
		el?.typerDirective?.free()
	},

}
