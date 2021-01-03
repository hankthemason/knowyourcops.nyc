const fs = require('fs')
const neatCsv = require('neat-csv')
const createWriter = require('csv-writer').createObjectCsvWriter;

const writer = createWriter({
	path: '../../ccrb_data/command_abrevs_cleaned.csv',
	header: [
		{ id: 'Abbreviation', title: 'Abbreviation'},
		{ id: 'Command Name', title: 'Command Name'}
	]
})

const commandCsv = '../../ccrb_data/command_abrevs_corrected.csv'

function clean(array) {
	for (const item of array) {
		const match = item.Abbreviation.match(/^(\d+)\s(?:(?:PCT)|(?:DET))$/)
		if (match) {
			let n = match[1]
			let a = item.Abbreviation
			let c = item['Command Name']
			const commandNameNumber = c.match(/^(\d+)\s/)[1]
			if (n != commandNameNumber) {
				item['Command Name'] = `${n} Precinct`
			}
		}
	}
	writer.writeRecords(array)
		.then(() => {
			console.log('...done')
		})
	return array
}

async function getCommandAbbrevs(csvPath) {
		const csv = fs.readFileSync(csvPath);
		const commandAbbrevs = await neatCsv(csv);
		
		clean(commandAbbrevs)
		return commandAbbrevs
}

getCommandAbbrevs(commandCsv)