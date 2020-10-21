export class Complaints {
	constructor(db) {
		this.db = db;
	}

	async init() {
		await this.db.run(`CREATE TABLE IF NOT EXISTS complaints (
			id INTEGER PRIMARY KEY,
			date_received DATE,
			date_closed DATE,
			precinct INTEGER,
			contact_reason TEXT,
			outcome_description TEXT,
			complainant_ethnicity TEXT,
			complainant_gender TEXT,
			complainant_age_incident INTEGER,
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
						outcome_description,  
						complainant_ethnicity,
						complainant_gender, 
						complainant_age_incident)
				VALUES(
					'${complaint.complaint_id}', 
					'${complaint.year_received}-${month_received}-01', 
					'${complaint.year_closed}-${month_closed}-01',
					'${complaint.precinct}', 
					'${complaint.contact_reason}', 
					'${complaint.outcome_description}',
					'${complaint.complainant_ethnicity}', 
					'${complaint.complainant_gender}',
					'${complaint.complainant_age_incident}')`)
		} catch(error) {
			if (error && !error.message.match(/SQLITE_CONSTRAINT:.*/)) {
				console.log(error.message)
				console.log('error in populating complaints')
				console.log(complaint)
				throw error.message
			}
		}		
	}

	async read() {
		try {
			//limited for now to ease page loading
			const result = await this.db.all(`
				SELECT
					complaints.*,
					COUNT(*) AS num_allegations_on_complaint
				FROM 
					complaints
				INNER JOIN
					allegations
				ON
					allegations.complaint_id = complaints.id
				GROUP BY
					complaints.id
				ORDER BY
					num_allegations_on_complaint DESC
			`)
			return result
		} catch (error) {
			console.error(error)
		}
	}
}