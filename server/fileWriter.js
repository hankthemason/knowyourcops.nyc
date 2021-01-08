import fs from 'fs'

export const fileWriter = async(jsonObject, path) => {
	let data = JSON.stringify(jsonObject, null, 2)

	fs.writeFileSync(path, data, (err) => {
    if (err) throw err;
    console.log('Data written to file');
	});

}