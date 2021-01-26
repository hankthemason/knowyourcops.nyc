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
    let searchQuery = req.query.searchquery;
    
    if (searchQuery != null) {
    	res.json(await search.searchModel(model, searchQuery))
    }
	})

	app.get('/command_units/orderBy=:orderBy/order=:order/page=:page/pageSize=:pageSize', async (req, res) => {
		res.json(await models.commandUnits.read(req.params.orderBy, req.params.order, req.params.page, req.params.pageSize));
	})

	//right now the only components using this point are the map components
	app.get('/command_units', async (req, res) => {
		res.json(await models.commandUnits.readAll());
	})

	app.get('/command_units_with_precincts', async (req, res) => {
		res.json(await models.commandUnits.commandUnitsWithPrecincts());
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

	app.get('/substantiated_percentage/id=:id', async (req, res) => {
		res.json(await models.cops.getSubstantiatedPercentage(req.params.id))
	})

	app.get('/cop_at_time_of_complaint', async (req, res) => {
		res.json(await models.copAtTimeOfComplaint.read())
	})

	app.get('/cop_complaints/id=:id', async (req, res) => {
		res.json(await models.cops.getComplaints(req.params.id))
	})

	app.get('/cop/yearly_stats/table=:table/id=:id', async(req, res) => {
		res.json(await models.cops.getYearlyStats(req.params.table, req.params.id))
	})

	app.get('/cop/locations_stats/table=:table/id=:id', async (req, res) => {
		res.json(await models.cops.getLocationStats(req.params.table, req.params.id))
	})

	app.get('/cop_allegations/years/id=:id', async (req, res) => {
		res.json(await models.cops.getAllegationsByYear(req.params.id))
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

	app.get('/cop_at_time_of_complaint/id=:id', async (req, res) => {
		res.json(await models.cops.readCopAtTimeOfComplaint(req.params.id))
	})

	app.get('/command_unit/id=:id', async (req, res) => {
		res.json(await models.commandUnits.readCommandUnit(req.params.id))
	})

	app.get('/command_unit/id=:id/cops', async (req, res) => {
		res.json(await models.commandUnits.getCops(req.params.id))
	})

	//this is to get all the cops associated with a command unit that has now complaints directly associated with it
	app.get('/command_unit/complaints=0/id=:id/cops', async (req, res) => {
		res.json(await models.commandUnits.getCopsForCommandUnitWithoutComplaints(req.params.id))
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





