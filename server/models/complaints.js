import { checkOrder, checkOrderBy } from '../scripts/validators'

export class Complaints {
	constructor(db) {
		this.db = db;
		this.defaults = {
			order: 'DESC',
			orderBy: 'num_allegations',
			column: 'allegations'
		}
	}

	async init() {
		await this.db.run(`CREATE TABLE IF NOT EXISTS complaints (
			id INTEGER PRIMARY KEY,
			date_received DATE,
			date_closed DATE,
			precinct INTEGER,
			contact_reason TEXT,
			outcome_description TEXT,
			FOREIGN KEY(precinct) REFERENCES precincts(id)
			);`
		)
	}

	async create(complaint) {
		//populate 'complaints' table
		try {
			let month_received = complaint.month_received;
			month_received = month_received.length < 2 ? month_received.padStart(2, '0') : month_received

			let month_closed = complaint.month_closed;
			month_closed = month_closed.length < 2 ? month_closed.padStart(2, '0') : month_closed
			
			await this.db.run(`
				INSERT INTO 
					complaints(
						id, 
						date_received, 
						date_closed, 
						precinct, 
						contact_reason, 
						outcome_description)
				VALUES(
					'${complaint.complaint_id}', 
					'${complaint.year_received}-${month_received}-01', 
					'${complaint.year_closed}-${month_closed}-01',
					'${complaint.precinct}', 
					'${complaint.contact_reason}', 
					'${complaint.outcome_description}')`)
		} catch(error) {
			if (error && !error.message.match(/SQLITE_CONSTRAINT:.*/)) {
				console.log(error.message)
				console.log('error in populating complaints')
				console.log(complaint)
				throw error.message
			}
		}		
	}

	async read(orderBy, order, page, pageSize) {
		if (!checkOrder(order)) {
			order = this.defaults.order
		}

		if (!checkOrderBy(orderBy)) {
			orderBy = this.defaults.orderBy
		}

		const offset = pageSize * (page - 1)
		
		try {
			//limited for now to ease page loading
			const result = await this.db.all(`
				SELECT
					complaints.*,
					COUNT(*) AS num_allegations,
					JSON_GROUP_ARRAY(JSON_OBJECT('allegation_id',
																				a.id,
																				'complaint_id',
																				a.complaint_id,
																				'cop_full_name',
																				cops.first_name || ' ' || cops.last_name,
																				'cop_id',
																				cops.id,
																				'badge_number',
																				cops.shield_no,
																				'cop_rank_abbrev',
																				cops.rank_abbrev,
																				'cop_rank_full',
																				cops.rank_full,
																				'cop_ethnicity',
																				cops.ethnicity,
																				'cop_gender',
																				cops.gender,
																				'cop_command_unit', 
																				cops.command_unit,
																				'command_unit_id',
																				command_units.id,
																				'fado_type',
																				a.fado_type,
																				'description',
																				a.description,
																				'board_disposition',
																				a.board_disposition)) as allegations
				FROM 
					complaints
				JOIN
					allegations a
				ON
					a.complaint_id = complaints.id
				JOIN
					cops 
				ON
					cops.id = a.cop
				JOIN
					command_units
				ON
					cops.command_unit = command_units.unit_id
				GROUP BY
					complaints.id
				ORDER BY
					${orderBy} ${order}
				LIMIT 
					(?)
				OFFSET
					(?)
			`, pageSize, offset)
			result.map(e => {
				e.allegations = JSON.parse(e.allegations)
			})
			return result
		} catch (error) {
			console.error(error)
		}
	}

	async readComplaint(id) {
		try {
			//limited for now to ease page loading
			const result = await this.db.all(`
				SELECT
					complaints.*,
					COUNT(*) AS num_allegations,
					JSON_GROUP_ARRAY(JSON_OBJECT('allegation_id',
																				a.id,
																				'complaint_id',
																				a.complaint_id,
																				'cop_full_name',
																				cops.first_name || ' ' || cops.last_name,
																				'cop_id',
																				cops.id,
																				'badge_number',
																				cops.shield_no,
																				'cop_rank_abbrev',
																				cops.rank_abbrev,
																				'cop_rank_full',
																				cops.rank_full,
																				'cop_ethnicity',
																				cops.ethnicity,
																				'cop_gender',
																				cops.gender,
																				'cop_command_unit', 
																				cops.command_unit,
																				'command_unit_id',
																				command_units.id,
																				'fado_type',
																				a.fado_type,
																				'description',
																				a.description,
																				'board_disposition',
																				a.board_disposition)) as allegations
				FROM 
					complaints
				JOIN
					allegations a
				ON
					a.complaint_id = complaints.id
				JOIN
					cops 
				ON
					cops.id = a.cop
				JOIN
					command_units
				ON
					cops.command_unit = command_units.unit_id
				WHERE
					complaints.id = (?)
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

	async getCommandUnits(id) {
		try {
			let result = await this.db.all(`
				SELECT
					command_units.id as id,
					command_units.unit_id as unit_id,
					command_units.command_unit_full as command_unit_full
				FROM
					complaints
				JOIN
					command_units
				ON
					complaints.precinct = command_units.precinct
				WHERE
					complaints.id = (?)
			`, id)
			return result
		} catch (error) {
			console.error(error)
		}
	}

	async total() {
		try {
			const result = await this.db.all(`
				SELECT
					COUNT(*) AS rows
				FROM
					complaints 
				`)
			return result
		} catch (error) {
			console.error(error)
		}
	}
}