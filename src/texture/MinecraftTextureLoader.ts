import MinecraftTexture from './MinecraftTexture';
import AbstractLoader, { OnProgress, OnError } from '../util/AbstractLoader';
import { ImageLoader } from 'three';

export type OnLoad = (texture: MinecraftTexture) => void;

class MinecraftTextureLoader extends AbstractLoader {
	public crossOrigin = 'anonymous';

	public load(
		url: string,
		onLoad?: OnLoad,
		onProgress?: OnProgress,
		onError?: OnError,
	) {
		const texture = new MinecraftTexture();

		const loader = new ImageLoader(this.manager);
		loader.setCrossOrigin(this.crossOrigin);
		loader.setPath(this.path);

		const handleLoad = (image: HTMLImageElement) => {
			texture.image = image;

			if (onLoad) onLoad(texture);
		};

		loader.load(url, handleLoad, onProgress, onError);

		return texture;
	}

	public setCrossOrigin(value: string) {
		this.crossOrigin = value;
		return this;
	}
}

export default MinecraftTextureLoader;
