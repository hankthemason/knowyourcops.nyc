export class Cops {
	constructor(db) {
		this.db = db;
	}

	async init() {
		await this.db.run(`CREATE TABLE IF NOT EXISTS cops (
				id INTEGER PRIMARY KEY,
				first_name TEXT NOT NULL,
				last_name TEXT NOT NULL,
				assignment TEXT NOT NULL,
				shield_no INTEGER NOT NULL,
				rank TEXT NOT NULL,
				ethnicity TEXT,
				gender TEXT,
				precinct INTEGER,
				FOREIGN KEY(precinct) REFERENCES precincts(id)
				);`
			)
	}

	async create(cop) {
		//populate 'cops' table
		try {
			await this.db.run(`
				INSERT INTO 
					cops(
						id, 
						first_name, 
						last_name, 
						assignment, 
						shield_no,
						rank, 
						ethnicity, 
						gender, 
						precinct)
				VALUES(
					'${cop.unique_mos_id}', 
					'${cop.first_name}', 
					'${cop.last_name}', 
					'${cop.command_now}',
					'${cop.shield_no}', 
					'${cop.rank_abbrev_now}', 
					'${cop.mos_ethnicity}',
					'${cop.mos_gender}', 
					'${cop.precinct}')`)
			} catch(error) {
				if (error && !error.message.match(/SQLITE_CONSTRAINT:.*/)) {
					console.log(error.message)
					console.log('error in populating cops')
					console.log(cop)
					throw error.message
			}
		}		
	}

	async read() {
		try {
		//db.all(`SELECT cops.*, Count(allegations.complaint) as num_allegations FROM cops INNER JOIN complaints ON cops.id = complaints.cop INNER JOIN allegations ON allegations.complaint = complaints.id GROUP BY cops.id`, (err, row) => {
		const result = await this.db.all(`
			SELECT 
				cops.*, 
				Count(*) as num_allegations 
			FROM 
				cops 
			INNER JOIN 
				allegations 
			ON 
				cops.id = allegations.cop 
			GROUP BY 
				cops.id 
			ORDER BY 
				num_allegations DESC;
		`)
			return result
		} catch(error) {
			console.error(error);
		}
	}
}