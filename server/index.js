import express from 'express'
import { Models } from './models'

const csv = 'data.csv';
const DB_PATH = './db/ccrb.db';

const dbMade = true;

const port = 3001

let db;

const models = new Models(DB_PATH);
(async () => {
	const app = express()
	await models.init();

	if (!dbMade) await models.readCSV(csv);

	app.get('/', async (req, res) => {
		res.send('hello')
	})

	//END POINTS
	app.get('/command_units', async (req, res) => {
		res.json(await models.commandUnits.read());
	})

	app.get('/precincts', async (req, res) => {
		res.json(await models.precincts.read())
	})

	app.get('/allegations', async (req, res) => {
		res.json(await models.allegations.read());
	})

	app.get('/complaints', async(req, res) => {
		res.json(await models.complaints.read())
	})

	app.get('/cops', async (req, res) => {
		res.json(await models.cops.read());
	})

	app.get('/cop_at_time_of_complaint', async (req, res) => {
		res.json(await models.copAtTimeOfComplaint.read())
	})

	app.listen(port, () => {
		console.log(`Example app listening at http://localhost:${port}`)
	})
})();

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
// app.get('/', (req, res) => {
// 	res.send('Hello World!')
// })


// app.get('/cops/id=:id', (req, res) => {
// 	db.get(`SELECT first_name, last_name FROM cops WHERE id=?`, [req.params.id], (err, row)=> {
// 		if (err) {
// 			console.log(err.message)
// 			return err.message
// 		}
// 		if (row) {
// 			let name = (`${row.first_name} ${row.last_name}`);
// 			res.send(name);
// 		} else {
// 			res.send('sorry! all out of cops!')
// 		}
// 	})
// })




//this subselect query works but takes way too long
/*app.get('/cops', (req, res) => {
	db.all(`SELECT id, (SELECT count(cop) FROM complaints WHERE complaints.cop = cops.id) num_allegations FROM cops`, (err, row) => {
		if (err) {
			console.log(err);
		}
		res.json(row)
	})
})*/



//COMMAND_UNITS END POINT
// app.get('/command_units', async (req, res) => {
// 	try {
// 		const result = await db.all(`
// 			SELECT 
// 				command_units.unit_id, 
// 				Count(*) as num_allegations,
// 				COUNT(DISTINCT complaints.id) as num_complaints
// 			FROM 
// 				command_units 
// 				INNER JOIN allegations ON command_units.unit_id = allegations.cop_command_unit
// 					INNER JOIN complaints ON complaints.id = allegations.complaint_id
// 			GROUP BY 
// 				command_units.unit_id;
// 		`)
// 		res.json(result);
// 	} catch(error) {
// 		console.error(error);
// 	}
// });

// app.get('/complaints', async (req, res) => {
// 	try {
// 		const result = await db.all(`
// 			SELECT 
// 				command_units.unit_id, 
// 				COUNT(DISTINCT complaints.id) as num_complaints
// 			FROM 
// 				command_units 
// 				INNER JOIN allegations ON command_units.unit_id = allegations.cop_command_unit
// 					INNER JOIN complaints ON complaints.id = allegations.complaint_id
// 			GROUP BY 
// 				command_units.unit_id;
// 		`)
// 		res.json(result);
// 	} catch(error) {
// 		console.error(error);
// 	}
// });

// /*app.get('/cop_allegations/id=:id', (req, res) => {
// 	db.get(`SELECT count(*) FROM complaints WHERE complaints.cop=?`, [req.params.id], (err, row) => {
// 		res.json(row);
// 	})
// })

// /*app.get('/cops', (req, res) => {
// 	db.all(`SELECT * FROM cops`, (err, row) => { 
// 		res.json(row)
// 	})
// })*/

// app.get('/bye', (req, res) => {
// 	res.send('Goodbye World!')
// })




