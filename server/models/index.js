import { open } from 'sqlite'
import sqlite3 from 'sqlite3'
import fs from 'fs'
import neatCsv from 'neat-csv'
import { Precincts } from './precincts'
import { Cops } from './cops'
import { Complaints } from './complaints'
import { CommandUnits } from './command_units'
import { Allegations } from './allegations'
import { CopAtTimeOfComplaint } from './cop_at_time_of_complaint'
import { keys } from 'lodash';

export class Models {
	constructor(dbPath) {
		this.dbPath = dbPath;
	}

	async init() {
		// open the database
		const db = await open({
	  	filename: this.dbPath,
	  	driver: sqlite3.Database
		})

		this.precincts = new Precincts(db);
		this.cops = new Cops(db);
		this.complaints = new Complaints(db);
		this.commandUnits = new CommandUnits(db);
		this.allegations = new Allegations(db);
		this.copAtTimeOfComplaint = new CopAtTimeOfComplaint(db);

		await this.precincts.init();
		await this.cops.init();
		await this.complaints.init();
		await this.commandUnits.init();
		await this.allegations.init();
		await this.copAtTimeOfComplaint.init();

	}

	async isDbPopulated() {
		return keys(await this.cops.readAll()).length > 0 ? true : false
	}

	async populate(csvPath, commandAbbrevCsvPath) {
		if(await this.isDbPopulated()) return

		console.log('db being populated...')

		await this.populateFromCsv(csvPath);
		await this.cops.augment(commandAbbrevCsvPath);

		console.log('db finished populating')
	}

	async populateFromCsv(csvPath) {
		const csv = fs.readFileSync(csvPath);
		const results = await neatCsv(csv);
		for (const result of results) {
			await	this.precincts.create(result)
			await	this.cops.create(result)
			await	this.complaints.create(result)
			await	this.commandUnits.create(result)
			await	this.allegations.create(result)
			await	this.copAtTimeOfComplaint.create(result)
		}
	}
}