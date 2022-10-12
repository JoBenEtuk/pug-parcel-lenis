import AutoBind from 'auto-bind'
import each from 'lodash/each'
import Detection from './classes/Detection'
import Preloader from './components/Preloader'

import Home from './pages/Home'
import About from './pages/About'

class App {
	constructor() {
		AutoBind(this)

		this.url = window.location.pathname

		this.mouse = {
			x: window.innerWidth / 2,
			y: window.innerHeight / 2,
		}

		this.createPreloader()
		this.createPages()

		this.addEventListeners()
		this.addLinksEventsListeners()
		this.update()
	}

	createPages() {
		this.home = new Home()
		this.about = new About()
		// this.works = new Works();
		// this.details = new Details();

		this.pages = {
			'/': this.home,
			'/about': this.about,
			//   "/works": this.works,
		}

		if (this.url.includes('/works/')) {
			this.page = this.details
		} else {
			this.page = this.pages[this.url]
		}
	}

	createPreloader() {
		this.preloader = new Preloader()

		this.preloader.once('completed', this.onPreloaded.bind(this))
	}

	onPreloaded() {
		this.preloader.destroy()
		this.page.show(this.url)
	}

	async onChange({ url, push = 'true' }) {
		url = url.replace(window.location.origin, '')

		// await this.transition.show()

		if (push) {
			window.history.pushState({}, '', url)
		}

		this.url = window.location.pathname
		window.scrollTo(0, 0)

		this.page.hide()

		//   this.navigation.onChange(this.url);

		if (this.url.includes('/works/')) {
			this.page = this.details
		} else {
			this.page = this.pages[this.url]
		}

		await this.page.show(this.url)

		// this.transition.hide()
	}

	/**
	 * Events
	 */

	onPopState() {
		this.onChange({
			url: window.location.pathname,
			push: false,
		})
	}

	onTouchMove(event) {
		event.stopPropagation()

		this.mouse.x = event.touches ? event.touches[0].clientX : event.clientX
		this.mouse.y = event.touches ? event.touches[0].clientY : event.clientY

		if (this.page && this.page.onTouchMove) {
			this.page.onTouchMove(event)
		}
	}

	/**
	 * Loop
	 */
	update() {
		if (this.page) {
			this.page.update()
		}

		window.requestAnimationFrame(this.update)
	}

	/**
	 * Listeners
	 */
	addLinksEventsListeners() {
		const links = document.querySelectorAll('a')

		each(links, (link) => {
			const isLocal = link.href.indexOf(window.location.origin) > -1

			if (isLocal) {
				link.onclick = (event) => {
					event.preventDefault()

					this.onChange({
						url: link.href,
					})
				}
			} else if (link.href.indexOf('mailto') === -1 && link.href.indexOf('tel') === -1) {
				link.rel = 'noopener'
				link.target = '_blank'
			}
		})
	}

	addEventListeners() {
		window.addEventListener('popstate', this.onPopState, { passive: true })

		window.addEventListener('mousemove', this.onTouchMove, { passive: true })
		window.addEventListener('touchmove', this.onTouchMove, { passive: true })
	}
}

new App()
