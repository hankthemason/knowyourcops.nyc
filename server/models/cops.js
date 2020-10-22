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

	async read(orderBy, order, page, pageSize) {
		try {
		const result = await this.db.all(`
			SELECT
				*,
				CASE WHEN num_complaints > 4 THEN
				ROUND(black_complainants * 1.0 / num_complaints * 100.0, 2) END percentage_black_complainants,
				CASE WHEN num_complaints > 4 THEN
				ROUND(hispanic_complainants * 1.0 / num_complaints * 100.0, 2) END percentage_hispanic_complainants,
				CASE WHEN num_complaints > 4 THEN
				ROUND(asian_complainants * 1.0 / num_complaints * 100.0, 2) END percentage_asian_complainants,
				CASE WHEN num_complaints > 4 THEN
				ROUND(white_complainants * 1.0 / num_complaints * 100.0, 2) END percentage_white_complainants,
				CASE WHEN num_complaints > 4 THEN
				ROUND(ethnicity_unknown_complainants * 1.0 / num_complaints * 100.0, 2) END percentage_ethnicity_unknown_complainants,
				CASE WHEN num_complaints > 4 THEN
				ROUND(male_complainants * 1.0 / num_complaints * 100.0, 2) END percentage_male_complainants,
				CASE WHEN num_complaints > 4 THEN
				ROUND(female_complainants * 1.0 / num_complaints * 100.0, 2) END percentage_female_complainants,
				CASE WHEN num_complaints > 4 THEN
				ROUND(gender_unknown_complainants * 1.0 / num_complaints * 100.0, 2) END percentage_gender_unknown_complainants
			FROM (
			SELECT 
				cops.*,
				CASE 
					WHEN COUNT(*) > 9
					THEN (
					ROUND(COUNT(CASE WHEN allegations.board_disposition LIKE 'Substantiated%' THEN 1 END)*1.0 / COUNT(*) * 100.0, 2))
				END substantiated_percentage, 
				COUNT(*) AS num_allegations,
				COUNT(CASE WHEN allegations.board_disposition LIKE 'Substantiated%' THEN 1 END) AS num_substantiated,
				COUNT(DISTINCT CASE WHEN complaints.complainant_ethnicity LIKE '%black%' THEN complaint_id END) AS black_complainants,
				COUNT(DISTINCT CASE WHEN complaints.complainant_ethnicity LIKE '%hispanic%' THEN complaint_id END) AS hispanic_complainants,
				COUNT(DISTINCT CASE WHEN complaints.complainant_ethnicity LIKE '%asian%' THEN complaint_id END) AS asian_complainants,
				COUNT(DISTINCT CASE WHEN complaints.complainant_ethnicity LIKE '%white%' THEN complaint_id END) AS white_complainants,
				COUNT(DISTINCT CASE WHEN complaints.complainant_ethnicity LIKE '' THEN complaint_id END) AS ethnicity_unknown_complainants,
				COUNT(DISTINCT CASE WHEN complaints.complainant_gender LIKE 'male%' THEN complaint_id END) AS male_complainants,
				COUNT(DISTINCT CASE WHEN complaints.complainant_gender LIKE '%female%' THEN complaint_id END) AS female_complainants,
				COUNT(DISTINCT CASE WHEN complaints.complainant_gender LIKE '' THEN complaint_id END) AS gender_unknown_complainants,
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

	async readd() {
		try {
		const result = await this.db.all(`
			SELECT
				*,
				CASE WHEN num_complaints > 4 THEN
				ROUND(black_complainants * 1.0 / num_complaints * 100.0, 2) END percentage_black_complainants,
				CASE WHEN num_complaints > 4 THEN
				ROUND(hispanic_complainants * 1.0 / num_complaints * 100.0, 2) END percentage_hispanic_complainants,
				CASE WHEN num_complaints > 4 THEN
				ROUND(asian_complainants * 1.0 / num_complaints * 100.0, 2) END percentage_asian_complainants,
				CASE WHEN num_complaints > 4 THEN
				ROUND(white_complainants * 1.0 / num_complaints * 100.0, 2) END percentage_white_complainants,
				CASE WHEN num_complaints > 4 THEN
				ROUND(ethnicity_unknown_complainants * 1.0 / num_complaints * 100.0, 2) END percentage_ethnicity_unknown_complainants,
				CASE WHEN num_complaints > 4 THEN
				ROUND(male_complainants * 1.0 / num_complaints * 100.0, 2) END percentage_male_complainants,
				CASE WHEN num_complaints > 4 THEN
				ROUND(female_complainants * 1.0 / num_complaints * 100.0, 2) END percentage_female_complainants,
				CASE WHEN num_complaints > 4 THEN
				ROUND(gender_unknown_complainants * 1.0 / num_complaints * 100.0, 2) END percentage_gender_unknown_complainants
			FROM (
			SELECT 
				cops.*,
				CASE 
					WHEN COUNT(*) > 9
					THEN (
					ROUND(COUNT(CASE WHEN allegations.board_disposition LIKE 'Substantiated%' THEN 1 END)*1.0 / COUNT(*) * 100.0, 2))
				END substantiated_percentage, 
				COUNT(*) AS num_allegations,
				COUNT(CASE WHEN allegations.board_disposition LIKE 'Substantiated%' THEN 1 END) AS num_substantiated,
				COUNT(DISTINCT CASE WHEN complaints.complainant_ethnicity LIKE '%black%' THEN complaint_id END) AS black_complainants,
				COUNT(DISTINCT CASE WHEN complaints.complainant_ethnicity LIKE '%hispanic%' THEN complaint_id END) AS hispanic_complainants,
				COUNT(DISTINCT CASE WHEN complaints.complainant_ethnicity LIKE '%asian%' THEN complaint_id END) AS asian_complainants,
				COUNT(DISTINCT CASE WHEN complaints.complainant_ethnicity LIKE '%white%' THEN complaint_id END) AS white_complainants,
				COUNT(DISTINCT CASE WHEN complaints.complainant_ethnicity LIKE '' THEN complaint_id END) AS ethnicity_unknown_complainants,
				COUNT(DISTINCT CASE WHEN complaints.complainant_gender LIKE 'male%' THEN complaint_id END) AS male_complainants,
				COUNT(DISTINCT CASE WHEN complaints.complainant_gender LIKE '%female%' THEN complaint_id END) AS female_complainants,
				COUNT(DISTINCT CASE WHEN complaints.complainant_gender LIKE '' THEN complaint_id END) AS gender_unknown_complainants,
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
				cops.id)
			ORDER BY
				num_allegations DESC
			LIMIT 
				10
		`)
		
			const map = result.reduce((map, item) => map.set(item.id, item), new Map());
			map.forEach((item, index) => console.log(index, item))

			console.log(map)
			return result[1]


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

	async getComplaints(id) {
		try {
			const result = await this.db.all(`
				SELECT
					DATE(date_received) as date_received,
					COUNT(*) as count
				FROM
					(SELECT 
						com.date_received
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
					COUNT(CASE WHEN complainant_ethnicity LIKE '' THEN 1 END) AS ethnicity_unknown,
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
			// const result = await this.db.all(`
			// 	SELECT
			// 		COUNT(CASE WHEN com.complainant_ethnicity LIKE '%BLACK%' THEN 1 END) AS black,
			// 		COUNT(CASE WHEN com.complainant_ethnicity LIKE '%HISPANIC%' THEN 1 END) AS hispanic,
			// 		COUNT(CASE WHEN com.complainant_ethnicity LIKE '%WHITE%' THEN 1 END) AS white,
			// 		COUNT(CASE WHEN com.complainant_ethnicity LIKE '%ASIAN%' THEN 1 END) AS asian,
			// 		COUNT(CASE WHEN com.complainant_ethnicity LIKE '' THEN 1 END) AS unknown
			// 	FROM
			// 		cops
			// 	INNER JOIN
			// 		allegations
			// 	ON
			// 		allegations.cop = cops.id
			// 		INNER JOIN
			// 			complaints com
			// 		ON
			// 			com.id = allegations.complaint_id
			// 	WHERE
			// 		cops.id = '${id}'
			// 	`)
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

	// async getEthnicityAndGenderPercentages() {
	// 	try {
	// 		const result = await this.db.all(`
	// 			SELECT
	// 				cop_id,
	// 				COUNT(DISTINCT complaint_id) AS complaints,
	// 				COUNT(CASE WHEN complainant_ethnicity LIKE '%BLACK%' THEN 1 END) AS black,
	// 				COUNT(CASE WHEN complainant_ethnicity LIKE '%HISPANIC%' THEN 1 END) AS hispanic,
	// 				COUNT(CASE WHEN complainant_ethnicity LIKE '%WHITE%' THEN 1 END) AS white,
	// 				COUNT(CASE WHEN complainant_ethnicity LIKE '%ASIAN%' THEN 1 END) AS asian,
	// 				COUNT(CASE WHEN complainant_ethnicity LIKE '' THEN 1 END) AS ethnicity_unknown,
	// 				COUNT(CASE WHEN complainant_gender LIKE 'MALE%' THEN 1 END) AS male,
	// 				COUNT(CASE WHEN complainant_gender LIKE '%FEMALE%' THEN 1 END) AS female,
	// 				COUNT(CASE WHEN complainant_gender LIKE '' THEN 1 END) AS gender_unknown
	// 			FROM
	// 			(SELECT
	// 				cops.id as cop_id,
	// 				c.id as complaint_id,
	// 				c.complainant_ethnicity,
	// 				c.complainant_gender
	// 			FROM 
	// 				cops
	// 			INNER JOIN
	// 				allegations a
	// 			ON
	// 				a.cop = cops.id
	// 				INNER JOIN
	// 					complaints c
	// 				ON
	// 					c.id = a.complaint_id
	// 			)
	// 			GROUP BY
	// 				cop_id
	// 			`)
	// 		return result
	// 	} catch (error) {
	// 		console.error(error)
	// 	}
	// }

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