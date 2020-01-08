import { Texture, NearestFilter, ImageLoader } from 'three';

export const CHECKERBOARD_IMAGE =
	'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAACXBIWXMAAC4jAAAuIwF4pT92AAAAB3RJTUUH4goSFSEEtucn/QAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAAkSURBVCjPY2TAAX4w/MAqzsRAIhjVQAxgxBXeHAwco6FEPw0A+iAED8NWwMQAAAAASUVORK5CYII=';

class MinecraftTexture extends Texture {
	private _image?: HTMLImageElement;

	constructor(image?: HTMLImageElement) {
		super();
		this.image = image;
		this.magFilter = NearestFilter;
	}

	get image() {
		return this._image;
	}

	set image(value) {
		this._image =
			value && value.width === value.height
				? value
				: new ImageLoader().load(CHECKERBOARD_IMAGE);
		this.needsUpdate = true;
	}
}

export default MinecraftTexture;
