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

	async createFromRecord(record) {
		await this.create(record.command_at_incident)
		await this.create(record.command_now)
	}

	async create(command_unit) {
		//step 1: look at command_at_incident and parse an int (precinct) from it (if it exists)
		const match = command_unit.match(/(.*) (?:PCT)?(?:DET)?$/);
		
		let precinct_id = match && match[1] ? (parseInt(match[1]) || null) : null;
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
					'${command_unit}', 
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
				WHERE
					command_units.unit_id IN (
						SELECT
							a.cop_command_unit
						FROM
							allegations a
					)
				`)
			return result
		} catch (error) {
			console.error(error)
		}
	}

	async read(orderBy, order, page, pageSize) {
		try {
			let offset = pageSize * (page-1)
			const result = await this.db.all(`
				SELECT
				*,
				JSON_GROUP_ARRAY(JSON_OBJECT(
					'American Indian',
					CASE WHEN num_complaints > 4 THEN
					ROUND(american_indian * 1.0 / num_complaints * 100.0, 2) END,
					'Asian',
					CASE WHEN num_complaints > 4 THEN
					ROUND(asian * 1.0 / num_complaints * 100.0, 2) END,
					'Black',
					CASE WHEN num_complaints > 4 THEN
					ROUND(black * 1.0 / num_complaints * 100.0, 2) END,
					'Hispanic',
					CASE WHEN num_complaints > 4 THEN
					ROUND(hispanic * 1.0 / num_complaints * 100.0, 2) END,
					'White',
					CASE WHEN num_complaints > 4 THEN
					ROUND(white * 1.0 / num_complaints * 100.0, 2) END,
					'Other Ethnicity',
					CASE WHEN num_complaints > 4 THEN
					ROUND(other_ethnicity * 1.0 / num_complaints * 100.0, 2) END,
					'Ethnicity Unknown',
					CASE WHEN num_complaints > 4 THEN
					ROUND(ethnicity_unknown * 1.0 / num_complaints * 100.0, 2) END
				)) AS race_percentages,
				JSON_GROUP_ARRAY(JSON_OBJECT(
					'Female',
					CASE WHEN num_complaints > 4 THEN
					ROUND(female * 1.0 / num_complaints * 100.0, 2) END,
					'Male',
					CASE WHEN num_complaints > 4 THEN
					ROUND(male * 1.0 / num_complaints * 100.0, 2) END,
					'Female (trans)',
					CASE WHEN num_complaints > 4 THEN
					ROUND(trans_female * 1.0 / num_complaints * 100.0, 2) END,
					'Male (trans)',
					CASE WHEN num_complaints > 4 THEN
					ROUND(trans_male * 1.0 / num_complaints * 100.0, 2) END,
					'Gender-nonconforming',
					CASE WHEN num_complaints > 4 THEN
					ROUND(gender_non_conforming * 1.0 / num_complaints * 100.0, 2) END,
					'Unknown/refused',
					CASE WHEN num_complaints > 4 THEN
					ROUND(gender_unknown * 1.0 / num_complaints * 100.0, 2) END
				)) AS gender_percentages
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
					COUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%american indian%' THEN complaint_id END) AS american_indian,
					COUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%asian%' THEN complaint_id END) AS asian,
					COUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%black%' THEN complaint_id END) AS black,
					COUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%hispanic%' THEN complaint_id END) AS hispanic,
					COUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%white%' THEN complaint_id END) AS white,
					COUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE 'Other Race' THEN complaint_id END) AS other_ethnicity,
					COUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '' THEN complaint_id END) AS ethnicity_unknown,
					COUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE 'male%' THEN complaint_id END) AS male,
					COUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '%female%' THEN complaint_id END) AS female,
					COUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '%Gender non-conforming%' THEN complaint_id END) AS gender_non_conforming,
					COUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '%Transman%' THEN complaint_id END) AS trans_male,
					COUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '%Transwoman%' THEN complaint_id END) AS trans_female,
					COUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '' THEN complaint_id END) AS gender_unknown,
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
				GROUP BY
					id
				ORDER BY
					${orderBy} ${order}
				LIMIT
					(?)
				OFFSET
					(?)
			`, pageSize, offset)
			result.map(e => {
				e.race_percentages = JSON.parse(e.race_percentages)[0]
				e.gender_percentages = JSON.parse(e.gender_percentages)[0]
			})
			return result
		} catch(error) {
			console.error(error);
		}
	}

	async readAll() {
		try {
			const result = await this.db.all(`
				SELECT
				*,
				JSON_GROUP_ARRAY(JSON_OBJECT(
					'American Indian',
					CASE WHEN num_complaints > 4 THEN
					ROUND(american_indian * 1.0 / num_complaints * 100.0, 2) END,
					'Asian',
					CASE WHEN num_complaints > 4 THEN
					ROUND(asian * 1.0 / num_complaints * 100.0, 2) END,
					'Black',
					CASE WHEN num_complaints > 4 THEN
					ROUND(black * 1.0 / num_complaints * 100.0, 2) END,
					'Hispanic',
					CASE WHEN num_complaints > 4 THEN
					ROUND(hispanic * 1.0 / num_complaints * 100.0, 2) END,
					'White',
					CASE WHEN num_complaints > 4 THEN
					ROUND(white * 1.0 / num_complaints * 100.0, 2) END,
					'Other Ethnicity',
					CASE WHEN num_complaints > 4 THEN
					ROUND(other_ethnicity * 1.0 / num_complaints * 100.0, 2) END,
					'Ethnicity Unknown',
					CASE WHEN num_complaints > 4 THEN
					ROUND(ethnicity_unknown * 1.0 / num_complaints * 100.0, 2) END
				)) AS race_percentages,
				JSON_GROUP_ARRAY(JSON_OBJECT(
					'Female',
					CASE WHEN num_complaints > 4 THEN
					ROUND(female * 1.0 / num_complaints * 100.0, 2) END,
					'Male',
					CASE WHEN num_complaints > 4 THEN
					ROUND(male * 1.0 / num_complaints * 100.0, 2) END,
					'Female (trans)',
					CASE WHEN num_complaints > 4 THEN
					ROUND(trans_female * 1.0 / num_complaints * 100.0, 2) END,
					'Male (trans)',
					CASE WHEN num_complaints > 4 THEN
					ROUND(trans_male * 1.0 / num_complaints * 100.0, 2) END,
					'Gender-nonconforming',
					CASE WHEN num_complaints > 4 THEN
					ROUND(gender_non_conforming * 1.0 / num_complaints * 100.0, 2) END,
					'Unknown/refused',
					CASE WHEN num_complaints > 4 THEN
					ROUND(gender_unknown * 1.0 / num_complaints * 100.0, 2) END
				)) AS gender_percentages
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
					COUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%american indian%' THEN complaint_id END) AS american_indian,
					COUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%asian%' THEN complaint_id END) AS asian,
					COUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%black%' THEN complaint_id END) AS black,
					COUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%hispanic%' THEN complaint_id END) AS hispanic,
					COUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%white%' THEN complaint_id END) AS white,
					COUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE 'Other Race' THEN complaint_id END) AS other_ethnicity,
					COUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '' THEN complaint_id END) AS ethnicity_unknown,
					COUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE 'male%' THEN complaint_id END) AS male,
					COUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '%female%' THEN complaint_id END) AS female,
					COUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '%Gender non-conforming%' THEN complaint_id END) AS gender_non_conforming,
					COUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '%Transman%' THEN complaint_id END) AS trans_male,
					COUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '%Transwoman%' THEN complaint_id END) AS trans_female,
					COUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '' THEN complaint_id END) AS gender_unknown,
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
			`)
			result.map(e => {
				e.race_percentages = JSON.parse(e.race_percentages)[0]
				e.gender_percentages = JSON.parse(e.gender_percentages)[0]
			})
			return result
		} catch(error) {
			console.error(error);
		}
	}

	//method to get command units with no associated complaints
	//these are units that have a cop in the db who *most recently* worked at one of these command units
	//they are entered into the db because a row in the orig csv includes them in the 'command now' category
	async getEmptyCommandUnit(id) {
		try {
			const result = await this.db.all(`
				SELECT
					*
				FROM
					command_units
				WHERE
					command_units.id = ${id}
				`)
			return result
		} catch(error) {
			console.error(error)
		}
	}

	async readCommandUnit(id) {
		try {
			const result = await this.db.all(`
				SELECT
				*,
				CASE WHEN num_complaints > 4 THEN
				ROUND(american_indian * 1.0 / num_complaints * 100.0, 2) END percentage_american_indian_complainants,
				CASE WHEN num_complaints > 4 THEN
				ROUND(asian * 1.0 / num_complaints * 100.0, 2) END percentage_asian_complainants,
				CASE WHEN num_complaints > 4 THEN
				ROUND(black * 1.0 / num_complaints * 100.0, 2) END percentage_black_complainants,
				CASE WHEN num_complaints > 4 THEN
				ROUND(hispanic * 1.0 / num_complaints * 100.0, 2) END percentage_hispanic_complainants,
				CASE WHEN num_complaints > 4 THEN
				ROUND(white * 1.0 / num_complaints * 100.0, 2) END percentage_white_complainants,
				CASE WHEN num_complaints > 4 THEN
				ROUND(other_ethnicity * 1.0 / num_complaints * 100.0, 2) END percentage_other_ethnicity_complainants,
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
					COUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%american indian%' THEN complaint_id END) AS american_indian,
					COUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%asian%' THEN complaint_id END) AS asian,
					COUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%black%' THEN complaint_id END) AS black,
					COUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%hispanic%' THEN complaint_id END) AS hispanic,
					COUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%white%' THEN complaint_id END) AS white,
					COUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE 'Other Race' THEN complaint_id END) AS other_ethnicity,
					COUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '' THEN complaint_id END) AS ethnicity_unknown,
					COUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE 'male%' THEN complaint_id END) AS male,
					COUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '%female%' THEN complaint_id END) AS female,
					COUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '%Gender non-conforming%' THEN complaint_id END) AS gender_non_conforming,
					COUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '%Transman%' THEN complaint_id END) AS trans_male,
					COUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '%Transwoman%' THEN complaint_id END) AS trans_female,
					COUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '' THEN complaint_id END) AS gender_unknown,
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
			if (result[0].id === null) {
				const emptyUnit = await this.getEmptyCommandUnit(id)
				return emptyUnit
			}
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
					id,
					date_received,
					date_closed,
					precinct,
					contact_reason,
					outcome_description,
					COUNT(CASE WHEN a_complaint_id = id THEN 1 END) AS num_allegations_on_complaint,
					JSON_GROUP_ARRAY(JSON_OBJECT('allegation_id',
																				a_id,
																				'complaint_id',
																				a_complaint_id,
																				'cop_command_unit', 
																				a_cop_command_unit,
																				'cop_id',
																				a_cop,
																				'cop_name',
																				cop_name,
																				'precinct',
																				a_precinct,
																				'fado_type',
																				a_fado_type,
																				'description',
																				a_description,
																				'complainant_ethnicity',
																				a_complainant_ethnicity,
																				'complainant_gender',
																				a_complainant_gender,
																				'complainant_age_incident',
																				a_complainant_age_incident,
																				'board_disposition',
																				a_board_disposition)) as allegations
				FROM(
				SELECT 
					complaints.id AS id,
					complaints.date_received AS date_received,
					complaints.date_closed AS date_closed,
					complaints.precinct AS precinct,
					complaints.contact_reason AS contact_reason,
					complaints.outcome_description AS outcome_description,
					a.id AS a_id,
					a.complaint_id AS a_complaint_id,
					a.cop_command_unit AS a_cop_command_unit,
					a.cop AS a_cop,
					c.first_name || ' ' || c.last_name AS cop_name,
					a.precinct AS a_precinct,
					a.fado_type AS a_fado_type,
					a.description AS a_description,
					a.complainant_ethnicity AS a_complainant_ethnicity,
					a.complainant_gender AS a_complainant_gender,
					a.complainant_age_incident AS a_complainant_age_incident,
					a.board_disposition AS a_board_disposition
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
				)
				GROUP BY
					id	
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

	//get all cops who have an allegation against them while working at command_unit.id = id
	async getCops(id) {
		try {
			const results = await this.db.all(`
				SELECT
					first_name,
					last_name,
					cop_id AS id,
					ethnicity,
					gender,
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

	//cops who have command_unit.unit_id = id listed as "rank now"
	async getCopsForCommandUnitWithoutComplaints(id) {
		try {
			const results = await this.db.all(`
				SELECT
					first_name,
					last_name,
					shield_no,
					cop_id AS id,
					ethnicity, 
					gender
				FROM
					(
				SELECT
					command_units.*,
					c.id AS cop_id,
					c.first_name,
					c.last_name,
					c.shield_no,
					c.ethnicity,
					c.gender
				FROM 
					command_units
				JOIN
					cops c
				ON
					c.command_unit = command_units.unit_id
				WHERE
					command_units.id = (?))
				GROUP BY
					cop_id
				`, id)
			return results
		} catch(error) {
			console.error(error)
		}
	}

	//return a list of ONLY command units that have an associated precinct
	//for use with the precincts maps
	async commandUnitsWithPrecincts() {
		try {
			const results = await this.db.all(`
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
					COUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%black%' THEN complaint_id END) AS black,
					COUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%hispanic%' THEN complaint_id END) AS hispanic,
					COUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%asian%' THEN complaint_id END) AS asian,
					COUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%white%' THEN complaint_id END) AS white,
					COUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '' OR complainant_ethnicity LIKE 'Other Race' THEN complaint_id END) AS ethnicity_unknown,
					COUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE 'male%' THEN complaint_id END) AS male,
					COUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '%female%' THEN complaint_id END) AS female,
					COUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '%Gender non-conforming%' THEN complaint_id END) AS gender_non_conforming,
					COUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '%Transman%' THEN complaint_id END) AS trans_male,
					COUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '%Transwoman%' THEN complaint_id END) AS trans_female,
					COUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '' THEN complaint_id END) AS gender_unknown,
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
					typeof(command_units.precinct) = "integer"
				GROUP BY 
					command_units.unit_id
				)
			`)
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