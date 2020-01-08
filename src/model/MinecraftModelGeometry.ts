import GroupedAttributesBuilder from "../util/GroupedAttributesBuilder";
import MinecraftModelFaceName from "./MinecraftModelFaceName";
import ArrayVector4 from "../util/ArrayVector4";
import TextureRotationAngle from "../util/TextureRotationAngle";
import ElementRotationAxis from "../util/ElementRotationAxis";
import { Matrix3, Vector3, BufferGeometry, Float32BufferAttribute, Uint16BufferAttribute } from "three";
import ArrayVector3 from "../util/ArrayVector3";
import MinecraftModelElementRotation from "./MinecraftModelElementRotation";
import MinecraftModel from "./MinecraftModel";

const vertexMaps: {
	[name in MinecraftModelFaceName]: ArrayVector4;
} = {
	west: [0, 1, 2, 3],
	east: [4, 5, 6, 7],
	down: [0, 3, 4, 7],
	up: [2, 1, 6, 5],
	north: [7, 6, 1, 0],
	south: [3, 2, 5, 4],
};

function applyVertexMapRotation(
	rotation: TextureRotationAngle,
	[a, b, c, d]: ArrayVector4,
) {
	return (rotation === 0
		? [a, b, c, d]
		: rotation === 90
		? [b, c, d, a]
		: rotation === 180
		? [c, d, a, b]
		: [d, a, b, c]) as ArrayVector4;
}

function buildMatrix(angle: number, scale: number, axis: ElementRotationAxis) {
	const a = Math.cos(angle) * scale;
	const b = Math.sin(angle) * scale;
	const matrix = new Matrix3();

	if (axis === 'x') {
		matrix.set(1, 0, 0, 0, a, -b, 0, b, a);
	} else if (axis === 'y') {
		matrix.set(a, 0, b, 0, 1, 0, -b, 0, a);
	} else {
		matrix.set(a, -b, 0, b, a, 0, 0, 0, 1);
	}

	return matrix;
}

function rotateCubeCorners(
	corners: ArrayVector3[],
	rotation: MinecraftModelElementRotation,
) {
	const origin = new Vector3().fromArray(rotation.origin).subScalar(8);

	const angle = (rotation.angle / 180) * Math.PI;
	const scale = rotation.rescale
		? Math.SQRT2 / Math.sqrt(Math.cos(angle || Math.PI / 4) ** 2 * 2)
		: 1;
	const matrix = buildMatrix(angle, scale, rotation.axis);

	return corners.map(vertex =>
		new Vector3()
			.fromArray(vertex)
			.sub(origin)
			.applyMatrix3(matrix)
			.add(origin)
			.toArray(),
	) as ArrayVector3[];
}

function getCornerVertices(from: ArrayVector3, to: ArrayVector3) {
	const [x1, y1, z1, x2, y2, z2] = from
		.concat(to)
		.map((coordinate: number) => coordinate - 8);

	return [
		[x1, y1, z1],
		[x1, y2, z1],
		[x1, y2, z2],
		[x1, y1, z2],
		[x2, y1, z2],
		[x2, y2, z2],
		[x2, y2, z1],
		[x2, y1, z1],
	] as ArrayVector3[];
}

function generateDefaultUvs(
	faceName: MinecraftModelFaceName,
	[x1, y1, z1]: ArrayVector3,
	[x2, y2, z2]: ArrayVector3,
) {
	return (faceName === 'west'
		? [z1, 16 - y2, z2, 16 - y1]
		: faceName === 'east'
		? [16 - z2, 16 - y2, 16 - z1, 16 - y1]
		: faceName === 'down'
		? [x1, 16 - z2, x2, 16 - z1]
		: faceName === 'up'
		? [x1, z1, x2, z2]
		: faceName === 'north'
		? [16 - x2, 16 - y2, 16 - x1, 16 - y1]
		: [x1, 16 - y2, x2, 16 - y1]) as ArrayVector4;
}

function computeNormalizedUvs(uvs: ArrayVector4) {
	return uvs.map(
		(coordinate: number, i: number) =>
			(i % 2 ? 16 - coordinate : coordinate) / 16,
	) as ArrayVector4;
}

export class MinecraftModelGeometry extends BufferGeometry {
	constructor(model: MinecraftModel) {
		super();
		const {
			vertices,
			uvs,
			indices,
			groups,
		} = MinecraftModelGeometry.computeAttributes(model);

		this.addAttribute('position', new Float32BufferAttribute(vertices, 3));
		this.addAttribute('uv', new Float32BufferAttribute(uvs, 2));
		this.setIndex(new Uint16BufferAttribute(indices, 1));

		for (const { start, count, materialIndex } of groups)
			this.addGroup(start, count, materialIndex);
	}

	public static computeAttributes(model: MinecraftModel) {
		const builder = new GroupedAttributesBuilder(model.textures);

		for (const element of model.elements) {
			const { from, to, rotation } = element;
			const cornerVertices = getCornerVertices(from, to);
			const rotatedVertices = rotation
				? rotateCubeCorners(cornerVertices, rotation)
				: cornerVertices;

			for (const name in element.faces) {
				const faceName = name as MinecraftModelFaceName;
				const face = element.faces[faceName];

				if (face === undefined) continue;

				const { vertices, uvs, indices } = builder.getContext(
					face.texture,
				);

				const i = vertices.length / 3;
				indices.push(i, i + 2, i + 1);
				indices.push(i, i + 3, i + 2);

				for (const index of applyVertexMapRotation(
					face.rotation || 0,
					vertexMaps[faceName],
				))
					vertices.push(...rotatedVertices[index]);

				const faceUvs =
					face.uv || generateDefaultUvs(faceName, from, to);
				const [u1, v1, u2, v2] = computeNormalizedUvs(faceUvs);

				uvs.push(u1, v2);
				uvs.push(u1, v1);
				uvs.push(u2, v1);
				uvs.push(u2, v2);
			}
		}

		return builder.getAttributes();
	}
}

export default MinecraftModelGeometry;