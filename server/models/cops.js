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
				rank_abbrev TEXT NOT NULL,
				rank_full TEXT NOT NULL,
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
						rank_abbrev,
						rank_full,
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
					'${cop.rank_now}',
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

	async read(orderBy, order, page, pageSize) {
		try {
		const result = await this.db.all(`
			SELECT
				*,
				CASE WHEN num_complaints > 4 THEN
				ROUND(black * 1.0 / num_complaints * 100.0, 2) END percentage_black_complainants,
				CASE WHEN num_complaints > 4 THEN
				ROUND(hispanic * 1.0 / num_complaints * 100.0, 2) END percentage_hispanic_complainants,
				CASE WHEN num_complaints > 4 THEN
				ROUND(asian * 1.0 / num_complaints * 100.0, 2) END percentage_asian_complainants,
				CASE WHEN num_complaints > 4 THEN
				ROUND(white * 1.0 / num_complaints * 100.0, 2) END percentage_white_complainants,
				CASE WHEN num_complaints > 4 THEN
				ROUND(ethnicity_unknown * 1.0 / num_complaints * 100.0, 2) END percentage_ethnicity_unknown_complainants,
				CASE WHEN num_complaints > 4 THEN
				ROUND(male * 1.0 / num_complaints * 100.0, 2) END percentage_male_complainants,
				CASE WHEN num_complaints > 4 THEN
				ROUND(female * 1.0 / num_complaints * 100.0, 2) END percentage_female_complainants,
				CASE WHEN num_complaints > 4 THEN
				ROUND(gender_unknown * 1.0 / num_complaints * 100.0, 2) END percentage_gender_unknown_complainants
			FROM (
			SELECT 
				cops.*,
				CASE 
					WHEN COUNT(allegations.id) > 9
					THEN (
					ROUND(COUNT(CASE WHEN allegations.board_disposition LIKE 'Substantiated%' THEN 1 END)*1.0 / COUNT(allegations.id) * 100.0, 2))
				END substantiated_percentage, 
				COUNT(*) AS num_allegations,
				COUNT(CASE WHEN allegations.board_disposition LIKE 'Substantiated%' THEN 1 END) AS num_substantiated,
				COUNT(DISTINCT CASE WHEN complaints.complainant_ethnicity LIKE '%black%' THEN complaint_id END) AS black,
				COUNT(DISTINCT CASE WHEN complaints.complainant_ethnicity LIKE '%hispanic%' THEN complaint_id END) AS hispanic,
				COUNT(DISTINCT CASE WHEN complaints.complainant_ethnicity LIKE '%asian%' THEN complaint_id END) AS asian,
				COUNT(DISTINCT CASE WHEN complaints.complainant_ethnicity LIKE '%white%' THEN complaint_id END) AS white,
				COUNT(DISTINCT CASE WHEN complaints.complainant_ethnicity LIKE '' OR complainant_ethnicity LIKE 'Other Race' THEN complaint_id END) AS ethnicity_unknown,
				COUNT(DISTINCT CASE WHEN complaints.complainant_gender LIKE 'male%' THEN complaint_id END) AS male,
				COUNT(DISTINCT CASE WHEN complaints.complainant_gender LIKE '%female%' THEN complaint_id END) AS female,
				COUNT(DISTINCT CASE WHEN complaints.complainant_gender LIKE '' THEN complaint_id END) AS gender_unknown,
				COUNT(DISTINCT complaints.id) AS num_complaints
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
			)
			ORDER BY
				${orderBy} ${order}
			LIMIT 
				${pageSize}
			OFFSET
				${pageSize} * (${page} - 1)
		`)
			// console.log('begin reduce')

			// const copsReduced = reduce(result, (accumulator, value) => {
			// 	let tempKey = value.id;
			// 	accumulator[tempKey] = value;
			// 	return accumulator
			// }, {})
			// console.log('end reduce')
			return result

		} catch(error) {
			console.error(error);
		}
	}

	//this is to get the total # of rows in order to 
	//populate the pagination component
	async total() {
		try {
			const result = await this.db.all(`
				SELECT
					COUNT(*) AS rows
				FROM
					cops 
				`)
			return result
		} catch (error) {
			console.error(error)
		}
	}

	async getComplaintsPerDate(id) {
		try {
			const result = await this.db.all(`
				SELECT
					*,
					DATE(date_received) as date_received,
					COUNT(*) as count
				FROM
					(SELECT
						com.*
					FROM
						cops c
					INNER JOIN
						allegations a
					ON
						c.id = a.cop
						INNER JOIN
							complaints com
						ON 
							com.id = a.complaint_id
					WHERE
						c.id = '${id}'
					GROUP BY
						com.id)
				GROUP BY
					date_received
			`)
			return result
		} catch(error) {
			console.error(error)
		}
	}

	async getComplaints(id) {
		try {
			const result = await this.db.all(`
				SELECT
					complaints.*,
					COUNT(CASE WHEN a.complaint_id = complaints.id THEN 1 END) AS num_allegations_on_complaint,
					JSON_GROUP_ARRAY(JSON_OBJECT('allegation_id',
																				a.id,
																				'complaint_id',
																				a.complaint_id,
																				'cop_command_unit', 
																				a.cop_command_unit,
																				'precinct',
																				a.precinct,
																				'fado_type',
																				a.fado_type,
																				'description',
																				a.description,
																				'board_disposition',
																				a.board_disposition)) as allegations
				FROM
					cops
				JOIN
				 allegations a
				ON
					a.cop = cops.id
				JOIN
					complaints
				ON
					complaints.id = a.complaint_id
				WHERE
					cops.id = '${id}'
				GROUP BY
					complaints.id
			`)
			//the allegations propery is not correctly formatted as a JSON object
			result.map(e => {
				e.allegations = JSON.parse(e.allegations)
				e.date_received = new Date(e.date_received + ' 12:00:00 GMT-0400')
				e.date_closed = new Date(e.date_closed + ' 12:00:00 GMT-0400')
			})
			return result
		} catch (error) {
			console.error(error)
		}
	}

	async getComplaintsByYear(id) {
		try {
			// strftime('%Y', date_received) as "Year"
			const result = await this.db.all(`
				SELECT
					CAST(year AS INTEGER) AS year,
					COUNT(*) AS count
				FROM
					(
				SELECT
					cops.*,
					strftime('%Y', complaints.date_received) AS year
				FROM
					cops
				INNER JOIN
					allegations
				ON 
					allegations.cop = cops.id
					INNER JOIN
						complaints
					ON
						complaints.id = allegations.complaint_id
				WHERE 
					cops.id = '${id}'
				GROUP BY
					complaints.id
				)
				GROUP BY
					year
			`)
			return result
		} catch(error) {
			console.error(error)
		}
	}

	//to get the complaints on a cop, we need to do 2 joins
	async getComplaintsComplainants(id) {
		try {
			const result = await this.db.all(`
				SELECT
					COUNT(CASE WHEN complainant_ethnicity LIKE '%BLACK%' THEN 1 END) AS black,
					COUNT(CASE WHEN complainant_ethnicity LIKE '%HISPANIC%' THEN 1 END) AS hispanic,
					COUNT(CASE WHEN complainant_ethnicity LIKE '%WHITE%' THEN 1 END) AS white,
					COUNT(CASE WHEN complainant_ethnicity LIKE '%ASIAN%' THEN 1 END) AS asian,
					COUNT(CASE WHEN complainant_ethnicity LIKE '' OR complainant_ethnicity LIKE 'other race' THEN 1 END) AS ethnicity_unknown,
					COUNT(CASE WHEN complainant_gender LIKE 'MALE%' THEN 1 END) AS male,
					COUNT(CASE WHEN complainant_gender LIKE '%FEMALE%' THEN 1 END) AS female,
					COUNT(CASE WHEN complainant_gender LIKE '' THEN 1 END) AS gender_unknown
				FROM
					(
						SELECT
							com.id,
							com.complainant_ethnicity,
							com.complainant_gender
						FROM
							cops
						INNER JOIN
							allegations
						ON
							allegations.cop = cops.id
						INNER JOIN
							complaints com
						ON
							com.id = allegations.complaint_id
						WHERE
							cops.id = '${id}'
						GROUP BY 
							com.id
					)
				`)
			return result
		} catch (error) {
			console.error(error)
		}
	}

	async getEthnicityAndGenderPercentages() {
		try {
			const result = await this.db.all(`
				SELECT
					cop_id,
					first_name,
					last_name,
					gender,
					num_complaints,
					ROUND(black * 1.0 / num_complaints * 1.0 * 100.0, 2) AS black_percentage,
					ROUND(hispanic * 1.0 / num_complaints * 1.0 * 100.0, 2) AS hispanic_percentage,
					ROUND(white * 1.0 / num_complaints * 1.0 * 100.0, 2) AS white_percentage,
					ROUND(asian * 1.0 / num_complaints * 1.0 * 100.0, 2) AS asian_percentage,
					ROUND(ethnicity_unknown * 1.0 / num_complaints * 1.0 * 100.0, 2) AS ethnicity_unknown_percentage,
					ROUND(male * 1.0 / num_complaints * 1.0 * 100.0, 2) AS male_percentage,
					ROUND(female * 1.0 / num_complaints * 1.0 * 100.0, 2) AS female_percentage,
					ROUND(gender_unknown * 1.0 / num_complaints * 1.0 * 100.0, 2) AS gender_unknown_percentage
				FROM (
					SELECT
						cop_id,
						first_name,
						last_name,
						gender,
						COUNT(*) as num_complaints,
						COUNT(CASE WHEN complainant_ethnicity LIKE '%BLACK%' THEN 1 END) AS black,
						COUNT(CASE WHEN complainant_ethnicity LIKE '%HISPANIC%' THEN 1 END) AS hispanic,
						COUNT(CASE WHEN complainant_ethnicity LIKE '%WHITE%' THEN 1 END) AS white,
						COUNT(CASE WHEN complainant_ethnicity LIKE '%ASIAN%' THEN 1 END) AS asian,
						COUNT(CASE WHEN complainant_ethnicity LIKE '' THEN 1 END) AS ethnicity_unknown,
						COUNT(CASE WHEN complainant_gender LIKE 'MALE%' THEN 1 END) AS male,
						COUNT(CASE WHEN complainant_gender LIKE '%FEMALE%' THEN 1 END) AS female,
						COUNT(CASE WHEN complainant_gender LIKE '' THEN 1 END) AS gender_unknown
						FROM(
							SELECT DISTINCT
								*
							FROM (
								SELECT
									cops.*,
									cops.id as cop_id,
									c.id as complaint_id,
									c.complainant_ethnicity,
									c.complainant_gender
								FROM 
									cops
								INNER JOIN
									allegations a
								ON
									a.cop = cops.id
									INNER JOIN
										complaints c
									ON
										c.id = a.complaint_id)
								)
							GROUP BY 
								cop_id)
				WHERE
					num_complaints > 4
				GROUP BY
					cop_id
			ORDER BY
				female_percentage DESC
				`)
			return result
		} catch (error) {
			console.error(error)
		}
	}

	async getComplaintsLocations(id) {
		try {
			const result = await this.db.all(`
				SELECT
					precinct,
					COUNT(*) as count
				FROM
					(SELECT 
						com.precinct
					FROM
						cops c
					INNER JOIN
						allegations a
					ON
						c.id = a.cop
						INNER JOIN
							complaints com
						ON 
							com.id = a.complaint_id
					WHERE
						c.id = '${id}'
					GROUP BY
						com.id)
				GROUP BY
					precinct
				`)
			return result
		} catch(error) {
			console.error(error)
		}
	}

	async getSubstantiatedPercentage(id) {
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
				WHERE
					cops.id = '${id}'
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

	async readCop(id) {
		console.log('hi')
		try {
			const result = await this.db.all(`
				SELECT
					*,
					CASE WHEN num_complaints > 4 THEN
					ROUND(black * 1.0 / num_complaints * 100.0, 2) END percentage_black_complainants,
					CASE WHEN num_complaints > 4 THEN
					ROUND(hispanic * 1.0 / num_complaints * 100.0, 2) END percentage_hispanic_complainants,
					CASE WHEN num_complaints > 4 THEN
					ROUND(asian * 1.0 / num_complaints * 100.0, 2) END percentage_asian_complainants,
					CASE WHEN num_complaints > 4 THEN
					ROUND(white * 1.0 / num_complaints * 100.0, 2) END percentage_white_complainants,
					CASE WHEN num_complaints > 4 THEN
					ROUND(ethnicity_unknown * 1.0 / num_complaints * 100.0, 2) END percentage_ethnicity_unknown_complainants,
					CASE WHEN num_complaints > 4 THEN
					ROUND(male * 1.0 / num_complaints * 100.0, 2) END percentage_male_complainants,
					CASE WHEN num_complaints > 4 THEN
					ROUND(female * 1.0 / num_complaints * 100.0, 2) END percentage_female_complainants,
					CASE WHEN num_complaints > 4 THEN
					ROUND(gender_unknown * 1.0 / num_complaints * 100.0, 2) END percentage_gender_unknown_complainants
				FROM (
				SELECT 
					cops.*,
					CASE 
						WHEN COUNT(allegations.id) > 9
						THEN (
						ROUND(COUNT(CASE WHEN allegations.board_disposition LIKE 'Substantiated%' THEN 1 END)*1.0 / COUNT(allegations.id) * 100.0, 2))
					END substantiated_percentage, 
					COUNT(*) AS num_allegations,
					COUNT(CASE WHEN allegations.board_disposition LIKE 'Substantiated%' THEN 1 END) AS num_substantiated,
					COUNT(DISTINCT CASE WHEN complaints.complainant_ethnicity LIKE '%black%' THEN complaint_id END) AS black,
					COUNT(DISTINCT CASE WHEN complaints.complainant_ethnicity LIKE '%hispanic%' THEN complaint_id END) AS hispanic,
					COUNT(DISTINCT CASE WHEN complaints.complainant_ethnicity LIKE '%asian%' THEN complaint_id END) AS asian,
					COUNT(DISTINCT CASE WHEN complaints.complainant_ethnicity LIKE '%white%' THEN complaint_id END) AS white,
					COUNT(DISTINCT CASE WHEN complaints.complainant_ethnicity LIKE '' OR complainant_ethnicity LIKE 'Other Race' THEN complaint_id END) AS ethnicity_unknown,
					COUNT(DISTINCT CASE WHEN complaints.complainant_gender LIKE 'male%' THEN complaint_id END) AS male,
					COUNT(DISTINCT CASE WHEN complaints.complainant_gender LIKE '%female%' THEN complaint_id END) AS female,
					COUNT(DISTINCT CASE WHEN complaints.complainant_gender LIKE '' THEN complaint_id END) AS gender_unknown,
					COUNT(DISTINCT complaints.id) AS num_complaints
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
				WHERE
					cops.id = (?)
				)
			`, id)
			// console.log('begin reduce')

			// const copsReduced = reduce(result, (accumulator, value) => {
			// 	let tempKey = value.id;
			// 	accumulator[tempKey] = value;
			// 	return accumulator
			// }, {})
			// console.log('end reduce')
			return result

		} catch(error) {
			console.error(error);
		}
	}

	async readOne(id) {
		try {
			const result = await this.db.get(`
				SELECT 
					cops.*,
					CASE 
						WHEN COUNT(*) > 9
						THEN (
						ROUND(COUNT(CASE WHEN allegations.board_disposition LIKE 'Substantiated%' THEN 1 END)*1.0 / COUNT(*) * 100.0, 2))
						END substantiated_percentage, 
					COUNT(*) AS num_allegations,
					COUNT(CASE WHEN allegations.board_disposition LIKE 'Substantiated%' THEN 1 END) AS num_substantiated,
					COUNT(DISTINCT complaints.id) AS num_complaints
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
				WHERE
					cops.id = ${id}`)
			return result
		} catch(error) {
			console.log(error);
		}
	}

	async search(searchQuery) {
		try {
			return await this.db.all(`
					SELECT 
						*
					FROM 
						cops
					WHERE
						last_name LIKE '%${searchQuery}%'
					OR
						first_name LIKE '%${searchQuery}%'
			`)
		} catch(error) {
			console.error(error)
		}
	}		

	async augment(csvPath, rankAbbrevs) {
		await this.addCommandUnitFullColumn();
		const csv = fs.readFileSync(csvPath);
		const commandCsv = await neatCsv(csv);
		const results = await this.getCopsToUpdate();

		for (const result of results) {
			const cmdUnitFull = commandCsv.find(
				e => e.Abbreviation === result.command_unit)
			if (cmdUnitFull != undefined) {
				this.updateCommandUnitFullColumn(result.id, cmdUnitFull['Command Name'])
			}
		}
	}

	async getCopsToUpdate() {
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