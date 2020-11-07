const ipfsAPI = require('ipfs-api')
const fs =require('fs')

const ipfs = ipfsAPI({
	host: '127.0.0.1',
	port: 5001,
	protocol: 'http'
});

const ipfs_method = {
    add : async(file) => {
        const readData = await fs.readFileSync(file.path)

        const data = {
            path : `${file.savePath}/${file.name}`,
            content : readData
        }   
    
        const result = await ipfs.add(data)

        await fs.unlink(file.path, (err) => {
            if (err) return console.log(err)
        })	

        return {
            fileName : file.name,
            filePath : result[0].hash
        }
    },
    
    get : async(file) => {
        const chunk = await ipfs.get(file.cid)

        await fs.writeFileSync(file.savePath, chunk[0].content)
    }
}

module.exports = ipfs_method