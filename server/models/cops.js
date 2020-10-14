import neatCsv from 'neat-csv';
import fs from 'fs';
import { reduce } from 'lodash';
import update from 'immutability-helper';

export class Cops {
	constructor(db) {
		this.db = db;
	}

	async init() {
		await this.db.run(`CREATE TABLE IF NOT EXISTS cops (
				id INTEGER PRIMARY KEY,
				first_name TEXT NOT NULL,
				last_name TEXT NOT NULL,
				command_unit TEXT NOT NULL,
				precinct INTEGER,
				shield_no INTEGER NOT NULL,
				rank TEXT NOT NULL,
				ethnicity TEXT,
				gender TEXT,
				FOREIGN KEY(command_unit) REFERENCES command_units(unit_id),
				FOREIGN KEY(precinct) REFERENCES precincts(id)
				);`
			)
	}

	async create(cop) {

		let command = cop.command_now;
		let match = command.match(/(.*) (?:PCT)?(?:DET)?$/);
		
		const precinct_id = match && match[1] ? parseInt(match[1]) || null : null;
		//populate 'cops' table
		try {
			await this.db.run(`
				INSERT INTO 
					cops(
						id, 
						first_name, 
						last_name, 
						command_unit,
						precinct, 
						shield_no,
						rank, 
						ethnicity, 
						gender )
				VALUES(
					'${cop.unique_mos_id}', 
					'${cop.first_name}', 
					'${cop.last_name}', 
					'${cop.command_now}',
					'${precinct_id}',
					'${cop.shield_no}', 
					'${cop.rank_abbrev_now}', 
					'${cop.mos_ethnicity}',
					'${cop.mos_gender}')`)
		} catch(error) {
			if (error && !error.message.match(/SQLITE_CONSTRAINT:.*/)) {
				console.log(error.message)
				console.log('error in populating cops')
				console.log(cop)
				throw error.message
			}
		}		
	}

	async read() {
		try {
		const result = await this.db.all(`
			SELECT 
				cops.*,
				CASE 
						WHEN COUNT(*) > 9
						THEN (
						ROUND(COUNT(CASE WHEN allegations.board_disposition LIKE 'Substantiated%' THEN 1 END)*1.0 / COUNT(*) * 100.0, 2))
						END substantiated_percentage, 
				Count(*) as num_allegations,
				COUNT(CASE WHEN allegations.board_disposition LIKE 'Substantiated%' THEN 1 END) AS num_substantiated,
				Count(DISTINCT complaints.id) AS num_complaints
			FROM 
				cops 
			INNER JOIN 
				allegations 
			ON 
				cops.id = allegations.cop
				INNER JOIN
					complaints
				ON 
					complaints.id = allegations.complaint_id 
			GROUP BY 
				cops.id 
		`)
			console.log('begin reduce')

			const copsReduced = reduce(result, (accumulator, value) => {
				let tempKey = value.id;
				accumulator[tempKey] = value;
				return accumulator
			}, {})
			console.log('end reduce')
			return copsReduced

		} catch(error) {
			console.error(error);
		}
	}

	async getSubstantiatedPercentage() {
		try {
			const result = await this.db.all(`
				SELECT
					cops.*,
					CASE 
						WHEN COUNT(*) > 9
						THEN (
						COUNT(CASE WHEN allegations.board_disposition LIKE 'Substantiated%' THEN 1 END)*1.0 / COUNT(*) * 100.0)
						END substantiated_percentage,
					COUNT(*) AS num_allegations
				FROM 
					cops
				INNER JOIN
					allegations
				ON
					cops.id = allegations.cop
				GROUP BY 
					cops.id
				ORDER BY
					substantiated_percentage DESC
				`)
			return result
		} catch (error) {
			console.error(error)
		}
	}

	// async getSubstantiatedPercentage() {
	// 	try {
	// 		const result = await this.db.all(`
	// 			SELECT
	// 				cops.*,
	// 				COUNT(CASE WHEN allegations.board_disposition LIKE 'Substantiated%' THEN 1 END)*1.0 / COUNT(*) * 100.0 AS substantiated_percentage,
	// 				COUNT(*) AS num_allegations
	// 			FROM 
	// 				cops
	// 			INNER JOIN
	// 				allegations
	// 			ON
	// 				cops.id = allegations.cop
	// 			GROUP BY 
	// 				cops.id
	// 			HAVING
	// 				COUNT(*) > 9
	// 			ORDER BY
	// 				substantiated_percentage DESC
	// 			`)
	// 		return result
	// 	} catch (error) {
	// 		console.error(error)
	// 	}
	// }

	async readOne(id) {
		try {
			const result = await this.db.get(`
				SELECT 
					*
				FROM 
					cops
				WHERE
					id = ${id}`)
			return result
		} catch(error) {
			console.log(error);
		}
	}

	async augment(csvPath) {
		await this.addCommandUnitFullColumn();
		const csv = fs.readFileSync(csvPath);
		const commandCsv = await neatCsv(csv);
		const results = await this.getCommand();

		for (const result of results) {
			const cmdUnitFull = commandCsv.find(
				e => e.Abbreviation === result.command_unit)
			if (cmdUnitFull != undefined) {
				this.updateCommandUnitFullColumn(result.id, cmdUnitFull['Command Name'])
			}
		}
	}

	async getCommand() {
		const results = await this.db.all(`
			SELECT *
			FROM cops`)
		return results;
	}

	async addCommandUnitFullColumn() {
		this.db.run(`
			ALTER TABLE
				cops
			ADD COLUMN 
				command_unit_full TEXT`)
	}

	async updateCommandUnitFullColumn(id, cmdUnitFull) {
		this.db.run(`
			UPDATE 
				cops 
			SET
				command_unit_full = '${cmdUnitFull}'
			WHERE
				id = ${id}`)
	}
}