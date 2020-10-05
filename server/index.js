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

	//COPS END POINT
	app.get('/cops', async (req, res) => {
		res.json(await models.cops.read());
	})

	//PRECINCTS END POINT
	app.get('/precincts', async (req, res) => {
		res.json(await models.precincts.read());
	})

	//COMMAND_UNITS END POINT
	app.get('/command_units', async (req, res) => {
		res.json(await models.command_units.read());
	})

	app.listen(port, () => {
		console.log(`Example app listening at http://localhost:${port}`)
	})
})();

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


// app.get('/bye', (req, res) => {
// 	res.send('Goodbye World!')
// })




