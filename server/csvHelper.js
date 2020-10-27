import fs from 'fs'
import neatCsv from 'neat-csv'

export class CsvHelper {
	
	async getAllegationTypes(csvPath) {
		const csv = fs.readFileSync(csvPath);
		const results = await neatCsv(csv);
		let allegationTypes = []
		for (const result of results) {
			allegationTypes.push(result.['Allegation type'])
		}
		return allegationTypes;
	}
}