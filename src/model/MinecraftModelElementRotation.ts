import ElementRotationAxis, { ELEMENT_ROTATION_AXIS_VALUES } from '../util/ElementRotationAxis';
import ArrayVector3, { isArrayVector3 } from '../util/ArrayVector3';
import ElementRotationAngle, { ELEMENT_ROTATION_ANGLES } from '../util/ElementRotationAngle';

export function isMinecraftModelElementRotation(
	rotation: any,
): rotation is MinecraftModelElementRotation {
	return (
		rotation &&
		isArrayVector3(rotation.origin) &&
		ELEMENT_ROTATION_ANGLES.includes(rotation.angle) &&
        ELEMENT_ROTATION_AXIS_VALUES.includes(rotation.axis) &&
		(rotation.rescale === undefined || typeof rotation.rescale === 'boolean')
	);
}

interface MinecraftModelElementRotation {
	origin: ArrayVector3;
	angle: ElementRotationAngle;
	axis: ElementRotationAxis;
	rescale?: boolean;
}

export default MinecraftModelElementRotation;