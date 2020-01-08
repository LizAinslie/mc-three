# MCThree - Minecraft for Three.js

This repository wouldn't be possible without [this work](https://github.com/vberlier/three-mcmodel). I just expanded on it and made it more stable!

## Basic Usage

**index.html:**
```html
<!-- Found in the /dist folder of this repo -->
<script type='text/javascript' src='/path/to/modelRenderer.js'></script>
<script type='text/javascript' src='/path/to/main.js'></script>
```

**main.js:**
```js
// ...

new MinecraftModelLoader().load('/path/to/model.json', mesh => {
	const textureLoader = new MinecraftTextureLoader();
	mesh.resolveTextures(path =>
		textureLoader.load(`/path/to/assets/minecraft/${path}.png`),
	);
	scene.add(mesh); // scene defined by three.js earlier in code
});

// ...
```

## Advanced Usage
First you will want to extract the Minecraft assets from the latest Minecraft jar. Go ahead and do that then come back. Place them in a subdirectory of your static files root.

**index.html:**
```html
<!-- Same as above -->
```

**main.js:**
```js
// ...

new MinecraftModelLoader().load('/path/to/model.json', mesh => {
	const textureLoader = new MinecraftTextureLoader();
	mesh.resolveTextures(path => {
        let namespace, texture;

        // Check for namespace and default to minecraft: namespace if none is provided.
        if (path.indexOf(':') === -1) {
            namespace = 'minecraft';
            texture = path;
        } else {
            const pathPieces = path.split(/\:/g);
            namespace = pathPieces[0];
            texture = pathPieces[1];
        }

		return textureLoader.load(`/path/to/static/root/mcassets/${namespace}/textures/${texture}.png`),
    });
	scene.add(mesh); // scene defined by three.js earlier in code
});

// ...
```