const ipfsAPI = require('ipfs-api');
const fs = require('fs')

const ipfs = ipfsAPI({
	host: '127.0.0.1',
	port: 5001,
	protocol: 'http'
});

const main = async () => {
	var readData = await fs.readFileSync('./picture.png')

	const file = {
		path : '/contract/TargetUsername/picture.png',
		content : readData
	}

	var files = await ipfs.add(file)

	fs.unlink('./picture.png', (err) => {
		if (err) return console.log(err)
	})	

	const cid = files[0].hash
	var chunk = await ipfs.get(cid)

	console.log(chunk)

	var filePath = chunk[0].path
	var writeData = chunk[0].content

	await fs.writeFileSync('./restorePicture.png', writeData)

	console.log(`http://localhost:8080/ipfs/${filePath}`)
}

main()
