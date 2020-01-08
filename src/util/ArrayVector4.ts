type ArrayVector4 = [number, number, number, number];

export function isArrayVector4(arrayVector: any): arrayVector is ArrayVector4 {
	return (
		Array.isArray(arrayVector) &&
		arrayVector.length === 4 &&
		arrayVector.every(coordinate => typeof coordinate === 'number')
	);
}

export default ArrayVector4;