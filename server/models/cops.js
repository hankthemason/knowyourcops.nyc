import neatCsv from 'neat-csv';
import fs from 'fs';
import { reduce } from 'lodash';
import update from 'immutability-helper';
import { checkOrder, checkOrderBy, checkSearchQuery } from '../scripts/validators'

export class Cops {
	constructor(db) {
		this.db = db;
		this.defaults = {
			order: 'DESC',
			orderBy: 'num_allegations',
			column: 'allegations'
		}
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
				throw error.message
			}
		}		
	}

	async read(orderBy, order, page, pageSize) {
		
		if (checkOrder(order) === false) {
			order = this.defaults.order
		}

		if (checkOrderBy(orderBy) === false) {
			orderBy = this.defaults.orderBy
		}
		
		const offset = pageSize * (page - 1)
		try {
		const result = await this.db.all(`
			SELECT
				*,
				JSON_GROUP_ARRAY(JSON_OBJECT(
					'American Indian',
					CASE WHEN num_allegations > 4 THEN
					ROUND(american_indian * 1.0 / num_allegations * 100.0, 2) END,
					'Asian',
					CASE WHEN num_allegations > 4 THEN
					ROUND(asian * 1.0 / num_allegations * 100.0, 2) END,
					'Black',
					CASE WHEN num_allegations > 4 THEN
					ROUND(black * 1.0 / num_allegations * 100.0, 2) END,
					'Hispanic',
					CASE WHEN num_allegations > 4 THEN
					ROUND(hispanic * 1.0 / num_allegations * 100.0, 2) END,
					'White',
					CASE WHEN num_allegations > 4 THEN
					ROUND(white * 1.0 / num_allegations * 100.0, 2) END,
					'Other Ethnicity',
					CASE WHEN num_allegations > 4 THEN
					ROUND(other_ethnicity * 1.0 / num_allegations * 100.0, 2) END,
					'Ethnicity Unknown',
					CASE WHEN num_allegations > 4 THEN
					ROUND(ethnicity_unknown * 1.0 / num_allegations * 100.0, 2) END
				)) AS race_percentages,
				JSON_GROUP_ARRAY(JSON_OBJECT(
					'Female',
					CASE WHEN num_allegations > 4 THEN
					ROUND(female * 1.0 / num_allegations * 100.0, 2) END,
					'Male',
					CASE WHEN num_allegations > 4 THEN
					ROUND(male * 1.0 / num_allegations * 100.0, 2) END,
					'Female (trans)',
					CASE WHEN num_allegations > 4 THEN
					ROUND(trans_female * 1.0 / num_allegations * 100.0, 2) END,
					'Male (trans)',
					CASE WHEN num_allegations > 4 THEN
					ROUND(trans_male * 1.0 / num_allegations * 100.0, 2) END,
					'Gender-nonconforming',
					CASE WHEN num_allegations > 4 THEN
					ROUND(gender_non_conforming * 1.0 / num_allegations * 100.0, 2) END,
					'Unknown/refused',
					CASE WHEN num_allegations > 4 THEN
					ROUND(gender_unknown * 1.0 / num_allegations * 100.0, 2) END
				)) AS gender_percentages
			FROM (
			SELECT 
				cops.*,
				cmd_units.id AS command_unit_id,
				CASE 
					WHEN COUNT(allegations.id) > 9
					THEN (
					ROUND(COUNT(CASE WHEN allegations.board_disposition LIKE 'Substantiated%' THEN 1 END)*1.0 / COUNT(allegations.id) * 100.0, 2))
				END substantiated_percentage, 
				COUNT(*) AS num_allegations,
				COUNT(CASE WHEN allegations.board_disposition LIKE 'Substantiated%' THEN 1 END) AS num_substantiated,
				COUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%american indian%' THEN allegations.id END) AS american_indian,
				COUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%asian%' THEN allegations.id END) AS asian,
				COUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%black%' THEN allegations.id END) AS black,
				COUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%hispanic%' THEN allegations.id END) AS hispanic,
				COUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%white%' THEN allegations.id END) AS white,
				COUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE 'Other Race' THEN allegations.id END) AS other_ethnicity,
				COUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '' THEN allegations.id END) AS ethnicity_unknown,
				COUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE 'male%' THEN allegations.id END) AS male,
				COUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '%female%' THEN allegations.id END) AS female,
				COUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '%Gender non-conforming%' THEN allegations.id END) AS gender_non_conforming,
				COUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '%Transman%' THEN allegations.id END) AS trans_male,
				COUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '%Transwoman%' THEN allegations.id END) AS trans_female,
				COUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '' THEN allegations.id END) AS gender_unknown,
				COUNT(DISTINCT complaints.id) AS num_complaints
			FROM 
				cops 
			JOIN 
				allegations 
			ON 
				cops.id = allegations.cop
				JOIN
					complaints
				ON 
					complaints.id = allegations.complaint_id 
				JOIN
					command_units cmd_units
				ON
					cops.command_unit = cmd_units.unit_id
			GROUP BY
				cops.id
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

	async readCop(id) {
		try {
			const result = await this.db.get(`
				SELECT
					*,
					ROUND(num_substantiated * 1.0/num_allegations * 100.0, 2) AS substantiated_percentage,
				JSON_OBJECT(
					'American Indian',
					CASE WHEN num_allegations > 4 THEN
					ROUND(american_indian * 1.0 / num_allegations * 100.0, 2) END,
					'Asian',
					CASE WHEN num_allegations > 4 THEN
					ROUND(asian * 1.0 / num_allegations * 100.0, 2) END,
					'Black',
					CASE WHEN num_allegations > 4 THEN
					ROUND(black * 1.0 / num_allegations * 100.0, 2) END,
					'Hispanic',
					CASE WHEN num_allegations > 4 THEN
					ROUND(hispanic * 1.0 / num_allegations * 100.0, 2) END,
					'White',
					CASE WHEN num_allegations > 4 THEN
					ROUND(white * 1.0 / num_allegations * 100.0, 2) END,
					'Other Ethnicity',
					CASE WHEN num_allegations > 4 THEN
					ROUND(other_ethnicity * 1.0 / num_allegations * 100.0, 2) END,
					'Ethnicity Unknown',
					CASE WHEN num_allegations > 4 THEN
					ROUND(ethnicity_unknown * 1.0 / num_allegations * 100.0, 2) END
				) AS race_percentages,
				JSON_OBJECT(
					'Female',
					CASE WHEN num_allegations > 4 THEN
					ROUND(female * 1.0 / num_allegations * 100.0, 2) END,
					'Male',
					CASE WHEN num_allegations > 4 THEN
					ROUND(male * 1.0 / num_allegations * 100.0, 2) END,
					'Female (trans)',
					CASE WHEN num_allegations > 4 THEN
					ROUND(trans_female * 1.0 / num_allegations * 100.0, 2) END,
					'Male (trans)',
					CASE WHEN num_allegations > 4 THEN
					ROUND(trans_male * 1.0 / num_allegations * 100.0, 2) END,
					'Gender-nonconforming',
					CASE WHEN num_allegations > 4 THEN
					ROUND(gender_non_conforming * 1.0 / num_allegations * 100.0, 2) END,
					'Unknown/refused',
					CASE WHEN num_allegations > 4 THEN
					ROUND(gender_unknown * 1.0 / num_allegations * 100.0, 2) END
				) AS gender_percentages
				FROM(
					SELECT 
						cops.*,
						(SELECT 
							COUNT(*) 
						FROM 
							allegations 
						WHERE 
							cops.id = allegations.cop) AS num_allegations,
						(SELECT
							COUNT(DISTINCT complaints.id)
						FROM
							allegations
						INNER JOIN
							complaints
						ON 
							allegations.complaint_id = complaints.id
						WHERE 
							cops.id = allegations.cop AND allegations.complaint_id = complaints.id) AS num_complaints,
						(SELECT
							COUNT(
								CASE WHEN 
									allegations.board_disposition LIKE 'Substantiated%' 
								AND 
									allegations.cop = cops.id THEN 1 END)
						FROM
							allegations) AS num_substantiated,
						(SELECT 
							command_units.id 
						FROM 
							command_units 
						WHERE 
							cops.command_unit = command_units.unit_id) AS command_unit_id,
						(SELECT
							COUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%indian%' THEN allegations.id END)
						FROM
							allegations
						WHERE
							allegations.cop = cops.id) AS american_indian,
						(SELECT
							COUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%asian%' THEN allegations.id END)
						FROM
							allegations
						WHERE
							allegations.cop = cops.id) AS asian,
						(SELECT
							COUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%black%' THEN allegations.id END)
						FROM
							allegations
						WHERE
							allegations.cop = cops.id) AS black,
						(SELECT
							COUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%hispanic%' THEN allegations.id END)
						FROM
							allegations
						WHERE
							allegations.cop = cops.id) AS hispanic,
						(SELECT
							COUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%white%' THEN allegations.id END)
						FROM
							allegations
						WHERE
							allegations.cop = cops.id) AS white,
						(SELECT
							COUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%Other Race%' THEN allegations.id END)
						FROM
							allegations
						WHERE
							allegations.cop = cops.id) AS other_ethnicity,
						(SELECT
							COUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '' THEN allegations.id END)
						FROM
							allegations
						WHERE
							allegations.cop = cops.id) AS ethnicity_unknown,
						(SELECT
							COUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE 'male%' THEN allegations.id END)
						FROM
							allegations
						WHERE
							allegations.cop = cops.id) AS male,
						(SELECT
							COUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '%female%' THEN allegations.id END)
						FROM
							allegations
						WHERE
							allegations.cop = cops.id) AS female,
						(SELECT
							COUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '%Gender non-conforming%' THEN allegations.id END)
						FROM
							allegations
						WHERE
							allegations.cop = cops.id) AS gender_non_conforming,
						(SELECT
							COUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '%Transman%' THEN allegations.id END)
						FROM
							allegations
						WHERE
							allegations.cop = cops.id) AS trans_male,
						(SELECT
							COUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '%Transwoman%' THEN allegations.id END)
						FROM
							allegations
						WHERE
							allegations.cop = cops.id) AS trans_female,
						(SELECT
							COUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '' THEN allegations.id END)
						FROM
							allegations
						WHERE
							allegations.cop = cops.id) AS gender_unknown
					FROM
						cops
					WHERE 
						cops.id = (?)
					)
				`, id)

			if (result !== undefined) {
				result.race_percentages = JSON.parse(result.race_percentages)
				result.gender_percentages = JSON.parse(result.gender_percentages)  
			}
			return result
		} catch(error) {
			console.error(error);
		}
	}

	//this is the original 'readCop' that was returning an object with null values
	async readCopp(id) {
		try {
			const result = await this.db.get(`
				SELECT
					*, 
				JSON_GROUP_ARRAY(JSON_OBJECT(
					'American Indian',
					CASE WHEN num_allegations > 4 THEN
					ROUND(american_indian * 1.0 / num_allegations * 100.0, 2) END,
					'Asian',
					CASE WHEN num_allegations > 4 THEN
					ROUND(asian * 1.0 / num_allegations * 100.0, 2) END,
					'Black',
					CASE WHEN num_allegations > 4 THEN
					ROUND(black * 1.0 / num_allegations * 100.0, 2) END,
					'Hispanic',
					CASE WHEN num_allegations > 4 THEN
					ROUND(hispanic * 1.0 / num_allegations * 100.0, 2) END,
					'White',
					CASE WHEN num_allegations > 4 THEN
					ROUND(white * 1.0 / num_allegations * 100.0, 2) END,
					'Other Ethnicity',
					CASE WHEN num_allegations > 4 THEN
					ROUND(other_ethnicity * 1.0 / num_allegations * 100.0, 2) END,
					'Ethnicity Unknown',
					CASE WHEN num_allegations > 4 THEN
					ROUND(ethnicity_unknown * 1.0 / num_allegations * 100.0, 2) END
				)) AS race_percentages,
				JSON_GROUP_ARRAY(JSON_OBJECT(
					'Female',
					CASE WHEN num_allegations > 4 THEN
					ROUND(female * 1.0 / num_allegations * 100.0, 2) END,
					'Male',
					CASE WHEN num_allegations > 4 THEN
					ROUND(male * 1.0 / num_allegations * 100.0, 2) END,
					'Female (trans)',
					CASE WHEN num_allegations > 4 THEN
					ROUND(trans_female * 1.0 / num_allegations * 100.0, 2) END,
					'Male (trans)',
					CASE WHEN num_allegations > 4 THEN
					ROUND(trans_male * 1.0 / num_allegations * 100.0, 2) END,
					'Gender-nonconforming',
					CASE WHEN num_allegations > 4 THEN
					ROUND(gender_non_conforming * 1.0 / num_allegations * 100.0, 2) END,
					'Unknown/refused',
					CASE WHEN num_allegations > 4 THEN
					ROUND(gender_unknown * 1.0 / num_allegations * 100.0, 2) END
				)) AS gender_percentages
				FROM (
				SELECT 
					cops.*,
					cmd_units.id as command_unit_id,
					CASE 
						WHEN COUNT(allegations.id) > 9
						THEN (
						ROUND(COUNT(CASE WHEN allegations.board_disposition LIKE 'Substantiated%' THEN 1 END)*1.0 / COUNT(allegations.id) * 100.0, 2))
					END substantiated_percentage,
					COUNT(*) AS num_allegations,
					COUNT(CASE WHEN allegations.board_disposition LIKE 'Substantiated%' THEN 1 END) AS num_substantiated,
					COUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%indian%' THEN allegations.id END) AS american_indian,
					COUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%asian%' THEN allegations.id END) AS asian,
					COUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%black%' THEN allegations.id END) AS black,
					COUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%hispanic%' THEN allegations.id END) AS hispanic,
					COUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%white%' THEN allegations.id END) AS white,
					COUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%Other Race%' THEN allegations.id END) AS other_ethnicity,
					COUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '' THEN allegations.id END) AS ethnicity_unknown,
					COUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE 'male%' THEN allegations.id END) AS male,
					COUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '%female%' THEN allegations.id END) AS female,
					COUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '%Gender non-conforming%' THEN allegations.id END) AS gender_non_conforming,
					COUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '%Transman%' THEN allegations.id END) AS trans_male,
					COUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '%Transwoman%' THEN allegations.id END) AS trans_female,
					COUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '' THEN allegations.id END) AS gender_unknown,
					COUNT(DISTINCT complaints.id) AS num_complaints
				FROM 
					cops 
				JOIN 
					allegations 
				ON 
					cops.id = allegations.cop
				JOIN
					complaints
				ON 
					complaints.id = allegations.complaint_id 
				JOIN
					command_units cmd_units
				ON
					cops.command_unit = cmd_units.unit_id
				WHERE
					cops.id = (?)
				)
			`, id)
			result.race_percentages = JSON.parse(result.race_percentages)[0]
			result.gender_percentages = JSON.parse(result.gender_percentages)[0]  
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
						c.id = (?)
					GROUP BY
						com.id)
				GROUP BY
					date_received
			`, id)
			return result
		} catch(error) {
			console.error(error)
		}
	}

	//updated to include join with cop_at_time_of_complaint
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
					cop_rank,
					cop_rank_full,
					cop_command_unit,
					cop_command_unit_full,
					command_unit_id,
					COUNT(CASE WHEN a_complaint_id = id THEN 1 END) AS num_allegations_on_complaint,
					JSON_GROUP_ARRAY(JSON_OBJECT('allegation_id',
																				a_id,
																				'complainant_ethnicity',
																				a_complainant_ethnicity,
																				'complainant_gender',
																				a_complainant_gender,
																				'complainant_age_incident',
																				a_complainant_age_incident,
																				'complaint_id',
																				a_complaint_id,
																				'cop_command_unit', 
																				a_cop_command_unit,
																				'precinct',
																				a_precinct,
																				'fado_type',
																				a_fado_type,
																				'description',
																				a_description,
																				'board_disposition',
																				a_board_disposition)) as allegations
				FROM(
				SELECT
					a.id AS a_id,
					a.cop AS a_cop,
					a.cop_command_unit AS a_cop_command_unit,
					a.precinct AS a_precinct,
					a.complaint_id AS a_complaint_id,
					a.complainant_ethnicity AS a_complainant_ethnicity,
					a.complainant_gender AS a_complainant_gender,
					a.complainant_age_incident AS a_complainant_age_incident,
					a.fado_type AS a_fado_type,
					a.description AS a_description,
					a.board_disposition AS a_board_disposition,
					complaints.id as id,
					complaints.date_received,
					complaints.date_closed,
					complaints.precinct,
					complaints.contact_reason,
					complaints.outcome_description,
					cop.rank AS cop_rank,
					cop.rank_full AS cop_rank_full,
					cop.assignment AS cop_command_unit,
					cop.command_unit_full AS cop_command_unit_full,
					command_units.id AS command_unit_id
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
				JOIN 
					cop_at_time_of_complaint cop 
				ON 
					cop.cop_id = cops.id AND cop.complaint_id = complaints.id
				JOIN
					command_units
				ON
					cop.assignment = command_units.unit_id
				WHERE 
					cops.id = (?)
				GROUP BY
					a.id)
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

	async getYearlyStats(column, id) {
		if (checkOrderBy(column) === false) {
			column = this.defaults.column
		}
		try {
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
					cops.id = (?)
				GROUP BY
					"${column}".id
				)
				GROUP BY
					year
			`, id)
			return result
		} catch (error) {
			console.error(error)
		}
	}

	//returns the total count of *complaints* a cop has in each precinct, 
	//using the complaints.precinct row 
	async getLocationStats(column, id) {
		if (checkOrderBy(column) === false) {
			column = this.defaults.column
		}
		try {
			const result = await this.db.all(`
				SELECT
					precinct,
					COUNT(*) as count
				FROM
					(SELECT 
						complaints.precinct
					FROM
						cops c
					INNER JOIN
						allegations
					ON
						c.id = allegations.cop
						INNER JOIN
							complaints
						ON 
							complaints.id = allegations.complaint_id
					WHERE
						c.id = (?)
					GROUP BY
						${column}.id)
				GROUP BY
					precinct
				`, id)
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
					cops.id = (?)
				GROUP BY 
					cops.id
				ORDER BY
					substantiated_percentage DESC
				`, id)
			console.log(result === null)
			return result
		} catch (error) {
			console.error(error)
		}
	}

	// async readCop(id) {
	// 	try {
	// 		const result = await this.db.all(`
	// 			SELECT
	// 				*,
	// 			CASE WHEN num_complaints > 4 THEN
	// 			ROUND(american_indian * 1.0 / num_complaints * 100.0, 2) END percentage_american_indian_complainants,
	// 			CASE WHEN num_complaints > 4 THEN
	// 			ROUND(asian * 1.0 / num_complaints * 100.0, 2) END percentage_asian_complainants,
	// 			CASE WHEN num_complaints > 4 THEN
	// 			ROUND(black * 1.0 / num_complaints * 100.0, 2) END percentage_black_complainants,
	// 			CASE WHEN num_complaints > 4 THEN
	// 			ROUND(hispanic * 1.0 / num_complaints * 100.0, 2) END percentage_hispanic_complainants,
	// 			CASE WHEN num_complaints > 4 THEN
	// 			ROUND(white * 1.0 / num_complaints * 100.0, 2) END percentage_white_complainants,
	// 			CASE WHEN num_complaints > 4 THEN
	// 			ROUND(other_ethnicity * 1.0 / num_complaints * 100.0, 2) END percentage_other_ethnicity_complainants,
	// 			CASE WHEN num_complaints > 4 THEN
	// 			ROUND(ethnicity_unknown * 1.0 / num_complaints * 100.0, 2) END percentage_ethnicity_unknown_complainants,
	// 			CASE WHEN num_complaints > 4 THEN
	// 			ROUND(male * 1.0 / num_complaints * 100.0, 2) END percentage_male_complainants,
	// 			CASE WHEN num_complaints > 4 THEN
	// 			ROUND(female * 1.0 / num_complaints * 100.0, 2) END percentage_female_complainants,
	// 			CASE WHEN num_complaints > 4 THEN
	// 			ROUND(gender_unknown * 1.0 / num_complaints * 100.0, 2) END percentage_gender_unknown_complainants
	// 			FROM (
	// 			SELECT 
	// 				cops.*,
	// 				cmd_units.id as command_unit_id,
	// 				CASE 
	// 					WHEN COUNT(allegations.id) > 9
	// 					THEN (
	// 					ROUND(COUNT(CASE WHEN allegations.board_disposition LIKE 'Substantiated%' THEN 1 END)*1.0 / COUNT(allegations.id) * 100.0, 2))
	// 				END substantiated_percentage, 
	// 				COUNT(*) AS num_allegations,
	// 				COUNT(CASE WHEN allegations.board_disposition LIKE 'Substantiated%' THEN 1 END) AS num_substantiated,
	// 				COUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%indian%' THEN complaint_id END) AS american_indian,
	// 				COUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%asian%' THEN complaint_id END) AS asian,
	// 				COUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%black%' THEN complaint_id END) AS black,
	// 				COUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%hispanic%' THEN complaint_id END) AS hispanic,
	// 				COUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%white%' THEN complaint_id END) AS white,
	// 				COUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE 'Other Race' THEN complaint_id END) AS other_ethnicity,
	// 				COUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '' THEN complaint_id END) AS ethnicity_unknown,
	// 				COUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE 'male%' THEN complaint_id END) AS male,
	// 				COUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '%female%' THEN complaint_id END) AS female,
	// 				COUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '%Gender non-conforming%' THEN complaint_id END) AS gender_non_conforming,
	// 				COUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '%Transman%' THEN complaint_id END) AS trans_male,
	// 				COUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '%Transwoman%' THEN complaint_id END) AS trans_female,
	// 				COUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '' THEN complaint_id END) AS gender_unknown,
	// 				COUNT(DISTINCT complaints.id) AS num_complaints
	// 			FROM 
	// 				cops 
	// 			JOIN 
	// 				allegations 
	// 			ON 
	// 				cops.id = allegations.cop
	// 				JOIN
	// 					complaints
	// 				ON 
	// 					complaints.id = allegations.complaint_id 
	// 				JOIN
	// 					command_units cmd_units
	// 				ON
	// 					cops.command_unit = cmd_units.unit_id
	// 			WHERE
	// 				cops.id = (?)
	// 			)
	// 		`, id)
	// 		return result

	// 	} catch(error) {
	// 		console.error(error);
	// 	}
	// }

	async search(searchQuery) {
		if (!checkSearchQuery(searchQuery)) {
			console.log('error')
			return 'error'
		}
		let results
		if (searchQuery.includes(' ')) {
			searchQuery = searchQuery.split(' ')
			results = await this.searchFullName(searchQuery)
		} else if (!isNaN(parseInt(searchQuery))) {
			results = await this.searchBadgeNumber(parseInt(searchQuery))
		} else {
			results = await this.searchSingleName(searchQuery)
		}
		return results
	}		

	async searchSingleName(searchQuery) {
		try {
			const results = {
				type: 'cop',
				identifier: ['last_name', 'shield_no'],
				display: ['first_name', 'last_name']
			}
			results.results = await this.db.all(`
					SELECT 
						*
					FROM 
						cops
					WHERE
						last_name LIKE '%${searchQuery}%'
					OR
						first_name LIKE '%${searchQuery}%'
			`)
			return results
		} catch(error) {
			console.error(error)
		}
	}

	async searchBadgeNumber(searchQuery) {
		try {
			const results = {
				type: 'cop',
				identifier: ['last_name', 'shield_no'],
				display: ['first_name', 'last_name']
			}
			results.results = await this.db.all(`
					SELECT 
						*
					FROM 
						cops
					WHERE
						shield_no == (?)
			`, searchQuery)
			return results
		} catch(error) {
			console.error(error)
		}
	}

	async searchFullName(searchQuery) {
		try {
			const results = {
				type: 'cop',
				identifier: ['name'],
				display: ['first_name', 'last_name']
			}
			results.results = await this.db.all(`
					SELECT 
						*
					FROM 
						cops
					WHERE (
						last_name LIKE '%${searchQuery[1]}%'
							OR
						last_name LIKE '%${searchQuery[0]}%'
					)
					AND (
						first_name LIKE '%${searchQuery[0]}%'
					OR
						first_name LIKE '%${searchQuery[1]}%'
					)
			`)
			return results
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