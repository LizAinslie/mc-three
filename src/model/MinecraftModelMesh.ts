import MinecraftModelMaterial from './MinecraftModelMaterial';
import { Mesh } from 'three';
import MinecraftTexture from '../texture/MinecraftTexture';
import MinecraftModel, { isMinecraftModel } from './MinecraftModel';
import MinecraftModelGeometry from './MinecraftModelGeometry';

type MaterialMapping = { [path: string]: MinecraftModelMaterial };

class MinecraftModelMesh extends Mesh {
	private materialMapping: MaterialMapping;

	constructor(model: MinecraftModel | string | any) {
		if (typeof model === 'string') model = JSON.parse(model);

		if (!isMinecraftModel(model)) throw new Error('Invalid model');

		const geometry = new MinecraftModelGeometry(model);

		const sortedTextures = [
			...new Set(Object.values(model.textures)),
		].sort();
		const mapping: MaterialMapping = {};
		const materials = sortedTextures.map(
			path => (mapping[path] = new MinecraftModelMaterial()),
		);

		super(geometry, [new MinecraftModelMaterial(), ...materials]);

		this.materialMapping = mapping;
	}

	public resolveTextures(resolver: (path: string) => MinecraftTexture) {
		for (const path in this.materialMapping) {
			this.materialMapping[path].map = resolver(path);
		}
	}
}

export default MinecraftModelMesh;
