import ArrayVector4, { isArrayVector4 } from '../util/ArrayVector4';
import TextureRotationAngle, { TEXTURE_ROTATION_ANGLES } from  '../util/TextureRotationAngle';

interface MinecraftModelFace {
	texture: string;
	uv?: ArrayVector4;
	rotation?: TextureRotationAngle;
}

export function isMinecraftModelFace(face: any): face is MinecraftModelFace {
	return (
		face &&
		typeof face.texture === 'string' &&
		face.texture.length >= 2 &&
		face.texture[0] === '#' &&
		(face.uv === undefined || isArrayVector4(face.uv)) &&
		(face.rotation === undefined || TEXTURE_ROTATION_ANGLES.includes(face.rotation))
	);
}

export default MinecraftModelFace;