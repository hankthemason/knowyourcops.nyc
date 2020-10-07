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

	async read() {
		try {
			const result = await this.db.all(`
				SELECT
					command_units.*,
					COUNT(allegations.id) AS num_allegations,
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
				ORDER BY 
					num_allegations DESC
				`)
			return result
		} catch(error) {
			console.error(error);
		}
	}
}