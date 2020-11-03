import fs from 'fs'
import neatCsv from 'neat-csv'
import { reduce } from 'lodash'

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

	async getRankAbbrevs(csvPath) {
		const csv = fs.readFileSync(csvPath);
		const results = await neatCsv(csv);
		let rankAbbrevs = reduce(results, (accumulator, value) => {
			return {...accumulator, [value.Abbreviation]: value.Rank}
		}, {})
		return rankAbbrevs
	}

	async getCommandAbbrevs(csvPath) {
		const csv = fs.readFileSync(csvPath);
		const commandAbbrevs = await neatCsv(csv);
		return commandAbbrevs
	}
}