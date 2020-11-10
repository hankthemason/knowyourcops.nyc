export class Search {
	constructor(models) {
		this.models = models
	}

	async searchModel(model, searchQuery) {
		try {
			const results = 
				await this.models.[model].search(searchQuery)	
			return results
		} catch(error) {
			console.error(error)
		}
	}

	async searchAll(searchQuery) {
		try {
			return {
				cops: await this.models.cops.search(searchQuery)
				//commandUnits: await this.models.commandUnits.search(searchQuery)
			}
			
		} catch(error) {
			console.error(error)
		}
	}
}