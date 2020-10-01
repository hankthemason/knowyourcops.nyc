const express = require('express')
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
//const csv = require('csv-parser');
const neatCsv = require('neat-csv');
const csv = fs.readFileSync('data.csv');
const DB_PATH = './db/ccrb.db';
//const hi = require('./hello')

const sqlite = require('sqlite');

//hi.hello();

//declare db in the global namespace
let db;


// this is a top-level await 
(async () => {
    // open the database
    db = await sqlite.open({
      filename: DB_PATH,
      driver: sqlite3.Database
    })
    console.log('it opened')
    //await initializeDB(db);





const app = express()
const port = 3001

async function initializeDB(db) {
		try {
			//await db.run(`DROP TABLE precincts`)

			await db.run(`CREATE TABLE IF NOT EXISTS precincts (
				id INTEGER PRIMARY KEY
				);`)

			//await db.run(`DROP TABLE cops`)

			await db.run(`CREATE TABLE IF NOT EXISTS cops (
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

			//await db.run(`DROP TABLE complaints`)

			await db.run(`CREATE TABLE IF NOT EXISTS complaints (
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

		//await db.run(`DROP TABLE command_units`)

		await	db.run(`CREATE TABLE IF NOT EXISTS command_units (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				unit_id TEXT NOT NULL UNIQUE,
				precinct INTEGER,
				FOREIGN KEY(unit_id) REFERENCES cops(command_at_incident),
				FOREIGN KEY(precinct) REFERENCES precincts(id)
				);`
			)

		//await db.run(`DROP TABLE allegations`)

		await	db.run(`CREATE TABLE IF NOT EXISTS allegations (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				cop INTEGER,
				cop_command_unit TEXT,
				precinct INTEGER,
				complaint_id INTEGER,
				fado_type TEXT,
				description TEXT,
				FOREIGN KEY(cop) REFERENCES cops(id),
				FOREIGN KEY(cop_command_unit) REFERENCES command_units(unit_id),
				FOREIGN KEY(precinct) REFERENCES precincts(id),
				FOREIGN KEY(complaint_id) REFERENCES complaints(id)
				);`
			)

		//await	db.run(`DROP TABLE cop_at_time_of_complaint`)

		await	db.run(`CREATE TABLE IF NOT EXISTS cop_at_time_of_complaint (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				cop_id INTEGER NOT NULL,
				complaint_id INTEGER NOT NULL,
				rank TEXT,
				assignment TEXT,
				age INTEGER,
				FOREIGN KEY(cop_id) REFERENCES cops(id),
				FOREIGN KEY(complaint_id) REFERENCES complaints(id)
				);`
			)
	} catch(error) {
		console.error(error)
		throw error
	}

		async function main() {
			const result = await neatCsv(csv);
				for (const e of result) {
					//populate 'precincts' table
					try {
						if (e.precinct !== '') {
							await db.run(`INSERT INTO precincts(id) VALUES('${e.precinct}')`)
						}
					} catch(error) {
						if (error && !error.message.match(/SQLITE_CONSTRAINT:.*/)) {
							console.log(error.message)
							console.log('error in populating precincts')
							console.log(e)
							throw error.message
						}
					}
					
					//populate 'cops' table
					try {
						await db.run(`INSERT INTO cops(id, first_name, last_name, assignment, shield_no,
								rank, ethnicity, gender, precinct)
								VALUES('${e.unique_mos_id}', '${e.first_name}', '${e.last_name}', '${e.command_now}',
								'${e.shield_no}', '${e.rank_abbrev_now}', '${e.mos_ethnicity}',
								'${e.mos_gender}', '${e.precinct}')`)
					} catch(error) {
						if (error && !error.message.match(/SQLITE_CONSTRAINT:.*/)) {
							console.log(error.message)
							console.log('error in populating cops')
							console.log(e)
							throw error.message
						}
					}


					//populate 'complaints' table
					try {
						await db.run(`INSERT INTO complaints(id, date_received, date_closed, precinct, 
									contact_reason, outcome_description, board_disposition, complainant_ethnicity,
									complainant_gender, complainant_age_incident)
									VALUES('${e.complaint_id}', '${e.month_received} ${e.year_received}', '${e.month_closed} ${e.year_closed}',
									'${e.precinct}', '${e.contact_reason}', '${e.outcome_description}',
									'${e.board_disposition}', '${e.complainant_ethnicity}', '${e.complainant_gender}',
									'${e.complainant_age_incident}')`)
					} catch(error) {
						if (error && !error.message.match(/SQLITE_CONSTRAINT:.*/)) {
							console.log(error.message)
							console.log('error in populating complaints')
							console.log(e)
							throw error.message
						}
					}

					//populate 'allegations' table
					try {
						await db.run(`INSERT INTO allegations(id, cop, cop_command_unit, precinct, complaint_id, fado_type, description)
									VALUES (NULL, '${e.unique_mos_id}', '${e.command_at_incident}','${e.precinct}', '${e.complaint_id}', 
									'${e.fado_type}', '${e.allegation}')`)
					} catch(error) {
						if (error && !error.message.match(/SQLITE_CONSTRAINT:.*/)) {
							console.log(error.message)
							console.log('error in populating allegations')
							console.log(e)
							throw error.message
						}
					}
					
					//step 1: look at command_at_incident and parse an int (precinct) from it (if it exists)
					let command = e.command_at_incident;
					const match = command.match(/(.*) (?:PCT)?(?:DET)?$/);
					
					const precinct_id = match && match[1] ? parseInt(match[1]) || null : null;
					//step 2: check precinct table to see if a corresponding row exists yet; 
					//				if not, we need to make that row in the precincts table
					
					if (precinct_id) {
						await db.run(`
							INSERT OR IGNORE INTO
								precincts(id)
							VALUES
								(${precinct_id})
						`)
					}

					//populate 'command_units' table
					try {
						await db.run(`INSERT INTO command_units(id, unit_id, precinct) VALUES (NULL, '${e.command_at_incident}', '${precinct_id}')`)
					} catch(error) {
						if (error && !error.message.match(/SQLITE_CONSTRAINT:.*/)) {
							console.log(error.message)
							console.log('error in populating command_units')
							console.log(e)
							throw error.message
						}	
					}
					
					//populate 'cop_at_time_of_complaint' table
					try {
						await db.run(`INSERT INTO cop_at_time_of_complaint(id, cop_id, complaint_id, rank, assignment, age)
									VALUES(NULL, '${e.unique_mos_id}', '${e.complaint_id}', '${e.rank_abbrev_incident}', 
									'${e.command_at_incident}', '${e.mos_age_incident}')`)
					} catch(error) {
						if (error && !error.message.match(/SQLITE_CONSTRAINT:.*/)) {
							console.log(error.message)
							console.log('error in populating cop_at_time_of_complaint')
							console.log(e)
							throw error.message
						}	
					}
				//maybe delete?  this is just vis confirmation
				//process.stdout.write('.')
			}
		}

		await main();
		console.log('done being built')

}


// let db = new sqlite3.Database(DB_PATH, (err) => {
// 	if (err) {
// 		console.error(err.message);
// 	}
// 	console.log('Connected to the CCRB database.');
// });

/*
db.each(`SELECT id FROM cops`, (error, row) => {
	let counter = 0;
	db.serialize(() => {
		db.all(`SELECT * FROM complaints WHERE COP = ${row.id}`, (error, rows) => {
			rows.forEach(e => {
				counter += 1;
			})
		db.run(`UPDATE cops SET num_allegations =  '${counter}' WHERE id = '${row.id}'`)
		})
	});
});*/

/*db.all(sql, [], (err, rows) => {
  if (err) {
    throw err;
  }
  rows.forEach((row) => {
    console.log(row.name);
  });
});*/



/*
adapter file
write a function that reads in .csv file and then parse the data and write things to the database
try to figure out insert statements to get the data into the database
check out:
-node sqlite 3 api
-tutorials (node sqlite 3 insert data)

THEN
start writing endpoints that test querying the data, e.g. a '/cop?id=666'
*/

// Endpoints OR routes
// Given this address, how does the program respond to requests?
app.get('/', (req, res) => {
	res.send('Hello World!')
})


app.get('/cops/id=:id', (req, res) => {
	db.get(`SELECT first_name, last_name FROM cops WHERE id=?`, [req.params.id], (err, row)=> {
		if (err) {
			console.log(err.message)
			return err.message
		}
		if (row) {
			let name = (`${row.first_name} ${row.last_name}`);
			res.send(name);
		} else {
			res.send('sorry! all out of cops!')
		}
	})
})




//this subselect query works but takes way too long
/*app.get('/cops', (req, res) => {
	db.all(`SELECT id, (SELECT count(cop) FROM complaints WHERE complaints.cop = cops.id) num_allegations FROM cops`, (err, row) => {
		if (err) {
			console.log(err);
		}
		res.json(row)
	})
})*/

//COPS END POINT
app.get('/cops', async (req, res) => {
	try {
		//db.all(`SELECT cops.*, Count(allegations.complaint) as num_allegations FROM cops INNER JOIN complaints ON cops.id = complaints.cop INNER JOIN allegations ON allegations.complaint = complaints.id GROUP BY cops.id`, (err, row) => {
		const result = await db.all(`
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
		res.json(result)
	} catch(error) {
			console.error(error);
	}
});

//COMMAND_UNITS END POINT
app.get('/command_units', async (req, res) => {
	try {
		const result = await db.all(`
			SELECT 
				command_units.unit_id, 
				Count(*) as num_allegations,
				COUNT(DISTINCT complaints.id) as num_complaints
			FROM 
				command_units 
				INNER JOIN allegations ON command_units.unit_id = allegations.cop_command_unit
					INNER JOIN complaints ON complaints.id = allegations.complaint_id
			GROUP BY 
				command_units.unit_id;
		`)
		res.json(result);
	} catch(error) {
		console.error(error);
	}
});

app.get('/complaints', async (req, res) => {
	try {
		const result = await db.all(`
			SELECT 
				command_units.unit_id, 
				COUNT(DISTINCT complaints.id) as num_complaints
			FROM 
				command_units 
				INNER JOIN allegations ON command_units.unit_id = allegations.cop_command_unit
					INNER JOIN complaints ON complaints.id = allegations.complaint_id
			GROUP BY 
				command_units.unit_id;
		`)
		res.json(result);
	} catch(error) {
		console.error(error);
	}
});

/*app.get('/cop_allegations/id=:id', (req, res) => {
	db.get(`SELECT count(*) FROM complaints WHERE complaints.cop=?`, [req.params.id], (err, row) => {
		res.json(row);
	})
})

/*app.get('/cops', (req, res) => {
	db.all(`SELECT * FROM cops`, (err, row) => { 
		res.json(row)
	})
})*/

app.get('/bye', (req, res) => {
	res.send('Goodbye World!')
})

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})

})()

