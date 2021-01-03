import fs from 'fs'

export const jsonGetter = async (path) => {
	let rawData = fs.readFileSync(path);
	let jsonResult = JSON.parse(rawData);
	return jsonResult;
}