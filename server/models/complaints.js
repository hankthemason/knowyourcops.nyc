export class Complaints {
	constructor(db) {
		this.db = db;
	}

	async init() {
		await this.db.run(`CREATE TABLE IF NOT EXISTS complaints (
				id INTEGER PRIMARY KEY,
				date_received TEXT,
				date_closed TEXT,
				precinct INTEGER,
				contact_reason TEXT,
				outcome_description TEXT,
				board_disposition TEXT,
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
			await this.db.run(`INSERT INTO complaints(id, date_received, date_closed, precinct, 
						contact_reason, outcome_description, board_disposition, complainant_ethnicity,
						complainant_gender, complainant_age_incident)
						VALUES('${complaint.complaint_id}', '${complaint.month_received} ${complaint.year_received}', '${complaint.month_closed} ${complaint.year_closed}',
						'${complaint.precinct}', '${complaint.contact_reason}', '${complaint.outcome_description}',
						'${complaint.board_disposition}', '${complaint.complainant_ethnicity}', '${complaint.complainant_gender}',
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
}