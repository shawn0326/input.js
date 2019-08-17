import { TouchPhase } from './TouchPhase.js';
import { TouchPoint } from './TouchPoint.js';

/**
 * @name Touch
 * @class A Touch Device, bound to a DOM Element.
 * @description Create a new Touch
 * @param {Element} [element] The Element that the touch events are attached to
 */
export class Touch {

	constructor(element) {
		this._touchesMap = {};
		this._touches = [];
		this.touchCount = 0; // the count of touch points

		this._startHandler = this._handleTouchStart.bind(this);
		this._endHandler = this._handleTouchEnd.bind(this);
		this._moveHandler = this._handleTouchMove.bind(this);
		this._cancelHandler = this._handleTouchCancel.bind(this);

		if (element) {
			this.attach(element);
		}
	}

	/**
     * @function
     * @name Touch#attach
     * @description Attach the Touch event handlers to an Element
     * @param {Element} element The element to listen for touch events on.
     */
	attach(element) {
		if (this._element) {
			this.detach();
		}

		this._element = element;

		this._element.addEventListener('touchstart', this._startHandler, false);
		this._element.addEventListener('touchend', this._endHandler, false);
		this._element.addEventListener('touchmove', this._moveHandler, false);
		this._element.addEventListener('touchcancel', this._cancelHandler, false);
	}

	/**
     * @function
     * @name Touch#detach
     * @description Detach the Touch event handlers from the element it is attached to.
     */
	detach() {
		if (this._element) {
			this._element.removeEventListener('touchstart', this._startHandler, false);
			this._element.removeEventListener('touchend', this._endHandler, false);
			this._element.removeEventListener('touchmove', this._moveHandler, false);
			this._element.removeEventListener('touchcancel', this._cancelHandler, false);
		}
		this._element = null;
	}

	/**
     * @function
     * @name Touch#update
     * @description Update method, should be called once per frame
     */
	update() {
		for (let i in this._touchesMap) {
			let touch = this._touchesMap[i];

			if (touch.phase === TouchPhase.BEGAN) {
				touch.phase = TouchPhase.STATIONARY;
			}

			if (touch.phase === TouchPhase.ENDED || touch.phase === TouchPhase.CANCELED) {
				delete this._touchesMap[i];
				let index = this._touches.indexOf(touch);
				if (index > -1) {
					this._touches.splice(index, 1);
				}
				this.touchCount--;
			}
		}
	}

	/**
     * @function
     * @name Touch#getTouch
     * @description get a touch by index
     */
	getTouch(index) {
		return this._touches[index];
	}

	_getTouch(identifier) {
		let touchPoint = this._touchesMap[identifier];
		if (!touchPoint) {
			touchPoint = TouchPoint.create();
			this._touchesMap[identifier] = touchPoint;
			this._touches.push(touchPoint);
			this.touchCount++;
		}

		return touchPoint;
	}

	_handleTouchStart(event) {
		for (let i = 0; i < event.changedTouches.length; i++) {
			let touch = event.changedTouches[i];
			let identifier = touch.identifier;
			let touchPoint = this._getTouch(identifier);

			touchPoint.set(touch, TouchPhase.BEGAN);
		}
	}

	_handleTouchEnd(event) {
		for (let i = 0; i < event.changedTouches.length; i++) {
			let touch = event.changedTouches[i];
			let identifier = touch.identifier;
			let touchPoint = this._getTouch(identifier);

			touchPoint.set(touch, TouchPhase.ENDED);
		}
	}

	_handleTouchMove(event) {
		// call preventDefault to avoid issues in Chrome Android:
		// http://wilsonpage.co.uk/touch-events-in-chrome-android/
		event.preventDefault();

		for (let i = 0; i < event.changedTouches.length; i++) {
			let touch = event.changedTouches[i];
			let identifier = touch.identifier;
			let touchPoint = this._getTouch(identifier);

			touchPoint.set(touch, TouchPhase.MOVED);
		}
	}

	_handleTouchCancel(event) {
		for (let i = 0; i < event.changedTouches.length; i++) {
			let touch = event.changedTouches[i];
			let identifier = touch.identifier;
			let touchPoint = this._getTouch(identifier);

			touchPoint.set(touch, TouchPhase.CANCELED);
		}
	}

}