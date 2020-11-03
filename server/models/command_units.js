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

	async total() {
		try {
			const result = await this.db.all(`
				SELECT
					COUNT(*) AS rows
				FROM
					command_units
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
					${orderBy} ${order}
				LIMIT
					(?)
				OFFSET
					(?)
			`, pageSize, offset)
			return result
		} catch(error) {
			console.error(error);
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