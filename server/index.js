import express from 'express'
import { CsvHelper } from './csvHelper'
import { Models } from './models'
import { Search } from './search'
import { jsonGetter } from './jsonGetter'
import { fileWriter } from './fileWriter'
import { augmentGeoJson } from './scripts/augmentGeoJson'
//production
const path = require('path')

const csv = 'ccrb_data/data.csv';
const DB_PATH = './db/ccrb.db';
const commandCsv = 'ccrb_data/command_abrevs_cleaned.csv'
const allegationTypesCsv = 'ccrb_data/FADO-Table 1.csv'
const rankAbbrevsCsv = 'ccrb_data/Rank Abbrevs-Table 1.csv'
const nypdGeo = 'map_data/nypd_geo.geojson'
const mapPath = './files/nypd_geo.geojson'

const port = process.env.PORT || 3001
const ip_address = process.env.HOST || '127.0.0.1'
console.log(port)
console.log(ip_address)

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
	app.get('/api/search', async (req, res) => {
		const model = req.query.model
    const searchQuery = req.query.searchquery;
    
    if (searchQuery != null) {
    	res.json(await search.searchModel(model, searchQuery))
    }
	})

	app.get('/api/total_rows', async (req, res) => {
		let table = req.query.table
		let regex = /^[A-Za-z_]+$/
		if (!table.match(regex)) {
			res.send('error')
		}
		res.json(await models.[table].total());
	})

	app.get('/api/cops', async (req, res) => {
		res.json(await models.cops.read(
				req.query.orderBy,
				req.query.order,
				req.query.page,
				req.query.pageSize));
	})

	app.get('/api/cop', async (req, res) => {
		res.json(await models.cops.readCop(req.query.id))
	})

	app.get('/api/cop/yearly_stats', async(req, res) => {
		res.json(await models.cops.getYearlyStats(
			req.query.column, 
			req.query.id))
	})

	app.get('/api/cop/location_stats', async (req, res) => {
		res.json(await models.cops.getLocationStats(
			req.query.column, 
			req.query.id))
	})

	app.get('/api/cop/getSubstantiated', async (req, res) => {
		res.json(await models.cops.getSubstantiatedPercentage( 
			req.query.id))
	})



	//this returns all complaints with their associated allegations
	//nested inside of JSON objects
	app.get('/api/cop_complaints/allegations', async (req, res) => {
		res.json(await models.cops.getComplaints(req.query.id))
	})

	app.get('/api/command_units', async (req, res) => {
		res.json(await models.commandUnits.read(
			req.query.orderBy, 
			req.query.order, 
			req.query.page, 
			req.query.pageSize));
	})

	app.get('/api/command_unit', async (req, res) => {
		res.json(await models.commandUnits.readCommandUnit(req.query.id))
	})

	//used by map component
	app.get('/api/command_units_with_precincts', async (req, res) => {
		res.json(await models.commandUnits.commandUnitsWithPrecincts());
	})

	app.get('/api/command_unit/yearly_stats', async(req, res) => {
		res.json(await models.commandUnits.getYearlyStats(
			req.query.column, 
			req.query.id))
	})

	app.get('/api/command_unit_complaints/allegations', async (req, res) => {
		res.json(await models.commandUnits.getComplaints(req.query.id))
	})

	app.get('/api/command_unit/cops', async (req, res) => {
		res.json(await models.commandUnits.getCops(req.query.id))
	})

	//this is to get all the cops associated with a command unit that has now complaints directly associated with it
	app.get('/api/command_unit/complaints=0', async (req, res) => {
		res.json(await models.commandUnits.getCopsForCommandUnitWithoutComplaints(req.query.id))
	})

	app.get('/api/command_unit/complaints=0/cops', async (req, res) => {
		res.json(await models.commandUnits.getCopsForCommandUnitWithoutComplaints(req.query.id))
	})

	app.get('/api/complaints', async (req, res) => {
		res.json(await models.complaints.read(
			req.query.orderBy, 
			req.query.order, 
			req.query.page, 
			req.query.pageSize));
	})

	app.get('/api/complaint', async (req, res) => {
		res.json(await models.complaints.readComplaint(req.query.id))
	})

	app.get('/api/complaint/command_units', async (req, res) => {
		res.json(await models.complaints.getCommandUnits(req.query.id))
	})

	app.get('/api/map', async (req, res) => {
		res.json(await jsonGetter(nypdGeo))
	})

	app.listen(port, ip_address, () => {
		console.log(`Example app listening at http://${ip_address}:${port}`)
	})
})();





