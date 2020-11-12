export class CommandUnits {
	constructor(db) {
		this.db = db;
	}

	async init() {
		await this.db.run(`CREATE TABLE IF NOT EXISTS command_units (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				unit_id TEXT NOT NULL UNIQUE,
				precinct INTEGER,
				FOREIGN KEY(unit_id) REFERENCES cops(command_at_incident),
				FOREIGN KEY(precinct) REFERENCES precincts(id)
				);`
			)
	}

	async create(command_unit) {
		//step 1: look at command_at_incident and parse an int (precinct) from it (if it exists)
		let command = command_unit.command_at_incident;
		const match = command.match(/(.*) (?:PCT)?(?:DET)?$/);
		
		const precinct_id = match && match[1] ? parseInt(match[1]) || null : null;
		//step 2: check precinct table to see if a corresponding row exists yet; 
		//if not, we need to make that row in the precincts table

		//populate 'command_units' table
		try {
			await this.db.run(`
				INSERT INTO 
					command_units(
						id, 
						unit_id, 
						precinct) 
				VALUES(
					NULL, 
					'${command_unit.command_at_incident}', 
					'${precinct_id}')`)
		} catch(error) {
			if (error && !error.message.match(/SQLITE_CONSTRAINT:.*/)) {
				console.log(error.message)
				console.log('error in populating command_units')
				console.log(command_unit)
				throw error.message
			}	
		}
	}

	async total() {
		try {
			const result = await this.db.all(`
				SELECT
					COUNT(*) AS rows
				FROM
					command_units
				`)
			return result
		} catch (error) {
			console.error(error)
		}
	}

	async read(orderBy, order, page, pageSize) {
		console.log(orderBy)
		try {
			let offset = pageSize * (page-1)
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
					command_units.*,
					CASE 
						WHEN COUNT(allegations.id) > 9
						THEN (
						ROUND(COUNT(CASE WHEN allegations.board_disposition LIKE 'Substantiated%' THEN 1 END)*1.0 / COUNT(allegations.id) * 100.0, 2))
					END substantiated_percentage,
					COUNT(allegations.id) AS num_allegations,
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
					command_units
				INNER JOIN 
					allegations
				ON 
					command_units.unit_id = allegations.cop_command_unit
					INNER JOIN
						complaints
					ON
						complaints.id = allegations.complaint_id
				GROUP BY 
					command_units.unit_id
				)
				ORDER BY
					${orderBy} ${order}
				LIMIT
					(?)
				OFFSET
					(?)
			`, pageSize, offset)
			return result
		} catch(error) {
			console.error(error);
		}
	}

	async readCommandUnit(id) {
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
					command_units.*,
					CASE 
						WHEN COUNT(allegations.id) > 9
						THEN (
						ROUND(COUNT(CASE WHEN allegations.board_disposition LIKE 'Substantiated%' THEN 1 END)*1.0 / COUNT(allegations.id) * 100.0, 2))
					END substantiated_percentage,
					COUNT(allegations.id) AS num_allegations,
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
					command_units
				INNER JOIN 
					allegations
				ON 
					command_units.unit_id = allegations.cop_command_unit
					INNER JOIN
						complaints
					ON
						complaints.id = allegations.complaint_id
				WHERE
					command_units.id = (?)
				)
			`, id)
			return result
		} catch(error) {
			console.error(error);
		}
	}

	async getComplaintsByYear(id) {
		try {
			const result = await this.db.all(`
				SELECT
					CAST(year AS INTEGER) AS year,
					COUNT(*) AS count
				FROM
					(
				SELECT
					command_units.*,
					strftime('%Y', complaints.date_received) AS year
				FROM
					command_units
				INNER JOIN
					allegations
				ON 
					command_units.unit_id = allegations.cop_command_unit
					INNER JOIN
						complaints
					ON
						complaints.id = allegations.complaint_id
				WHERE 
					command_units.id = (?)
				GROUP BY
					complaints.id
				)
				GROUP BY
					year
			`, id)
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
																				'cop_id',
																				a.cop,
																				'cop_name',
																				c.first_name || ' ' || c.last_name,
																				'precinct',
																				a.precinct,
																				'fado_type',
																				a.fado_type,
																				'description',
																				a.description,
																				'board_disposition',
																				a.board_disposition)) as allegations
				FROM
					command_units
				JOIN
				 allegations a
				ON
					a.cop_command_unit = command_units.unit_id
					JOIN
						cops c
					ON
						a.cop = c.id
				JOIN
					complaints
				ON
					complaints.id = a.complaint_id
				WHERE
					command_units.id = (?)
				GROUP BY
					complaints.id
			`, id)
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

	async search(searchQuery) {
		try {
			const results = {
				type: 'command_unit',
				identifier: ['command_unit_full', 'unit_id']
			}
			results.results =  await this.db.all(`
					SELECT 
						*
					FROM 
						command_units
					WHERE
						command_unit_full LIKE '%${searchQuery}%'
					OR
						unit_id LIKE '%${searchQuery}%'
					OR
						precinct LIKE '%${searchQuery}%'
			`)
			return results
		} catch(error) {
			console.error(error)
		}
	}

	// SELECT
	// 				cop_id,
	// 				full_name,
	// 				COUNT(*) AS num_allegations,
	// 				COUNT(DISTINCT complaint_id) AS num_complaints
	// 			FROM(
	// 			SELECT
	// 				command_units.*,
	// 				cops.id as cop_id,
	// 				cops.shield_no,
	// 				cops.first_name || ' ' || cops.last_name as full_name,
	// 				cops.rank_abbrev,
	// 				cops.rank_full,
	// 				cops.command_unit AS current_command,
	// 				cops.command_unit_full AS current_command_full,
	// 				cops.ethnicity,
	// 				cops.gender,
	// 				complaints.id AS complaint_id,
	// 				allegations.id AS allegation_id
	// 			FROM 
	// 				command_units
	// 			JOIN
	// 				cop_at_time_of_complaint cop
	// 			ON
	// 				command_units.unit_id = cop.assignment
	// 			JOIN
	// 				cops
	// 			ON
	// 				cop.cop_id = cops.id
	// 			JOIN
	// 				complaints
	// 			ON
	// 				cop.complaint_id = complaints.id
	// 			JOIN
	// 				allegations
	// 			ON
	// 				allegations.complaint_id = complaints.id
	// 			WHERE
	// 				command_units.id = (?)
	// 			)
	// 			GROUP BY
	// 				cop_id
	// 			ORDER BY
	// 				num_allegations DESC
	// 			`


	async getCops(id) {
		try {
			const results = await this.db.all(`
				SELECT
					first_name,
					last_name,
					cop_id AS id,
					ethnicity || ' ' || gender AS cop_details,
					COUNT(*) AS num_allegations,
					COUNT(DISTINCT complaint_id) AS num_complaints
				FROM
					(
				SELECT
					command_units.*,
					cop.*,
					cops.first_name,
					cops.last_name,
					cops.ethnicity,
					cops.gender
				FROM 
					command_units
				JOIN
					cop_at_time_of_complaint cop
				ON
					cop.assignment = command_units.unit_id
				JOIN
					cops
				ON
					cop.cop_id = cops.id
				WHERE
					command_units.id = (?))
				GROUP BY
					cop_id
				ORDER BY
					num_allegations DESC
				`, id)
			return results
		} catch(error) {
			console.error(error)
		}
	}	

	async augment(commandAbbrevs)	{
		try {
			await this.db.run(`
			ALTER TABLE
				command_units
			ADD COLUMN
				command_unit_full TEXT`)
			const results = await this.db.all(`
			SELECT
				*
			FROM 
				command_units`)
			for (const result of results) {
				const cmdUnitFull = commandAbbrevs.find(
					e => e.Abbreviation === result.unit_id)
				if (cmdUnitFull != undefined) {
					this.updateCommandUnitFullColumn(result.id, cmdUnitFull['Command Name'])
				} else {
					this.updateCommandUnitFullColumn(result.id, result.unit_id)
				}
			}
		} catch (error) {
			console.error(error)
		}
	}

	async updateCommandUnitFullColumn(id, cmdUnitFull) {
		try {
			this.db.run(`
				UPDATE 
					command_units
				SET 
					command_unit_full = '${cmdUnitFull}'
				WHERE
					id = ${id}`)
		} catch (error) {
			console.error(error)
		}
	}
}