import MinecraftModelElement, { isMinecraftModelElement } from './MinecraftModelElement';

interface MinecraftModel {
	textures: { [name: string]: string };
	elements: MinecraftModelElement[];
}

export function isMinecraftModel(model: any): model is MinecraftModel {
	return (
		model &&
		model.textures &&
		Object.entries(model.textures).every(
			([name, texture]) =>
				typeof name === 'string' && typeof texture === 'string',
		) &&
		Array.isArray(model.elements) &&
		model.elements.every(isMinecraftModelElement)
	);
}

export default MinecraftModel;
