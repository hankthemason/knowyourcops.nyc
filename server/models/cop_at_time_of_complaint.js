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
				rank_full TEXT,
				assignment TEXT,
				age INTEGER,
				FOREIGN KEY(cop_id) REFERENCES cops(id),
				FOREIGN KEY(complaint_id) REFERENCES complaints(id)
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
						cop_id, 
						complaint_id,
						rank,
						rank_full, 
						assignment, 
						age)
				VALUES(
					NULL, 
					'${cop_at_time_of_complaint.unique_mos_id}', 
					'${cop_at_time_of_complaint.complaint_id}',
					'${cop_at_time_of_complaint.rank_abbrev_incident}',
					'${cop_at_time_of_complaint.rank_incident}',
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

	async augment(commandAbbrevs)	{
		try {
			await this.db.run(`
			ALTER TABLE
				cop_at_time_of_complaint
			ADD COLUMN
				command_unit_full TEXT`)
			const results = await this.db.all(`
			SELECT
				*
			FROM 
				cop_at_time_of_complaint`)
			for (const result of results) {
				const cmdUnitFull = commandAbbrevs.find(
					e => e.Abbreviation === result.assignment)
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
					cop_at_time_of_complaint
				SET 
					command_unit_full = '${cmdUnitFull}'
				WHERE
					id = ${id}`)
		} catch (error) {
			console.error(error)
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