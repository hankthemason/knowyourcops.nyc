export class CopAtTimeOfComplaint {
	constructor(db) {
		this.db = db;
	}

	async init() {
		await this.db.run(`CREATE TABLE IF NOT EXISTS cop_at_time_of_complaint (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				cop_id INTEGER NOT NULL,
				complaint_id INTEGER NOT NULL,
				rank TEXT,
				assignment TEXT,
				age INTEGER,
				FOREIGN KEY(cop_id) REFERENCES cops(id),
				FOREIGN KEY(complaint_id) REFERENCES complaints(id)
				UNIQUE(
					cop_id,
					rank,
					assignment, 
					age)
				);`
			)
	}

	async create(cop_at_time_of_complaint) {
		//populate 'cop_at_time_of_complaint' table
		try {
			await this.db.run(`
				INSERT INTO 
					cop_at_time_of_complaint(
						id, 
						cop_id INTEGER NOT NULL, 
						complaint_id INTEGER NOT NULL, 
						rank, 
						assignment, 
						age)
				VALUES(
					NULL, 
					'${cop_at_time_of_complaint.unique_mos_id}', 
					'${cop_at_time_of_complaint.complaint_id}', 
					'${cop_at_time_of_complaint.rank_abbrev_incident}', 
					'${cop_at_time_of_complaint.command_at_incident}', 
					'${cop_at_time_of_complaint.mos_age_incident}')`)
		} catch(error) {
			if (error && !error.message.match(/SQLITE_CONSTRAINT:.*/)) {
				console.log(error.message)
				console.log('error in populating cop_at_time_of_complaint')
				console.log(cop_at_time_of_complaint)
				throw error.message
			}	
		}
	}

	async read() {
		try {
			const result = await this.db.all(`
				SELECT
					*
				FROM
					cop_at_time_of_complaint
				LIMIT
					100
			`)
			return result
		} catch (error) {
			console.error(error);
		}
	}
}