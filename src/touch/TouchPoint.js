import { TouchPhase } from './TouchPhase.js';

const _pointPool = [];

/**
 * @name TouchPoint
 * @class A Touch Point.
 * @description Create a new Touch Point
 */
export class TouchPoint {

	constructor() {
		this.altitudeAngle = Math.PI / 2; // Value of 0 radians indicates that the stylus is parallel to the surface, pi/2 indicates that it is perpendicular.
		this.azimuthAngle = 0; // Value of 0 radians indicates that the stylus is pointed along the x-axis of the device.
		this.deltaPosition = { x: 0, y: 0 }; // The position delta since last change.
		// this.deltaTime = 0; // TODO Amount of time that has passed since the last recorded change in Touch values.
		this.fingerId = 0; // The unique index for the touch.
		this.maximumPossiblePressure = 1.0; // The maximum possible pressure value for a platform. If Input.touchPressureSupported returns false, the value of this property will always be 1.0f.
		this.phase = ""; //	Describes the phase of the touch.
		this.position = { x: 0, y: 0 }; // The position of the touch in pixel coordinates.
		this.pressure = 1.0; //	The current amount of pressure being applied to a touch. 1.0f is considered to be the pressure of an average touch. If Input.touchPressureSupported returns false, the value of this property will always be 1.0f.

		this.radius = { x: 0, y: 0 }; // ADD: different from Unity
		// this.radius = 0; // DELETE: An estimated value of the radius of a touch. Add radiusVariance to get the maximum touch size, subtract it to get the minimum touch size.
		// this.radiusVariance = 0; // DELETE: The amount that the radius varies by for a touch.
		// this.rawPosition = {x: 0, y: 0}; // DELETE: The raw position used for the touch.

		// this.tapCount = 0; // TODO Number of taps.
		this.type = "Direct"; // A value that indicates whether a touch was of Direct, Indirect (or remote), or Stylus type.
	}

	set(touch, phase) {
		this.altitudeAngle = touch.rotationAngle;
		this.azimuthAngle = touch.rotationAngle;

		if (phase === TouchPhase.BEGAN || phase === TouchPhase.STATIONARY) {
			this.deltaPosition.x = 0;
			this.deltaPosition.y = 0;
		} else {
			this.deltaPosition.x = touch.clientX - this.position.x;
			this.deltaPosition.y = touch.clientY - this.position.y;
		}

		// this.deltaTime;
		this.fingerId = touch.identifier;
		this.phase = phase;
		this.position.x = touch.clientX;
		this.position.y = touch.clientY;
		this.pressure = touch.force;
		this.radius.x = touch.radiusX;
		this.radius.y = touch.radiusY;
		// this.tapCount;
	}

	static create() {
		return _pointPool.pop() || new TouchPoint();
	}

	static release(touchPoint) {
		_pointPool.push(touchPoint);
	}

}

