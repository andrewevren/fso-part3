const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI)
    .then(response => {
        console.log('connected to MongoBD')
    })
    .catch(error => {
        console.log(`error connecting to MongoBD: ${error.message}`)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        required: true
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

module.exports = mongoose.model('Person',personSchema)