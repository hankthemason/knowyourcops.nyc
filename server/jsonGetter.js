import { augmentGeoJson } from './scripts/augmentGeoJson'
import fs from 'fs'

export const jsonGetter = async (path) => {
	let rawData = fs.readFileSync(path);
	let jsonResult = JSON.parse(rawData);

	jsonResult = augmentGeoJson(jsonResult)

	return jsonResult;
}