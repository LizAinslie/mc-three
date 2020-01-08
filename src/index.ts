import MinecraftModelLoader from "./model/MinecraftModelLoader";
import MinecraftTextureLoader from "./texture/MinecraftTextureLoader";
import MinecraftTexture from "./texture/MinecraftTexture";

(window as any).MC.MinecraftModelLoader = MinecraftModelLoader;
(window as any).MC.MinecraftTextureLoader = MinecraftTextureLoader;
(window as any).MC.MinecraftTexture = MinecraftTexture;
