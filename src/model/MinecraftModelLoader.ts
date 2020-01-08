import AbstractLoader, { OnProgress, OnError } from "../util/AbstractLoader";
import { FileLoader } from "three";
import MinecraftModelMesh from "./MinecraftModelMesh";

type OnLoad = (mesh: MinecraftModelMesh) => void;

class MinecraftModelLoader extends AbstractLoader {
	public load(
		url: string,
		onLoad?: OnLoad,
		onProgress?: OnProgress,
		onError?: OnError,
	) {
		const loader = new FileLoader(this.manager);
		loader.setPath(this.path);
		loader.setResponseType('json');

		const handleLoad = (model: any) => {
			try {
				const mesh = new MinecraftModelMesh(model);

				if (onLoad) onLoad(mesh);
			} catch (err) {
				if (onError) onError(err);
			}
		};

		loader.load(url, handleLoad, onProgress, onError);
	}
}

export default MinecraftModelLoader;