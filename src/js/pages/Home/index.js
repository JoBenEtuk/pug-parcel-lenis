import Page from '../../classes/Page'
import { delay } from '../../utils/math'

export default class extends Page {
	constructor() {
		super({
			classes: {
				active: 'home--active',
			},
			element: '.home',
			elements: {
				wrapper: '.home__wrapper',
			},
		})
	}

	show() {
		this.element.classList.add(this.classes.active)

		return super.show()
	}

	async hide() {
		this.element.classList.remove(this.classes.active)

		await delay(400)

		return super.hide()
	}
}
