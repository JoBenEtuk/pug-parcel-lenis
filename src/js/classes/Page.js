import AutoBind from 'auto-bind'
import Lenis from '@studio-freight/lenis'

export default class Page {
	constructor({ classes, element, elements }) {
		AutoBind(this)

		this.classes = {
			...classes,
		}

		this.selector = element
		this.selectorChildren = { ...elements }
		this.create()
	}

	scroll() {
		const lenis = new Lenis({
			duration: 1.2,
			easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
			direction: 'vertical',
			gestureDirection: 'vertical',
			smooth: true,
			smoothTouch: false,
			touchMultiplier: 2,
		})

		function raf(time) {
			lenis.raf(time)
			requestAnimationFrame(raf)
		}

		requestAnimationFrame(raf)
	}

	create() {
		if (this.selector instanceof HTMLElement) {
			this.element = this.selector
		} else {
			this.element = document.querySelector(this.selector)
		}

		this.elements = {}

		Object.keys(this.selectorChildren).forEach((key) => {
			const entry = this.selectorChildren[key]

			if (
				entry instanceof HTMLElement ||
				entry instanceof NodeList ||
				Array.isArray(entry)
			) {
				this.elements[key] = entry
			} else {
				this.elements[key] = this.element.querySelectorAll(entry)

				if (this.elements[key].length === 0) {
					this.elements[key] = null
				} else if (this.elements[key].length === 1) {
					this.elements[key] = this.element.querySelector(entry)
				}
			}
		})

		this.scroll()
	}

	show() {
		return Promise.resolve()
	}

	hide() {
		return Promise.resolve()
	}

	onTouchMove(event) {
		const y = event.touches ? event.touches[0].clientY : event.clientY
	}

	update() {}
}
