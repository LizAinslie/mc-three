type ArrayVector3 = [number, number, number];

export function isArrayVector3(arrayVector: any): arrayVector is ArrayVector3 {
	return (
		Array.isArray(arrayVector) &&
		arrayVector.length === 3 &&
		arrayVector.every(coordinate => typeof coordinate === 'number')
	);
}

export default ArrayVector3;