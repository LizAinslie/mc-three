import ArrayVector3, { isArrayVector3 } from '../util/ArrayVector3';
import MinecraftModelElementRotation, { isMinecraftModelElementRotation } from './MinecraftModelElementRotation';
import MinecraftModelFaceName from './MinecraftModelFaceName';
import MinecraftModelFace, { isMinecraftModelFace } from './MinecraftModelFace';

interface MinecraftModelElement {
	from: ArrayVector3;
	to: ArrayVector3;
	rotation?: MinecraftModelElementRotation;
	faces: { [name in MinecraftModelFaceName]?: MinecraftModelFace };
}

export function isMinecraftModelElement(
	element: any,
): element is MinecraftModelElement {
	let faceCount;

	return (
		element &&
		isArrayVector3(element.from) &&
		isArrayVector3(element.to) &&
		(element.rotation === undefined ||
			isMinecraftModelElementRotation(element.rotation)) &&
		element.faces &&
		(faceCount = Object.keys(element.faces).length) >= 1 &&
		faceCount <= 6 &&
		[
			element.faces.down,
			element.faces.up,
			element.faces.north,
			element.faces.south,
			element.faces.west,
			element.faces.east,
		].every((face: any) => face === undefined || isMinecraftModelFace(face))
	);
}

export default MinecraftModelElement;
