const fs = require('fs')
const neatCsv = require('neat-csv')

const csvPath = './ccrb_data/command_abrevs.csv'

async function getAbrev(abbrev) {
	const csv1 = await fs.readFileSync(csvPath);
	const csv2 = await neatCsv(csv1);
	const result = csv2.filter(d => d.Abbreviation === abbrev)
	return result;
}

module.exports.getAbrev = getAbrev;
