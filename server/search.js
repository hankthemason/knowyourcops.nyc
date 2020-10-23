import { open } from 'sqlite'
import sqlite3 from 'sqlite3'

export class Search {
	constructor(dbPath) {
		this.dbPath = dbPath;
		this.db;
	}

	async init() {
		const db = await open({
			filename: this.dbPath,
			driver: sqlite3.Database
		})
		this.db = db
	}

	async search(searchQuery) {
		
		try {
			const result = await this.db.all(`
				SELECT 
					*
				FROM 
					COPS
				WHERE
					last_name LIKE '%${searchQuery}%'
				OR
					first_name LIKE '%${searchQuery}%'
				`)
			return result
		} catch(error) {
			console.error(error)
		}
	}
}