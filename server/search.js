export class Search {
	constructor(models) {
		this.models = models
	}

	async search(searchQuery) {
		try {
			return {
				cops: await this.models.cops.search(searchQuery),
				commandUnits: await this.models.commandUnits.search(searchQuery)
			}
			
		} catch(error) {
			console.error(error)
		}
	}
}