export class Precincts {
	constructor(db) {
		this.db = db;
	}

	async init() {
		await this.db.run(`CREATE TABLE IF NOT EXISTS precincts (
				id INTEGER PRIMARY KEY
				);`
			)
	}

	async create(precinct) {
		//populate 'precincts' table
		try {
			if (precinct.precinct !== '') {
				await this.db.run(`INSERT INTO precincts(id) VALUES('${precinct.precinct}')`)
			}
		
		//step 1: look at command_at_incident and parse an int (precinct) from it (if it exists)
					let command = precinct.command_at_incident;
					const match = command.match(/(.*) (?:PCT)?(?:DET)?$/);
					
					const precinct_id = match && match[1] ? parseInt(match[1]) || null : null;
					//step 2: check precinct table to see if a corresponding row exists yet; 
					//				if not, we need to make that row in the precincts table
					
					if (precinct_id) {
						await this.db.run(`
							INSERT OR IGNORE INTO
								precincts(id)
							VALUES
								(${precinct_id})
						`)
					}

		} catch(error) {
			if (error && !error.message.match(/SQLITE_CONSTRAINT:.*/)) {
				console.log(error.message)
				console.log('error in populating precincts')
				console.log(precinct)
				throw error.message
			}
		}

	}
}