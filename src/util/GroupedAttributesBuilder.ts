export interface GroupAttributes {
	vertices: number[];
	uvs: number[];
	indices: number[];
}

class GroupedAttributesBuilder {
	private groups: { [path: string]: GroupAttributes } = {};
	private groupMapping: { [variable: string]: GroupAttributes } = {};
	private missingGroup: GroupAttributes = {
		vertices: [],
		uvs: [],
		indices: [],
	};

	constructor(textures: { [name: string]: string }) {
		for (const texturePath of new Set(Object.values(textures))) {
			this.groups[texturePath] = { vertices: [], uvs: [], indices: [] };
		}

		for (const variable in textures) {
			this.groupMapping['#' + variable] = this.groups[textures[variable]];
		}
	}

	public getContext(textureVariable: string) {
		return this.groupMapping[textureVariable] || this.missingGroup;
	}

	public getAttributes() {
		let { vertices, uvs, indices } = this.missingGroup;
		let indexCount = indices.length;

		const groups = [{ start: 0, count: indexCount, materialIndex: 0 }];

		groups.push(
			...Object.keys(this.groups)
				.sort()
				.map((path, i) => {
					const group = this.groups[path];

					const start = indexCount;
					const count = group.indices.length;
					const offset = vertices.length / 3;

					vertices = vertices.concat(group.vertices);
					uvs = uvs.concat(group.uvs);
					indices = indices.concat(
						group.indices.map(index => index + offset),
					);

					indexCount += count;

					return { start, count, materialIndex: i + 1 };
				}),
		);

		return { vertices, uvs, indices, groups };
	}
}

export default GroupedAttributesBuilder;