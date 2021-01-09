import express from 'express'
import { CsvHelper } from './csvHelper'
import { Models } from './models'
import { Search } from './search'
import { jsonGetter } from './jsonGetter'
import { fileWriter } from './fileWriter'
import { augmentGeoJson } from './scripts/augmentGeoJson'

const csv = 'ccrb_data/data.csv';
const DB_PATH = './db/ccrb.db';
const commandCsv = 'ccrb_data/command_abrevs_cleaned.csv'
const allegationTypesCsv = 'ccrb_data/FADO-Table 1.csv'
const rankAbbrevsCsv = 'ccrb_data/Rank Abbrevs-Table 1.csv'
const nypdGeo = 'map_data/nypd_geo.geojson'
const mapPath = './files/nypd_geo.geojson'

const port = 3001

let db;

const models = new Models(DB_PATH);

(async () => {
	const app = express()
	await models.init();

	const helper = new CsvHelper()

	const commandAbbrevs = await helper.getCommandAbbrevs(commandCsv)

	const rankAbbrevs = await helper.getRankAbbrevs(rankAbbrevsCsv)

	await models.populate(csv, commandCsv, rankAbbrevs, commandAbbrevs);

	const allegationTypes = await helper.getAllegationTypes(allegationTypesCsv)
	
	const search = new Search(models)

	app.get('/', async (req, res) => {
		res.send('hello')
	})

	//END POINTS
	app.get('/search/model=:model', async (req, res) => {
		const model = req.params.model
	
		//Holds value of the query param 'searchquery' 
    const searchQuery = req.query.searchquery;

    if (searchQuery != null) {
    	res.json(await search.searchModel(model, searchQuery))
    }
	})

	app.get('/command_units/orderBy=:orderBy/order=:order/page=:page/pageSize=:pageSize', async (req, res) => {
		res.json(await models.commandUnits.read(req.params.orderBy, req.params.order, req.params.page, req.params.pageSize));
	})

	app.get('/command_units', async (req, res) => {
		res.json(await models.commandUnits.readAll());
	})

	app.get('/precincts', async (req, res) => {
		res.json(await models.precincts.read())
	})

	app.get('/allegations', async (req, res) => {
		res.json(await models.allegations.read());
	})

	app.get('/allegations_substantiated/id=:id', async (req, res) => {
		res.json(await models.allegations.getSubstantiated(req.params.id));
	})

	app.get('/complaints', async(req, res) => {
		res.json(await models.complaints.read())
	})

	app.get('/total_rows/table=:table', async (req, res) => {
		let table = req.params.table
		res.json(await models.[table].total());
	})

	app.get('/cops/orderBy=:orderBy/order=:order/page=:page/pageSize=:pageSize', async (req, res) => {
		res.json(await models.cops.read(req.params.orderBy, req.params.order, req.params.page, req.params.pageSize));
	})

	app.get('/cops/id=:id', async (req, res) => {
		res.json(await models.cops.readOne(req.params.id))
	})

	app.get('/substantiated_percentage/id=:id', async (req, res) => {
		res.json(await models.cops.getSubstantiatedPercentage(req.params.id))
	})

	app.get('/ethnicity_and_gender_percentages', async (req, res) => {
		res.json(await models.cops.getEthnicityAndGenderPercentages())
	})

	app.get('/cop_at_time_of_complaint', async (req, res) => {
		res.json(await models.copAtTimeOfComplaint.read())
	})

	app.get('/cop_complaints/complainant_info/id=:id', async (req, res) => {
		res.json(await models.cops.getComplaintsComplainants(req.params.id))
	})

	app.get('/cop_complaints/locations/id=:id', async (req, res) => {
		res.json(await models.cops.getComplaintsLocations(req.params.id))
	})

	app.get('/cop_complaints/id=:id', async (req, res) => {
		res.json(await models.cops.getComplaints(req.params.id))
	})

	app.get('/cop_complaints/years/id=:id', async (req, res) => {
		res.json(await models.cops.getComplaintsByYear(req.params.id))
	})

	app.get('/command_unit_complaints/years/id=:id', async (req, res) => {
		res.json(await models.commandUnits.getComplaintsByYear(req.params.id))
	})

	//this returns all complaints with their associated allegations
	//nested inside of JSON objects
	app.get('/cop_complaints/allegations/id=:id', async (req, res) => {
		res.json(await models.cops.getComplaints(req.params.id))
	})

	app.get('/command_unit_complaints/allegations/id=:id', async (req, res) => {
		res.json(await models.commandUnits.getComplaints(req.params.id))
	})

	app.get('/cop/id=:id', async (req, res) => {
		res.json(await models.cops.readCop(req.params.id))
	})

	app.get('/copp/id=:id', async (req, res) => {
		res.json(await models.cops.readCopp(req.params.id))
	})

	app.get('/cop_at_time_of_complaint/id=:id', async (req, res) => {
		res.json(await models.cops.readCopAtTimeOfComplaint(req.params.id))
	})

	app.get('/command_unit/id=:id', async (req, res) => {
		res.json(await models.commandUnits.readCommandUnit(req.params.id))
	})

	app.get('/command_unit/id=:id/cops', async (req, res) => {
		res.json(await models.commandUnits.getCops(req.params.id))
	})

	app.get('/complaints/orderBy=:orderBy/order=:order/page=:page/pageSize=:pageSize', async (req, res) => {
		res.json(await models.complaints.read(req.params.orderBy, req.params.order, req.params.page, req.params.pageSize));
	})

	app.get('/complaint/id=:id', async (req, res) => {
		res.json(await models.complaints.readComplaint(req.params.id))
	})

	app.get('/complaint/id=:id/command_units', async (req, res) => {
		res.json(await models.complaints.getCommandUnits(req.params.id))
	})

	app.get('/map', async (req, res) => {
		res.json(await jsonGetter(nypdGeo))
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




