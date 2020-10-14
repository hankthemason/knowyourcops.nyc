export class Allegations {
	constructor(db) {
		this.db = db;
	}

	async init() {
		await this.db.run(`CREATE TABLE IF NOT EXISTS allegations (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			cop INTEGER,
			cop_command_unit TEXT,
			precinct INTEGER,
			complaint_id INTEGER,
			fado_type TEXT,
			description TEXT,
			board_disposition TEXT,
			FOREIGN KEY(cop) REFERENCES cops(id),
			FOREIGN KEY(cop_command_unit) REFERENCES command_units(unit_id),
			FOREIGN KEY(precinct) REFERENCES precincts(id),
			FOREIGN KEY(complaint_id) REFERENCES complaints(id)
			);`
		)
	}

	async create(allegation) {
		//populate 'allegations' table
		try {
			await this.db.run(`
				INSERT INTO 
					allegations(
						id, 
						cop, 
						cop_command_unit, 
						precinct, 
						complaint_id, 
						fado_type, 
						description,
						board_disposition)
				VALUES(
					NULL, 
					'${allegation.unique_mos_id}', 
					'${allegation.command_at_incident}',
					'${allegation.precinct}', 
					'${allegation.complaint_id}', 
					'${allegation.fado_type}', 
					'${allegation.allegation}',
					'${allegation.board_disposition}')`)
		} catch(error) {
			if (error && !error.message.match(/SQLITE_CONSTRAINT:.*/)) {
				console.log(error.message)
				console.log('error in populating allegations')
				console.log(allegation)
				throw error.message
			}
		}		
	}

	async read() {
		try {
			//right now it's being limited just to ensure that the page
			//loads correctly
			const result = await this.db.all(`
				SELECT 
					*
				FROM 
					allegations
				LIMIT 
					100
				`)
		 	return result
		} catch (error) {
			console.error(error)
		}
	}

	async getSubstantiated(id) {
		try {
			console.log('id: ' + id)
			const result = await this.db.all(`
				SELECT 
					COUNT(*) AS count
				FROM 
					allegations
				WHERE 
					cop = '${id}'
				AND 
					board_disposition LIKE 'Substantiated%'
				`)
			return result
		} catch (error) {
			console.error(error)
		}
	}
}