const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI)
    .then(response => {
        console.log('connected to MongoBD')
    })
    .catch(error => {
        console.log(`error connecting to MongoBD: ${error.message}`)
    })

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

module.exports = mongoose.model('Person',personSchema)